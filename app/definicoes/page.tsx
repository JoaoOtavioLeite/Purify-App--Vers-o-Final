"use client"

import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { Settings, Heart, Shield, Target } from "lucide-react"
import Link from "next/link"

export default function DefinicoesPage() {
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
            <p className="text-blue-100">Acesso a todas as funcionalidades</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Ferramentas Principais */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ferramentas Principais</h2>
          <div className="space-y-3">
            <Link
              href="/emergencia"
              className="block p-4 rounded-xl border-2 bg-red-50 border-red-200 hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <Shield className="text-red-500" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800">SOS - Emergência</h3>
                  <p className="text-gray-600 text-sm">Técnicas para momentos difíceis</p>
                </div>
              </div>
            </Link>

            <Link
              href="/bem-estar"
              className="block p-4 rounded-xl border-2 bg-pink-50 border-pink-200 hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <Heart className="text-pink-500" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800">Bem-estar</h3>
                  <p className="text-gray-600 text-sm">Diário de humor e exercícios</p>
                </div>
              </div>
            </Link>

            <Link
              href="/objetivos"
              className="block p-4 rounded-xl border-2 bg-blue-50 border-blue-200 hover:scale-105 transition-all"
            >
              <div className="flex items-center gap-3">
                <Target className="text-blue-500" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800">Objetivos</h3>
                  <p className="text-gray-600 text-sm">Configure suas metas</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Em Desenvolvimento */}
        <div className="bg-gradient-to-r from-blue-400 to-sky-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-white font-bold text-lg mb-2">🚧 Funcionalidades Avançadas</h3>
          <p className="text-white/90 text-sm mb-4">
            Estamos implementando todas as funcionalidades avançadas que você viu.
          </p>
          <p className="text-white/80 text-xs">
            ✅ Modo escuro, notificações, relatórios e muito mais já estão funcionando no modo desenvolvimento!
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
