"use client"

import { useState, useEffect, useRef } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  Heart, 
  Brain, 
  Shield, 
  Target, 
  Activity,
  CheckCircle,
  Users,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Timer,
  Star,
  Award,
  Lightbulb,
  Sun,
  Moon,
  Sunrise,
  BarChart3,
  Sparkles,
  Zap,
  Coffee,
  Headphones,
  BookOpen,
  Wind,
  Flame,
  Crown,
  Gift,
  ChevronRight,
  Play,
  Pause,
  Share2
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { useHaptics } from "@/lib/haptics"
import { useDeviceFeatures } from "@/lib/device-features"
// import html2canvas from "html2canvas"

interface DailyQuestion {
  id: string
  question: string
  description: string
  type: "boolean" | "scale" | "emoji"
  category: "physical" | "mental" | "spiritual" | "social"
  weight: number
  icon: React.ReactNode
  color: string
  emoji: string
}

interface DailyAnswer {
  questionId: string
  answer: boolean | number | string
}

interface DailyReport {
  date: string
  answers: DailyAnswer[]
  overallScore: number
  category_scores: {
    physical: number
    mental: number
    spiritual: number
    social: number
  }
  recommendations: string[]
  mood: "excellent" | "good" | "fair" | "poor"
  achievements: string[]
  nextGoals: string[]
}

