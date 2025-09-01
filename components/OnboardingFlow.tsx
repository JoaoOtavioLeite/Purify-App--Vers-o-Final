"use client"

import { useState, useEffect, useMemo } from "react"
import { useAddiction, ADDICTION_TYPES, type AddictionType } from "@/contexts/AddictionContext"
import { usePremium } from "@/contexts/PremiumContext"
import { ChevronRight, ChevronLeft, Calendar, Clock, Edit3, ArrowLeft, Brain } from "lucide-react"

export function OnboardingFlow() {
  const { data, updateData, setAddictionType, setLastRelapseDate } = useAddiction()
  const { updateUser } = usePremium()
  const [step, setStep] = useState(1)
  const [relapseDate, setRelapseDate] = useState("")
  const [relapseTime, setRelapseTime] = useState("")
  const [assessmentCompleted, setAssessmentCompleted] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<any>(null)
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Posições fixas para as estrelas para evitar erro de hydration
  const starPositions = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3
    })), [isClient]
  )

  // Detectar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Questionário científico completo para avaliação de dependência pornográfica
  const onboardingQuestions = [
    {
      id: "frequency",
      question: "Com que frequência você consome pornografia?",
      options: [
        { id: "multiple-daily", text: "Várias vezes por dia", score: 25 },
        { id: "daily", text: "Uma vez por dia", score: 20 },
        { id: "few-weekly", text: "3-4 vezes por semana", score: 15 },
        { id: "weekly", text: "1-2 vezes por semana", score: 10 },
        { id: "monthly", text: "Algumas vezes por mês", score: 5 },
        { id: "rarely", text: "Raramente", score: 2 }
      ]
    },
    {
      id: "duration",
      question: "Há quanto tempo consome pornografia regularmente?",
      options: [
        { id: "over-10-years", text: "Mais de 10 anos", score: 25 },
        { id: "5-10-years", text: "5 a 10 anos", score: 20 },
        { id: "2-5-years", text: "2 a 5 anos", score: 15 },
        { id: "1-2-years", text: "1 a 2 anos", score: 10 },
        { id: "months", text: "Alguns meses", score: 5 },
        { id: "recent", text: "Comecei recentemente", score: 2 }
      ]
    },
    {
      id: "control",
      question: "Você consegue parar quando decide?",
      options: [
        { id: "never", text: "Nunca consigo parar", score: 25 },
        { id: "rarely", text: "Raramente consigo", score: 20 },
        { id: "sometimes", text: "Às vezes consigo", score: 15 },
        { id: "usually", text: "Geralmente consigo", score: 10 },
        { id: "always", text: "Sempre consigo parar", score: 0 }
      ]
    },
    {
      id: "escalation",
      question: "Precisa de conteúdo mais explícito para se satisfazer?",
      options: [
        { id: "always-extreme", text: "Sim, sempre busco mais extremo", score: 25 },
        { id: "often-extreme", text: "Frequentemente", score: 20 },
        { id: "sometimes-extreme", text: "Às vezes", score: 15 },
        { id: "rarely-extreme", text: "Raramente", score: 5 },
        { id: "never-extreme", text: "Nunca", score: 0 }
      ]
    },
    {
      id: "time-spent",
      question: "Quanto tempo gasta consumindo por sessão?",
      options: [
        { id: "over-3-hours", text: "Mais de 3 horas", score: 25 },
        { id: "1-3-hours", text: "1 a 3 horas", score: 20 },
        { id: "30min-1hour", text: "30 minutos a 1 hora", score: 15 },
        { id: "15-30min", text: "15 a 30 minutos", score: 10 },
        { id: "under-15min", text: "Menos de 15 minutos", score: 5 }
      ]
    },
    {
      id: "work-impact",
      question: "Afeta seu trabalho ou estudos?",
      options: [
        { id: "severely-affects", text: "Afeta muito meu desempenho", score: 25 },
        { id: "noticeable-impact", text: "Impacto perceptível", score: 20 },
        { id: "some-impact", text: "Algum impacto", score: 15 },
        { id: "little-impact", text: "Pouco impacto", score: 10 },
        { id: "no-impact", text: "Não afeta", score: 0 }
      ]
    },
    {
      id: "relationship-impact",
      question: "Como afeta seus relacionamentos íntimos?",
      options: [
        { id: "destroyed-relationships", text: "Prejudicou/terminou relacionamentos", score: 25 },
        { id: "serious-problems", text: "Causa problemas sérios", score: 20 },
        { id: "some-issues", text: "Causa alguns problemas", score: 15 },
        { id: "minor-issues", text: "Problemas menores", score: 10 },
        { id: "no-relationship-impact", text: "Não afeta", score: 0 }
      ]
    },
    {
      id: "emotional-state",
      question: "Como se sente após consumir?",
      options: [
        { id: "shame-guilt", text: "Muita culpa e vergonha", score: 25 },
        { id: "regret", text: "Arrependimento", score: 20 },
        { id: "neutral", text: "Neutro", score: 10 },
        { id: "satisfied", text: "Satisfeito", score: 5 },
        { id: "positive", text: "Bem", score: 0 }
      ]
    },
    {
      id: "attempts-quit",
      question: "Quantas vezes tentou parar seriamente?",
      options: [
        { id: "many-attempts", text: "Mais de 10 tentativas", score: 25 },
        { id: "several-attempts", text: "5 a 10 tentativas", score: 20 },
        { id: "few-attempts", text: "2 a 4 tentativas", score: 15 },
        { id: "one-attempt", text: "1 tentativa séria", score: 10 },
        { id: "no-attempts", text: "Nunca tentei parar", score: 5 }
      ]
    },
    {
      id: "withdrawal-symptoms",
      question: "Sente sintomas quando fica sem consumir?",
      options: [
        { id: "severe-symptoms", text: "Ansiedade, irritação, depressão severas", score: 25 },
        { id: "moderate-symptoms", text: "Sintomas moderados", score: 20 },
        { id: "mild-symptoms", text: "Sintomas leves", score: 15 },
        { id: "minimal-symptoms", text: "Muito pouco", score: 5 },
        { id: "no-symptoms", text: "Nenhum sintoma", score: 0 }
      ]
    }
  ]

  // Resetar estado interno quando o componente é montado
  useEffect(() => {
    setStep(1)
    setRelapseDate("")
    setRelapseTime("")
    // Automaticamente definir pornografia como vício
    const pornographyAddiction = ADDICTION_TYPES.find(a => a.id === "pornography")
    if (pornographyAddiction) {
      setAddictionType(pornographyAddiction)
    }
  }, [])




  const handleDateTimeSubmit = () => {
    if (relapseDate && relapseTime) {
      const dateTime = new Date(`${relapseDate}T${relapseTime}`)
      setLastRelapseDate(dateTime)
      setStep(4) // Vai para avaliação agora
    }
  }

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum: number, answer: any) => {
      return sum + (answer?.score || 0)
    }, 0)
    
    const maxPossibleScore = onboardingQuestions.reduce((sum, q) => 
      sum + Math.max(...q.options.map(o => o.score)), 0
    )
    
    const percentage = Math.round((totalScore / maxPossibleScore) * 100)
    
    // Sistema de classificação mais detalhado
    let level = "minimal"
    let levelText = "Mínimo"
    let recommendation = ""
    let riskLevel = "low"
    
    if (percentage >= 80) {
      level = "severe"
      levelText = "Severo"
      recommendation = "Dependência severa. Recomendamos buscar ajuda profissional imediatamente."
      riskLevel = "critical"
    } else if (percentage >= 65) {
      level = "high"
      levelText = "Alto"
      recommendation = "Dependência significativa. Considere combinar o app com terapia profissional."
      riskLevel = "high"
    } else if (percentage >= 45) {
      level = "moderate"
      levelText = "Moderado"
      recommendation = "Dependência moderada. O app será muito eficaz para sua recuperação."
      riskLevel = "medium"
    } else if (percentage >= 25) {
      level = "mild"
      levelText = "Leve"
      recommendation = "Dependência leve. Você tem boas chances de controle com o app."
      riskLevel = "low"
    } else {
      level = "minimal"
      levelText = "Mínimo"
      recommendation = "Risco baixo. Use o app para prevenção e manutenção de hábitos saudáveis."
      riskLevel = "minimal"
    }
    
    return { 
      score: totalScore, 
      percentage, 
      level, 
      levelText, 
      recommendation, 
      riskLevel,
      maxScore: maxPossibleScore 
    }
  }

  const handleAnswerSelect = (option: any) => {
    const currentQuestion = onboardingQuestions[currentQuestionIndex]
    const newAnswers = { ...answers, [currentQuestion.id]: option }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentQuestionIndex < onboardingQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        setStep(6) // Vai para cálculo dos resultados
        
        // Simular cálculo
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5
          setCalculationProgress(Math.min(progress, 100))
          
          if (progress >= 100) {
            clearInterval(interval)
            const calculatedResult = calculateResults()
            setAssessmentResult(calculatedResult)
            
            // Salvar resultado no contexto premium
            updateUser({
              assessmentCompleted: true,
              assessmentScore: calculatedResult.percentage,
              assessmentLevel: calculatedResult.level as any
            })
            
            setTimeout(() => setStep(7), 500) // Vai para resultados
          }
        }, 100)
      }
    }, 300)
  }

  const completeOnboarding = () => {
    updateData({
      isOnboarded: true,
    })
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Stars background */}
        {isClient && (
          <div className="absolute inset-0">
            {starPositions.map((star, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center mb-12 relative z-10">
          <img 
            src="/512.png" 
            alt="Purify Logo" 
            className="w-28 h-28 mx-auto mb-8 object-contain drop-shadow-2xl animate-float"
          />
          <h1 className="text-5xl font-bold mb-6 text-white">Purify</h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Sua jornada de libertação da pornografia começa aqui. Vamos te ajudar a recuperar o controle, 
            fortalecer relacionamentos e construir uma vida mais saudável e plena.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4 relative z-10">
          <button
            onClick={() => setStep(3)}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 rounded-full text-lg transition-all shadow-lg flex items-center justify-center gap-3 button-press"
          >
            Começar Jornada de Liberdade
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" size={16} />
            </div>
          </button>

          <p className="text-center text-white/60 text-sm">🔒 Seus dados são privados e seguros</p>
        </div>
      </div>
    )
  }



  if (step === 3) {
    return (
      <div className="min-h-screen px-6 py-8 relative overflow-hidden">
        {/* Stars background */}
        {isClient && (
          <div className="absolute inset-0">
            {starPositions.slice(0, 30).map((star, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-8 relative z-10">
          {/* Botão de voltar removido */}
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: "50%" }}
              />
            </div>
          </div>
        </div>
        <div className="mb-8 relative z-10">
          <h2 className="text-3xl font-bold mb-3 text-white">Última vez</h2>
          <p className="text-white/80">
            Quando foi a última vez que você assistiu pornografia? Isso nos ajudará a calcular seu progresso de recuperação.
          </p>
        </div>

        <div className="space-y-6 mb-8 relative z-10">
          <div>
            <label className="block text-sm font-medium mb-3 text-white/90">Data da última vez que assistiu pornografia</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none" size={20} />
              <input
                type="date"
                value={relapseDate}
                onChange={(e) => setRelapseDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                placeholder="dd/mm/aaaa"
                className="w-full glass-card py-4 pl-12 pr-4 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all text-base md:text-lg placeholder-white/50"
                style={{ minHeight: 56 }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-white/90">Horário aproximado</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none" size={20} />
              <input
                type="time"
                value={relapseTime}
                onChange={(e) => setRelapseTime(e.target.value)}
                placeholder="hh:mm"
                className="w-full glass-card py-4 pl-12 pr-4 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all text-base md:text-lg placeholder-white/50"
                style={{ minHeight: 56 }}
              />
            </div>
          </div>

          <div className="glass-card p-4">
            <p className="text-sm text-cyan-300">
              💡 <strong>Dica:</strong> Seja honesto com a data e horário. Isso nos ajudará a calcular seu progresso real de recuperação e fornecer o melhor suporte para sua jornada.
            </p>
          </div>
        </div>

        <button
          onClick={handleDateTimeSubmit}
          disabled={!relapseDate || !relapseTime}
          className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all relative z-10 ${
            relapseDate && relapseTime
              ? "bg-cyan-400 hover:bg-cyan-300 text-gray-900 button-press"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Definir Data
          <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-white" size={16} />
          </div>
        </button>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Stars background */}
        {isClient && (
          <div className="absolute inset-0">
            {starPositions.slice(0, 40).map((star, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center relative z-10 max-w-md">
          <div className="w-20 h-20 glass-card flex items-center justify-center mb-6 mx-auto">
            <div className="text-4xl">🧠</div>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-white">Agora vamos te conhecer melhor</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Para criar um plano personalizado de recuperação, precisamos entender melhor seu perfil e nível de dependência.
          </p>

          <div className="glass-card p-6 mb-8">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <span className="text-xl">📋</span>
              O que vamos fazer:
            </h3>
            <ul className="text-white/80 text-sm space-y-2 text-left">
              <li>• Questionário científico (10 perguntas)</li>
              <li>• Análise detalhada do nível de dependência</li>
              <li>• Relatório personalizado completo</li>
              <li>• Plano de recuperação específico</li>
              <li>• Tutorial das funcionalidades do app</li>
            </ul>
          </div>

          <button
            onClick={() => setStep(5)}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-gray-900 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all button-press"
          >
            Começar Avaliação
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" size={16} />
            </div>
          </button>

          <p className="text-white/60 text-sm mt-4">🔒 Suas respostas são privadas e seguras</p>
        </div>
      </div>
    )
  }

  if (step === 5) {
    const currentQuestion = onboardingQuestions[currentQuestionIndex]
    const progressPercentage = ((currentQuestionIndex + 1) / onboardingQuestions.length) * 100

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-4 pt-12">
          {/* Header com progresso */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => currentQuestionIndex > 0 ? setCurrentQuestionIndex(prev => prev - 1) : setStep(4)}
              className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-white/80 text-sm px-3 py-1 bg-white/10 rounded-full">
                  {currentQuestionIndex + 1}/{onboardingQuestions.length}
                </span>
              </div>
              <div className="bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div key={currentQuestionIndex} className="animate-slide-up">
              <h1 className="text-2xl font-bold text-white mb-8 text-center">
                Pergunta {currentQuestionIndex + 1}
              </h1>
              
              <h2 className="text-xl text-white mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="w-full p-4 glass-card text-white text-left transition-all transform hover:scale-[1.02] flex items-center gap-3 button-press"
                  >
                    <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 6) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Progress Circle */}
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${calculationProgress * 2.83} 283`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{Math.round(calculationProgress)}%</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">Analisando suas respostas</h2>
          <p className="text-white/80 text-lg">Criando seu perfil personalizado...</p>
        </div>
      </div>
    )
  }

  if (step === 7 && assessmentResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-md">
          <div className="animate-spring-in space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Relatório Completo</h1>
              <p className="text-white/80 text-sm">Análise baseada em 10 critérios científicos</p>
            </div>
            
            {/* Score Principal */}
            <div className="glass-card p-6 text-center">
              <div className="flex justify-center items-end gap-6 mb-6">
                <div className="text-center">
                  <div 
                    className={`rounded-t-lg mx-auto mb-2 transition-all duration-1000 ${
                      assessmentResult.riskLevel === 'critical' ? 'bg-red-500' :
                      assessmentResult.riskLevel === 'high' ? 'bg-orange-500' :
                      assessmentResult.riskLevel === 'medium' ? 'bg-yellow-500' :
                      assessmentResult.riskLevel === 'low' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: '80px', height: `${Math.max(assessmentResult.percentage * 1.5, 30)}px`, maxHeight: '150px' }}
                  ></div>
                  <div className="text-white font-bold text-2xl">{assessmentResult.percentage}%</div>
                  <div className="text-white/70 text-sm">Pontuação Total</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-gray-600 flex items-center justify-center mb-2">
                    <span className="text-2xl">
                      {assessmentResult.riskLevel === 'critical' ? '🚨' :
                       assessmentResult.riskLevel === 'high' ? '⚠️' :
                       assessmentResult.riskLevel === 'medium' ? '🔶' :
                       assessmentResult.riskLevel === 'low' ? '🔵' : '✅'}
                    </span>
                  </div>
                  <div className="text-white/70 text-xs">Nível de Risco</div>
                </div>
              </div>

              <div className={`font-bold text-xl mb-3 ${
                assessmentResult.riskLevel === 'critical' ? 'text-red-400' :
                assessmentResult.riskLevel === 'high' ? 'text-orange-400' :
                assessmentResult.riskLevel === 'medium' ? 'text-yellow-400' :
                assessmentResult.riskLevel === 'low' ? 'text-blue-400' : 'text-green-400'
              }`}>
                Dependência: {assessmentResult.levelText}
              </div>

              <div className="text-white/60 text-xs mb-4">
                {assessmentResult.score} de {assessmentResult.maxScore} pontos
              </div>
            </div>

            {/* Recomendação Detalhada */}
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Recomendação Personalizada
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {assessmentResult.recommendation}
              </p>
              
              {assessmentResult.percentage >= 70 && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-4">
                  <p className="text-red-300 text-sm font-medium">
                    ⚠️ Nível crítico: Considere buscar ajuda de um profissional especializado em vícios comportamentais.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-cyan-400 font-bold">Prioridade</div>
                  <div className="text-white/80 mt-1">
                    {assessmentResult.riskLevel === 'critical' ? 'Urgente' :
                     assessmentResult.riskLevel === 'high' ? 'Alta' :
                     assessmentResult.riskLevel === 'medium' ? 'Média' : 'Baixa'}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-cyan-400 font-bold">Prognóstico</div>
                  <div className="text-white/80 mt-1">
                    {assessmentResult.percentage <= 25 ? 'Excelente' :
                     assessmentResult.percentage <= 45 ? 'Muito Bom' :
                     assessmentResult.percentage <= 65 ? 'Bom' : 'Desafiador'}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(8)}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg button-press"
            >
              Ver Plano de Recuperação
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 8) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Stars background */}
        {isClient && (
          <div className="absolute inset-0">
            {starPositions.slice(0, 40).map((star, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse-soft"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center relative z-10 max-w-md">
          <div className="w-20 h-20 glass-card flex items-center justify-center mb-6 mx-auto">
            <div className="text-4xl">🎯</div>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-white">Pronto para começar!</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Agora que conhecemos seu perfil, vamos mostrar como usar o Purify para acelerar sua recuperação.
          </p>

          <div className="glass-card p-6 mb-8">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <span className="text-xl">🚀</span>
              Recursos do Purify:
            </h3>
            <ul className="text-white/80 text-sm space-y-2 text-left">
              <li>• 📊 Dashboard personalizado</li>
              <li>• 🆘 Botão SOS para emergências</li>
              <li>• 📈 Estatísticas de progresso</li>
              <li>• 🎯 Sistema de objetivos</li>
              <li>• 💪 Exercícios de respiração</li>
              <li>• 🏆 Sistema de gamificação</li>
            </ul>
        </div>

        <button
          onClick={completeOnboarding}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-gray-900 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all button-press"
          >
            Começar Minha Jornada
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-white" size={16} />
            </div>
        </button>

          <p className="text-white/60 text-sm mt-4">✨ Você está pronto para a liberdade!</p>
        </div>
      </div>
    )
  }

  return null
}
