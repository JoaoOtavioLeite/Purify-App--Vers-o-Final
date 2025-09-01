"use client"

import { useState, useEffect } from "react"
import { 
  Crown, 
  Check, 
  X, 
  CreditCard, 
  Calendar,
  Gift,
  Star,
  Award,
  TrendingUp,
  Users,
  Palette,
  FileText,
  Cloud,
  Shield,
  Zap,
  AlertCircle
} from "lucide-react"

interface Subscription {
  id: string
  type: "free" | "premium" | "premium_yearly"
  status: "active" | "canceled" | "expired" | "pending"
  startDate: string
  endDate: string
  price: number
  currency: string
  paymentMethod: string
  features: string[]
}

interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  period: string
  discount?: string
  popular?: boolean
  features: Array<{
    icon: React.ReactNode
    text: string
    included: boolean
  }>
}

// Dados simulados para demonstração
const mockSubscription: Subscription = {
  id: "sub_123",
  type: "free",
  status: "active", 
  startDate: "2024-01-15",
  endDate: "2024-12-31",
  price: 0,
  currency: "BRL",
  paymentMethod: "Gratuito",
  features: ["Contador básico", "SOS emergência", "3 motivações", "Gamificação básica"]
}

const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: 0,
    period: "para sempre",
    features: [
      { icon: <Check className="text-green-500" size={16} />, text: "Contador de tempo limpo", included: true },
      { icon: <Check className="text-green-500" size={16} />, text: "Página SOS/Emergência", included: true },
      { icon: <Check className="text-green-500" size={16} />, text: "3 motivações personalizadas", included: true },
      { icon: <Check className="text-green-500" size={16} />, text: "Gamificação básica (5 níveis)", included: true },
      { icon: <Check className="text-green-500" size={16} />, text: "1 tipo de vício", included: true },
      { icon: <X className="text-gray-400" size={16} />, text: "Análises avançadas", included: false },
      { icon: <X className="text-gray-400" size={16} />, text: "Sincronização na nuvem", included: false },
      { icon: <X className="text-gray-400" size={16} />, text: "Parceiros de responsabilidade", included: false },
      { icon: <X className="text-gray-400" size={16} />, text: "Temas premium", included: false },
      { icon: <X className="text-gray-400" size={16} />, text: "Relatórios em PDF", included: false },
    ]
  },
  {
    id: "premium_monthly",
    name: "Premium Mensal",
    price: 9.90,
    originalPrice: 19.90,
    period: "mês",
    discount: "50% OFF",
    features: [
      { icon: <Check className="text-green-500" size={16} />, text: "Todos os recursos gratuitos", included: true },
      { icon: <TrendingUp className="text-blue-500" size={16} />, text: "Análises avançadas com gráficos", included: true },
      { icon: <Cloud className="text-purple-500" size={16} />, text: "Sincronização na nuvem", included: true },
      { icon: <Users className="text-green-500" size={16} />, text: "Parceiros de responsabilidade", included: true },
      { icon: <Palette className="text-pink-500" size={16} />, text: "12 temas premium exclusivos", included: true },
      { icon: <FileText className="text-orange-500" size={16} />, text: "Relatórios em PDF", included: true },
      { icon: <Shield className="text-red-500" size={16} />, text: "Bloqueador de sites inteligente", included: true },
      { icon: <Zap className="text-yellow-500" size={16} />, text: "Lembretes baseados em IA", included: true },
      { icon: <Award className="text-purple-500" size={16} />, text: "Gamificação completa", included: true },
      { icon: <Star className="text-yellow-500" size={16} />, text: "Suporte prioritário", included: true },
    ]
  },
  {
    id: "premium_yearly",
    name: "Premium Anual",
    price: 79.90,
    originalPrice: 238.80,
    period: "ano",
    discount: "67% OFF",
    popular: true,
    features: [
      { icon: <Check className="text-green-500" size={16} />, text: "Todos os recursos do Premium Mensal", included: true },
      { icon: <Gift className="text-green-500" size={16} />, text: "2 meses grátis (economia de R$ 158,90)", included: true },
      { icon: <Crown className="text-yellow-500" size={16} />, text: "Suporte VIP prioritário", included: true },
      { icon: <Zap className="text-blue-500" size={16} />, text: "Acesso antecipado a novas funcionalidades", included: true },
      { icon: <Award className="text-purple-500" size={16} />, text: "Conquistas exclusivas anuais", included: true },
      { icon: <FileText className="text-indigo-500" size={16} />, text: "Relatórios anuais detalhados", included: true },
      { icon: <Users className="text-green-500" size={16} />, text: "Acesso a comunidade VIP", included: true },
      { icon: <Star className="text-yellow-500" size={16} />, text: "Consultoria mensal gratuita", included: true },
    ]
  }
]

