"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { MILESTONES, getMilestones } from "@/contexts/AddictionContext"
import {
  Target,
  Trophy,
  Clock,
  Timer,
  TrendingUp,
  Sparkles,
  Smile,
  Cross,
  Heart,
  BookOpen,
  Star,
  Crown,
  Zap,
  Shield,
  CheckCircle,
  Calendar,
  TrendingUp as Trending,
  Sun,
  Moon,
  Sunrise
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { useState, useEffect } from "react"
import clsx from "clsx"

export default function EstatisticaPage() {
  const { data, getTimeAbstinent } = useAddiction()
  const { conquered, next } = getMilestones(data.streakStart)
  const router = useRouter()
  const timeAbstinent = getTimeAbstinent()
  const [showMotivation, setShowMotivation] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!data.addictionType) return null

  // Saudações dinâmicas cristãs
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return { text: "Bom dia em Cristo!", icon: <Sunrise className="text-yellow-400" size={20} /> }
    if (hour < 18) return { text: "Boa tarde, irmão!", icon: <Sun className="text-orange-400" size={20} /> }
    return { text: "Boa noite, Deus te abençoe!", icon: <Moon className="text-purple-400" size={20} /> }
  }

  // Versículos motivacionais cristãos
  const versiculos = [
    {
      texto: "Tudo posso naquele que me fortalece.",
      referencia: "Filipenses 4:13",
      emoji: "💪"
    },
    {
      texto: "O Senhor é a minha força e o meu escudo.",
      referencia: "Salmos 28:7",
      emoji: "🛡️"
    },
    {
      texto: "Porque maior é o que está em vós do que o que está no mundo.",
      referencia: "1 João 4:4",
      emoji: "⭐"
    },
    {
      texto: "A cada dia basta o seu mal.",
      referencia: "Mateus 6:34",
      emoji: "🌅"
    },
    {
      texto: "Sede fortes e corajosos, não temais.",
      referencia: "Deuteronômio 31:6",
      emoji: "🦁"
    }
  ]
  const versiculoHoje = versiculos[(new Date().getDate() + new Date().getMonth()) % versiculos.length]

  // Calcular estatísticas reais do progresso
  const totalMotivations = data.motivations.length
  const favoriteMotivations = data.motivations.filter(m => m.favorite).length
  
  // Calcular economia baseada no uso diário
  const totalEconomia = data.dailyUsage.type === "money" 
    ? Math.round(data.dailyUsage.value * timeAbstinent.days)
    : 0
    
  // Calcular tempo recuperado (se o usuário gastava tempo com o vício)
  const tempoRecuperado = data.dailyUsage.type === "time" 
    ? Math.round(data.dailyUsage.value * timeAbstinent.days)
    : Math.round(timeAbstinent.days * 1) // Assume 1h por dia em média

  // Calcular nível baseado no progresso real
  const nivelAtual = Math.floor(timeAbstinent.days / 7) + conquered.length

  // Estatísticas reais do progresso do usuário
  const estatisticasProgresso = [
    {
      title: "Sequência Atual",
      value: timeAbstinent.days,
      unit: timeAbstinent.days === 1 ? "dia" : "dias",
      description: "Dias consecutivos limpo",
      icon: <Calendar className="text-green-500" size={24} />,
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      emoji: "🔥"
    },
    {
      title: "Marcos Conquistados",
      value: conquered.length,
      unit: conquered.length === 1 ? "marco" : "marcos",
      description: "Objetivos alcançados",
      icon: <Trophy className="text-yellow-500" size={24} />,
      gradient: "from-yellow-400 to-amber-500",
      bgGradient: "from-yellow-50 to-amber-50",
      emoji: "🏆"
    },
    {
      title: "Nível Atual",
      value: nivelAtual,
      unit: "nível",
      description: `${Math.floor(nivelAtual / 5)} estrelas ganhas`,
      icon: <Star className="text-indigo-500" size={24} />,
      gradient: "from-indigo-400 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      emoji: "⭐"
    },
    {
      title: "Motivações Criadas",
      value: totalMotivations,
      unit: totalMotivations === 1 ? "motivação" : "motivações",
      description: `${favoriteMotivations} favoritas`,
      icon: <Heart className="text-red-500" size={24} />,
      gradient: "from-red-400 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      emoji: "💝"
    }
  ]

  // Calcular progresso até o próximo marco
  let progressToNext = 0
  let timeToNext = ''
  if (next && data.streakStart) {
    const now = new Date()
    const diffMs = now.getTime() - data.streakStart.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    progressToNext = conquered.length > 0
      ? ((diffHours - MILESTONES[conquered.length - 1].hours) / (next.hours - MILESTONES[conquered.length - 1].hours)) * 100
      : (diffHours / next.hours) * 100
    progressToNext = Math.max(0, Math.min(progressToNext, 100))
    if (progressToNext > 0 && progressToNext < 5) progressToNext = 5
    // Calcular tempo restante
    const hoursLeft = Math.max(0, next.hours - diffHours)
    const dias = Math.floor(hoursLeft / 24)
    const horas = Math.floor(hoursLeft % 24)
    const minutos = Math.floor((hoursLeft * 60) % 60)
    timeToNext = `${dias > 0 ? dias + 'd ' : ''}${horas > 0 ? horas + 'h ' : ''}${minutos}m para o próximo marco`
  }

  const greeting = getGreeting()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <div className="px-4 pt-6">
        {/* Header Cristão Dinâmico */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg">
              <Cross className="text-white" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {greeting.icon}
                <span className="text-gray-600 text-sm font-medium">{greeting.text}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Jornada de Fé</h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl mb-1">{data.addictionType.icon}</div>
            <div className="text-xs text-gray-500">Purificação</div>
          </div>
        </div>

        {/* Versículo do Dia */}
        {showMotivation && (
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-white" size={20} />
                  <span className="text-white font-semibold">Palavra de Hoje</span>
                  <span className="text-2xl">{versiculoHoje.emoji}</span>
                </div>
                <button 
                  onClick={() => setShowMotivation(false)} 
                  className="text-white/70 hover:text-white transition-colors p-1"
                >
                  <Cross size={16} />
                </button>
              </div>
              <p className="text-white font-medium text-base leading-relaxed mb-2 italic">
                "{versiculoHoje.texto}"
              </p>
              <p className="text-white/90 font-semibold text-sm">
                {versiculoHoje.referencia}
              </p>
            </div>
          </div>
        )}

        {/* Cartão Principal - Tempo de Purificação */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 mb-6 shadow-xl border border-purple-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Cross className="text-purple-600" size={24} />
              <span className="text-purple-700 font-bold text-lg">Tempo de Purificação</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-6xl font-black text-purple-600 drop-shadow-lg">
                {timeAbstinent.days > 0 ? timeAbstinent.days : timeAbstinent.hours > 0 ? timeAbstinent.hours : timeAbstinent.minutes}
              </span>
              <div className="text-left">
                <div className="text-2xl font-bold text-purple-500">
                  {timeAbstinent.days > 0
                    ? timeAbstinent.days === 1 ? "dia" : "dias"
                    : timeAbstinent.hours > 0
                      ? timeAbstinent.hours === 1 ? "hora" : "horas"
                      : timeAbstinent.minutes === 1 ? "minuto" : "minutos"}
                </div>
                <div className="text-sm text-gray-500">em Cristo</div>
              </div>
            </div>
            
            <div className="bg-purple-100 rounded-xl p-3 mb-4">
              <div className="text-purple-700 font-mono text-lg">
                {timeAbstinent.days}d {timeAbstinent.hours}h {timeAbstinent.minutes}m {timeAbstinent.seconds}s
              </div>
              <div className="text-purple-600 text-xs mt-1">Contagem em tempo real</div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <Star className="text-yellow-500" size={16} />
              <span className="text-sm font-medium">Caminhando em santidade</span>
              <Star className="text-yellow-500" size={16} />
            </div>
          </div>
        </div>

        {/* Grid de Estatísticas do Progresso */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {estatisticasProgresso.map((stat, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-4 shadow-lg border border-gray-200 relative overflow-hidden group hover:scale-105 transition-all duration-300`}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -translate-y-8 translate-x-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  {stat.icon}
                  <span className="text-2xl">{stat.emoji}</span>
                </div>
                
                <div className="mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    <span className="text-sm font-medium text-gray-600">{stat.unit}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{stat.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progresso para Próximo Marco */}
        {next && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="text-blue-600" size={20} />
              Próxima Conquista
            </h3>
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{next.emoji}</span>
              <div>
                <div className="font-semibold text-gray-800">{next.label}</div>
                <div className="text-gray-600 text-sm">Falta pouco para conquistar!</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className="h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000 relative"
                style={{ width: `${progressToNext}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">{Math.round(progressToNext)}% completo</span>
              <span className="text-xs font-medium text-blue-600">{timeToNext}</span>
            </div>
          </div>
        )}

        {/* Testemunhos de Fé - Marcos Conquistados */}
        <div className="mb-6">
          <h2 className="font-bold text-xl text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Crown className="text-yellow-500" size={24} />
            <span>Testemunhos de Vitória</span>
          </h2>
          
          {conquered.length === 0 ? (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 text-center border border-gray-200">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-gray-600 font-medium mb-2">Sua jornada está começando</p>
              <p className="text-gray-500 text-sm">Continue firme na fé, as vitórias virão!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {conquered.map((m, i) => (
                <div
                  key={m.label}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200 shadow-lg relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-200/30 rounded-full -translate-y-8 translate-x-8"></div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {m.emoji}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{m.label}</h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <CheckCircle className="text-green-500" size={14} />
                      <span className="text-green-600 text-xs font-medium">Conquistado</span>
                    </div>
                    <div className="bg-yellow-100 rounded-lg p-2">
                      <span className="text-yellow-700 text-xs font-medium">
                        {m.hours >= 24 ? `${m.hours / 24} dia${m.hours / 24 > 1 ? 's' : ''}` : `${m.hours}h`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Linha do Tempo da Jornada */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 mb-6 shadow-lg border border-indigo-200">
          <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-indigo-600" size={20} />
            Linha do Tempo da Jornada
          </h2>
          
          <div className="relative">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
              {MILESTONES.map((m, idx) => {
                const conquistado = conquered.some(c => c.label === m.label)
                const isNext = next && next.label === m.label
                return (
                  <div key={m.label} className="flex flex-col items-center relative min-w-[60px]">
                    {/* Linha de conexão */}
                    {idx > 0 && (
                      <div 
                        className={`absolute left-[-30px] top-1/2 w-[60px] h-1 ${
                          conquistado ? 'bg-gradient-to-r from-indigo-400 to-purple-400' : 'bg-gray-200'
                        } z-0`} 
                        style={{zIndex: 0}} 
                      />
                    )}
                    
                    {/* Marco */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      conquistado 
                        ? 'bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg' 
                        : isNext 
                          ? 'bg-gradient-to-br from-blue-100 to-indigo-200 border-2 border-indigo-400 animate-pulse'
                          : 'bg-gray-200'
                    }`}>
                      <span className={`text-xl ${conquistado ? 'filter drop-shadow-sm' : ''}`}>
                        {m.emoji}
                      </span>
                    </div>
                    
                    <span className={`text-xs font-semibold text-center leading-tight ${
                      conquistado ? 'text-indigo-700' : isNext ? 'text-indigo-600' : 'text-gray-400'
                    }`}>
                      {m.label}
                    </span>
                    
                    {isNext && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                          Próximo
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Barra de progresso */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: `${(conquered.length / MILESTONES.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-600">
                {conquered.length} de {MILESTONES.length} marcos
              </span>
              <span className="text-xs font-medium text-indigo-600">
                {Math.round((conquered.length / MILESTONES.length) * 100)}% completo
              </span>
            </div>
          </div>
        </div>

        {/* Oração de Gratidão */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 mb-6 border border-rose-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart className="text-rose-500" size={20} />
              <h3 className="font-bold text-gray-800">Oração de Gratidão</h3>
            </div>
            <p className="text-gray-700 text-sm italic leading-relaxed">
              "Senhor, obrigado por cada dia de vitória, por Tua força que me sustenta 
              e por Teu amor que me purifica. Que eu continue firme nesta jornada de fé. 
              Em nome de Jesus, amém."
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Star className="text-yellow-400" size={16} />
              <span className="text-rose-600 text-xs font-medium">Continue confiando no Senhor</span>
              <Star className="text-yellow-400" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
