import { NodeProps } from "reactflow";

export const PreviewNode = ({ data, id }: NodeProps) => {

  return (
    <div id={id} className=" p-2 rounded shadow w-52 h-16 flex items-center justify-center opacity-50 border border-black bg-[#ccc] border-dashed text-black">
      <p>{data.label}</p>
    </div >
  );
};