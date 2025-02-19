import React from "react";

interface ButtonProps {
  name: string;
  function: () => void;
  theme: "dark" | "light";
}

const Button: React.FC<ButtonProps> = ({ name, function: handleClick, theme }) => {
  return (
    <button
      onClick={handleClick}
      className={`flex rounded-full p-2 items-center gap-4
        ${theme === "dark" ? "bg-[#3C153F]" : "bg-white"} 
        transition-all duration-300 ease-in-out group`} // Adicionando group para aplicar hover na div filha
    >
      <div
        className={`rounded-full p-2 
          ${theme === "dark" ? "bg-white" : "bg-[#3C153F]"} 
          transition-all duration-300 ease-in-out
          group-hover:px-5 group-hover:origin-left`} // Aplica hover quando o pai for hoverado
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-arrow-right ${theme === "dark" ? "text-[#3C153F]" : "text-white"}`} viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
        </svg>
      </div>
      <span className={`pr-4 font-light ${theme === "dark" ? "text-white" : "text-[#3C153F]"}`}>
        {name}
      </span>
    </button>
  );
};

export default Button;
