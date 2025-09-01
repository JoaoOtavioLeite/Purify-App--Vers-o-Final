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

// Citações motivacionais
const MOTIVATIONAL_QUOTES = [
  {
    title: '💪 Força Interior',
    body: 'Você é mais forte do que qualquer tentação. Confie na sua capacidade de resistir!'
  },
  {
    title: '🌱 Crescimento',
    body: 'Cada "não" que você diz à tentação é um "sim" para sua nova vida.'
  },
  {
    title: '🎯 Foco no Objetivo',
    body: 'Lembre-se do motivo pelo qual você começou. Sua liberdade vale cada esforço!'
  },
  {
    title: '🔥 Determinação',
    body: 'Você já chegou tão longe! Não deixe que alguns minutos destruam dias de progresso.'
  },
  {
    title: '✨ Transformação',
    body: 'Você está se tornando a melhor versão de si mesmo. Continue nessa jornada!'
  }
]

// Lembretes de emergência
const EMERGENCY_REMINDERS = [
  {
    title: '🚨 Momento de Atenção!',
    body: 'Este é um horário de risco. Respire fundo e lembre-se dos seus objetivos!'
  },
  {
    title: '🛡️ Proteção Ativa',
    body: 'Hora de usar suas estratégias de proteção. Você consegue superar isso!'
  },
  {
    title: '⚡ Força Agora',
    body: 'Momento crítico! Faça algo diferente: exercite-se, ore ou chame alguém.'
  }
]

// Rastreamento de hábitos
const HABIT_TRACKING = [
  {
    title: '📝 Check-in Diário',
    body: 'Como está seu dia? Registre seu progresso e sentimentos no app.'
  },
  {
    title: '🎯 Hábitos Saudáveis',
    body: 'Que tal praticar um hábito positivo agora? Exercício, leitura ou meditação?'
  },
  {
    title: '📊 Reflexão do Dia',
    body: 'Momento de refletir: o que funcionou bem hoje? O que pode melhorar?'
  }
]

// Lembretes espirituais
const SPIRITUAL_REMINDERS = [
  {
    title: '🙏 Momento de Oração',
    body: 'Pare alguns minutos para conversar com Deus. Ele está sempre pronto a te ouvir.'
  },
  {
    title: '📖 Palavra de Vida',
    body: 'Que tal ler um versículo bíblico? A Palavra de Deus fortalece sua alma.'
  },
  {
    title: '✨ Gratidão',
    body: 'Pense em 3 coisas pelas quais você é grato hoje. Deus tem sido bom!'
  },
  {
    title: '⛪ Comunhão',
    body: 'Lembre-se de buscar comunhão com outros cristãos. Juntos somos mais fortes!'
  }
]

