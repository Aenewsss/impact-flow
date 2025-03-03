import React from "react";
import { Handle, Position } from "reactflow";

const CustomJsonNode = ({ data }) => {
    return (
        <div className="bg-white border shadow-md rounded-md  w-72 relative text-black">
            {/* Título do nó */}
            <h3 className="font-bold text-center p-2 bg-gray-100 rounded-md">{data.label}</h3>

            <div className="border-t">
                {Object.keys(data.fields).map((field, index) => {
                    const { handleId, value } = data.fields[field]; // Pegar o handleId gerado

                    return (
                        <div key={index} className="flex items-center justify-between text-sm py-1 relative">
                            {/* Handles de entrada à esquerda */}
                            <Handle
                                type="target"
                                position={Position.Left}
                                id={`target-left-${handleId}`}
                                style={{ top: "50%", transform: "translateY(-50%)", background: "#333" }}
                            />

                            {/* Nome da chave e valor */}
                            <div className="flex gap-2 px-2">
                                <span>{field}</span>
                                <span className="text-gray-500">
                                    {typeof value === "object" ? "Object" : value}
                                </span>
                            </div>

                            {/* Handles de saída à direita */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={`source-right-${handleId}`}
                                style={{ top: "50%", transform: "translateY(-50%)", background: "#666" }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomJsonNode;