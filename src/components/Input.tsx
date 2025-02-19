import React, { useState } from "react";

interface InputProps {
  type: string;
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ type, label, id }) => {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(value.length > 0);

  return (
    <div className="relative flex flex-col w-full">
      {/* Label flutuante */}
      <label
        htmlFor={id}
        className={`absolute left-1 p-1 transition-all duration-200 text-white
        ${focus || value ? "top-0 text-xs text-zinc-400" : "top-3 text-base text-zinc-400"}`}
      >
        {label}
      </label>

      {/* Input */}
      <input
        className={`p-2 pt-4 pl-2 rounded-md bg-zinc-900 border text-white focus:outline-none focus:ring-2 
          ${focus || value ? "border-blue-500" : "border-zinc-700"} focus:ring-blue-500 transition-all duration-200`}
        type={type}
        
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default Input;
