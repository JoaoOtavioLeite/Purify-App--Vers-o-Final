"use client"

import { useState, useMemo } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { usePremium } from "@/contexts/PremiumContext"
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  Award,
  AlertTriangle,
  Brain,
  Heart,
  Zap,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Shield,
  Timer,
  BarChart3,
  Lightbulb,
  Star,
  Play
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Sistema de análise das respostas da avaliação para estratégias específicas
const analyzeAssessmentAnswers = (answers: Record<string, any>) => {
  const triggers: string[] = []
  const strategies: string[] = []
  const riskFactors: string[] = []
  
  if (!answers) return { triggers, strategies, riskFactors }

  // Análise de frequência
  if (answers.frequency?.id === "multiple-daily" || answers.frequency?.id === "daily-multiple") {
    riskFactors.push("Uso compulsivo diário")
    strategies.push("Instale bloqueadores imediatos em todos os dispositivos")
    strategies.push("Remova o acesso à internet do quarto")
    strategies.push("Use técnicas de interrupção a cada hora")
  }
  
  if (answers.frequency?.id === "daily" || answers.frequency?.id === "once-daily") {
    riskFactors.push("Padrão habitual estabelecido")
    strategies.push("Quebre a rotina - mude horários de acordar")
    strategies.push("Substitua o hábito por exercício físico")
  }

  // Análise de controle
  if (answers.control?.id === "never" || answers.control?.id === "rarely") {
    riskFactors.push("Perda severa de controle")
    strategies.push("BUSQUE AJUDA PROFISSIONAL IMEDIATAMENTE")
    strategies.push("Entre em grupos de apoio presenciais")
    strategies.push("Configure bloqueios físicos nos dispositivos")
  }

  // Análise de escalação
  if (answers.escalation?.id === "yes") {
    riskFactors.push("Escalação para conteúdo extremo")
    strategies.push("Reconheça que seu cérebro foi reprogramado para tolerância")
    strategies.push("Implemente técnicas de reset dopaminérgico")
    strategies.push("Evite qualquer conteúdo sexual por 90 dias")
  }

  // Análise de gatilhos emocionais
  if (answers["emotional-coping"]?.id === "frequently") {
    triggers.push("Uso como fuga emocional")
    strategies.push("Aprenda técnicas de regulação emocional")
    strategies.push("Identifique e trate as emoções raiz")
    strategies.push("Desenvolva mecanismos de enfrentamento saudáveis")
  }

  // Análise de problemas sexuais
  if (answers["sexual-arousal"]?.id === "frequently" || answers["arousal-difficulty"]?.id === "frequently") {
    riskFactors.push("Disfunção erétil induzida por pornografia")
    strategies.push("Evite masturbação por 90 dias (reboot)")
    strategies.push("Consulte um especialista em saúde sexual")
    strategies.push("Praticar mindfulness durante intimidade")
  }

  // Análise de idade de exposição
  if (answers["first-exposure"]?.id === "very-young" || answers["age-exposure"]?.id === "young") {
    riskFactors.push("Exposição precoce - maior risco de dependência")
    strategies.push("Trabalhe traumas da exposição precoce com terapeuta")
    strategies.push("Reconheça que você foi vítima de exploração")
    strategies.push("Pratique auto-compaixão - não foi sua culpa")
  }

  // Análise de tentativas de parar
  if (answers["control-attempts"]?.id === "many-failed") {
    riskFactors.push("Múltiplas tentativas falharam")
    strategies.push("Mude completamente a abordagem - não tente sozinho")
    strategies.push("Considere tratamento intensivo ou internação")
    strategies.push("Identifique exatamente onde você falha sempre")
  }

  // Análise de tempo gasto
  if (answers["time-spent"]?.id === "several-hours") {
    riskFactors.push("Tempo excessivo consumido")
    strategies.push("Implemente alarmes de tempo a cada 15 minutos")
    strategies.push("Reestruture completamente sua agenda")
    strategies.push("Encontre atividades que ocupem suas mãos")
  }

  // Análise de estresse
  if (answers["stress-trigger"]?.id === "frequently") {
    triggers.push("Estresse como gatilho principal")
    strategies.push("Aprenda técnicas de gerenciamento de estresse")
    strategies.push("Identifique suas fontes de estresse e elimine-as")
    strategies.push("Pratique respiração profunda quando estressado")
  }

  // Análise de impacto nos relacionamentos
  if (answers["relationship-impact"]?.id === "severe") {
    riskFactors.push("Relacionamentos severamente afetados")
    strategies.push("Tenha uma conversa honesta com seu/sua parceiro(a)")
    strategies.push("Considere terapia de casal")
    strategies.push("Foque em reconstruir intimidade emocional")
  }

  return { triggers, strategies, riskFactors }
}

