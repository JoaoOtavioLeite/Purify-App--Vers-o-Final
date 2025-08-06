"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  Award,
  DollarSign,
  Heart,
  Brain,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Share2,
  Filter,
  Eye,
  Zap,
  Timer,
  Users,
  Flame,
  Shield
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

interface WeeklyData {
  week: string
  streakDays: number
  mood: number
  energy: number
  activitiesCompleted: number
}

interface MonthlyInsight {
  month: string
  totalDays: number
  successRate: number
  averageMood: number
  longestStreak: number
  challengesDays: number
}

export default function RelatoriosPage() {
  const { data, getTimeAbstinent } = useAddiction()
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month")
  const [showDetailedView, setShowDetailedView] = useState(false)

  const timeAbstinent = getTimeAbstinent()

  // Dados simulados para demonstração
  const weeklyData: WeeklyData[] = [
    { week: "Sem 1", streakDays: 7, mood: 3.2, energy: 3.8, activitiesCompleted: 15 },
    { week: "Sem 2", streakDays: 7, mood: 3.8, energy: 4.1, activitiesCompleted: 18 },
    { week: "Sem 3", streakDays: 6, mood: 3.1, energy: 3.5, activitiesCompleted: 12 },
    { week: "Sem 4", streakDays: 7, mood: 4.2, energy: 4.5, activitiesCompleted: 21 },
  ]

  const monthlyInsights: MonthlyInsight[] = [
    { month: "Janeiro", totalDays: 31, successRate: 87, averageMood: 3.6, longestStreak: 21, challengesDays: 4 },
    { month: "Fevereiro", totalDays: 28, successRate: 92, averageMood: 3.9, longestStreak: 28, challengesDays: 2 },
    { month: "Março", totalDays: 31, successRate: 84, averageMood: 3.4, longestStreak: 18, challengesDays: 5 },
  ]

  // Cálculos baseados no tempo atual
  const calculateHealthBenefits = () => {
    const days = timeAbstinent.days
    const hours = timeAbstinent.hours
    
    // Benefícios baseados em estudos científicos (adaptados para cada tipo de vício)
    let benefits = []
    
    if (data.addictionType?.id === "smoking") {
      if (days >= 1) benefits.push("Níveis de oxigênio normalizados")
      if (days >= 3) benefits.push("Paladar e olfato melhorados")
      if (days >= 7) benefits.push("Respiração mais fácil")
      if (days >= 30) benefits.push("Circulação sanguínea melhorada")
      if (days >= 90) benefits.push("Função pulmonar aumentada em 30%")
    } else if (data.addictionType?.id === "alcohol") {
      if (days >= 1) benefits.push("Sono mais reparador")
      if (days >= 7) benefits.push("Pele mais hidratada")
      if (days >= 30) benefits.push("Fígado em recuperação")
      if (days >= 90) benefits.push("Sistema imunológico fortalecido")
    } else {
      if (days >= 1) benefits.push("Clareza mental inicial")
      if (days >= 7) benefits.push("Humor mais estável")
      if (days >= 30) benefits.push("Autocontrole melhorado")
      if (days >= 90) benefits.push("Neuroplasticidade ativa")
    }
    
    return benefits
  }

  const calculateSavings = () => {
    const days = timeAbstinent.days
    const hours = timeAbstinent.hours
    
    // Economia baseada no tipo de vício e uso diário
    let dailyCost = 0
    let timePerDay = 0 // em minutos
    
    if (data.addictionType?.id === "smoking") {
      dailyCost = 25 // R$ por dia
      timePerDay = 60 // 1 hora por dia
    } else if (data.addictionType?.id === "alcohol") {
      dailyCost = 30
      timePerDay = 90
    } else if (data.addictionType?.id === "social_media") {
      dailyCost = 0
      timePerDay = 180 // 3 horas por dia
    } else {
      dailyCost = data.dailyUsage?.type === "money" ? data.dailyUsage.value : 0
      timePerDay = data.dailyUsage?.type === "time" ? data.dailyUsage.value : 60
    }
    
    const totalDays = days + (hours / 24)
    const moneySaved = totalDays * dailyCost
    const timeSaved = totalDays * timePerDay // em minutos
    
    return {
      money: moneySaved,
      time: timeSaved,
      dailyCost,
      dailyTime: timePerDay
    }
  }

  const savings = calculateSavings()
  const healthBenefits = calculateHealthBenefits()

  // Dados para gráficos (simulados)
  const moodTrend = [3.2, 3.5, 3.8, 3.6, 4.0, 4.2, 4.1, 4.3, 4.0, 4.4, 4.2, 4.5]
  const weeklyProgress = [85, 92, 78, 94, 88, 96, 90]

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <BarChart3 className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Relatórios</h1>
            <p className="text-emerald-100">Análise detalhada do seu progresso</p>
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2 bg-white/20 rounded-xl p-1">
          {[
            { key: "week", label: "Semana" },
            { key: "month", label: "Mês" },
            { key: "year", label: "Ano" }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                selectedPeriod === period.key
                  ? "bg-white text-emerald-600"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Resumo Principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" size={24} />
            Resumo do Progresso
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <Timer className="text-blue-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-blue-700">{timeAbstinent.days}</div>
              <div className="text-blue-600 text-sm">Dias Limpos</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <Award className="text-green-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-green-700">
                {Math.floor(timeAbstinent.days / 7)}
              </div>
              <div className="text-green-600 text-sm">Semanas</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <Flame className="text-purple-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-purple-700">
                {timeAbstinent.days > 0 ? Math.floor((timeAbstinent.days / 30) * 100) : 0}%
              </div>
              <div className="text-purple-600 text-sm">Taxa Sucesso</div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
              <Target className="text-orange-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-orange-700">
                {timeAbstinent.days >= 30 ? "🏆" : timeAbstinent.days >= 7 ? "🥇" : "🎯"}
              </div>
              <div className="text-orange-600 text-sm">Nível Atual</div>
            </div>
          </div>
        </div>

        {/* Economia Calculada */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" size={24} />
            Economia e Tempo Recuperado
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="text-green-600" size={24} />
                <h3 className="font-bold text-gray-800">Dinheiro Economizado</h3>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-2">
                R$ {savings.money.toFixed(2)}
              </div>
              <p className="text-green-600 text-sm mb-3">
                R$ {savings.dailyCost}/dia economizados
              </p>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-gray-700 text-sm">
                  <strong>Projeção anual:</strong> R$ {(savings.dailyCost * 365).toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-blue-600" size={24} />
                <h3 className="font-bold text-gray-800">Tempo Recuperado</h3>
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {Math.floor(savings.time / 60)}h {Math.floor(savings.time % 60)}m
              </div>
              <p className="text-blue-600 text-sm mb-3">
                {savings.dailyTime} min/dia recuperados
              </p>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-gray-700 text-sm">
                  <strong>Projeção anual:</strong> {Math.floor((savings.dailyTime * 365) / 60)} horas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefícios de Saúde */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-red-600" size={24} />
            Benefícios de Saúde Conquistados
          </h2>
          
          {healthBenefits.length > 0 ? (
            <div className="space-y-3">
              {healthBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="text-red-600" size={16} />
                  </div>
                  <span className="text-gray-800 font-medium">{benefit}</span>
                  <div className="ml-auto text-green-600 font-bold">✓</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="text-gray-400 mx-auto mb-3" size={48} />
              <p className="text-gray-500 mb-2">Continue sua jornada para desbloquear benefícios!</p>
              <p className="text-gray-400 text-sm">Os primeiros benefícios aparecem após 24 horas</p>
            </div>
          )}
        </div>

        {/* Análise de Tendências */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LineChart className="text-purple-600" size={24} />
            Análise de Tendências
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Humor Simulado */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">Humor ao Longo do Tempo</h3>
              <div className="h-32 flex items-end justify-between gap-1">
                {moodTrend.map((mood, index) => (
                  <div
                    key={index}
                    className="bg-purple-400 rounded-t flex-1"
                    style={{ height: `${(mood / 5) * 100}%` }}
                    title={`Dia ${index + 1}: ${mood}/5`}
                  />
                ))}
              </div>
              <div className="text-center mt-2 text-sm text-purple-600">
                Tendência: {moodTrend[moodTrend.length - 1] > moodTrend[0] ? "📈 Melhorando" : "📊 Estável"}
              </div>
            </div>
            
            {/* Progresso Semanal */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">Sucesso Semanal (%)</h3>
              <div className="h-32 flex items-end justify-between gap-1">
                {weeklyProgress.map((progress, index) => (
                  <div
                    key={index}
                    className="bg-blue-400 rounded-t flex-1"
                    style={{ height: `${progress}%` }}
                    title={`Semana ${index + 1}: ${progress}%`}
                  />
                ))}
              </div>
              <div className="text-center mt-2 text-sm text-blue-600">
                Média: {Math.round(weeklyProgress.reduce((a, b) => a + b) / weeklyProgress.length)}%
              </div>
            </div>
          </div>
        </div>

        {/* Insights e Recomendações */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Brain className="text-yellow-600" size={24} />
            Insights e Recomendações
          </h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">🎯 Padrões Identificados</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Seu melhor período são as manhãs (87% de sucesso)</li>
                <li>• Fins de semana são mais desafiadores</li>
                <li>• Exercícios físicos aumentam suas chances de sucesso em 23%</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">💡 Recomendações Personalizadas</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Planeje atividades especiais para fins de semana</li>
                <li>• Mantenha sua rotina matinal forte</li>
                <li>• Continue investindo em exercícios físicos</li>
                <li>• Considere adicionar meditação noturna</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">🚀 Próximos Marcos</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• {timeAbstinent.days < 7 ? "Próximo: Primeira semana completa" : ""}</li>
                <li>• {timeAbstinent.days < 30 ? "Meta: Primeiro mês limpo" : ""}</li>
                <li>• {timeAbstinent.days < 90 ? "Objetivo: 90 dias de transformação" : ""}</li>
                <li>• {timeAbstinent.days >= 90 ? "🎉 Você já é um exemplo de superação!" : ""}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-white font-bold text-lg mb-4">📊 Compartilhe Seu Progresso</h3>
          <div className="flex gap-3 justify-center">
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              <Download size={16} />
              Baixar Relatório
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2">
              <Share2 size={16} />
              Compartilhar
            </button>
          </div>
          <p className="text-white/80 text-sm mt-3">
            Inspire outros com sua jornada de transformação!
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}