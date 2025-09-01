"use client"

import { useState, useEffect } from "react"
import { 
  ArrowLeft, 
  ArrowRight,
  Brain,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Shield,
  Heart,
  Zap,
  FileText,
  Download,
  Share2,
  Crown
} from "lucide-react"
import { usePremium } from "@/contexts/PremiumContext"

interface QuizQuestion {
  id: string
  category: "frequency" | "dependency" | "impact" | "triggers" | "escalation"
  question: string
  description?: string
  options: Array<{
    id: string
    text: string
    score: number
    severity: "low" | "medium" | "high" | "critical"
  }>
}

interface AssessmentResult {
  totalScore: number
  percentage: number
  level: "low" | "moderate" | "high" | "severe"
  categoryScores: Record<string, number>
  recommendations: string[]
  riskFactors: string[]
}

const assessmentQuestions: QuizQuestion[] = [
  {
    id: "frequency-daily",
    category: "frequency",
    question: "Com que frequência você consome pornografia?",
    description: "Seja honesto, isso nos ajuda a criar um plano personalizado",
    options: [
      { id: "multiple-daily", text: "Várias vezes por dia", score: 25, severity: "critical" },
      { id: "daily", text: "Uma vez por dia", score: 20, severity: "high" },
      { id: "few-week", text: "Algumas vezes por semana", score: 15, severity: "medium" },
      { id: "weekly", text: "Uma vez por semana", score: 10, severity: "medium" },
      { id: "rarely", text: "Raramente", score: 5, severity: "low" }
    ]
  },
  {
    id: "age-exposure",
    category: "dependency",
    question: "Com que idade você teve o primeiro contato com pornografia?",
    description: "Exposição precoce pode aumentar o risco de dependência",
    options: [
      { id: "very-young", text: "8 anos ou menos", score: 25, severity: "critical" },
      { id: "young", text: "9-12 anos", score: 20, severity: "high" },
      { id: "teen-early", text: "13-16 anos", score: 15, severity: "medium" },
      { id: "teen-late", text: "17-20 anos", score: 10, severity: "medium" },
      { id: "adult", text: "21 anos ou mais", score: 5, severity: "low" }
    ]
  },
  {
    id: "control-attempts",
    category: "dependency",
    question: "Quantas vezes você já tentou parar de consumir pornografia?",
    description: "Tentativas múltiplas podem indicar dependência",
    options: [
      { id: "many-failed", text: "Muitas vezes, sempre falhei", score: 25, severity: "critical" },
      { id: "several", text: "Várias vezes", score: 20, severity: "high" },
      { id: "few", text: "Algumas vezes", score: 15, severity: "medium" },
      { id: "once-twice", text: "Uma ou duas vezes", score: 10, severity: "medium" },
      { id: "never", text: "Nunca tentei parar", score: 5, severity: "low" }
    ]
  },
  {
    id: "time-spent",
    category: "impact",
    question: "Quanto tempo você passa consumindo pornografia por sessão?",
    description: "Sessões longas podem indicar perda de controle",
    options: [
      { id: "hours", text: "Várias horas", score: 25, severity: "critical" },
      { id: "hour-plus", text: "Mais de 1 hora", score: 20, severity: "high" },
      { id: "30-60min", text: "30-60 minutos", score: 15, severity: "medium" },
      { id: "15-30min", text: "15-30 minutos", score: 10, severity: "medium" },
      { id: "under-15", text: "Menos de 15 minutos", score: 5, severity: "low" }
    ]
  },
  {
    id: "escalation",
    category: "escalation",
    question: "Você notou uma evolução para conteúdo mais extremo ou específico?",
    description: "Escalação é um sinal importante de dependência",
    options: [
      { id: "significant", text: "Sim, mudança significativa", score: 25, severity: "critical" },
      { id: "some", text: "Sim, alguma mudança", score: 20, severity: "high" },
      { id: "little", text: "Pouca mudança", score: 10, severity: "medium" },
      { id: "none", text: "Nenhuma mudança", score: 0, severity: "low" }
    ]
  },
  {
    id: "emotional-trigger",
    category: "triggers",
    question: "Você usa pornografia para lidar com emoções negativas?",
    description: "Uso como mecanismo de enfrentamento é preocupante",
    options: [
      { id: "always", text: "Sempre", score: 25, severity: "critical" },
      { id: "often", text: "Frequentemente", score: 20, severity: "high" },
      { id: "sometimes", text: "Às vezes", score: 15, severity: "medium" },
      { id: "rarely", text: "Raramente", score: 10, severity: "low" },
      { id: "never", text: "Nunca", score: 0, severity: "low" }
    ]
  },
  {
    id: "sexual-function",
    category: "impact",
    question: "Você tem dificuldades na intimidade sem pornografia?",
    description: "Impacto na vida sexual real é um indicador importante",
    options: [
      { id: "severe", text: "Sim, dificuldades sérias", score: 25, severity: "critical" },
      { id: "moderate", text: "Sim, algumas dificuldades", score: 20, severity: "high" },
      { id: "mild", text: "Dificuldades leves", score: 15, severity: "medium" },
      { id: "none", text: "Nenhuma dificuldade", score: 0, severity: "low" }
    ]
  },
  {
    id: "productivity-impact",
    category: "impact",
    question: "A pornografia afeta sua produtividade no trabalho/estudos?",
    description: "Impacto na vida profissional/acadêmica",
    options: [
      { id: "significant", text: "Sim, impacto significativo", score: 25, severity: "critical" },
      { id: "moderate", text: "Sim, algum impacto", score: 20, severity: "high" },
      { id: "mild", text: "Impacto leve", score: 15, severity: "medium" },
      { id: "none", text: "Nenhum impacto", score: 0, severity: "low" }
    ]
  },
  {
    id: "social-isolation",
    category: "impact",
    question: "Você evita atividades sociais para consumir pornografia?",
    description: "Isolamento social é um sinal de dependência severa",
    options: [
      { id: "often", text: "Frequentemente", score: 25, severity: "critical" },
      { id: "sometimes", text: "Às vezes", score: 20, severity: "high" },
      { id: "rarely", text: "Raramente", score: 10, severity: "medium" },
      { id: "never", text: "Nunca", score: 0, severity: "low" }
    ]
  },
  {
    id: "guilt-shame",
    category: "impact",
    question: "Qual o nível de culpa/vergonha que você sente após o consumo?",
    description: "Sentimentos negativos intensos indicam conflito interno",
    options: [
      { id: "extreme", text: "Culpa/vergonha extrema", score: 20, severity: "high" },
      { id: "significant", text: "Culpa/vergonha significativa", score: 15, severity: "medium" },
      { id: "mild", text: "Culpa/vergonha leve", score: 10, severity: "medium" },
      { id: "none", text: "Pouca ou nenhuma", score: 5, severity: "low" }
    ]
  }
]

