"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Shield, 
  Check, 
  X,
  Star,
  Clock,
  Heart,
  AlertCircle,
  Send,
  UserCheck,
  UserPlus
} from "lucide-react"

interface Partner {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  streakDays: number
  joinedDate: string
  lastActive: string
  isConnected: boolean
  trustLevel: number // 1-5 stars
}

interface Message {
  id: string
  from: "me" | "partner"
  text: string
  timestamp: string
  type: "text" | "support" | "achievement"
}

// Dados simulados para demonstração
const mockPartners: Partner[] = [
  {
    id: "1",
    name: "Carlos M.",
    avatar: "🧑‍💼",
    status: "online",
    streakDays: 45,
    joinedDate: "15/12/2023",
    lastActive: "Agora",
    isConnected: true,
    trustLevel: 5
  },
  {
    id: "2", 
    name: "Ana R.",
    avatar: "👩‍🎓",
    status: "away",
    streakDays: 23,
    joinedDate: "02/01/2024",
    lastActive: "2h atrás",
    isConnected: true,
    trustLevel: 4
  }
]

const mockMessages: Message[] = [
  {
    id: "1",
    from: "partner",
    text: "Como foi seu dia hoje? Conseguiu manter o foco?",
    timestamp: "14:30",
    type: "text"
  },
  {
    id: "2",
    from: "me", 
    text: "Foi bem! Tive um momento difícil de manhã, mas usei a técnica de respiração.",
    timestamp: "14:45",
    type: "text"
  },
  {
    id: "3",
    from: "partner",
    text: "Parabéns por resistir! Isso mostra sua força. 💪",
    timestamp: "14:46",
    type: "support"
  },
  {
    id: "4",
    from: "me",
    text: "Completei 18 dias! 🎉",
    timestamp: "Hoje",
    type: "achievement"
  }
]

