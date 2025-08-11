/**
 * Sistema de Notificações Push - Purify App
 * Gerencia permissões, agendamento e configurações de notificações
 */

export interface NotificationTime {
  time: string // HH:MM format
  enabled: boolean
  label: string
}

export interface NotificationSettings {
  morning: NotificationTime
  afternoon: NotificationTime
  evening: NotificationTime
  night: NotificationTime
  milestones: boolean
  permission: NotificationPermission
}

// Configurações padrão de notificações
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  morning: {
    time: '08:00',
    enabled: true,
    label: 'Manhã (Motivação)'
  },
  afternoon: {
    time: '14:00',
    enabled: true,
    label: 'Tarde (Check-in)'
  },
  evening: {
    time: '19:00',
    enabled: true,
    label: 'Noite (Força Final)'
  },
  night: {
    time: '22:00',
    enabled: true,
    label: 'Boa Noite (Celebração)'
  },
  milestones: true,
  permission: 'default'
}

export class NotificationManager {
  private static instance: NotificationManager
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null
  private settings: NotificationSettings

  private constructor() {
    this.settings = this.loadSettings()
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  // Inicializar sistema de notificações
  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        console.log('🚫 Service Workers não suportados')
        return false
      }

      // Registrar service worker específico para notificações
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw-notifications.js', {
        scope: '/'
      })

      console.log('🔔 Service Worker de notificações registrado')

      // Verificar permissão atual
      this.settings.permission = Notification.permission

      // Se já tiver permissão, configurar notificações
      if (this.settings.permission === 'granted') {
        await this.scheduleAllNotifications()
      }

      return true
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error)
      return false
    }
  }

  // Solicitar permissão de notificações
  async requestPermission(): Promise<NotificationPermission> {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.log('🚫 Notificações não suportadas neste dispositivo')
        return 'denied'
      }

      const permission = await Notification.requestPermission()
      this.settings.permission = permission
      this.saveSettings()

      if (permission === 'granted') {
        console.log('✅ Permissão de notificações concedida')
        await this.scheduleAllNotifications()
      } else {
        console.log('🚫 Permissão de notificações negada')
      }

      return permission
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error)
      return 'denied'
    }
  }

  // Verificar se notificações estão disponíveis
  isAvailable(): boolean {
    return typeof window !== 'undefined' && 
           'Notification' in window && 
           'serviceWorker' in navigator
  }

  // Verificar se permissão foi concedida
  hasPermission(): boolean {
    return this.settings.permission === 'granted'
  }

  // Obter configurações atuais
  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  // Atualizar configurações
  async updateSettings(newSettings: Partial<NotificationSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings }
    this.saveSettings()

    if (this.hasPermission()) {
      await this.scheduleAllNotifications()
    }
  }

  // Agendar todas as notificações
  async scheduleAllNotifications(): Promise<void> {
    try {
      if (!this.serviceWorkerRegistration || !this.hasPermission()) {
        console.log('🚫 Não é possível agendar - sem permissão ou SW')
        return
      }

      // Enviar configurações para o service worker
      this.serviceWorkerRegistration.active?.postMessage({
        type: 'SCHEDULE_DAILY_NOTIFICATIONS',
        data: {
          times: {
            morning: this.settings.morning,
            afternoon: this.settings.afternoon,
            evening: this.settings.evening,
            night: this.settings.night
          }
        }
      })

      console.log('📅 Notificações diárias reagendadas')
    } catch (error) {
      console.error('❌ Erro ao agendar notificações:', error)
    }
  }

  // Agendar notificação de marco (dias completos)
  async scheduleMilestoneNotification(currentDays: number): Promise<void> {
    try {
      if (!this.serviceWorkerRegistration || !this.hasPermission() || !this.settings.milestones) {
        return
      }

      this.serviceWorkerRegistration.active?.postMessage({
        type: 'SCHEDULE_MILESTONE_NOTIFICATION',
        data: { days: currentDays }
      })

      console.log(`🎯 Notificação de marco agendada para ${currentDays + 1} dias`)
    } catch (error) {
      console.error('❌ Erro ao agendar marco:', error)
    }
  }

  // Enviar notificação de teste
  async sendTestNotification(): Promise<void> {
    try {
      if (!this.hasPermission()) {
        throw new Error('Sem permissão para notificações')
      }

      const registration = await navigator.serviceWorker.ready
      await registration.showNotification('🧪 Teste - Purify', {
        body: 'Esta é uma notificação de teste! O sistema está funcionando perfeitamente.',
        icon: '/192.png',
        badge: '/72.png',
        tag: 'purify-test',
        data: { type: 'test' },
        actions: [
          { action: 'open', title: '✨ Abrir App' }
        ],
        vibrate: [200, 100, 200]
      })

      console.log('🧪 Notificação de teste enviada')
    } catch (error) {
      console.error('❌ Erro ao enviar teste:', error)
      throw error
    }
  }

  // Carregar configurações do localStorage
  private loadSettings(): NotificationSettings {
    try {
      if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS

      const saved = localStorage.getItem('notificationSettings')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...parsed }
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error)
    }

    return DEFAULT_NOTIFICATION_SETTINGS
  }

  // Salvar configurações no localStorage
  private saveSettings(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('notificationSettings', JSON.stringify(this.settings))
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error)
    }
  }
}

// Hook para usar o sistema de notificações
export const useNotifications = () => {
  const manager = NotificationManager.getInstance()

  return {
    initialize: () => manager.initialize(),
    requestPermission: () => manager.requestPermission(),
    isAvailable: () => manager.isAvailable(),
    hasPermission: () => manager.hasPermission(),
    getSettings: () => manager.getSettings(),
    updateSettings: (settings: Partial<NotificationSettings>) => 
      manager.updateSettings(settings),
    scheduleAllNotifications: () => manager.scheduleAllNotifications(),
    scheduleMilestoneNotification: (days: number) => 
      manager.scheduleMilestoneNotification(days),
    sendTestNotification: () => manager.sendTestNotification()
  }
}