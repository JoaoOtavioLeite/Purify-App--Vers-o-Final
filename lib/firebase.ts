import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!
}

// Inicializar Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Inicializar Firestore
export const db = getFirestore(app)

// Inicializar Analytics (apenas no cliente)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isAnalyticsSupported()) {
    return getAnalytics(app)
  }
  return null
}

// Inicializar Cloud Messaging
export const initMessaging = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getMessaging(app)
  }
  return null
}

// Solicitar permissão para notificações
export const requestNotificationPermission = async () => {
  try {
    if (typeof window === 'undefined') return null
    
    const messaging = await initMessaging()
    if (!messaging) return null

    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'demo-vapid-key'
      })
      console.log('FCM Token:', token)
      return token
    }
    return null
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error)
    return null
  }
}

// Escutar mensagens em foreground
export const onMessageListener = async (callback: (payload: any) => void) => {
  try {
    const messaging = await initMessaging()
    if (messaging) {
      return onMessage(messaging, callback)
    }
  } catch (error) {
    console.error('Erro ao escutar mensagens:', error)
  }
}

export default app 