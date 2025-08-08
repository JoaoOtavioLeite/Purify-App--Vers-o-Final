"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { 
  ChevronRight, 
  Bell, 
  Info, 
  Heart,
  Trophy,
  BookOpen,
  BarChart3,
  Lightbulb,
  Shield,
  Brain,
  Target,
  Users,
  Settings,
  Download,
  Share2,
  Star,
  Calendar,
  Gift,
  Activity,
  CheckCircle2,
  Palette,
  Languages,
  HelpCircle
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { getMilestones } from "@/contexts/AddictionContext"
import PushNotifications from "@/components/PushNotifications"
import Link from "next/link"

export default function DefinicoesPage() {
  const { data, getTimeAbstinent } = useAddiction()
  const timeAbstinent = getTimeAbstinent()

  if (!data.addictionType) return null

  const menuSections = [
    {
      title: "Ferramentas de Apoio",
      items: [
        {
          title: "Motivação",
          description: "Frases inspiradoras e motivação pessoal",
          icon: Lightbulb,
          href: "/motivacao",
          color: "text-yellow-500",
          bg: "bg-yellow-50 border-yellow-200"
        },
        {
          title: "SOS - Emergência",
          description: "Técnicas para momentos difíceis",
          icon: Shield,
          href: "/emergencia",
          color: "text-red-500",
          bg: "bg-red-50 border-red-200"
        },
        {
          title: "Bem-estar",
          description: "Diário de humor e exercícios",
          icon: Heart,
          href: "/bem-estar",
          color: "text-pink-500",
          bg: "bg-pink-50 border-pink-200"
        }
      ]
    },
    {
      title: "Planejamento e Metas",
      items: [
        {
          title: "Objetivos",
          description: "Configure suas metas de purificação",
          icon: Target,
          href: "/objetivos",
          color: "text-blue-500",
          bg: "bg-blue-50 border-blue-200"
        },
        {
          title: "Incentivos",
          description: "Recompensas por atingir objetivos",
          icon: Gift,
          href: "/incentivos",
          color: "text-green-500",
          bg: "bg-green-50 border-green-200"
        }
      ]
    },
    {
      title: "Progresso e Análises",
      items: [
        {
          title: "Gamificação",
          description: "Níveis, conquistas e pontuação",
          icon: Trophy,
          href: "/gamificacao",
          color: "text-purple-500",
          bg: "bg-purple-50 border-purple-200"
        },
        {
          title: "Estatísticas",
          description: "Seu progresso e marcos",
          icon: BarChart3,
          href: "/estatistica",
          color: "text-cyan-500",
          bg: "bg-cyan-50 border-cyan-200"
        },
        {
          title: "Relatórios",
          description: "Análises detalhadas e insights",
          icon: Activity,
          href: "/relatorios",
          color: "text-orange-500",
          bg: "bg-orange-50 border-orange-200"
        }
      ]
    },
    {
      title: "Conhecimento e Recursos",
      items: [
        {
          title: "Centro de Recursos",
          description: "Artigos, vídeos e ferramentas",
          icon: BookOpen,
          href: "/recursos",
          color: "text-indigo-500",
          bg: "bg-indigo-50 border-indigo-200"
        }
      ]
    }
  ]



  const appSettings = [
    {
      title: "Editar Data de Recaída",
      description: "Ajustar quando sua jornada começou",
      icon: Calendar,
      href: "/definicoes/editar-data",
    },
    {
      title: "Notificações",
      description: "Lembretes e motivação diária",
      icon: Bell,
      action: () => {
        alert("🔔 Configurações de Notificações\n\n• Lembrete matinal\n• Motivação diária\n• Marcos atingidos\n• Check-in noturno\n\nFuncionalidade será implementada em breve!")
      },
    },
    {
      title: "Personalização",
      description: "Temas e aparência do app",
      icon: Palette,
      action: () => {
        alert("🎨 Personalização\n\n• Modo escuro/claro\n• Cores do tema\n• Tamanho da fonte\n• Layout personalizado\n\nFuncionalidade será implementada em breve!")
      },
    },
    {
      title: "Backup e Sincronização",
      description: "Sincronize seus dados na nuvem",
      icon: Download,
      action: () => {
        alert("☁️ Backup e Sincronização\n\n• Backup automático\n• Sincronização entre dispositivos\n• Exportar dados\n• Restaurar backup\n\nFuncionalidade será implementada em breve!")
      },
    },
    {
      title: "Central de Ajuda",
      description: "Tutoriais e perguntas frequentes",
      icon: HelpCircle,
      action: () => {
        alert("❓ Central de Ajuda\n\n• Como usar o app\n• Perguntas frequentes\n• Dicas de purificação\n• Contato com suporte\n\nFuncionalidade será implementada em breve!")
      },
    },
    {
      title: "Sobre o App",
      description: "Purify v2.0 - App de Purificação",
      icon: Info,
      action: () => {
        alert("Purify App v2.0.0\nApp completo de purificação de vícios\n\n✨ Novas funcionalidades:\n• Sistema de emergência\n• Gamificação\n• Bem-estar mental\n• Centro de recursos\n• Análises avançadas\n• Planejamento de metas\n• Sistema de incentivos\n\n© 2024 Purify Team")
      },
    },
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-sky-600 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Settings className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Menu Principal</h1>
            <p className="text-blue-100">Todas as funcionalidades do app</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-white">{timeAbstinent.days}</div>
              <div className="text-blue-100 text-sm">dias limpos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{data.addictionType.icon}</div>
              <div className="text-blue-100 text-sm">{data.addictionType.name}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className={`block p-4 rounded-xl border-2 transition-all hover:scale-105 ${item.bg}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center">
                        <item.icon className={item.color} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Notificações PWA */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="text-blue-500" size={20} />
            Notificações & PWA
          </h2>
          <PushNotifications />
        </div>

        {/* App Settings */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Configurações</h2>
          <div className="space-y-3">
            {appSettings.map((setting, index) => {
              const content = (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <setting.icon className="text-gray-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{setting.title}</h3>
                      <p className="text-gray-600 text-sm">{setting.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              )

              if (setting.href) {
                return (
                  <Link key={index} href={setting.href}>
                    {content}
                  </Link>
                )
              }

              return (
                <div key={index} onClick={setting.action}>
                  {content}
                </div>
              )
            })}
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-r from-blue-400 to-sky-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-white font-bold text-lg mb-2">🎉 Você está indo muito bem!</h3>
          <p className="text-white/90 mb-4">
            Seu progresso de {timeAbstinent.days} dias é inspirador. Continue explorando todas as ferramentas disponíveis para fortalecer sua jornada!
          </p>
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-white text-sm">
              <strong>Dica:</strong> Use diferentes ferramentas conforme sua necessidade. Cada uma foi criada para apoiar você de forma única.
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
