import { memo } from "react";
import { Handle, Position, NodeResizeControl, NodeResizer } from "reactflow"; // ✅ Importação correta

const GroupNode = ({ data }) => {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} />
      <Handle type="target" position={Position.Left} />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

// const GroupNode = ({ data, id }) => {
//   return (
//     <ResizableNode
//       id={id} // 📌 Para manter referência ao nó certo
//       minWidth={150} // 📌 Largura mínima
//       minHeight={100} // 📌 Altura mínima
//       style={{
//         width: data.width || 200,
//         height: data.height || 150,
//         backgroundColor: "rgba(100, 100, 100, 0.2)",
//         border: "2px dashed gray",
//         position: "relative",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         cursor: "grab",
//       }}
//     >
//       {/* 🔥 Ícone de Resize */}
//       <NodeResizeControl
//         style={{
//           background: "transparent",
//           border: "none",
//           cursor: "nwse-resize",
//           position: "absolute",
//           right: 5,
//           bottom: 5,
//         }}
//       >
//         <ResizeIcon />
//       </NodeResizeControl>

//       {/* Handles para conexão */}
//       <Handle type="target" position={Position.Left} />
//       <div>{data.label || "Novo Grupo"}</div>
//       <Handle type="source" position={Position.Right} />
//     </ResizableNode>
//   );
// };

// // Ícone de Resize
// function ResizeIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       strokeWidth="2"
//       stroke="#ff0071"
//       fill="none"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       style={{ cursor: "nwse-resize" }}
//     >
//       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//       <polyline points="16 20 20 20 20 16" />
//       <line x1="14" y1="14" x2="20" y2="20" />
//       <polyline points="8 4 4 4 4 8" />
//       <line x1="4" y1="4" x2="10" y2="10" />
//     </svg>
//   );
// }

export default GroupNode