"use client"

import { useState, useEffect, useRef } from "react"
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
  Users,
  Share2,
  CheckCircle
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { useHaptics } from "@/lib/haptics"
import { useDeviceFeatures } from "@/lib/device-features"
// import html2canvas from "html2canvas"

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
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const achievementsCardRef = useRef<HTMLDivElement>(null)
  const haptics = useHaptics()
  const { share } = useDeviceFeatures()

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

    // Determinar nível atual - verificar do maior para o menor
    let currentLevel = levels[0] // Default para nível 1
    for (let i = levels.length - 1; i >= 0; i--) {
      if (finalPoints >= levels[i].pointsRequired) {
        currentLevel = levels[i]
        break
      }
    }
    setUserLevel(currentLevel.level)
    
    // Log apenas para verificação
    console.log(`🎮 Usuário nível ${currentLevel.level} (${currentLevel.title}) com ${finalPoints} pontos`)
    
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

  const handleShareAchievements = async () => {
    haptics.medium()
    setIsCapturing(true)
    setShareMessage("📸 Capturando conquistas...")

    try {
      if (!achievementsCardRef.current) {
        throw new Error("Elemento não encontrado")
      }

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(achievementsCardRef.current, {
        backgroundColor: '#1e1b4b',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        logging: false,
        width: achievementsCardRef.current.offsetWidth,
        height: achievementsCardRef.current.offsetHeight,
      })

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/png', 1.0)
      })

      if (!blob) {
        throw new Error("Erro ao gerar imagem")
      }

      const file = new File([blob], 'minhas-conquistas-purify.png', { type: 'image/png' })

      if (typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator) {
        const shareData = {
          title: 'Minhas Conquistas no Purify',
          text: `🏆 Nível ${userLevel} alcançado!
💎 ${userPoints} pontos conquistados
🎯 ${unlockedAchievements.length} conquistas desbloqueadas

🚀 Cada vitória conta na jornada!

#Purify #Conquistas #Gamificação #Superação`,
          files: [file]
        }

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          setShareMessage("✅ Conquistas compartilhadas!")
        } else {
          downloadImage(canvas, 'minhas-conquistas-purify.png')
        }
      } else {
        downloadImage(canvas, 'minhas-conquistas-purify.png')
      }

    } catch (error) {
      console.error('Erro ao capturar/compartilhar:', error)
      setShareMessage("⚠️ Erro ao gerar imagem")
    } finally {
      setIsCapturing(false)
      setTimeout(() => setShareMessage(null), 4000)
    }
  }

  const downloadImage = (canvas: HTMLCanvasElement, filename: string) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png', 1.0)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShareMessage("📱 Conquistas salvas! Compartilhe suas vitórias!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-12">
      {/* Header com Nível e Pontos */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 glass-card/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 glass-card/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-medium text-white">Gamificação</h1>
              <p className="text-white/80 text-sm">Seu progresso em conquistas</p>
            </div>
            <div className="glass-card/20 backdrop-blur-sm rounded-2xl px-4 py-3 text-center">
              <div className="text-xl font-bold text-white">{userPoints.toLocaleString()}</div>
              <div className="text-white/90 text-xs font-medium">pontos XP</div>
            </div>
          </div>

          {/* Nível Atual */}
          <div className="glass-card/15 backdrop-blur-md rounded-2xl p-4">
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
                <div className="glass-card/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="glass-card h-full transition-all duration-500 rounded-full"
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
        <div ref={achievementsCardRef} className="glass-card rounded-2xl p-5 shadow-sm relative" style={{background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(88, 28, 135, 0.9) 50%, rgba(124, 58, 237, 0.9) 100%)'}}>
          {/* Watermark do Purify para compartilhamento */}
          <div className="absolute top-3 right-3 opacity-30">
            <span className="text-white text-xs font-bold">PURIFY</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Trophy className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Conquistas Desbloqueadas</h2>
              <p className="text-white/80 text-sm">{unlockedAchievements.length} de {achievements.length} desbloqueadas</p>
            </div>
          </div>
          {unlockedAchievements.length === 0 ? (
            <div className="text-center py-8">
              <Award className="text-white/60 mx-auto mb-3" size={48} />
              <p className="text-white/70">Nenhuma conquista desbloqueada ainda</p>
              <p className="text-white/60 text-sm">Continue sua jornada para desbloquear!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-br from-green-500/30 to-emerald-600/30 border border-green-400/50 rounded-2xl p-4 transform hover:scale-[1.02] transition-all duration-300 shadow-lg backdrop-blur-sm relative overflow-hidden"
                >
                  {/* Brilho de fundo */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
                  
                  <div className="relative z-10">
                    {/* Header com ícone e título */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        {achievement.icon}
                      </div>
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">🏆</span>
                      </div>
                    </div>
                    
                    {/* Conteúdo principal */}
                    <div className="mb-4">
                      <h3 className="font-bold text-white text-base mb-1 leading-tight">{achievement.title}</h3>
                      <p className="text-white/80 text-xs leading-relaxed">{achievement.description}</p>
                    </div>
                    
                    {/* Footer com status e pontos */}
                    <div className="flex items-center justify-between">
                      <span className="bg-green-400 text-green-900 px-2 py-1 rounded-lg text-xs font-bold">
                        ✓ Desbloqueada
                      </span>
                      <div className="text-right">
                        <span className="text-yellow-400 font-bold text-sm">{achievement.points}</span>
                        <span className="text-white/60 text-xs ml-1">XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conquistas Bloqueadas */}
        <div className="glass-card rounded-2xl p-5 shadow-sm ">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center">
              <Target className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Próximas Conquistas</h2>
              <p className="text-white/80 text-sm">{lockedAchievements.length} disponíveis para desbloquear</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-400/30 rounded-2xl p-4 transform hover:scale-[1.02] transition-all duration-300 shadow-lg backdrop-blur-sm relative overflow-hidden opacity-70"
              >
                {/* Brilho de fundo sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Header com ícone e título */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-500/50 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="opacity-60">{achievement.icon}</div>
                    </div>
                    <div className="w-6 h-6 bg-gray-400/50 rounded-full flex items-center justify-center">
                      <span className="text-xs opacity-60">🔒</span>
                    </div>
                  </div>
                  
                  {/* Conteúdo principal */}
                  <div className="mb-4">
                    <h3 className="font-bold text-white/80 text-base mb-1 leading-tight">{achievement.title}</h3>
                    <p className="text-white/60 text-xs leading-relaxed">{achievement.description}</p>
                  </div>
                  
                  {/* Footer com status e pontos */}
                  <div className="flex items-center justify-between">
                    <span className="bg-gray-400/30 text-white/60 px-2 py-1 rounded-lg text-xs font-bold">
                      🔒 Bloqueada
                    </span>
                    <div className="text-right">
                      <span className="text-gray-400 font-bold text-sm">{achievement.points}</span>
                      <span className="text-white/40 text-xs ml-1">XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Todos os Níveis */}
        <div className="glass-card rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-blue-400" size={24} />
            Sistema de Níveis
          </h2>
          
          <div className="space-y-3">
            {[...levels].reverse().map((level) => (
              <div
                key={level.level}
                className={`p-4 rounded-xl border-2 transition-all ${
                  level.level === userLevel
                    ? "bg-blue-500/20 border-blue-400 ring-2 ring-blue-400/30"
                    : level.level < userLevel
                    ? "bg-green-500/20 border-green-400"
                    : "bg-white/10 border-white/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${level.color} flex items-center justify-center`}>
                      {level.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        Nível {level.level}: {level.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {level.pointsRequired.toLocaleString()} pontos necessários
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {level.level < userLevel && (
                      <span className="bg-green-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ✓ Completado
                      </span>
                    )}
                    {level.level === userLevel && (
                      <span className="bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                        🌟 Atual
                      </span>
                    )}
                    {level.level > userLevel && (
                      <span className="bg-white/20 text-white/70 px-3 py-1 rounded-full text-xs font-medium">
                        🔒 Bloqueado ({userPoints}/{level.pointsRequired} pts)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-white/80 text-sm mb-2">Recompensas:</p>
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
            <div className="w-10 h-10 glass-card/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
          </div>
          <h3 className="text-white font-semibold text-base mb-4">🎮 Suas Estatísticas</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{userLevel}</div>
              <div className="text-white/80 text-xs font-medium">Nível Atual</div>
            </div>
            <div className="glass-card/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{unlockedAchievements.length}</div>
              <div className="text-white/80 text-xs font-medium">Conquistas</div>
            </div>
            <div className="glass-card/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{userPoints.toLocaleString()}</div>
              <div className="text-white/80 text-xs font-medium">Total XP</div>
            </div>
            <div className="glass-card/15 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{timeAbstinent.days}</div>
              <div className="text-white/80 text-xs font-medium">Dias Limpos</div>
            </div>
          </div>
        </div>

        {/* Botão de Compartilhar Conquistas */}
        <div className="px-4 pb-4">
          <button
            onClick={handleShareAchievements}
            disabled={isCapturing || shareMessage !== null}
            className={`w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] native-button-press flex items-center justify-center gap-3 ${(isCapturing || shareMessage) ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isCapturing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Capturando...</span>
              </>
            ) : shareMessage ? (
              <>
                <CheckCircle size={20} />
                <span>Sucesso!</span>
              </>
            ) : (
              <>
                <Share2 size={20} />
                <span>Compartilhar Conquistas</span>
              </>
            )}
          </button>
        </div>

        {/* Toast de feedback */}
        {shareMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="glass-card rounded-2xl shadow-2xl p-4 max-w-sm mx-auto animate-spring-in">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-purple-400" size={16} />
                </div>
                <p className="text-white font-medium text-sm">{shareMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}