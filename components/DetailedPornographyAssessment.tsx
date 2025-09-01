"use client"

import { useState, useEffect } from "react"
import { usePremium } from "@/contexts/PremiumContext"
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Heart, 
  Shield, 
  Brain,
  AlertTriangle,
  CheckCircle2,
  Target,
  Timer,
  Home,
  Smartphone,
  Users,
  Bed,
  Zap,
  BookOpen
} from "lucide-react"

interface DetailedQuestion {
  id: string
  category: string
  question: string
  description: string
  type: "single" | "multiple" | "scale"
  options: Array<{
    id: string
    text: string
    score: number
    icon?: string
  }>
}

const detailedQuestions: DetailedQuestion[] = [
  {
    id: "daily-triggers",
    category: "triggers",
    question: "Em quais momentos do dia você mais sente vontade de ver pornografia?",
    description: "Identificar padrões de horários ajuda a criar estratégias preventivas",
    type: "multiple",
    options: [
      { id: "morning", text: "Manhã (6h-12h)", score: 10, icon: "🌅" },
      { id: "afternoon", text: "Tarde (12h-18h)", score: 10, icon: "☀️" },
      { id: "evening", text: "Noite (18h-22h)", score: 15, icon: "🌆" },
      { id: "late-night", text: "Madrugada (22h-6h)", score: 20, icon: "🌙" },
      { id: "any-time", text: "Qualquer horário", score: 25, icon: "⏰" }
    ]
  },
  {
    id: "emotional-triggers",
    category: "triggers",
    question: "Quais emoções mais te levam a buscar pornografia?",
    description: "Compreender gatilhos emocionais é fundamental para a recuperação",
    type: "multiple",
    options: [
      { id: "stress", text: "Estresse", score: 15, icon: "😰" },
      { id: "boredom", text: "Tédio", score: 10, icon: "😴" },
      { id: "loneliness", text: "Solidão", score: 20, icon: "😔" },
      { id: "anger", text: "Raiva", score: 15, icon: "😠" },
      { id: "sadness", text: "Tristeza", score: 18, icon: "😢" },
      { id: "anxiety", text: "Ansiedade", score: 15, icon: "😟" },
      { id: "rejection", text: "Rejeição", score: 20, icon: "💔" }
    ]
  },
  {
    id: "location-usage",
    category: "habits",
    question: "Onde você mais consome pornografia?",
    description: "Identificar locais ajuda a criar barreiras físicas",
    type: "multiple",
    options: [
      { id: "bedroom", text: "Quarto", score: 20, icon: "🛏️" },
      { id: "bathroom", text: "Banheiro", score: 15, icon: "🚿" },
      { id: "living-room", text: "Sala", score: 10, icon: "🛋️" },
      { id: "work", text: "Trabalho", score: 25, icon: "💼" },
      { id: "car", text: "Carro", score: 15, icon: "🚗" },
      { id: "anywhere", text: "Qualquer lugar", score: 25, icon: "📍" }
    ]
  },
  {
    id: "device-preference",
    category: "habits",
    question: "Qual dispositivo você mais usa para acessar pornografia?",
    description: "Importante para configurar bloqueios específicos",
    type: "single",
    options: [
      { id: "smartphone", text: "Celular", score: 20, icon: "📱" },
      { id: "computer", text: "Computador", score: 15, icon: "💻" },
      { id: "tablet", text: "Tablet", score: 10, icon: "📄" },
      { id: "tv", text: "TV/Smart TV", score: 10, icon: "📺" },
      { id: "multiple", text: "Múltiplos dispositivos", score: 25, icon: "🔄" }
    ]
  },
  {
    id: "duration-sessions",
    category: "intensity",
    question: "Quanto tempo você costuma gastar por sessão?",
    description: "Duração das sessões indica nível de compulsão",
    type: "single",
    options: [
      { id: "quick", text: "Menos de 15 minutos", score: 5, icon: "⚡" },
      { id: "moderate", text: "15-30 minutos", score: 10, icon: "⏱️" },
      { id: "long", text: "30 minutos - 1 hora", score: 15, icon: "🕐" },
      { id: "very-long", text: "1-2 horas", score: 20, icon: "🕑" },
      { id: "extreme", text: "Mais de 2 horas", score: 25, icon: "🕒" }
    ]
  },
  {
    id: "content-escalation",
    category: "intensity",
    question: "Como mudou o tipo de conteúdo que você consome?",
    description: "Escalação indica tolerância e dependência crescente",
    type: "single",
    options: [
      { id: "same", text: "Sempre o mesmo tipo", score: 5, icon: "📄" },
      { id: "slightly-more", text: "Um pouco mais intenso", score: 10, icon: "📈" },
      { id: "much-more", text: "Muito mais intenso", score: 20, icon: "📊" },
      { id: "extreme-content", text: "Conteúdo extremo/ilegal", score: 25, icon: "⚠️" },
      { id: "cant-satisfy", text: "Nada me satisfaz mais", score: 25, icon: "🚫" }
    ]
  },
  {
    id: "social-isolation",
    category: "impact",
    question: "Como a pornografia afeta seus relacionamentos sociais?",
    description: "Isolamento social é um indicador importante de dependência",
    type: "single",
    options: [
      { id: "no-impact", text: "Não afeta", score: 0, icon: "👥" },
      { id: "slight-withdrawal", text: "Me isolo um pouco", score: 10, icon: "🚶" },
      { id: "avoid-people", text: "Evito pessoas próximas", score: 15, icon: "🙈" },
      { id: "major-isolation", text: "Me isolo muito", score: 20, icon: "🏠" },
      { id: "complete-isolation", text: "Isolamento total", score: 25, icon: "🔒" }
    ]
  },
  {
    id: "spiritual-impact",
    category: "spiritual",
    question: "Como isso afeta sua vida espiritual e relacionamento com Deus?",
    description: "Aspecto espiritual é fundamental para a recuperação completa",
    type: "single",
    options: [
      { id: "no-impact", text: "Não afeta minha fé", score: 0, icon: "🙏" },
      { id: "guilt", text: "Sinto culpa e vergonha", score: 15, icon: "😔" },
      { id: "distant-god", text: "Me sinto distante de Deus", score: 20, icon: "⛅" },
      { id: "avoid-prayer", text: "Evito oração e igreja", score: 22, icon: "🚫" },
      { id: "lost-faith", text: "Perdi a conexão espiritual", score: 25, icon: "💔" }
    ]
  },
  {
    id: "shame-guilt",
    category: "psychological",
    question: "Qual o nível de vergonha que você sente?",
    description: "Vergonha excessiva pode impedir a busca por ajuda",
    type: "scale",
    options: [
      { id: "none", text: "Nenhuma vergonha", score: 0, icon: "😐" },
      { id: "little", text: "Pouca vergonha", score: 5, icon: "😕" },
      { id: "moderate", text: "Vergonha moderada", score: 10, icon: "😞" },
      { id: "high", text: "Muita vergonha", score: 15, icon: "😰" },
      { id: "extreme", text: "Vergonha extrema", score: 20, icon: "🫣" }
    ]
  },
  {
    id: "prayer-habits",
    category: "spiritual",
    question: "Como está sua vida de oração atualmente?",
    description: "A oração é uma ferramenta poderosa na recuperação",
    type: "single",
    options: [
      { id: "regular", text: "Oro regularmente", score: 0, icon: "🙏" },
      { id: "occasional", text: "Oro ocasionalmente", score: 5, icon: "🤲" },
      { id: "rarely", text: "Oro raramente", score: 10, icon: "⏰" },
      { id: "guilt-stops", text: "A culpa me impede de orar", score: 20, icon: "🚫" },
      { id: "stopped", text: "Parei de orar", score: 25, icon: "💔" }
    ]
  },
  {
    id: "church-attendance",
    category: "spiritual",
    question: "Como está sua frequência na igreja/comunidade de fé?",
    description: "Comunhão cristã é essencial para recuperação espiritual",
    type: "single",
    options: [
      { id: "regular", text: "Frequento regularmente", score: 0, icon: "⛪" },
      { id: "monthly", text: "Vou mensalmente", score: 5, icon: "📅" },
      { id: "rarely", text: "Vou raramente", score: 10, icon: "🚶" },
      { id: "avoid", text: "Evito por vergonha", score: 20, icon: "🙈" },
      { id: "stopped", text: "Parei de ir", score: 25, icon: "🚫" }
    ]
  },
  {
    id: "bible-reading",
    category: "spiritual",
    question: "Com que frequência você lê a Bíblia?",
    description: "A Palavra de Deus renova a mente e fortalece contra tentações",
    type: "single",
    options: [
      { id: "daily", text: "Diariamente", score: 0, icon: "📖" },
      { id: "weekly", text: "Semanalmente", score: 5, icon: "📚" },
      { id: "monthly", text: "Mensalmente", score: 10, icon: "📜" },
      { id: "rarely", text: "Raramente", score: 15, icon: "⏰" },
      { id: "never", text: "Nunca", score: 20, icon: "🚫" }
    ]
  },
  {
    id: "accountability",
    category: "support",
    question: "Você tem alguém que sabe sobre sua luta?",
    description: "Prestação de contas é crucial para a recuperação",
    type: "single",
    options: [
      { id: "yes-supportive", text: "Sim, e recebo apoio", score: 0, icon: "👥" },
      { id: "yes-no-support", text: "Sim, mas sem apoio", score: 10, icon: "😔" },
      { id: "partially", text: "Contei parcialmente", score: 15, icon: "🤐" },
      { id: "no-one", text: "Ninguém sabe", score: 20, icon: "🤫" },
      { id: "too-ashamed", text: "Tenho vergonha de contar", score: 25, icon: "😰" }
    ]
  },
  {
    id: "triggers-stress",
    category: "detailed-triggers",
    question: "Quais situações específicas mais te levam a recair?",
    description: "Identificar gatilhos específicos permite prevenção direcionada",
    type: "multiple",
    options: [
      { id: "work-stress", text: "Estresse no trabalho", score: 15, icon: "💼" },
      { id: "relationship-problems", text: "Problemas no relacionamento", score: 20, icon: "💔" },
      { id: "financial-worry", text: "Preocupações financeiras", score: 15, icon: "💰" },
      { id: "social-rejection", text: "Rejeição social", score: 18, icon: "👎" },
      { id: "boredom-weekend", text: "Tédio nos fins de semana", score: 12, icon: "📅" },
      { id: "late-night", text: "Insônia/noites em claro", score: 20, icon: "🌙" },
      { id: "success-celebration", text: "Após conquistas (paradoxal)", score: 10, icon: "🎉" }
    ]
  }
]