// Notificações especiais de fim de semana
const WEEKEND_SPECIALS = [
  {
    type: 'friday',
    title: '🎉 Sexta-feira Vitoriosa!',
    body: 'Mais uma semana de conquistas! Comemore suas vitórias e descanse bem.'
  },
  {
    type: 'saturday',
    title: '🌅 Sábado de Renovação',
    body: 'Use este dia para renovar suas forças. Tempo com Deus e descanso são essenciais!'
  },
  {
    type: 'sunday',
    title: '⛪ Domingo Abençoado',
    body: 'Dia especial para adoração e preparação para uma nova semana de vitórias!'
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
    case 'SCHEDULE_WEEKLY_REPORT':
      scheduleWeeklyReport(data.day, data.time)
      break
    case 'SCHEDULE_MOTIVATIONAL_QUOTES':
      scheduleMotivationalQuotes(data.intervals, data.randomize)
      break
    case 'SCHEDULE_EMERGENCY_REMINDERS':
      scheduleEmergencyReminders(data.riskyHours)
      break
    case 'SCHEDULE_HABIT_TRACKING':
      scheduleHabitTracking(data.checkInTimes, data.weeklyReview)
      break
    case 'SCHEDULE_SPIRITUAL_REMINDERS':
      scheduleSpiritualReminders(data.prayerTimes, data.bibleReading, data.worship)
      break
    case 'SCHEDULE_WEEKEND_SPECIALS':
      scheduleWeekendSpecials(data.fridayEvening, data.saturdayMorning, data.sundayEvening)
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

// Função para agendar relatório semanal
function scheduleWeeklyReport(day, time) {
  const now = new Date()
  const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day.toLowerCase())
  
  if (targetDay === -1) return
  
  const nextDate = new Date(now)
  const currentDay = nextDate.getDay()
  const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7
  
  nextDate.setDate(nextDate.getDate() + daysUntilTarget)
  const [hours, minutes] = time.split(':').map(Number)
  nextDate.setHours(hours, minutes, 0, 0)
  
  const delay = nextDate.getTime() - now.getTime()
  
  setTimeout(() => {
    self.registration.showNotification('📊 Relatório Semanal', {
      body: 'Veja seu progresso da semana e planeje os próximos dias!',
      icon: '/192.png',
      badge: '/72.png',
      tag: 'purify-weekly-report',
      data: { type: 'weekly-report' },
      actions: [
        { action: 'view-stats', title: '📊 Ver Estatísticas' },
        { action: 'plan-week', title: '📅 Planejar Semana' }
      ],
      vibrate: [200, 100, 200]
    })
    
    // Reagendar para próxima semana
    setInterval(() => {
      self.registration.showNotification('📊 Relatório Semanal', {
        body: 'Veja seu progresso da semana e planeje os próximos dias!',
        icon: '/192.png',
        badge: '/72.png',
        tag: 'purify-weekly-report',
        data: { type: 'weekly-report' },
        actions: [
          { action: 'view-stats', title: '📊 Ver Estatísticas' },
          { action: 'plan-week', title: '📅 Planejar Semana' }
        ],
        vibrate: [200, 100, 200]
      })
    }, 7 * 24 * 60 * 60 * 1000) // 7 dias
  }, delay)
  
  console.log(`📊 Relatório semanal agendado para ${day} às ${time}`)
}

// Função para agendar citações motivacionais
function scheduleMotivationalQuotes(intervals, randomize) {
  intervals.forEach((time, index) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const [hours, minutes] = time.split(':').map(Number)
    const notificationTime = new Date(today)
    notificationTime.setHours(hours, minutes, 0, 0)
    
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1)
    }
    
    const delay = notificationTime.getTime() - now.getTime()
    
    setTimeout(() => {
      const sendQuote = () => {
        const quote = randomize 
          ? MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
          : MOTIVATIONAL_QUOTES[index % MOTIVATIONAL_QUOTES.length]
        
        self.registration.showNotification(quote.title, {
          body: quote.body,
          icon: '/192.png',
          badge: '/72.png',
          tag: `purify-quote-${time.replace(':', '')}`,
          data: { type: 'motivational-quote' },
          actions: [
            { action: 'share-quote', title: '📱 Compartilhar' },
            { action: 'more-motivation', title: '💪 Mais Motivação' }
          ],
          vibrate: [100, 50, 100]
        })
      }
      
      sendQuote()
      
      // Reagendar para todos os dias
      setInterval(sendQuote, 24 * 60 * 60 * 1000)
    }, delay)
  })
  
  console.log('💬 Citações motivacionais agendadas para:', intervals)
}

// Função para agendar lembretes de emergência
function scheduleEmergencyReminders(riskyHours) {
  riskyHours.forEach(time => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const [hours, minutes] = time.split(':').map(Number)
    const notificationTime = new Date(today)
    notificationTime.setHours(hours, minutes, 0, 0)
    
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1)
    }
    
    const delay = notificationTime.getTime() - now.getTime()
    
    setTimeout(() => {
      const sendReminder = () => {
        const reminder = EMERGENCY_REMINDERS[Math.floor(Math.random() * EMERGENCY_REMINDERS.length)]
        
        self.registration.showNotification(reminder.title, {
          body: reminder.body,
          icon: '/192.png',
          badge: '/72.png',
          tag: `purify-emergency-${time.replace(':', '')}`,
          data: { type: 'emergency-reminder' },
          actions: [
            { action: 'sos', title: '🚨 SOS' },
            { action: 'distract', title: '🎯 Distrair-me' }
          ],
          requireInteraction: true,
          vibrate: [300, 100, 300, 100, 300]
        })
      }
      
      sendReminder()
      
      // Reagendar para todos os dias
      setInterval(sendReminder, 24 * 60 * 60 * 1000)
    }, delay)
  })
  
  console.log('🚨 Lembretes de emergência agendados para:', riskyHours)
}

