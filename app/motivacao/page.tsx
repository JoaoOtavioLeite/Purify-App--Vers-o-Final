"use client"

import { useState } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronLeft, Plus, Edit3, Trash2, Heart, Menu, Settings, Lightbulb, TrendingUp, Sparkles, Share2, Smile, BookOpen, Star, StarOff, SmilePlus, Frown, Meh } from "lucide-react"
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
  const router = useRouter()

  const frasesInspiradoras = [
    "Você é mais forte do que imagina!",
    "Cada passo conta na sua jornada.",
    "Seu futuro começa com uma decisão hoje.",
    "Acredite no seu potencial de mudança.",
    "Persistência supera qualquer obstáculo.",
    "Você merece uma vida plena e feliz!"
  ]
  const beneficios = [
    { icon: <Heart className="text-pink-500" size={20}/>, texto: "Mais autoestima" },
    { icon: <Smile className="text-yellow-500" size={20}/>, texto: "Saúde mental" },
    { icon: <TrendingUp className="text-green-500" size={20}/>, texto: "Produtividade" },
    { icon: <Lightbulb className="text-blue-500" size={20}/>, texto: "Clareza mental" },
  ]
  const desafioDoDia = "Desafio: Escreva hoje 3 motivos pelos quais você quer continuar firme na sua jornada!";
  const dicaDoDia = "Crie um lembrete diário para revisar sua motivação! Pequenos hábitos constroem grandes resultados.";

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
    }
  }

  const streak = getTimeAbstinent().days

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-20 flex flex-col items-center">
      {/* Card topo */}
      <div className="w-full mt-8">
        <div className="flex flex-col items-center mb-8 px-4">
          <div className="w-full bg-gradient-to-br from-pink-400 via-blue-400 to-cyan-300 rounded-2xl p-5 shadow-lg flex flex-col items-center animate-fade-in relative overflow-hidden">
            <span className="text-5xl mb-2 drop-shadow z-10">{data.addictionType.icon}</span>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-900 via-blue-700 to-purple-700 text-transparent bg-clip-text drop-shadow-lg mb-1 z-10">Motivação</h1>
            <p className="text-white/90 text-base font-medium text-center z-10">O que te faz querer superar este desafio?</p>
            {showConfetti && <div className="absolute inset-0 pointer-events-none animate-pulse-soft z-0">
              <span className="absolute left-1/4 top-1/4 text-4xl">🎉</span>
              <span className="absolute right-1/4 top-1/3 text-3xl">✨</span>
              <span className="absolute left-1/3 bottom-1/4 text-3xl">💪</span>
              <span className="absolute right-1/3 bottom-1/3 text-4xl">🌟</span>
            </div>}
          </div>
        </div>



        {/* Card unificado de motivação e progresso */}
        <div className="w-full bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl p-6 shadow-2xl border border-blue-200/50 mb-6 animate-fade-in relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          {/* Elementos decorativos de fundo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-purple-200/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Cabeçalho do card */}
          <div className="flex items-center justify-between mb-4 relative z-10 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-xl shadow-lg">
                <Lightbulb className="text-white" size={20}/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Nova Motivação</h3>
                <p className="text-sm text-gray-600">Adicione algo que te inspire</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{streak}</div>
              <div className="text-xs text-gray-500">dias firme</div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="mb-4 relative z-10">
            <div className="w-full bg-blue-100/50 rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(streak, 30) / 30 * 100}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Início</span>
              <span>Meta: 30 dias</span>
            </div>
          </div>

          {/* Campo de texto */}
          <div className="mb-4 relative z-10">
            <textarea
              className="w-full rounded-xl border-2 border-blue-200/50 focus:border-blue-400 transition-all p-4 text-gray-800 text-base shadow-sm bg-white/80 resize-none outline-none backdrop-blur-sm"
              rows={3}
              placeholder="Escreva aqui sua motivação..."
              value={newMotivation}
              onChange={e => setNewMotivation(e.target.value)}
            />
          </div>

          {/* Botão de salvar */}
          <button
            onClick={handleAddMotivation}
            disabled={!newMotivation.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100 relative z-10"
          >
            Adicionar Motivação
          </button>

          {/* Seção de sentimentos (apenas se streak = 0) */}
          {streak === 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200/50 relative z-10">
              <p className="text-sm font-medium text-gray-700 mb-3 text-center">Como está se sentindo hoje?</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={() => setReaction('animado')} className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border text-sm font-medium transition-all ${reaction === 'animado' ? 'bg-blue-100 border-blue-400 text-blue-700 shadow-md' : 'bg-white/80 border-blue-200/50 text-gray-700 hover:bg-blue-50'}`}>
                  <span role="img" aria-label="Animado">😃</span> Animado
                </button>
                <button onClick={() => setReaction('motivado')} className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border text-sm font-medium transition-all ${reaction === 'motivado' ? 'bg-green-100 border-green-400 text-green-700 shadow-md' : 'bg-white/80 border-blue-200/50 text-gray-700 hover:bg-green-50'}`}>
                  <span role="img" aria-label="Motivado">💪</span> Motivado
                </button>
                <button onClick={() => setReaction('cansado')} className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border text-sm font-medium transition-all ${reaction === 'cansado' ? 'bg-yellow-100 border-yellow-400 text-yellow-700 shadow-md' : 'bg-white/80 border-blue-200/50 text-gray-700 hover:bg-yellow-50'}`}>
                  <span role="img" aria-label="Cansado">😴</span> Cansado
                </button>
                <button onClick={() => setReaction('desanimado')} className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-sm border text-sm font-medium transition-all ${reaction === 'desanimado' ? 'bg-red-100 border-red-400 text-red-700 shadow-md' : 'bg-white/80 border-blue-200/50 text-gray-700 hover:bg-red-50'}`}>
                  <span role="img" aria-label="Desanimado">😕</span> Desanimado
                </button>
              </div>
            </div>
          )}

          {/* Exibir reação escolhida */}
          {reaction && (
            <div className="mt-4 p-3 bg-white/90 rounded-xl shadow-sm border border-blue-200/50 flex items-center gap-3 relative z-10">
              <div className="text-2xl">
                {reaction === 'animado' && '😃'}
                {reaction === 'motivado' && '💪'}
                {reaction === 'cansado' && '😴'}
                {reaction === 'desanimado' && '😕'}
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">
                {(() => {
                  switch(reaction) {
                    case 'animado': return 'Você está se sentindo animado!';
                    case 'motivado': return 'Você está se sentindo motivado!';
                    case 'cansado': return 'Você está se sentindo cansado.';
                    case 'desanimado': return 'Você está se sentindo desanimado.';
                    default: return '';
                  }
                })()}
              </span>
              <button onClick={() => setReaction(null)} className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors">
                <Trash2 size={16}/>
              </button>
            </div>
          )}
        </div>

        {/* Histórico de motivações */}
        {data.motivations && data.motivations.length > 0 && (
          <div className="w-full mb-8 px-6">
            <h3 className="text-lg font-bold mb-3 text-blue-700 flex items-center gap-2"><Edit3 size={18}/> Minhas Motivações</h3>
            <div className="space-y-3">
              {data.motivations.map((m, i) => (
                <div key={m.date} className={`flex items-center justify-between bg-white/80 rounded-xl p-3 border shadow-sm ${m.favorite ? 'ring-2 ring-yellow-400' : ''}`}>
                  <div className="flex-1">
                    <p className="text-gray-800 text-base mb-1">{m.text}</p>
                    <span className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex flex-col gap-1 ml-3">
                    <button onClick={() => { setNewMotivation(m.text); }} title="Editar" className="p-1 rounded-full hover:bg-blue-100"><Edit3 size={16} className="text-blue-500"/></button>
                    <button onClick={() => favoriteMotivation(m.date)} title="Favoritar" className="p-1 rounded-full hover:bg-yellow-100">{m.favorite ? <Star size={16} className="text-yellow-400"/> : <StarOff size={16} className="text-gray-400"/>}</button>
                    <button onClick={() => { removeMotivation(m.date); }} title="Excluir" className="p-1 rounded-full hover:bg-red-100"><Trash2 size={16} className="text-red-400"/></button>
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