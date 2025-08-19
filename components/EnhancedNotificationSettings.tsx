"use client"

import { useState, useEffect } from "react"
import { Bell, X, Clock, Star, Shield, Heart, Zap, Calendar } from "lucide-react"
import { useHaptics } from "@/lib/haptics"

interface NotificationSettings {
  enabled: boolean
  dailyMotivation: {
    enabled: boolean
    time: string
  }
  milestoneAlerts: boolean
  checkInReminders: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'custom'
    times: string[]
  }
  crisisSupport: boolean
  weeklyReports: boolean
  customReminders: Array<{
    id: string
    title: string
    time: string
    days: number[] // 0-6 (Sunday-Saturday)
    enabled: boolean
  }>
}

interface Props {
  onClose: () => void
}

export function EnhancedNotificationSettings({ onClose }: Props) {
  const haptics = useHaptics()
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyMotivation: {
      enabled: true,
      time: "08:00"
    },
    milestoneAlerts: true,
    checkInReminders: {
      enabled: true,
      frequency: 'daily',
      times: ["12:00", "18:00"]
    },
    crisisSupport: true,
    weeklyReports: true,
    customReminders: []
  })

  // Carregar configurações salvas
  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings')
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved)
        setSettings(prev => ({ ...prev, ...parsedSettings }))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
  }, [])

  // Salvar configurações
  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
    haptics.success()
  }

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        saveSettings({ ...settings, enabled: true })
        haptics.success()
        
        // Enviar notificação de teste
        new Notification('🎉 Notificações Ativadas!', {
          body: 'Você receberá lembretes motivacionais para sua jornada de purificação.',
          icon: '/192.png',
          tag: 'test-notification'
        })
      } else {
        haptics.error()
      }
    }
  }

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    saveSettings(newSettings)
  }

  const updateNestedSetting = (parent: keyof NotificationSettings, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [parent]: {
        ...(settings[parent] as any),
        [key]: value
      }
    }
    saveSettings(newSettings)
  }

  const addCustomReminder = () => {
    const newReminder = {
      id: Date.now().toString(),
      title: "Lembrete personalizado",
      time: "15:00",
      days: [1, 2, 3, 4, 5], // Segunda a sexta
      enabled: true
    }
    
    const newSettings = {
      ...settings,
      customReminders: [...settings.customReminders, newReminder]
    }
    saveSettings(newSettings)
  }

  const removeCustomReminder = (id: string) => {
    const newSettings = {
      ...settings,
      customReminders: settings.customReminders.filter(r => r.id !== id)
    }
    saveSettings(newSettings)
    haptics.light()
  }

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Notificações</h2>
                <p className="text-blue-100 text-sm">Configure seus lembretes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          
          {/* Permission Status */}
          {!settings.enabled && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="text-blue-600 dark:text-blue-400" size={20} />
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Ativar Notificações</h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                Permita notificações para receber lembretes motivacionais e acompanhar seu progresso.
              </p>
              <button
                onClick={requestPermission}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
              >
                Permitir Notificações
              </button>
            </div>
          )}

          {/* Daily Motivation */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-500" size={20} />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Motivação Diária</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyMotivation.enabled}
                  onChange={(e) => updateNestedSetting('dailyMotivation', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {settings.dailyMotivation.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Horário da mensagem motivacional
                </label>
                <input
                  type="time"
                  value={settings.dailyMotivation.time}
                  onChange={(e) => updateNestedSetting('dailyMotivation', 'time', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200"
                />
              </div>
            )}
          </div>

          {/* Milestone Alerts */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-purple-500" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Alertas de Marcos</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Notificar quando atingir marcos importantes</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.milestoneAlerts}
                  onChange={(e) => updateSetting('milestoneAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {/* Check-in Reminders */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Heart className="text-pink-500" size={20} />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Lembretes de Check-in</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.checkInReminders.enabled}
                  onChange={(e) => updateNestedSetting('checkInReminders', 'enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
              </label>
            </div>
            {settings.checkInReminders.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Horários de check-in
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {settings.checkInReminders.times.map((time, index) => (
                      <input
                        key={index}
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...settings.checkInReminders.times]
                          newTimes[index] = e.target.value
                          updateNestedSetting('checkInReminders', 'times', newTimes)
                        }}
                        className="bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crisis Support */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-red-500" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Suporte de Emergência</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Lembretes sobre recursos SOS disponíveis</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.crisisSupport}
                  onChange={(e) => updateSetting('crisisSupport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>

          {/* Weekly Reports */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="text-green-500" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Relatórios Semanais</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Resumo semanal do seu progresso</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => updateSetting('weeklyReports', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Custom Reminders */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="text-indigo-500" size={20} />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Lembretes Personalizados</h3>
              </div>
              <button
                onClick={addCustomReminder}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded-lg transition-colors"
              >
                Adicionar
              </button>
            </div>
            
            {settings.customReminders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                Nenhum lembrete personalizado ainda. Toque em "Adicionar" para criar um.
              </p>
            ) : (
              <div className="space-y-3">
                {settings.customReminders.map((reminder) => (
                  <div key={reminder.id} className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={reminder.title}
                        onChange={(e) => {
                          const newReminders = settings.customReminders.map(r =>
                            r.id === reminder.id ? { ...r, title: e.target.value } : r
                          )
                          updateSetting('customReminders', newReminders)
                        }}
                        className="bg-transparent border-none text-gray-800 dark:text-gray-200 font-medium text-sm focus:outline-none"
                        placeholder="Título do lembrete"
                      />
                      <button
                        onClick={() => removeCustomReminder(reminder.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="time"
                        value={reminder.time}
                        onChange={(e) => {
                          const newReminders = settings.customReminders.map(r =>
                            r.id === reminder.id ? { ...r, time: e.target.value } : r
                          )
                          updateSetting('customReminders', newReminders)
                        }}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-xs text-gray-800 dark:text-gray-200"
                      />
                    </div>
                    <div className="flex gap-1">
                      {dayNames.map((day, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const newDays = reminder.days.includes(index)
                              ? reminder.days.filter(d => d !== index)
                              : [...reminder.days, index]
                            const newReminders = settings.customReminders.map(r =>
                              r.id === reminder.id ? { ...r, days: newDays } : r
                            )
                            updateSetting('customReminders', newReminders)
                          }}
                          className={`w-8 h-6 text-xs rounded transition-colors ${
                            reminder.days.includes(index)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Notification */}
          {settings.enabled && (
            <button
              onClick={() => {
                new Notification('🎯 Lembrete de Teste', {
                  body: 'Suas notificações estão funcionando perfeitamente! Continue firme na sua jornada.',
                  icon: '/192.png',
                  tag: 'test-notification'
                })
                haptics.success()
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all hover:shadow-lg"
            >
              Testar Notificação
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

