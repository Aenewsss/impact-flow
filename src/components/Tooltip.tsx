import { useState } from "react";

export default function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
    const [show, setShow] = useState(false);
  
    return (
      <div className="relative flex items-center justify-center">
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="flex items-center justify-center"
        >
          {children}
        </div>
        {show && (
          <div className="w-24 absolute bottom-full mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded-md shadow-lg transition-opacity duration-200">
            {text}
          </div>
        )}
      </div>
    );
  }