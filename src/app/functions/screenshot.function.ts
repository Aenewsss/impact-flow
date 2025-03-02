import html2canvas from "html2canvas";

export async function captureScreenshot() {
    const flowContainer = document.querySelector(".react-flow"); // Certifique-se de pegar o container correto
    if (!flowContainer) {
        console.error("Elemento do fluxo não encontrado.");
        return;
    }

    try {
        const canvas = await html2canvas(flowContainer as any);
        const image = canvas.toDataURL("image/png");

        // Criar um link para baixar a imagem
        const link = document.createElement("a");
        link.href = image;
        link.download = "screenshot.png";
        link.click();
    } catch (error) {
        console.error("Erro ao capturar a tela:", error);
    }
}