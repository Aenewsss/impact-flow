import React from "react";
import { Handle, Position } from "reactflow";

const CustomJsonNode = ({ data, id }) => {
    console.log(id)

    return (
        <div className="bg-white border shadow-md rounded-md w-72 relative text-black">
            {/* Título do nó */}
            <h3 className="font-bold text-center p-2 bg-gray-100 rounded-md">{data.label}</h3>

            {/* Handles de entrada à esquerda */}
            <Handle
                type="target"
                position={Position.Left}
                id={`target-left-${id}`}
                style={{ top: "50%", transform: "translateY(-50%)", background: "#333" }}
            />

            <div className="border-t">
                {Object.keys(data.fields).map((field, index) => {
                    const { sourceId, value, isObject } = data.fields[field]; // Pegar o sourceId gerado
                    return (
                        <div key={index} className="flex items-center justify-between text-sm py-1 relative">

                            {/* Nome da chave e valor */}
                            <div className="flex gap-4 px-2">
                                <span className="w-24">{field} <span className="text-slate-400">({typeof value})</span></span>
                                <span className="text-gray-500">{value}</span>
                            </div>

                            {
                                isObject &&
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`source-right-${sourceId}`}
                                    style={{ top: "50%", transform: "translateY(-50%)", background: "#666" }}
                                />
                            }
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomJsonNode;