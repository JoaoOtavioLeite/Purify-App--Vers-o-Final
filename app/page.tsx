"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  X, 
  Lightbulb, 
  Menu, 
  Settings, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Star,
  Heart,
  Trophy,
  Shield,
  Zap,
  Sun,
  Moon,
  ChevronRight,
  Timer,
  Target,
  Award,
  Flame
} from "lucide-react"
import Link from "next/link"
import { OnboardingFlow } from "@/components/OnboardingFlow"
import { Dashboard } from "@/components/Dashboard"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

import { getDailyContent } from "@/lib/daily-content"

export default function HomePage() {
  const [showQuote, setShowQuote] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { bibleQuote } = getDailyContent()
  const { data, getTimeAbstinent, getGoalProgress } = useAddiction()

  const timeAbstinent = getTimeAbstinent()
  const progress = getGoalProgress()

  // Atualizar hora a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  if (!data.isOnboarded || !data.addictionType) {
    return <OnboardingFlow />
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: "Bom dia", icon: <Sun className="text-yellow-500" size={24} />, color: "from-yellow-400 to-orange-500" }
    if (hour < 18) return { text: "Boa tarde", icon: <Sun className="text-orange-500" size={24} />, color: "from-orange-400 to-red-500" }
    return { text: "Boa noite", icon: <Moon className="text-indigo-500" size={24} />, color: "from-indigo-400 to-purple-500" }
  }

  const greeting = getGreeting()

  const quickActions = [
    {
      title: "SOS",
      description: "Precisa de ajuda agora?",
      icon: <Shield className="text-white" size={24} />,
      href: "/emergencia",
      gradient: "from-red-500 to-pink-600",
      shadowColor: "shadow-red-300/50",
      urgent: true,
      emoji: "🚨"
    },
    {
      title: "Motivação",
      description: "Inspiração diária",
      icon: <Heart className="text-white" size={24} />,
      href: "/motivacao", 
      gradient: "from-pink-500 to-rose-600",
      shadowColor: "shadow-pink-300/50",
      emoji: "💝"
    },
    {
      title: "Conquistas",
      description: "Seus troféus",
      icon: <Trophy className="text-white" size={24} />,
      href: "/gamificacao",
      gradient: "from-yellow-500 to-orange-600",
      shadowColor: "shadow-yellow-300/50",
      emoji: "🏆"
    },
    {
      title: "Bem-estar",
      description: "Como você está?",
      icon: <Sparkles className="text-white" size={24} />,
      href: "/bem-estar",
      gradient: "from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-300/50",
      emoji: "✨"
    }
  ]

  const todayStats = [
    {
      label: "Tempo Limpo",
      value: timeAbstinent.days > 0 
        ? `${timeAbstinent.days}d ${timeAbstinent.hours}h`
        : `${timeAbstinent.hours}h ${timeAbstinent.minutes}m`,
      icon: <Timer className="text-blue-500" size={20} />,
      color: "text-blue-600"
    },
    {
      label: "Sequência",
      value: `${Math.floor(timeAbstinent.days / 7)} semanas`,
      icon: <Flame className="text-orange-500" size={20} />,
      color: "text-orange-600"
    },
    {
      label: "Nível",
      value: timeAbstinent.days >= 90 ? "Mestre" 
            : timeAbstinent.days >= 30 ? "Campeão"
            : timeAbstinent.days >= 7 ? "Guerreiro" 
            : "Iniciante",
      icon: <Award className="text-purple-500" size={20} />,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Header Moderno */}
      <div className={`bg-gradient-to-r ${greeting.color} pt-14 pb-6 px-4 relative overflow-hidden`}>
        {/* Elementos decorativos minimalistas */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          {/* Saudação Clean */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {greeting.icon}
                <h1 className="text-xl font-medium text-white">{greeting.text}!</h1>
              </div>
              <p className="text-white/80 text-sm">Você está indo muito bem</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
              <div className="text-2xl font-bold text-white">{data.addictionType.icon}</div>
              <div className="text-white/90 text-xs font-medium">{data.addictionType.name}</div>
            </div>
          </div>

          {/* Stats Principais - Design iOS/Android */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4">
              {todayStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-white font-bold text-base">{stat.value}</div>
                  <div className="text-white/70 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Citação Minimalista */}
        {showQuote && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50 relative">
            <button
              onClick={() => setShowQuote(false)}
              className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="text-gray-500" size={14} />
            </button>
            
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="text-white" size={20} />
              </div>
              <div className="flex-1 pr-8">
                <h3 className="text-gray-900 font-semibold text-sm mb-2 flex items-center gap-1">
                  Inspiração do Dia ✨
                </h3>
                <blockquote className="text-gray-700 text-sm leading-relaxed italic mb-2">
                  "{bibleQuote.text}"
                </blockquote>
                <cite className="text-gray-500 text-xs font-medium">— {bibleQuote.author}</cite>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas - Grid 2x2 Otimizado */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={16} />
            </div>
            <h2 className="text-gray-900 font-semibold text-base">Acesso Rápido</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`group bg-gradient-to-br ${action.gradient} rounded-xl p-4 transition-all duration-200 active:scale-95`}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 bg-white/25 rounded-lg flex items-center justify-center">
                    {action.icon}
                  </div>
                  {action.urgent && (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <span className="text-red-500 text-xs font-bold">!</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-white font-semibold text-sm mb-1">
                  {action.title}
                </h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard Integrado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="bg-blue-500 px-5 py-4">
            <h2 className="text-white font-semibold text-base flex items-center gap-2">
              <Target className="text-white" size={18} />
              Seu Progresso
            </h2>
          </div>
          <div className="p-0">
            <Dashboard />
          </div>
        </div>

        {/* Dica Motivacional Compacta */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="text-white" size={20} />
            </div>
          </div>
          <h3 className="text-white font-semibold text-base mb-2">💡 Dica do Dia</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-3">
            {timeAbstinent.days === 0 
              ? "Seu primeiro dia é o mais importante. Foque em passar pelas próximas 24 horas."
              : timeAbstinent.days < 7
              ? "Os primeiros 7 dias são os mais desafiadores. Você está quase lá!"
              : timeAbstinent.days < 30
              ? "Excelente! Agora é criar novos hábitos saudáveis para substituir os antigos."
              : "Parabéns! Você já provou que consegue. Continue fortalecendo sua nova identidade."
            }
          </p>
          <div className="bg-white/15 rounded-xl p-3">
            <p className="text-white text-xs font-medium">
              <strong>Lembre-se:</strong> Cada minuto que você resiste, seu cérebro fica mais forte! 🧠💪
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
