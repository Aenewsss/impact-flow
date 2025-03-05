import { useNodesStore } from "@/store/nodes.store";
import { ref, set } from "firebase/database";
import { realtimeDb } from "@/config/firebase";
import { useState } from "react";
import { TextareaAutosize } from "@mui/material"; // Campo de texto expandível
import { SpeakerNotesOutlined } from "@mui/icons-material";

export const AnnotationNode = ({ data, id }) => {
    const { userUID, nodes, setNodes } = useNodesStore(store => store);
    const nodeRef = ref(realtimeDb, `annotations/${userUID}/${id}`); // Caminho separado para anotações
    const [text, setText] = useState(data.text);

    // Atualiza o texto e sincroniza com Firebase e Zustand
    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);
        setNodes(nodes.map(node => node.id === id ? { ...node, data: { ...node.data, text: newText } } : node));

        // 🔥 Atualiza no Firebase
        set(nodeRef, { ...nodes.find(n => n.id === id), data: { ...data, text: newText } });
    };

    return (
        <div id={id} className="p-3 bg-yellow-300 rounded shadow-lg border-2 border-yellow-500 relative" style={{ width: "200px", minHeight: "100px" }}>

            {/* Campo de Anotação Editável */}
            <TextareaAutosize
                placeholder="Escreva uma anotação"
                className="w-full bg-transparent outline-none resize-none text-black text-sm"
                value={text}
                onChange={handleTextChange}
                minRows={3}
            />

            {/* Estilização para mostrar quando o nó está selecionado */}
            <div className="absolute -top-4 right-2 bg-yellow-600 text-white px-2 py-1 text-xs rounded shadow">
                <SpeakerNotesOutlined style={{width: 16}} />
            </div>
        </div>
    );
};