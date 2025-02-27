import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { fileName, content } = await request.json()

    if (!fileName || !content) {    
        return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
    }

    try {
        // 🔥 Converte o código para AST
        const ast = parse(content, {
            sourceType: "module",
            plugins: ["jsx", "typescript"], // Suporte para TS e React
        });

        const importMap = new Map();

        // 🔍 Identifica os imports e quais itens foram importados
        traverse(ast, {
            ImportDeclaration({ node }) {
                const importedFrom = node.source.value;
                const importedItems = node.specifiers.map(specifier => specifier.local.name);
                importMap.set(importedFrom, importedItems);
            },
        });

        return NextResponse.json({ fileName, dependencies: [...importMap.entries()] });
    } catch (error) {
        console.error(`Erro ao analisar ${fileName}:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}