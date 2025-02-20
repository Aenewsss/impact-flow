import { realtimeDb } from "@/config/firebase";
import { push, ref, remove, set } from "firebase/database";

class ImpactService {
    async registerFlow(data) {
        try {
            const docRef = push(ref(realtimeDb, "flow"));
            await set(docRef, data);
            console.log("Documento inserido com sucesso:", docRef.key);
            return docRef.key; // Retorna o ID do novo documento
        } catch (error) {
            console.error("Erro ao inserir documento:", error);
        }
    }

    async updateFlow(node, userUID) {
        const nodeRef = ref(realtimeDb, `flows/${userUID}/${node.id}`);
        try {
            await set(nodeRef, {
                ...node, dragging: false, selected: false
            });
        } catch (error) {
            console.error("Erro ao atualizar node:", error);
        }
    };

    async removeFlow(userUID: string, docId: string) {
        try {
            await remove(ref(realtimeDb, `flows/${userUID}/${docId}`));
            console.log("Documento removido com sucesso:", docId);
        } catch (error) {
            console.error("Erro ao remover documento:", error);
        }
    }

    async registerConnection(data) {
        try {
            const docRef = push(ref(realtimeDb, "connection"));
            await set(docRef, data);
            console.log("Documento inserido com sucesso:", docRef.key);
            return docRef.key; // Retorna o ID do novo documento
        } catch (error) {
            console.error("Erro ao inserir documento:", error);
        }
    }

    async removeConnection(docId) {
        try {
            await remove(ref(realtimeDb, `connection/${docId}`));
            console.log("Documento removido com sucesso:", docId);
        } catch (error) {
            console.error("Erro ao remover documento:", error);
        }
    }
}

const impactService = new ImpactService()
export default impactService