export function DetailedPornographyAssessment() {
  const [currentStep, setCurrentStep] = useState<"intro" | "assessment" | "calculating" | "results">("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const { updateUser } = usePremium()

  const currentQuestion = detailedQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === detailedQuestions.length - 1

  const handleAnswer = (option: any) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionText: currentQuestion.question,
        selectedOption: option,
        category: currentQuestion.category,
        score: option.score
      }
    }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (isLastQuestion) {
        setCurrentStep("calculating")
        calculateResults(newAnswers)
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, 300)
  }

  const calculateResults = (finalAnswers: Record<string, any>) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 4
      setCalculationProgress(Math.min(progress, 100))
      
      if (progress >= 100) {
        clearInterval(interval)
        
        // Analisar respostas e gerar plano personalizado
        const analysis = analyzeDetailedAnswers(finalAnswers)
        setResults(analysis)
        
        // Salvar no contexto
        updateUser({
          assessmentCompleted: true,
          assessmentScore: analysis.overallScore,
          assessmentLevel: analysis.severityLevel,
          assessmentAnswers: finalAnswers,
          assessmentRiskFactors: analysis.riskFactors,
          assessmentSpecificTriggers: analysis.triggers
        })
        
        setTimeout(() => setCurrentStep("results"), 800)
      }
    }, 150)
  }

  const analyzeDetailedAnswers = (answers: Record<string, any>) => {
    let totalScore = 0
    let maxScore = 0
    const triggers: string[] = []
    const riskFactors: string[] = []
    const spiritualNeeds: string[] = []
    const personalizedStrategies: string[] = []
    const timePatterns: string[] = []
    const emotionalPatterns: string[] = []

    // Analisar cada resposta
    Object.values(answers).forEach((answer: any) => {
      totalScore += answer.score
      const question = detailedQuestions.find(q => q.id === Object.keys(answers).find(k => answers[k] === answer))
      if (question) {
        maxScore += Math.max(...question.options.map(o => o.score))
      }

      // Análise específica por pergunta
      const questionId = Object.keys(answers).find(k => answers[k] === answer)
      
      if (questionId === "daily-triggers") {
        if (answer.selectedOption.id === "late-night") {
          triggers.push("Vulnerabilidade na madrugada")
          personalizedStrategies.push("Implemente toque de recolher digital às 22h")
          personalizedStrategies.push("Deixe dispositivos carregando fora do quarto")
        }
        if (answer.selectedOption.id === "morning") {
          triggers.push("Vulnerabilidade matinal")
          personalizedStrategies.push("Crie rotina matinal com oração e exercício")
        }
        timePatterns.push(answer.selectedOption.text)
      }

      if (questionId === "emotional-triggers") {
        emotionalPatterns.push(answer.selectedOption.text)
        if (answer.selectedOption.id === "loneliness") {
          triggers.push("Solidão como gatilho principal")
          personalizedStrategies.push("Desenvolva relacionamentos saudáveis na igreja")
          personalizedStrategies.push("Entre em grupo de discipulado")
        }
        if (answer.selectedOption.id === "stress") {
          triggers.push("Estresse como gatilho")
          personalizedStrategies.push("Aprenda técnicas bíblicas de manejo do estresse")
          personalizedStrategies.push("Medite em Salmos durante momentos difíceis")
        }
      }

      if (questionId === "spiritual-impact") {
        if (answer.score >= 20) {
          spiritualNeeds.push("Restauração urgente da comunhão com Deus")
          personalizedStrategies.push("Comece com 5 minutos diários de oração")
          personalizedStrategies.push("Busque aconselhamento pastoral")
        }
        if (answer.score >= 15) {
          spiritualNeeds.push("Trabalhar culpa e vergonha espiritual")
          personalizedStrategies.push("Estude sobre o perdão de Deus")
        }
      }

      if (questionId === "location-usage") {
        if (answer.selectedOption.id === "bedroom") {
          riskFactors.push("Uso no quarto - ambiente íntimo comprometido")
          personalizedStrategies.push("Remova dispositivos do quarto")
          personalizedStrategies.push("Crie o quarto como santuário de descanso")
        }
        if (answer.selectedOption.id === "work") {
          riskFactors.push("Uso no trabalho - risco profissional alto")
          personalizedStrategies.push("URGENTE: Configure bloqueios no computador do trabalho")
        }
      }

      if (questionId === "prayer-habits") {
        if (answer.score >= 20) {
          spiritualNeeds.push("Restaurar vida de oração")
          personalizedStrategies.push("Comece orando apenas 'Jesus, me ajude' quando tentado")
        }
      }

      if (questionId === "accountability") {
        if (answer.score >= 20) {
          riskFactors.push("Falta de prestação de contas")
          personalizedStrategies.push("Encontre um irmão de confiança para ser seu parceiro de prestação de contas")
        }
      }
    })

    // Determinar nível de severidade
    const percentage = Math.round((totalScore / maxScore) * 100)
    let severityLevel: "low" | "moderate" | "high" | "severe"
    let urgencyMessage: string

    if (percentage <= 25) {
      severityLevel = "low"
      urgencyMessage = "Situação controlável com disciplina espiritual"
    } else if (percentage <= 50) {
      severityLevel = "moderate"
      urgencyMessage = "Necessita atenção e estrutura de recuperação"
    } else if (percentage <= 75) {
      severityLevel = "high"
      urgencyMessage = "Situação séria - busque ajuda pastoral imediata"
    } else {
      severityLevel = "severe"
      urgencyMessage = "CRÍTICO - Busque ajuda profissional e pastoral urgente"
    }

    return {
      overallScore: percentage,
      severityLevel,
      urgencyMessage,
      triggers,
      riskFactors,
      spiritualNeeds,
      personalizedStrategies,
      timePatterns,
      emotionalPatterns,
      detailedAnalysis: generateDetailedAnalysis(answers),
      spiritualRecoveryPlan: generateSpiritualRecoveryPlan(answers, severityLevel)
    }
  }

  const generateDetailedAnalysis = (answers: Record<string, any>) => {
    // Análise detalhada será implementada
    return "Análise personalizada baseada nas suas respostas específicas"
  }

  const generateSpiritualRecoveryPlan = (answers: Record<string, any>, level: string) => {
    const plan = {
      spiritualGoals: [] as string[],
      biblicalVerses: [] as string[],
      prayers: [] as string[],
      practicalSteps: [] as string[]
    }

    // Versículos bíblicos específicos para recuperação
    plan.biblicalVerses = [
      "1 Coríntios 10:13 - Deus é fiel e não permitirá tentação além das suas forças",
      "Filipenses 4:13 - Tudo posso naquele que me fortalece",
      "2 Coríntios 5:17 - Se alguém está em Cristo, nova criatura é",
      "Salmos 51:10 - Cria em mim um coração puro, ó Deus",
      "Romanos 12:2 - Renovem-se pela transformação da sua mente"
    ]

    // Orações específicas
    plan.prayers = [
      "Senhor, reconheço minha fraqueza e preciso da Sua força",
      "Jesus, quando a tentação vier, que eu clame pelo Seu nome",
      "Espírito Santo, renove minha mente e purifique meu coração",
      "Pai, perdoe-me e me ajude a perdoar a mim mesmo",
      "Deus, crie em mim um coração puro e reto diante de Ti"
    ]

    // Metas espirituais baseadas no nível
    if (level === "severe") {
      plan.spiritualGoals = [
        "Buscar aconselhamento pastoral imediato",
        "Começar com 5 minutos diários de oração",
        "Ler um versículo bíblico por dia",
        "Voltar à comunhão da igreja gradualmente"
      ]
    } else {
      plan.spiritualGoals = [
        "Estabelecer tempo diário com Deus",
        "Participar ativamente da igreja",
        "Encontrar grupo de apoio cristão",
        "Desenvolver disciplinas espirituais"
      ]
    }

    return plan
  }

  if (currentStep === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
        <div className="max-w-sm mx-auto">
          <div className="glass-card border-white/20 rounded-2xl p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="text-white" size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">
              Avaliação Personalizada Completa
            </h1>
            
            <p className="text-white/80 mb-6 text-sm leading-relaxed">
              Vamos fazer perguntas mais profundas e pessoais sobre sua luta. 
              Isso nos permitirá criar um plano de recuperação totalmente personalizado, 
              incluindo aspectos espirituais e práticos específicos para sua situação.
            </p>

            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="text-blue-400" size={16} />
                <span className="text-blue-200 font-medium text-sm">100% Confidencial</span>
              </div>
              <p className="text-blue-100/80 text-xs">
                Suas respostas são privadas e usadas apenas para personalizar seu plano de recuperação.
              </p>
            </div>

            <div className="space-y-2 mb-6 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-green-400" />
                <span>14 perguntas detalhadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-green-400" />
                <span>Análise de gatilhos específicos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-green-400" />
                <span>Plano espiritual personalizado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-green-400" />
                <span>Estratégias baseadas em suas respostas</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep("assessment")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Começar Avaliação Detalhada
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "assessment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
        <div className="max-w-sm mx-auto">
          {/* Header com progresso */}
          <div className="flex items-center justify-between mb-6 pt-4">
            <button
              onClick={() => currentQuestionIndex > 0 ? setCurrentQuestionIndex(prev => prev - 1) : setCurrentStep("intro")}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="flex-1 mx-4">
              <div className="bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / detailedQuestions.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="text-white/80 text-sm">
                  {currentQuestionIndex + 1} de {detailedQuestions.length}
                </span>
              </div>
            </div>
            
            <div className="w-6"></div>
          </div>

          {/* Pergunta */}
          <div className="glass-card border-white/20 rounded-2xl p-6 mb-6">
            <div className="mb-4">
              <div className="text-purple-300 text-sm font-medium mb-2 capitalize">
                {currentQuestion.category.replace('-', ' ')}
              </div>
              <h2 className="text-white font-bold text-lg mb-3 leading-tight">
                {currentQuestion.question}
              </h2>
              <p className="text-white/70 text-sm">
                {currentQuestion.description}
              </p>
            </div>

            {/* Opções */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option)}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl p-4 text-left transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <span className="text-2xl">{option.icon}</span>
                    )}
                    <span className="text-white group-hover:text-blue-200 transition-colors">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "calculating") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 flex items-center justify-center">
        <div className="max-w-sm mx-auto text-center">
          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${calculationProgress * 2.83} 283`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{Math.round(calculationProgress)}%</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Analisando suas respostas
          </h2>
          
          <p className="text-white/80 mb-6 text-sm">
            Criando seu perfil personalizado...
          </p>
          
          <div className="text-white/60 text-sm">
            {calculationProgress < 30 && "Analisando padrões de comportamento..."}
            {calculationProgress >= 30 && calculationProgress < 60 && "Identificando gatilhos específicos..."}
            {calculationProgress >= 60 && calculationProgress < 90 && "Criando estratégias personalizadas..."}
            {calculationProgress >= 90 && "Finalizando plano espiritual..."}
          </div>
        </div>
      </div>
    )
  }

  // Resultados serão mostrados no próximo passo
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animação de celebração no fundo */}
        <div className="relative">
          {/* Efeito de brilho dinâmico */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-500/30 to-teal-400/20 rounded-3xl blur-xl animate-pulse"></div>
          
          {/* Card principal melhorado */}
          <div className="relative bg-gradient-to-br from-gray-800/95 via-emerald-900/90 to-teal-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
            
            {/* Ícone de sucesso com animação */}
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="text-white" size={40} />
              </div>
              
              {/* Partículas decorativas */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute top-2 -left-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-60 animate-bounce"></div>
            </div>

            {/* Título com gradiente */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-4">
              🎉 Avaliação Concluída!
            </h1>
            
            {/* Subtítulo motivacional */}
            <div className="mb-6">
              <p className="text-white text-lg font-semibold mb-2">
                Parabéns por dar este passo!
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                Seus resultados estão prontos e seu plano personalizado de recuperação espiritual foi criado especialmente para você.
              </p>
            </div>

            {/* Benefícios do plano */}
            <div className="mb-8 space-y-3">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-green-300" size={16} />
                </div>
                <span className="text-white/90 text-sm">Estratégias personalizadas para sua situação</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-purple-300" size={16} />
                </div>
                <span className="text-white/90 text-sm">Plano espiritual com base bíblica</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-blue-300" size={16} />
                </div>
                <span className="text-white/90 text-sm">Cronograma de 90 dias de recuperação</span>
              </div>
            </div>

            {/* Botão principal melhorado */}
            <button
              onClick={() => window.location.href = '/analytics'}
              className="group relative w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                Ver Meu Plano de Recuperação
              </span>
              
              {/* Efeito de brilho no botão */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <p className="text-white/60 text-xs mt-4 flex items-center justify-center gap-1">
              <span>✨</span>
              Sua jornada de transformação começa agora!
              <span>✨</span>
            </p>
          </div>
        </div>

        {/* Elementos decorativos flutuantes */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-20 right-8 w-1 h-1 bg-emerald-400 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-32 right-12 w-1 h-1 bg-teal-400 rounded-full opacity-50 animate-bounce"></div>
      </div>
    </div>
  )
}
