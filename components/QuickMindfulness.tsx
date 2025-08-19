"use client"

import { useState, useEffect } from "react"
import { Eye, Ear, Hand, Heart, Clock, CheckCircle, RotateCcw } from "lucide-react"
import { useHaptics } from "@/lib/haptics"

interface MindfulnessExercise {
  id: string
  title: string
  description: string
  instructions: string[]
  duration: number // em segundos
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
}

interface QuickMindfulnessProps {
  onComplete?: (exerciseId: string, duration: number) => void
  className?: string
}

export function QuickMindfulness({ onComplete, className = "" }: QuickMindfulnessProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const haptics = useHaptics()

  const exercises: MindfulnessExercise[] = [
    {
      id: "5-4-3-2-1",
      title: "Técnica 5-4-3-2-1",
      description: "Ancoragem sensorial para ansiedade",
      instructions: [
        "Olhe ao redor e identifique 5 coisas que você PODE VER",
        "Identifique 4 coisas que você PODE TOCAR",
        "Identifique 3 coisas que você PODE OUVIR",
        "Identifique 2 coisas que você PODE CHEIRAR",
        "Identifique 1 coisa que você PODE SABOREAR"
      ],
      duration: 180, // 3 minutos
      icon: <Eye className="text-blue-600" size={24} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "body-scan",
      title: "Scan Corporal Rápido",
      description: "Relaxamento muscular progressivo",
      instructions: [
        "Respire fundo e relaxe os músculos do rosto",
        "Relaxe os ombros e deixe-os descer naturalmente",
        "Solte a tensão dos braços e mãos",
        "Relaxe o peito e o abdômen",
        "Libere toda tensão das pernas e pés"
      ],
      duration: 120, // 2 minutos
      icon: <Hand className="text-green-600" size={24} />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "loving-kindness",
      title: "Bondade Amorosa",
      description: "Cultive compassão e autoamor",
      instructions: [
        "Pense em alguém que você ama incondicionalmente",
        "Envie a si mesmo os mesmos sentimentos de amor",
        "Estenda esse amor para alguém neutro em sua vida",
        "Inclua alguém com quem você tem dificuldades",
        "Expanda para toda a humanidade"
      ],
      duration: 150, // 2.5 minutos
      icon: <Heart className="text-pink-600" size={24} />,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      id: "mindful-listening",
      title: "Escuta Mindful",
      description: "Foque completamente nos sons",
      instructions: [
        "Feche os olhos e ouça os sons mais próximos",
        "Expanda para sons de média distância",
        "Ouça os sons mais distantes que conseguir",
        "Volte para os sons próximos",
        "Abra os olhos lentamente"
      ],
      duration: 90, // 1.5 minutos
      icon: <Ear className="text-purple-600" size={24} />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ]

  const currentExercise = exercises.find(ex => ex.id === selectedExercise)

  // Timer para o exercício
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && currentExercise) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1
          
          // Avançar para próximo passo baseado no tempo
          const stepDuration = currentExercise.duration / currentExercise.instructions.length
          const newStep = Math.floor(newTime / stepDuration)
          
          if (newStep !== currentStep && newStep < currentExercise.instructions.length) {
            setCurrentStep(newStep)
            haptics.light()
          }
          
          // Completar exercício
          if (newTime >= currentExercise.duration) {
            setIsActive(false)
            setIsCompleted(true)
            haptics.success()
            onComplete?.(currentExercise.id, newTime)
            return currentExercise.duration
          }
          
          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isActive, currentExercise, currentStep, haptics, onComplete])

  const startExercise = (exerciseId: string) => {
    setSelectedExercise(exerciseId)
    setCurrentStep(0)
    setTimer(0)
    setIsActive(true)
    setIsCompleted(false)
    haptics.medium()
  }

  const pauseResume = () => {
    setIsActive(!isActive)
    haptics.light()
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentStep(0)
    setTimer(0)
    setIsCompleted(false)
    haptics.light()
  }

  const backToMenu = () => {
    setSelectedExercise(null)
    resetExercise()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!currentExercise) return 0
    return (timer / currentExercise.duration) * 100
  }

  // Tela de seleção de exercícios
  if (!selectedExercise) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Mindfulness Rápido
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Exercícios de 1-3 minutos para acalmar a mente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => startExercise(exercise.id)}
              className={`group p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 text-left ${exercise.bgColor} ${exercise.borderColor} hover:shadow-lg`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 ${exercise.bgColor} rounded-xl flex items-center justify-center border ${exercise.borderColor}`}>
                  {exercise.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold ${exercise.color} mb-1`}>
                    {exercise.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {exercise.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.ceil(exercise.duration / 60)} min
                  </span>
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${exercise.bgColor} ${exercise.color}`}>
                  {exercise.instructions.length} passos
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">🧘‍♀️ Como usar:</h4>
          <ul className="text-indigo-700 dark:text-indigo-300 text-sm space-y-1">
            <li>• Encontre um local tranquilo</li>
            <li>• Siga as instruções no seu ritmo</li>
            <li>• Não se preocupe em fazer "perfeitamente"</li>
            <li>• A prática regular traz melhores resultados</li>
          </ul>
        </div>
      </div>
    )
  }

  // Tela de exercício ativo
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={backToMenu}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          ← Voltar
        </button>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentExercise?.bgColor} ${currentExercise?.color}`}>
          {currentExercise?.title}
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Passo {currentStep + 1} de {currentExercise?.instructions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatTime(timer)} / {formatTime(currentExercise?.duration || 0)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* Instrução Atual */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">
          {isCompleted ? "✨" : "🧘‍♀️"}
        </div>
        
        {isCompleted ? (
          <div>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              Exercício Concluído!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Parabéns! Você dedicou {Math.ceil((currentExercise?.duration || 0) / 60)} minutos para seu bem-estar mental.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              {currentExercise?.instructions[currentStep]}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Respire calmamente e siga a instrução no seu próprio ritmo
            </p>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex justify-center gap-3 mb-6">
        {!isCompleted ? (
          <>
            <button
              onClick={pauseResume}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
                isActive 
                  ? "bg-orange-500 hover:bg-orange-600 text-white" 
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {isActive ? "Pausar" : "Continuar"}
            </button>

            <button
              onClick={resetExercise}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all shadow-md"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={backToMenu}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md"
            >
              Fazer Outro
            </button>
            <button
              onClick={() => startExercise(currentExercise.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-green-500 hover:bg-green-600 text-white transition-all shadow-md"
            >
              <RotateCcw size={20} />
              Repetir
            </button>
          </div>
        )}
      </div>

      {/* Lista de todos os passos */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">
          Todos os passos:
        </h4>
        {currentExercise?.instructions.map((instruction, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              index === currentStep
                ? `${currentExercise.bgColor} ${currentExercise.borderColor} border-2`
                : index < currentStep
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                ? `${currentExercise.color.replace('text-', 'bg-')} text-white`
                : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
            }`}>
              {index < currentStep ? <CheckCircle size={14} /> : index + 1}
            </div>
            <span className={`text-sm leading-relaxed ${
              index === currentStep
                ? currentExercise.color
                : index < currentStep
                ? "text-green-700 dark:text-green-300"
                : "text-gray-600 dark:text-gray-400"
            }`}>
              {instruction}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

