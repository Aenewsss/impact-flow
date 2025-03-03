import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export function exportToDoc(sourceFlow, nodesImpacted) {
    if (!nodesImpacted.length) {
        alert("Nenhum fluxo impactado para exportar!");
        return;
    }

    // Criar um documento do Word
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    // Título Principal
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Fluxos de Impacto",
                                bold: true,
                                size: 32, // Aumentando tamanho da fonte
                            }),
                        ],
                    }),

                    // Exibir origem do fluxo
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Fluxo de origem: ${sourceFlow}`,
                                size: 24,
                                bold: true,
                            }),
                        ],
                    }),

                    // Adicionar os nós impactados com detalhes
                    ...nodesImpacted.map(({ name, impactInfo }) => {
                        const impactoDireto = impactInfo.direct.length
                            ? `Impacto Direto: ${impactInfo.direct.join(", ")}`
                            : "Nenhum impacto direto.";

                        const impactoIndireto = impactInfo.indirect.length
                            ? `Impacto Indireto: ${impactInfo.indirect.join(", ")}`
                            : "Nenhum impacto indireto.";

                        return new Paragraph({
                            children: [
                                new TextRun({ text: `\n📌 ${name}`, bold: true, size: 20 }),
                                new TextRun({ text: `\n   - ${impactoDireto}`, size: 18 }),
                                new TextRun({ text: `\n   - ${impactoIndireto}`, size: 18 }),
                            ],
                        });
                    }),
                ],
            },
        ],
    });

    // Gerar e baixar o arquivo Word
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `fluxos_impactados_${sourceFlow}.docx`);
    });
}