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
    <div className="min-h-screen pb-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header com Saudação */}
      <div className={`bg-gradient-to-r ${greeting.color} pt-12 pb-8 px-6 rounded-b-3xl shadow-lg relative overflow-hidden`}>
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {greeting.icon}
              <div>
                <h1 className="text-2xl font-bold text-white">{greeting.text}!</h1>
                <p className="text-white/90">Você está indo muito bem</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{data.addictionType.icon}</div>
              <div className="text-white/80 text-sm">{data.addictionType.name}</div>
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {todayStats.map((stat, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-white font-bold text-sm">{stat.value}</div>
                <div className="text-white/70 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20">
        {/* Citação do Dia - Redesenhada */}
        {showQuote && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 mb-6 relative overflow-hidden">
            <button
              onClick={() => setShowQuote(false)}
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="text-gray-600" size={16} />
            </button>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Lightbulb className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 font-bold text-lg mb-2 flex items-center gap-2">
                  Inspiração do Dia
                  <Sparkles className="text-yellow-500" size={20} />
                </h3>
                <blockquote className="text-gray-700 mb-3 leading-relaxed italic text-base">
                  "{bibleQuote.text}"
                </blockquote>
                <cite className="text-gray-500 text-sm font-medium">— {bibleQuote.author}</cite>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/60 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={18} />
            </div>
            Acesso Rápido
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`group relative bg-gradient-to-br ${action.gradient} rounded-2xl p-5 transition-all duration-300 transform active:scale-95 hover:scale-105 ${action.shadowColor} shadow-lg hover:shadow-xl ${action.urgent ? 'shadow-red-400/60' : ''}`}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Urgent Badge */}
                {action.urgent && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-red-500 text-xs font-bold">!</span>
                  </div>
                )}
                
                <div className="relative z-10">
                  {/* Icon and Emoji Container */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md">
                      {action.icon}
                    </div>
                    <div className="text-2xl">{action.emoji}</div>
                  </div>
                  
                  {/* Content */}
                  <div className="mb-3">
                    <h3 className="text-white font-bold text-lg mb-1 drop-shadow-sm">
                      {action.title}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex justify-end">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ChevronRight className="text-white" size={16} />
                    </div>
                  </div>
                </div>
                
                {/* Active State Overlay */}
                <div className="absolute inset-0 bg-black/10 rounded-2xl opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
              </Link>
            ))}
          </div>
          
          {/* Tips for Mobile */}
          <div className="mt-4 bg-gray-50 rounded-xl p-3">
            <p className="text-gray-600 text-xs text-center flex items-center justify-center gap-1">
              <span className="text-blue-500">💡</span>
              Toque nos cards para acesso rápido às ferramentas
            </p>
          </div>
        </div>

        {/* Dashboard Principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Target className="text-white" size={20} />
              Seu Progresso
            </h2>
          </div>
          <div className="p-0">
            <Dashboard />
          </div>
        </div>

        {/* Dica do Dia */}
        <div className="mt-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-6 text-center shadow-lg">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Star className="text-white" size={24} />
            </div>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">💡 Dica do Dia</h3>
          <p className="text-white/90 mb-4 leading-relaxed">
            {timeAbstinent.days === 0 
              ? "Seu primeiro dia é o mais importante. Foque em passar pelas próximas 24 horas."
              : timeAbstinent.days < 7
              ? "Os primeiros 7 dias são os mais desafiadores. Você está quase lá!"
              : timeAbstinent.days < 30
              ? "Excelente! Agora é criar novos hábitos saudáveis para substituir os antigos."
              : "Parabéns! Você já provou que consegue. Continue fortalecendo sua nova identidade."
            }
          </p>
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-white text-sm">
              <strong>Lembre-se:</strong> Cada minuto que você resiste, seu cérebro fica mais forte! 🧠💪
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
