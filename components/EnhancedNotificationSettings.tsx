"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  BellOff, 
  Clock, 
  Settings, 
  Check, 
  X, 
  Smartphone,
  AlertCircle,
  TestTube,
  Trophy,
  Star,
  Calendar,
  MessageCircle,
  Shield,
  BookOpen,
  Heart,
  Zap
} from "lucide-react"
import { useNotifications, NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications"
import { useHaptics } from "@/lib/haptics"

interface EnhancedNotificationSettingsProps {
  onClose?: () => void
}

export function EnhancedNotificationSettings({ onClose }: EnhancedNotificationSettingsProps) {
  const notifications = useNotifications()
  const haptics = useHaptics()
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS)
  const [isLoading, setIsLoading] = useState(false)
  const [testMessage, setTestMessage] = useState<string | null>(null)

  useEffect(() => {
    // Carregar configurações atuais
    const currentSettings = notifications.getSettings()
    setSettings(currentSettings)
  }, [])

  const handleRequestPermission = async () => {
    setIsLoading(true)
    haptics.medium()
    
    try {
      const permission = await notifications.requestPermission()
      
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, permission }))
        setTestMessage("✅ Permissão concedida! Notificações ativadas.")
        haptics.success()
      } else {
        setTestMessage("⚠️ Permissão negada. Ative nas configurações do navegador.")
        haptics.error()
      }
    } catch (error) {
      setTestMessage("❌ Erro ao solicitar permissão.")
      haptics.error()
    } finally {
      setIsLoading(false)
      setTimeout(() => setTestMessage(null), 5000)
    }
  }

  const handleTimeChange = async (timeKey: 'morning' | 'afternoon' | 'evening' | 'night', time: string) => {
    const newSettings = {
      ...settings,
      [timeKey]: {
        ...settings[timeKey],
        time
      }
    }
    
    setSettings(newSettings)
    await notifications.updateSettings(newSettings)
    haptics.light()
  }

  const handleToggleTime = async (timeKey: 'morning' | 'afternoon' | 'evening' | 'night') => {
    const newSettings = {
      ...settings,
      [timeKey]: {
        ...settings[timeKey],
        enabled: !settings[timeKey].enabled
      }
    }
    
    setSettings(newSettings)
    await notifications.updateSettings(newSettings)
    haptics.medium()
  }

  const handleToggleAdvanced = async (feature: keyof NotificationSettings) => {
    if (typeof settings[feature] === 'boolean') {
      const newSettings = {
        ...settings,
        [feature]: !settings[feature]
      }
      
      setSettings(newSettings)
      await notifications.updateSettings(newSettings)
      haptics.medium()
    }
  }

  const handleTestNotification = async () => {
    setIsLoading(true)
    haptics.medium()
    
    try {
      await notifications.sendTestNotification()
      setTestMessage("🧪 Notificação de teste enviada!")
      haptics.success()
    } catch (error) {
      setTestMessage("❌ Erro ao enviar teste. Verifique as permissões.")
      haptics.error()
    } finally {
      setIsLoading(false)
      setTimeout(() => setTestMessage(null), 4000)
    }
  }

  const timeSlots = [
    { key: 'morning' as const, label: '🌅 Manhã', description: 'Motivação para começar o dia' },
    { key: 'afternoon' as const, label: '☀️ Tarde', description: 'Check-in do meio do dia' },
    { key: 'evening' as const, label: '🌆 Noite', description: 'Força para a reta final' },
    { key: 'night' as const, label: '🌙 Madrugada', description: 'Celebração do dia' }
  ]

  const advancedFeatures = [
    {
      key: 'weeklyReports' as const,
      icon: <Calendar size={18} />,
      title: '📊 Relatórios Semanais',
      description: 'Resumo do progresso aos domingos às 09:00',
      color: 'bg-blue-500'
    },
    {
      key: 'motivationalQuotes' as const,
      icon: <MessageCircle size={18} />,
      title: '💬 Citações Motivacionais',
      description: 'Inspiração 3 vezes por dia (10:30, 15:30, 20:30)',
      color: 'bg-green-500'
    },
    {
      key: 'emergencyReminders' as const,
      icon: <Shield size={18} />,
      title: '🚨 Lembretes de Emergência',
      description: 'Alertas personalizados em horários de risco',
      color: 'bg-red-500'
    },
    {
      key: 'habitTracking' as const,
      icon: <Check size={18} />,
      title: '📝 Rastreamento de Hábitos',
      description: 'Check-ins às 12:00, 18:00 e 21:00',
      color: 'bg-indigo-500'
    },
    {
      key: 'spiritualReminders' as const,
      icon: <Heart size={18} />,
      title: '🙏 Lembretes Espirituais',
      description: 'Oração (07:00, 12:00, 19:00) e leitura (20:00)',
      color: 'bg-purple-500'
    },
    {
      key: 'weekendSpecial' as const,
      icon: <Star size={18} />,
      title: '🎉 Especiais de Fim de Semana',
      description: 'Mensagens especiais sexta, sábado e domingo',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-violet-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-sm p-6 rounded-t-3xl border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Notificações</h2>
                <p className="text-white/80 text-sm">Configure seus lembretes</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={() => {
                  haptics.light()
                  onClose()
                }}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="text-white" size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status das Permissões */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Smartphone size={18} />
              Status das Notificações
            </h3>
            
            {!notifications.isAvailable() ? (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-400" size={20} />
                  <div>
                    <p className="font-medium text-red-300">Não Suportado</p>
                    <p className="text-red-200 text-sm">Este dispositivo não suporta notificações push.</p>
                  </div>
                </div>
              </div>
            ) : settings.permission === 'denied' ? (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <BellOff className="text-red-400" size={20} />
                  <div>
                    <p className="font-medium text-red-300">Permissão Negada</p>
                    <p className="text-red-200 text-sm">Ative nas configurações do navegador.</p>
                  </div>
                </div>
              </div>
            ) : settings.permission === 'granted' ? (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Check className="text-green-400" size={20} />
                  <div>
                    <p className="font-medium text-green-300">Ativo</p>
                    <p className="text-green-200 text-sm">Notificações configuradas e funcionando.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-yellow-400" size={20} />
                    <div>
                      <p className="font-medium text-yellow-300">Permissão Necessária</p>
                      <p className="text-yellow-200 text-sm">Permita notificações para receber lembretes.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRequestPermission}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl transition-all backdrop-blur-sm border border-blue-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Bell size={18} />
                      Ativar Notificações
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Configurações de Horários */}
          {settings.permission === 'granted' && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Clock size={18} />
                  Horários Diários
                </h3>
                
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div key={slot.key} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-white">{slot.label}</p>
                          <p className="text-white/70 text-sm">{slot.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleTime(slot.key)}
                          className={`w-12 h-6 rounded-full transition-all ${
                            settings[slot.key].enabled
                              ? 'bg-blue-500'
                              : 'bg-white/30'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings[slot.key].enabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      {settings[slot.key].enabled && (
                        <input
                          type="time"
                          value={settings[slot.key].time}
                          onChange={(e) => handleTimeChange(slot.key, e.target.value)}
                          className="w-full p-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 backdrop-blur-sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Marcos de Progresso */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Trophy size={18} />
                  Marcos de Progresso
                </h3>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">🎯 Conquistas Diárias</p>
                      <p className="text-white/70 text-sm">Receba parabéns ao completar cada dia</p>
                    </div>
                    <button
                      onClick={() => handleToggleAdvanced('milestones')}
                      className={`w-12 h-6 rounded-full transition-all ${
                        settings.milestones
                          ? 'bg-purple-500'
                          : 'bg-white/30'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.milestones ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notificações Avançadas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Zap size={18} />
                  Notificações Avançadas
                </h3>
                
                <div className="space-y-3">
                  {advancedFeatures.map((feature) => (
                    <div key={feature.key} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${feature.color}/30 rounded-lg flex items-center justify-center border border-white/20`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white text-sm">{feature.title}</p>
                            <p className="text-white/70 text-xs leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleAdvanced(feature.key)}
                          className={`w-12 h-6 rounded-full transition-all ml-3 flex-shrink-0 ${
                            settings[feature.key]
                              ? feature.color
                              : 'bg-white/30'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            settings[feature.key] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teste de Notificação */}
              <div className="space-y-3">
                <button
                  onClick={handleTestNotification}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all backdrop-blur-sm border border-purple-400/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <TestTube size={18} />
                      Enviar Teste
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Mensagem de Feedback */}
          {testMessage && (
            <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
              <p className="text-blue-200 text-sm font-medium text-center">{testMessage}</p>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-400/30">
            <h4 className="font-semibold text-emerald-200 mb-2 flex items-center gap-2">
              <Star size={16} />
              💡 Dicas
            </h4>
            <ul className="text-emerald-100 text-sm space-y-1">
              <li>• As notificações funcionam mesmo com o app fechado</li>
              <li>• Você pode personalizar os horários conforme sua rotina</li>
              <li>• Marcos especiais são celebrados automaticamente</li>
              <li>• Use o teste para verificar se está funcionando</li>
              <li>• Lembretes de emergência ajudam em horários de risco</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}