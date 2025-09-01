"use client"

import { useState } from "react"
import { 
  Crown, 
  Star, 
  Check, 
  Sparkles,
  TrendingUp,
  Cloud,
  Users,
  FileText,
  Shield,
  Palette,
  X
} from "lucide-react"

interface PremiumFeature {
  icon: React.ReactNode
  title: string
  description: string
  category: "analytics" | "social" | "customization" | "security"
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: <TrendingUp className="text-blue-500" size={20} />,
    title: "Análises Avançadas",
    description: "Gráficos detalhados, padrões de recaída e insights personalizados",
    category: "analytics"
  },
  {
    icon: <Cloud className="text-green-500" size={20} />,
    title: "Sincronização na Nuvem", 
    description: "Dados sincronizados entre todos seus dispositivos automaticamente",
    category: "security"
  },
  {
    icon: <Users className="text-purple-500" size={20} />,
    title: "Parceiro de Responsabilidade",
    description: "Conecte-se com um mentor ou amigo para apoio mútuo",
    category: "social"
  },
  {
    icon: <Palette className="text-pink-500" size={20} />,
    title: "Temas Premium",
    description: "12 temas exclusivos com cores e gradientes personalizados",
    category: "customization"
  },
  {
    icon: <FileText className="text-orange-500" size={20} />,
    title: "Relatórios Detalhados",
    description: "Exporte PDFs profissionais para compartilhar com terapeutas",
    category: "analytics"
  },
  {
    icon: <Shield className="text-red-500" size={20} />,
    title: "Bloqueador Inteligente",
    description: "Bloqueio automático de sites baseado em IA e machine learning",
    category: "security"
  }
]

interface PremiumCardProps {
  onClose?: () => void
  onUpgrade?: () => void
}

export function PremiumCard({ onClose, onUpgrade }: PremiumCardProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")

  const plans = {
    monthly: {
      price: "9,90",
      originalPrice: "19,90",
      period: "mês",
      discount: "50%",
      features: ["Todos os recursos premium", "Suporte prioritário", "Atualizações exclusivas"]
    },
    yearly: {
      price: "79,90",
      originalPrice: "238,80",
      period: "ano",
      discount: "67%",
      features: ["Todos os recursos premium", "Suporte prioritário VIP", "Acesso beta", "2 meses grátis"]
    }
  }

  const currentPlan = plans[selectedPlan]

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header Premium */}
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-purple-600 p-6 rounded-t-3xl relative overflow-hidden">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <X className="text-white" size={16} />
            </button>
          )}
          
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Crown className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Purify Premium</h2>
            <p className="text-white/90 text-sm">
              Desbloqueie todo o potencial da sua jornada de superação
            </p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Seleção de Planos */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedPlan === "monthly"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="font-bold text-sm">Mensal</div>
                <div className="text-xs opacity-80">Flexibilidade</div>
              </button>
              <button
                onClick={() => setSelectedPlan("yearly")}
                className={`p-3 rounded-xl text-center transition-all relative ${
                  selectedPlan === "yearly"
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {selectedPlan === "yearly" && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Melhor
                  </div>
                )}
                <div className="font-bold text-sm">Anual</div>
                <div className="text-xs opacity-80">Economia</div>
              </button>
            </div>
          </div>

          {/* Preço */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-gray-400 line-through text-lg">R$ {currentPlan.originalPrice}</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                -{currentPlan.discount}
              </span>
            </div>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-gray-800">R$ {currentPlan.price}</span>
              <span className="text-gray-600 ml-1">/{currentPlan.period}</span>
            </div>
            {selectedPlan === "yearly" && (
              <p className="text-green-600 text-sm font-medium mt-1">
                Equivale a R$ 6,66/mês
              </p>
            )}
          </div>

          {/* Features Premium */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-purple-500" size={20} />
              Recursos Exclusivos
            </h3>
            <div className="space-y-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">{feature.title}</div>
                    <div className="text-gray-600 text-xs leading-relaxed">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefícios do Plano */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">O que está incluso:</h3>
            <div className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="text-green-500" size={16} />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Garantia */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-blue-500" size={16} />
              <span className="font-semibold text-blue-800 text-sm">Garantia de 7 dias</span>
            </div>
            <p className="text-blue-700 text-xs">
              Não ficou satisfeito? Devolvemos 100% do seu dinheiro sem perguntas.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Começar Premium Agora
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 transition-colors"
              >
                Continuar com versão gratuita
              </button>
            )}
          </div>

          {/* Depoimento */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="text-yellow-400 fill-current" size={16} />
              ))}
            </div>
            <p className="text-green-800 text-sm italic mb-2">
              "O Premium mudou minha vida! As análises me ajudaram a entender meus padrões e o parceiro de responsabilidade foi fundamental."
            </p>
            <p className="text-green-700 text-xs font-medium">— Carlos, 2 anos limpo</p>
          </div>
        </div>
      </div>
    </div>
  )
}
