import { realtimeDb } from "@/config/firebase";
import { PlanEnum } from "@/enum/plan.enum";
import { get, push, ref, remove, set } from "firebase/database";

class UserService {
    async getUser(userUID: string) {
        try {
            return (await get(ref(realtimeDb, `users/${userUID}`))).val()
        } catch (error) {
            console.error("Erro ao remover documento:", error);
        }
    }

    async getUserPlan(userUID: string) {
        try {
            const user = (await get(ref(realtimeDb, `users/${userUID}`))).val()
            return user.plan
        } catch (error) {
            console.error("Erro ao remover documento:", error);
        }
    }
}

const userService = new UserService()
export default userService