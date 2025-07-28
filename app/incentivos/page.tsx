"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function IncentivosPage() {
  const { data } = useAddiction()
  const router = useRouter()

  const incentives = [
    { goal: "1 Dia", reward: "Assistir um filme favorito", unlocked: true },
    { goal: "3 Dias", reward: "Comprar um livro novo", unlocked: false },
    { goal: "1 Semana", reward: "Jantar em um restaurante especial", unlocked: false },
    { goal: "2 Semanas", reward: "Comprar uma roupa nova", unlocked: false },
    { goal: "1 Mês", reward: "Viagem de fim de semana", unlocked: false },
  ]

  return (
    <div className="px-6 min-h-screen pb-20">
      <div className="flex items-center gap-4 py-4">
        {/* Removido botão de voltar */}
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Incentivos</h1>
        <p className="text-gray-400">Recompensas por atingir seus objetivos</p>
      </div>

      <div className="space-y-4">
        {incentives.map((incentive, index) => (
          <div
            key={index}
            className={`bg-gray-800 rounded-lg p-4 ${incentive.unlocked ? "ring-2 ring-red-500" : "opacity-60"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{incentive.goal}</h3>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  incentive.unlocked ? "bg-red-500 border-red-500" : "border-gray-500"
                }`}
              >
                {incentive.unlocked && <span className="text-white text-sm">✓</span>}
              </div>
            </div>
            <p className="text-gray-300">{incentive.reward}</p>
            {incentive.unlocked && (
              <button className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Resgatar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
