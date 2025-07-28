"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronLeft, ChevronRight, Target } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PornografiaPage() {
  const { data, getTimeAbstinent, getGoalProgress } = useAddiction()
  const router = useRouter()

  const timeAbstinent = getTimeAbstinent()
  const progress = getGoalProgress()

  const getTimeRemaining = () => {
    const goalHours = {
      "1 Dia": 24,
      "2 Dias": 48,
      "3 Dias": 72,
      "4 Dias": 96,
      "5 Dias": 120,
      "6 Dias": 144,
      "1 Semana": 168,
      "10 Dias": 240,
      "2 Semanas": 336,
      "3 Semanas": 504,
      "1 Mês": 720,
    }

    const targetHours = goalHours[data.currentGoal as keyof typeof goalHours] || 24
    const currentHours = timeAbstinent.hours + timeAbstinent.minutes / 60
    const remainingHours = Math.max(0, targetHours - currentHours)

    const hours = Math.floor(remainingHours)
    const minutes = Math.floor((remainingHours % 1) * 60)
    const seconds = Math.floor((((remainingHours % 1) * 60) % 1) * 60)

    return { hours, minutes, seconds }
  }

  const timeRemaining = getTimeRemaining()

  return (
    <div className="min-h-screen pb-20">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          {/* Removido botão de voltar */}
          <span className="text-red-500">Resumo</span>
        </div>
        <h1 className="text-xl font-semibold">Pornografia</h1>
      </div>

      <div className="mb-6 px-4">
        <h2 className="text-2xl font-bold mb-6">Objetivo Atual</h2>

        <div className="bg-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  className="text-red-500 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-500">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">{data.currentGoal}</h3>
            <p className="text-gray-400">Eu escolho ter uma vida saudável!</p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Tempo de abstinência desde o último reinício</p>
              <p className="text-2xl font-bold">
                {timeAbstinent.hours}h, {timeAbstinent.minutes}min e {timeAbstinent.seconds}seg
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Tempo remanescente até o objetivo ser alcançado</p>
              <p className="text-2xl font-bold">
                {timeRemaining.hours}h, {timeRemaining.minutes}min e {timeRemaining.seconds}seg
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/objetivos")}
          className="w-full bg-gray-800 rounded-lg p-4 flex items-center justify-between mb-6 mx-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Target className="text-white" size={16} />
            </div>
            <span className="text-red-500 font-medium">Ver Objetivos</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </button>

        <div className="mb-6 px-4">
          <h3 className="text-xl font-bold mb-4">Diário</h3>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h4 className="text-lg font-semibold mb-2">julho 2025</h4>
            <span className="text-gray-400">agosto</span>
          </div>
        </div>
      </div>
    </div>
  )
}
