import React, { useCallback } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps, MarkerType } from "reactflow";

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, selected, setEdges }: EdgeProps & { setEdges: any }) {
  // 📌 Calcula a curva da conexão e a posição do rótulo (label)
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  // 📌 Função para remover a conexão ao clicar no "X"
  const onRemove = useCallback(() => {
    setEdges((edges: any) => edges.filter((edge: any) => edge.id !== id));
  }, [id, setEdges]);

  return (
    <>
      {/* 🔥 Renderiza a conexão com a seta no final */}
      <BaseEdge
      
        path={edgePath}
        // @ts-ignore
        markerEnd={{ type: MarkerType.ArrowClosed, strokeWidth: 4 }} // ✅ Mantém a seta
      />

      {/* Adiciona um "X" apenas quando a conexão está selecionada */}
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: "red",
              color: "white",
              padding: "4px 8px",
              borderRadius: "50%",
              fontSize: "12px",
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
            }}
            onClick={onRemove}
          >
            ✕
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}