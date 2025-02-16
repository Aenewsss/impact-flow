import React from "react";
import { Handle, Position } from "reactflow";

export const CustomNode = ({ data }) => {
  return (
    <div className="bg-white p-2 rounded shadow text-black w-52 text-center">
      <p>{data.label}</p>

      {/* Handle de Entrada (Esquerda) */}
      <Handle
        id="target-left"
        type="target"
        position={Position.Left}
        style={{
          width: 6, // Reduz tamanho da bolinha
          height: 6,

          borderRadius: "50%", // Mantém formato redondo
        }}
      />
      <Handle
        id="source-left"
        type="source"
        position={Position.Left}
        style={{
          width: 6, // Reduz tamanho da bolinha
          height: 6,

          borderRadius: "50%", // Mantém formato redondo
        }}
      />

      {/* Handle de Saída (Direita) */}
      <Handle
        id="target-right"
        type="target"
        position={Position.Right}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
      />
      <Handle
        id="source-right"
        type="source"
        position={Position.Right}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
      />

      <Handle
        id="target-top"
        type="target"
        position={Position.Top}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
      />

      <Handle
        id="source-top"
        type="source"
        position={Position.Top}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
      />
      <Handle
        id="target-bottom"
        type="target"
        position={Position.Bottom}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
      />
      <Handle
        id="source-bottom"
        type="source"
        position={Position.Bottom}
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
        }}
      />
    </div>
  );
};