// Função para agendar rastreamento de hábitos
function scheduleHabitTracking(checkInTimes, weeklyReview) {
  checkInTimes.forEach((time, index) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const [hours, minutes] = time.split(':').map(Number)
    const notificationTime = new Date(today)
    notificationTime.setHours(hours, minutes, 0, 0)
    
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1)
    }
    
    const delay = notificationTime.getTime() - now.getTime()
    
    setTimeout(() => {
      const sendTracking = () => {
        const tracking = HABIT_TRACKING[index % HABIT_TRACKING.length]
        
        self.registration.showNotification(tracking.title, {
          body: tracking.body,
          icon: '/192.png',
          badge: '/72.png',
          tag: `purify-habit-${time.replace(':', '')}`,
          data: { type: 'habit-tracking' },
          actions: [
            { action: 'log-mood', title: '😊 Registrar Humor' },
            { action: 'track-habits', title: '✅ Marcar Hábitos' }
          ],
          vibrate: [150, 100, 150]
        })
      }
      
      sendTracking()
      
      // Reagendar para todos os dias
      setInterval(sendTracking, 24 * 60 * 60 * 1000)
    }, delay)
  })
  
  console.log('📝 Rastreamento de hábitos agendado para:', checkInTimes)
}

// Função para agendar lembretes espirituais
function scheduleSpiritualReminders(prayerTimes, bibleReading, worship) {
  // Agendar horários de oração
  prayerTimes.forEach((time, index) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const [hours, minutes] = time.split(':').map(Number)
    const notificationTime = new Date(today)
    notificationTime.setHours(hours, minutes, 0, 0)
    
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1)
    }
    
    const delay = notificationTime.getTime() - now.getTime()
    
    setTimeout(() => {
      const sendSpiritual = () => {
        const spiritual = SPIRITUAL_REMINDERS[index % SPIRITUAL_REMINDERS.length]
        
        self.registration.showNotification(spiritual.title, {
          body: spiritual.body,
          icon: '/192.png',
          badge: '/72.png',
          tag: `purify-spiritual-${time.replace(':', '')}`,
          data: { type: 'spiritual-reminder' },
          actions: [
            { action: 'pray', title: '🙏 Orar Agora' },
            { action: 'read-bible', title: '📖 Ler Bíblia' }
          ],
          vibrate: [200, 100, 200]
        })
      }
      
      sendSpiritual()
      
      // Reagendar para todos os dias
      setInterval(sendSpiritual, 24 * 60 * 60 * 1000)
    }, delay)
  })
  
  console.log('🙏 Lembretes espirituais agendados para:', prayerTimes)
}

// Função para agendar notificações especiais de fim de semana
function scheduleWeekendSpecials(fridayEvening, saturdayMorning, sundayEvening) {
  const scheduleWeekendNotification = (dayIndex, time, specialType) => {
    const now = new Date()
    const currentDay = now.getDay()
    const daysUntilTarget = (dayIndex - currentDay + 7) % 7
    
    const targetDate = new Date(now)
    targetDate.setDate(targetDate.getDate() + daysUntilTarget)
    const [hours, minutes] = time.split(':').map(Number)
    targetDate.setHours(hours, minutes, 0, 0)
    
    if (targetDate <= now) {
      targetDate.setDate(targetDate.getDate() + 7)
    }
    
    const delay = targetDate.getTime() - now.getTime()
    
    setTimeout(() => {
      const sendWeekendSpecial = () => {
        const special = WEEKEND_SPECIALS.find(s => s.type === specialType)
        
        if (special) {
          self.registration.showNotification(special.title, {
            body: special.body,
            icon: '/192.png',
            badge: '/72.png',
            tag: `purify-weekend-${specialType}`,
            data: { type: 'weekend-special', specialType },
            actions: [
              { action: 'celebrate', title: '🎉 Celebrar' },
              { action: 'plan', title: '📅 Planejar' }
            ],
            vibrate: [200, 100, 200, 100, 200]
          })
        }
      }
      
      sendWeekendSpecial()
      
      // Reagendar para próxima semana
      setInterval(sendWeekendSpecial, 7 * 24 * 60 * 60 * 1000)
    }, delay)
  }
  
  // Sexta à noite (5), Sábado de manhã (6), Domingo à noite (0)
  scheduleWeekendNotification(5, fridayEvening, 'friday')
  scheduleWeekendNotification(6, saturdayMorning, 'saturday')
  scheduleWeekendNotification(0, sundayEvening, 'sunday')
  
  console.log('🎉 Notificações especiais de fim de semana agendadas')
}

console.log('🔔 Service Worker de Notificações carregado')