// Gerar metas semanais personalizadas baseadas nas respostas específicas
const generateCustomGoals = (answers: Record<string, any>, level: string) => {
  const goals: Array<{ week: number; task: string; completed: boolean }> = []
  
  if (!answers || Object.keys(answers).length === 0) return goals

  // Semana 1: Sempre começar com bloqueio
  goals.push({ week: 1, task: "Instale bloqueadores em TODOS os dispositivos", completed: false })

  // Semana 2: Baseada na frequência
  if (answers.frequency?.id === "multiple-daily" || answers.frequency?.id === "daily-multiple") {
    goals.push({ week: 2, task: "URGENTE: Remova internet do quarto e durma em local diferente", completed: false })
  } else if (answers.frequency?.id === "daily") {
    goals.push({ week: 2, task: "Quebre sua rotina diária - mude horários de acordar e dormir", completed: false })
  } else {
    goals.push({ week: 2, task: "Identifique e anote seus gatilhos específicos", completed: false })
  }

  // Semana 3: Baseada no controle
  if (answers.control?.id === "never" || answers.control?.id === "rarely") {
    goals.push({ week: 3, task: "BUSQUE AJUDA PROFISSIONAL - marque consulta com terapeuta", completed: false })
  } else if (answers["emotional-coping"]?.id === "frequently") {
    goals.push({ week: 3, task: "Aprenda 3 técnicas de regulação emocional", completed: false })
  } else {
    goals.push({ week: 3, task: "Desenvolva uma rotina de exercícios físicos", completed: false })
  }

  // Semana 4: Baseada em problemas sexuais
  if (answers["sexual-arousal"]?.id === "frequently" || answers["arousal-difficulty"]?.id === "frequently") {
    goals.push({ week: 4, task: "Inicie período de reboot - zero masturbação por 90 dias", completed: false })
  } else if (answers.escalation?.id === "yes") {
    goals.push({ week: 4, task: "Implemente técnicas de reset dopaminérgico", completed: false })
  } else {
    goals.push({ week: 4, task: "Estabeleça hobbies que ocupem suas mãos", completed: false })
  }

  // Semana 5-6: Baseada em relacionamentos
  if (answers["relationship-impact"]?.id === "severe") {
    goals.push({ week: 5, task: "Tenha conversa honesta com parceiro(a) sobre sua situação", completed: false })
    goals.push({ week: 6, task: "Inicie terapia de casal ou individual", completed: false })
  } else {
    goals.push({ week: 5, task: "Construa rede de suporte - conte para alguém de confiança", completed: false })
    goals.push({ week: 6, task: "Entre em grupo de apoio online ou presencial", completed: false })
  }

  // Semanas adicionais para casos severos
  if (level === "severe" || answers["control-attempts"]?.id === "many-failed") {
    goals.push({ week: 7, task: "Reavalie com profissional - considere medicação se necessário", completed: false })
    goals.push({ week: 8, task: "Implemente sistema de accountability diário", completed: false })
    goals.push({ week: 10, task: "Desenvolva plano de prevenção de recaída", completed: false })
    goals.push({ week: 12, task: "Faça avaliação completa do progresso", completed: false })
  }

  // Adicionar metas de longo prazo
  if (goals.length < 8) {
    goals.push({ week: 8, task: "Celebre seus marcos e ajuste estratégias", completed: false })
  }

  return goals
}

