"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { MILESTONES, getMilestones } from "@/contexts/AddictionContext"
import {
  Target,
  Trophy,
  Clock,
  Timer,
  TrendingUp,
  Sparkles,
  Smile,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { useState } from "react"
import clsx from "clsx"

export default function EstatisticaPage() {
  const { data, getTimeAbstinent } = useAddiction()
  const { conquered, next } = getMilestones(data.streakStart)
  const router = useRouter()
  const timeAbstinent = getTimeAbstinent()
  const [showMotivation, setShowMotivation] = useState(true)

  if (!data.addictionType) return null

  // Frases motivacionais
  const frases = [
    "Cada dia é uma vitória!",
    "Você está mais forte do que imagina.",
    "Continue firme, você está no caminho certo!",
    "A jornada é difícil, mas você é mais forte!",
    "Orgulhe-se do seu progresso!",
  ]
  const fraseMotivacional = frases[(new Date().getDate() + new Date().getMonth()) % frases.length]

  // Estatísticas principais
  const stats = [
    {
      title: "Tempo Limpo",
      value:
        timeAbstinent.days > 0
          ? `${timeAbstinent.days}d ${timeAbstinent.hours}h`
          : `${timeAbstinent.hours}h ${timeAbstinent.minutes}m`,
      description: "Desde a última recaída",
      icon: Timer,
      color: "from-blue-400 to-sky-500",
      text: "text-blue-500",
    },
  ]

  // Progresso semanal
  const weeklyProgress = [
    { day: "Dom", progress: 85, label: "D" },
    { day: "Seg", progress: 92, label: "S" },
    { day: "Ter", progress: 78, label: "T" },
    { day: "Qua", progress: 95, label: "Q" },
    { day: "Qui", progress: 88, label: "Q" },
    { day: "Sex", progress: 90, label: "S" },
    { day: "Sáb", progress: 96, label: "S" },
  ]
  const media = Math.round(weeklyProgress.reduce((acc, d) => acc + d.progress, 0) / weeklyProgress.length)

  // Calcular progresso até o próximo marco
  let progressToNext = 0
  let timeToNext = ''
  if (next && data.streakStart) {
    const now = new Date()
    const diffMs = now.getTime() - data.streakStart.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    progressToNext = conquered.length > 0
      ? ((diffHours - MILESTONES[conquered.length - 1].hours) / (next.hours - MILESTONES[conquered.length - 1].hours)) * 100
      : (diffHours / next.hours) * 100
    progressToNext = Math.max(0, Math.min(progressToNext, 100))
    if (progressToNext > 0 && progressToNext < 5) progressToNext = 5
    // Calcular tempo restante
    const hoursLeft = Math.max(0, next.hours - diffHours)
    const dias = Math.floor(hoursLeft / 24)
    const horas = Math.floor(hoursLeft % 24)
    const minutos = Math.floor((hoursLeft * 60) % 60)
    timeToNext = `${dias > 0 ? dias + 'd ' : ''}${horas > 0 ? horas + 'h ' : ''}${minutos}m para o próximo marco`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-20 flex flex-col items-center">
      {/* Topo visual */}
      <div className="flex items-center gap-3 mt-6 mb-2 w-full px-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-sky-400 shadow-lg">
          <span className="text-2xl">{data.addictionType.icon}</span>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 leading-tight">Estatísticas</h1>
          <p className="text-gray-600 text-sm">Acompanhe seu progresso detalhado</p>
        </div>
      </div>

      {/* Frase motivacional */}
      {showMotivation && (
        <div className="w-full bg-gradient-to-r from-blue-400 to-sky-500 rounded-xl p-4 mb-4 shadow-lg flex items-center gap-3 animate-fade-in mx-4">
          <Sparkles className="text-white" size={28} />
          <span className="text-white font-medium text-base flex-1">{fraseMotivacional}</span>
          <button onClick={() => setShowMotivation(false)} className="text-white/70 hover:text-white"><Clock size={18}/></button>
        </div>
      )}

      {/* Cartão principal */}
      <div className="w-full max-w-md bg-white/90 rounded-2xl p-6 mb-4 border-2 border-blue-300 shadow-2xl flex flex-col items-center animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="text-blue-500" size={22} />
          <span className="text-blue-700 font-semibold text-lg">Tempo de Purificação</span>
        </div>
        <div className="text-5xl font-extrabold text-blue-600 mb-1 animate-pulse-soft drop-shadow-lg">{timeAbstinent.days > 0 ? timeAbstinent.days : timeAbstinent.hours > 0 ? timeAbstinent.hours : timeAbstinent.minutes}</div>
        <div className="text-xl text-blue-500 font-bold mb-2">
          {timeAbstinent.days > 0
            ? timeAbstinent.days === 1
              ? "dia"
              : "dias"
            : timeAbstinent.hours > 0
              ? timeAbstinent.hours === 1
                ? "hora"
                : "horas"
              : timeAbstinent.minutes === 1
                ? "minuto"
                : "minutos"}
        </div>
        <div className="text-base text-gray-600 font-mono mb-2">
          {timeAbstinent.days}d {timeAbstinent.hours}h {timeAbstinent.minutes}m {timeAbstinent.seconds}s
        </div>
      </div>

      {next && (
        <div className="w-full max-w-md flex flex-col items-center mb-6">
          <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
            <div className="h-3 bg-blue-500 rounded-full transition-all" style={{ width: `${progressToNext}%` }} />
          </div>
          <span className="text-xs text-gray-600 mt-1">{timeToNext}</span>
        </div>
      )}

      {/* Marcos conquistados */}
      <div className="mt-8">
        <h2 className="font-bold text-lg text-gray-700 mb-3 text-center flex items-center gap-2 justify-center">
          <span>Marcos conquistados</span>
          <span className="text-xl">🏅</span>
        </h2>
        {conquered.length === 0 ? (
          <div className="text-gray-500 text-sm text-center">Nenhum marco conquistado ainda. Continue firme!</div>
        ) : (
          <div className={clsx(
            "grid gap-4 pb-2 justify-center",
            conquered.length < 4 ? "grid-cols-2" : "grid-cols-3",
            "sm:flex sm:gap-4 sm:overflow-x-auto"
          )}>
            {conquered.map((m, i) => (
              <div
                key={m.label}
                className="flex flex-col items-center min-w-[120px] bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-blue-100 shadow-lg relative"
                style={{ boxShadow: "0 4px 24px 0 rgba(0, 120, 255, 0.10)" }}
              >
                <span className="text-5xl mb-2 animate-pulse-slow">{m.emoji}</span>
                <span className="text-base font-semibold text-blue-700 mb-1 text-center">{m.label}</span>
                <span className="text-green-500 text-xs font-medium">Conquistado!</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximo marco */}
      {next && (
        <div className="mt-8">
          <h3 className="text-gray-600 text-base mb-2 text-center">Próximo marco</h3>
          <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-300 rounded-2xl px-8 py-6 shadow-md relative animate-pulse-fast mx-auto max-w-xs">
            <span className="text-6xl mb-2 animate-pulse">{next.emoji}</span>
            <span className="font-bold text-blue-800 text-xl">{next.label}</span>
            <span className="text-xs text-gray-500 mb-2">({next.hours / 24} dias)</span>
            <span className="text-blue-500 text-xs font-medium">Você está quase lá!</span>
          </div>
        </div>
      )}

      {/* Espaço extra para respiro visual */}
      <div className="h-8" />

      {/* Progresso Semanal visual */}
      <div className="w-full max-w-md bg-white/90 rounded-2xl p-6 border shadow mb-8 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2 justify-center">Linha do Tempo das Conquistas</h2>
        <div className="flex items-center justify-center gap-0 w-full overflow-x-auto pb-2 relative">
          {MILESTONES.map((m, idx) => {
            const conquistado = conquered.some(c => c.label === m.label)
            const isNext = next && next.label === m.label
            return (
              <div key={m.label} className="flex flex-col items-center relative min-w-[48px]">
                {/* Linha de conexão */}
                {idx > 0 && (
                  <div className={`absolute left-[-24px] top-1/2 w-12 h-1 ${conquistado ? 'bg-blue-400' : 'bg-gray-200'} z-0`} style={{zIndex:0}} />
                )}
                {/* Medalha */}
                <span className={`text-3xl z-10 ${conquistado ? 'text-blue-500 drop-shadow' : 'text-gray-300'} ${isNext ? 'animate-pulse' : ''}`}>{m.emoji}</span>
                <span className={`text-xs mt-1 font-semibold ${conquistado ? 'text-blue-700' : 'text-gray-400'}`}>{m.label}</span>
              </div>
            )
          })}
          {/* Barra de progresso abaixo da linha do tempo */}
          <div className="absolute left-0 right-0 bottom-[-10px] w-full h-3 flex">
            {/* Azul até o último marco conquistado, cinza no restante */}
            {(() => {
              const total = MILESTONES.length
              const conquistados = conquered.length
              return (
                <>
                  <div className="bg-blue-400 h-3 rounded-l-full" style={{ width: `${(conquistados / total) * 100}%` }} />
                  <div className="bg-gray-200 h-3 rounded-r-full" style={{ width: `${((total - conquistados) / total) * 100}%` }} />
                </>
              )
            })()}
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-4">Acompanhe sua jornada de conquistas!</span>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
