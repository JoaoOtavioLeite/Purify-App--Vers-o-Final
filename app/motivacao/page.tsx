"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  ChevronLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Heart, 
  Menu, 
  Settings, 
  Lightbulb, 
  TrendingUp, 
  Sparkles, 
  Share2, 
  Smile, 
  BookOpen, 
  Star, 
  StarOff, 
  SmilePlus, 
  Frown, 
  Meh,
  Send,
  Copy,
  CheckCircle,
  Quote,
  Zap,
  Target,
  Crown,
  Flame,
  Save,
  RefreshCw,
  Timer
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

export default function MotivacoesPage() {
  const { data, updateData, getTimeAbstinent, addMotivation, removeMotivation, favoriteMotivation, restoreMotivation } = useAddiction()
  const [showInspiration, setShowInspiration] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quickNote, setQuickNote] = useState("")
  const [reaction, setReaction] = useState<string | null>(null)
  const [newMotivation, setNewMotivation] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [showSaved, setShowSaved] = useState(false)
  const router = useRouter()

  const frasesInspiradoras = [
    "Você é mais forte do que imagina! 💪",
    "Cada passo conta na sua jornada. 👣",
    "Seu futuro começa com uma decisão hoje. 🌟",
    "Acredite no seu potencial de mudança. 🦋",
    "Persistência supera qualquer obstáculo. 🏔️",
    "Você merece uma vida plena e feliz! 🌈",
    "Sua coragem inspira outros. 🔥",
    "O impossível é só questão de opinião. ⚡"
  ]



  const desafiosDoDia = [
    "Escreva 3 motivos pelos quais você quer continuar firme!",
    "Liste 5 coisas pelas quais você é grato hoje.",
    "Defina um pequeno objetivo para hoje.",
    "Compartilhe sua jornada com alguém especial."
  ]

  const dicasDoDia = [
    "Crie um lembrete diário para revisar sua motivação!",
    "Pequenos hábitos constroem grandes resultados.",
    "Celebre cada pequena vitória no seu caminho.",
    "Sua mente é poderosa - use-a a seu favor."
  ]

  // Rotacionar citações a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % frasesInspiradoras.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [frasesInspiradoras.length])

  function getRandomFrase() {
    return frasesInspiradoras[Math.floor(Math.random() * frasesInspiradoras.length)]
  }



  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "Minha motivação", text: data.motivation })
    } else {
      navigator.clipboard.writeText(data.motivation)
      alert("Motivação copiada!")
    }
  }

  function handleAddMotivation() {
    if (newMotivation.trim()) {
      addMotivation(newMotivation.trim())
      setNewMotivation("")
      setShowSaved(true)
      setShowConfetti(true)
      setTimeout(() => {
        setShowSaved(false)
        setShowConfetti(false)
      }, 2000)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewMotivation(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }



  const streak = getTimeAbstinent().days
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
  const dailyQuote = frasesInspiradoras[currentQuote]
  const dailyChallenge = desafiosDoDia[dayOfYear % desafiosDoDia.length]
  const dailyTip = dicasDoDia[dayOfYear % dicasDoDia.length]

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-20">
      {/* Header Inspiracional */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 pt-12 pb-8 px-6 rounded-b-3xl shadow-xl relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Motivação</h1>
                <p className="text-pink-100">Alimente sua alma</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{data.addictionType.icon}</div>
              <div className="text-white/80 text-sm">{streak} dias</div>
            </div>
          </div>

          {/* Citação Rotativa */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 relative">
            <div className="flex items-start gap-3">
              <Quote className="text-white/70 flex-shrink-0 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-white font-medium text-lg leading-relaxed animate-fade-in" key={currentQuote}>
                  {dailyQuote}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex gap-1">
                    {frasesInspiradoras.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentQuote ? 'bg-white' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentQuote((prev) => (prev + 1) % frasesInspiradoras.length)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20 space-y-6">



        {/* Card de Nova Motivação */}
        <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden">
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-30">
              <div className="absolute animate-bounce delay-0 top-4 left-4 text-2xl">🎉</div>
              <div className="absolute animate-bounce delay-150 top-6 right-8 text-xl">✨</div>
              <div className="absolute animate-bounce delay-300 bottom-8 left-8 text-2xl">💪</div>
              <div className="absolute animate-bounce delay-450 bottom-4 right-4 text-xl">🌟</div>
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Nova Motivação</h2>
              <p className="text-white/80">Adicione algo que te inspire</p>
            </div>
            {showSaved && (
              <div className="ml-auto flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                <CheckCircle className="text-green-600" size={16} />
                <span className="text-green-700 text-sm font-medium">Salva!</span>
              </div>
            )}
          </div>

          <div className="relative mb-4">
            <textarea
              className={`w-full rounded-2xl border-2 transition-all duration-300 p-4 text-white text-base shadow-sm bg-white/10 resize-none outline-none backdrop-blur-sm placeholder-white/60 ${
                isTyping 
                  ? 'border-pink-400 shadow-lg shadow-pink-400/30' 
                  : 'border-white/20 focus:border-pink-400'
              }`}
              rows={4}
              placeholder="O que te motiva a continuar forte hoje?"
              value={newMotivation}
              onChange={handleInputChange}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            />
            <div className="absolute bottom-3 right-3">
              <div className={`transition-all duration-300 ${
                newMotivation.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}>
                <span className="text-xs text-white/50">
                  {newMotivation.length}/200
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddMotivation}
            disabled={!newMotivation.trim()}
            className={`w-full py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              newMotivation.trim()
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <Send size={18} />
            Adicionar Motivação
          </button>
        </div>

        {/* Progresso da Jornada */}
        <div className="glass-card rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={24} />
            Progresso da Jornada
          </h2>
          <p className="text-white/80 text-sm mb-4">Acompanhe seus marcos e conquistas</p>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Tempo Limpo */}
            <div className="bg-gradient-to-br from-blue-500/30 to-cyan-600/30 border border-blue-400/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Timer className="text-white" size={16} />
                </div>
                <span className="text-white font-medium text-sm">Tempo Limpo</span>
              </div>
              <div className="text-white font-bold text-lg">
                {streak > 0 ? `${streak} dias` : `${getTimeAbstinent().hours}h ${getTimeAbstinent().minutes}m`}
              </div>
              <p className="text-white/70 text-xs">
                {streak >= 7 ? '🔥 Semana completa!' : streak >= 1 ? '💪 Primeiro dia!' : '🚀 Vamos começar!'}
              </p>
            </div>

            {/* Motivações Criadas */}
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-600/30 border border-purple-400/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Heart className="text-white" size={16} />
                </div>
                <span className="text-white font-medium text-sm">Motivações</span>
              </div>
              <div className="text-white font-bold text-lg">
                {data.motivations?.length || 0}
              </div>
              <p className="text-white/70 text-xs">
                {(data.motivations?.length || 0) >= 5 ? '✨ Muito inspirado!' : '📝 Continue escrevendo'}
              </p>
            </div>

            {/* Nível de Força */}
            <div className="bg-gradient-to-br from-orange-500/30 to-red-600/30 border border-orange-400/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Flame className="text-white" size={16} />
                </div>
                <span className="text-white font-medium text-sm">Nível</span>
              </div>
              <div className="text-white font-bold text-lg">
                {streak >= 90 ? 'Mestre' : streak >= 30 ? 'Campeão' : streak >= 7 ? 'Guerreiro' : 'Iniciante'}
              </div>
              <p className="text-white/70 text-xs">
                {streak >= 30 ? '👑 Você é incrível!' : '⬆️ Continue subindo!'}
              </p>
            </div>

            {/* Próximo Marco */}
            <div className="bg-gradient-to-br from-green-500/30 to-emerald-600/30 border border-green-400/50 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Target className="text-white" size={16} />
                </div>
                <span className="text-white font-medium text-sm">Próximo Marco</span>
              </div>
              <div className="text-white font-bold text-lg">
                {streak >= 365 ? '🏆 Lenda!' : 
                 streak >= 90 ? 'Lenda (365d)' : 
                 streak >= 30 ? 'Mestre (90d)' : 
                 streak >= 7 ? 'Campeão (30d)' : 
                 'Guerreiro (7d)'}
              </div>
              <p className="text-white/70 text-xs">
                {streak >= 365 ? 'Você é uma lenda!' : 
                 streak >= 90 ? `Faltam ${365 - streak} dias` :
                 streak >= 30 ? `Faltam ${90 - streak} dias` :
                 streak >= 7 ? `Faltam ${30 - streak} dias` :
                 `Faltam ${7 - streak} dias`}
              </p>
            </div>
          </div>

          {/* Barra de progresso para próximo marco */}
          <div className="mt-4 p-3 bg-white/10 rounded-xl">
            {(() => {
              // Definir níveis e seus requisitos
              const levels = [
                { name: 'Iniciante', days: 0, next: 'Guerreiro', nextDays: 7, color: 'from-gray-400 to-gray-500' },
                { name: 'Guerreiro', days: 7, next: 'Campeão', nextDays: 30, color: 'from-green-400 to-emerald-500' },
                { name: 'Campeão', days: 30, next: 'Mestre', nextDays: 90, color: 'from-blue-400 to-indigo-500' },
                { name: 'Mestre', days: 90, next: 'Lenda', nextDays: 365, color: 'from-purple-400 to-violet-500' },
                { name: 'Lenda', days: 365, next: null, nextDays: null, color: 'from-yellow-400 to-orange-500' }
              ]
              
              // Encontrar nível atual
              let currentLevel = levels[0]
              for (let i = levels.length - 1; i >= 0; i--) {
                if (streak >= levels[i].days) {
                  currentLevel = levels[i]
                  break
                }
              }
              
              // Calcular progresso
              let progress = 100
              let remainingDays = 0
              let progressText = '100%'
              let nextLevelText = 'Máximo!'
              
              if (currentLevel.next) {
                const currentLevelDays = currentLevel.days
                const nextLevelDays = currentLevel.nextDays!
                const progressInLevel = streak - currentLevelDays
                const daysNeededForNext = nextLevelDays - currentLevelDays
                progress = Math.min((progressInLevel / daysNeededForNext) * 100, 100)
                remainingDays = nextLevelDays - streak
                progressText = `${Math.round(progress)}%`
                nextLevelText = `${remainingDays} dias para ${currentLevel.next}`
              }
              
              return (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">
                      {currentLevel.next ? `Progresso para ${currentLevel.next}` : 'Nível Máximo Alcançado!'}
                    </span>
                    <span className="text-white/60 text-xs">{progressText}</span>
                  </div>
                  
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`bg-gradient-to-r ${currentLevel.color} h-3 rounded-full transition-all duration-1000 relative`}
                      style={{ width: `${progress}%` }}
                    >
                      {progress > 0 && (
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-white/60">
                      Nível: {currentLevel.name} ({streak} dias)
                    </span>
                    <span className="text-white/60">
                      {currentLevel.next ? nextLevelText : '🏆 Lenda Completa!'}
                    </span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>

        {/* Desafio do Dia */}
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 shadow-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Target className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Desafio do Dia</h3>
              <p className="text-orange-100 text-sm">Pequenas ações, grandes resultados</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed mb-4">{dailyChallenge}</p>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white text-sm">
              <strong>💡 Dica:</strong> {dailyTip}
            </p>
          </div>
        </div>

        {/* Histórico de Motivações */}
        {data.motivations && data.motivations.length > 0 && (
          <div className="glass-card rounded-3xl p-6 shadow-xl ">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="text-indigo-500" size={24} />
                Minhas Motivações
              </h2>
              <div className="bg-indigo-100 px-3 py-1 rounded-full">
                <span className="text-indigo-700 text-sm font-medium">{data.motivations.length}</span>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.motivations.map((m, i) => (
                <div 
                  key={m.date} 
                  className={`group relative bg-gradient-to-r p-4 rounded-2xl shadow-md transition-all duration-300 hover:scale-102 ${
                    m.favorite 
                      ? 'from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-yellow-200/50' 
                      : 'from-white/10 to-white/5 border border-white/20 hover:shadow-lg'
                  }`}
                >
                  {m.favorite && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                      <Crown className="text-white" size={12} />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <p className="text-white font-medium leading-relaxed mb-2">{m.text}</p>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>{new Date(m.date).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span>{new Date(m.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setNewMotivation(m.text)} 
                        className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Editar"
                      >
                        <Edit3 size={14} className="text-blue-600" />
                      </button>
                      <button 
                        onClick={() => favoriteMotivation(m.date)} 
                        className={`p-2 rounded-lg transition-colors ${
                          m.favorite 
                            ? 'bg-yellow-100 hover:bg-yellow-200' 
                            : 'bg-white/20 hover:bg-white/20'
                        }`}
                        title={m.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        {m.favorite ? (
                          <Star size={14} className="text-yellow-600 fill-current" />
                        ) : (
                          <Star size={14} className="text-white/80" />
                        )}
                      </button>
                      <button 
                        onClick={() => removeMotivation(m.date)} 
                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  )
}