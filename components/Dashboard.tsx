"use client"

import { useEffect, useState, useRef } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { MILESTONES, getMilestones } from "@/contexts/AddictionContext"
import { X, Lightbulb, Menu, Settings, Target, Calendar, TrendingUp, Award, Clock, Timer, Smile, AlertTriangle, Share2 } from "lucide-react"
import Link from "next/link"
import html2canvas from "html2canvas"

import { getDailyContent } from "@/lib/daily-content"

export function Dashboard() {
  const { data, getTimeAbstinent, getGoalProgress, resetStreak, completeGoal } = useAddiction()
  const [showQuote, setShowQuote] = useState(true)
  const { motivation } = getDailyContent()
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const detailedRef = useRef<HTMLDivElement>(null)

  const timeAbstinent = getTimeAbstinent()
  const progress = getGoalProgress()
  const { conquered, next } = getMilestones(data.streakStart)

  useEffect(() => {
    if (progress >= 100) {
      completeGoal(data.currentGoal)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  const formatTime = (time: { days: number; hours: number; minutes: number; seconds: number }) => {
    if (time.days > 0) {
      return {
        primary: `${time.days}`,
        primaryUnit: time.days === 1 ? "dia" : "dias",
        secondary: `${time.hours}h ${time.minutes}m`,
        detailed: `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`,
      }
    } else if (time.hours > 0) {
      return {
        primary: `${time.hours}`,
        primaryUnit: time.hours === 1 ? "hora" : "horas",
        secondary: `${time.minutes}m ${time.seconds}s`,
        detailed: `${time.hours}h ${time.minutes}m ${time.seconds}s`,
      }
    } else {
      return {
        primary: `${time.minutes}`,
        primaryUnit: time.minutes === 1 ? "minuto" : "minutos",
        secondary: `${time.seconds}s`,
        detailed: `${time.minutes}m ${time.seconds}s`,
      }
    }
  }

  const handleShareProgress = async () => {
    if (!detailedRef.current) return
    try {
      const shareButton = document.querySelector('[data-share-button]') as HTMLButtonElement
      if (shareButton) {
        shareButton.disabled = true
        shareButton.textContent = 'Gerando imagem...'
      }
      const canvas = await html2canvas(detailedRef.current, {
        backgroundColor: '#fff',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Erro ao gerar imagem. Tente novamente.')
          return
        }
        const file = new File([blob], 'tempo-detalhado.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Meu Tempo Detalhado de Purificação',
              text: 'Veja meu tempo detalhado de purificação!',
              files: [file]
            })
          } catch (error) {
            downloadImage(canvas)
          }
        } else {
          downloadImage(canvas)
        }
        if (shareButton) {
          shareButton.disabled = false
          shareButton.innerHTML = '<Share2 size={16} /> Compartilhar Progresso'
        }
      }, 'image/png')
    } catch (error) {
      alert('Erro ao gerar imagem. Tente novamente.')
      const shareButton = document.querySelector('[data-share-button]') as HTMLButtonElement
      if (shareButton) {
        shareButton.disabled = false
        shareButton.innerHTML = '<Share2 size={16} /> Compartilhar Progresso'
      }
    }
  }

  const downloadImage = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a')
    link.download = 'progresso-purificacao.png'
    link.href = canvas.toDataURL()
    link.click()
    
    alert('✅ Imagem salva! Agora você pode compartilhá-la no WhatsApp ou outros apps.')
  }

  if (!data.addictionType) return null

  const formattedTime = formatTime(timeAbstinent)

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-fade-in">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-red-200 shadow-lg max-w-sm w-full">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3 text-gray-800">Confirmar Reinício</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Tem certeza que deseja reiniciar o contador? Esta ação irá zerar todo o seu progresso atual.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => { 
                resetStreak(); 
                setShowConfirmation(false);
                setShowEncouragement(true); 
              }}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all"
            >
              Sim, Reiniciar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showEncouragement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-fade-in">
        <Smile className="text-blue-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Não desista!</h2>
        <p className="text-gray-700 mb-6 max-w-xs">Recaídas fazem parte do processo. O importante é continuar tentando e não perder a esperança. Você é capaz de superar esse desafio!</p>
        <button
          onClick={() => setShowEncouragement(false)}
          className="bg-gradient-to-r from-blue-500 to-sky-500 text-white py-3 px-8 rounded-xl font-semibold shadow hover:scale-105 transition-all"
        >
          Continuar Jornada
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* <h1 className="text-3xl font-bold mb-4 mt-2 bg-gradient-to-r from-blue-500 to-sky-500 text-transparent bg-clip-text drop-shadow-lg">Sua Purificação</h1> */}

      {showQuote && (
        <div className="bg-gradient-to-r from-blue-400 to-sky-500 rounded-2xl p-5 mb-4 relative shadow-lg w-full">

          <div className="flex items-start gap-3">
            <div className="bg-white/30 rounded-full p-2 flex-shrink-0">
              <Lightbulb className="text-white" size={22} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1 text-base">Motivação do dia</h3>
              <p className="text-white/90 mb-2 leading-relaxed text-sm">{motivation.text}</p>
              <p className="text-white/70 text-xs">{motivation.author}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Display */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 mb-4 border border-white/40 shadow-md">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-3xl">{data.addictionType.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{data.addictionType.name}</h2>
              <p className="text-gray-500 text-xs">Tempo purificado</p>
            </div>
          </div>
        </div>

        {/* Large Timer Display */}
        <div className="text-center mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 mb-2 border border-blue-100">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Timer className="text-blue-500" size={18} />
              <span className="text-blue-600 font-medium text-sm">Tempo de Purificação</span>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-1 animate-pulse-soft">{formattedTime.primary}</div>
            <div className="text-base text-blue-500 font-medium mb-1">{formattedTime.primaryUnit}</div>
            <div className="text-sm text-gray-600">{formattedTime.secondary}</div>
          </div>

          <div className="text-xs text-gray-500">
            Desde {data.lastRelapse ? new Date(data.lastRelapse).toLocaleString("pt-BR") : "o início"}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          {/* Remover: exibição de objetivo atual, barra de progresso de objetivo, mensagem de objetivo alcançado, objetivos concluídos */}
          {/* Manter: tempo limpo, motivação, botão de reiniciar contagem */}
        </div>

        {/* Detailed Time Breakdown */}
        <div className="bg-white/60 rounded-xl p-3 mt-3 border border-gray-100 shadow-sm" ref={detailedRef}>
          <h3 className="font-semibold mb-2 text-gray-800 flex items-center gap-1 text-sm">
            <Clock className="text-blue-500" size={14} />
            Tempo Detalhado
          </h3>
          <div className="text-center">
            <div className="text-base font-mono text-gray-700">{formattedTime.detailed}</div>
            <p className="text-xs text-gray-500 mt-1">Cada segundo conta na sua purificação</p>
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={() => setShowConfirmation(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl shadow transition-all flex items-center gap-2"
          >
            Reiniciar Contagem
          </button>
          <button
            data-share-button
            onClick={handleShareProgress}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Share2 size={16} />
            Compartilhar Progresso
          </button>
        </div>
      </div>

      {/* Marcos conquistados */}
      <div className="mt-6">
        <h2 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span>Marcos conquistados</span>
          <span className="text-lg">🏅</span>
        </h2>
        {conquered.length === 0 ? (
          <div className="text-gray-500 text-sm">Nenhum marco conquistado ainda. Continue firme!</div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {conquered.map((m, i) => (
              <div key={m.label} className="flex flex-col items-center min-w-[80px] bg-white/70 rounded-xl p-2 border border-gray-100 shadow-sm">
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-xs font-medium text-gray-700">{m.label}</span>
                <span className="text-green-500 text-xs mt-1">Conquistado</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Próximo marco */}
      {next && (
        <div className="mt-4">
          <h3 className="text-gray-600 text-sm mb-1">Próximo marco</h3>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm">
            <span className="text-xl">{next.emoji}</span>
            <span className="font-semibold text-blue-700">{next.label}</span>
            <span className="text-xs text-gray-500">({next.hours / 24} dias)</span>
          </div>
        </div>
      )}
    </div>
  )
}
