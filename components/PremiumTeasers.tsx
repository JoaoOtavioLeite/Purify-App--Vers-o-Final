"use client"

import { useState } from "react"
import { 
  Crown, 
  TrendingUp, 
  Users, 
  Palette,
  Lock,
  Sparkles,
  ArrowRight,
  Star,
  X
} from "lucide-react"
import Link from "next/link"

interface PremiumTeaserProps {
  currentStreakDays: number
  onUpgradeClick: () => void
}

export function PremiumTeasers({ currentStreakDays, onUpgradeClick }: PremiumTeaserProps) {
  const [dismissedTeasers, setDismissedTeasers] = useState<string[]>([])

  const dismissTeaser = (teaserId: string) => {
    setDismissedTeasers(prev => [...prev, teaserId])
    // Persistir no localStorage
    const dismissed = JSON.parse(localStorage.getItem('dismissedTeasers') || '[]')
    localStorage.setItem('dismissedTeasers', JSON.stringify([...dismissed, teaserId]))
  }

  // Carregar teasers dismissados do localStorage
  useState(() => {
    if (typeof window !== 'undefined') {
      const dismissed = JSON.parse(localStorage.getItem('dismissedTeasers') || '[]')
      setDismissedTeasers(dismissed)
    }
  })

  // Lógica para mostrar teasers baseada no progresso
  const shouldShowAnalyticsTeaser = currentStreakDays >= 7 && !dismissedTeasers.includes('analytics')
  const shouldShowPartnersTeaser = currentStreakDays >= 14 && !dismissedTeasers.includes('partners')
  const shouldShowThemesTeaser = currentStreakDays >= 3 && !dismissedTeasers.includes('themes')

  return (
    <div className="space-y-4">
      {/* Teaser Analytics - Mostra após 7 dias */}
      {shouldShowAnalyticsTeaser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 relative">
          <button
            onClick={() => dismissTeaser('analytics')}
            className="absolute top-3 right-3 w-6 h-6 bg-white/60 rounded-full flex items-center justify-center"
          >
            <X className="text-gray-500" size={14} />
          </button>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                🎉 Parabéns pelos {currentStreakDays} dias!
                <Crown className="text-yellow-500" size={16} />
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                Que tal ver suas estatísticas detalhadas? O Premium pode mostrar gráficos incríveis do seu progresso!
              </p>
            </div>
          </div>
          
          {/* Preview Mock */}
          <div className="bg-white/60 rounded-xl p-3 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 flex items-center justify-end pr-4">
              <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Lock size={10} />
                Premium
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-2">📊 Seu gráfico de progresso:</div>
            <div className="space-y-1">
              <div className="h-2 bg-blue-200 rounded-full"></div>
              <div className="h-2 bg-blue-300 rounded-full w-4/5"></div>
              <div className="h-2 bg-blue-400 rounded-full w-3/5"></div>
              <div className="h-2 bg-blue-500 rounded-full w-full"></div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onUpgradeClick}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors"
            >
              Ver Análises Completas
            </button>
            <Link
              href="/premium"
              className="bg-white border border-blue-300 hover:border-blue-400 text-blue-600 py-2 px-4 rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
            >
              Saiba Mais <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Teaser Parceiros - Mostra após 14 dias */}
      {shouldShowPartnersTeaser && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 relative">
          <button
            onClick={() => dismissTeaser('partners')}
            className="absolute top-3 right-3 w-6 h-6 bg-white/60 rounded-full flex items-center justify-center"
          >
            <X className="text-gray-500" size={14} />
          </button>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-1">
                💪 Você está indo muito bem!
              </h3>
              <p className="text-green-700 text-sm mb-3">
                Usuários com parceiros de responsabilidade têm <strong>67% mais sucesso</strong>. 
                Que tal encontrar alguém para esta jornada?
              </p>
            </div>
          </div>
          
          {/* Preview de Chat */}
          <div className="bg-white/60 rounded-xl p-3 mb-4 space-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 flex items-end justify-center pb-2">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Lock size={10} />
                Premium
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs">👨</div>
              <div className="bg-gray-200 rounded-lg px-3 py-1 text-xs">Como foi seu dia?</div>
            </div>
            <div className="flex gap-2 justify-end">
              <div className="bg-green-500 text-white rounded-lg px-3 py-1 text-xs">Indo bem! 💪</div>
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-xs">🧑</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onUpgradeClick}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors"
            >
              Encontrar Parceiro
            </button>
            <button className="bg-white border border-green-300 hover:border-green-400 text-green-600 py-2 px-4 rounded-xl text-sm font-medium transition-colors">
              Depois
            </button>
          </div>
        </div>
      )}

      {/* Teaser Temas - Mostra após 3 dias */}
      {shouldShowThemesTeaser && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5 relative">
          <button
            onClick={() => dismissTeaser('themes')}
            className="absolute top-3 right-3 w-6 h-6 bg-white/60 rounded-full flex items-center justify-center"
          >
            <X className="text-gray-500" size={14} />
          </button>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Palette className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-800 mb-1 flex items-center gap-2">
                🎨 Personalize sua experiência
                <Sparkles className="text-yellow-500" size={16} />
              </h3>
              <p className="text-purple-700 text-sm mb-3">
                Experimente nossos temas premium exclusivos! Cada cor pode influenciar sua motivação.
              </p>
            </div>
          </div>
          
          {/* Preview de Temas */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { name: "Pôr do Sol", bg: "bg-gradient-to-r from-orange-400 to-red-500" },
              { name: "Oceano", bg: "bg-gradient-to-r from-blue-500 to-cyan-500" },
              { name: "Floresta", bg: "bg-gradient-to-r from-green-500 to-emerald-500" },
              { name: "Neon", bg: "bg-gradient-to-r from-purple-500 to-pink-500" },
            ].map((theme, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className={`h-12 ${theme.bg} rounded-lg shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden`}>
                  {index > 0 && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Crown className="text-white" size={12} />
                    </div>
                  )}
                </div>
                <div className="text-center text-xs text-purple-700 mt-1 font-medium">{theme.name}</div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Link
              href="/premium"
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors"
            >
              Explorar Temas
            </Link>
            <button className="bg-white border border-purple-300 hover:border-purple-400 text-purple-600 py-2 px-4 rounded-xl text-sm font-medium transition-colors">
              Mais Tarde
            </button>
          </div>
        </div>
      )}

      {/* Teaser Geral Premium - Sempre visível para usuários gratuitos */}
      {!dismissedTeasers.includes('general-premium') && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5 relative">
          <button
            onClick={() => dismissTeaser('general-premium')}
            className="absolute top-3 right-3 w-6 h-6 bg-white/60 rounded-full flex items-center justify-center"
          >
            <X className="text-gray-500" size={14} />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Crown className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">
                Desbloqueie todo seu potencial
              </h3>
              <p className="text-yellow-700 text-sm">
                Usuários Premium têm 3x mais chances de sucesso a longo prazo
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-yellow-800">📊</div>
              <div className="text-xs text-yellow-700">Análise</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-yellow-800">👥</div>
              <div className="text-xs text-yellow-700">Parceiros</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 text-center">
              <div className="text-sm font-bold text-yellow-800">🎨</div>
              <div className="text-xs text-yellow-700">Temas</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="text-yellow-500 fill-current" size={12} />
              ))}
              <span className="text-yellow-700 text-xs ml-1">4.9/5 ⭐</span>
            </div>
            <button
              onClick={onUpgradeClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors"
            >
              Teste 7 dias grátis
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

