"use client"

import { useState } from "react"
import { 
  Palette, 
  Check, 
  Crown, 
  Sparkles,
  Moon,
  Sun,
  Zap,
  Heart,
  Flame,
  Waves,
  Mountain,
  Leaf
} from "lucide-react"

interface Theme {
  id: string
  name: string
  description: string
  isPremium: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  gradient: string
  icon: React.ReactNode
  preview: {
    header: string
    card: string
    button: string
  }
}

const themes: Theme[] = [
  {
    id: "default",
    name: "Purify Clássico",
    description: "O tema padrão com tons de azul e roxo",
    isPremium: false,
    colors: {
      primary: "#6366f1",
      secondary: "#8b5cf6", 
      accent: "#06b6d4",
      background: "#f8fafc",
      text: "#1e293b"
    },
    gradient: "from-blue-500 to-purple-600",
    icon: <Sparkles className="text-blue-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-blue-500 to-purple-600",
      card: "bg-white border-gray-200",
      button: "bg-blue-500"
    }
  },
  {
    id: "dark-premium",
    name: "Noite Profunda",
    description: "Tema escuro premium com detalhes dourados",
    isPremium: true,
    colors: {
      primary: "#fbbf24",
      secondary: "#f59e0b",
      accent: "#10b981",
      background: "#0f172a",
      text: "#f1f5f9"
    },
    gradient: "from-slate-900 to-slate-800",
    icon: <Moon className="text-yellow-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-slate-900 to-slate-800",
      card: "bg-slate-800 border-slate-700",
      button: "bg-yellow-500"
    }
  },
  {
    id: "sunset",
    name: "Pôr do Sol",
    description: "Gradientes quentes inspirados no entardecer",
    isPremium: true,
    colors: {
      primary: "#f97316",
      secondary: "#ef4444",
      accent: "#fbbf24",
      background: "#fef7ed",
      text: "#9a3412"
    },
    gradient: "from-orange-500 via-red-500 to-pink-500",
    icon: <Sun className="text-orange-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
      card: "bg-orange-50 border-orange-200",
      button: "bg-orange-500"
    }
  },
  {
    id: "neon",
    name: "Neon Cyber",
    description: "Vibes futuristas com cores vibrantes",
    isPremium: true,
    colors: {
      primary: "#06ffa5",
      secondary: "#00d9ff",
      accent: "#ff0080",
      background: "#0a0a0f",
      text: "#00ffc8"
    },
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
    icon: <Zap className="text-cyan-400" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600",
      card: "bg-slate-900 border-cyan-500",
      button: "bg-cyan-400"
    }
  },
  {
    id: "cherry-blossom",
    name: "Cerejeira",
    description: "Tons suaves de rosa e branco",
    isPremium: true,
    colors: {
      primary: "#ec4899",
      secondary: "#f97316",
      accent: "#06b6d4",
      background: "#fdf2f8",
      text: "#831843"
    },
    gradient: "from-pink-400 via-pink-500 to-pink-600",
    icon: <Heart className="text-pink-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600",
      card: "bg-pink-50 border-pink-200",
      button: "bg-pink-500"
    }
  },
  {
    id: "forest",
    name: "Floresta Zen",
    description: "Verde natureza para tranquilidade",
    isPremium: true,
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
      background: "#f0fdf4",
      text: "#064e3b"
    },
    gradient: "from-green-600 to-emerald-600",
    icon: <Leaf className="text-green-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-green-600 to-emerald-600",
      card: "bg-green-50 border-green-200",
      button: "bg-green-500"
    }
  },
  {
    id: "ocean",
    name: "Oceano Profundo",
    description: "Azuis marinhos relaxantes",
    isPremium: true,
    colors: {
      primary: "#0ea5e9",
      secondary: "#0284c7",
      accent: "#06b6d4",
      background: "#f0f9ff",
      text: "#0c4a6e"
    },
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    icon: <Waves className="text-blue-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800",
      card: "bg-blue-50 border-blue-200",
      button: "bg-blue-500"
    }
  },
  {
    id: "volcano",
    name: "Vulcão Ardente",
    description: "Força e energia em tons de fogo",
    isPremium: true,
    colors: {
      primary: "#dc2626",
      secondary: "#ea580c",
      accent: "#f59e0b",
      background: "#fef2f2",
      text: "#7f1d1d"
    },
    gradient: "from-red-600 via-orange-600 to-yellow-500",
    icon: <Flame className="text-red-500" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-red-600 via-orange-600 to-yellow-500",
      card: "bg-red-50 border-red-200",
      button: "bg-red-500"
    }
  },
  {
    id: "mountain",
    name: "Montanha Serena", 
    description: "Tons terrosos e acolhedores",
    isPremium: true,
    colors: {
      primary: "#92400e",
      secondary: "#b45309",
      accent: "#d97706",
      background: "#fefbf3",
      text: "#451a03"
    },
    gradient: "from-amber-700 via-orange-700 to-red-700",
    icon: <Mountain className="text-amber-700" size={20} />,
    preview: {
      header: "bg-gradient-to-r from-amber-700 via-orange-700 to-red-700",
      card: "bg-amber-50 border-amber-200", 
      button: "bg-amber-600"
    }
  }
]

interface PremiumThemesProps {
  currentTheme?: string
  onThemeChange?: (themeId: string) => void
  onUpgrade?: () => void
}

