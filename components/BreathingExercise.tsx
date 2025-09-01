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
  const wakeLockRef = useRef<any>(null)
  const lastUpdateTimeRef = useRef<number>(Date.now())

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

  // Timer principal - simplificado e mais confiável
  useEffect(() => {
    console.log('useEffect timer executado, isActive:', isActive, 'phase:', phase)
    let interval: NodeJS.Timeout

    if (isActive) {
      console.log('Criando interval timer')
      // Iniciar timer imediatamente quando ativo
      interval = setInterval(() => {
        console.log('Interval disparado')
        setTimer(prev => {
          console.log(`Timer atual: ${prev}, incrementando para: ${prev + 1}`)
          return prev + 1
        })
      }, 1000) // Timer simples de 1 segundo
    } else {
      console.log('Timer inativo, não criando interval')
    }

    return () => {
      console.log('Limpando interval')
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isActive])

  // Detectar mudanças de fase baseado no timer
  useEffect(() => {
    const phaseLength = currentTechnique.phases[phase]
    console.log(`Verificando mudança de fase: timer=${timer}, phase=${phase}, length=${phaseLength}`)
    
    if (timer >= phaseLength && isActive) {
      console.log('Mudando de fase...')
      
      // Feedback háptico nas transições
      if (phase === "inhale") {
        haptics.light()
        playBreathingSound(440, 0.2)
      } else if (phase === "exhale") {
        haptics.light()
        playBreathingSound(220, 0.2)
      }

      // Resetar timer e mudar fase
      setTimer(0)
      
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
    }
  }, [timer, phase, currentTechnique, haptics, soundEnabled, isActive])

  // Prevenir que a tela desligue durante o exercício
  useEffect(() => {
    const requestWakeLock = async () => {
      if (isActive && 'wakeLock' in navigator) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen')
          console.log('Wake Lock ativado')
        } catch (err) {
          console.log('Wake Lock não disponível:', err)
        }
      } else if (!isActive && wakeLockRef.current) {
        try {
          await wakeLockRef.current.release()
          wakeLockRef.current = null
          console.log('Wake Lock desativado')
        } catch (err) {
          console.log('Erro ao liberar Wake Lock:', err)
        }
      }
    }

    requestWakeLock()

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
        wakeLockRef.current = null
      }
    }
  }, [isActive])

  // Notificar conclusão de ciclos
  useEffect(() => {
    if (cycles > 0 && cycles % 5 === 0) {
      haptics.success()
      onComplete?.(cycles)
    }
  }, [cycles, haptics, onComplete])

  // Detectar quando a página perde/ganha foco
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Página perdeu foco - timer pode pausar')
      } else {
        console.log('Página ganhou foco - timer deve continuar')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const toggleBreathing = () => {
    console.log('toggleBreathing chamado, isActive atual:', isActive)
    
    if (!isActive) {
      // Resetar todos os estados
      setTimer(0)
      setPhase("inhale")
      setCycles(0)
      lastUpdateTimeRef.current = Date.now()
      haptics.medium()
      console.log('Iniciando exercício - Timer: 0, Phase: inhale')
      
      // Ativar imediatamente (sem setTimeout)
      setIsActive(true)
    } else {
      console.log('Pausando exercício')
      setIsActive(false)
    }
  }

  const reset = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimer(0)
    setCycles(0)
    lastUpdateTimeRef.current = Date.now() // Resetar timestamp
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

  const progress = Math.min(100, Math.max(0, ((timer + 1) / currentTechnique.phases[phase]) * 100))

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 ${className}`}>
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {currentTechnique.name}
        </h3>
        <p className="text-white/70 text-sm">
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
              className="text-white/20"
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
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>

          {/* Conteúdo Central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2 animate-pulse">
              {getPhaseEmoji()}
            </div>
            <div className={`text-3xl font-bold mb-1 transition-all duration-300 ${
              timer === currentTechnique.phases[phase] - 1
                ? 'text-purple-400 scale-110' 
                : 'text-white'
            }`}>
              {timer}
            </div>
            <div className="text-sm font-medium text-white/80 uppercase tracking-wide">
              {phase === "inhale" ? "Inspire" :
               phase === "hold" ? "Segure" :
               phase === "exhale" ? "Expire" : "Pause"}
            </div>
            <div className="text-xs text-white/60 mt-1">
              {currentTechnique.phases[phase]}s
            </div>
            {/* Status indicator */}
            <div className="text-xs text-white/60 mt-1">
              {isActive ? `${timer}s` : 'Pausado'}
            </div>
          </div>
        </div>
      </div>

      {/* Instrução */}
      <div className="text-center mb-6">
        <p className="text-white/90 font-medium text-lg leading-relaxed">
          {getPhaseInstruction()}
        </p>
      </div>

      {/* Estatísticas */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {cycles}
          </div>
          <div className="text-xs text-white/60">Ciclos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.floor(cycles * (Object.values(currentTechnique.phases).reduce((a, b) => a + b, 0)) / 60)}
          </div>
          <div className="text-xs text-white/60">Minutos</div>
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
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-purple-600/30 border border-purple-400/30 hover:bg-purple-600/50 text-white transition-all shadow-md"
        >
          <RotateCcw size={20} />
          Reset
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-purple-600/30 border border-purple-400/30 hover:bg-purple-600/50 text-white transition-all shadow-md"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Dicas */}
      <div className="mt-6 p-4 bg-purple-500/20 rounded-xl border border-purple-400/30">
        <h4 className="font-semibold text-purple-200 mb-2">💡 Dicas:</h4>
        <ul className="text-purple-100/90 text-sm space-y-1">
          <li>• Encontre uma posição confortável</li>
          <li>• Respire com o diafragma, não só com o peito</li>
          <li>• Foque apenas na respiração</li>
          <li>• 5-10 ciclos são suficientes para começar</li>
        </ul>
      </div>
    </div>
  )
}

