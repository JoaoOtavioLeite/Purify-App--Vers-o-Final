"use client"

import { MoodHistory } from "@/components/MoodHistory"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { TrendingUp, Heart, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HistoricoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Link 
            href="/bem-estar"
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="text-white" size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Histórico de Bem-estar</h1>
              <p className="text-purple-100">Sua jornada emocional em gráficos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-purple-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="text-purple-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Bem-estar Geral</h3>
            <p className="text-sm text-gray-600">Acompanhe sua evolução emocional diária</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-pink-100 text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="text-pink-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Check-ins Diários</h3>
            <p className="text-sm text-gray-600">Histórico completo dos seus check-ins</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-indigo-100 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="text-indigo-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Insights & Padrões</h3>
            <p className="text-sm text-gray-600">Descubra tendências no seu humor</p>
          </div>
        </div>

        {/* Componente Principal */}
        <MoodHistory />

        {/* Dicas para Melhorar o Bem-estar */}
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            💡 Dicas para Melhorar seu Bem-estar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-4">
              <h4 className="font-semibold mb-2">🧘‍♀️ Mindfulness Diário</h4>
              <p className="text-white/90 text-sm">Dedique 5-10 minutos por dia para respiração consciente e reflexão.</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <h4 className="font-semibold mb-2">🏃‍♂️ Atividade Física</h4>
              <p className="text-white/90 text-sm">Movimento regular libera endorfinas e melhora o humor naturalmente.</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <h4 className="font-semibold mb-2">😴 Sono de Qualidade</h4>
              <p className="text-white/90 text-sm">7-9 horas de sono reparador são essenciais para o bem-estar mental.</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <h4 className="font-semibold mb-2">🤝 Conexões Sociais</h4>
              <p className="text-white/90 text-sm">Mantenha relacionamentos saudáveis e peça apoio quando necessário.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <h3 className="font-bold text-gray-800 mb-2">📊 Continue Acompanhando</h3>
          <p className="text-gray-600 mb-4">
            Faça check-ins regulares para ter dados mais precisos sobre sua evolução.
          </p>
          <Link 
            href="/bem-estar"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md"
          >
            <Heart size={18} />
            Fazer Check-in Agora
          </Link>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

