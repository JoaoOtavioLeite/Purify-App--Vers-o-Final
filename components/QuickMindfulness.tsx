"use client"

import { useState, useEffect, useRef } from "react"
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
  const lastUpdateTimeRef = useRef<number>(Date.now())

  const exercises: MindfulnessExercise[] = [
    {
      id: "5-4-3-2-1",
      title: "Técnica 5-4-3-2-1",
      description: "Ancoragem sensorial",
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
      description: "Relaxamento muscular",
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
      description: "Cultive compassão",
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
      description: "Foque nos sons",
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

  // Timer principal - sistema híbrido robusto
  useEffect(() => {
    console.log('useEffect timer executado, isActive:', isActive, 'selectedExercise:', selectedExercise)
    let interval: NodeJS.Timeout
    let animationFrame: number

    if (isActive && selectedExercise) {
      console.log('Criando timer robusto para mindfulness')
      lastUpdateTimeRef.current = Date.now()
      
      // Timer principal com setInterval
      interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - lastUpdateTimeRef.current
        
        console.log('Interval mindfulness disparado, elapsed:', elapsed)
        
        // Verificar se mais de 1 segundo passou
        if (elapsed >= 1000) {
          lastUpdateTimeRef.current = now
          
          setTimer(prev => {
            const newValue = prev + 1
            console.log(`Timer mindfulness: ${prev} -> ${newValue}`)
            return newValue
          })
        }
      }, 100) // Verificar a cada 100ms para maior precisão

      // Backup com requestAnimationFrame
      const animate = () => {
        if (isActive && selectedExercise) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      animate()
    } else {
      console.log('Timer mindfulness inativo, não criando interval')
    }

    return () => {
      console.log('Limpando timer mindfulness')
      if (interval) clearInterval(interval)
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [isActive, selectedExercise])

  // Detectar mudanças de passo baseado no timer
  useEffect(() => {
    if (!currentExercise || !isActive) return
    
    const stepDuration = currentExercise.duration / currentExercise.instructions.length
    const newStep = Math.floor(timer / stepDuration)
    
    console.log(`Verificando mudança de passo: timer=${timer}, stepDuration=${stepDuration}, newStep=${newStep}, currentStep=${currentStep}`)
    
    if (newStep !== currentStep && newStep < currentExercise.instructions.length) {
      console.log('Mudando para próximo passo...')
      setCurrentStep(newStep)
      haptics.light()
    }
    
    // Completar exercício
    if (timer >= currentExercise.duration) {
      console.log('Exercício concluído!')
      setIsActive(false)
      setIsCompleted(true)
      haptics.success()
      onComplete?.(currentExercise.id, timer)
    }
  }, [timer, currentExercise, currentStep, isActive, haptics, onComplete])

  const startExercise = (exerciseId: string) => {
    console.log('Iniciando exercício mindfulness:', exerciseId)
    setSelectedExercise(exerciseId)
    setCurrentStep(0)
    setTimer(0)
    setIsCompleted(false)
    lastUpdateTimeRef.current = Date.now() // Resetar timestamp
    setIsActive(true)  // Ativar imediatamente
    haptics.medium()
    console.log('Timer mindfulness ativado imediatamente')
  }

  const pauseResume = () => {
    console.log('pauseResume chamado, isActive atual:', isActive)
    setIsActive(!isActive)
    haptics.light()
  }

  const resetExercise = () => {
    setIsActive(false)
    setCurrentStep(0)
    setTimer(0)
    setIsCompleted(false)
    lastUpdateTimeRef.current = Date.now() // Resetar timestamp
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
      <div className={`bg-gradient-to-br from-gray-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            Mindfulness Rápido
          </h3>
          <p className="text-white/70 text-sm">
            Exercícios de 1-3 minutos para acalmar a mente
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => startExercise(exercise.id)}
              className="group p-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left hover:shadow-lg hover:bg-white/20 hover:border-white/30 h-[170px] overflow-hidden"
            >
              <div className="flex flex-col h-full justify-between">
                {/* Ícone e Título */}
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 flex-shrink-0">
                    {exercise.id === "5-4-3-2-1" && <Eye className="text-blue-400" size={18} />}
                    {exercise.id === "body-scan" && <Hand className="text-green-400" size={18} />}
                    {exercise.id === "loving-kindness" && <Heart className="text-pink-400" size={18} />}
                    {exercise.id === "mindful-listening" && <Ear className="text-purple-400" size={18} />}
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight flex-1 line-clamp-2">
                    {exercise.title}
                  </h4>
                </div>

                {/* Descrição */}
                <p className="text-white/70 text-xs leading-snug mb-3 flex-1 line-clamp-2">
                  {exercise.description}
                </p>

                {/* Info inferior */}
                <div className="flex items-center justify-between text-xs mt-auto">
                  <div className="flex items-center gap-1">
                    <Clock size={10} className="text-white/60" />
                    <span className="font-medium text-white/80 text-xs">
                      {Math.ceil(exercise.duration / 60)} min
                    </span>
                  </div>
                  <div className="font-medium px-2 py-1 rounded-full bg-white/20 text-white text-xs">
                    {exercise.instructions.length} passos
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            🧘‍♀️ Como usar:
          </h4>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Encontre um local tranquilo</li>
            <li>• Siga as instruções no seu ritmo</li>
            <li>• Não se preocupe em fazer "perfeitamente"</li>
            <li>• A prática regular traz melhores resultados</li>
          </ul>
        </div>

        {/* Seção Explicativa - Mindfulness vs Pornografia */}
        <div className="mt-6 p-5 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-xl border border-purple-300/30">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🛡️</div>
            <h4 className="font-bold text-white text-lg mb-2">
              Por que Mindfulness Combate a Pornografia?
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              O mindfulness é uma ferramenta poderosa na recuperação do vício em pornografia
            </p>
          </div>

          <div className="space-y-4">
            {/* Benefício 1 */}
            <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
              <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-300 text-sm font-bold">1</span>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm mb-1">
                  Aumenta a Consciência dos Gatilhos
                </h5>
                <p className="text-white/70 text-xs leading-relaxed">
                  Te ajuda a identificar pensamentos, emoções e situações que levam ao consumo de pornografia, criando um espaço entre o impulso e a ação.
                </p>
              </div>
            </div>

            {/* Benefício 2 */}
            <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
              <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-300 text-sm font-bold">2</span>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm mb-1">
                  Reduz a Ansiedade e o Estresse
                </h5>
                <p className="text-white/70 text-xs leading-relaxed">
                  Como ansiedade e estresse são gatilhos comuns, o mindfulness oferece alternativas saudáveis para lidar com essas emoções.
                </p>
              </div>
            </div>

            {/* Benefício 3 */}
            <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
              <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-300 text-sm font-bold">3</span>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm mb-1">
                  Fortalece o Autocontrole
                </h5>
                <p className="text-white/70 text-xs leading-relaxed">
                  A prática regular desenvolve a capacidade de observar impulsos sem agir automaticamente, fortalecendo sua força de vontade.
                </p>
              </div>
            </div>

            {/* Benefício 4 */}
            <div className="flex items-start gap-3 p-3 bg-white/10 rounded-lg">
              <div className="w-8 h-8 bg-pink-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-pink-300 text-sm font-bold">4</span>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm mb-1">
                  Promove Bem-estar Natural
                </h5>
                <p className="text-white/70 text-xs leading-relaxed">
                  Oferece uma fonte saudável de prazer e relaxamento, substituindo gradualmente a necessidade de estímulos artificiais.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-lg">💡</span>
              <h5 className="font-semibold text-white text-sm">Dica Importante:</h5>
            </div>
            <p className="text-white/80 text-xs leading-relaxed">
              Use estes exercícios sempre que sentir impulsos ou estiver em momentos de vulnerabilidade. 
              Com o tempo, sua mente aprenderá a buscar essas práticas naturalmente como alternativa saudável.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Tela de exercício ativo
  return (
    <div className={`bg-gradient-to-br from-gray-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={backToMenu}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          ← Voltar
        </button>
        <div className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
          {currentExercise?.title}
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white">
            Passo {currentStep + 1} de {currentExercise?.instructions.length}
          </span>
          <span className="text-sm text-white/70">
            {formatTime(timer)} / {formatTime(currentExercise?.duration || 0)}
            <span className="text-xs text-white/50 ml-2">
              ({isActive ? 'ATIVO' : 'PARADO'} - {timer}s)
            </span>
          </span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
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
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              Exercício Concluído!
            </h3>
            <p className="text-white/70">
              Parabéns! Você dedicou {Math.ceil((currentExercise?.duration || 0) / 60)} minutos para seu bem-estar mental.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              {currentExercise?.instructions[currentStep]}
            </h3>
            <p className="text-white/70 text-sm">
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
                  ? "bg-orange-500/80 hover:bg-orange-500 text-white backdrop-blur-sm" 
                  : "bg-green-500/80 hover:bg-green-500 text-white backdrop-blur-sm"
              }`}
            >
              {isActive ? "Pausar" : "Continuar"}
            </button>

            <button
              onClick={resetExercise}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white/20 hover:bg-white/30 text-white transition-all shadow-md backdrop-blur-sm border border-white/30"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={backToMenu}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-500/80 hover:bg-blue-500 text-white transition-all shadow-md backdrop-blur-sm"
            >
              Fazer Outro
            </button>
            <button
              onClick={() => startExercise(currentExercise.id)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-green-500/80 hover:bg-green-500 text-white transition-all shadow-md backdrop-blur-sm"
            >
              <RotateCcw size={20} />
              Repetir
            </button>
          </div>
        )}
      </div>

      {/* Lista de todos os passos */}
      <div className="space-y-2">
        <h4 className="font-semibold text-white text-sm mb-3">
          Todos os passos:
        </h4>
        {currentExercise?.instructions.map((instruction, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
              index === currentStep
                ? "bg-white/20 border-2 border-white/40"
                : index < currentStep
                ? "bg-green-500/20 border border-green-400/40"
                : "bg-white/10 border border-white/20"
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                ? "bg-white/30 text-white"
                : "bg-white/20 text-white/60"
            }`}>
              {index < currentStep ? <CheckCircle size={14} /> : index + 1}
            </div>
            <span className={`text-sm leading-relaxed ${
              index === currentStep
                ? "text-white font-medium"
                : index < currentStep
                ? "text-green-300"
                : "text-white/70"
            }`}>
              {instruction}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

