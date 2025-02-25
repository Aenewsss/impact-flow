'use client'
import { CustomNode } from "@/components/CustomNode";
import Modal from "@/components/Modal";
import { auth, realtimeDb } from "@/config/firebase";
import impactService from "@/services/impact.service";
import { showToast } from "@/utils/show-toast.util";
import { get, onValue, ref, remove, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, { Controls, addEdge, useNodesState, useEdgesState, Node, MarkerType, useReactFlow, SelectionMode, MiniMap, } from "reactflow";
import "reactflow/dist/style.css";
import { useRouter } from "next/navigation";
import userService from "@/services/user.service";
import { PlanEnum } from "@/enum/plan.enum";
import PricingModal from "@/components/PricingModal";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import { v4 as uuidv4 } from "uuid"; // 📌 Importar biblioteca para gerar IDs únicos
import CustomGroup from "@/components/GroupNode";

const nodeTypes = {
  custom: CustomNode,
  group: CustomGroup
};

export default function FlowApp() {
  const router = useRouter()

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [userUID, setUserUID] = useState<string | null>(null); // Estado para armazenar e-mail do usuário
  const [showEmptyEdges, setShowEmptyEdges] = useState(false);
  const [showModalSubscription, setShowModalSubscription] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAITextarea, setShowAITextarea] = useState(false);

  const reactFlowInstance = useReactFlow(); // Hook para pegar as dimensões da tela

  useEffect(() => {
    // Obter o usuário autenticado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserUID(user.uid)
      } else {
        router.push('/login')
        // setUserUID(null);
      }
    });

    return () => unsubscribe(); // Remove listener ao desmontar componente
  }, []);

  useEffect(() => {
    if (!userUID) return;

    fetchNodes()
  }, [userUID]);


  const handleNodesChange = (changes) => {
    onNodesChange(changes); // 🔥 Mantém o comportamento original do React Flow

    setNodes(prevNodes =>
      prevNodes.map(node => {
        // 🔥 Verifica se o node está selecionado atualmente ou foi alterado pelo evento
        const isSelected = changes.some(change => change.id === node.id ? change.selected ?? node.selected : node.selected);

        return {
          ...node,
          selected: isSelected, // 🔥 Mantém a seleção ao adicionar novos nodes
          style: {
            ...node.style,
            border: isSelected ? "3px solid #3C153F" : (node.style?.border as string)?.includes('solid red') ? node.style.border : "none", 
            borderRadius: isSelected ? "8px" : "0px",
          }
        };
      })
    );
  };

  async function generateFlow() {
    if (!prompt.trim()) {
      showToast("Digite um prompt!", "warning");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          temperature: 0.6,
          max_completion_tokens: 4096,
          top_p: 0.95,
          stream: false,
          stop: null,
          messages: [
            {
              role: "system",
              content: `Você é um assistente especializado em modelar fluxos de processos de software. 
                        Um fluxo representa uma ação ou processo, e suas dependências representam conexões entre essas ações.
  
                        - Retorne **apenas** um JSON no seguinte formato:
                        {
                          "nodes": [
                            { "id": "1", "data": { "label": "Criar Usuário" }, "position": { "x": 50, "y": 100 } },
                            { "id": "2", "data": { "label": "Enviar E-mail de Boas-Vindas" }, "position": { "x": 50, "y": 300 } }
                          ],
                          "edges": [
                            { "id": "e1-2", "source": "1", "target": "2" }
                          ]
                        }
  
                        - Não inclua explicações, raciocínio ou qualquer outro texto antes ou depois do JSON.
                        - Certifique-se de que os IDs dos nós e conexões sejam únicos e que a estrutura JSON seja válida.`
            },
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data?.choices?.[0]?.message?.content || "";

      // 🔥 Filtrando apenas o JSON da resposta
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1]; // Pegamos apenas o JSON
      }

      try {
        const generatedData = JSON.parse(responseText);

        const idMap = new Map(); // Mapeia os IDs antigos para os novos
        const uniqueNodes = generatedData.nodes.map(node => {
          const newId = uuidv4();
          idMap.set(node.id, newId); // Mapeia o ID antigo para o novo
          return { ...node, id: newId };
        });

        const uniqueEdges = generatedData.edges
          .map(edge => {
            const newSource = idMap.get(edge.source);
            const newTarget = idMap.get(edge.target);

            if (!newSource || !newTarget) {
              console.warn(`⚠️ Edge ignorado: ${edge.source} -> ${edge.target} (nó não encontrado)`);
              return null;
            }

            return {
              id: `${newSource}-${newTarget}`,
              source: newSource,
              target: newTarget,
            };
          })
          .filter(Boolean);

        setNodes(prevNodes => [...prevNodes, ...uniqueNodes]);
        setEdges(prevEdges => [...prevEdges, ...uniqueEdges]);

        showToast("Fluxo gerado com sucesso!", "success");

        // 🔥 SALVANDO NO FIREBASE COM OS IDs CORRETOS 🔥
        const nodesRef = ref(realtimeDb, `flows/${userUID}`);
        const edgesRef = ref(realtimeDb, `connections/${userUID}`);

        const nodesSnapshot = await get(nodesRef);
        const edgesSnapshot = await get(edgesRef);

        const existingNodes: any = nodesSnapshot.exists() ? nodesSnapshot.val() : {};
        const existingEdges: any = edgesSnapshot.exists() ? edgesSnapshot.val() : {};

        // 📌 Adiciona cada nó diretamente no Firebase com seu ID único
        for (const node of uniqueNodes) {
          const nodeRef = ref(realtimeDb, `flows/${userUID}/${node.id}`);
          await set(nodeRef, node);
        }

        // 📌 Adiciona cada conexão diretamente no Firebase
        for (const edge of uniqueEdges) {
          const connectionRef = ref(realtimeDb, `connections/${userUID}/${edge.source}-${edge.target}`);
          await set(connectionRef, edge);
        }

      } catch (jsonError) {
        console.error("❌ Erro ao processar JSON:", jsonError);
        showToast("Erro ao interpretar resposta da IA.", "error");
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Erro ao gerar fluxo:", error);
      showToast("Erro ao processar IA", "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchNodes() {
    const nodesRef = ref(realtimeDb, `flows/${userUID}`);
    const edgesRef = ref(realtimeDb, `connections/${userUID}`);

    const nodesSnapshot = await get(nodesRef)
    if (nodesSnapshot.exists()) {
      const nodesData = Object.values(nodesSnapshot.val()).map((node: any) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
      }));
      console.log(nodesData)
      setNodes(nodesData);
    }


    const edgesSnapshot = await get(edgesRef)
    if (edgesSnapshot.exists()) {
      const edgesData = Object.values(edgesSnapshot.val()).map((node: any) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
      }));
      setEdges(edgesData);
    }
  }

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

    setSelectedNode(node.id);

    const nodesImpacted = edgesImpacted.map(ed => nodes.find(node => node.id == ed.target))
    setShowEmptyEdges(nodesImpacted.length == 0)
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
    fetchNodes()
    setSelectedNode('')
  }

  const onNodeDragStop = (event, node) => {

    impactService.updateFlow(node, userUID);
  };

  // 📌 Função para criar um novo node no centro da tela
  const createNewNode = async () => {

    if (await userService.getUserPlan(userUID) == PlanEnum.FREE && nodes.length == 10) {
      showToast("Você atingiu o limite do plano gratuito", 'warning');
      return setShowModalSubscription(true)
    }

    if (!reactFlowInstance) return;

    const viewport = reactFlowInstance.getViewport();
    if (!viewport) return; // 🔥 Evita erro se `getViewport()` retornar `undefined`

    const { x, y, zoom } = viewport;
    const centerX = (window.innerWidth / 2 - x) / zoom;
    const centerY = (window.innerHeight / 2 - y) / zoom;

    const newNode = {
      id: uuidv4(),
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

  const onNodeDelete = async (node) => {
    impactService.removeFlow(userUID, node[0].id)
    setSelectedNode('')
  }


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodeDelete}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={() => {
          setSelectedNode('');
          setShowAITextarea(false)
        }}
        fitView
        className="bg-zinc-900"
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, strokeWidth: 4 }
        }}
        nodeTypes={nodeTypes}
        selectionMode={SelectionMode.Partial}
        multiSelectionKeyCode="Shift" // 🔥 Usa Shift para seleção múltipla
        nodesDraggable
        nodesConnectable
        snapToGrid // 🔥 Mantém alinhado os nodes ao arrastar
      >
        <Controls />
        <MiniMap />
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
          <button disabled={showEmptyEdges} style={{ background: showEmptyEdges && 'gray' }} onClick={() => viewImpact(null, null)} className="px-4 py-2 bg-blue-500 text-white rounded top-4 left-4 z-10">
            {showEmptyEdges ? 'Nenhum fluxo conectado' : 'Visualizar impacto'}
          </button>
        </div>
      )}

      {
        nodes.some(node => JSON.stringify(node.style)?.includes('2px solid red')) &&
        <button onClick={clearImpact} className="p-2 rounded bg-red-500 absolute top-4 right-4">Limpar</button>
      }

      {showModalSubscription && <PricingModal userUID={userUID} onClose={() => setShowModalSubscription(false)} />}

      {showAITextarea &&
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 items-center">
          <textarea
            placeholder="Descreva seu fluxo..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="px-4 py-2 border rounded w-96 text-black"
          />
          <button onClick={generateFlow} className="px-4 py-2 bg-[#3C153F] h-16 text-white rounded transition-all hover:scale-105">
            {loading ? "Gerando..." : "Gerar Fluxo"}
          </button>
        </div>
      }

      <div className="absolute right-4 top-1/4 flex flex-col gap-4 bg-zinc-900 p-4 rounded-lg shadow-lg">
        {/* Criar Novo Node */}
        <button
          onClick={createNewNode}
          className="p-3 rounded-full transition-all hover:scale-110 bg-[#3C153F] text-white shadow-lg shadow-[#3C153F] flex items-center justify-center"
          title="Criar Novo Node"
        >
          <CreateNewFolderOutlinedIcon />
        </button>

        {/* Criar Novo Grupo */}
        {/* <button
          onClick={createNewGroup}
          className="p-3 rounded-full transition-all hover:scale-110 bg-purple-600 text-white shadow-lg flex items-center justify-center"
          title="Criar Novo Grupo"
        >
          <FolderSpecialOutlinedIcon />
        </button> */}

        {/* Abrir Textarea para IA */}
        <button
          onClick={() => setShowAITextarea(!showAITextarea)}
          className="p-3 rounded-full transition-all hover:scale-110 bg-blue-600 text-white shadow-lg flex items-center justify-center"
          title="Abrir IA"
        >
          <AutoAwesomeOutlinedIcon />
        </button>
      </div>
    </div>
  );
}
