import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export function exportToDoc(sourceFlow, fluxosImpactados: string[]) {
    if (!fluxosImpactados.length) {
        alert("Nenhum fluxo impactado para exportar!");
        return;
    }

    // Criar um documento
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Fluxos Impactados",
                                bold: true,
                                size: 28, // Tamanho da fonte
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: `Fluxo de origem: ${sourceFlow}`, size: 24 })],
                    }),
                    ...fluxosImpactados.map((fluxo) =>
                        new Paragraph({
                            children: [new TextRun({ text: fluxo, size: 16 })],
                        })
                    ),
                ],
            },
        ],
    });

    // Gerar e baixar o arquivo
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "fluxos_impactados.docx");
    });
}