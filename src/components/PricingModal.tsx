"use client";
import userService from "@/services/user.service";
import { showToast } from "@/utils/show-toast.util";
import { useState } from "react";

export default function PricingModal({ onClose, userUID }: { onClose: () => void, userUID: string }) {
    async function chooseSubscriptionPlan(planType: "monthly" | "yearly") {

        const email = (await userService.getUser(userUID)).email;

        const response = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planType, email }),
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url; // Redireciona para a Stripe
        } else {
            showToast("Erro ao iniciar assinatura. Tente novamente.");
        }
    }

    const plans = [
        {
            name: "Grátis",
            price: "0",
            features: [
                "Até 10 fluxos ativos",
                "Conexões ilimitadas entre fluxos",
                "Visualização de impacto manual",
                "Acesso a funcionalidades básicas",
            ],
            buttonText: "Seu plano atual",
            buttonDisabled: true,
            bgColor: "bg-gray-800",
        },
        {
            name: "Mensal",
            price: "34,90",
            priceSuffix: "/mês",
            features: [
                "Fluxos ilimitados",
                "Histórico de versões dos fluxos",
                "Integração com ferramentas externas",
                "Inteligência preditiva para mudanças",
                "Relatórios personalizados",
                "Análise de impacto automatizada com IA",
                "Criação de fluxos automáticos com IA"
            ],
            buttonText: "Obter Plano Mensal",
            buttonDisabled: false,
            onClick: () => chooseSubscriptionPlan("monthly")
        },
        {
            name: "Anual",
            price: "29,90",
            priceSuffix: "/mês",
            features: [
                "Fluxos ilimitados",
                "Histórico de versões dos fluxos",
                "Integração com ferramentas externas",
                "Inteligência preditiva para mudanças",
                "Relatórios personalizados",
                "Análise de impacto automatizada com IA",
                "Criação de fluxos automáticos com IA"
            ],
            buttonText: "Obter Plano Anual",
            buttonDisabled: false,
            onClick: () => chooseSubscriptionPlan("yearly")
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-4xl shadow-lg">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white text-2xl font-semibold">Faça upgrade do seu plano</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        ✖
                    </button>
                </div>

                {/* Planos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <div key={index} className={`p-6 flex flex-col group justify-between rounded-lg ${index > 0 ? "bg-white text-black shadow-lg hover:bg-black hover:text-white" : "text-white"} transition-all`}>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-medium">{plan.name}</h3>
                                <p className="text-4xl font-bold mt-2">
                                    R$ {plan.price}
                                    <span className="text-lg font-normal">{plan.priceSuffix || "/mês"}</span>
                                </p>
                                <ul className={`mt-4 text-sm text-slate-600 space-y-2 ${index > 0 && "group-hover:text-white"}`}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>✔ {feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={plan.onClick}
                                className={`w-full mt-6 py-2 rounded ${plan.buttonDisabled ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-green-500 text-white group-hover:bg-[#3C153F]"
                                    }`}
                                disabled={plan.buttonDisabled}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Razões para escolher o ImpactFlow */}
                <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400">Por que escolher o ImpactFlow?</h3>
                    <ul className="text-sm text-gray-300 mt-2 space-y-1">
                        <li>✔ Visualização de impacto de mudanças em tempo real</li>
                        <li>✔ Interface intuitiva para mapeamento de fluxos</li>
                        <li>✔ Suporte a equipes de desenvolvimento e gestão</li>
                        <li>✔ Planos acessíveis e escaláveis para qualquer tamanho de equipe</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}