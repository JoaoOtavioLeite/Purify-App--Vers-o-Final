"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  Brain,
  Calendar,
  Star,
  Crown,
  X
} from "lucide-react"
import { useAddiction } from "@/contexts/AddictionContext"

interface QuizQuestion {
  id: string
  question: string
  options: Array<{
    id: string
    text: string
    value: number
  }>
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "gender",
    question: "Qual é o seu gênero?",
    options: [
      { id: "male", text: "Masculino", value: 0 },
      { id: "female", text: "Feminino", value: 0 }
    ]
  },
  {
    id: "frequency",
    question: "Com que frequência você consome pornografia?",
    options: [
      { id: "daily", text: "Mais de uma vez por dia", value: 4 },
      { id: "once-daily", text: "Uma vez por dia", value: 3 },
      { id: "few-week", text: "Algumas vezes por semana", value: 2 },
      { id: "less-week", text: "Menos de uma vez por semana", value: 1 }
    ]
  },
  {
    id: "age-exposure",
    question: "Com que idade você teve o primeiro contato com conteúdo explícito?",
    options: [
      { id: "young", text: "12 anos ou menos", value: 4 },
      { id: "teen-early", text: "13 a 16 anos", value: 3 },
      { id: "teen-late", text: "17 a 24 anos", value: 2 },
      { id: "adult", text: "25 anos ou mais", value: 1 }
    ]
  },
  {
    id: "escalation",
    question: "Você notou uma evolução para material mais extremo?",
    options: [
      { id: "yes", text: "Sim", value: 3 },
      { id: "no", text: "Não", value: 0 }
    ]
  },
  {
    id: "arousal-difficulty",
    question: "Você tem dificuldade para se excitar sem pornografia ou fantasia?",
    options: [
      { id: "frequently", text: "Frequentemente", value: 3 },
      { id: "occasionally", text: "Ocasionalmente", value: 2 },
      { id: "rarely", text: "Raramente ou nunca", value: 0 }
    ]
  },
  {
    id: "emotional-coping",
    question: "Você usa pornografia para lidar com desconforto emocional?",
    options: [
      { id: "frequently", text: "Frequentemente", value: 3 },
      { id: "occasionally", text: "Ocasionalmente", value: 2 },
      { id: "rarely", text: "Raramente ou nunca", value: 0 }
    ]
  },
  {
    id: "stress-trigger",
    question: "Você recorre à pornografia quando está estressado?",
    options: [
      { id: "frequently", text: "Frequentemente", value: 3 },
      { id: "occasionally", text: "Ocasionalmente", value: 2 },
      { id: "rarely", text: "Raramente ou nunca", value: 0 }
    ]
  },
  {
    id: "boredom-trigger",
    question: "Você assiste pornografia por tédio?",
    options: [
      { id: "frequently", text: "Frequentemente", value: 3 },
      { id: "occasionally", text: "Ocasionalmente", value: 2 },
      { id: "rarely", text: "Raramente ou nunca", value: 0 }
    ]
  },
  {
    id: "paid-content",
    question: "Você já gastou dinheiro para acessar conteúdo explícito?",
    options: [
      { id: "yes", text: "Sim", value: 2 },
      { id: "no", text: "Não", value: 0 }
    ]
  }
]

