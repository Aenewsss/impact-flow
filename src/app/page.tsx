'use client'
import { CustomNode } from "@/components/CustomNode";
import Modal from "@/components/Modal";
import { realtimeDb } from "@/config/firebase";
import impactService from "@/services/impact.service";
import { showToast } from "@/utils/show-toast.util";
import { onValue, ref, remove, set } from "firebase/database";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Controls, addEdge, useNodesState, useEdgesState, Node, MarkerType, useReactFlow, } from "reactflow";
import "reactflow/dist/style.css";

const nodeTypes = { custom: CustomNode };

export default function FlowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const reactFlowInstance = useReactFlow(); // Hook para pegar as dimensões da tela

  useEffect(() => {
    const nodesRef = ref(realtimeDb, "flows");
    const edgesRef = ref(realtimeDb, "connections");

    // Escuta atualizações nos nodes
    onValue(nodesRef, (snapshot) => {
      if (snapshot.exists()) {
        const nodesData = Object.values(snapshot.val()).map((node: any) => ({
          ...node,
          position: node.position || { x: 0, y: 0 }, // 🔥 Evita valores undefined
        }));
        setNodes(nodesData);
      }
    });

    // Escuta atualizações nas conexões
    onValue(edgesRef, (snapshot) => {
      if (snapshot.exists()) {
        const edgesData = Object.values(snapshot.val()).map((edge: any) => ({
          ...edge,
          source: edge.source || "",
          target: edge.target || "",
        }));
        setEdges(edgesData);
      }
    });
  }, []);

  const onConnect = useCallback(
    async (params) => {
      setEdges((eds) => addEdge(params, eds))
      const connectionRef = ref(realtimeDb, `connections/${params.source}-${params.target}`);
      try {
        await set(connectionRef, {
          ...params
        });
      } catch (error) {
        console.error("Erro ao criar conexão:", error);
      }
    },
    [setEdges]
  );

  const onNodeClick = (event, node: Node) => {
    const edgesImpacted = edges.filter(edge => edge.source == node.id)

    const nodesImpacted = edgesImpacted.map(ed => nodes.find(node => node.id == ed.target))

    setSelectedNode(node.id);
    if (nodesImpacted.length == 0) return showToast('Nenhum fluxo conectado')

    setShowImpactModal(true)
  };

  const onNodeChange = (id, label) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { label } } : n))
    );
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
      setShowImpactModal(false);
    }
  }

  function clearImpact() {
    setNodes(nodes)
  }

  // 📌 Atualiza a posição do node ao mover
  const onNodeDragStop = (event, node) => {
    impactService.updateFlow(node);
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

    console.log(newNode)
    
    setNodes((prevNodes) => [...prevNodes, newNode]);
    impactService.updateFlow(newNode);
  };

  const onEdgeDelete = async (edge) => {
    const connectionRef = ref(realtimeDb, `connections/${edge.source}-${edge.target}`);
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
        nodes={nodes}
        edges={edges}
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

      <Modal title="Deseja visualizar o impacto?" isOpen={showImpactModal} onConfirm={viewImpact} onClose={() => setShowImpactModal(false)} />

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
          className="text-black"
        >
          <label>Editar Nome:</label>
          <input
            className="ms-2 outline-none font-semibold"
            type="text"
            value={nodes.find((n) => n.id === selectedNode)?.data?.label || ""}
            onChange={(e) => onNodeChange(selectedNode, e.target.value)}
          />
        </div>
      )}

      {
        nodes.some(node => JSON.stringify(node.style)?.includes('2px solid red')) &&
        <button onClick={clearImpact} className="p-2 rounded bg-red-500 absolute top-4 right-4">Limpar</button>
      }
    </div>
  );
}
