import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ref, get, update } from "firebase/database";
import { realtimeDb } from "@/config/firebase";
import { PlanEnum } from "@/enum/plan.enum";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function findUserByEmail(email: string) {
    try {
        const usersRef = ref(realtimeDb, "users");
        const snapshot = await get(usersRef);
        if (!snapshot.exists()) return null;

        const users = snapshot.val();
        const userKey = Object.keys(users).find(key => users[key].email === email);
        return userKey ? { id: userKey, ...users[userKey] } : null;
    } catch (error) {
        console.error("❌ Erro ao buscar usuário no Firebase:", error);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const sig = req.headers.get("stripe-signature");
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!sig || !endpointSecret) {
            return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
        }

        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err: any) {
            return NextResponse.json({ error: `Erro ao verificar webhook: ${err.message}` }, { status: 400 });
        }

        console.log("🔔 Webhook recebido:", event.type);

        if (event.type === "checkout.session.completed") {
            const checkout = event.data.object;
            const { userEmail } = checkout.metadata
            console.log("🟢 Checkout completo:", checkout);

            const user = await findUserByEmail(userEmail);
            if (!user) {
                console.error("❌ Usuário não encontrado no Firebase.");
                return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
            }

            console.log(`🟢 Usuário encontrado: ${user.id}`);

            // 🔥 Atualiza o plano do usuário no Firebase
            const userRef = ref(realtimeDb, `users/${user.id}`);
            await update(userRef, { plan: PlanEnum.PREMIUM });

            console.log("✅ Plano atualizado no Firebase com sucesso!");

            // Atualize o status do usuário no banco de dados aqui
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Erro no webhook:", err.message);
        return NextResponse.json({ error: "Erro no webhook" }, { status: 500 });
    }
}