export function AccountabilityPartner() {
  const [activeTab, setActiveTab] = useState<"partners" | "chat" | "find">("partners")
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(mockPartners[0])
  const [newMessage, setNewMessage] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedPartner) {
      // Aqui implementaria o envio real da mensagem
      console.log("Enviando mensagem:", newMessage)
      setNewMessage("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "away": return "bg-yellow-500"
      default: return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Online"
      case "away": return "Ausente"
      default: return "Offline"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white">Parceiros de Responsabilidade</h1>
              <p className="text-white/80 text-sm">Apoio mútuo na jornada de superação</p>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{mockPartners.length}</div>
                <div className="text-white/80 text-xs">Parceiros Ativos</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">47</div>
                <div className="text-white/80 text-xs">Mensagens Hoje</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">98%</div>
                <div className="text-white/80 text-xs">Taxa de Apoio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        
        {/* Navegação por Abas */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <div className="grid grid-cols-3 gap-1">
            {[
              { key: "partners", label: "Parceiros", icon: "👥" },
              { key: "chat", label: "Chat", icon: "💬" },
              { key: "find", label: "Encontrar", icon: "🔍" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`p-3 rounded-xl text-center transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="text-sm mb-1">{tab.icon}</div>
                <div className="text-xs font-medium">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo Aba: Parceiros */}
        {activeTab === "partners" && (
          <>
            {/* Lista de Parceiros */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Meus Parceiros</h3>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                {mockPartners.map((partner) => (
                  <div key={partner.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                          {partner.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(partner.status)} rounded-full border-2 border-white`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">{partner.name}</span>
                          <div className="flex">
                            {[...Array(partner.trustLevel)].map((_, i) => (
                              <Star key={i} className="text-yellow-400 fill-current" size={12} />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {partner.streakDays} dias limpo • {getStatusText(partner.status)}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPartner(partner)
                          setActiveTab("chat")
                        }}
                        className="bg-white border border-gray-200 hover:border-blue-300 p-2 rounded-xl transition-colors"
                      >
                        <MessageCircle className="text-blue-500" size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-green-600">{partner.streakDays}</div>
                        <div className="text-xs text-gray-600">Dias Limpos</div>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <div className="text-lg font-bold text-blue-600">{partner.trustLevel}</div>
                        <div className="text-xs text-gray-600">Confiança</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estatísticas de Apoio */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
              <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Shield className="text-green-600" size={20} />
                Impacto do Apoio Mútuo
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">67%</div>
                  <div className="text-green-600 text-xs">Maior taxa de sucesso</div>
                </div>
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">3.2x</div>
                  <div className="text-green-600 text-xs">Sequências mais longas</div>
                </div>
              </div>
              <p className="text-green-700 text-sm mt-3">
                Pessoas com parceiros de responsabilidade têm muito mais chances de sucesso!
              </p>
            </div>
          </>
        )}

        {/* Conteúdo Aba: Chat */}
        {activeTab === "chat" && selectedPartner && (
          <>
            {/* Header do Chat */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg">
                    {selectedPartner.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedPartner.status)} rounded-full border-2 border-white`}></div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{selectedPartner.name}</div>
                  <div className="text-sm text-gray-600">{selectedPartner.lastActive}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{selectedPartner.streakDays}</div>
                  <div className="text-xs text-gray-600">dias</div>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-h-96 overflow-y-auto">
              <div className="p-4 space-y-3">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      message.from === "me" 
                        ? "bg-blue-500 text-white rounded-br-md" 
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}>
                      {message.type === "achievement" && (
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="text-yellow-400 fill-current" size={14} />
                          <span className="text-xs font-medium">Conquista</span>
                        </div>
                      )}
                      {message.type === "support" && (
                        <div className="flex items-center gap-1 mb-1">
                          <Heart className="text-pink-400" size={14} />
                          <span className="text-xs font-medium">Apoio</span>
                        </div>
                      )}
                      <div className="text-sm">{message.text}</div>
                      <div className={`text-xs mt-1 ${message.from === "me" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              
              {/* Botões de Resposta Rápida */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {[
                  "👍 Força aí!",
                  "💪 Você consegue!",
                  "🎯 Foco total!",
                  "🔥 Vamos juntos!",
                  "⚡ Check-in!"
                ].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => setNewMessage(quick)}
                    className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Conteúdo Aba: Encontrar */}
        {activeTab === "find" && (
          <>
            {/* Critérios de Busca */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserPlus className="text-blue-500" size={20} />
                Encontrar Parceiro Ideal
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Vício</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                    <option>Pornografia</option>
                    <option>Qualquer tipo</option>
                    <option>Álcool</option>
                    <option>Cigarro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faixa Etária</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                    <option>18-25 anos</option>
                    <option>26-35 anos</option>
                    <option>36-45 anos</option>
                    <option>46+ anos</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experiência</label>
                  <select className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
                    <option>Iniciante (0-30 dias)</option>
                    <option>Intermediário (1-6 meses)</option>
                    <option>Avançado (6+ meses)</option>
                    <option>Qualquer nível</option>
                  </select>
                </div>
              </div>
              
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl mt-4 transition-colors">
                Buscar Parceiros Compatíveis
              </button>
            </div>

            {/* Parceiros Sugeridos */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Parceiros Sugeridos</h3>
              
              <div className="space-y-3">
                {[
                  { name: "João S.", avatar: "👨‍💻", days: 89, compatibility: 95 },
                  { name: "Pedro L.", avatar: "🧑‍🎨", days: 34, compatibility: 87 },
                  { name: "Rafael M.", avatar: "👨‍⚕️", days: 156, compatibility: 92 }
                ].map((suggested, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg">
                        {suggested.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{suggested.name}</div>
                        <div className="text-sm text-gray-600">{suggested.days} dias de experiência</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{suggested.compatibility}%</div>
                        <div className="text-xs text-gray-600">compatível</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Enviar Convite
                      </button>
                      <button className="bg-white border border-blue-300 hover:border-blue-400 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Como Funciona */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
              <h3 className="font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <UserCheck className="text-purple-600" size={20} />
                Como Funciona o Sistema
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-purple-800 text-sm">Encontre um parceiro compatível</div>
                    <div className="text-purple-700 text-xs">Baseado em idade, tipo de vício e experiência</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-purple-800 text-sm">Façam check-ins diários</div>
                    <div className="text-purple-700 text-xs">Compartilhem progresso e desafios</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-purple-800 text-sm">Apoiem-se mutuamente</div>
                    <div className="text-purple-700 text-xs">Motivação, conselhos e celebrações</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de Convite */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="text-blue-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Convidar Amigo</h3>
                <p className="text-gray-600 text-sm">
                  Compartilhe o link de convite com alguém de confiança
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-xs text-gray-600 mb-1">Link de convite:</div>
                  <div className="text-sm font-mono text-gray-800 break-all">
                    purify.app/invite/abc123def456
                  </div>
                </div>
                
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors">
                  Copiar Link
                </button>
                
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
