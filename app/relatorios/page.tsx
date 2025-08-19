"use client"

import { useState, useEffect, useRef } from "react"
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
  Shield,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { LoadingState, SectionLoadingState } from "@/components/ui/LoadingState"
import { SkeletonCard, SkeletonStats } from "@/components/ui/SkeletonLoader"
import { SimpleChart, SimplePieChart } from "@/components/ui/SimpleChart"
import { useDataLoader } from "@/hooks/use-async-state"
// import html2canvas from "html2canvas"

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
  const [isLoading, setIsLoading] = useState(true)
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  
  const timeAbstinent = getTimeAbstinent()
  const reportDataLoader = useDataLoader()

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

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

  // Dados para gráficos melhorados
  const getMoodTrend = () => {
    const days = timeAbstinent.days
    const baseMood = 2.5
    return Array.from({ length: Math.min(days + 1, 30) }, (_, i) => ({
      label: `D${i + 1}`,
      value: Math.min(5, baseMood + (i * 0.1) + (Math.random() * 0.5 - 0.25)),
      color: "bg-purple-500"
    }))
  }

  const getWeeklyProgress = () => {
    const weeks = Math.ceil(timeAbstinent.days / 7)
    return Array.from({ length: Math.min(weeks, 12) }, (_, i) => ({
      label: `S${i + 1}`,
      value: Math.max(70, 95 - (Math.random() * 15)),
      color: "bg-blue-500"
    }))
  }

  const getActivityDistribution = () => [
    { label: "SOS Usados", value: Math.floor(timeAbstinent.days * 0.1), color: "bg-red-500" },
    { label: "Motivações", value: data.motivations?.length || 0, color: "bg-pink-500" },
    { label: "Check-ins", value: Math.floor(timeAbstinent.days * 0.8), color: "bg-green-500" },
    { label: "Conquistas", value: Math.floor(timeAbstinent.days / 7), color: "bg-yellow-500" }
  ]

  const shareReport = async () => {
    if (!reportRef.current) return
    
    try {
      setShareMessage("📸 Gerando relatório...")
      
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#f8fafc',
        scale: 2,
        useCORS: true,
        allowTaint: false
      })

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/png', 1.0)
      })

      if (!blob) throw new Error("Erro ao gerar imagem")

      const file = new File([blob], 'relatorio-purify.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Meu Relatório de Progresso - Purify',
          text: `🚀 Confira meu progresso de ${timeAbstinent.days} dias na jornada de purificação!

💰 R$ ${savings.money.toFixed(2)} economizados
⏰ ${Math.floor(savings.time / 60)}h recuperadas
🏆 ${healthBenefits.length} benefícios conquistados

#Purify #Progresso #Transformação`,
          files: [file]
        })
        setShareMessage("✅ Relatório compartilhado!")
      } else {
        // Fallback para download
        const link = document.createElement('a')
        link.download = 'relatorio-purify.png'
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
        setShareMessage("📱 Relatório salvo!")
      }
    } catch (error) {
      setShareMessage("⚠️ Erro ao gerar relatório")
    }
    
    setTimeout(() => setShareMessage(null), 3000)
  }

  if (!data.addictionType) return null
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 pb-20">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 rounded-b-3xl">
          <SkeletonStats />
        </div>
        <div className="p-6 space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

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
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <LineChart className="text-purple-600" size={24} />
            Análise de Tendências
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Humor Melhorado */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Heart className="text-purple-600" size={16} />
                Evolução do Bem-estar
              </h3>
              <SimpleChart 
                data={getMoodTrend()}
                type="line"
                height={120}
                maxValue={5}
                showValues={false}
              />
              <div className="text-center mt-2 text-sm text-purple-600 dark:text-purple-400">
                {getMoodTrend().length > 1 && (
                  <span className="flex items-center justify-center gap-1">
                    {getMoodTrend()[getMoodTrend().length - 1].value > getMoodTrend()[0].value ? (
                      <>
                        <ArrowUp size={14} />
                        Melhorando
                      </>
                    ) : (
                      <>
                        <Minus size={14} />
                        Estável
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
            
            {/* Progresso Semanal Melhorado */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={16} />
                Taxa de Sucesso Semanal
              </h3>
              <SimpleChart 
                data={getWeeklyProgress()}
                type="bar"
                height={120}
                maxValue={100}
                showValues={false}
              />
              <div className="text-center mt-2 text-sm text-blue-600 dark:text-blue-400">
                {getWeeklyProgress().length > 0 && (
                  <>
                    Média: {Math.round(getWeeklyProgress().reduce((sum, item) => sum + item.value, 0) / getWeeklyProgress().length)}%
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nova Seção: Distribuição de Atividades */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <PieChart className="text-indigo-600" size={24} />
            Distribuição de Atividades
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SimpleChart 
                data={getActivityDistribution()}
                type="progress"
                maxValue={Math.max(...getActivityDistribution().map(d => d.value)) || 10}
              />
            </div>
            
            <div className="flex justify-center">
              <SimplePieChart 
                data={getActivityDistribution()}
                size={160}
                showLabels={true}
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
            <p className="text-indigo-700 dark:text-indigo-300 text-sm">
              <strong>Análise:</strong> Você está usando bem as ferramentas disponíveis! 
              {data.motivations && data.motivations.length > 5 && " Suas motivações personais são um forte ponto de apoio."}
              {Math.floor(timeAbstinent.days * 0.1) > 2 && " O uso das ferramentas SOS mostra que você procura ajuda quando precisa."}
            </p>
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
        <div ref={reportRef} className="bg-gradient-to-r from-emerald-400 to-blue-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-white font-bold text-lg mb-4">📊 Compartilhe Seu Progresso</h3>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={shareReport}
              disabled={shareMessage !== null}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Download size={16} />
              Baixar Relatório
            </button>
            <button 
              onClick={shareReport}
              disabled={shareMessage !== null}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Share2 size={16} />
              Compartilhar
            </button>
          </div>
          {shareMessage && (
            <div className="mt-3 p-2 bg-white/20 rounded-lg">
              <p className="text-white text-sm font-medium">{shareMessage}</p>
            </div>
          )}
          <p className="text-white/80 text-sm mt-3">
            Inspire outros com sua jornada de transformação!
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}