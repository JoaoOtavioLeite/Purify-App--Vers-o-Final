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

  if (!data.isOnboarded) {
    return <OnboardingFlow />
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: "Bom dia", icon: <Sun className="text-blue-400" size={24} />, color: "from-blue-500/80 to-purple-600/80" }
    if (hour < 18) return { text: "Boa tarde", icon: <Sun className="text-purple-400" size={24} />, color: "from-purple-500/80 to-indigo-600/80" }
    return { text: "Boa noite", icon: <Moon className="text-indigo-400" size={24} />, color: "from-indigo-500/80 to-purple-600/80" }
  }

  const greeting = getGreeting()

  const quickActions = [
    {
      title: "SOS",
      description: "Precisa de ajuda agora?",
      icon: <Shield className="text-white" size={24} />,
      href: "/emergencia",
      gradient: "from-red-400/80 to-pink-500/80",
      shadowColor: "shadow-red-300/50",
      urgent: true,
      emoji: "🚨"
    },
    {
      title: "Motivação",
      description: "Inspiração diária",
      icon: <Heart className="text-white" size={24} />,
      href: "/motivacao", 
      gradient: "from-pink-400/80 to-rose-500/80",
      shadowColor: "shadow-pink-300/50",
      emoji: "💝"
    },
    {
      title: "Conquistas",
      description: "Seus troféus",
      icon: <Trophy className="text-white" size={24} />,
      href: "/gamificacao",
      gradient: "from-yellow-400/80 to-orange-500/80",
      shadowColor: "shadow-yellow-300/50",
      emoji: "🏆"
    },
    {
      title: "Bem-estar",
      description: "Como você está?",
      icon: <Sparkles className="text-white" size={24} />,
      href: "/bem-estar",
      gradient: "from-purple-400/80 to-indigo-500/80",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-12">
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
            {data.addictionType && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">{data.addictionType.icon}</div>
                <div className="text-white/90 text-xs font-medium">{data.addictionType.name}</div>
              </div>
            )}
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
          <div className="glass-card p-5 relative">
            <button
              onClick={() => setShowQuote(false)}
              className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X className="text-white/70" size={14} />
            </button>
            
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="text-white" size={20} />
              </div>
              <div className="flex-1 pr-8">
                <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-1">
                  Inspiração do Dia ✨
                </h3>
                <blockquote className="text-white/90 text-sm leading-relaxed italic mb-2">
                  "{bibleQuote.text}"
                </blockquote>
                <cite className="text-white/70 text-xs font-medium">— {bibleQuote.author}</cite>
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas - Grid 2x2 Otimizado */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={16} />
            </div>
            <h2 className="text-white font-semibold text-base">Acesso Rápido</h2>
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

        {/* Widget de Força Diária */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-400/80 to-purple-500/80 px-5 py-4 backdrop-blur-sm border border-white/10">
            <h2 className="text-white font-semibold text-base flex items-center gap-2">
              <Heart className="text-white" size={18} />
              Força para Hoje
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Resumo Rápido */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-400/30">
                  <Flame className="text-green-400" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {timeAbstinent.days > 0 ? timeAbstinent.days : timeAbstinent.hours > 0 ? timeAbstinent.hours : timeAbstinent.minutes}
                  </div>
                  <div className="text-sm text-white/70">
                    {timeAbstinent.days > 0
                      ? timeAbstinent.days === 1 ? "dia limpo" : "dias limpos"
                      : timeAbstinent.hours > 0
                        ? timeAbstinent.hours === 1 ? "hora limpa" : "horas limpas"
                        : timeAbstinent.minutes === 1 ? "minuto limpo" : "minutos limpos"}
                  </div>
                </div>
              </div>
              <Link 
                href="/estatistica"
                className="text-violet-400 hover:text-violet-300 font-medium text-sm flex items-center gap-1"
              >
                Ver detalhes <ChevronRight size={16} />
              </Link>
            </div>

            {/* Progresso para Próximo Marco */}
            {progress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-white">Próximo marco</span>
                  <span className="text-sm text-white/70">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-600/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-400/90 to-purple-500/90 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-white/60 text-center">
                  Continue forte! Você está indo muito bem! 💪
                </div>
              </div>
            )}

            {/* Ação Rápida */}
            <div className="flex gap-3">
              <Link 
                href="/motivacao"
                className="flex-1 bg-gradient-to-r from-pink-400/80 to-rose-500/80 hover:from-pink-500/90 hover:to-rose-600/90 text-white font-medium py-3 px-4 rounded-xl transition-all text-center text-sm native-button-press backdrop-blur-sm border border-white/10"
              >
                ✨ Motivação
              </Link>
              <Link 
                href="/emergencia"
                className="flex-1 bg-gradient-to-r from-red-400/80 to-orange-500/80 hover:from-red-500/90 hover:to-orange-600/90 text-white font-medium py-3 px-4 rounded-xl transition-all text-center text-sm native-button-press backdrop-blur-sm border border-white/10"
              >
                🚨 SOS
              </Link>
            </div>
          </div>
        </div>

        {/* Dica Motivacional Compacta */}
        <div className="bg-gradient-to-r from-emerald-400/80 to-teal-500/80 rounded-2xl p-5 text-center backdrop-blur-sm border border-white/10">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="text-white" size={20} />
            </div>
          </div>
          <h3 className="text-white font-semibold text-base mb-2">💡 Insight da Recuperação</h3>
          <p className="text-white/90 text-sm leading-relaxed mb-3">
            {timeAbstinent.days === 0 
              ? "Primeira batalha! Seu cérebro está se libertando das conexões viciantes. Você consegue!"
              : timeAbstinent.days < 7
              ? "Semana crítica! A dopamina está se reequilibrando. Cada hora conta para sua recuperação."
              : timeAbstinent.days < 30
              ? "Excelente progresso! Seu cérebro está criando novas conexões saudáveis. Continue forte!"
              : timeAbstinent.days < 90
              ? "Transformação profunda! Sua mente está se libertando completamente do vício."
              : "Renascimento total! Você provou que pode viver livre da pornografia. Inspirador!"
            }
          </p>
          <div className="bg-white/15 rounded-xl p-3">
            <p className="text-white text-xs font-medium">
              <strong>Lembre-se:</strong> Cada momento livre da pornografia reconstrói conexões saudáveis no seu cérebro! 🧠✨
            </p>
          </div>
        </div>




      </div>

      <BottomNavigation />
    </div>
  )
}