export function AddictionAssessment() {
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "calculating" | "results" | "detailed-report">("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { option: any, score: number }>>({})
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const { updateUser } = usePremium()

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1
  const progressPercentage = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100

  const calculateResults = (): AssessmentResult => {
    const totalScore = Object.values(answers).reduce((sum, answer) => sum + answer.score, 0)
    const maxPossibleScore = assessmentQuestions.reduce((sum, q) => 
      sum + Math.max(...q.options.map(o => o.score)), 0
    )
    const percentage = Math.round((totalScore / maxPossibleScore) * 100)

    // Calcular scores por categoria
    const categoryScores: Record<string, number> = {}
    const categoryCounts: Record<string, number> = {}
    
    assessmentQuestions.forEach((question, index) => {
      const answer = answers[question.id]
      if (answer) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = 0
          categoryCounts[question.category] = 0
        }
        categoryScores[question.category] += answer.score
        categoryCounts[question.category]++
      }
    })

    // Normalizar scores por categoria
    Object.keys(categoryScores).forEach(category => {
      categoryScores[category] = Math.round((categoryScores[category] / categoryCounts[category]))
    })

    // Determinar nível
    let level: AssessmentResult["level"]
    if (percentage >= 80) level = "severe"
    else if (percentage >= 60) level = "high" 
    else if (percentage >= 40) level = "moderate"
    else level = "low"

    // Gerar recomendações baseadas no nível
    const recommendations = generateRecommendations(level, percentage, categoryScores)
    const riskFactors = identifyRiskFactors(answers, categoryScores)

    return {
      totalScore,
      percentage,
      level,
      categoryScores,
      recommendations,
      riskFactors
    }
  }

  const generateRecommendations = (level: string, percentage: number, categoryScores: Record<string, number>): string[] => {
    const recommendations: string[] = []

    if (level === "severe") {
      recommendations.push("🚨 Considere buscar ajuda profissional imediatamente")
      recommendations.push("📱 Use bloqueadores de conteúdo em todos os dispositivos")
      recommendations.push("👥 Procure um grupo de apoio ou accountability partner")
      recommendations.push("🧠 Considere terapia especializada em vícios sexuais")
    } else if (level === "high") {
      recommendations.push("⚠️ Situação requer atenção séria e ação imediata")
      recommendations.push("📅 Estabeleça um plano estruturado de recuperação")
      recommendations.push("🛡️ Implemente filtros e bloqueadores")
      recommendations.push("💪 Desenvolva hobbies e atividades alternativas")
    } else if (level === "moderate") {
      recommendations.push("📊 Monitore seu comportamento com mais atenção")
      recommendations.push("🎯 Estabeleça metas claras de redução")
      recommendations.push("🧘 Pratique técnicas de mindfulness")
      recommendations.push("📚 Eduque-se sobre os efeitos da pornografia")
    } else {
      recommendations.push("✅ Continue mantendo hábitos saudáveis")
      recommendations.push("🔍 Monitore ocasionalmente seu comportamento")
      recommendations.push("💡 Mantenha-se informado sobre os riscos")
    }

    return recommendations
  }

  const identifyRiskFactors = (answers: Record<string, any>, categoryScores: Record<string, number>): string[] => {
    const risks: string[] = []

    if (categoryScores.escalation >= 15) {
      risks.push("📈 Escalação para conteúdo mais extremo")
    }
    if (categoryScores.triggers >= 15) {
      risks.push("😰 Uso como mecanismo de enfrentamento emocional")
    }
    if (categoryScores.impact >= 18) {
      risks.push("⚡ Impacto significativo na vida pessoal/profissional")
    }
    if (categoryScores.dependency >= 20) {
      risks.push("🔄 Sinais de dependência física/psicológica")
    }
    if (categoryScores.frequency >= 20) {
      risks.push("⏰ Frequência de uso preocupante")
    }

    return risks
  }

  const handleAnswerSelect = (option: any) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: {
        option,
        score: option.score
      }
    }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (isLastQuestion) {
        setCurrentStep("calculating")
        
        // Simular cálculo com loading realista
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 12 + 5
          setCalculationProgress(Math.min(progress, 100))
          
          if (progress >= 100) {
            clearInterval(interval)
            const calculatedResult = calculateResults()
            setResult(calculatedResult)
            
            // Salvar resultado no contexto premium
            updateUser({
              assessmentCompleted: true,
              assessmentScore: calculatedResult.percentage,
              assessmentLevel: calculatedResult.level
            })
            
            setTimeout(() => setCurrentStep("results"), 800)
          }
        }, 150)
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, 300)
  }

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "severe": return "text-red-500"
      case "high": return "text-orange-500" 
      case "moderate": return "text-yellow-500"
      default: return "text-green-500"
    }
  }

  const getSeverityBg = (level: string) => {
    switch (level) {
      case "severe": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "moderate": return "bg-yellow-500" 
      default: return "bg-green-500"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "severe": return "Dependência Severa"
      case "high": return "Alto Risco"
      case "moderate": return "Risco Moderado"
      default: return "Baixo Risco"
    }
  }

  const getLevelMessage = (level: string, percentage: number) => {
    if (level === "severe") {
      return `Com ${percentage}% de indicadores, você apresenta sinais de dependência severa. É crucial buscar ajuda profissional.`
    } else if (level === "high") {
      return `Com ${percentage}% de indicadores, você está em alto risco. Ação imediata é recomendada.`
    } else if (level === "moderate") {
      return `Com ${percentage}% de indicadores, você apresenta risco moderado. Monitoramento e mudanças são importantes.`
    }
    return `Com ${percentage}% de indicadores, você apresenta baixo risco. Continue mantendo hábitos saudáveis.`
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain className="text-white" size={40} />
          </div>

                      <h1 className="text-3xl font-bold text-white mb-4">
            Avaliação de Dependência Pornográfica
          </h1>
          
          <p className="text-white/80 text-lg leading-relaxed mb-8">
            Avaliação científica especializada para determinar seu nível de dependência de pornografia 
            e criar um plano personalizado de recuperação.
          </p>

          <div className="bg-white/10 rounded-2xl p-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10</div>
                <div className="text-white/80">Perguntas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">~3min</div>
                <div className="text-white/80">Duração</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-white/80">
              <CheckCircle className="text-green-400" size={20} />
              <span>100% Anônimo e Confidencial</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <CheckCircle className="text-green-400" size={20} />
              <span>Baseado em Critérios Científicos</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <CheckCircle className="text-green-400" size={20} />
              <span>Relatório Detalhado Personalizado</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep("quiz")}
            className="w-full bg-white hover:bg-gray-100 text-purple-800 font-bold py-4 px-6 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Iniciar Avaliação
          </button>

          <p className="text-white/60 text-sm mt-4">
            * Esta avaliação é apenas indicativa, não substitui diagnóstico médico
          </p>
        </div>
      </div>
    )
  }

  if (currentStep === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 p-4">
        {/* Header com progresso */}
        <div className="pt-12 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => currentQuestionIndex > 0 ? setCurrentQuestionIndex(prev => prev - 1) : setCurrentStep("intro")}
              className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>Questão {currentQuestionIndex + 1} de {assessmentQuestions.length}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Categoria */}
          <div className="mb-4">
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
              {currentQuestion.category.charAt(0).toUpperCase() + currentQuestion.category.slice(1)}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            {currentQuestion.question}
          </h2>
          
          {currentQuestion.description && (
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              {currentQuestion.description}
            </p>
          )}

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option)}
                className="w-full p-4 bg-indigo-800/50 hover:bg-indigo-700/50 border border-indigo-600 rounded-2xl text-white text-left transition-all transform hover:scale-[1.02] flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  option.severity === "critical" ? "bg-red-500" :
                  option.severity === "high" ? "bg-orange-500" :
                  option.severity === "medium" ? "bg-yellow-500" : "bg-green-500"
                }`}>
                  {index + 1}
                </div>
                <span className="flex-1">{option.text}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Seja honesto para obter resultados precisos
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "calculating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-blue-400 rounded-full transition-all duration-300"
              style={{ 
                background: `conic-gradient(#60a5fa ${calculationProgress * 3.6}deg, transparent 0deg)`,
                borderRadius: '50%'
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-900 rounded-full m-4">
              <span className="text-2xl font-bold text-white">{Math.round(calculationProgress)}%</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Analisando Respostas</h2>
          <p className="text-white/80 mb-6">
            Calculando seu perfil de risco baseado em critérios científicos...
          </p>

          <div className="space-y-2 text-white/60 text-sm">
            <p>✓ Avaliando padrões de comportamento</p>
            <p>✓ Analisando fatores de risco</p>
            <p>✓ Comparando com dados populacionais</p>
            <p>✓ Gerando recomendações personalizadas</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "results" && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800 p-4">
        <div className="max-w-md mx-auto pt-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Avaliação Completa ✓
            </h2>
            <p className="text-white/80">
              Seus resultados estão prontos
            </p>
          </div>

          {/* Score principal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className={`text-6xl font-bold mb-2 ${getSeverityColor(result.level)}`}>
                {result.percentage}%
              </div>
              <div className={`text-lg font-semibold ${getSeverityColor(result.level)}`}>
                {getLevelText(result.level)}
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${getSeverityBg(result.level)}`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>

            <p className="text-white/90 text-sm text-center leading-relaxed">
              {getLevelMessage(result.level, result.percentage)}
            </p>
          </div>

          {/* Alerta para casos severos */}
          {(result.level === "severe" || result.percentage >= 70) && (
            <div className="bg-red-500/20 border border-red-400 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-400 mt-1" size={20} />
                <div>
                  <h3 className="text-red-400 font-bold text-sm mb-1">Atenção Urgente Necessária</h3>
                  <p className="text-red-300 text-xs leading-relaxed">
                    Seus resultados indicam dependência severa. Recomendamos fortemente 
                    buscar ajuda profissional especializada imediatamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Principais fatores de risco */}
          {result.riskFactors.length > 0 && (
            <div className="bg-white/10 rounded-2xl p-4 mb-6">
              <h3 className="text-white font-bold text-sm mb-3">🚨 Principais Fatores de Risco:</h3>
              <div className="space-y-2">
                {result.riskFactors.slice(0, 3).map((risk, index) => (
                  <div key={index} className="text-white/80 text-sm">
                    • {risk}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendações principais */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <h3 className="text-white font-bold text-sm mb-3">💡 Recomendações Imediatas:</h3>
            <div className="space-y-2">
              {result.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="text-white/80 text-sm">
                  • {rec}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setCurrentStep("detailed-report")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Ver Relatório Completo
            </button>

            {(result.level === "high" || result.level === "severe") && (
              <button
                onClick={() => setShowUpgradePrompt(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Crown size={20} />
                Obter Plano de Recuperação Premium
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "detailed-report" && result) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className={`${getSeverityBg(result.level)} pt-14 pb-6 px-4`}>
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => setCurrentStep("results")}
              className="text-white p-2 hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-medium text-white">Relatório Detalhado</h1>
              <p className="text-white/80 text-sm">Avaliação completa de dependência</p>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-2 relative z-20 space-y-4">
          {/* Score resumo */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-center mb-4">
              <div className={`text-4xl font-bold mb-2 ${getSeverityColor(result.level)}`}>
                {result.percentage}%
              </div>
              <div className={`text-lg font-semibold ${getSeverityColor(result.level)} mb-2`}>
                {getLevelText(result.level)}
              </div>
              <p className="text-gray-600 text-sm">
                Pontuação: {result.totalScore} pontos
              </p>
            </div>
          </div>

          {/* Scores por categoria */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} />
              Análise por Categoria
            </h3>
            
            <div className="space-y-4">
              {Object.entries(result.categoryScores).map(([category, score]) => {
                const percentage = Math.round((score / 25) * 100)
                const level = percentage >= 80 ? "severe" : percentage >= 60 ? "high" : percentage >= 40 ? "moderate" : "low"
                
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 capitalize">
                        {category === "frequency" ? "Frequência" :
                         category === "dependency" ? "Dependência" :
                         category === "impact" ? "Impacto na Vida" :
                         category === "triggers" ? "Gatilhos Emocionais" :
                         category === "escalation" ? "Escalação" : category}
                      </span>
                      <span className={`${getSeverityColor(level)} font-medium`}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${getSeverityBg(level)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Fatores de risco */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} />
              Fatores de Risco Identificados
            </h3>
            
            {result.riskFactors.length > 0 ? (
              <div className="space-y-2">
                {result.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-sm">{risk}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Nenhum fator de risco crítico identificado.</p>
            )}
          </div>

          {/* Recomendações */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Recomendações Personalizadas
            </h3>
            
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm flex-1">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Próximos Passos</h3>
            
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Download size={16} />
                Baixar Relatório PDF
              </button>
              
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                <Share2 size={16} />
                Compartilhar com Terapeuta
              </button>

              {(result.level === "high" || result.level === "severe") && (
                <button
                  onClick={() => setShowUpgradePrompt(true)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Crown size={16} />
                  Obter Ajuda Especializada Premium
                </button>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-blue-800 text-xs leading-relaxed">
              <strong>Importante:</strong> Esta avaliação é apenas indicativa e baseada em critérios científicos 
              amplamente aceitos. Não substitui uma avaliação médica ou psicológica profissional. 
              Se você está enfrentando dificuldades significativas, procure ajuda de um profissional qualificado.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
