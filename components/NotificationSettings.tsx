"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  BellOff, 
  Clock, 
  Settings, 
  Check, 
  X, 
  Volume2,
  VolumeX,
  Smartphone,
  AlertCircle,
  TestTube,
  Trophy,
  Star
} from "lucide-react"
import { useNotifications, NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications"
import { useHaptics } from "@/lib/haptics"

interface NotificationSettingsProps {
  onClose?: () => void
}

export function NotificationSettings({ onClose }: NotificationSettingsProps) {
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

  const handleToggleMilestones = async () => {
    const newSettings = {
      ...settings,
      milestones: !settings.milestones
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-3xl">
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
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Smartphone size={18} />
              Status das Notificações
            </h3>
            
            {!notifications.isAvailable() ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={20} />
                  <div>
                    <p className="font-medium text-red-800">Não Suportado</p>
                    <p className="text-red-600 text-sm">Este dispositivo não suporta notificações push.</p>
                  </div>
                </div>
              </div>
            ) : settings.permission === 'denied' ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <BellOff className="text-red-500" size={20} />
                  <div>
                    <p className="font-medium text-red-800">Permissão Negada</p>
                    <p className="text-red-600 text-sm">Ative nas configurações do navegador.</p>
                  </div>
                </div>
              </div>
            ) : settings.permission === 'granted' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-green-800">Ativo</p>
                    <p className="text-green-600 text-sm">Notificações configuradas e funcionando.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="text-yellow-600" size={20} />
                    <div>
                      <p className="font-medium text-yellow-800">Permissão Necessária</p>
                      <p className="text-yellow-700 text-sm">Permita notificações para receber lembretes.</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleRequestPermission}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all native-button-press flex items-center justify-center gap-2"
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
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Clock size={18} />
                  Horários Diários
                </h3>
                
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div key={slot.key} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-800">{slot.label}</p>
                          <p className="text-gray-600 text-sm">{slot.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleTime(slot.key)}
                          className={`w-12 h-6 rounded-full transition-all ${
                            settings[slot.key].enabled
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
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
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notificações de Marcos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Trophy size={18} />
                  Marcos de Progresso
                </h3>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">🎯 Conquistas Diárias</p>
                      <p className="text-gray-600 text-sm">Receba parabéns ao completar cada dia</p>
                    </div>
                    <button
                      onClick={handleToggleMilestones}
                      className={`w-12 h-6 rounded-full transition-all ${
                        settings.milestones
                          ? 'bg-purple-500'
                          : 'bg-gray-300'
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
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Star size={18} />
                  Notificações Avançadas
                </h3>
                
                <div className="space-y-3">
                  {/* Relatórios Semanais */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">📊 Relatórios Semanais</p>
                        <p className="text-gray-600 text-sm">Resumo do progresso aos domingos</p>
                      </div>
                      <button
                        onClick={() => handleToggleAdvanced('weeklyReports')}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.weeklyReports
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.weeklyReports ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Citações Motivacionais */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">💬 Citações Motivacionais</p>
                        <p className="text-gray-600 text-sm">Inspiração 3x por dia</p>
                      </div>
                      <button
                        onClick={() => handleToggleAdvanced('motivationalQuotes')}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.motivationalQuotes
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.motivationalQuotes ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Lembretes de Emergência */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">🚨 Lembretes de Emergência</p>
                        <p className="text-gray-600 text-sm">Alertas em horários de risco</p>
                      </div>
                      <button
                        onClick={() => handleToggleAdvanced('emergencyReminders')}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.emergencyReminders
                            ? 'bg-red-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.emergencyReminders ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Rastreamento de Hábitos */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">📝 Rastreamento de Hábitos</p>
                        <p className="text-gray-600 text-sm">Check-ins regulares do dia</p>
                      </div>
                      <button
                        onClick={() => handleToggleAdvanced('habitTracking')}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.habitTracking
                            ? 'bg-indigo-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.habitTracking ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Lembretes Espirituais */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">🙏 Lembretes Espirituais</p>
                        <p className="text-gray-600 text-sm">Oração e leitura bíblica</p>
                      </div>
                      <button
                        onClick={() => handleToggleAdvanced('spiritualReminders')}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.spiritualReminders
                            ? 'bg-purple-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.spiritualReminders ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Especiais de Fim de Semana */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">🎉 Especiais de Fim de Semana</p>
                        <p className="text-gray-600 text-sm">Mensagens especiais sexta/sábado/domingo</p>
                      </div>
                      <button
                        onClick={() => handleToggleAdvanced('weekendSpecial')}
                        className={`w-12 h-6 rounded-full transition-all ${
                          settings.weekendSpecial
                            ? 'bg-orange-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.weekendSpecial ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teste de Notificação */}
              <div className="space-y-3">
                <button
                  onClick={handleTestNotification}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all native-button-press flex items-center justify-center gap-2"
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
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-800 text-sm font-medium text-center">{testMessage}</p>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
              <Star size={16} />
              💡 Dicas
            </h4>
            <ul className="text-emerald-700 text-sm space-y-1">
              <li>• As notificações funcionam mesmo com o app fechado</li>
              <li>• Você pode personalizar os horários conforme sua rotina</li>
              <li>• Marcos especiais são celebrados automaticamente</li>
              <li>• Use o teste para verificar se está funcionando</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
