"use client";
import { useEffect, useState } from "react";
import { ref, set } from "firebase/database";
import { auth, realtimeDb } from "@/config/firebase"; // Firebase
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

// Expressões Regulares
const FUNCTION_REGEX = /(export\s+default\s+function|export\s+function|const|async function|function)\s+([a-zA-Z0-9_]+)\s*\(/g;
const IMPORT_REGEX = /import\s+(?:\*\s+as\s+([a-zA-Z0-9_]+)|\{([^}]+)\}|([a-zA-Z0-9_]+))\s+from\s+['"](.+?)['"]/g;
const FUNCTION_CALL_REGEX = /([a-zA-Z0-9_]+)\s*\(/g;
const INTERFACE_REGEX = /interface\s+([a-zA-Z0-9_]+)/g;
const VARIABLE_REGEX = /const\s+([a-zA-Z0-9_]+)/g;

// Ignorar arquivos irrelevantes
const IGNORED_FOLDERS = ["node_modules", ".git", ".next", "dist", "build"];

export default function FunctionExtractor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [userUID, setUserUID] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUserUID(user.uid);
      } else {
        router.push("/login");
        setUserUID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleFolderSelection() {
    try {
      setLoading(true);
      // @ts-ignore
      const directoryHandle = await window.showDirectoryPicker();
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
        let fileData = { fileName, path: filePath, functions: [], imports: [], dependencies: [] };
        let match;

        // 🔍 Identificar funções no arquivo
        while ((match = FUNCTION_REGEX.exec(content)) !== null) {
          fileData.functions.push({ name: match[2], startIndex: match.index });
        }

        // 🔍 Identificar interfaces no arquivo
        while ((match = INTERFACE_REGEX.exec(content)) !== null) {
          fileData.functions.push({ name: match[1], type: "interface", startIndex: match.index });
        }

        // 🔍 Identificar variáveis no arquivo
        while ((match = VARIABLE_REGEX.exec(content)) !== null) {
          fileData.functions.push({ name: match[1], type: "variable", startIndex: match.index });
        }

        // 🔍 Identificar chamadas internas de funções no mesmo arquivo
        while ((match = FUNCTION_CALL_REGEX.exec(content)) !== null) {
          const calledFunction = match[1];
          if (fileData.functions.some(fn => fn.name === calledFunction)) {
            fileData.dependencies.push({ caller: calledFunction });
          }
        }

        // 🔍 Identificar imports
        while ((match = IMPORT_REGEX.exec(content)) !== null) {
          const importedFrom = match[4];

          // Apenas imports internos
          if (!importedFrom.startsWith(".") && !importedFrom.startsWith("@/")) continue;

          let importedItems = [];
          if (match[1]) importedItems.push(`* as ${match[1]}`);
          if (match[2]) importedItems.push(...match[2].split(",").map(item => item.trim()));
          if (match[3]) importedItems.push(match[3]);

          fileData.imports.push({ importedFrom, importedItems });
        }

        functionImports.push(fileData);
      }

      await processDirectory(directoryHandle);
      console.log("📌 Funções e dependências identificadas:", functionImports);

      // 🔥 Criar os fluxos no ImpactFlow
      await createImpactFlow(userUID, functionImports);

      setResult({ functions: functionImports.length });
    } catch (error) {
      console.error("Erro ao processar pasta:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createImpactFlow(userUID, functionImports) {
    if (!userUID || !functionImports.length) return;

    const nodeSpacingX = 250;
    const nodeSpacingY = 150;
    let nodesMap = new Map();
    let col = 0, row = 0;

    for (const file of functionImports) {
      console.log("🔍 Processando arquivo:", file.fileName);

      // 🔥 Criar nó do arquivo
      const fileNodeId = uuidv4();
      await set(ref(realtimeDb, `flows/${userUID}/${fileNodeId}`), {
        id: fileNodeId,
        data: { label: file.fileName },
        position: { x: col * nodeSpacingX, y: row * nodeSpacingY },
        type: "custom",
      });
      nodesMap.set(file.path, fileNodeId);

      col++;
      if (col > 5) {
        col = 0;
        row++;
      }

      // 🔥 Criar nós das funções dentro do arquivo
      for (const func of file.functions) {
        console.log("🔗 Criando fluxo para função:", func.name);

        const functionNodeId = uuidv4();
        await set(ref(realtimeDb, `flows/${userUID}/${functionNodeId}`), {
          id: functionNodeId,
          data: { label: func.name },
          position: { x: col * nodeSpacingX, y: row * nodeSpacingY },
          type: "custom",
        });
        nodesMap.set(`${file.path}-${func.name}`, functionNodeId);

        // Criar conexão entre o arquivo e a função
        await set(ref(realtimeDb, `connections/${userUID}/${uuidv4()}`), {
          id: uuidv4(),
          source: fileNodeId,
          target: functionNodeId,
        });

        col++;
        if (col > 5) {
          col = 0;
          row++;
        }
      }

      // 🔥 Criar conexões de dependências dentro do mesmo arquivo
      for (const dep of file.dependencies) {
        const callingNodeId = nodesMap.get(`${file.path}-${dep.caller}`);
        if (!callingNodeId) continue;

        for (const func of file.functions) {
          if (func.name === dep.caller) continue;

          await set(ref(realtimeDb, `connections/${userUID}/${uuidv4()}`), {
            id: uuidv4(),
            source: callingNodeId,
            target: nodesMap.get(`${file.path}-${func.name}`),
          });

          console.log(`✅ Criada dependência: ${dep.caller} → ${func.name}`);
        }
      }
    }

    console.log("📌 Fluxo de dependências criado no ImpactFlow!");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">📂 Analisar Código</h1>
      <button onClick={handleFolderSelection} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
        Selecionar Pasta
      </button>
    </div>
  );
}