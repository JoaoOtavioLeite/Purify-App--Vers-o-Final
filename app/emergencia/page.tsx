"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  Shield, 
  Wind, 
  Phone, 
  Heart, 
  Brain, 
  Clock, 
  Lightbulb, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Timer,
  Pause,
  Play,
  Zap,
  BookOpen,
  ChevronLeft,
  Quote,
  Cross,
  RefreshCw
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

export default function EmergenciaPage() {
  const { data } = useAddiction()
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [breathingTimer, setBreathingTimer] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale" | "pause">("inhale")
  const [isBreathing, setIsBreathing] = useState(false)
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  // Conteúdo bíblico baseado nas emoções
  const biblicalContent = {
    anxious: {
      emoji: "😰",
      title: "Ansioso",
      description: "Preocupado, tenso",
      color: "red",
      messages: [
        "Deus conhece suas preocupações e quer te dar paz.",
        "Entregue suas ansiedades ao Senhor, Ele cuida de você.",
        "A paz de Cristo pode acalmar seu coração agitado.",
        "Confie que Deus tem o controle de todas as situações."
      ],
      verses: [
        {
          text: "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam os vossos pedidos conhecidos diante de Deus, pela oração e pela súplica, com ações de graças.",
          reference: "Filipenses 4:6"
        },
        {
          text: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
          reference: "1 Pedro 5:7"
        },
        {
          text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.",
          reference: "João 14:27"
        }
      ]
    },
    angry: {
      emoji: "😤",
      title: "Irritado",
      description: "Com raiva, frustrado",
      color: "orange",
      messages: [
        "Deus entende sua frustração e pode transformar sua raiva em sabedoria.",
        "O Senhor pode acalmar seu espírito e renovar seu coração.",
        "Permita que a paciência de Cristo seja sua força.",
        "Busque a paz que vem do alto para superar a irritação."
      ],
      verses: [
        {
          text: "Irai-vos e não pequeis; não se ponha o sol sobre a vossa ira.",
          reference: "Efésios 4:26"
        },
        {
          text: "A resposta branda desvia o furor, mas a palavra dura suscita a ira.",
          reference: "Provérbios 15:1"
        },
        {
          text: "O homem tardio em irar-se é grande em entendimento, mas o que é de espírito impaciente exalta a loucura.",
          reference: "Provérbios 14:29"
        }
      ]
    },
    sad: {
      emoji: "😢",
      title: "Triste",
      description: "Para baixo, desanimado",
      color: "blue",
      messages: [
        "Jesus conhece sua dor e quer enxugar suas lágrimas.",
        "Mesmo na tristeza, Deus está preparando alegria para você.",
        "Sua tristeza não é permanente, a alegria vem pela manhã.",
        "O Espírito Santo é seu consolador nos momentos difíceis."
      ],
      verses: [
        {
          text: "Bem-aventurados os que choram, porque eles serão consolados.",
          reference: "Mateus 5:4"
        },
        {
          text: "O choro pode durar uma noite, mas a alegria vem pela manhã.",
          reference: "Salmos 30:5"
        },
        {
          text: "Perto está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.",
          reference: "Salmos 34:18"
        }
      ]
    },
    tired: {
      emoji: "😴",
      title: "Cansado",
      description: "Sem energia, exausto",
      color: "yellow",
      messages: [
        "Jesus te convida a descansar nEle quando estiver cansado.",
        "Deus renova as forças daqueles que esperam nEle.",
        "Sua força vem do Senhor, não das suas próprias capacidades.",
        "Descanse na presença de Deus e encontre renovação."
      ],
      verses: [
        {
          text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
          reference: "Mateus 11:28"
        },
        {
          text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias; correrão e não se cansarão; caminharão e não se fatigarão.",
          reference: "Isaías 40:31"
        },
        {
          text: "O meu jugo é suave, e o meu fardo é leve.",
          reference: "Mateus 11:30"
        }
      ]
    }
  }

  const quickActivities = [
    { 
      id: "cold-water", 
      title: "Água Gelada", 
      description: "Lave o rosto com água gelada por 30 segundos",
      icon: <Activity className="text-blue-500" size={24} />,
      duration: "30s"
    },
    { 
      id: "pushups", 
      title: "15 Flexões", 
      description: "Faça exercícios físicos para liberar endorfina",
      icon: <Heart className="text-red-500" size={24} />,
      duration: "2min"
    },
    { 
      id: "walk", 
      title: "Caminhada", 
      description: "Saia para uma caminhada de 10 minutos",
      icon: <Timer className="text-green-500" size={24} />,
      duration: "10min"
    },
    { 
      id: "call-friend", 
      title: "Ligar para Alguém", 
      description: "Entre em contato com um amigo ou familiar",
      icon: <Phone className="text-purple-500" size={24} />,
      duration: "5min"
    },
    { 
      id: "journal", 
      title: "Escrever", 
      description: "Anote seus sentimentos no diário",
      icon: <Lightbulb className="text-yellow-500" size={24} />,
      duration: "5min"
    },
    { 
      id: "meditation", 
      title: "Meditação Rápida", 
      description: "5 minutos de mindfulness",
      icon: <Brain className="text-indigo-500" size={24} />,
      duration: "5min"
    },
  ]

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isBreathing) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTime = prev + 1
          
          // 4-7-8 breathing technique
          if (breathingPhase === "inhale" && newTime >= 4) {
            setBreathingPhase("hold")
            return 0
          } else if (breathingPhase === "hold" && newTime >= 7) {
            setBreathingPhase("exhale")
            return 0
          } else if (breathingPhase === "exhale" && newTime >= 8) {
            setBreathingPhase("pause")
            return 0
          } else if (breathingPhase === "pause" && newTime >= 2) {
            setBreathingPhase("inhale")
            return 0
          }
          
          return newTime
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isBreathing, breathingPhase])

  const handleCompleteActivity = (activityId: string) => {
    if (!completedActivities.includes(activityId)) {
      setCompletedActivities([...completedActivities, activityId])
    }
  }

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case "inhale": return "Inspire profundamente pelo nariz"
      case "hold": return "Segure a respiração"
      case "exhale": return "Expire lentamente pela boca"
      case "pause": return "Pausa..."
    }
  }

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 pb-20">
      {/* Header de Emergência */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Momento Difícil?</h1>
            <p className="text-white/90">Você não está sozinho. Vamos passar por isso juntos.</p>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-xl p-4 mt-4">
          <p className="text-white font-medium mb-2">💪 Lembre-se:</p>
          <p className="text-white/90 text-sm leading-relaxed">
            Este sentimento é temporário. Você já passou por isso antes e pode passar de novo. 
            Sua força é maior que qualquer impulso.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Exercício de Respiração */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Wind className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Respiração 4-7-8</h2>
              <p className="text-gray-600 text-sm">Técnica para acalmar a mente</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className={`w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-1000 ${
              breathingPhase === "inhale" ? "bg-blue-200 scale-110" :
              breathingPhase === "hold" ? "bg-purple-200 scale-110" :
              breathingPhase === "exhale" ? "bg-green-200 scale-90" :
              "bg-gray-200 scale-100"
            }`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">{breathingTimer}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">
                  {breathingPhase === "inhale" ? "Inspire" :
                   breathingPhase === "hold" ? "Segure" :
                   breathingPhase === "exhale" ? "Expire" : "Pause"}
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 font-medium">{getBreathingInstruction()}</p>
            
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                isBreathing 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isBreathing ? (
                <>
                  <Pause className="inline mr-2" size={16} />
                  Pausar Exercício
                </>
              ) : (
                <>
                  <Play className="inline mr-2" size={16} />
                  Começar Respiração
                </>
              )}
            </button>
          </div>
        </div>

        {/* Atividades Rápidas */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="text-green-600" size={24} />
            Atividades de Distração
          </h2>
          <p className="text-gray-600 mb-4 text-sm">Escolha uma atividade para desviar o foco:</p>
          
          <div className="grid grid-cols-2 gap-3">
            {quickActivities.map((activity) => (
              <div
                key={activity.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  completedActivities.includes(activity.id)
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-50 border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleCompleteActivity(activity.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {activity.icon}
                  {completedActivities.includes(activity.id) && (
                    <CheckCircle className="text-green-500 ml-auto" size={20} />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{activity.title}</h3>
                <p className="text-gray-600 text-xs mb-2">{activity.description}</p>
                <span className="text-blue-600 text-xs font-medium">{activity.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Check-in Emocional Cristão */}
        {!selectedEmotion ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Cross className="text-purple-600" size={24} />
              Como Seu Coração Está Hoje?
            </h2>
            
            <p className="text-gray-600 mb-4 text-sm">Compartilhe seus sentimentos com Deus e receba Sua Palavra de conforto:</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setSelectedEmotion('anxious')}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4 hover:bg-red-100 transition-all group active:scale-95"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="text-2xl mb-2">{biblicalContent.anxious.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{biblicalContent.anxious.title}</h3>
                <p className="text-gray-600 text-xs">{biblicalContent.anxious.description}</p>
              </button>
              
              <button 
                onClick={() => setSelectedEmotion('angry')}
                className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 hover:bg-orange-100 transition-all group active:scale-95"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="text-2xl mb-2">{biblicalContent.angry.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{biblicalContent.angry.title}</h3>
                <p className="text-gray-600 text-xs">{biblicalContent.angry.description}</p>
              </button>
              
              <button 
                onClick={() => setSelectedEmotion('sad')}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 hover:bg-blue-100 transition-all group active:scale-95"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="text-2xl mb-2">{biblicalContent.sad.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{biblicalContent.sad.title}</h3>
                <p className="text-gray-600 text-xs">{biblicalContent.sad.description}</p>
              </button>
              
              <button 
                onClick={() => setSelectedEmotion('tired')}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 hover:bg-yellow-100 transition-all group active:scale-95"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <div className="text-2xl mb-2">{biblicalContent.tired.emoji}</div>
                <h3 className="font-semibold text-gray-800 text-sm">{biblicalContent.tired.title}</h3>
                <p className="text-gray-600 text-xs">{biblicalContent.tired.description}</p>
              </button>
            </div>
            
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-blue-600" size={18} />
                <span className="font-medium text-gray-800 text-sm">Palavra de Esperança</span>
              </div>
              <p className="text-gray-700 text-sm italic">
                "Entregue suas preocupações ao Senhor, e ele o sustentará; jamais permitirá que o justo venha a cair." - Salmos 55:22
              </p>
            </div>
          </div>
        ) : (
          /* Tela de Conforto Bíblico */
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-purple-200">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setSelectedEmotion(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Voltar</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{biblicalContent[selectedEmotion as keyof typeof biblicalContent].emoji}</span>
                <span className="font-semibold text-gray-800">
                  {biblicalContent[selectedEmotion as keyof typeof biblicalContent].title}
                </span>
              </div>
            </div>

            {/* Mensagens de Conforto */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="text-red-500" size={18} />
                Mensagens de Esperança
              </h3>
              <div className="space-y-3">
                {biblicalContent[selectedEmotion as keyof typeof biblicalContent].messages.map((message, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-gray-700 text-sm">{message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Versículos Bíblicos */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="text-purple-600" size={18} />
                Palavra de Deus para Você
              </h3>
              {biblicalContent[selectedEmotion as keyof typeof biblicalContent].verses.map((verse, index) => (
                <div key={index} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Quote className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-gray-800 font-medium leading-relaxed mb-2 italic">
                        "{verse.text}"
                      </p>
                      <p className="text-purple-600 font-semibold text-sm">
                        {verse.reference}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Oração Sugerida */}
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Cross className="text-orange-500" size={16} />
                Oração para Este Momento
              </h4>
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "Senhor, venho até Ti com meu coração {biblicalContent[selectedEmotion as keyof typeof biblicalContent].title.toLowerCase()}. 
                Confio em Tua Palavra e busco Tua paz. Fortalece-me com Teu amor e renova meu espírito. 
                Em nome de Jesus, amém."
              </p>
            </div>
          </div>
        )}

        {/* Mensagem Motivacional */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-white font-bold text-lg mb-2">🌟 Você É Mais Forte!</h3>
          <p className="text-white/90 mb-4 leading-relaxed">
            Cada momento que você resiste é uma vitória. Seu tempo limpo de{" "}
            {data.streakStart && (
              <>
                {Math.floor((new Date().getTime() - new Date(data.streakStart).getTime()) / (1000 * 60 * 60 * 24))} dias
              </>
            )} é a prova de que você consegue.
          </p>
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-white text-sm">
              💡 <strong>Dica:</strong> Este sentimento vai passar. Foque no próximo minuto, não no dia todo.
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}