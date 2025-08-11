/**
 * Service Worker para Notificações Push - Purify App
 * Gerencia notificações em background mesmo com app fechado
 */

const CACHE_NAME = 'purify-notifications-v1'
const NOTIFICATION_TAG = 'purify-daily'

// Notificações motivacionais diárias
const DAILY_NOTIFICATIONS = [
  {
    id: 'morning',
    title: '🌅 Bom dia, Guerreiro!',
    body: 'Mais um dia para fortalecer sua jornada. Você consegue!',
    icon: '/192.png',
    badge: '/72.png',
    tag: 'purify-morning',
    data: { type: 'daily', time: 'morning' },
    actions: [
      { action: 'open', title: '✨ Abrir App' },
      { action: 'motivate', title: '💪 Ver Motivação' }
    ]
  },
  {
    id: 'afternoon',
    title: '☀️ Força na Caminhada!',
    body: 'Como está sua tarde? Lembre-se: cada momento resistindo é uma vitória.',
    icon: '/192.png',
    badge: '/72.png',
    tag: 'purify-afternoon',
    data: { type: 'daily', time: 'afternoon' },
    actions: [
      { action: 'open', title: '📊 Ver Progresso' },
      { action: 'sos', title: '🚨 Preciso de Ajuda' }
    ]
  },
  {
    id: 'evening',
    title: '🌆 Reta Final do Dia!',
    body: 'Você está quase completando mais um dia limpo. Continue firme!',
    icon: '/192.png',
    badge: '/72.png',
    tag: 'purify-evening',
    data: { type: 'daily', time: 'evening' },
    actions: [
      { action: 'open', title: '🏆 Ver Conquistas' },
      { action: 'reflect', title: '🙏 Reflexão' }
    ]
  },
  {
    id: 'night',
    title: '🌙 Boa Noite, Vencedor!',
    body: 'Mais um dia de vitória! Descanse em paz sabendo que você venceu hoje.',
    icon: '/192.png',
    badge: '/72.png',
    tag: 'purify-night',
    data: { type: 'daily', time: 'night' },
    actions: [
      { action: 'open', title: '✨ Celebrar' },
      { action: 'gratitude', title: '🙏 Gratidão' }
    ]
  }
]

// Mensagens para marcos diários
const MILESTONE_MESSAGES = [
  {
    days: 1,
    title: '🎉 Primeiro Dia Completo!',
    body: 'Parabéns! Você completou seu primeiro dia limpo. O começo é sempre o mais difícil!'
  },
  {
    days: 3,
    title: '🔥 3 Dias Conquistados!',
    body: 'Incrível! Três dias seguidos. Sua força de vontade está crescendo!'
  },
  {
    days: 7,
    title: '👑 Uma Semana de Vitórias!',
    body: 'WOW! Uma semana inteira! Você provou que consegue. Continue assim!'
  },
  {
    days: 14,
    title: '💎 Duas Semanas Limpas!',
    body: 'Fantástico! 14 dias de transformação. Você está mudando sua vida!'
  },
  {
    days: 30,
    title: '🚀 UM MÊS DE SUPERAÇÃO!',
    body: 'INCRÍVEL! 30 dias limpos! Você já não é mais a mesma pessoa. Que orgulho!'
  },
  {
    days: 60,
    title: '🏆 2 MESES DE PUREZA!',
    body: 'EXTRAORDINÁRIO! 60 dias! Você está no caminho da transformação total!'
  },
  {
    days: 90,
    title: '🌟 3 MESES DE NOVA VIDA!',
    body: 'FENOMENAL! 90 dias! Você reconstruiu completamente seus hábitos!'
  }
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔔 Service Worker de Notificações instalado')
  self.skipWaiting()
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔔 Service Worker de Notificações ativado')
  event.waitUntil(self.clients.claim())
})

// Listener para mensagens do app principal
self.addEventListener('message', (event) => {
  const { type, data } = event.data

  switch (type) {
    case 'SCHEDULE_DAILY_NOTIFICATIONS':
      scheduleDailyNotifications(data.times)
      break
    case 'SCHEDULE_MILESTONE_NOTIFICATION':
      scheduleMilestoneNotification(data.days)
      break
    case 'CANCEL_ALL_NOTIFICATIONS':
      cancelAllNotifications()
      break
    case 'GET_SCHEDULED_NOTIFICATIONS':
      getScheduledNotifications().then(notifications => {
        event.ports[0].postMessage({ notifications })
      })
      break
  }
})

