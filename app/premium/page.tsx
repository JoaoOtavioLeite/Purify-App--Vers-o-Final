"use client"

import { useState } from "react"
import { PremiumCard } from "@/components/PremiumCard"
import { PremiumAnalytics } from "@/components/PremiumAnalytics"
import { AccountabilityPartner } from "@/components/AccountabilityPartner"
import { PremiumThemes } from "@/components/PremiumThemes"
import { SubscriptionManager } from "@/components/SubscriptionManager"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { 
  Crown, 
  TrendingUp, 
  Users, 
  Palette, 
  CreditCard,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function PremiumPage() {
  const [activeSection, setActiveSection] = useState<"overview" | "analytics" | "partners" | "themes" | "subscription">("overview")
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Simulação de usuário premium (em produção viria do contexto)
  const isPremiumUser = false

  const premiumSections = [
    {
      id: "overview",
      title: "Visão Geral",
      icon: <Crown className="text-yellow-500" size={20} />,
      description: "Conheça todos os recursos premium"
    },
    {
      id: "analytics", 
      title: "Análise",
      icon: <TrendingUp className="text-blue-500" size={20} />,
      description: "Análises avançadas do seu progresso",
      premium: true
    },
    {
      id: "partners",
      title: "Parceiros",
      icon: <Users className="text-green-500" size={20} />,
      description: "Sistema de responsabilidade mútua",
      premium: true
    },
    {
      id: "themes",
      title: "Temas",
      icon: <Palette className="text-purple-500" size={20} />,
      description: "Personalize sua experiência visual",
      premium: true
    },
    {
      id: "subscription",
      title: "Assinatura",
      icon: <CreditCard className="text-orange-500" size={20} />,
      description: "Gerencie sua assinatura premium"
    }
  ]

  const handleSectionChange = (sectionId: string) => {
    const section = premiumSections.find(s => s.id === sectionId)
    
    if (section?.premium && !isPremiumUser) {
      setShowUpgradeModal(true)
      return
    }
    
    setActiveSection(sectionId as any)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "analytics":
        return isPremiumUser ? <PremiumAnalytics /> : <div>Acesso negado</div>
      case "partners":
        return isPremiumUser ? <AccountabilityPartner /> : <div>Acesso negado</div>
      case "themes":
        return <PremiumThemes onUpgrade={() => setShowUpgradeModal(true)} />
      case "subscription":
        return <SubscriptionManager />
      default:
        return <PremiumOverview onUpgrade={() => setShowUpgradeModal(true)} />
    }
  }

  if (activeSection !== "overview") {
    return (
      <div className="min-h-screen">
        {renderActiveSection()}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link 
              href="/"
              className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <ArrowLeft className="text-white" size={20} />
            </Link>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">Purify Premium</h1>
              <p className="text-white/80 text-sm">Desbloqueie todo o potencial da sua jornada</p>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">8+</div>
                <div className="text-white/80 text-xs">Recursos Premium</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">67%</div>
                <div className="text-white/80 text-xs">Maior Sucesso</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">R$ 9,90</div>
                <div className="text-white/80 text-xs">Por mês</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Menu de Seções Premium */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Explore os Recursos Premium</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {premiumSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                  section.premium && !isPremiumUser
                    ? "border-gray-200 bg-gray-50 opacity-75"
                    : "border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50"
                }`}
              >
                {section.premium && !isPremiumUser && (
                  <div className="absolute top-2 right-2">
                    <Crown className="text-yellow-500" size={16} />
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{section.title}</div>
                    <div className="text-sm text-gray-600">{section.description}</div>
                  </div>
                  <div className="text-blue-600">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Card de Upgrade */}
        {!isPremiumUser && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Crown className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Comece Sua Jornada Premium</h3>
                <p className="text-white/90 text-sm">7 dias grátis • Cancele a qualquer momento</p>
              </div>
            </div>
            
            <div className="bg-white/15 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">R$ 9,90</div>
                  <div className="text-white/80 text-xs">Por mês</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">R$ 79,90</div>
                  <div className="text-white/80 text-xs">Por ano (-33%)</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-4 rounded-xl transition-colors"
            >
              Começar Teste Grátis
            </button>
          </div>
        )}
      </div>

      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <PremiumCard 
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            setShowUpgradeModal(false)
            setActiveSection("subscription")
          }}
        />
      )}

      <BottomNavigation />
    </div>
  )
}

// Componente de Overview Premium
function PremiumOverview({ onUpgrade }: { onUpgrade: () => void }) {
  const premiumFeatures = [
    {
      title: "📊 Análise Avançada",
      description: "Gráficos detalhados, padrões de recaída e insights personalizados para acelerar seu progresso.",
      preview: "Identifique seus horários de risco e otimize sua rotina"
    },
    {
      title: "👥 Parceiros de Responsabilidade", 
      description: "Conecte-se com outros usuários para apoio mútuo e accountability diário.",
      preview: "67% maior taxa de sucesso com parceiros"
    },
    {
      title: "🎨 Temas Premium",
      description: "12 temas exclusivos e customização avançada de cores para personalizar sua experiência.",
      preview: "Noite Profunda, Pôr do Sol, Neon Cyber e muito mais"
    },
    {
      title: "📄 Relatórios Profissionais",
      description: "PDFs detalhados para compartilhar progresso com terapeutas e família.",
      preview: "Relatórios semanais, mensais e anuais"
    },
    {
      title: "🛡️ Bloqueador Inteligente",
      description: "IA que aprende seus padrões e bloqueia automaticamente sites de risco.",
      preview: "Proteção preventiva baseada em machine learning"
    },
    {
      title: "☁️ Sincronização na Nuvem",
      description: "Dados seguros e sincronizados entre todos seus dispositivos automaticamente.",
      preview: "Nunca perca seu progresso novamente"
    }
  ]

  return (
    <div className="space-y-4">
      {premiumFeatures.map((feature, index) => (
        <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="text-blue-800 text-sm font-medium">💡 {feature.preview}</div>
          </div>
          
          <button
            onClick={onUpgrade}
            className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm"
          >
            Desbloquear Agora
          </button>
        </div>
      ))}
    </div>
  )
}

