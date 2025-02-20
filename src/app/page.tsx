'use client'
import { CustomNode } from "@/components/CustomNode";
import Modal from "@/components/Modal";
import { auth, realtimeDb } from "@/config/firebase";
import impactService from "@/services/impact.service";
import { showToast } from "@/utils/show-toast.util";
import { get, onValue, ref, remove, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Controls, addEdge, useNodesState, useEdgesState, Node, MarkerType, useReactFlow, } from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = { custom: CustomNode };

export default function FlowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [userUID, setUserUID] = useState<string | null>(null); // Estado para armazenar e-mail do usuário
  const [showEmptyEdges, setShowEmptyEdges] = useState(false);

  const reactFlowInstance = useReactFlow(); // Hook para pegar as dimensões da tela

  useEffect(() => {
    // Obter o usuário autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setUserUID(user.email.replace(/\./g, "_")); // Firebase não permite '.' nos IDs
      } else {
        setUserUID(null);
      }
    });

    return () => unsubscribe(); // Remove listener ao desmontar componente
  }, []);

  useEffect(() => {
    if (!userUID) return;

    const nodesRef = ref(realtimeDb, `flows/${userUID}`);
    const edgesRef = ref(realtimeDb, `connections/${userUID}`);

    const unsubscribeNodes = onValue(nodesRef, (snapshot) => {
      if (snapshot.exists()) {
        const nodesData = Object.values(snapshot.val()).map((node: any) => ({
          ...node,
          position: node.position || { x: 0, y: 0 },
        }));
        setNodes(nodesData);
      }
    });

    const unsubscribeEdges = onValue(edgesRef, (snapshot) => {
      if (snapshot.exists()) {
        const edgesData = Object.values(snapshot.val()).map((edge: any) => ({
          ...edge,
          source: edge.source || "",
          target: edge.target || "",
        }));
        setEdges(edgesData);
      }
    });

    return () => {
      unsubscribeNodes();
      unsubscribeEdges();
    };
  }, [userUID]);

  const onConnect = useCallback(
    async (params) => {
      if (!userUID) return;

      setEdges((eds) => addEdge(params, eds))
      const connectionRef = ref(realtimeDb, `connections/${userUID}/${params.source}-${params.target}`);
      try {
        await set(connectionRef, {
          ...params
        });
      } catch (error) {
        console.error("Erro ao criar conexão:", error);
      }
    },
    [setEdges, userUID]
  );

  const onNodeClick = (event: any, node: Node) => {
    const edgesImpacted = edges.filter(edge => edge.source == node.id)

    const nodesImpacted = edgesImpacted.map(ed => nodes.find(node => node.id == ed.target))

    setSelectedNode(node.id);
    if (nodesImpacted.length == 0) return setShowEmptyEdges(true)

    setShowEmptyEdges(false)
  };

  const onNodeChange = (id, label) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data: { label } } : n)));

    setTimeout(() => {
      // Encontra o nó atualizado na lista de nodes
      const updatedNode = nodes.find((n) => n.id === id);
      if (!updatedNode) return;

      // Mantém todas as propriedades do nó e só altera o label
      const nodeRef = ref(realtimeDb, `flows/${userUID}/${id}`);
      set(nodeRef, { ...updatedNode, data: { ...updatedNode.data, label } }) // Mantém os dados existentes
        .catch((error) => console.error("Erro ao salvar nome do fluxo:", error));

      console.log("Nome do fluxo atualizado no banco:", label);
    }, 1000);
  };

  function viewImpact(event, nodeId, nodesImpacted = new Set()) {
    // Se for a primeira chamada, começamos com o nó selecionado
    if (!nodeId) nodeId = selectedNode;

    // Encontra todas as conexões de saída a partir do nó atual
    const edgesImpacted = edges.filter(edge => edge.source === nodeId);

    // Encontra os nós impactados por essas conexões
    const newNodes = edgesImpacted
      .map(edge => nodes.find(node => node.id === edge.target))
      .filter(node => node && !nodesImpacted.has(node.id)); // Evita loops infinitos

    // Adiciona os novos nós impactados ao conjunto
    newNodes.forEach(node => nodesImpacted.add(node.id));

    // Se ainda há nós a processar, continua a recursão
    newNodes.forEach(node => viewImpact(null, node.id, nodesImpacted));

    // Se for a última iteração, atualiza o estado
    if (nodeId === selectedNode) {
      const nodesImpactedArray = Array.from(nodesImpacted).map(nodeId => ({
        ...nodes.find(n => n.id === nodeId),
        style: { border: "2px solid red" },
      }));

      const nodesNoImpacted = nodes.filter(node => !nodesImpacted.has(node.id));

      setNodes([...nodesNoImpacted, ...nodesImpactedArray]);
    }
  }

  function clearImpact() {
    setNodes(nodes)
  }

  // 📌 Atualiza a posição do node ao mover
  const onNodeDragStop = (event, node) => {
    impactService.updateFlow(node, userUID);
  };

  // 📌 Função para criar um novo node no centro da tela
  const createNewNode = () => {
    if (!reactFlowInstance) return;

    const viewport = reactFlowInstance.getViewport();
    if (!viewport) return; // 🔥 Evita erro se `getViewport()` retornar `undefined`

    const { x, y, zoom } = viewport;
    const centerX = (window.innerWidth / 2 - x) / zoom;
    const centerY = (window.innerHeight / 2 - y) / zoom;

    const newNode = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position: { x: centerX, y: centerY },
      data: { label: `Novo fluxo ${nodes.length + 1}` },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    impactService.updateFlow(newNode, userUID);
  };

  const onEdgeDelete = async (edge) => {
    const connectionRef = ref(realtimeDb, `connections/${userUID}/${edge.source}-${edge.target}`);
    try {
      await remove(connectionRef);
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    } catch (error) {
      console.error("Erro ao remover conexão:", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button
        onClick={createNewNode}
        className="px-4 py-2 bg-blue-500 text-white rounded absolute top-4 left-4 z-10"
      >
        Criar Novo Node
      </button>

      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        fitView
        className="bg-zinc-900"
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, strokeWidth: 4 }
        }}
        nodeTypes={nodeTypes}
      >
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            background: "white",
            padding: 10,
            borderRadius: 5,
          }}
          className="text-black flex flex-col gap-5"
        >
          <div className="flex gap-2">
            <label>Editar Nome:</label>
            <input
              className="ms-2 outline-none font-semibold"
              type="text"
              value={nodes.find((n) => n.id === selectedNode)?.data?.label || ""}
              onChange={(e) => onNodeChange(selectedNode, e.target.value)}

            />
          </div>
          <button disabled={showEmptyEdges} style={{ background: showEmptyEdges && 'gray' }} onClick={() => viewImpact(null, null, null)} className="px-4 py-2 bg-blue-500 text-white rounded top-4 left-4 z-10">
            {showEmptyEdges ? 'Nenhum fluxo conectado' : 'Visualizar impacto'}
          </button>
        </div>
      )}

      {
        nodes.some(node => JSON.stringify(node.style)?.includes('2px solid red')) &&
        <button onClick={clearImpact} className="p-2 rounded bg-red-500 absolute top-4 right-4">Limpar</button>
      }
    </div>
  );
}
