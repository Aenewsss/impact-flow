import { realtimeDb } from "@/config/firebase";
import { useNodesStore } from "@/store/nodes.store";
import { ArrowCircleDownOutlined, ArrowCircleLeftOutlined, ArrowCircleRightOutlined, ArrowCircleUpOutlined, ArrowDropDown, ArrowDropDownOutlined, ChangeHistoryOutlined, CircleOutlined, ExpandMoreOutlined, RectangleOutlined } from "@mui/icons-material";
import { ref, set } from "firebase/database";
import { useState } from "react";
import { Handle, MarkerType, NodeProps, Position } from "reactflow";
import { v4 as uuidv4 } from "uuid"; // 📌 Importar biblioteca para gerar IDs únicos

export const CustomNode = ({ data, id, selected, xPos, yPos }: NodeProps) => {
  const { selectedNode: someNodeSelected, ghostNode, setGhostNode, addNode, userUID, addEdge, setNodes, nodes } = useNodesStore(store => store)

  const [handleHoverPosition, setHandleHoverPosition] = useState(null);

  const [color, setColor] = useState(data.color || "#ffa500"); // Estado para cor inicial

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

  const nodeRef = ref(realtimeDb, `flows/${userUID}/${id}`); // Referência no Firebase

  // Estado interno para cores e formas
  const handleColorChange = (color) => {
    setColor(color);
    setNodes(nodes.map(node => node.id === id ? { ...node, data: { ...node.data, color } } : node));

    // 🔥 Atualiza no Firebase
    set(nodeRef, { ...nodes.find(n => n.id === id), data: { ...data, color } });
  };

  const handleShapeChange = (shape) => {
    setNodes(nodes.map(node => node.id === id ? { ...node, data: { ...node.data, shape } } : node));

    // 🔥 Atualiza no Firebase
    set(nodeRef, { ...nodes.find(n => n.id === id), data: { ...data, shape } });
  };

  return (
    <div id={id} style={{
      background: selected ? "#3C153F" : data.color || "white",
      borderRadius: data.shape === "circle" ? "50%" : data.shape === "triangle" ? "0px" : "8px",
      clipPath: data.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
      color: selected ? 'white' : 'black',
    }}
      className="p-2 shadow w-52 h-16 flex items-center justify-center">
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

              <div className="absolute -top-16 left-0 w-full flex justify-between gap-2 bg-black rounded p-2">
                {/* Seletor RGB */}
                <div className="flex gap-2 items-center">
                  <input hidden id="color-input" type="color" value={color} onChange={(e) => handleColorChange(e.target.value)} />
                  <label htmlFor="color-input" style={{ background: color }} className={`rounded-full w-4 h-4 relative cursor-pointer`}>
                    <ExpandMoreOutlined style={{ width: 16, height: 16 }} className="absolute top-0 -right-4" />
                  </label>

                </div>

                {/* <div className="flex flex-col items-center">
                  <div className="flex gap-2">
                    <button onClick={() => handleShapeChange("rectangle")}><RectangleOutlined style={{width: 16, height: 16}} className="text-white" /></button>
                    <button onClick={() => handleShapeChange("circle")}><CircleOutlined style={{width: 16, height: 16}} className="text-white" /></button>
                    <button onClick={() => handleShapeChange("triangle")}><ChangeHistoryOutlined style={{width: 16, height: 16}} className="text-white" /></button>
                  </div>
                </div> */}

              </div>

              {/* LEFT HANDLE */}
              <div onMouseLeave={() => setHandleHoverPosition(null)} onMouseEnter={() => setHandleHoverPosition(Position.Left)} className="w-5 absolute h-full -left-5"></div>
              <Handle onMouseOver={() => showGhostNode(Position.Left)} onMouseOut={() => setGhostNode(null)} id="source-left" type="source" position={Position.Left} style={{
                width: 12, height: 12, left: -20,
                borderColor: handleHoverPosition == Position.Left ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Left ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
              </Handle>
              <Handle onClick={createGhostNode} onMouseOver={() => {
                showGhostNode(Position.Left)
                setHandleHoverPosition(Position.Left)
              }} onMouseOut={() => setGhostNode(null)} id="source-left" type="source" position={Position.Left} style={{
                width: 12, height: 12, left: -20,
                borderColor: handleHoverPosition == Position.Left ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Left ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
                <ArrowCircleLeftOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  style={{ pointerEvents: 'none', width: 24, height: 20, display: handleHoverPosition == Position.Left ? 'block' : 'none', }} className="top-1/2 absolute -translate-y-1/2 -left-2"
                />
              </Handle>

              {/* RIGHT HANDLE */}
              <div onMouseLeave={() => setHandleHoverPosition(null)} onMouseEnter={() => setHandleHoverPosition(Position.Right)} className="w-5 absolute h-full -right-5"></div>
              <Handle onMouseOver={() => showGhostNode(Position.Right)} onMouseOut={() => setGhostNode(null)} id="source-right" type="source" position={Position.Right} style={{
                width: 12, height: 12, right: -20,
                borderColor: handleHoverPosition == Position.Right ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Right ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
              </Handle>
              <Handle onClick={createGhostNode} onMouseOver={() => {
                showGhostNode(Position.Right)
                setHandleHoverPosition(Position.Right)
              }} onMouseOut={() => setGhostNode(null)} id="source-right" type="source" position={Position.Right} style={{
                width: 12, height: 12, right: -20,
                borderColor: handleHoverPosition == Position.Right ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Right ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
                <ArrowCircleRightOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  style={{ pointerEvents: 'none', width: 24, height: 20, display: handleHoverPosition == Position.Right ? 'block' : 'none', }} className="top-1/2 absolute -translate-y-1/2 -right-2"
                />
              </Handle>

              {/* TOP HANDLE */}
              <div onMouseLeave={() => setHandleHoverPosition(null)} onMouseEnter={() => setHandleHoverPosition(Position.Top)} className="h-5 absolute w-full -top-5"></div>
              <Handle onMouseOver={() => showGhostNode(Position.Top)} onMouseOut={() => setGhostNode(null)} id="source-top" type="source" position={Position.Top} style={{
                width: 12, height: 12, top: -20,
                borderColor: handleHoverPosition == Position.Top ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Top ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
              </Handle>
              <Handle onClick={createGhostNode} onMouseOver={() => {
                showGhostNode(Position.Top)
                setHandleHoverPosition(Position.Top)
              }} onMouseOut={() => setGhostNode(null)} id="source-top" type="source" position={Position.Top} style={{
                width: 12, height: 12, top: -20,
                borderColor: handleHoverPosition == Position.Top ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Top ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
                <ArrowCircleUpOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  style={{ pointerEvents: 'none', width: 24, height: 20, display: handleHoverPosition == Position.Top ? 'block' : 'none', }} className="left-1/2 absolute -translate-x-1/2 -top-2"
                />
              </Handle>

              {/* BOTTOM HANDLE */}
              <div onMouseLeave={() => setHandleHoverPosition(null)} onMouseEnter={() => setHandleHoverPosition(Position.Bottom)} className="h-5 absolute w-full -bottom-5"></div>
              <Handle onMouseOver={() => showGhostNode(Position.Bottom)} onMouseOut={() => setGhostNode(null)} id="source-bottom" type="source" position={Position.Bottom} style={{
                width: 12, height: 12, bottom: -20,
                borderColor: handleHoverPosition == Position.Bottom ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Bottom ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
              </Handle>
              <Handle onClick={createGhostNode} onMouseOver={() => {
                showGhostNode(Position.Bottom)
                setHandleHoverPosition(Position.Bottom)
              }} onMouseOut={() => setGhostNode(null)} id="source-bottom" type="source" position={Position.Bottom} style={{
                width: 12, height: 12, bottom: -20,
                borderColor: handleHoverPosition == Position.Bottom ? 'transparent' : 'unset',
                background: handleHoverPosition == Position.Bottom ? 'transparent' : 'unset',
                borderWidth: 1.8,
              }} >
                <ArrowCircleDownOutlined
                  onClick={createGhostNode}
                  onMouseOut={() => setGhostNode(null)}
                  style={{ pointerEvents: 'none', width: 24, height: 20, display: handleHoverPosition == Position.Bottom ? 'block' : 'none', }} className="left-1/2 absolute -translate-x-1/2 -bottom-2"
                />
              </Handle>
            </>
            :
            <>
              <Handle
                type="target"
                position={Position.Top}
                id="target-top"
                style={{ background: 'transparent', width: '90%', height: '50%', top: 0, borderRadius: 0, border: 'unset' }}
              />

              <Handle
                type="target"
                position={Position.Bottom}
                id="target-bottom"
                style={{ background: 'transparent', width: '90%', height: '50%', bottom: 0, borderRadius: 0, border: 'unset' }}
              />

              <Handle
                type="target"
                position={Position.Left}
                id="target-left"
                style={{ background: 'transparent', width: '15px', height: '100%', left: 0, borderRadius: 0, border: 'unset' }}
              />

              <Handle
                type="target"
                position={Position.Right}
                id="target-right"
                style={{ background: 'transparent', width: '15px', height: '100%', right: 0, borderRadius: 0, border: 'unset' }}
              />
            </>
      }

      {
        (Boolean(data.impactInfo?.direct.length) || Boolean(data.impactInfo?.indirect.length)) &&
        <div className="absolute -top-1 -right-[202px] bg-[#3C153F] w-[200px] text-white flex flex-col gap-2 text-sm min-h-16">
          {Boolean(data.impactInfo?.direct.length) && <p>• Impacto direto ({data.impactInfo.direct})</p>}
          {Boolean(data.impactInfo?.indirect.length) && <ul>
            <li>• Impacto indireto</li>
            <ul>
              {data.impactInfo.indirect.map((el, index) => <li key={index}>&nbsp; ◦ {el}</li>)}
            </ul>
          </ul>}
        </div>
      }

    </div >
  );
};