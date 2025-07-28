"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronRight, Bell, Info } from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { getMilestones } from "@/contexts/AddictionContext"

export default function DefinicoesPage() {
  const { data } = useAddiction()

  if (!data.addictionType) return null

  const settings = [
    {
      title: "Notificações",
      description: "Lembretes e motivação diária",
      icon: Bell,
      action: () => {
        alert("Funcionalidade em desenvolvimento")
      },
    },
    {
      title: "Sobre o App",
      description: "Informações e versão do aplicativo",
      icon: Info,
      action: () => {
        alert("Purify App v1.0.0\nDesenvolvido para ajudar na purificação de vícios\n\n© 2024 Purify Team")
      },
    },
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-20">
      <div className="flex items-center gap-4 py-4">
        {/* Removido botão de voltar */}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">{data.addictionType.icon}</div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Configurações</h1>
            <p className="text-gray-600">Personalize sua experiência</p>
          </div>
        </div>
      </div>

      {/* Current Addiction Info */}
      <div className="bg-white/80 rounded-xl p-6 mb-6 border border-gray-200 shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Configuração Atual</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tipo de vício:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{data.addictionType.icon}</span>
              <span className="font-medium text-gray-800">{data.addictionType.name}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-gray-600">Conquistas:</span>
            <div className="flex gap-2 flex-wrap mt-1">
              {getMilestones(data.streakStart).conquered.length === 0 ? (
                <span className="text-gray-400 text-xs">Nenhuma conquista ainda</span>
              ) : (
                getMilestones(data.streakStart).conquered.map((m) => (
                  <span key={m.label} className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                    <span>{m.emoji}</span> {m.label}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Configurações Gerais</h3>
        <div className="space-y-2">
          {settings.map((setting, index) => (
            <button
              key={index}
              onClick={setting.action}
              className="w-full bg-white/80 rounded-xl p-4 flex items-center justify-between hover:bg-white transition-colors border border-gray-200 shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <setting.icon className="text-blue-500" size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800">{setting.title}</h4>
                  <p className="text-gray-600 text-sm">{setting.description}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          ))}
        </div>
      </div>



      {/* App Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Purify App</h4>
          <p className="text-gray-600 text-sm mb-1">Versão 1.0.0</p>
          <p className="text-gray-500 text-xs">Desenvolvido por João Otávio Silveira Leite, para ajudar você na sua Jornada de Purificação <span className='text-red-500'>❤️</span></p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