export default function BemEstarPage() {
  const { data } = useAddiction()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dailyAnswers, setDailyAnswers] = useState<DailyAnswer[]>([])
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Função para verificar se o check-in já foi feito hoje
  const hasCompletedTodayCheckin = () => {
    const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    const lastCheckin = localStorage.getItem('lastCheckinDate')
    return lastCheckin === today
  }

  // Função para verificar quando será o próximo check-in disponível
  const getNextCheckinTime = () => {
    const now = new Date()
    const brasiliaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}))
    
    // Próximo check-in será amanhã às 19h
    const nextCheckin = new Date(brasiliaTime)
    nextCheckin.setDate(nextCheckin.getDate() + 1)
    nextCheckin.setHours(19, 0, 0, 0)
    
    return nextCheckin
  }

  // Função para salvar que o check-in foi concluído hoje
  const saveCheckinCompletion = () => {
    const today = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    localStorage.setItem('lastCheckinDate', today)
  }

  // Função para resetar o check-in (apenas para desenvolvimento)
  const resetCheckin = () => {
    localStorage.removeItem('lastCheckinDate')
    setDailyAnswers([])
    setDailyReport(null)
    setShowReport(false)
    setCurrentQuestion(0)
    setCompletedQuestions(new Set())
  }

  const dailyQuestions: DailyQuestion[] = [
    {
      id: "mood_check",
      question: "Como você está se sentindo agora?",
      description: "Escolha o emoji que melhor representa seu humor",
      type: "emoji",
      category: "mental",
      weight: 0.15,
      icon: <Heart className="text-pink-500" size={24} />,
      color: "from-pink-400 to-rose-500",
      emoji: "😊"
    },
    {
      id: "energy_level",
      question: "Qual seu nível de energia hoje?",
      description: "De 1 a 5, onde você se encontra?",
      type: "scale",
      category: "physical",
      weight: 0.12,
      icon: <Zap className="text-yellow-500" size={24} />,
      color: "from-yellow-400 to-orange-500",
      emoji: "⚡"
    },
    {
      id: "avoided_triggers",
      question: "Conseguiu resistir a tentações hoje?",
      description: "Sua força de vontade está em ação",
      type: "boolean",
      category: "mental",
      weight: 0.25,
      icon: <Shield className="text-green-500" size={24} />,
      color: "from-green-400 to-emerald-500",
      emoji: "🛡️"
    },
    {
      id: "productive_activities",
      question: "Fez algo produtivo hoje?",
      description: "Trabalho, estudos, projetos pessoais",
      type: "boolean",
      category: "mental",
      weight: 0.15,
      icon: <Target className="text-indigo-500" size={24} />,
      color: "from-indigo-400 to-purple-500",
      emoji: "🎯"
    },
    {
      id: "social_connection",
      question: "Teve momentos sociais positivos?",
      description: "Conversas, risadas, conexões genuínas",
      type: "boolean",
      category: "social",
      weight: 0.13,
      icon: <Users className="text-blue-500" size={24} />,
      color: "from-blue-400 to-cyan-500",
      emoji: "👥"
    },
    {
      id: "self_care",
      question: "Cuidou bem de si mesmo hoje?",
      description: "Alimentação, higiene, descanso",
      type: "boolean",
      category: "physical",
      weight: 0.10,
      icon: <Heart className="text-red-500" size={24} />,
      color: "from-red-400 to-pink-500",
      emoji: "💝"
    },
    {
      id: "physical_activity",
      question: "Praticou alguma atividade física?",
      description: "Exercícios, caminhada ou movimento corporal",
      type: "boolean",
      category: "physical",
      weight: 0.10,
      icon: <Activity className="text-green-500" size={24} />,
      color: "from-green-400 to-emerald-500",
      emoji: "🏃‍♂️"
    }
  ]

  const emojiOptions = [
    { emoji: "😊", label: "Feliz", value: "happy" },
    { emoji: "😐", label: "Neutro", value: "neutral" },
    { emoji: "😔", label: "Triste", value: "sad" },
    { emoji: "😤", label: "Irritado", value: "angry" },
    { emoji: "😴", label: "Cansado", value: "tired" },
    { emoji: "🤗", label: "Grato", value: "grateful" }
  ]

  const generateDailyReport = () => {
    if (dailyAnswers.length < dailyQuestions.length) {
      alert("Complete todas as perguntas para gerar seu relatório!")
      return
    }

    const categoryScores = {
      physical: 0,
      mental: 0,
      spiritual: 0,
      social: 0
    }

    const categoryCounts = {
      physical: 0,
      mental: 0,
      spiritual: 0,
      social: 0
    }

    let overallScore = 0
    let totalWeight = 0

    dailyAnswers.forEach(answer => {
      const question = dailyQuestions.find(q => q.id === answer.questionId)
      if (!question) return

      let score = 0
      if (question.type === "boolean") {
        score = answer.answer === true ? 5 : 2
      } else if (question.type === "scale") {
        score = answer.answer as number
      } else if (question.type === "emoji") {
        const emojiScore = {
          "happy": 5,
          "grateful": 5,
          "neutral": 3,
          "tired": 2,
          "sad": 1,
          "angry": 1
        }
        score = emojiScore[answer.answer as keyof typeof emojiScore] || 3
      }

      categoryScores[question.category] += score
      categoryCounts[question.category] += 1
      overallScore += score * question.weight
      totalWeight += question.weight
    })

    // Normalizar scores
    Object.keys(categoryScores).forEach(key => {
      const categoryKey = key as keyof typeof categoryScores
      if (categoryCounts[categoryKey] > 0) {
        categoryScores[categoryKey] = categoryScores[categoryKey] / categoryCounts[categoryKey]
      }
    })

    overallScore = overallScore / totalWeight

    const { recommendations, achievements, nextGoals } = generateRecommendations(overallScore, categoryScores, dailyAnswers)
    
    let mood: "excellent" | "good" | "fair" | "poor"
    if (overallScore >= 4.5) mood = "excellent"
    else if (overallScore >= 3.5) mood = "good"
    else if (overallScore >= 2.5) mood = "fair"
    else mood = "poor"

    const report: DailyReport = {
      date: new Date().toISOString().split('T')[0],
      answers: dailyAnswers,
      overallScore,
      category_scores: categoryScores,
      recommendations,
      mood,
      achievements,
      nextGoals
    }

    setDailyReport(report)
    setShowReport(true)
    
    if (mood === "excellent" || mood === "good") {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }
  }

  const generateRecommendations = (overallScore: number, categoryScores: any, answers: DailyAnswer[]) => {
    const recommendations: string[] = []
    const achievements: string[] = []
    const nextGoals: string[] = []

    // Conquistas
    if (categoryScores.physical >= 4) achievements.push("🏃‍♂️ Campeão do Autocuidado")
    if (categoryScores.mental >= 4) achievements.push("🧠 Mestre da Mente Zen")
    if (categoryScores.spiritual >= 4) achievements.push("✨ Alma Equilibrada")
    if (categoryScores.social >= 4) achievements.push("👥 Conectador Social")

    const avoidedTriggers = answers.find(a => a.questionId === "avoided_triggers")
    if (avoidedTriggers?.answer === true) achievements.push("🛡️ Guardião da Pureza")

    // Recomendações
    if (overallScore >= 4) {
      recommendations.push("🎉 Dia fantástico! Você está arrasando na sua jornada!")
      recommendations.push("🌟 Continue com essa energia positiva, você é inspiração!")
    } else if (overallScore >= 3) {
      recommendations.push("👍 Bom dia! Alguns ajustes pequenos podem elevar ainda mais.")
      recommendations.push("💪 Você tem potencial para dias ainda melhores!")
    } else {
      recommendations.push("🤗 Todo mundo tem dias difíceis. Amanhã é uma nova oportunidade!")
      recommendations.push("💝 Seja gentil consigo mesmo. Progresso é mais importante que perfeição.")
    }

    // Próximas metas
    if (categoryScores.physical < 4) nextGoals.push("🏃‍♂️ Fazer pelo menos 15 minutos de atividade física")
    if (categoryScores.mental < 4) nextGoals.push("📚 Ler por 15 minutos ou aprender algo novo")
    if (categoryScores.social < 4) nextGoals.push("📱 Ligar para alguém especial")
    if (categoryScores.spiritual < 4) nextGoals.push("🙏 Dedicar um momento para reflexão ou gratidão")

    return { recommendations, achievements, nextGoals }
  }

  const updateDailyAnswer = (questionId: string, answer: boolean | number | string) => {
    setDailyAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId)
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer } : a)
      } else {
        return [...prev, { questionId, answer }]
      }
    })

    // Marcar pergunta como completada
    setCompletedQuestions(prev => new Set([...prev, currentQuestion]))
  }

  const getDailyAnswer = (questionId: string): boolean | number | string | undefined => {
    return dailyAnswers.find(a => a.questionId === questionId)?.answer
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { 
      text: "Bom dia!", 
      icon: <Sunrise className="text-yellow-400" size={24} />,
      gradient: "from-orange-300 to-yellow-400"
    }
    if (hour < 18) return { 
      text: "Boa tarde!", 
      icon: <Sun className="text-orange-400" size={24} />,
      gradient: "from-blue-400 to-orange-400"
    }
    return { 
      text: "Boa noite!", 
      icon: <Moon className="text-blue-400" size={24} />,
      gradient: "from-indigo-500 to-purple-600"
    }
  }

  const greeting = getGreeting()
  const currentQ = dailyQuestions[currentQuestion]
  const progress = (dailyAnswers.length / dailyQuestions.length) * 100

  if (!data.addictionType) return null

  // Se o check-in já foi feito hoje, mostrar tela de conclusão
  if (hasCompletedTodayCheckin()) {
    const nextCheckin = getNextCheckinTime()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header de Sucesso */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 relative flex-shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 glass-card/10 rounded-full -translate-y-16 translate-x-16"></div>
            
            <div className="relative z-10 text-center">
              <div className="glass-card/20 p-4 rounded-2xl backdrop-blur-sm w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h1 className="text-2xl font-bold mb-2">Check-in Concluído! ✅</h1>
              <p className="text-white/90 text-sm">Parabéns! Você já fez seu check-in de hoje</p>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            <div className="glass-card/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-md w-full border border-white/50">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-xl font-bold text-white mb-2">Missão Cumprida!</h2>
                <p className="text-white/80">Seu check-in diário foi registrado com sucesso.</p>
              </div>

              {/* Informações do Próximo Check-in */}
              <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <Timer className="text-emerald-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-800">Próximo Check-in</h3>
                    <p className="text-emerald-600 text-sm">Disponível amanhã</p>
                  </div>
                </div>
                
                <div className="text-center py-3">
                  <div className="text-2xl font-bold text-emerald-700 mb-1">
                    {nextCheckin.toLocaleDateString('pt-BR', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </div>
                  <div className="text-emerald-600 font-medium">
                    às {nextCheckin.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'America/Sao_Paulo'
                    })} (Horário de Brasília)
                  </div>
                </div>
              </div>

              {/* Motivação */}
              <div className="text-center">
                <h3 className="font-semibold text-white mb-2">Continue Firme! 💪</h3>
                <p className="text-white/80 text-sm mb-4">
                  Cada check-in é um passo importante na sua jornada de crescimento pessoal.
                </p>
                

              </div>
            </div>


          </div>
        </div>

        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-x-36 -translate-y-36"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {['🎉', '✨', '🌟', '🎊'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}



      {/* Pergunta Atual - Tela Completa */}
      <div className="flex-1 flex flex-col">
        {/* Header da Pergunta */}
        <div className={`bg-gradient-to-r ${currentQ?.color} text-white p-6 relative flex-shrink-0`}>
          <div className="absolute top-0 right-0 w-32 h-32 glass-card/10 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="glass-card/20 p-3 rounded-xl backdrop-blur-sm">
                  <span className="text-2xl">{currentQ?.emoji}</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">{currentQ?.question}</h1>
                  <p className="text-white/90 text-sm">{currentQ?.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/80 text-xs font-medium">Pergunta</div>
                <div className="text-white font-semibold">{currentQuestion + 1}/{dailyQuestions.length}</div>
              </div>
            </div>

            {/* Card de Progresso */}
            <div className="glass-card/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-white" size={20} />
                  <span className="text-white font-semibold">Progresso do Check-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{dailyAnswers.length}/{dailyQuestions.length}</span>
                  <Star className="text-yellow-300" size={16} />
                </div>
              </div>
              
              <div className="w-full glass-card/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-green-300 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(dailyAnswers.length / dailyQuestions.length) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-white/90 text-sm">
                {dailyAnswers.length === dailyQuestions.length 
                  ? "✅ Pronto para gerar seu relatório!"
                  : `${dailyQuestions.length - dailyAnswers.length} perguntas restantes`
                }
              </p>
            </div>
          </div>
        </div>



        {/* Navegação */}
        <div className="glass-card border-t border-white/20 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentQuestion === 0
                  ? "bg-white/20 text-white/40 cursor-not-allowed"
                  : "bg-white/20 text-white/90 hover:bg-white/30 active:scale-95"
              }`}
            >
              ← Anterior
            </button>

            <div className="flex items-center gap-2">
              {dailyQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentQuestion 
                      ? "bg-indigo-500 scale-125 shadow-lg" 
                      : completedQuestions.has(index)
                      ? "bg-green-400 scale-110" 
                      : "bg-white/30 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {currentQuestion < dailyQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={getDailyAnswer(currentQ?.id) === undefined}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  getDailyAnswer(currentQ?.id) === undefined
                    ? "bg-white/20 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 active:scale-95 shadow-md"
                }`}
              >
                Próxima →
              </button>
            ) : (
              <button
                onClick={() => {
                  if (dailyAnswers.length === dailyQuestions.length) {
                    generateDailyReport()
                  }
                }}
                disabled={dailyAnswers.length < dailyQuestions.length}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  dailyAnswers.length < dailyQuestions.length
                    ? "bg-white/20 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 active:scale-95 shadow-md"
                }`}
              >
                Finalizar
              </button>
            )}
          </div>
        </div>

        {/* Instruções da Pergunta */}
        {currentQ?.type === "scale" && (
          <div className="glass-card border-t border-b border-white/20 px-4 py-4">
            <div className="text-center max-w-md mx-auto">
              <div className="text-white text-lg font-semibold mb-1">Avalie de 1 a 5</div>
              <div className="text-sm text-white/80">1 = Muito baixo | 5 = Muito alto</div>
            </div>
          </div>
        )}

        {currentQ?.type === "emoji" && (
          <div className="glass-card border-t border-b border-white/20 px-4 py-4">
            <div className="text-center max-w-md mx-auto">
              <div className="text-white text-lg font-semibold mb-1">Como você está se sentindo?</div>
              <div className="text-sm text-white/80">Escolha o emoji que melhor te representa</div>
            </div>
          </div>
        )}

        {/* Área de Resposta */}
        <div className="flex-1 px-4 py-4 min-h-0">
          {currentQ?.type === "boolean" && (
            <div className="w-full max-w-md mx-auto h-full flex items-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => updateDailyAnswer(currentQ.id, true)}
                  className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 transform active:scale-95 ${
                    getDailyAnswer(currentQ.id) === true
                      ? "bg-gradient-to-br from-green-400 to-emerald-500 border-green-400 text-white shadow-xl scale-105"
                      : "glass-card border-white/20 hover:border-green-300 hover:shadow-lg"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-5xl mb-3 transition-transform duration-300 ${
                      getDailyAnswer(currentQ.id) === true ? "animate-bounce scale-110" : "group-hover:scale-110"
                    }`}>
                      ✅
                    </div>
                    <div className={`font-bold text-xl mb-2 ${
                      getDailyAnswer(currentQ.id) === true ? "text-white" : "text-white/90"
                    }`}>
                      Sim!
                    </div>
                    <div className={`text-sm ${
                      getDailyAnswer(currentQ.id) === true ? "text-white/90" : "text-white/60"
                    }`}>
                      Consegui fazer
                    </div>
                  </div>
                  {getDailyAnswer(currentQ.id) === true && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => updateDailyAnswer(currentQ.id, false)}
                  className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 transform active:scale-95 ${
                    getDailyAnswer(currentQ.id) === false
                      ? "bg-gradient-to-br from-red-400 to-pink-500 border-red-400 text-white shadow-xl scale-105"
                      : "glass-card border-white/20 hover:border-red-300 hover:shadow-lg"
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-5xl mb-3 transition-transform duration-300 ${
                      getDailyAnswer(currentQ.id) === false ? "animate-bounce scale-110" : "group-hover:scale-110"
                    }`}>
                      ❌
                    </div>
                    <div className={`font-bold text-xl mb-2 ${
                      getDailyAnswer(currentQ.id) === false ? "text-white" : "text-white/90"
                    }`}>
                      Não
                    </div>
                    <div className={`text-sm ${
                      getDailyAnswer(currentQ.id) === false ? "text-white/90" : "text-white/60"
                    }`}>
                      Não consegui
                    </div>
                  </div>
                  {getDailyAnswer(currentQ.id) === false && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="text-white" size={20} />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentQ?.type === "scale" && (
            <div className="max-w-md mx-auto h-full flex items-center">
              <div className="grid grid-cols-5 gap-3 w-full">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateDailyAnswer(currentQ.id, level)}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform active:scale-95 ${
                      getDailyAnswer(currentQ.id) === level
                        ? level <= 2 ? "bg-gradient-to-br from-red-400 to-red-500 border-red-400 text-white shadow-xl scale-105" :
                          level <= 3 ? "bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-400 text-white shadow-xl scale-105" :
                          "bg-gradient-to-br from-green-400 to-green-500 border-green-400 text-white shadow-xl scale-105"
                        : "glass-card border-white/20 hover:shadow-lg"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`font-bold text-2xl mb-2 transition-transform duration-300 ${
                        getDailyAnswer(currentQ.id) === level ? "animate-pulse" : "group-hover:scale-125"
                      } ${
                        getDailyAnswer(currentQ.id) === level 
                          ? "text-white"
                          : level <= 2 ? "text-red-400" : level <= 3 ? "text-yellow-500" : "text-green-500"
                      }`}>
                        {level}
                      </div>
                      <div className={`text-xs font-medium ${
                        getDailyAnswer(currentQ.id) === level ? "text-white" : "text-white/80"
                      }`}>
                        {level === 1 ? "Muito baixo" :
                         level === 2 ? "Baixo" :
                         level === 3 ? "Médio" :
                         level === 4 ? "Alto" : "Muito alto"}
                      </div>
                    </div>
                    {getDailyAnswer(currentQ.id) === level && (
                      <div className="absolute -top-1 -right-1">
                        <div className="glass-card rounded-full p-1">
                          <CheckCircle className="text-green-500" size={18} />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQ?.type === "emoji" && (
            <div className="w-full h-full flex flex-col justify-center">
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {emojiOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateDailyAnswer(currentQ.id, option.value)}
                    className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform active:scale-95 aspect-square flex flex-col items-center justify-center ${
                      getDailyAnswer(currentQ.id) === option.value
                        ? "bg-gradient-to-br from-indigo-400 to-purple-500 border-indigo-400 text-white shadow-xl scale-105"
                        : "glass-card border-white/20 hover:shadow-lg hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-2xl mb-2 transition-transform duration-300 ${
                        getDailyAnswer(currentQ.id) === option.value ? "animate-bounce" : "group-hover:scale-110"
                      }`}>
                        {option.emoji}
                      </div>
                      <div className={`text-xs font-medium leading-tight ${
                        getDailyAnswer(currentQ.id) === option.value ? "text-white" : "text-white/80"
                      }`}>
                        {option.label}
                      </div>
                    </div>
                    {getDailyAnswer(currentQ.id) === option.value && (
                      <div className="absolute -top-1 -right-1">
                        <div className="glass-card rounded-full p-1">
                          <CheckCircle className="text-indigo-500" size={14} />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal do Relatório Premium */}
      {showReport && dailyReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="glass-card/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto border border-white/50 my-4">
            {/* Header do Relatório */}
            <div className={`bg-gradient-to-r ${
              dailyReport.mood === "excellent" ? "from-green-400 to-emerald-500" :
              dailyReport.mood === "good" ? "from-blue-400 to-indigo-500" :
              dailyReport.mood === "fair" ? "from-yellow-400 to-orange-500" :
              "from-red-400 to-pink-500"
            } text-white p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Seu Relatório Mágico ✨</h3>
                  <button
                    onClick={() => {
                      setShowReport(false)
                      saveCheckinCompletion()
                    }}
                    className="glass-card/20 hover:glass-card/30 p-2 rounded-xl transition-colors backdrop-blur-sm"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-7xl mb-3 animate-bounce">
                    {dailyReport.mood === "excellent" && "🌟"}
                    {dailyReport.mood === "good" && "😊"}
                    {dailyReport.mood === "fair" && "😐"}
                    {dailyReport.mood === "poor" && "💪"}
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {dailyReport.mood === "excellent" && "Dia Sensacional!"}
                    {dailyReport.mood === "good" && "Ótimo Dia!"}
                    {dailyReport.mood === "fair" && "Dia Ok"}
                    {dailyReport.mood === "poor" && "Dia de Força"}
                  </div>
                  <div className="text-white/90 text-lg font-medium">
                    Score: {dailyReport.overallScore.toFixed(1)}/5.0
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Conquistas */}
              {dailyReport.achievements.length > 0 && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-2xl border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <Crown className="text-yellow-600" size={20} />
                    Conquistas Desbloqueadas
                  </h4>
                  <div className="space-y-2">
                    {dailyReport.achievements.map((achievement, index) => (
                      <div key={index} className="glass-card/60 p-3 rounded-xl border border-yellow-200">
                        <div className="text-yellow-800 font-medium">{achievement}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scores Visuais */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(dailyReport.category_scores).map(([category, score]) => {
                  const categoryNames = {
                    physical: "Físico",
                    mental: "Mental", 
                    spiritual: "Espiritual",
                    social: "Social"
                  }
                  
                  return (
                    <div key={category} className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-2xl border border-white/20 text-center">
                      <div className="mb-2">
                        {category === "physical" && <Activity className="mx-auto text-orange-500" size={24} />}
                        {category === "mental" && <Brain className="mx-auto text-purple-500" size={24} />}
                        {category === "spiritual" && <Sparkles className="mx-auto text-yellow-500" size={24} />}
                        {category === "social" && <Users className="mx-auto text-blue-500" size={24} />}
                      </div>
                      <div className="text-xs font-medium text-white/80 mb-1">{categoryNames[category as keyof typeof categoryNames]}</div>
                      <div className="text-2xl font-bold text-white">
                        {score.toFixed(1)}
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            category === "physical" ? "bg-orange-500" :
                            category === "mental" ? "bg-purple-500" :
                            category === "spiritual" ? "bg-yellow-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Próximas Metas */}
              {dailyReport.nextGoals.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Target className="text-blue-600" size={20} />
                    Próximas Missões
                  </h4>
                  <div className="space-y-2">
                    {dailyReport.nextGoals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-3 glass-card/60 p-3 rounded-xl border border-blue-200">
                        <div className="w-6 h-6 rounded-full border-2 border-blue-400"></div>
                        <div className="text-blue-800 text-sm">{goal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              <div className="space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Gift className="text-purple-500" size={20} />
                  Mensagens Especiais
                </h4>
                
                <div className="space-y-3">
                  {dailyReport.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200">
                      <p className="text-purple-800 font-medium leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botão */}
              <div className="pt-2 pb-20">
                <button
                  onClick={() => {
                    setShowReport(false)
                    saveCheckinCompletion()
                  }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md active:scale-95"
                >
                  Incrível! 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showReport && <BottomNavigation />}
    </div>
  )
}