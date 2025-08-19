"use client"

import { useState, useRef } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { 
  Shield, 
  Heart, 
  Activity,
  CheckCircle,
  Share2,
  Award,
  Flame
} from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { BreathingExercise } from "@/components/BreathingExercise"
import { QuickMindfulness } from "@/components/QuickMindfulness"
import { useHaptics } from "@/lib/haptics"
import { useDeviceFeatures } from "@/lib/device-features"
// import html2canvas from "html2canvas"

export default function EmergenciaPage() {
  const { data } = useAddiction()
  const [activeTab, setActiveTab] = useState<"quick" | "breathing" | "mindfulness" | "support">("quick")
  const [completedActivities, setCompletedActivities] = useState<string[]>([])
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [sosVictories, setSosVictories] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('sosVictories') || '0')
    }
    return 0
  })
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const victoryCardRef = useRef<HTMLDivElement>(null)
  const haptics = useHaptics()
  const { share } = useDeviceFeatures()

  // Conteúdo bíblico simplificado
  const biblicalContent = {
    anxious: {
      emoji: "😰",
      title: "Ansioso",
      subtitle: "Preocupado, tenso",
      verse: "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam os vossos pedidos conhecidos diante de Deus, pela oração e pela súplica, com ações de graças.",
      reference: "Filipenses 4:6",
      message: "Deus conhece suas preocupações e quer te dar paz. Entregue suas ansiedades ao Senhor, Ele cuida de você.",
      prayer: "Senhor, tomo posse da Sua paz. Entrego a Ti minhas preocupações e confio em Seu cuidado. Amém."
    },
    angry: {
      emoji: "😤",
      title: "Irritado",
      subtitle: "Com raiva, frustrado",
      verse: "Irai-vos e não pequeis; não se ponha o sol sobre a vossa ira.",
      reference: "Efésios 4:26",
      message: "Deus entende sua frustração e pode transformar sua raiva em sabedoria. O Senhor pode acalmar seu espírito.",
      prayer: "Pai, acalma meu coração. Transforma esta raiva em paciência e sabedoria. Me ajude a perdoar. Amém."
    },
    sad: {
      emoji: "😔",
      title: "Triste",
      subtitle: "Desanimado, melancólico",
      verse: "Perto está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.",
      reference: "Salmos 34:18",
      message: "Suas lágrimas são preciosas para Deus. Ele está perto de você neste momento de tristeza.",
      prayer: "Senhor, consola meu coração. Enxuga minhas lágrimas e renova minha esperança em Ti. Amém."
    },
    tired: {
      emoji: "😴",
      title: "Cansado",
      subtitle: "Exausto, sem energia",
      verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
      reference: "Mateus 11:28",
      message: "Jesus convida você a descansar Nele. Sua força pode renovar suas energias.",
      prayer: "Jesus, estou cansado. Venho a Ti em busca de descanso e renovação. Fortalece-me. Amém."
    }
  }

  // Atividades rápidas de distração
  const quickActivities = [
    {
      id: "breathing",
      title: "Respiração Profunda",
      description: "5 respirações conscientes",
      duration: "1 min",
      icon: <Heart className="text-blue-500" size={20} />
    },
    {
      id: "walk",
      title: "Caminhada Rápida",
      description: "Sair de casa por 10 min",
      duration: "10 min",
      icon: <Activity className="text-green-500" size={20} />
    },
    {
      id: "water",
      title: "Beber Água",
      description: "Hidratar e refrescar",
      duration: "2 min",
      icon: <Shield className="text-cyan-500" size={20} />
    },
    {
      id: "call",
      title: "Ligar para Alguém",
      description: "Conversar com um amigo",
      duration: "5 min",
      icon: <Heart className="text-purple-500" size={20} />
    }
  ]

  const handleCompleteActivity = (activityId: string) => {
    if (!completedActivities.includes(activityId)) {
      setCompletedActivities(prev => [...prev, activityId])
      haptics.success()
    }
  }

  const handleSOSVictory = () => {
    const newCount = sosVictories + 1
    setSosVictories(newCount)
    localStorage.setItem('sosVictories', newCount.toString())
    setShowVictoryModal(true)
    haptics.success()
  }

  const handleShareVictory = async () => {
    if (!victoryCardRef.current) return
    
    try {
      setIsCapturing(true)
      
      // Importação dinâmica do html2canvas
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(victoryCardRef.current)
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
      })
      
      const file = new File([blob], 'sos-victoria.png', { type: 'image/png' })
      
      if (share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await share({
          title: 'SOS Vitória - Purify',
          text: `🔥 Acabei de resistir a uma tentação! ${sosVictories} vitórias no total! #Purify #Força #Vitória`,
          files: [file]
        })
      } else {
        const link = document.createElement('a')
        link.download = 'sos-victoria.png'
        link.href = canvas.toDataURL()
        link.click()
      }
      
      setShareMessage("Vitória compartilhada! 🎉")
    } catch (error) {
      setShareMessage("Erro ao compartilhar")
    } finally {
      setIsCapturing(false)
      setTimeout(() => setShareMessage(null), 3000)
    }
  }

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header de Emergência */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">Momento Difícil?</h1>
              <p className="text-white/80 text-sm">Você não está sozinho. Vamos passar por isso juntos.</p>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold text-sm">💪 Lembre-se:</span>
            </div>
            <p className="text-white/90 text-xs leading-relaxed">
              Este sentimento é temporário. Você já passou por isso antes e pode passar de novo. 
              Sua força é maior que qualquer impulso.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Navegação por Abas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: "quick", label: "SOS", icon: "🚨" },
              { key: "breathing", label: "Respiração", icon: "🌬️" },
              { key: "mindfulness", label: "Mindful", icon: "🧘‍♀️" },
              { key: "support", label: "Apoio", icon: "💙" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-red-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="text-lg mb-1">{tab.icon}</div>
                <div className="text-xs font-medium">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Aba: SOS Rápido */}
        {activeTab === "quick" && (
          <>
            {/* Atividades Rápidas */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Activity className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-base">Atividades de Distração</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Escolha uma atividade para desviar o foco:</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {quickActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      completedActivities.includes(activity.id)
                        ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                    }`}
                    onClick={() => handleCompleteActivity(activity.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {activity.icon}
                      {completedActivities.includes(activity.id) && (
                        <CheckCircle className="text-green-500 ml-auto" size={20} />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{activity.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{activity.description}</p>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">{activity.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SOS Vitórias */}
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Award className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">SOS Vitórias</h2>
                  <p className="text-white/80 text-sm">Vezes que você resistiu com sucesso</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">{sosVictories}</div>
                  <div className="text-white/80 text-xs">Vitórias</div>
                </div>
                
                <button
                  onClick={handleSOSVictory}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
                >
                  <Flame className="text-yellow-300" size={16} />
                  Resisti!
                </button>
              </div>
            </div>
          </>
        )}

        {/* Conteúdo Aba: Respiração */}
        {activeTab === "breathing" && (
          <BreathingExercise 
            technique="4-7-8"
            onComplete={(cycles) => {
              haptics.success()
            }}
          />
        )}

        {/* Conteúdo Aba: Mindfulness */}
        {activeTab === "mindfulness" && (
          <QuickMindfulness 
            onComplete={(exerciseId, duration) => {
              haptics.success()
            }}
          />
        )}

        {/* Conteúdo Aba: Apoio */}
        {activeTab === "support" && (
          <>
            {/* Check-in Emocional Cristão */}
            {!selectedEmotion ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Heart className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-gray-900 dark:text-gray-100 font-semibold text-base">Como você está se sentindo?</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Escolha sua emoção para receber apoio personalizado</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(biblicalContent).map(([emotion, content]) => (
                    <button
                      key={emotion}
                      onClick={() => setSelectedEmotion(emotion)}
                      className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-left"
                    >
                      <div className="text-2xl mb-2">{content.emoji}</div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{content.title}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">{content.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setSelectedEmotion(null)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4 transition-colors"
                >
                  ← Voltar
                </button>
                
                <div className="text-center mb-6">
                  <div className="text-6xl mb-3">{biblicalContent[selectedEmotion].emoji}</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {biblicalContent[selectedEmotion].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {biblicalContent[selectedEmotion].subtitle}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📖 Versículo de Força</h4>
                    <p className="text-blue-700 dark:text-blue-300 text-sm italic leading-relaxed">
                      "{biblicalContent[selectedEmotion].verse}"
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs mt-2 font-medium">
                      {biblicalContent[selectedEmotion].reference}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">💚 Mensagem de Esperança</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                      {biblicalContent[selectedEmotion].message}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">🙏 Oração Simples</h4>
                    <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed italic">
                      {biblicalContent[selectedEmotion].prayer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Vitória SOS */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl shadow-2xl max-w-sm w-full border border-white/20">
            <div ref={victoryCardRef} className="p-6 text-white text-center">
              <div className="text-6xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold mb-2">Vitória SOS!</h3>
              <p className="text-white/90 mb-4">
                Você resistiu com sucesso! Esta é sua vitória número <strong>{sosVictories}</strong>!
              </p>
              
              {/* Mensagem Motivacional */}
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                🧠 <strong>Sua mente ficou mais forte!</strong><br/>
                Cada resistência reconstrói seus circuitos neurais.<br/>
                🔥 <strong>Você está se transformando!</strong>
              </p>
              
              {/* Botões */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowVictoryModal(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  ✨ Continuar
                </button>
                <button
                  onClick={handleShareVictory}
                  disabled={isCapturing}
                  className="flex-1 bg-white/90 hover:bg-white text-emerald-600 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isCapturing ? (
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Compartilhar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de feedback */}
      {shareMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">{shareMessage}</p>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}
