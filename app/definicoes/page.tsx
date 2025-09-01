"use client"

import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { 
  Settings, 
  Heart, 
  Shield, 
  Target, 
  TrendingUp, 
  Gamepad2,
  Lightbulb,
  BarChart3,
  BookOpen,
  Zap,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
export default function DefinicoesPage() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-12">
      {/* Header melhorado */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-500/80 to-purple-600/80 p-6 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white">Menu Principal</h1>
              <p className="text-blue-100/80 text-sm">Acesso a todas as funcionalidades</p>
            </div>
            <div className="w-6"></div>
          </div>
          
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
            <Settings className="text-white" size={32} />
          </div>
        </div>
        
        {/* Decoração */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Ferramentas Principais */}
        <div className="bg-gradient-to-br from-gray-800/60 to-purple-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            Ferramentas Principais
          </h2>
          <div className="space-y-3">
            <Link
              href="/emergencia"
              className="group block p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                  <Shield className="text-red-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-red-200 transition-colors">SOS - Emergência</h3>
                  <p className="text-white/70 text-sm">Técnicas para momentos difíceis</p>
                </div>
              </div>
            </Link>

            <Link
              href="/bem-estar"
              className="group block p-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                  <Heart className="text-pink-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-pink-200 transition-colors">Bem-estar</h3>
                  <p className="text-white/70 text-sm">Diário de humor e exercícios</p>
                </div>
              </div>
            </Link>

            <Link
              href="/motivacao"
              className="group block p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <Lightbulb className="text-orange-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-orange-200 transition-colors">Motivação</h3>
                  <p className="text-white/70 text-sm">Reflexões e inspirações diárias</p>
                </div>
              </div>
            </Link>

            <Link
              href="/gamificacao"
              className="group block p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <Gamepad2 className="text-green-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-green-200 transition-colors">Gamificação</h3>
                  <p className="text-white/70 text-sm">Níveis, conquistas e recompensas</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Análise e Progresso */}
        <div className="bg-gradient-to-br from-indigo-800/60 to-blue-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="text-blue-400" size={20} />
            Análise e Progresso
          </h2>
          <div className="space-y-3">
            <Link
              href="/analytics"
              className="group block p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <TrendingUp className="text-blue-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-blue-200 transition-colors">Meu Plano de Recuperação</h3>
                  <p className="text-white/70 text-sm">Análise personalizada e estratégias</p>
                </div>
              </div>
            </Link>

            <Link
              href="/estatistica"
              className="group block p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <BarChart3 className="text-purple-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors">Estatísticas</h3>
                  <p className="text-white/70 text-sm">Gráficos e métricas de progresso</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recursos e Educação */}
        <div className="bg-gradient-to-br from-emerald-800/60 to-green-900/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-green-400" size={20} />
            Recursos e Educação
          </h2>
          <div className="space-y-3">
            <Link
              href="/recursos"
              className="group block p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <BookOpen className="text-green-400" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-green-200 transition-colors">Recursos</h3>
                  <p className="text-white/70 text-sm">Artigos e conteúdos educativos</p>
                </div>
              </div>
            </Link>


          </div>
        </div>


      </div>

      <BottomNavigation />
    </div>
  )
}