// Planos personalizados baseados no nível de dependência da avaliação
const recoveryPlans = {
  low: {
    level: "Dependência Leve",
    color: "green",
    urgency: "Baixa",
    recoveryTime: "4-8 semanas",
    description: "Você está no caminho certo! Com algumas mudanças simples, pode se livrar completamente deste hábito.",
    weeklyGoals: [
      { week: 1, task: "Identifique seus principais triggers", completed: false },
      { week: 2, task: "Estabeleça rotinas matinais saudáveis", completed: false },
      { week: 3, task: "Pratique exercícios físicos regulares", completed: false },
      { week: 4, task: "Desenvolva hobbies alternativos", completed: false }
    ],
    techniques: [
      { name: "Meditação Diária", difficulty: "Fácil", duration: "10 min", icon: "🧘" },
      { name: "Exercícios Físicos", difficulty: "Médio", duration: "30 min", icon: "🏃" },
      { name: "Leitura/Educação", difficulty: "Fácil", duration: "20 min", icon: "📚" },
      { name: "Socialização", difficulty: "Médio", duration: "1h", icon: "👥" }
    ]
  },
  moderate: {
    level: "Dependência Moderada", 
    color: "yellow",
    urgency: "Média",
    recoveryTime: "8-16 semanas",
    description: "Você precisa de um plano estruturado, mas com dedicação conseguirá se recuperar completamente.",
    weeklyGoals: [
      { week: 1, task: "Instale bloqueadores de conteúdo", completed: false },
      { week: 2, task: "Encontre um parceiro de accountability", completed: false },
      { week: 3, task: "Desenvolva estratégias de enfrentamento", completed: false },
      { week: 4, task: "Estabeleça metas de curto prazo", completed: false },
      { week: 6, task: "Revisite e ajuste estratégias", completed: false },
      { week: 8, task: "Comemore marcos importantes", completed: false }
    ],
    techniques: [
      { name: "Terapia Cognitiva", difficulty: "Médio", duration: "45 min", icon: "🧠" },
      { name: "Bloqueadores Digitais", difficulty: "Fácil", duration: "Config", icon: "🛡️" },
      { name: "Exercícios Intensos", difficulty: "Alto", duration: "45 min", icon: "💪" },
      { name: "Accountability Partner", difficulty: "Médio", duration: "Diário", icon: "🤝" }
    ]
  },
  high: {
    level: "Dependência Alta",
    color: "orange", 
    urgency: "Alta",
    recoveryTime: "16-24 semanas",
    description: "Sua situação requer atenção séria e um plano intensivo. Com compromisso, você pode se recuperar.",
    weeklyGoals: [
      { week: 1, task: "Remova todos os dispositivos/apps de risco", completed: false },
      { week: 2, task: "Busque suporte profissional", completed: false },
      { week: 3, task: "Implemente bloqueios físicos/digitais", completed: false },
      { week: 4, task: "Desenvolva rede de suporte", completed: false },
      { week: 6, task: "Aprenda técnicas de mindfulness", completed: false },
      { week: 8, task: "Estabeleça rotinas rígidas", completed: false },
      { week: 12, task: "Reavalie e ajuste estratégias", completed: false }
    ],
    techniques: [
      { name: "Terapia Profissional", difficulty: "Alto", duration: "60 min", icon: "👨‍⚕️" },
      { name: "Grupos de Apoio", difficulty: "Médio", duration: "90 min", icon: "🫂" },
      { name: "Bloqueio Total", difficulty: "Alto", duration: "24/7", icon: "🔒" },
      { name: "Mindfulness Intensivo", difficulty: "Alto", duration: "30 min", icon: "🕯️" }
    ]
  },
  severe: {
    level: "Dependência Severa",
    color: "red",
    urgency: "CRÍTICA",
    recoveryTime: "24+ semanas", 
    description: "ATENÇÃO: Sua dependência está em nível crítico. É essencial buscar ajuda profissional imediatamente.",
    weeklyGoals: [
      { week: 1, task: "URGENTE: Busque ajuda profissional", completed: false },
      { week: 1, task: "Implemente bloqueio total de dispositivos", completed: false },
      { week: 2, task: "Entre em grupo de apoio presencial", completed: false },
      { week: 3, task: "Remova-se do ambiente de risco", completed: false },
      { week: 4, task: "Desenvolva plano de crise", completed: false },
      { week: 6, task: "Inicie terapia intensiva", completed: false },
      { week: 8, task: "Reavalie medicação com profissional", completed: false },
      { week: 12, task: "Ajuste tratamento conforme necessário", completed: false }
    ],
    techniques: [
      { name: "Terapia Intensiva", difficulty: "Alto", duration: "90 min", icon: "🏥" },
      { name: "Medicação (se necessário)", difficulty: "Alto", duration: "Diário", icon: "💊" },
      { name: "Internação/Retiro", difficulty: "Alto", duration: "Semanas", icon: "🏛️" },
      { name: "Suporte Familiar", difficulty: "Alto", duration: "24/7", icon: "❤️" }
    ]
  }
}

// Artigos e recursos educacionais por nível
const educationalContent = {
  articles: [
    { title: "Como a Pornografia Afeta o Cérebro", level: "all", readTime: "8 min", category: "Ciência" },
    { title: "Primeiros Passos para a Recuperação", level: "low", readTime: "5 min", category: "Prático" },
    { title: "Técnicas de Bloqueio Digital", level: "moderate", readTime: "12 min", category: "Tecnologia" },
    { title: "Lidando com Recaídas", level: "high", readTime: "10 min", category: "Psicologia" },
    { title: "Quando Buscar Ajuda Profissional", level: "severe", readTime: "7 min", category: "Saúde" }
  ],
  videos: [
    { title: "Entendendo o Vício em Pornografia", duration: "15 min", views: "2.3M" },
    { title: "Técnicas de Respiração para Ansiedade", duration: "8 min", views: "850K" },
    { title: "Como Falar com Família sobre Vício", duration: "20 min", views: "1.1M" }
  ]
}

interface AnalyticsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "stable"
  trendValue?: string
  color?: string
}

function AnalyticsCard({ title, value, subtitle, icon, trend, trendValue, color = "purple" }: AnalyticsCardProps) {
  const bgColor = {
    purple: "from-purple-500 to-violet-600",
    red: "from-red-500 to-pink-600", 
    orange: "from-orange-500 to-red-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600"
  }[color]

  const trendColors = {
    up: "text-green-400 bg-green-500/20 border border-green-400/30",
    down: "text-red-400 bg-red-500/20 border border-red-400/30", 
    stable: "text-gray-400 bg-gray-500/20 border border-gray-400/30"
  }

  return (
    <div className="glass-card border-white/20 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 bg-gradient-to-r ${bgColor} rounded-xl flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${trendColors[trend]} backdrop-blur-sm`}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/80 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-white/60 mt-1">{subtitle}</div>}
    </div>
  )
}

