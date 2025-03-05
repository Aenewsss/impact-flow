import impactService from "@/services/impact.service";
import { Edge, Node, NodeChange } from "reactflow";
import { create } from "zustand";

interface Store {
    nodes: Node<any, string>[];
    edges: Edge<any>[];
    selectedNode: string | null;
    ghostNode: any;
    userUID: string | null;
    setEdges: (edges: any) => void;
    setNodes: (nodes: any) => void;
    setSelectedNode: (nodeId: string | null) => void;
    setGhostNode: (ghostNode: any) => void;
    addNode: (node: any, userUID: string) => void;
    addEdge: (edge: any, userUID: string) => void;
    setUserUID: (userId: string) => void;
    updateNodePosition: (changes: any[]) => void;
}

export const useNodesStore = create<Store>((set) => ({
    nodes: [],
    edges: [],
    selectedNode: null,
    ghostNode: null,
    userUID: null,
    setEdges: (edges) => set({ edges }),
    setNodes: (nodes) => set({ nodes }),
    setSelectedNode: (nodeId) => set({ selectedNode: nodeId }),
    setGhostNode: (ghostNode) => set({ ghostNode }),
    setUserUID: (userUID) => set({ userUID }),
    addNode: (node, userUID) => {
        set(state => ({ nodes: [...state.nodes, node] }))
        impactService.updateFlow(node, userUID);
    },
    addEdge: (edge, userUID) => {
        set(state => ({ edges: [...state.edges, edge] }))
        impactService.registerConnection(edge, userUID);
    },
    updateNodePosition: (changes) => {
        set((state) => ({
            nodes: state.nodes.map((node) => {
                const change = changes.find((c) => c.id === node.id);

                if (change) {
                    return {
                        ...node,
                        position: change.position || node.position, // 🔥 Atualiza a posição (se houver)
                        selected: change.selected ?? node.selected, // 🔥 Mantém a seleção
                    };
                }

                return node;
            }),
        }));
    },
}));