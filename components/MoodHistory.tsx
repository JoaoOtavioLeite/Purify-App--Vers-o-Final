"use client"

import { useState, useEffect } from "react"
import { 
  TrendingUp, 
  Calendar, 
  Heart, 
  Brain, 
  Activity, 
  Users, 
  Sparkles,
  Eye,
  EyeOff,
  Filter,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react"
import { SimpleChart } from "./ui/SimpleChart"

interface DailyMoodEntry {
  date: string
  mood: "excellent" | "good" | "fair" | "poor"
  overallScore: number
  categories: {
    physical: number
    mental: number
    spiritual: number
    social: number
  }
  achievements: string[]
}

interface MoodHistoryProps {
  className?: string
}

export function MoodHistory({ className = "" }: MoodHistoryProps) {
  const [moodHistory, setMoodHistory] = useState<DailyMoodEntry[]>([])
  const [showChart, setShowChart] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("week")
  const [selectedCategory, setSelectedCategory] = useState<"all" | "physical" | "mental" | "spiritual" | "social">("all")

  // Carregar histórico de humor
  useEffect(() => {
    const loadMoodHistory = () => {
      const saved = localStorage.getItem('moodHistory')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMoodHistory(parsed)
        } catch (error) {
          console.error('Error loading mood history:', error)
        }
      }
    }
    loadMoodHistory()
  }, [])

  // Função para adicionar uma nova entrada (chamada pela página de bem-estar)
  const addMoodEntry = (entry: DailyMoodEntry) => {
    setMoodHistory(prev => {
      const newHistory = [...prev.filter(h => h.date !== entry.date), entry]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 90) // Manter apenas 90 dias
      
      localStorage.setItem('moodHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }

  // Filtrar dados baseado no período selecionado
  const getFilteredData = () => {
    const now = new Date()
    let filteredData = moodHistory

    if (selectedPeriod === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredData = moodHistory.filter(entry => new Date(entry.date) >= weekAgo)
    } else if (selectedPeriod === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredData = moodHistory.filter(entry => new Date(entry.date) >= monthAgo)
    }

    return filteredData.reverse() // Ordem cronológica para o gráfico
  }

  // Preparar dados para gráficos
  const prepareChartData = () => {
    const filteredData = getFilteredData()
    
    if (selectedCategory === "all") {
      return filteredData.map(entry => ({
        label: new Date(entry.date).getDate().toString(),
        value: entry.overallScore,
        color: entry.overallScore >= 4 ? "bg-green-500" : 
               entry.overallScore >= 3 ? "bg-blue-500" :
               entry.overallScore >= 2 ? "bg-yellow-500" : "bg-red-500"
      }))
    } else {
      return filteredData.map(entry => ({
        label: new Date(entry.date).getDate().toString(),
        value: entry.categories[selectedCategory as keyof typeof entry.categories],
        color: "bg-purple-500"
      }))
    }
  }

  // Calcular estatísticas
  const getStatistics = () => {
    const filteredData = getFilteredData()
    if (filteredData.length === 0) return null

    const scores = filteredData.map(entry => 
      selectedCategory === "all" 
        ? entry.overallScore 
        : entry.categories[selectedCategory as keyof typeof entry.categories]
    )

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const trend = scores.length > 1 ? 
      (scores[scores.length - 1] - scores[0]) / scores.length : 0

    const moodDistribution = filteredData.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      average,
      trend,
      total: filteredData.length,
      best: Math.max(...scores),
      worst: Math.min(...scores),
      distribution: moodDistribution
    }
  }

  const statistics = getStatistics()
  const chartData = prepareChartData()

  const categoryNames = {
    all: "Geral",
    physical: "Físico",
    mental: "Mental",
    spiritual: "Espiritual",
    social: "Social"
  }

  const moodEmojis = {
    excellent: "🌟",
    good: "😊",
    fair: "😐",
    poor: "💪"
  }

  const moodColors = {
    excellent: "bg-green-100 text-green-800 border-green-300",
    good: "bg-blue-100 text-blue-800 border-blue-300",
    fair: "bg-yellow-100 text-yellow-800 border-yellow-300",
    poor: "bg-red-100 text-red-800 border-red-300"
  }

  if (moodHistory.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="text-center py-8">
          <Heart className="text-gray-400 mx-auto mb-3" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Sem Histórico Ainda
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Complete seu primeiro check-in de bem-estar para começar a acompanhar sua evolução.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Histórico de Bem-estar</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Evolução do seu humor e energia</p>
          </div>
        </div>
        <button
          onClick={() => setShowChart(!showChart)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {showChart ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Período */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {[
            { key: "week", label: "Semana" },
            { key: "month", label: "Mês" },
            { key: "all", label: "Tudo" }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedPeriod === period.key
                  ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Categoria */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {Object.entries(categoryNames).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as any)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedCategory === key
                  ? "bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {statistics.average.toFixed(1)}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">Média</div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {Math.abs(statistics.trend).toFixed(2)}
              </span>
              {statistics.trend > 0.1 ? (
                <ArrowUp className="text-green-500" size={14} />
              ) : statistics.trend < -0.1 ? (
                <ArrowDown className="text-red-500" size={14} />
              ) : (
                <Minus className="text-gray-500" size={14} />
              )}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">Tendência</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-green-700 dark:text-green-300">
              {statistics.best.toFixed(1)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">Melhor</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
              {statistics.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Dias</div>
          </div>
        </div>
      )}

      {/* Gráfico */}
      {showChart && chartData.length > 0 && (
        <div className="mb-6">
          <SimpleChart
            data={chartData}
            type="line"
            height={120}
            maxValue={5}
            showValues={false}
          />
        </div>
      )}

      {/* Lista de Entradas Recentes */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Calendar size={16} />
          Entradas Recentes
        </h4>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {getFilteredData().reverse().slice(0, 7).map((entry) => (
            <div key={entry.date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-lg">{moodEmojis[entry.mood]}</div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                    {new Date(entry.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Score: {entry.overallScore.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${moodColors[entry.mood]}`}>
                  {entry.mood === "excellent" && "Excelente"}
                  {entry.mood === "good" && "Bom"}
                  {entry.mood === "fair" && "Regular"}
                  {entry.mood === "poor" && "Difícil"}
                </span>
                
                {entry.achievements.length > 0 && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" title={`${entry.achievements.length} conquistas`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {statistics && statistics.total >= 7 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
            <Sparkles size={16} />
            Insights
          </h4>
          <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
            {statistics.trend > 0.1 && (
              <p>📈 Seu bem-estar está melhorando consistentemente!</p>
            )}
            {statistics.average >= 4 && (
              <p>🌟 Você tem mantido um excelente nível de bem-estar!</p>
            )}
            {statistics.distribution.excellent >= statistics.total * 0.5 && (
              <p>🏆 Mais da metade dos seus dias foram excelentes!</p>
            )}
            {statistics.trend < -0.1 && (
              <p>💙 Considere revisar suas rotinas e procurar apoio se necessário.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Hook para usar o histórico de humor
export function useMoodHistory() {
  const [moodHistory, setMoodHistory] = useState<DailyMoodEntry[]>([])

  const addEntry = (entry: DailyMoodEntry) => {
    setMoodHistory(prev => {
      const newHistory = [...prev.filter(h => h.date !== entry.date), entry]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 90)
      
      localStorage.setItem('moodHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }

  const getEntry = (date: string) => {
    return moodHistory.find(entry => entry.date === date)
  }

  const getRecentEntries = (days: number = 7) => {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    return moodHistory.filter(entry => new Date(entry.date) >= cutoff)
  }

  return {
    moodHistory,
    addEntry,
    getEntry,
    getRecentEntries
  }
}

