"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useHaptics } from "@/lib/haptics"

interface BreathingExerciseProps {
  technique?: "4-7-8" | "box" | "4-4-4" | "triangle"
  autoStart?: boolean
  onComplete?: (cycles: number) => void
  className?: string
}

export function BreathingExercise({ 
  technique = "4-7-8", 
  autoStart = false,
  onComplete,
  className = ""
}: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(autoStart)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale")
  const [timer, setTimer] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const haptics = useHaptics()
  const audioContextRef = useRef<AudioContext | null>(null)

  // Configurações das técnicas
  const techniques = {
    "4-7-8": {
      name: "4-7-8 (Relaxamento)",
      description: "Ideal para acalmar e reduzir ansiedade",
      phases: { inhale: 4, hold: 7, exhale: 8, pause: 2 },
      color: "from-blue-400 to-cyan-500"
    },
    "box": {
      name: "Box Breathing (Foco)",
      description: "Perfeito para concentração e controle",
      phases: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
      color: "from-purple-400 to-indigo-500"
    },
    "4-4-4": {
      name: "4-4-4 (Energia)",
      description: "Energiza e desperta a mente",
      phases: { inhale: 4, hold: 4, exhale: 4, pause: 0 },
      color: "from-orange-400 to-red-500"
    },
    "triangle": {
      name: "Triangle (Básico)",
      description: "Simples e eficaz para iniciantes",
      phases: { inhale: 3, hold: 3, exhale: 3, pause: 0 },
      color: "from-green-400 to-emerald-500"
    }
  }

  const currentTechnique = techniques[technique]

  // Gerar sons simples usando Web Audio API
  const playBreathingSound = (frequency: number, duration: number) => {
    if (!soundEnabled) return

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + duration)
    } catch (error) {
      // Silenciosamente falhar se Web Audio não estiver disponível
    }
  }

  // Timer principal
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1
          const phaseLength = currentTechnique.phases[phase]
          
          if (newTime >= phaseLength) {
            // Feedback háptico nas transições
            if (phase === "inhale") {
              haptics.light()
              playBreathingSound(440, 0.2) // A4 note
            } else if (phase === "exhale") {
              haptics.light()
              playBreathingSound(220, 0.2) // A3 note
            }

            // Próxima fase
            if (phase === "inhale") {
              setPhase(currentTechnique.phases.hold > 0 ? "hold" : "exhale")
            } else if (phase === "hold") {
              setPhase("exhale")
            } else if (phase === "exhale") {
              if (currentTechnique.phases.pause > 0) {
                setPhase("pause")
              } else {
                setPhase("inhale")
                setCycles(prev => prev + 1)
              }
            } else if (phase === "pause") {
              setPhase("inhale")
              setCycles(prev => prev + 1)
            }
            
            return 0
          }
          
          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, phase, currentTechnique, haptics, soundEnabled])

  // Notificar conclusão de ciclos
  useEffect(() => {
    if (cycles > 0 && cycles % 5 === 0) {
      haptics.success()
      onComplete?.(cycles)
    }
  }, [cycles, haptics, onComplete])

  const toggleBreathing = () => {
    setIsActive(!isActive)
    if (!isActive) {
      haptics.medium()
    }
  }

  const reset = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimer(0)
    setCycles(0)
    haptics.light()
  }

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Inspire pelo nariz profundamente"
      case "hold":
        return "Segure a respiração calmamente"
      case "exhale":
        return "Expire lentamente pela boca"
      case "pause":
        return "Pause naturalmente"
    }
  }

  const getPhaseEmoji = () => {
    switch (phase) {
      case "inhale":
        return "🌬️"
      case "hold":
        return "⏸️"
      case "exhale":
        return "💨"
      case "pause":
        return "⭕"
    }
  }

  const progress = (timer / currentTechnique.phases[phase]) * 100

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {currentTechnique.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {currentTechnique.description}
        </p>
      </div>

      {/* Círculo de Respiração */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Círculo de progresso */}
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            {/* Fundo */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progresso */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#breathing-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-in-out"
            />
            {/* Gradiente */}
            <defs>
              <linearGradient id="breathing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Conteúdo Central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2 animate-pulse">
              {getPhaseEmoji()}
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {timer}
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {phase === "inhale" ? "Inspire" :
               phase === "hold" ? "Segure" :
               phase === "exhale" ? "Expire" : "Pause"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {currentTechnique.phases[phase]}s
            </div>
          </div>
        </div>
      </div>

      {/* Instrução */}
      <div className="text-center mb-6">
        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg leading-relaxed">
          {getPhaseInstruction()}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {cycles}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Ciclos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.floor(cycles * (Object.values(currentTechnique.phases).reduce((a, b) => a + b, 0)) / 60)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Minutos</div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleBreathing}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
            isActive 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          {isActive ? "Pausar" : "Começar"}
        </button>

        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all shadow-md"
        >
          <RotateCcw size={20} />
          Reset
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all shadow-md"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Dicas */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Dicas:</h4>
        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <li>• Encontre uma posição confortável</li>
          <li>• Respire com o diafragma, não só com o peito</li>
          <li>• Foque apenas na respiração</li>
          <li>• 5-10 ciclos são suficientes para começar</li>
        </ul>
      </div>
    </div>
  )
}

