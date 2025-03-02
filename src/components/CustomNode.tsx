import { useNodesStore } from "@/store/nodes.store";
import { ArrowCircleDownOutlined, ArrowCircleLeftOutlined, ArrowCircleRightOutlined, ArrowCircleUpOutlined } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { Handle, MarkerType, NodeProps, Position, useReactFlow } from "reactflow";
import { v4 as uuidv4 } from "uuid"; // 📌 Importar biblioteca para gerar IDs únicos

export const CustomNode = ({ data, id, selected, xPos, yPos }: NodeProps) => {
  const { setEdges, project, getIntersectingNodes } = useReactFlow();

  const { selectedNode: someNodeSelected, ghostNode, setGhostNode, addNode, userUID, addEdge } = useNodesStore(store => store)

  const [handleHoverPosition, setHandleHoverPosition] = useState(null);


  function getNodeContainerIsSelectedStyles(): React.CSSProperties {
    if (selected) return {
      borderRadius: "8px",
      background: "#3C153F",
      color: "white",
    }

    return {
      borderRadius: "0px",
      background: "white",
      color: "black",
    }
  }

  function showGhostNode(position: Position) {
    switch (position) {
      case Position.Left:
        return setGhostNode({
          id: "ghost",
          position: { x: xPos - 250, y: yPos },
          data: { label: "" },
          height: 64,
          width: 208,
          type: "preview",
        })
      case Position.Right:
        return setGhostNode({
          id: "ghost",
          position: { x: xPos + 250, y: yPos },
          data: { label: "" },
          height: 64,
          width: 208,
          type: "preview",
        })
      case Position.Top:
        return setGhostNode({
          id: "ghost",
          position: { x: xPos, y: yPos - 100 },
          data: { label: "" },
          height: 64,
          width: 208,
          type: "preview",
        })
      case Position.Bottom:
        return setGhostNode({
          id: "ghost",
          position: { x: xPos, y: yPos + 100 },
          data: { label: "" },
          height: 64,
          width: 208,
          type: "preview",
        })
    }
  }

  function createGhostNode() {
    const newNodeId = uuidv4()

    addNode({ ...ghostNode, id: newNodeId, type: 'custom' }, userUID)

    function getTargetByOrigin(position: Position) {
      switch (position) {
        case Position.Left: return Position.Right
        case Position.Top: return Position.Bottom
        case Position.Right: return Position.Left
        case Position.Bottom: return Position.Top
      }
    }

    addEdge({
      id: uuidv4(),
      markerEnd: { type: MarkerType.ArrowClosed, strokeWidth: 4 },
      source: id,
      target: newNodeId,
      sourceHandle: `source-${handleHoverPosition}`,
      targetHandle: `target-${getTargetByOrigin(handleHoverPosition)}`,
      type: 'step'
    }, userUID)
  }

  const startConnection = useCallback((event) => {
    event.preventDefault();
    const newEdge = {
      id: `temp-${uuidv4()}`,
      source: id,
      target: null, // Sem destino ainda
      style: { stroke: "red", strokeWidth: 2, strokeDasharray: "5 5" },
    };
    // setTempEdge(newEdge);
  }, [id]);

  return (
    <div id={id} style={getNodeContainerIsSelectedStyles()} className=" p-2 rounded shadow w-52 h-16 flex items-center justify-center">
      <p>{data.label}</p>
      {
        !someNodeSelected ? <>
          <Handle id="target-left" type="target" position={Position.Left} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="source-left" type="source" position={Position.Left} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="target-right" type="target" position={Position.Right} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="source-right" type="source" position={Position.Right} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="target-top" type="target" position={Position.Top} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="source-top" type="source" position={Position.Top} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="target-bottom" type="target" position={Position.Bottom} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
          <Handle id="source-bottom" type="source" position={Position.Bottom} style={{ opacity: 0, width: 12, height: 12, pointerEvents: 'none' }} />
        </>
          :
          selected ?
            <>
              <div onMouseLeave={() => setHandleHoverPosition(null)} onMouseEnter={() => setHandleHoverPosition(Position.Left)} className="w-5 absolute h-full -left-5"></div>
              <Handle onMouseOver={event => console.log(event)} id="source-left" type="source" position={Position.Left} style={{
                width: 12, height: 12, left: -20,
                borderColor: handleHoverPosition == Position.Left ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Left ? 'transparent' : 'unset',
                borderWidth: 1.8
              }} >
                <ArrowCircleLeftOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  onMouseOver={(event) => {
                    // setHandleHoverPosition(Position.Left)
                    showGhostNode(Position.Left)
                  }}
                  onMouseDown={startConnection} // Segura e arrasta para criar conexão
                  // onMouseUp={cancelConnection}
                  style={{ width: 24, height: 20, display: handleHoverPosition == Position.Left ? 'block' : 'none' }} className="top-1/2 absolute -translate-y-1/2 -left-1" />
              </Handle>

              <div onMouseOut={() => setHandleHoverPosition(null)} onMouseOver={() => setHandleHoverPosition(Position.Right)} className="w-5 absolute h-full -right-5"></div>
              <Handle id="source-right" type="source" position={Position.Right}
                style={{
                  width: 12, height: 12, right: -20,
                  borderColor: handleHoverPosition == Position.Right ? 'transparent' : 'unset',
                  background: handleHoverPosition == Position.Right ? 'transparent' : 'unset',
                }} >
                <ArrowCircleRightOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  onMouseOver={(event) => {
                    setHandleHoverPosition(Position.Right)
                    showGhostNode(Position.Right)
                  }} style={{ width: 24, height: 20, display: handleHoverPosition == Position.Right ? 'block' : 'none' }} className="top-1/2 absolute -translate-y-1/2 -right-1" />
              </Handle>

              <div onMouseOut={() => setHandleHoverPosition(null)} onMouseOver={() => setHandleHoverPosition(Position.Top)} className="h-5 absolute w-full -top-5"></div>
              <Handle id="source-top" type="source" position={Position.Top}
                style={{
                  width: 12, height: 12, top: -20,
                  borderColor: handleHoverPosition == Position.Top ? 'transparent' : 'unset',
                  background: handleHoverPosition == Position.Top ? 'transparent' : 'unset',
                }} >
                <ArrowCircleUpOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  onMouseOver={(event) => {
                    setHandleHoverPosition(Position.Top)
                    showGhostNode(Position.Top)
                  }} style={{ width: 24, height: 20, display: handleHoverPosition == Position.Top ? 'block' : 'none' }} className="left-1/2 absolute -translate-x-1/2 -top-1" />
              </Handle>

              <div onMouseOut={() => setHandleHoverPosition(null)} onMouseOver={() => setHandleHoverPosition(Position.Bottom)} className="h-5 absolute w-full -bottom-5"></div>
              <Handle id="source-bottom" type="source" position={Position.Bottom}
                style={{
                  width: 12, height: 12, bottom: -20,
                  borderColor: handleHoverPosition == Position.Bottom ? 'transparent' : 'unset',
                  background: handleHoverPosition == Position.Bottom ? 'transparent' : 'unset',
                }} >
                <ArrowCircleDownOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  onMouseOver={(event) => {
                    setHandleHoverPosition(Position.Bottom)
                    showGhostNode(Position.Bottom)
                  }} style={{ width: 24, height: 20, display: handleHoverPosition == Position.Bottom ? 'block' : 'none' }} className="left-1/2 absolute -translate-x-1/2 -bottom-1" />
              </Handle>
            </>
            :
            <>
              <Handle
                type="target"
                position={Position.Top}
                id="target-top"
                style={{ background: 'transparent', width: '90%', height: '50%', top: 0, borderRadius: 0, borderColor: 'transparent' }}
              />

              <Handle
                type="target"
                position={Position.Bottom}
                id="target-bottom"
                style={{ background: 'transparent', width: '90%', height: '50%', bottom: 0, borderRadius: 0, borderColor: 'transparent' }}
              />

              <Handle
                type="target"
                position={Position.Left}
                id="target-left"
                style={{ background: 'transparent', width: '15px', height: '100%', left: 0, borderRadius: 0, borderColor: 'transparent' }}
              />

              <Handle
                type="target"
                position={Position.Right}
                id="target-right"
                style={{ background: 'transparent', width: '15px', height: '100%', right: 0, borderRadius: 0, borderColor: 'transparent' }}
              />
            </>
      }
      {data.impactInfo &&
        <div className="absolute -top-1 -right-[122px] bg-[#3C153F] w-[120px]">
          <p className="text-white text-sm">{data.impactInfo}</p>
        </div>
      }
    </div>
  );
};