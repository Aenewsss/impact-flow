import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
    try {
        const { planType, email } = await request.json();

        if (!planType || !email) {
            return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
        }

        // Define os preços dos planos
        const planPrices = {
            monthly: "price_1QuoAGQ98V1QcV5Hj8bZswHo", // ID do plano mensal na Stripe
            yearly: "price_1Quo9RQ98V1QcV5HPIZxywSa", // ID do plano anual na Stripe
        };

        // Criar a sessão de checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer_email: email,
            line_items: [
                {
                    price: planPrices[planType],
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento?success=false`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error("❌ Erro ao criar sessão de checkout:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}