"use client"

import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { BookOpen, ExternalLink } from "lucide-react"

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <BookOpen className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Centro de Recursos</h1>
            <p className="text-indigo-100">Artigos e ferramentas para sua jornada</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Recursos Populares */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recursos Populares</h2>
          
          <div className="grid gap-4">
            {/* Artigo 1 */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="text-indigo-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Como Superar Vícios: Um Guia Científico
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Entenda a neurociência por trás dos vícios e estratégias comprovadas para superação.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📖 Artigo</span>
                    <span>⏱️ 8 min</span>
                    <span>⭐ 4.8</span>
                  </div>
                </div>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
            </div>

            {/* Artigo 2 */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="text-green-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Técnicas de Mindfulness para Controle de Impulsos
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Aprenda exercícios práticos de atenção plena para momentos difíceis.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>🎥 Vídeo</span>
                    <span>⏱️ 12 min</span>
                    <span>⭐ 4.9</span>
                  </div>
                </div>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
            </div>

            {/* Artigo 3 */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="text-purple-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Histórias de Superação: Casos Reais
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Conheça pessoas que venceram seus vícios e como conseguiram.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📚 E-book</span>
                    <span>⏱️ 45 min</span>
                    <span>⭐ 4.7</span>
                  </div>
                </div>
                <ExternalLink className="text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Em breve */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-white font-bold text-lg mb-2">🚧 Em Desenvolvimento</h3>
          <p className="text-white/90 text-sm mb-4">
            Estamos trabalhando para trazer mais recursos educacionais para você.
          </p>
          <p className="text-white/80 text-xs">
            Em breve: biblioteca completa de artigos, vídeos, podcasts e ferramentas especializadas.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

