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
  Sunrise,
  Share2,
  RotateCcw,
  ChevronRight,
  Flame,
  Award,
  Gift,
  Rocket,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { useState, useEffect, useRef } from "react"
import { useHaptics } from "@/lib/haptics"
import { useDeviceFeatures } from "@/lib/device-features"
// import html2canvas from "html2canvas"

export default function EstatisticaPage() {
  const { data, getTimeAbstinent, resetStreak } = useAddiction()
  const { conquered, next } = getMilestones(data.streakStart)
  const router = useRouter()
  const timeAbstinent = getTimeAbstinent()
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const progressCardRef = useRef<HTMLDivElement>(null)
  const haptics = useHaptics()
  const { share } = useDeviceFeatures()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!data.addictionType) return null

  const handleShare = async () => {
    haptics.medium()
    setIsCapturing(true)
    setShareMessage("📸 Capturando imagem...")

    try {
      if (!progressCardRef.current) {
        throw new Error("Elemento não encontrado")
      }

      // Capturar screenshot do card de progresso
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(progressCardRef.current, {
        backgroundColor: '#f8fafc', // Cor de fundo consistente
        scale: 2, // Alta qualidade
        useCORS: true,
        allowTaint: false,
        removeContainer: false,
        foreignObjectRendering: false,
        imageTimeout: 0,
        logging: false,
        width: progressCardRef.current.offsetWidth,
        height: progressCardRef.current.offsetHeight,
      })

      // Converter canvas para blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/png', 1.0)
      })

      if (!blob) {
        throw new Error("Erro ao gerar imagem")
      }

      // Criar arquivo para compartilhamento
      const file = new File([blob], 'meu-progresso-purify.png', { type: 'image/png' })

      // Tentar compartilhamento nativo com imagem
      if (typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator) {
        const shareData = {
          title: 'Meu Progresso no Purify',
          text: `🚀 Confira meu progresso na jornada de purificação! 
💪 ${conquered.length} marcos conquistados
🔥 Cada dia mais forte, cada escolha mais sábia!

#Purify #Transformação #Superação`,
          files: [file]
        }

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData)
          setShareMessage("✅ Imagem compartilhada com sucesso!")
        } else {
          // Fallback: download da imagem
          downloadImage(canvas)
        }
      } else {
        // Fallback: download da imagem
        downloadImage(canvas)
      }

    } catch (error) {
      console.error('Erro ao capturar/compartilhar:', error)
      setShareMessage("⚠️ Erro ao gerar imagem")
      
      // Fallback para texto
      setTimeout(async () => {
        const days = timeAbstinent.days
        const hours = timeAbstinent.hours
        const minutes = timeAbstinent.minutes
        
        let timeText = ""
        if (days > 0) {
          timeText = `${days} ${days === 1 ? 'dia' : 'dias'}`
          if (hours > 0) timeText += ` e ${hours} ${hours === 1 ? 'hora' : 'horas'}`
        } else if (hours > 0) {
          timeText = `${hours} ${hours === 1 ? 'hora' : 'horas'}`
          if (minutes > 0) timeText += ` e ${minutes} minutos`
        } else {
          timeText = `${minutes} minutos`
        }
        
        const shareText = `🚀 Estou há ${timeText} na minha jornada de purificação com o Purify! 

💪 ${conquered.length} marcos conquistados
🎯 Próximo objetivo: ${next ? next.label : 'Continuar forte!'}
🔥 Cada dia mais forte, cada escolha mais sábia!

#Purify #Transformação #Superação #SemVícios

https://purify-app.vercel.app`

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(shareText)
          setShareMessage("📋 Texto copiado para compartilhar!")
        }
      }, 1000)
    } finally {
      setIsCapturing(false)
      // Limpar mensagem após 4 segundos
      setTimeout(() => {
        setShareMessage(null)
      }, 4000)
    }
  }

  const downloadImage = (canvas: HTMLCanvasElement) => {
    // Criar link para download
    const link = document.createElement('a')
    link.download = 'meu-progresso-purify.png'
    link.href = canvas.toDataURL('image/png', 1.0)
    
    // Simular click para download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setShareMessage("📱 Imagem salva! Compartilhe pelo WhatsApp ou outros apps")
  }

  const handleReset = () => {
    haptics.heavy()
    setShowConfirmReset(true)
  }

  const confirmReset = () => {
    haptics.error()
    resetStreak()
    setShowConfirmReset(false)
    router.push('/')
  }

  // Função para calcular progresso até próximo marco
  const getProgressToNext = () => {
    if (!next) return 100
    const currentHours = timeAbstinent.days * 24 + timeAbstinent.hours
    const nextHours = next.hours
    const prevHours = conquered.length > 0 ? conquered[conquered.length - 1].hours : 0
    const progress = ((currentHours - prevHours) / (nextHours - prevHours)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const progressToNext = getProgressToNext()

  // Mensagens motivacionais baseadas no progresso
  const getMotivationalMessage = () => {
    const days = timeAbstinent.days
    if (days === 0) return "Cada segundo que você resiste é uma vitória! 💪"
    if (days === 1) return "Primeiro dia conquistado! Continue forte! 🔥"
    if (days < 7) return "Semana poderosa! Você está quebrando correntes! ⛓️💥"
    if (days < 30) return "Transformação em progresso! Seu caráter está se fortalecendo! 🌱"
    if (days < 90) return "Mudança profunda acontecendo! Continue firme! 🚀"
    return "Você é um exemplo de superação! Inspire outros! ⭐"
  }

  // Função para obter emoji baseado nos dias
  const getProgressEmoji = () => {
    const days = timeAbstinent.days
    if (days === 0) return "🌱"
    if (days < 7) return "🔥"
    if (days < 30) return "💪"
    if (days < 90) return "🚀"
    return "👑"
  }

  // Obter cor do gradiente baseado no progresso
  const getProgressGradient = () => {
    const days = timeAbstinent.days
    if (days === 0) return "from-green-400 to-emerald-500"
    if (days < 7) return "from-orange-400 to-red-500"
    if (days < 30) return "from-blue-400 to-indigo-500"
    if (days < 90) return "from-purple-400 to-violet-500"
    return "from-yellow-400 to-amber-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="max-w-sm mx-auto p-4 pb-24 space-y-6">
        
        {/* Header Moderno */}
        <div className="text-center pt-6 pb-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Seu Progresso
          </h1>
          <p className="text-gray-600 text-sm">Acompanhe sua jornada de transformação</p>
        </div>

        {/* Card Principal - Contador Gigante */}
        <div className="relative animate-spring-in">
          {/* Efeito de brilho de fundo */}
          <div className={`absolute inset-0 bg-gradient-to-r ${getProgressGradient()} rounded-3xl blur-lg opacity-20 animate-pulse-soft`}></div>
          
          <div className="relative bg-gradient-to-br from-white to-violet-50 rounded-3xl p-8 shadow-2xl border border-violet-200/50 backdrop-blur-sm">
            {/* Decorações de fundo */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-fuchsia-200/30 to-pink-200/30 rounded-full blur-lg"></div>
            
            <div className="relative z-10 text-center space-y-6">
              {/* Emoji e título */}
              <div className="space-y-2">
                <div className="text-4xl animate-bounce-tap">{getProgressEmoji()}</div>
                <h2 className="text-lg font-bold text-violet-700 flex items-center justify-center gap-2">
                  <Sparkles size={20} className="text-violet-500" />
                  Tempo de Purificação
                </h2>
              </div>

              {/* Contador principal */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-7xl font-black bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-rubber-band">
                    {timeAbstinent.days > 0 ? timeAbstinent.days : timeAbstinent.hours > 0 ? timeAbstinent.hours : timeAbstinent.minutes}
                  </span>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-violet-500">
                      {timeAbstinent.days > 0
                        ? timeAbstinent.days === 1 ? "dia" : "dias"
                        : timeAbstinent.hours > 0
                          ? timeAbstinent.hours === 1 ? "hora" : "horas"
                          : timeAbstinent.minutes === 1 ? "minuto" : "minutos"}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">de superação</div>
                  </div>
                </div>

                {/* Tempo detalhado */}
                <div ref={progressCardRef} className="bg-violet-100/70 backdrop-blur-sm rounded-2xl p-4 border border-violet-200/50">
                  <div className="text-violet-700 font-mono text-xl font-bold tracking-wider">
                    {String(timeAbstinent.days).padStart(2, '0')}d {String(timeAbstinent.hours).padStart(2, '0')}h {String(timeAbstinent.minutes).padStart(2, '0')}m {String(timeAbstinent.seconds).padStart(2, '0')}s
                  </div>
                  <div className="text-violet-600 text-sm mt-1 font-medium">Tempo real • Cada momento conta</div>
                </div>

                {/* Data de início */}
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">Desde {data.streakStart ? new Date(data.streakStart).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long',
                    year: 'numeric'
                  }) : 'Hoje'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximo Marco */}
        {next && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Próximo Marco</h3>
                <p className="text-white/90 text-sm">{next.label}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/90 text-sm font-medium">
                  {Math.floor((timeAbstinent.days * 24 + timeAbstinent.hours))} de {next.hours} horas
                </span>
                <span className="text-white font-bold text-sm">
                  {Math.round(progressToNext)}%
                </span>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              
              <p className="text-white/80 text-xs text-center">
                Faltam {Math.ceil((next.hours - (timeAbstinent.days * 24 + timeAbstinent.hours)) / 24)} dias para conquistar este marco!
              </p>
            </div>
          </div>
        )}

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center animate-spring-in">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Trophy className="text-green-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{conquered.length}</div>
            <div className="text-sm text-gray-600">Marcos Conquistados</div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 text-center animate-spring-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="text-blue-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{Math.floor(timeAbstinent.days / 7) + 1}</div>
            <div className="text-sm text-gray-600">Nível Atual</div>
          </div>
        </div>

        {/* Mensagem Motivacional */}
        <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">💫 Mensagem de Força</h3>
              <p className="text-white/95 text-sm leading-relaxed">
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          {/* Compartilhar Progresso */}
          <button
            onClick={handleShare}
            disabled={isCapturing || shareMessage !== null}
            className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] native-button-press flex items-center justify-center gap-3 ${(isCapturing || shareMessage) ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                <span>Compartilhar Imagem</span>
              </>
            )}
          </button>
          
          {/* Reiniciar Contagem */}
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] native-button-press flex items-center justify-center gap-3"
          >
            <RotateCcw size={20} />
            <span>Reiniciar Contagem</span>
          </button>
        </div>

        {/* Modal de Confirmação de Reset */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirmReset(false)} />
            <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-spring-in">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <RotateCcw className="text-red-600" size={24} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Reiniciar Contagem?</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tem certeza que deseja reiniciar sua contagem? Todo o progresso atual será perdido, mas você pode começar uma nova jornada imediatamente.
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all native-button-press"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmReset}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl transition-all native-button-press"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Marcos Conquistados */}
        {conquered.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Crown className="text-yellow-500" size={24} />
              Marcos Conquistados
            </h3>
            
            <div className="space-y-3">
              {conquered.slice(-3).reverse().map((milestone, index) => (
                <div key={milestone.hours} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="text-yellow-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{milestone.label}</h4>
                    <p className="text-sm text-gray-600">{Math.floor(milestone.hours / 24)} dias • Marco conquistado!</p>
                  </div>
                  <div className="text-2xl">{milestone.emoji}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Toast de feedback para compartilhamento */}
      {shareMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 max-w-sm mx-auto animate-spring-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={16} />
              </div>
              <p className="text-gray-800 font-medium text-sm">{shareMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <BottomNavigation />
    </div>
  )
}