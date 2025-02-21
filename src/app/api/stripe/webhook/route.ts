import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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

        if (event.type === "customer.subscription.updated") {
            const subscription = event.data.object;
            console.log("🟢 Assinatura atualizada:", subscription);

            // Atualize o status do usuário no banco de dados aqui
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Erro no webhook:", err.message);
        return NextResponse.json({ error: "Erro no webhook" }, { status: 500 });
    }
}