// Re-export do novo componente
export { NewPremiumAnalytics as PremiumAnalytics } from "./NewPremiumAnalytics"

export function PremiumAnalyticsOld() {
  const { data, getTimeAbstinent } = useAddiction()
  const { user } = usePremium()
  const [activeTab, setActiveTab] = useState<"plan" | "progress" | "resources" | "tracking">("plan")
  const timeAbstinent = getTimeAbstinent()

  // Calcular plano personalizado baseado nas respostas específicas da avaliação
  const personalizedPlan = useMemo(() => {
    const totalDays = timeAbstinent.days
    
    // Determinar nível de dependência baseado na avaliação
    let assessmentLevel = user.assessmentLevel || "moderate"
    let assessmentScore = user.assessmentScore || 50
    
    // Se não fez avaliação, assumir moderado
    if (!user.assessmentCompleted) {
      assessmentLevel = "moderate"
      assessmentScore = 50
    }

    // NOVO: Analisar respostas específicas para estratégias personalizadas
    const answerAnalysis = analyzeAssessmentAnswers(user.assessmentAnswers || {})
    
    const currentPlan = recoveryPlans[assessmentLevel as keyof typeof recoveryPlans]
    
    // Gerar metas semanais baseadas nas respostas específicas
    const customGoals = generateCustomGoals(user.assessmentAnswers || {}, assessmentLevel)
    const goalsToUse = customGoals.length > 0 ? customGoals : currentPlan.weeklyGoals
    
    // Calcular progresso semanal
    const weeksPassed = Math.floor(totalDays / 7)
    const currentWeek = Math.min(weeksPassed + 1, goalsToUse.length)
    
    // Marcar tarefas como completas baseado no progresso
    const updatedGoals = goalsToUse.map((goal, index) => ({
      ...goal,
      completed: index < weeksPassed && totalDays > 7
    }))
    
    // Calcular estatísticas de progresso
    const completedGoals = updatedGoals.filter(g => g.completed).length
    const totalGoals = updatedGoals.length
    const planProgress = Math.round((completedGoals / totalGoals) * 100)
    
    // Benefícios baseados no tempo de abstinência
    const benefits = {
      energy: Math.min(100, Math.round((totalDays / 30) * 25 + 10)),
      focus: Math.min(100, Math.round((totalDays / 45) * 30 + 5)),
      confidence: Math.min(100, Math.round((totalDays / 60) * 40 + 5)),
      motivation: Math.min(100, Math.round((totalDays / 21) * 35 + 15))
    }
    
    return {
      totalDays,
      assessmentScore,
      assessmentLevel,
      currentPlan,
      currentWeek,
      updatedGoals,
      planProgress,
      benefits,
      timeRecovered: Math.round((totalDays * 0.75) * 10) / 10, // 45min/dia médio
      moneySaved: totalDays * 2.5, // R$ 2,50/dia sites premium
      needsUrgentAttention: assessmentScore >= 70,
      isHighRisk: assessmentScore >= 50,
      // NOVO: Dados baseados nas respostas específicas
      specificTriggers: answerAnalysis.triggers,
      customStrategies: answerAnalysis.strategies,
      identifiedRisks: answerAnalysis.riskFactors,
      hasSpecificAnswers: user.assessmentAnswers && Object.keys(user.assessmentAnswers).length > 0
    }
  }, [timeAbstinent, user])

  if (!data.addictionType && !user.assessmentCompleted) {
    return (
      <div className="glass-card border-white/20 rounded-2xl p-6 text-center">
        <AlertTriangle className="text-yellow-400 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold text-white mb-2">Avaliação Necessária</h3>
        <p className="text-white/80 mb-4">
          Complete a avaliação inicial para receber seu plano personalizado de recuperação.
        </p>
        <button className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-3 rounded-xl font-bold">
          Fazer Avaliação
        </button>
      </div>
    )
  }

  const getBgGradient = (level: string) => {
    switch (level) {
      case "low": return "from-green-600 via-emerald-600 to-teal-600"
      case "moderate": return "from-yellow-600 via-orange-600 to-amber-600" 
      case "high": return "from-orange-600 via-red-600 to-pink-600"
      case "severe": return "from-red-600 via-red-700 to-red-800"
      default: return "from-purple-600 via-violet-600 to-indigo-600"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "baixa": return "text-green-200 bg-green-500/20"
      case "média": return "text-yellow-200 bg-yellow-500/20"
      case "alta": return "text-orange-200 bg-orange-500/20"
      case "crítica": return "text-red-200 bg-red-500/30"
      default: return "text-purple-200 bg-purple-500/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-24">
      {/* Header Personalizado */}
      <div className={`bg-gradient-to-r ${getBgGradient(personalizedPlan.assessmentLevel)} pt-14 pb-6 px-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Seu Plano de Recuperação</h1>
              <p className="text-white/90 text-sm">Baseado na sua avaliação inicial</p>
            </div>
          </div>
          
          {/* Status da Avaliação */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-white font-bold text-lg">{personalizedPlan.currentPlan.level}</div>
                <div className="text-white/80 text-sm">Pontuação: {personalizedPlan.assessmentScore}%</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(personalizedPlan.currentPlan.urgency)}`}>
                Urgência: {personalizedPlan.currentPlan.urgency}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{personalizedPlan.planProgress}%</div>
                <div className="text-white/80 text-xs">Plano Completo</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{personalizedPlan.currentPlan.recoveryTime}</div>
                <div className="text-white/80 text-xs">Tempo Estimado</div>
              </div>
            </div>
          </div>
          
          {/* Alerta Motivacional */}
          {personalizedPlan.needsUrgentAttention && (
            <div className="mt-4 bg-red-500/30 border border-red-400/50 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-200" size={16} />
                <span className="text-red-100 font-bold text-sm">ATENÇÃO NECESSÁRIA</span>
              </div>
              <p className="text-red-100/90 text-xs leading-relaxed">
                Sua pontuação indica dependência severa. Siga rigorosamente o plano abaixo e considere buscar ajuda profissional.
              </p>
            </div>
          )}
          
          {!personalizedPlan.needsUrgentAttention && (
            <div className="mt-4 bg-green-500/20 border border-green-400/30 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-200" size={16} />
                <span className="text-green-100 font-bold text-sm">VOCÊ PODE CONSEGUIR!</span>
              </div>
              <p className="text-green-100/90 text-xs leading-relaxed">
                {personalizedPlan.currentPlan.description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Navegação por Abas */}
        <div className="glass-card border-white/20 rounded-2xl p-2 shadow-lg">
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: "plan", label: "Meu Plano", icon: "🎯" },
              { key: "progress", label: "Progresso", icon: "📈" },
              { key: "resources", label: "Recursos", icon: "📚" },
              { key: "tracking", label: "Acompanhar", icon: "📊" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`p-3 rounded-xl text-center transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg scale-105"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="text-sm mb-1">{tab.icon}</div>
                <div className="text-xs font-bold">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Aba: Meu Plano */}
        {activeTab === "plan" && (
          <>
            {/* Resumo do Plano */}
            <div className={`bg-gradient-to-r ${personalizedPlan.currentPlan.color === 'green' ? 'from-green-500/20 to-emerald-500/20 border-green-400/30' : 
              personalizedPlan.currentPlan.color === 'yellow' ? 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30' :
              personalizedPlan.currentPlan.color === 'orange' ? 'from-orange-500/20 to-red-500/20 border-orange-400/30' :
              'from-red-500/20 to-red-600/20 border-red-400/30'} 
              border rounded-2xl p-4 backdrop-blur-sm`}>
              <div className="flex items-center gap-3 mb-3">
                <Target className={`${personalizedPlan.currentPlan.color === 'green' ? 'text-green-400' : 
                  personalizedPlan.currentPlan.color === 'yellow' ? 'text-yellow-400' :
                  personalizedPlan.currentPlan.color === 'orange' ? 'text-orange-400' :
                  'text-red-400'}`} size={24} />
                <h3 className={`text-lg font-bold ${personalizedPlan.currentPlan.color === 'green' ? 'text-green-200' : 
                  personalizedPlan.currentPlan.color === 'yellow' ? 'text-yellow-200' :
                  personalizedPlan.currentPlan.color === 'orange' ? 'text-orange-200' :
                  'text-red-200'}`}>
                  Seu Plano: {personalizedPlan.currentPlan.level}
                </h3>
              </div>
              <p className={`${personalizedPlan.currentPlan.color === 'green' ? 'text-green-100/90' : 
                personalizedPlan.currentPlan.color === 'yellow' ? 'text-yellow-100/90' :
                personalizedPlan.currentPlan.color === 'orange' ? 'text-orange-100/90' :
                'text-red-100/90'} text-sm leading-relaxed`}>
                {personalizedPlan.currentPlan.description}
              </p>
            </div>

            {/* Metas Semanais */}
            <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="text-blue-400" size={20} />
                Suas Metas Semanais (Semana {personalizedPlan.currentWeek})
              </h3>
              
              <div className="space-y-3">
                {personalizedPlan.updatedGoals.map((goal, index) => (
                  <div key={index} className={`p-4 rounded-xl border transition-all duration-300 ${
                    goal.completed 
                      ? 'bg-green-500/20 border-green-400/30 text-green-100' 
                      : index === personalizedPlan.currentWeek - 1
                        ? 'bg-blue-500/20 border-blue-400/30 text-blue-100'
                        : 'bg-white/10 border-white/20 text-white/80'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        goal.completed 
                          ? 'bg-green-500 text-white' 
                          : index === personalizedPlan.currentWeek - 1
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/20 text-white/60'
                      }`}>
                        {goal.completed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <span className="text-xs font-bold">{goal.week}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Semana {goal.week}</div>
                        <div className="text-sm opacity-90">{goal.task}</div>
                      </div>
                      {index === personalizedPlan.currentWeek - 1 && !goal.completed && (
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ATUAL
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-purple-500/20 border border-purple-400/30 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 font-medium">Progresso do Plano</span>
                  <span className="text-purple-200 font-bold">{personalizedPlan.planProgress}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: `${personalizedPlan.planProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Estratégias Específicas Baseadas nas Suas Respostas */}
            {personalizedPlan.hasSpecificAnswers && personalizedPlan.customStrategies.length > 0 && (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="font-bold text-orange-200 mb-4 flex items-center gap-2">
                  <Target className="text-orange-400" size={20} />
                  🎯 Estratégias Específicas para Suas Respostas
                </h3>
                <p className="text-orange-100/90 text-sm mb-4">
                  Baseado exatamente no que você respondeu na avaliação:
                </p>
                
                <div className="space-y-3">
                  {personalizedPlan.customStrategies.map((strategy, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-3 border border-orange-400/20">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="text-orange-100/90 text-sm">{strategy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seus Gatilhos Identificados */}
            {personalizedPlan.hasSpecificAnswers && personalizedPlan.specificTriggers.length > 0 && (
              <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="font-bold text-red-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-red-400" size={20} />
                  ⚠️ Seus Gatilhos Específicos Identificados
                </h3>
                
                <div className="space-y-2">
                  {personalizedPlan.specificTriggers.map((trigger, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-3 border border-red-400/20">
                      <div className="text-red-100/90 text-sm font-medium">{trigger}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 text-red-100/80 text-xs">
                  💡 <strong>Importante:</strong> Reconhecer seus gatilhos é o primeiro passo para controlá-los.
                </div>
              </div>
            )}

            {/* Fatores de Risco Identificados */}
            {personalizedPlan.hasSpecificAnswers && personalizedPlan.identifiedRisks.length > 0 && (
              <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="font-bold text-purple-200 mb-4 flex items-center gap-2">
                  <Shield className="text-purple-400" size={20} />
                  🛡️ Fatores de Risco Detectados
                </h3>
                
                <div className="space-y-2">
                  {personalizedPlan.identifiedRisks.map((risk, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-3 border border-purple-400/20">
                      <div className="text-purple-100/90 text-sm">{risk}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 text-purple-100/80 text-xs">
                  🎯 <strong>Foco:</strong> Estas são suas áreas de maior vulnerabilidade. Priorize trabalhar nelas.
                </div>
              </div>
            )}

            {/* Técnicas Gerais (quando não há respostas específicas) */}
            {(!personalizedPlan.hasSpecificAnswers || personalizedPlan.customStrategies.length === 0) && (
              <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="text-yellow-400" size={20} />
                  Técnicas Recomendadas para Seu Nível
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {personalizedPlan.currentPlan.techniques.map((technique, index) => (
                    <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{technique.icon}</span>
                        <div className="flex-1">
                          <div className="text-white font-medium">{technique.name}</div>
                          <div className="text-white/70 text-sm">{technique.duration}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          technique.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-200' :
                          technique.difficulty === 'Médio' ? 'bg-yellow-500/20 text-yellow-200' :
                          'bg-red-500/20 text-red-200'
                        }`}>
                          {technique.difficulty}
                        </div>
                      </div>
                      <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 py-2 rounded-lg text-sm font-medium transition-colors">
                        Como Praticar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumo da Próxima Semana */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-bold text-blue-200 mb-4 flex items-center gap-2">
                <ArrowRight className="text-blue-400" size={20} />
                Foco da Próxima Semana
              </h3>
              
              {personalizedPlan.currentWeek <= personalizedPlan.updatedGoals.length && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{personalizedPlan.currentWeek}</span>
                    </div>
                    <div>
                      <div className="text-blue-100 font-medium">Semana {personalizedPlan.currentWeek}</div>
                      <div className="text-blue-200/80 text-sm">Próximo objetivo</div>
                    </div>
                  </div>
                  
                  {personalizedPlan.updatedGoals[personalizedPlan.currentWeek - 1] && (
                    <div className="text-blue-100/90 text-sm">
                      📋 {personalizedPlan.updatedGoals[personalizedPlan.currentWeek - 1].task}
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4 bg-purple-500/20 rounded-xl p-3">
                <div className="text-purple-100 text-sm">
                  💡 <strong>Lembre-se:</strong> Cada dia é uma vitória. Você está reconstruindo seu cérebro neurônio por neurônio.
                </div>
              </div>
            </div>
          </>
        )}

                {/* Conteúdo Aba: Progresso */}
        {activeTab === "progress" && (
          <>
            {/* Seus Ganhos Atuais */}
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-bold text-emerald-200 mb-4 flex items-center gap-2">
                <Award className="text-emerald-400" size={20} />
                🎉 Seus Ganhos - {personalizedPlan.totalDays} Dias Limpo!
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass-card border-emerald-400/30 rounded-xl p-3">
                  <div className="text-emerald-400 text-lg font-bold">{personalizedPlan.timeRecovered}h</div>
                  <div className="text-emerald-200 text-xs">Tempo Recuperado</div>
                  <div className="text-emerald-300/80 text-xs">Que você gastaria assistindo</div>
                </div>
                <div className="glass-card border-emerald-400/30 rounded-xl p-3">
                  <div className="text-emerald-400 text-lg font-bold">R$ {personalizedPlan.moneySaved.toFixed(0)}</div>
                  <div className="text-emerald-200 text-xs">Economizado</div>
                  <div className="text-emerald-300/80 text-xs">Sites premium e impulsos</div>
                </div>
              </div>
            </div>

            {/* Benefícios Pessoais */}
            <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-400" size={20} />
                Benefícios Que Você Conquistou
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                    <span className="text-white text-xl font-bold">{personalizedPlan.benefits.energy}%</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-medium">Energia</div>
                  <div className="text-white/70 text-xs">vs. período de uso</div>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                    <span className="text-white text-xl font-bold">{personalizedPlan.benefits.focus}%</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-medium">Foco</div>
                  <div className="text-white/70 text-xs">Concentração mental</div>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                    <span className="text-white text-xl font-bold">{personalizedPlan.benefits.confidence}%</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-medium">Confiança</div>
                  <div className="text-white/70 text-xs">Autoestima</div>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                    <span className="text-white text-xl font-bold">{personalizedPlan.benefits.motivation}%</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white font-medium">Motivação</div>
                  <div className="text-white/70 text-xs">Força de vontade</div>
                </div>
              </div>
            </div>

            {/* Gráfico de Progresso */}
            <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="text-purple-400" size={20} />
                Evolução dos Seus Benefícios
              </h3>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { aspect: 'Energia', value: personalizedPlan.benefits.energy },
                    { aspect: 'Foco', value: personalizedPlan.benefits.focus },
                    { aspect: 'Confiança', value: personalizedPlan.benefits.confidence },
                    { aspect: 'Motivação', value: personalizedPlan.benefits.motivation }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="aspect" stroke="#ffffff80" fontSize={12} />
                    <YAxis stroke="#ffffff80" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'white'
                      }} 
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#gradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Marco Atual */}
            <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-400/30 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-bold text-purple-200 mb-3 flex items-center gap-2">
                <Star className="text-purple-400" size={20} />
                Próximo Marco
              </h3>
              
              {personalizedPlan.totalDays < 7 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 font-medium">1 Semana Limpo</span>
                    <span className="text-purple-400 font-bold">{7 - personalizedPlan.totalDays} dias restantes</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(personalizedPlan.totalDays / 7) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-purple-300/80 text-sm mt-2">
                    🏆 Primeiro marco importante! Os primeiros sintomas de melhora aparecerão.
                  </p>
                </div>
              )}
              
              {personalizedPlan.totalDays >= 7 && personalizedPlan.totalDays < 30 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 font-medium">1 Mês Limpo</span>
                    <span className="text-purple-400 font-bold">{30 - personalizedPlan.totalDays} dias restantes</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(personalizedPlan.totalDays / 30) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-purple-300/80 text-sm mt-2">
                    🚀 Marco transformador! Mudanças significativas em energia e foco.
                  </p>
                </div>
              )}
              
              {personalizedPlan.totalDays >= 30 && personalizedPlan.totalDays < 90 && (
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 font-medium">3 Meses Limpo</span>
                    <span className="text-purple-400 font-bold">{90 - personalizedPlan.totalDays} dias restantes</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(personalizedPlan.totalDays / 90) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-purple-300/80 text-sm mt-2">
                    🧠 Marco neurológico! Recuperação cerebral quase completa.
                  </p>
                </div>
              )}
              
              {personalizedPlan.totalDays >= 90 && (
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                  <div className="text-center">
                    <div className="text-green-400 text-4xl mb-2">🏆</div>
                    <div className="text-green-200 font-bold text-lg">PARABÉNS!</div>
                    <div className="text-green-300/90 text-sm">
                      Você alcançou a recuperação neurológica completa! Continue assim!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Conteúdo Aba: Recursos */}
        {activeTab === "resources" && (
          <>
            {/* Artigos Recomendados */}
            <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-400" size={20} />
                Artigos Recomendados para Seu Nível
              </h3>
              
              <div className="space-y-3">
                {educationalContent.articles
                  .filter(article => article.level === personalizedPlan.assessmentLevel || article.level === "all")
                  .map((article, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">{article.title}</div>
                        <div className="text-white/70 text-sm">{article.readTime} • {article.category}</div>
                      </div>
                      <div className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full text-xs">
                        Novo
                      </div>
                    </div>
                    <button className="w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200 py-2 rounded-lg text-sm font-medium transition-colors">
                      Ler Artigo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Vídeos Educacionais */}
            <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Play className="text-green-400" size={20} />
                Vídeos Educacionais
              </h3>
              
              <div className="space-y-3">
                {educationalContent.videos.map((video, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Play className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{video.title}</div>
                        <div className="text-white/70 text-sm">{video.duration} • {video.views} visualizações</div>
                      </div>
                    </div>
                    <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-200 py-2 rounded-lg text-sm font-medium transition-colors">
                      Assistir Vídeo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Comunidade e Suporte */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-bold text-purple-200 mb-4 flex items-center gap-2">
                <Users className="text-purple-400" size={20} />
                Comunidade e Suporte
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <button className="bg-white/10 rounded-xl p-4 border border-purple-400/30 text-left hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Users className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-purple-100 font-medium">Grupos de Apoio</div>
                      <div className="text-purple-200/80 text-sm">Conecte-se com outros na mesma jornada</div>
                    </div>
                  </div>
                </button>
                
                <button className="bg-white/10 rounded-xl p-4 border border-purple-400/30 text-left hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-purple-100 font-medium">Parceiro de Accountability</div>
                      <div className="text-purple-200/80 text-sm">Encontre alguém para te apoiar</div>
                    </div>
                  </div>
                </button>
                
                <button className="bg-white/10 rounded-xl p-4 border border-purple-400/30 text-left hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-purple-100 font-medium">Linha de Crise</div>
                      <div className="text-purple-200/80 text-sm">Suporte 24/7 em momentos difíceis</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Conteúdo Aba: Acompanhar */}
        {activeTab === "tracking" && (
          <>
            {/* Gráfico de Evolução */}
            <div className="glass-card border-white/20 rounded-2xl p-5 shadow-lg">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-400" size={20} />
                Evolução da Sua Recuperação
              </h3>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: '1', benefits: 10 },
                    { day: '7', benefits: 25 },
                    { day: '14', benefits: 40 },
                    { day: '21', benefits: 55 },
                    { day: '30', benefits: 70 },
                    { day: '45', benefits: 80 },
                    { day: '60', benefits: 90 },
                    { day: '90', benefits: 95 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="day" stroke="#ffffff80" fontSize={12} />
                    <YAxis stroke="#ffffff80" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'white'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benefits" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#059669' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 text-center">
                <div className="text-white/70 text-sm">
                  Você está no dia <span className="text-green-400 font-bold">{personalizedPlan.totalDays}</span> da sua jornada
                </div>
              </div>
            </div>

            {/* Métricas de Acompanhamento */}
            <div className="grid grid-cols-2 gap-3">
              <AnalyticsCard
                title="Dias Consecutivos"
                value={personalizedPlan.totalDays}
                subtitle="Seu recorde atual"
                icon={<Calendar className="text-white" size={20} />}
                trend="up"
                trendValue={personalizedPlan.totalDays > 7 ? "FORTE" : "INÍCIO"}
                color="green"
              />
              <AnalyticsCard
                title="Tempo Economizado"
                value={`${personalizedPlan.timeRecovered}h`}
                subtitle="Que você gastaria assistindo"
                icon={<Clock className="text-white" size={20} />}
                trend="up"
                trendValue="CRESCENDO"
                color="blue"
              />
            </div>

            {/* Alertas e Recomendações */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="font-bold text-yellow-200 mb-4 flex items-center gap-2">
                <Lightbulb className="text-yellow-400" size={20} />
                Recomendações Baseadas no Seu Progresso
              </h3>
              
              <div className="space-y-3">
                {personalizedPlan.totalDays < 7 && (
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-yellow-100 font-medium text-sm">🎯 Foque na primeira semana</div>
                    <div className="text-yellow-200/80 text-xs">
                      Os primeiros 7 dias são cruciais. Evite situações de risco e mantenha-se ocupado.
                    </div>
                  </div>
                )}
                
                {personalizedPlan.totalDays >= 7 && personalizedPlan.totalDays < 30 && (
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-yellow-100 font-medium text-sm">🚀 Construindo momentum</div>
                    <div className="text-yellow-200/80 text-xs">
                      Excelente! Continue assim. Agora é hora de desenvolver hábitos saudáveis permanentes.
                    </div>
                  </div>
                )}
                
                {personalizedPlan.totalDays >= 30 && (
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-yellow-100 font-medium text-sm">🏆 Veterano da recuperação</div>
                    <div className="text-yellow-200/80 text-xs">
                      Incrível progresso! Você está inspirando outros. Continue sendo um exemplo.
                    </div>
                  </div>
                )}
                
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-yellow-100 font-medium text-sm">💡 Dica do dia</div>
                  <div className="text-yellow-200/80 text-xs">
                    Pratique gratidão: liste 3 coisas pelas quais você é grato hoje. Isso fortalece circuitos neurais positivos.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