export function SubscriptionManager() {
  const [activeTab, setActiveTab] = useState<"current" | "plans" | "billing">("current")
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>(mockSubscription)
  const [selectedPlan, setSelectedPlan] = useState<string>("premium_monthly")
  const [showCancelModal, setShowCancelModal] = useState(false)

  const isPremium = () => currentSubscription.type !== "free"
  const daysUntilExpiry = () => {
    const today = new Date()
    const expiry = new Date(currentSubscription.endDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleUpgrade = (planId: string) => {
    // Aqui implementaria a integração com sistema de pagamento
    console.log("Upgrade para:", planId)
    // Simular upgrade bem-sucedido
    setCurrentSubscription({
      ...currentSubscription,
      type: planId.includes("yearly") ? "premium_yearly" : "premium",
      status: "active",
      price: planId.includes("yearly") ? 79.90 : 9.90,
      paymentMethod: "Cartão de Crédito",
      features: [
        "Análises avançadas",
        "Sincronização na nuvem", 
        "Parceiros de responsabilidade",
        "Temas premium",
        "Relatórios em PDF",
        "Bloqueador inteligente"
      ]
    })
  }

  const handleCancelSubscription = () => {
    setCurrentSubscription({
      ...currentSubscription,
      status: "canceled"
    })
    setShowCancelModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className={`${isPremium() 
        ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
        : 'bg-gradient-to-r from-gray-500 to-gray-600'
      } pt-14 pb-6 px-4 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {isPremium() ? (
                <Crown className="text-white" size={24} />
              ) : (
                <CreditCard className="text-white" size={24} />
              )}
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">
                {isPremium() ? "Assinatura Premium" : "Gerenciar Assinatura"}
              </h1>
              <p className="text-white/80 text-sm">
                {isPremium() 
                  ? "Aproveite todos os recursos premium" 
                  : "Desbloqueie o potencial completo do Purify"
                }
              </p>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">
                  {isPremium() ? "Premium" : "Gratuito"}
                </div>
                <div className="text-white/80 text-xs">Plano Atual</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  R$ {currentSubscription.price.toFixed(2)}
                </div>
                <div className="text-white/80 text-xs">
                  {currentSubscription.type === "premium_yearly" ? "/ano" : "/mês"}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  {isPremium() ? daysUntilExpiry() : "∞"}
                </div>
                <div className="text-white/80 text-xs">
                  {isPremium() ? "dias restantes" : "ilimitado"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Navegação por Abas */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 gap-1">
            {[
              { key: "current", label: "Assinatura", icon: "📋" },
              { key: "plans", label: "Planos", icon: "💎" },
              { key: "billing", label: "Pagamento", icon: "💳" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="text-sm mb-1">{tab.icon}</div>
                <div className="text-xs font-medium">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Aba: Assinatura Atual */}
        {activeTab === "current" && (
          <>
            {/* Status da Assinatura */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Status da Assinatura</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentSubscription.status === "active" 
                    ? "bg-green-100 text-green-800"
                    : currentSubscription.status === "canceled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {currentSubscription.status === "active" ? "Ativa" : 
                   currentSubscription.status === "canceled" ? "Cancelada" : "Pendente"}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plano:</span>
                  <span className="font-medium text-gray-800">
                    {currentSubscription.type === "free" ? "Gratuito" :
                     currentSubscription.type === "premium_yearly" ? "Premium Anual" : "Premium Mensal"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-medium text-gray-800">
                    R$ {currentSubscription.price.toFixed(2)}{currentSubscription.price > 0 ? (
                      currentSubscription.type === "premium_yearly" ? "/ano" : "/mês"
                    ) : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método de Pagamento:</span>
                  <span className="font-medium text-gray-800">{currentSubscription.paymentMethod}</span>
                </div>
                {isPremium() && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Próxima Cobrança:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(currentSubscription.endDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recursos Inclusos */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Recursos Inclusos</h3>
              <div className="grid grid-cols-1 gap-2">
                {currentSubscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="text-green-500" size={16} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ações da Assinatura */}
            <div className="space-y-3">
              {!isPremium() ? (
                <button
                  onClick={() => setActiveTab("plans")}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all"
                >
                  <Crown className="inline mr-2" size={20} />
                  Fazer Upgrade para Premium
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
                    Alterar Plano
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Estatísticas de Uso Premium */}
            {isPremium() && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
                <h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-yellow-600" size={20} />
                  Uso dos Recursos Premium
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-700">47</div>
                    <div className="text-yellow-600 text-xs">Relatórios gerados</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-700">12</div>
                    <div className="text-yellow-600 text-xs">Temas utilizados</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-700">234</div>
                    <div className="text-yellow-600 text-xs">Análises acessadas</div>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-700">3</div>
                    <div className="text-yellow-600 text-xs">Parceiros conectados</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Conteúdo Aba: Planos */}
        {activeTab === "plans" && (
          <>
            {/* Seletor de Planos */}
            <div className="space-y-4">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`bg-white rounded-2xl p-5 border-2 transition-all ${
                    plan.popular 
                      ? "border-purple-500 shadow-lg relative" 
                      : selectedPlan === plan.id
                      ? "border-blue-500 shadow-md"
                      : "border-gray-200 shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                        🔥 MAIS POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {plan.originalPrice && (
                        <span className="text-gray-400 line-through text-lg">
                          R$ {plan.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-gray-800">
                        R$ {plan.price.toFixed(2)}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    {plan.discount && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {plan.discount}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {feature.icon}
                        <span className={`text-sm ${
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.id !== "free" && (
                    <button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={currentSubscription.type === plan.id}
                      className={`w-full font-bold py-3 px-4 rounded-xl transition-all ${
                        currentSubscription.type === plan.id
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {currentSubscription.type === plan.id 
                        ? "Plano Atual" 
                        : `Escolher ${plan.name}`
                      }
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Garantia */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="text-blue-500" size={24} />
                <div>
                  <h3 className="font-semibold text-blue-800">Garantia de 7 dias</h3>
                  <p className="text-blue-700 text-sm">
                    Não ficou satisfeito? Devolvemos 100% do seu dinheiro
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Conteúdo Aba: Pagamento */}
        {activeTab === "billing" && (
          <>
            {/* Histórico de Pagamentos */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Histórico de Pagamentos</h3>
              
              {isPremium() ? (
                <div className="space-y-3">
                  {[
                    { date: "15/01/2024", amount: "R$ 9,90", status: "Pago", method: "Cartão ****1234" },
                    { date: "15/12/2023", amount: "R$ 9,90", status: "Pago", method: "Cartão ****1234" },
                    { date: "15/11/2023", amount: "R$ 9,90", status: "Pago", method: "Cartão ****1234" }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <div className="font-medium text-gray-800">{payment.amount}</div>
                        <div className="text-sm text-gray-600">{payment.date} • {payment.method}</div>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="text-gray-400 mx-auto mb-3" size={48} />
                  <p className="text-gray-500">Nenhum pagamento realizado ainda</p>
                  <p className="text-gray-400 text-sm">Faça upgrade para Premium para ver o histórico</p>
                </div>
              )}
            </div>

            {/* Método de Pagamento */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Método de Pagamento</h3>
              
              {isPremium() ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="text-blue-500" size={20} />
                        <span className="font-medium text-gray-800">Cartão de Crédito</span>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Principal</span>
                    </div>
                    <div className="text-sm text-gray-600">**** **** **** 1234</div>
                    <div className="text-xs text-gray-500">Expires 12/26</div>
                  </div>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors">
                    Adicionar Novo Cartão
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="text-gray-400 mx-auto mb-3" size={48} />
                  <p className="text-gray-500 mb-3">Nenhum método de pagamento configurado</p>
                  <button
                    onClick={() => setActiveTab("plans")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                  >
                    Configurar Pagamento
                  </button>
                </div>
              )}
            </div>

            {/* Próxima Cobrança */}
            {isPremium() && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Calendar className="text-green-600" size={20} />
                  Próxima Cobrança
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-green-800">
                      R$ {currentSubscription.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-green-600">
                      {new Date(currentSubscription.endDate).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-700">{daysUntilExpiry()}</div>
                    <div className="text-xs text-green-600">dias restantes</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Cancelar Assinatura?</h3>
                <p className="text-gray-600 text-sm">
                  Você perderá acesso a todos os recursos premium
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCancelSubscription}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Sim, Cancelar
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Manter Assinatura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
