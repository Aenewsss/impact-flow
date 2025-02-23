"use client";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { realtimeDb } from "@/config/firebase"; // Firebase
import { v4 as uuidv4 } from "uuid";

// Expressões Regulares
const FUNCTION_REGEX = /(export\s+default\s+function|export\s+function|const|async function|function)\s+([a-zA-Z0-9_]+)\s*\(/g;
const IMPORT_REGEX = /import\s+(?:\*\s+as\s+([a-zA-Z0-9_]+)|\{([^}]+)\}|([a-zA-Z0-9_]+))\s+from\s+['"](.+?)['"]/g;

// Ignorar arquivos irrelevantes
const IGNORED_FILES = [".env", "package.json", "package-lock.json", "yarn.lock", "tsconfig.json"];
const IGNORED_FOLDERS = ["node_modules", ".git", ".next", "dist", "build"];

export default function FunctionExtractor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleFolderSelection() {
    try {
      setLoading(true);

      // 🔥 Abre o seletor de arquivos
      // @ts-ignore
      const directoryHandle = await window.showDirectoryPicker();
      let functionData = [];
      let functionImports = [];

      async function processDirectory(directoryHandle, relativePath = "") {
        for await (const [name, handle] of directoryHandle.entries()) {
          if (IGNORED_FOLDERS.includes(name)) continue;
          const fullPath = relativePath ? `${relativePath}/${name}` : name;

          if (handle.kind === "directory") {
            await processDirectory(handle, fullPath);
          } else if (handle.kind === "file" && (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".tsx"))) {
            const file = await handle.getFile();
            const content = await file.text();
            processFile(content, name, fullPath);
          }
        }
      }

      function processFile(content, fileName, filePath) {
        let functionsInFile = [];
        let match;

        // 🔍 Encontrar funções no arquivo
        while ((match = FUNCTION_REGEX.exec(content)) !== null) {
          const functionName = match[2];
          functionsInFile.push({ name: functionName, startIndex: match.index });
          functionData.push({
            id: uuidv4(),
            name: functionName,
            file: fileName,
            path: filePath,
          });
        }

        // 🔍 Encontrar imports e associar com funções reais que os chamam
        while ((match = IMPORT_REGEX.exec(content)) !== null) {
          const importedFrom = match[4];

          // 🔥 Apenas imports internos do projeto (./, ../, @/)
          if (!importedFrom.startsWith(".") && !importedFrom.startsWith("@/")) continue;

          let importedItems = [];
          if (match[1]) importedItems.push(`* as ${match[1]}`);
          if (match[2]) importedItems.push(...match[2].split(",").map(item => item.trim()));
          if (match[3]) importedItems.push(match[3]);

          let usedInFunction = "Global Scope";

          // 🔍 Identificar em qual função a importação é usada
          for (const fn of functionsInFile) {
            const fnEndIndex = functionsInFile.find(f => f.startIndex > fn.startIndex)?.startIndex || content.length;
            const fnContent = content.slice(fn.startIndex, fnEndIndex);

            // Se encontrar referência ao import dentro do corpo da função, associa corretamente
            if (importedItems.some(item => fnContent.includes(`${item}.`))) {
              usedInFunction = fn.name;
              break;
            }
          }

          functionImports.push({
            file: fileName,
            importedFrom,
            importedItems,
            usedInFunction,
          });
        }
      }

      await processDirectory(directoryHandle);

      // 🔥 Salva no Firebase
      await set(ref(realtimeDb, "functions"), functionData);
      await set(ref(realtimeDb, "functionImports"), functionImports);

      console.log("📌 Funções e importações salvas no Firebase.");
      setResult({ functions: functionData.length, imports: functionImports.length });
    } catch (error) {
      console.error("Erro ao processar pasta:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">📂 Analisar Código</h1>
      <p className="text-gray-500">Selecione uma pasta do projeto para extrair as funções.</p>
      <button
        onClick={handleFolderSelection}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Selecionar Pasta
      </button>

      {loading && <p className="mt-4 text-yellow-500">⏳ Processando...</p>}

      {result && (
        <div className="mt-4">
          <p className="text-green-500">✅ Extração concluída!</p>
          <p>Funções salvas: {result.functions}</p>
          <p>Importações mapeadas: {result.imports}</p>
        </div>
      )}
    </div>
  );
}