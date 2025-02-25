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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center z-50 overflow-y-auto transition-opacity duration-300 ease-in-out animate-fade-in">
          <div className="bg-gray-900 p-6 rounded-2xl w-full max-w-4xl shadow-2xl mt-10 flex flex-col gap-3">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-3xl font-bold tracking-wide">
                Faça upgrade do seu plano
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-200 ease-in-out"
              >
                ✖
              </button>
            </div>
      
            {/* Planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-6 flex flex-col group justify-between rounded-2xl shadow-lg transition-transform duration-300 ease-in-out ${
                    index === 0
                      ? " text-white bg-gray-800" // Plano selecionado sem hover
                      : "bg-white text-black hover:bg-gradient-to-br hover:from-[#3C153F] hover:to-purple-800 hover:text-white hover:shadow-2xl hover:scale-105"
                  }`}
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-4xl font-bold mt-2">
                      R$ {plan.price}
                      <span className="text-lg font-normal">
                        {plan.priceSuffix || "/mês"}
                      </span>
                    </p>
                    <ul
                      className={`mt-4 text-sm space-y-2 ${
                        index === 0
                          ? "text-gray-300"
                          : "text-gray-600 group-hover:text-white"
                      }`}
                    >
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 animate-slide-in"
                        >
                          <span
                            className={`${
                              index === 0
                                ? "text-white"
                                : "text-[#3C153F] group-hover:text-white"
                            }`}
                          >
                            ✔
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={plan.onClick}
                    className={`w-full mt-6 py-2 rounded-lg transition-all duration-300 ${
                      plan.buttonDisabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-[#3C153F] text-white hover:bg-[#5A1A5F] group-hover:shadow-md "
                    }`}
                    disabled={plan.buttonDisabled}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
      
            {/* Razões para escolher o ImpactFlow */}
            <div className="mt-8 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold text-[#a55caa]">
                Por que escolher o ImpactFlow?
              </h3>
              <ul className="text-sm text-zinc-300 mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-[#a55caa]">✔</span> Visualização de impacto
                  de mudanças em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#a55caa]">✔</span> Interface intuitiva para
                  mapeamento de fluxos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#a55caa]">✔</span> Suporte a equipes de
                  desenvolvimento e gestão
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#a55caa]">✔</span> Planos acessíveis e
                  escaláveis para qualquer tamanho de equipe
                </li>
              </ul>
            </div>
    
          </div>
        </div>
      );
      
      
    }