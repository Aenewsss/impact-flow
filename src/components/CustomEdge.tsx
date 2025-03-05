import { BaseEdge, EdgeProps, getSmoothStepPath, MarkerType } from "reactflow";

export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY,target: targetHandle}: EdgeProps) => {
  console.log(`Edge Rendered - ID: ${id}, targetHandle: ${targetHandle}`);

  // Ajusta a posição com base no Handle correto
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;

  if (targetHandle === "target-top") {
    adjustedTargetY -= 10;
  } else if (targetHandle === "target-bottom") {
    adjustedTargetY += 10;
  } else if (targetHandle === "target-left") {
    adjustedTargetX -= 10;
  } else if (targetHandle === "target-right") {
    adjustedTargetX += 10;
  }

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
  });

  return <BaseEdge markerEnd={MarkerType.ArrowClosed} id={id} path={edgePath} />;
};