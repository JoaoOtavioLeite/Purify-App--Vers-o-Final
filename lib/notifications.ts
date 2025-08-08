"use client"

// Sistema de Notificações para PWA
export class PWANotifications {
  private static instance: PWANotifications
  private permission: NotificationPermission = 'default'
  private isSupported = false
  private worker: ServiceWorker | null = null

  constructor() {
    this.checkSupport()
    this.getPermission()
  }

  static getInstance(): PWANotifications {
    if (!PWANotifications.instance) {
      PWANotifications.instance = new PWANotifications()
    }
    return PWANotifications.instance
  }

  private checkSupport() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator
  }

  private getPermission() {
    if (this.isSupported) {
      this.permission = Notification.permission
    }
  }

  // Solicitar permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notificações não são suportadas neste navegador')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    
    if (permission === 'granted') {
      this.setupServiceWorker()
      this.sendTestNotification()
      this.scheduleWelcomeNotifications()
      return true
    }

    return false
  }

  // Configurar Service Worker para notificações em background
  private async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        
        if (registration.installing) {
          this.worker = registration.installing
        } else if (registration.waiting) {
          this.worker = registration.waiting
        } else if (registration.active) {
          this.worker = registration.active
        }

        console.log('Service Worker registrado para notificações')
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error)
      }
    }
  }

  // Enviar notificação de teste
  private sendTestNotification() {
    this.sendNotification(
      'Purify - Notificações Ativadas! 🎉',
      'Você receberá lembretes motivacionais para te ajudar na sua jornada',
      '/192.png'
    )
  }

  // Enviar notificação local
  sendNotification(title: string, body: string, icon: string = '/192.png') {
    if (this.permission !== 'granted') {
      console.warn('Permissão para notificações não concedida')
      return
    }

    const options: NotificationOptions = {
      body,
      icon,
      badge: '/192.png',
      tag: 'purify-notification',
      requireInteraction: false,
      silent: false
    }

    new Notification(title, options)
  }

  // Agendar notificações de boas-vindas
  private scheduleWelcomeNotifications() {
    // Notificação após 1 hora
    setTimeout(() => {
      this.sendNotification(
        'Como você está se sentindo? 💙',
        'Que tal fazer um check-in de bem-estar? Sua jornada importa!',
        '/192.png'
      )
    }, 60 * 60 * 1000) // 1 hora

    // Notificação diária de motivação
    this.scheduleDailyMotivation()
  }

  // Agendar notificações diárias de motivação
  scheduleDailyMotivation() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0) // 9h da manhã

    const timeUntilTomorrow = tomorrow.getTime() - now.getTime()

    setTimeout(() => {
      this.sendDailyMotivation()
      // Reagendar para o próximo dia
      setInterval(() => {
        this.sendDailyMotivation()
      }, 24 * 60 * 60 * 1000) // A cada 24 horas
    }, timeUntilTomorrow)
  }

  // Enviar notificação diária de motivação
  private sendDailyMotivation() {
    const motivations = [
      {
        title: 'Bom dia, Guerreiro! ☀️',
        body: 'Um novo dia, uma nova oportunidade de crescer. Você consegue!'
      },
      {
        title: 'Força e Fé! 💪',
        body: 'Cada momento de resistência te torna mais forte. Continue firme!'
      },
      {
        title: 'Você é Especial! ⭐',
        body: 'Sua jornada de purificação inspira outros. Continue brilhando!'
      },
      {
        title: 'Progresso Diário! 📈',
        body: 'Pequenos passos levam a grandes vitórias. Que tal fazer seu check-in?'
      },
      {
        title: 'Mindfulness & Paz! 🧘‍♂️',
        body: 'Reserve um momento para respirar e conectar-se consigo mesmo hoje.'
      }
    ]

    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)]
    this.sendNotification(randomMotivation.title, randomMotivation.body)
  }

  // Notificação de parabéns por marco atingido
  sendMilestoneNotification(days: number) {
    let title = ''
    let body = ''
    
    if (days === 1) {
      title = 'Primeiro Dia Completo! 🥇'
      body = 'Parabéns! Você completou seu primeiro dia. Isso é só o começo!'
    } else if (days === 7) {
      title = 'Uma Semana Incrível! 🎉'
      body = 'Sete dias de força e determinação. Você está arrasando!'
    } else if (days === 30) {
      title = 'Um Mês Fantástico! 🏆'
      body = 'Trinta dias de purificação! Sua disciplina é inspiradora!'
    } else if (days === 90) {
      title = 'Três Meses de Vitória! 👑'
      body = 'Noventa dias! Você provou que tem o controle da sua vida!'
    } else if (days % 100 === 0) {
      title = `${days} Dias de Glória! 🌟`
      body = 'Você é um verdadeiro exemplo de perseverança e crescimento!'
    }

    if (title) {
      this.sendNotification(title, body)
    }
  }

  // Notificação de lembrete para check-in
  sendCheckinReminder() {
    this.sendNotification(
      'Hora do Check-in! 📋',
      'Como você está hoje? Faça seu check-in de bem-estar!',
      '/192.png'
    )
  }

  // Notificação de emergência (para uso em momentos difíceis)
  sendEmergencySupport() {
    this.sendNotification(
      'Você é Mais Forte! 🛡️',
      'Momentos difíceis passam. Respire fundo e lembre-se do seu porquê.',
      '/192.png'
    )
  }

  // Verificar se notificações estão habilitadas
  isEnabled(): boolean {
    return this.permission === 'granted'
  }

  // Desabilitar notificações
  disable() {
    // Note: Não é possível revogar permissão programaticamente
    // O usuário deve fazer isso manualmente nas configurações do navegador
    localStorage.setItem('notifications_disabled', 'true')
  }

  // Verificar se foi desabilitado pelo usuário
  isDisabledByUser(): boolean {
    return localStorage.getItem('notifications_disabled') === 'true'
  }
}

// Instância global
export const notifications = PWANotifications.getInstance()

// Hook para React
export function useNotifications() {
  return {
    notifications,
    requestPermission: () => notifications.requestPermission(),
    isEnabled: () => notifications.isEnabled(),
    sendMilestone: (days: number) => notifications.sendMilestoneNotification(days),
    sendCheckinReminder: () => notifications.sendCheckinReminder(),
    sendEmergencySupport: () => notifications.sendEmergencySupport(),
    disable: () => notifications.disable(),
    isDisabledByUser: () => notifications.isDisabledByUser()
  }
}
