import React from "react";
import { Handle, Position } from "reactflow";

export const CustomNode = ({ data, id, selected }) => {
  function getIsSelectedStyles(): React.CSSProperties {
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

  return (
    <div id={id} style={getIsSelectedStyles()} className=" p-2 rounded shadow w-52 h-16 flex items-center justify-center">
      <p>{data.label}</p>
      <Handle id="target-left" type="target" position={Position.Left} style={{ opacity: 0, width: 12, height: '100%' }} />
      <Handle id="source-left" type="source" position={Position.Left} style={{ opacity: 0, width: 12, height: '100%' }} />
      <Handle id="target-right" type="target" position={Position.Right} style={{ opacity: 0, width: 12, height: '100%', }} />
      <Handle id="source-right" type="source" position={Position.Right} style={{ opacity: 0, width: 12, height: '100%', }} />
      <Handle id="target-top" type="target" position={Position.Top} style={{ opacity: 0, width: '98%', height: 12, }} />
      <Handle id="source-top" type="source" position={Position.Top} style={{ opacity: 0, width: '98%', height: 12, }} />
      <Handle id="target-bottom" type="target" position={Position.Bottom} style={{ opacity: 0, width: '98%', height: 12, }} />
      <Handle id="source-bottom" type="source" position={Position.Bottom} style={{ opacity: 0, width: '98%', height: 12, }} />
    </div>
  );
};