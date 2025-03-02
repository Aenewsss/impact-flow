import { create } from "zustand";

interface EdgeStore {
    edges: any[];
    setEdges: (edges: any[]) => void;
}

export const useEdgesStore = create<EdgeStore>((set) => ({
    edges: [],
    setEdges: (edges) => set({ edges }),
}));