export function PremiumThemes({ currentTheme = "default", onThemeChange, onUpgrade }: PremiumThemesProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme)
  const [showPreview, setShowPreview] = useState<string | null>(null)

  const handleThemeSelect = (theme: Theme) => {
    if (theme.isPremium && !isPremiumUser()) {
      onUpgrade?.()
      return
    }
    
    setSelectedTheme(theme.id)
    onThemeChange?.(theme.id)
  }

  // Simulação de usuário premium (em produção viria do contexto/estado global)
  const isPremiumUser = () => false

  const freeThemes = themes.filter(t => !t.isPremium)
  const premiumThemes = themes.filter(t => t.isPremium)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Palette className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">Temas Personalizados</h1>
              <p className="text-white/80 text-sm">Personalize sua experiência visual</p>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{themes.length}</div>
                <div className="text-white/80 text-xs">Temas Disponíveis</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{premiumThemes.length}</div>
                <div className="text-white/80 text-xs">Temas Premium</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">∞</div>
                <div className="text-white/80 text-xs">Combinações</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Temas Gratuitos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="text-blue-500" size={20} />
            Temas Gratuitos
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {freeThemes.map((theme) => (
              <div key={theme.id} className="relative">
                <button
                  onClick={() => handleThemeSelect(theme)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTheme === theme.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      {theme.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{theme.name}</div>
                      <div className="text-sm text-gray-600">{theme.description}</div>
                    </div>
                    {selectedTheme === theme.id && (
                      <Check className="text-blue-500" size={20} />
                    )}
                  </div>
                  
                  {/* Preview do Tema */}
                  <div className="space-y-2">
                    <div className={`h-4 ${theme.preview.header} rounded-md`}></div>
                    <div className="flex gap-2">
                      <div className={`flex-1 h-8 ${theme.preview.card} rounded-md border`}></div>
                      <div className={`w-16 h-8 ${theme.preview.button} rounded-md`}></div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Temas Premium */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Crown className="text-yellow-500" size={20} />
              Temas Premium
            </h3>
            {!isPremiumUser() && (
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"
              >
                Upgrade
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {premiumThemes.map((theme) => (
              <div key={theme.id} className="relative">
                <button
                  onClick={() => handleThemeSelect(theme)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                    selectedTheme === theme.id
                      ? "border-yellow-500 bg-yellow-50"
                      : isPremiumUser()
                        ? "border-gray-200 hover:border-gray-300 bg-white"
                        : "border-gray-200 bg-gray-50 opacity-75"
                  }`}
                >
                  {/* Overlay Premium */}
                  {!isPremiumUser() && (
                    <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="bg-white/90 rounded-xl px-3 py-1 flex items-center gap-1">
                        <Crown className="text-yellow-500" size={14} />
                        <span className="text-xs font-bold text-gray-800">Premium</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                      {theme.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 flex items-center gap-2">
                        {theme.name}
                        <Crown className="text-yellow-500" size={14} />
                      </div>
                      <div className="text-sm text-gray-600">{theme.description}</div>
                    </div>
                    {selectedTheme === theme.id && isPremiumUser() && (
                      <Check className="text-yellow-500" size={20} />
                    )}
                  </div>
                  
                  {/* Preview do Tema */}
                  <div className="space-y-2">
                    <div className={`h-4 ${theme.preview.header} rounded-md`}></div>
                    <div className="flex gap-2">
                      <div className={`flex-1 h-8 ${theme.preview.card} rounded-md border`}></div>
                      <div className={`w-16 h-8 ${theme.preview.button} rounded-md`}></div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Customização Avançada */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
          <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
            <Palette className="text-purple-600" size={20} />
            Customização Avançada
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Cor Primária</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  defaultValue="#6366f1"
                  className="w-8 h-8 rounded border-2 border-purple-200"
                  disabled={!isPremiumUser()}
                />
                <input 
                  type="text" 
                  defaultValue="#6366f1"
                  className="flex-1 p-2 border border-purple-200 rounded-lg text-sm bg-white disabled:bg-gray-100"
                  disabled={!isPremiumUser()}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">Cor Secundária</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  defaultValue="#8b5cf6"
                  className="w-8 h-8 rounded border-2 border-purple-200"
                  disabled={!isPremiumUser()}
                />
                <input 
                  type="text" 
                  defaultValue="#8b5cf6"
                  className="flex-1 p-2 border border-purple-200 rounded-lg text-sm bg-white disabled:bg-gray-100"
                  disabled={!isPremiumUser()}
                />
              </div>
            </div>
          </div>
          
          {!isPremiumUser() ? (
            <div className="bg-white/60 border border-purple-200 rounded-xl p-4 text-center">
              <Crown className="text-yellow-500 mx-auto mb-2" size={24} />
              <p className="text-purple-800 font-medium text-sm mb-2">
                Customização Avançada Disponível no Premium
              </p>
              <p className="text-purple-700 text-xs mb-3">
                Crie suas próprias combinações de cores e gradientes únicos
              </p>
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-lg"
              >
                Fazer Upgrade
              </button>
            </div>
          ) : (
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
              Salvar Tema Personalizado
            </button>
          )}
        </div>

        {/* Preview em Tempo Real */}
        {showPreview && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Preview do Tema</h3>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-center text-gray-600 text-sm">
                Preview em desenvolvimento...
              </p>
            </div>
          </div>
        )}

        {/* Benefícios Premium */}
        {!isPremiumUser() && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
            <h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
              <Crown className="text-yellow-600" size={20} />
              Desbloqueie Todos os Temas
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={16} />
                <span className="text-yellow-800 text-sm">{premiumThemes.length} temas premium exclusivos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={16} />
                <span className="text-yellow-800 text-sm">Customização avançada de cores</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={16} />
                <span className="text-yellow-800 text-sm">Criação de temas personalizados</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-600" size={16} />
                <span className="text-yellow-800 text-sm">Novos temas mensais</span>
              </div>
            </div>
            
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all"
            >
              Começar Premium por R$ 9,90/mês
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
