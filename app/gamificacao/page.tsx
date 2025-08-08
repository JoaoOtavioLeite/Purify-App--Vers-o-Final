"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  Trophy, 
  Star, 
  Crown, 
  Target, 
  Zap, 
  Gift,
  Medal,
  Award,
  TrendingUp,
  Calendar,
  Timer,
  Heart,
  Shield,
  Brain,
  Flame,
  Users
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  unlockedAt?: Date
  points: number
  category: "time" | "streak" | "activities" | "special"
}

interface Level {
  level: number
  title: string
  pointsRequired: number
  rewards: string[]
  color: string
  icon: React.ReactNode
}

export default function GamificacaoPage() {
  const { data, getTimeAbstinent } = useAddiction()
  const [userLevel, setUserLevel] = useState(1)
  const [userPoints, setUserPoints] = useState(0)
  const [userExperience, setUserExperience] = useState(0)

  const timeAbstinent = getTimeAbstinent()

  // Sistema de níveis
  const levels: Level[] = [
    {
      level: 1,
      title: "Iniciante",
      pointsRequired: 0,
      rewards: ["Acesso ao app", "Sistema de contagem"],
      color: "bg-gray-400",
      icon: <Star className="text-white" size={16} />
    },
    {
      level: 2,
      title: "Determinado",
      pointsRequired: 100,
      rewards: ["Badge de 1 dia", "Motivações extras"],
      color: "bg-blue-400",
      icon: <Shield className="text-white" size={16} />
    },
    {
      level: 3,
      title: "Persistente",
      pointsRequired: 300,
      rewards: ["Badge de 1 semana", "Estatísticas avançadas"],
      color: "bg-green-400",
      icon: <Target className="text-white" size={16} />
    },
    {
      level: 4,
      title: "Guerreiro",
      pointsRequired: 600,
      rewards: ["Badge de 1 mês", "Temas personalizados"],
      color: "bg-purple-400",
      icon: <Medal className="text-white" size={16} />
    },
    {
      level: 5,
      title: "Campeão",
      pointsRequired: 1000,
      rewards: ["Badge de 3 meses", "Modo mentor"],
      color: "bg-orange-400",
      icon: <Trophy className="text-white" size={16} />
    },
    {
      level: 6,
      title: "Lenda",
      pointsRequired: 1500,
      rewards: ["Badge de 6 meses", "Conteúdo exclusivo"],
      color: "bg-red-400",
      icon: <Crown className="text-white" size={16} />
    },
    {
      level: 7,
      title: "Mestre",
      pointsRequired: 2500,
      rewards: ["Badge de 1 ano", "Status de inspiração"],
      color: "bg-gradient-to-r from-yellow-400 to-orange-400",
      icon: <Flame className="text-white" size={16} />
    }
  ]

  // Conquistas disponíveis
  const achievements: Achievement[] = [
    {
      id: "first-day",
      title: "Primeiro Dia",
      description: "Complete seu primeiro dia limpo",
      icon: <Calendar className="text-blue-500" size={24} />,
      unlocked: timeAbstinent.days >= 1,
      points: 50,
      category: "time"
    },
    {
      id: "first-week",
      title: "Uma Semana Forte",
      description: "Complete 7 dias consecutivos",
      icon: <Shield className="text-green-500" size={24} />,
      unlocked: timeAbstinent.days >= 7,
      points: 100,
      category: "time"
    },
    {
      id: "first-month",
      title: "Mês de Vitórias",
      description: "Complete 30 dias consecutivos",
      icon: <Trophy className="text-purple-500" size={24} />,
      unlocked: timeAbstinent.days >= 30,
      points: 300,
      category: "time"
    },
    {
      id: "three-months",
      title: "Trimestre de Força",
      description: "Complete 90 dias consecutivos",
      icon: <Medal className="text-orange-500" size={24} />,
      unlocked: timeAbstinent.days >= 90,
      points: 500,
      category: "time"
    },
    {
      id: "half-year",
      title: "Semestre Heroico",
      description: "Complete 180 dias consecutivos",
      icon: <Crown className="text-red-500" size={24} />,
      unlocked: timeAbstinent.days >= 180,
      points: 750,
      category: "time"
    },
    {
      id: "full-year",
      title: "Ano de Transformação",
      description: "Complete 365 dias consecutivos",
      icon: <Flame className="text-yellow-500" size={24} />,
      unlocked: timeAbstinent.days >= 365,
      points: 1000,
      category: "time"
    },
    {
      id: "early-bird",
      title: "Madrugador",
      description: "Use o app antes das 7h da manhã",
      icon: <Timer className="text-blue-400" size={24} />,
      unlocked: new Date().getHours() < 7,
      points: 25,
      category: "special"
    },
    {
      id: "night-warrior",
      title: "Guerreiro Noturno",
      description: "Resista à tentação após 22h",
      icon: <Star className="text-indigo-500" size={24} />,
      unlocked: new Date().getHours() >= 22,
      points: 30,
      category: "special"
    },
    {
      id: "motivator",
      title: "Motivador",
      description: "Adicione 5 motivações pessoais",
      icon: <Heart className="text-pink-500" size={24} />,
      unlocked: data.motivations?.length >= 5,
      points: 75,
      category: "activities"
    },
    {
      id: "analyzer",
      title: "Analista",
      description: "Visite a página de estatísticas 10 vezes",
      icon: <TrendingUp className="text-emerald-500" size={24} />,
      unlocked: false, // Implementar contador de visitas
      points: 40,
      category: "activities"
    }
  ]

  // Calcular pontos e nível baseado nas conquistas
  useEffect(() => {
    const unlockedAchievements = achievements.filter(a => a.unlocked)
    const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
    
    // Pontos baseados no tempo limpo
    const timePoints = timeAbstinent.days * 10 + timeAbstinent.hours * 2
    const finalPoints = totalPoints + timePoints
    
    setUserPoints(finalPoints)

    // Determinar nível atual
    const currentLevel = levels.reverse().find(level => finalPoints >= level.pointsRequired) || levels[0]
    setUserLevel(currentLevel.level)
    
    // Calcular experiência para próximo nível
    const nextLevel = levels.find(level => level.level === currentLevel.level + 1)
    if (nextLevel) {
      const progressToNext = finalPoints - currentLevel.pointsRequired
      const pointsNeeded = nextLevel.pointsRequired - currentLevel.pointsRequired
      setUserExperience((progressToNext / pointsNeeded) * 100)
    } else {
      setUserExperience(100)
    }
  }, [timeAbstinent, achievements, levels])

  if (!data.addictionType) return null

  const currentLevelData = levels.find(l => l.level === userLevel) || levels[0]
  const nextLevelData = levels.find(l => l.level === userLevel + 1)
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header com Nível e Pontos */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-medium text-white">Gamificação</h1>
              <p className="text-white/80 text-sm">Seu progresso em conquistas</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
              <div className="text-xl font-bold text-white">{userPoints.toLocaleString()}</div>
              <div className="text-white/90 text-xs font-medium">pontos XP</div>
            </div>
          </div>

          {/* Nível Atual */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${currentLevelData.color} flex items-center justify-center`}>
                  {currentLevelData.icon}
                </div>
                <div>
                  <div className="text-white font-semibold text-base">Nível {userLevel}</div>
                  <div className="text-white/80 text-sm">{currentLevelData.title}</div>
                </div>
              </div>
              {nextLevelData && (
                <div className="text-right">
                  <div className="text-white text-xs">Próximo nível</div>
                  <div className="text-white/80 text-xs">{nextLevelData.pointsRequired - userPoints} XP</div>
                </div>
              )}
            </div>
            
            {nextLevelData && (
              <div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white h-full transition-all duration-500 rounded-full"
                    style={{ width: `${userExperience}%` }}
                  />
                </div>
                <div className="text-center text-white/80 text-xs mt-1">
                  {userExperience.toFixed(1)}% para Nível {userLevel + 1}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        {/* Conquistas Desbloqueadas */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-gray-900 font-semibold text-base">Conquistas Desbloqueadas</h2>
              <p className="text-gray-600 text-sm">{unlockedAchievements.length} de {achievements.length} desbloqueadas</p>
            </div>
          </div>
          {unlockedAchievements.length === 0 ? (
            <div className="text-center py-8">
              <Award className="text-gray-400 mx-auto mb-3" size={48} />
              <p className="text-gray-500">Nenhuma conquista desbloqueada ainda</p>
              <p className="text-gray-400 text-sm">Continue sua jornada para desbloquear!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-4 transform hover:scale-105 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {achievement.icon}
                    <div>
                      <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      ✓ Desbloqueada
                    </span>
                    <span className="text-green-600 font-bold">+{achievement.points} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conquistas Bloqueadas */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center">
              <Target className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-gray-900 font-semibold text-base">Próximas Conquistas</h2>
              <p className="text-gray-600 text-sm">{lockedAchievements.length} disponíveis para desbloquear</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 opacity-75"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="opacity-50">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-600">{achievement.title}</h3>
                    <p className="text-gray-500 text-sm">{achievement.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    🔒 Bloqueada
                  </span>
                  <span className="text-gray-500 font-bold">{achievement.points} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Todos os Níveis */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="text-blue-600" size={24} />
            Sistema de Níveis
          </h2>
          
          <div className="space-y-3">
            {levels.reverse().map((level) => (
              <div
                key={level.level}
                className={`p-4 rounded-xl border-2 transition-all ${
                  level.level === userLevel
                    ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                    : level.level < userLevel
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${level.color} flex items-center justify-center`}>
                      {level.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Nível {level.level}: {level.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {level.pointsRequired.toLocaleString()} pontos necessários
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {level.level < userLevel && (
                      <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        ✓ Completado
                      </span>
                    )}
                    {level.level === userLevel && (
                      <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        🌟 Atual
                      </span>
                    )}
                    {level.level > userLevel && (
                      <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                        🔒 Bloqueado
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-gray-600 text-sm mb-2">Recompensas:</p>
                  <div className="flex flex-wrap gap-2">
                    {level.rewards.map((reward, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                      >
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas de Gamificação */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-5 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
          </div>
          <h3 className="text-white font-semibold text-base mb-4">🎮 Suas Estatísticas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{userLevel}</div>
              <div className="text-white/80 text-xs font-medium">Nível Atual</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{unlockedAchievements.length}</div>
              <div className="text-white/80 text-xs font-medium">Conquistas</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{userPoints.toLocaleString()}</div>
              <div className="text-white/80 text-xs font-medium">Total XP</div>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{timeAbstinent.days}</div>
              <div className="text-white/80 text-xs font-medium">Dias Limpos</div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}