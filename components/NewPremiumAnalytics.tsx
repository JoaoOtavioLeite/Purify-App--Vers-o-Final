"use client"

import { useState, useMemo } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { usePremium } from "@/contexts/PremiumContext"
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Target,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Users,
  Shield,
  Timer,
  Heart,
  Cross,
  Church,
  Zap,
  Calendar,
  User,
  MapPin,
  Smartphone,
  Brain,
  Home,
  MessageCircle,
  Play,
  Award,
  Star
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

export function NewPremiumAnalytics() {
  const { data, getTimeAbstinent } = useAddiction()
  const { user, hasCompletedAssessment } = usePremium()
  const [activeTab, setActiveTab] = useState<"analise" | "plano" | "espiritual" | "progresso">("analise")
  const timeAbstinent = getTimeAbstinent()

  // Analisar respostas do questionário detalhado
  const detailedAnalysis = useMemo(() => {
    if (!user.assessmentAnswers || Object.keys(user.assessmentAnswers).length === 0) {
      return null
    }

    const answers = user.assessmentAnswers
    const analysis = {
      timePatterns: [] as string[],
      emotionalTriggers: [] as string[],
      locations: [] as string[],
      deviceUsage: "",
      spiritualImpact: "",
      socialImpact: "",
      riskLevel: user.assessmentLevel || "moderate",
      urgentAreas: [] as string[],
      personalizedStrategies: [] as string[],
      spiritualPlan: generateSpiritualPlan(answers),
      progressMetrics: calculateProgressMetrics(answers, timeAbstinent)
    }

    // Analisar padrões de tempo
    if (answers["daily-triggers"]) {
      const timeAnswer = answers["daily-triggers"].selectedOption
      analysis.timePatterns.push(timeAnswer.text)
      
      if (timeAnswer.id === "late-night") {
        analysis.urgentAreas.push("Controle noturno crítico")
        analysis.personalizedStrategies.push("📱 Implemente toque de recolher digital às 22h")
        analysis.personalizedStrategies.push("🛏️ Deixe dispositivos carregando fora do quarto")
        analysis.personalizedStrategies.push("📖 Leia a Bíblia antes de dormir ao invés de usar dispositivos")
      }
      
      if (timeAnswer.id === "morning") {
        analysis.urgentAreas.push("Vulnerabilidade matinal")
        analysis.personalizedStrategies.push("⏰ Crie rotina matinal com oração aos primeiros 10 minutos")
        analysis.personalizedStrategies.push("🏃 Faça exercício físico logo ao acordar")
      }
    }

    // Analisar gatilhos emocionais
    if (answers["emotional-triggers"]) {
      const emotionAnswer = answers["emotional-triggers"].selectedOption
      analysis.emotionalTriggers.push(emotionAnswer.text)
      
      if (emotionAnswer.id === "loneliness") {
        analysis.urgentAreas.push("Solidão como gatilho principal")
        analysis.personalizedStrategies.push("👥 Entre em um grupo de discipulado")
        analysis.personalizedStrategies.push("📞 Tenha lista de 3 pessoas para ligar quando se sentir sozinho")
        analysis.personalizedStrategies.push("⛪ Frequente eventos sociais da igreja")
      }
      
      if (emotionAnswer.id === "stress") {
        analysis.urgentAreas.push("Estresse como gatilho crítico")
        analysis.personalizedStrategies.push("🙏 Ore imediatamente quando sentir estresse")
        analysis.personalizedStrategies.push("📖 Medite em Filipenses 4:6-7 durante crise")
        analysis.personalizedStrategies.push("🧘 Pratique respiração consciente com oração")
      }
    }

    // Analisar locais de uso
    if (answers["location-usage"]) {
      const locationAnswer = answers["location-usage"].selectedOption
      analysis.locations.push(locationAnswer.text)
      
      if (locationAnswer.id === "bedroom") {
        analysis.urgentAreas.push("Quarto comprometido")
        analysis.personalizedStrategies.push("🚫 REMOVA todos os dispositivos do quarto")
        analysis.personalizedStrategies.push("✝️ Coloque uma Bíblia ao lado da cama")
        analysis.personalizedStrategies.push("🎵 Use música gospel para adormecer")
      }
      
      if (locationAnswer.id === "bathroom") {
        analysis.urgentAreas.push("Banheiro como local de risco")
        analysis.personalizedStrategies.push("📵 Deixe o celular fora do banheiro SEMPRE")
        analysis.personalizedStrategies.push("⏱️ Limite tempo no banheiro a 5 minutos")
      }
    }

    // Analisar impacto espiritual
    if (answers["spiritual-impact"]) {
      const spiritualAnswer = answers["spiritual-impact"].selectedOption
      analysis.spiritualImpact = spiritualAnswer.text
      
      if (spiritualAnswer.score >= 20) {
        analysis.urgentAreas.push("Comunhão com Deus severamente afetada")
        analysis.personalizedStrategies.push("🙏 Comece com apenas 2 minutos de oração por dia")
        analysis.personalizedStrategies.push("✝️ Busque aconselhamento pastoral imediato")
        analysis.personalizedStrategies.push("💔 Trabalhe o perdão próprio - Deus já te perdoou")
      }
    }

    // Analisar vida de oração
    if (answers["prayer-habits"]) {
      const prayerAnswer = answers["prayer-habits"].selectedOption
      
      if (prayerAnswer.score >= 20) {
        analysis.urgentAreas.push("Vida de oração interrompida")
        analysis.personalizedStrategies.push("🆘 Quando tentado, ore apenas: 'Jesus, me ajude!'")
        analysis.personalizedStrategies.push("📱 Configure lembretes de oração 3x ao dia")
        analysis.personalizedStrategies.push("📖 Leia um Salmo quando não conseguir orar")
      }
    }

    return analysis
  }, [user.assessmentAnswers, user.assessmentLevel, timeAbstinent])

  // Se nunca fez a avaliação básica inicial
  if (!hasCompletedAssessment()) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card principal para usuários novos */}
          <div className="relative">
            {/* Efeito de brilho de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/30 to-purple-500/20 rounded-3xl blur-xl"></div>
            
            {/* Card principal */}
            <div className="relative bg-gradient-to-br from-gray-800/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              
              {/* Ícone animado */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <User className="text-white animate-pulse" size={40} />
                </div>
                {/* Círculos decorativos */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-80"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-70"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Bem-vindo ao Purify!
              </h2>
              
              <p className="text-white/80 mb-6 text-sm leading-relaxed">
                Para acessar suas estatísticas personalizadas, primeiro você precisa fazer uma avaliação inicial para entendermos melhor sua situação.
              </p>

              {/* Benefícios da avaliação */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-blue-400" size={16} />
                  </div>
                  <span className="text-white/90 text-sm">Análise personalizada do seu nível de dependência</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="text-green-400" size={16} />
                  </div>
                  <span className="text-white/90 text-sm">Estratégias específicas para sua situação</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="text-purple-400" size={16} />
                  </div>
                  <span className="text-white/90 text-sm">Acompanhamento do seu progresso</span>
                </div>
              </div>

              {/* Botão principal com animação */}
              <button
                onClick={() => window.location.href = '/setup'}
                className="group relative w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Play size={20} />
                  Fazer Avaliação Inicial
                </span>
                
                {/* Efeito de brilho no botão */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <p className="text-white/60 text-xs mt-4">
                Leva apenas 2 minutos para completar
              </p>
            </div>
          </div>

          {/* Elementos decorativos */}
          <div className="absolute top-20 left-16 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-32 right-12 w-1 h-1 bg-indigo-400 rounded-full opacity-40"></div>
          <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400 rounded-full opacity-40"></div>
        </div>
      </div>
    )
  }

  // Se não fez a avaliação detalhada
  if (!detailedAnalysis) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card principal com animação */}
          <div className="relative">
            {/* Efeito de brilho de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-violet-500/30 to-purple-700/20 rounded-3xl blur-xl"></div>
            
            {/* Card principal */}
            <div className="relative bg-gradient-to-br from-gray-900/90 via-purple-900/90 to-violet-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              
              {/* Ícone animado */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Target className="text-white animate-pulse" size={40} />
                </div>
                {/* Círculos decorativos */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-70"></div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Avaliação Detalhada Necessária
              </h2>
              
              <p className="text-white/80 mb-8 text-sm leading-relaxed">
                Para criar seu plano personalizado de recuperação espiritual e prática, 
                você precisa completar nossa avaliação detalhada com 14 perguntas específicas.
              </p>

              {/* Lista de benefícios */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} className="text-green-400" />
                  </div>
                  <span className="text-white/90 text-sm">Estratégias baseadas nas suas respostas</span>
                </div>
                
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Cross size={16} className="text-purple-400" />
                  </div>
                  <span className="text-white/90 text-sm">Plano espiritual personalizado com Deus</span>
                </div>
                
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain size={16} className="text-blue-400" />
                  </div>
                  <span className="text-white/90 text-sm">Análise dos seus gatilhos específicos</span>
                </div>
                
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Timer size={16} className="text-orange-400" />
                  </div>
                  <span className="text-white/90 text-sm">Cronograma de recuperação de 90 dias</span>
                </div>
              </div>

              {/* Botão principal com animação */}
              <button
                onClick={() => window.location.href = '/assessment'}
                className="group relative w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Play size={20} />
                  Fazer Avaliação Detalhada
                </span>
                
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Nota de segurança */}
              <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Shield size={14} className="text-green-400" />
                  <span className="text-green-300 font-medium text-xs">100% Confidencial e Seguro</span>
                </div>
                <p className="text-white/60 text-xs">
                  Suas respostas são privadas e usadas apenas para personalizar seu plano
                </p>
              </div>
            </div>
          </div>

          {/* Elementos decorativos flutuantes */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-20 right-16 w-1 h-1 bg-purple-400 rounded-full opacity-40"></div>
          <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-10 right-12 w-1 h-1 bg-yellow-400 rounded-full opacity-60"></div>
        </div>
      </div>
    )
  }

  const getBgGradient = (level: string) => {
    switch (level) {
      case "severe": return "from-gray-700/30 to-gray-800/40 border-gray-600/30"
      case "high": return "from-gray-600/30 to-gray-700/40 border-gray-500/30"
      case "moderate": return "from-gray-500/30 to-gray-600/40 border-gray-400/30"
      default: return "from-gray-400/30 to-gray-500/40 border-gray-300/30"
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "severe": return "text-red-200"
      case "high": return "text-orange-200"
      case "moderate": return "text-yellow-200"
      default: return "text-green-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Análise Personalizada */}
      <div className={`bg-gradient-to-r ${getBgGradient(detailedAnalysis.riskLevel)} rounded-2xl p-6 backdrop-blur-sm`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <User className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Sua Análise Personalizada</h1>
            <p className={`${getUrgencyColor(detailedAnalysis.riskLevel)} text-sm`}>
              Baseada nas suas respostas específicas
            </p>
          </div>
        </div>

        {/* Áreas de Urgência Identificadas */}
        {detailedAnalysis.urgentAreas.length > 0 && (
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="text-yellow-400" size={18} />
              ⚠️ Áreas que Precisam de Atenção Urgente
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {detailedAnalysis.urgentAreas.map((area, index) => (
                <div key={index} className="bg-red-500/20 border border-red-400/30 rounded-lg p-2">
                  <span className="text-red-100 text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Clock className="text-blue-400 mx-auto mb-1" size={20} />
            <div className="text-white font-bold">{timeAbstinent.days}</div>
            <div className="text-white/70 text-xs">Dias Limpo</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <Target className="text-green-400 mx-auto mb-1" size={20} />
            <div className="text-white font-bold">{detailedAnalysis.personalizedStrategies.length}</div>
            <div className="text-white/70 text-xs">Estratégias Criadas</div>
          </div>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="glass-card border-white/20 rounded-2xl p-2">
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: "analise", label: "Análise", icon: Brain },
            { id: "plano", label: "Meu Plano", icon: Target },
            { id: "espiritual", label: "Espiritual", icon: Cross },
            { id: "progresso", label: "Progresso", icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3 rounded-xl text-xs font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-purple-500/30 text-white border border-purple-400/50"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <tab.icon className="mx-auto mb-1" size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "analise" && (
        <div className="space-y-6">
          {/* Padrões Identificados */}
          <div className="glass-card border-white/20 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="text-purple-400" size={20} />
              🧠 Padrões Específicos Identificados
            </h3>
            
            <div className="space-y-4">
              {/* Horários de Vulnerabilidade */}
              {detailedAnalysis.timePatterns.length > 0 && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                  <h4 className="font-medium text-blue-200 mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Seus Horários de Maior Vulnerabilidade
                  </h4>
                  {detailedAnalysis.timePatterns.map((pattern, index) => (
                    <div key={index} className="text-blue-100/90 text-sm">{pattern}</div>
                  ))}
                </div>
              )}

              {/* Gatilhos Emocionais */}
              {detailedAnalysis.emotionalTriggers.length > 0 && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                  <h4 className="font-medium text-red-200 mb-2 flex items-center gap-2">
                    <Heart size={16} />
                    Seus Gatilhos Emocionais Específicos
                  </h4>
                  {detailedAnalysis.emotionalTriggers.map((trigger, index) => (
                    <div key={index} className="text-red-100/90 text-sm">{trigger}</div>
                  ))}
                </div>
              )}

              {/* Locais de Risco */}
              {detailedAnalysis.locations.length > 0 && (
                <div className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4">
                  <h4 className="font-medium text-orange-200 mb-2 flex items-center gap-2">
                    <MapPin size={16} />
                    Seus Locais de Maior Risco
                  </h4>
                  {detailedAnalysis.locations.map((location, index) => (
                    <div key={index} className="text-orange-100/90 text-sm">{location}</div>
                  ))}
                </div>
              )}

              {/* Impacto Espiritual */}
              {detailedAnalysis.spiritualImpact && (
                <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-4">
                  <h4 className="font-medium text-purple-200 mb-2 flex items-center gap-2">
                    <Cross size={16} />
                    Como Isso Afeta Sua Vida Espiritual
                  </h4>
                  <div className="text-purple-100/90 text-sm">{detailedAnalysis.spiritualImpact}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "plano" && (
        <div className="space-y-6">
          {/* Estratégias Personalizadas */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-5">
            <h3 className="font-bold text-green-200 mb-4 flex items-center gap-2">
              <Target className="text-green-400" size={20} />
              🎯 Seu Plano de Ação Personalizado
            </h3>
            <p className="text-green-100/90 text-sm mb-4">
              Estratégias específicas baseadas nas suas respostas:
            </p>
            
            <div className="space-y-3">
              {detailedAnalysis.personalizedStrategies.map((strategy, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-3 border border-green-400/20">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <div className="text-green-100/90 text-sm">{strategy}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-green-600/20 border border-green-500/30 rounded-xl p-3">
              <p className="text-green-100/80 text-xs">
                💡 <strong>Importante:</strong> Estas estratégias foram criadas especificamente para sua situação. 
                Implemente uma por vez para melhores resultados.
              </p>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="glass-card border-white/20 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <ArrowRight className="text-blue-400" size={20} />
              Próximos 7 Dias - Ação Imediata
            </h3>
            
            <div className="space-y-3">
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-200 font-medium text-sm">Hoje:</span>
                </div>
                <div className="text-blue-100/90 text-sm">
                  {detailedAnalysis.personalizedStrategies[0] || "Configure bloqueadores em todos os dispositivos"}
                </div>
              </div>
              
              <div className="bg-purple-500/20 border border-purple-400/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-purple-200 font-medium text-sm">Esta Semana:</span>
                </div>
                <div className="text-purple-100/90 text-sm">
                  Implemente 3 das estratégias personalizadas acima
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "espiritual" && (
        <div className="space-y-6">
          {/* Plano Espiritual */}
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-400/30 rounded-2xl p-5">
            <h3 className="font-bold text-purple-200 mb-4 flex items-center gap-2">
              <Cross className="text-purple-400" size={20} />
              ✝️ Seu Plano de Recuperação Espiritual
            </h3>
            
            {detailedAnalysis.spiritualPlan && (
              <div className="space-y-4">
                {/* Versículos para Memorização */}
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-purple-200 mb-3 flex items-center gap-2">
                    <BookOpen size={16} />
                    📖 Versículos para Sua Situação
                  </h4>
                  <div className="space-y-2">
                    <div className="text-purple-100/90 text-sm">
                      <strong>1 Coríntios 10:13</strong><br />
                      "Não vos sobreveio tentação que não fosse humana; mas Deus é fiel e não permitirá que sejais tentados além das vossas forças..."
                    </div>
                    <div className="text-purple-100/90 text-sm">
                      <strong>Filipenses 4:13</strong><br />
                      "Tudo posso naquele que me fortalece."
                    </div>
                    <div className="text-purple-100/90 text-sm">
                      <strong>Salmos 51:10</strong><br />
                      "Cria em mim, ó Deus, um coração puro e renova dentro de mim um espírito inabalável."
                    </div>
                  </div>
                </div>

                {/* Orações Específicas */}
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-purple-200 mb-3 flex items-center gap-2">
                    <MessageCircle size={16} />
                    🙏 Orações para Momentos de Tentação
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-purple-600/20 rounded-lg p-2">
                      <div className="text-purple-100/90 text-sm">
                        "Senhor Jesus, neste momento de tentação, eu clamo por Sua força. 
                        Renove minha mente e purifique meu coração."
                      </div>
                    </div>
                    <div className="bg-purple-600/20 rounded-lg p-2">
                      <div className="text-purple-100/90 text-sm">
                        "Pai, eu reconheço minha fraqueza. Ajude-me a resistir e a buscar Você 
                        ao invés de buscar satisfação em coisas que me afastam de Ti."
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disciplinas Espirituais */}
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="font-medium text-purple-200 mb-3 flex items-center gap-2">
                    <Church size={16} />
                    ⛪ Disciplinas Espirituais Recomendadas
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="text-purple-100/90 text-sm">
                        <strong>Tempo diário com Deus:</strong> Comece com 10 minutos de oração/leitura bíblica
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="text-purple-100/90 text-sm">
                        <strong>Comunhão:</strong> Participe regularmente dos cultos e grupos de estudo
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="text-purple-100/90 text-sm">
                        <strong>Prestação de contas:</strong> Encontre um irmão maduro para acompanhar sua jornada
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="text-purple-100/90 text-sm">
                        <strong>Jejum:</strong> Pratique jejum semanal para fortalecer o domínio próprio
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "progresso" && (
        <div className="space-y-6">
          {/* Métricas de Progresso */}
          <div className="glass-card border-white/20 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-400" size={20} />
              📈 Seu Progresso de Recuperação
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 text-center">
                <Calendar className="text-green-400 mx-auto mb-2" size={24} />
                <div className="text-white font-bold text-xl">{timeAbstinent.days}</div>
                <div className="text-green-200 text-sm">Dias Limpo</div>
              </div>
              
              <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 text-center">
                <Clock className="text-blue-400 mx-auto mb-2" size={24} />
                <div className="text-white font-bold text-xl">{Math.round(timeAbstinent.days * 1.5)}</div>
                <div className="text-blue-200 text-sm">Horas Recuperadas</div>
              </div>
            </div>

            {/* Benefícios Conquistados */}
            <div className="bg-white/10 rounded-xl p-4">
              <h4 className="font-medium text-white mb-3">🏆 Benefícios Já Conquistados</h4>
              <div className="space-y-3">
                {timeAbstinent.days >= 1 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-white/90 text-sm">Primeiro dia de vitória conquistado</span>
                  </div>
                )}
                {timeAbstinent.days >= 7 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-white/90 text-sm">Uma semana de pureza alcançada</span>
                  </div>
                )}
                {timeAbstinent.days >= 30 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-white/90 text-sm">Um mês de transformação completado</span>
                  </div>
                )}
                {timeAbstinent.days >= 90 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-400" />
                    <span className="text-white/90 text-sm">Reboot neural de 90 dias conquistado!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Próximo Marco */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-xl p-4">
              <h4 className="font-medium text-yellow-200 mb-3 flex items-center gap-2">
                <Target size={16} />
                🎯 Próximo Marco
              </h4>
              <div className="text-yellow-100/90 text-sm">
                {timeAbstinent.days < 7 && `Faltam ${7 - timeAbstinent.days} dias para completar 1 semana`}
                {timeAbstinent.days >= 7 && timeAbstinent.days < 30 && `Faltam ${30 - timeAbstinent.days} dias para completar 1 mês`}
                {timeAbstinent.days >= 30 && timeAbstinent.days < 90 && `Faltam ${90 - timeAbstinent.days} dias para completar o reboot de 90 dias`}
                {timeAbstinent.days >= 90 && "Parabéns! Você está na jornada de manutenção. Continue firme!"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Funções auxiliares
function generateSpiritualPlan(answers: Record<string, any>) {
  return {
    verses: [
      "1 Coríntios 10:13",
      "Filipenses 4:13", 
      "Salmos 51:10"
    ],
    prayers: [
      "Oração contra tentação",
      "Oração por pureza",
      "Oração por força"
    ]
  }
}

function calculateProgressMetrics(answers: Record<string, any>, timeAbstinent: any) {
  return {
    daysClean: timeAbstinent.days,
    hoursRecovered: Math.round(timeAbstinent.days * 1.5),
    strategiesImplemented: 0
  }
}