// Função para agendar notificações diárias
async function scheduleDailyNotifications(times) {
  try {
    // Cancelar notificações anteriores
    const existingNotifications = await self.registration.getNotifications()
    existingNotifications.forEach(notification => {
      if (notification.tag.startsWith('purify-')) {
        notification.close()
      }
    })

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    DAILY_NOTIFICATIONS.forEach((notification, index) => {
      const timeKey = notification.id // 'morning', 'afternoon', etc.
      const timeConfig = times[timeKey]
      
      if (timeConfig && timeConfig.enabled) {
        const [hours, minutes] = timeConfig.time.split(':').map(Number)
        const notificationTime = new Date(today)
        notificationTime.setHours(hours, minutes, 0, 0)

        // Se o horário já passou hoje, agendar para amanhã
        if (notificationTime <= now) {
          notificationTime.setDate(notificationTime.getDate() + 1)
        }

        const delay = notificationTime.getTime() - now.getTime()

        setTimeout(() => {
          self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: notification.icon,
            badge: notification.badge,
            tag: notification.tag,
            data: notification.data,
            actions: notification.actions,
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
          })

          // Reagendar para o próximo dia
          setInterval(() => {
            if (isNotificationTimeEnabled(timeKey)) {
              self.registration.showNotification(notification.title, {
                body: notification.body,
                icon: notification.icon,
                badge: notification.badge,
                tag: notification.tag,
                data: notification.data,
                actions: notification.actions,
                requireInteraction: false,
                silent: false,
                vibrate: [200, 100, 200]
              })
            }
          }, 24 * 60 * 60 * 1000) // 24 horas
        }, delay)
      }
    })

    console.log('📅 Notificações diárias agendadas:', times)
  } catch (error) {
    console.error('❌ Erro ao agendar notificações diárias:', error)
  }
}

// Função para agendar notificação de marco
function scheduleMilestoneNotification(currentDays) {
  const milestone = MILESTONE_MESSAGES.find(m => m.days === currentDays + 1)
  
  if (milestone) {
    // Agendar para 00:01 do próximo dia
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 1, 0, 0) // 00:01

    const delay = tomorrow.getTime() - now.getTime()

    setTimeout(() => {
      self.registration.showNotification(milestone.title, {
        body: milestone.body,
        icon: '/192.png',
        badge: '/72.png',
        tag: `purify-milestone-${milestone.days}`,
        data: { type: 'milestone', days: milestone.days },
        actions: [
          { action: 'celebrate', title: '🎉 Celebrar' },
          { action: 'share', title: '📱 Compartilhar' }
        ],
        requireInteraction: true,
        silent: false,
        vibrate: [300, 100, 300, 100, 300]
      })
    }, delay)

    console.log(`🎯 Notificação de marco agendada para ${milestone.days} dias`)
  }
}

// Verificar se horário está habilitado (buscar do localStorage via mensagem)
function isNotificationTimeEnabled(timeKey) {
  // Esta função será melhorada para verificar configurações em tempo real
  return true // Por enquanto, assume que está habilitado
}

// Cancelar todas as notificações
async function cancelAllNotifications() {
  try {
    const notifications = await self.registration.getNotifications()
    notifications.forEach(notification => notification.close())
    console.log('🚫 Todas as notificações canceladas')
  } catch (error) {
    console.error('❌ Erro ao cancelar notificações:', error)
  }
}

// Obter notificações agendadas
async function getScheduledNotifications() {
  try {
    const notifications = await self.registration.getNotifications()
    return notifications.map(n => ({
      title: n.title,
      body: n.body,
      tag: n.tag,
      data: n.data
    }))
  } catch (error) {
    console.error('❌ Erro ao obter notificações:', error)
    return []
  }
}

// Listener para clique em notificações
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification
  const action = event.action
  const data = notification.data

  console.log('🔔 Notificação clicada:', { action, data })

  notification.close()

  // Determinar URL baseada na ação
  let targetUrl = '/'
  
  switch (action) {
    case 'motivate':
      targetUrl = '/motivacao'
      break
    case 'sos':
      targetUrl = '/emergencia'
      break
    case 'open':
      targetUrl = '/'
      break
    case 'reflect':
      targetUrl = '/bem-estar'
      break
    case 'celebrate':
    case 'share':
      targetUrl = '/estatistica'
      break
    default:
      if (data?.type === 'milestone') {
        targetUrl = '/gamificacao'
      } else {
        targetUrl = '/'
      }
  }

  // Abrir ou focar no app
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Verificar se já existe uma janela aberta
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      
      // Se não existe, abrir nova janela
      return self.clients.openWindow(targetUrl)
    })
  )

  // Enviar evento para analytics (opcional)
  if (data?.type) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'NOTIFICATION_CLICKED',
          data: { notificationType: data.type, action }
        })
      })
    })
  }
})

// Listener para fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Notificação fechada:', event.notification.tag)
})

console.log('🔔 Service Worker de Notificações carregado')