export function QuittrInspiredOnboarding() {
  const [currentStep, setCurrentStep] = useState<"welcome" | "quiz" | "calculating" | "results" | "plan" | "upgrade">("welcome")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { id: string, value: number }>>({})
  const [userName, setUserName] = useState("")
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [dependencyScore, setDependencyScore] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [countdownTime, setCountdownTime] = useState(300) // 5 minutos
  const { setAddictionType, setLastRelapseDate } = useAddiction()

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1

  const handleAnswerSelect = (option: { id: string, value: number }) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: option
    }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (isLastQuestion) {
        // Calcular pontuação e mostrar loading
        const totalScore = Object.values(newAnswers).reduce((sum, answer) => sum + answer.value, 0)
        const maxScore = quizQuestions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.value)), 0)
        const percentage = Math.round((totalScore / maxScore) * 100)
        
        setDependencyScore(percentage)
        setCurrentStep("calculating")
        
        // Simular cálculo
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setTimeout(() => setCurrentStep("results"), 500)
          }
          setCalculationProgress(progress)
        }, 200)
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, 300)
  }

  const handleContinueToApp = () => {
    // Configurar tipo de vício
    const pornographyType = {
      id: "pornography",
      name: "Pornografia", 
      icon: "🚫",
      color: "red",
      defaultReasons: [
        "A pornografia afeta negativamente meus relacionamentos e intimidade.",
        "Quero ter mais controle sobre meus impulsos e comportamentos.",
        "Desejo melhorar minha saúde mental e autoestima."
      ]
    }
    
    setAddictionType(pornographyType)
    setLastRelapseDate(new Date())
    
    setCurrentStep("plan")
  }

  const generateQuitDate = () => {
    const today = new Date()
    const quitDate = new Date(today.getTime() + (365 * 24 * 60 * 60 * 1000)) // 1 ano
    return quitDate.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Countdown timer effect
  useState(() => {
    if (showUpgradeModal) {
      const interval = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 0) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Estrelas decorativas */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">PURIFY</h1>
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="text-yellow-400 fill-current" size={20} />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Bem-vindo!</h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Vamos começar descobrindo se você tem um problema com pornografia
            </p>
          </div>

          {/* Ilustração mountain landscape inspirada no QUITTR */}
          <div className="w-64 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600 to-pink-400 rounded-t-full"></div>
            <div className="absolute bottom-0 left-1/4 w-1/2 h-3 bg-yellow-300 rounded-full"></div>
          </div>

          <button
            onClick={() => setCurrentStep("quiz")}
            className="bg-white hover:bg-gray-100 text-purple-800 font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
          >
            Iniciar Quiz <ArrowRight size={20} />
          </button>

          <div className="mt-6 space-y-2">
            <button className="text-white/60 hover:text-white transition-colors block mx-auto">
              Já possui conta?
            </button>
            <button className="text-white/60 hover:text-white transition-colors block mx-auto">
              Tenho um código
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 p-4 relative overflow-hidden">
        {/* Progress bar */}
        <div className="pt-12 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => currentQuestionIndex > 0 ? setCurrentQuestionIndex(prev => prev - 1) : setCurrentStep("welcome")}
              className="text-white p-2"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <span className="text-white text-sm">🇧🇷 PT</span>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            Questão #{currentQuestionIndex + 1}
          </h2>
          
          <p className="text-white text-lg mb-8 leading-relaxed">
            {currentQuestion.question}
          </p>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option)}
                className="w-full p-4 bg-indigo-800/50 hover:bg-indigo-700/50 border border-indigo-600 rounded-2xl text-white text-left transition-all transform hover:scale-102 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-indigo-900 font-bold">
                  {index + 1}
                </div>
                <span>{option.text}</span>
              </button>
            ))}
          </div>

          <button className="w-full mt-8 text-white/60 hover:text-white transition-colors">
            Pular teste
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === "calculating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex flex-col items-center justify-center p-4">
        <button 
          onClick={() => setCurrentStep("quiz")}
          className="absolute top-16 left-4 text-white p-2"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-green-400 rounded-full transition-all duration-300"
              style={{ 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + (calculationProgress/100) * 50}% 0%, ${50 + (calculationProgress/100) * 50 * Math.cos(2 * Math.PI * calculationProgress/100)}% ${50 - (calculationProgress/100) * 50 * Math.sin(2 * Math.PI * calculationProgress/100)}%, 50% 50%)`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{Math.round(calculationProgress)}%</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Calculando</h2>
          <p className="text-white/80">Analisando seus triggers de recaída</p>
        </div>
      </div>
    )
  }

  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 p-4">
        <button 
          onClick={() => setCurrentStep("quiz")}
          className="absolute top-16 left-4 text-white p-2"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="max-w-md mx-auto pt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              Análise Completa <CheckCircle className="text-green-400" size={32} />
            </h2>
            <p className="text-white/80 mb-6">
              Temos algumas notícias para compartilhar com você...
            </p>
            
            <p className="text-white text-lg mb-8">
              Suas respostas indicam uma <strong>clara dependência</strong> de pornografia na internet*
            </p>
          </div>

          {/* Gráfico de comparação */}
          <div className="mb-8">
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-16 h-32 bg-red-500 rounded-lg mb-2 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-red-600 rounded-lg" style={{ height: `${dependencyScore}%` }}></div>
                </div>
                <span className="text-white text-sm">Seu Score</span>
              </div>
              <div className="text-center">
                <div className="w-16 h-32 bg-green-500 rounded-lg mb-2 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-green-600 rounded-lg" style={{ height: '40%' }}></div>
                </div>
                <span className="text-white text-sm">Média</span>
              </div>
            </div>
            
            <p className="text-center text-red-400 font-bold text-lg mb-2">
              {dependencyScore}% maior dependência de pornografia 📈
            </p>
            <p className="text-center text-white/60 text-xs">
              * Este resultado é apenas uma indicação, não um diagnóstico médico.
            </p>
          </div>

          <button
            onClick={handleContinueToApp}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl mb-4 transition-all"
          >
            Verificar seus sintomas
          </button>
        </div>
      </div>
    )
  }

  if (currentStep === "plan") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            {userName || "João Otávio"}, criamos um plano personalizado para você.
          </h2>

          <p className="text-white/80 mb-8">
            Você conseguirá parar com a pornografia até:
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <div className="text-2xl font-bold text-white">
              {generateQuitDate()}
            </div>
          </div>

          <hr className="border-white/20 mb-8" />

          {/* Benefícios */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-center">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white">
              Torne-se a melhor versão de si mesmo com o PURIFY
            </h3>
            <p className="text-white/80">
              Mais forte. Mais saudável. Mais feliz.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                "🦾 Aumento da Testosterona",
                "🩺 Previne Disfunção Erétil", 
                "⚡ Aumento da Energia",
                "🎯 Aumento da Motivação",
                "🧠 Melhora do Foco",
                "💪 Aumento da Confiança"
              ].map((benefit, index) => (
                <div key={index} className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-medium">
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="w-full bg-white hover:bg-gray-100 text-indigo-800 font-bold py-4 px-6 rounded-2xl mb-4 transition-all"
          >
            Tornar-se um PURIFIER
          </button>

          <div className="text-white/60 text-sm space-y-1">
            <p>A compra aparece discretamente</p>
            <p>Cancele a qualquer momento ✅ Pare com a pornografia definitivamente 🛡️</p>
          </div>
        </div>
      </div>
    )
  }

  // Modal de upgrade inspirado no QUITTR
  if (showUpgradeModal) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center p-4 z-50">
        <div className="max-w-md w-full text-center">
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="absolute top-6 right-6 text-white p-2"
          >
            <X size={24} />
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">PURIFY</h1>
            <h2 className="text-3xl font-bold text-white mb-4">
              OFERTA ÚNICA
            </h2>
            <p className="text-white/80">
              Você nunca mais verá isso novamente.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 mb-6">
            <div className="text-6xl font-bold text-white mb-2">
              67%
            </div>
            <div className="text-white text-lg">
              DESCONTO
            </div>
          </div>

          <p className="text-white text-lg mb-2">
            Esta oferta expira em
          </p>
          <div className="text-4xl font-bold text-white mb-8">
            {formatTime(countdownTime)}
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 mb-6">
            <div className="text-white/80 text-sm mb-1">MENOR PREÇO DE TODOS OS TEMPOS</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-bold">Anual</div>
                <div className="text-white/80 text-sm">12 meses • R$ 79,90</div>
              </div>
              <div className="text-white font-bold text-xl">
                R$ 6,66/mês
              </div>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl mb-4 transition-all">
            GARANTIR SUA OFERTA AGORA
          </button>

          <div className="text-white/60 text-sm">
            Cancele a qualquer momento • Pare com a pornografia definitivamente
          </div>
        </div>
      </div>
    )
  }

  return null
}
