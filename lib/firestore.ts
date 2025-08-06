import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Tipos
export interface UserProgress {
  id?: string
  addiction: string
  lastRelapseDate: string
  currentStreak: number
  longestStreak: number
  goals: Goal[]
  settings: UserSettings
  createdAt: any
  updatedAt: any
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDays: number
  completed: boolean
  completedAt?: any
}

export interface UserSettings {
  notifications: boolean
  fcmToken?: string
  dailyReminderTime: string
}

export interface ProgressEntry {
  id?: string
  userId: string
  date: string
  status: 'success' | 'relapse'
  notes?: string
  createdAt: any
}

// Gerar ID único baseado no dispositivo
const getUserId = () => {
  let userId = localStorage.getItem('purify_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('purify_user_id', userId)
  }
  return userId
}

// Salvar progresso do usuário
export const saveUserProgress = async (progress: Partial<UserProgress>) => {
  try {
    const userId = getUserId()
    const userRef = doc(db, 'users', userId)
    
    const dataToSave = {
      ...progress,
      updatedAt: serverTimestamp()
    }

    // Verificar se já existe
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      await updateDoc(userRef, dataToSave)
    } else {
      await setDoc(userRef, {
        ...dataToSave,
        createdAt: serverTimestamp()
      })
    }

    console.log('Progresso salvo com sucesso!')
    return true
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    return false
  }
}

// Carregar progresso do usuário
export const getUserProgress = async (): Promise<UserProgress | null> => {
  try {
    const userId = getUserId()
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserProgress
    }
    return null
  } catch (error) {
    console.error('Erro ao carregar progresso:', error)
    return null
  }
}

// Salvar entrada de progresso diário
export const saveProgressEntry = async (entry: Omit<ProgressEntry, 'userId' | 'createdAt'>) => {
  try {
    const userId = getUserId()
    const progressRef = collection(db, 'progress')
    
    await addDoc(progressRef, {
      ...entry,
      userId,
      createdAt: serverTimestamp()
    })

    console.log('Entrada de progresso salva!')
    return true
  } catch (error) {
    console.error('Erro ao salvar entrada:', error)
    return false
  }
}

// Carregar histórico de progresso
export const getProgressHistory = async (limitCount: number = 30) => {
  try {
    const userId = getUserId()
    const progressRef = collection(db, 'progress')
    const q = query(
      progressRef,
      orderBy('date', 'desc'),
      limit(limitCount)
    )

    const querySnapshot = await getDocs(q)
    const history: ProgressEntry[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.userId === userId) {
        history.push({ id: doc.id, ...data } as ProgressEntry)
      }
    })

    return history
  } catch (error) {
    console.error('Erro ao carregar histórico:', error)
    return []
  }
}

// Salvar token FCM
export const saveFCMToken = async (token: string) => {
  try {
    const userId = getUserId()
    const userRef = doc(db, 'users', userId)
    
    await updateDoc(userRef, {
      'settings.fcmToken': token,
      'settings.notifications': true,
      updatedAt: serverTimestamp()
    })

    return true
  } catch (error) {
    console.error('Erro ao salvar token FCM:', error)
    return false
  }
}

// Sincronizar dados locais com Firestore
export const syncLocalData = async () => {
  try {
    // Carregar dados locais
    const localData = localStorage.getItem('addictionData')
    if (!localData) return false

    const data = JSON.parse(localData)
    
    // Salvar no Firestore
    await saveUserProgress({
      addiction: data.addiction,
      lastRelapseDate: data.lastRelapseDate,
      currentStreak: data.currentStreak || 0,
      longestStreak: data.longestStreak || 0,
      goals: data.goals || [],
      settings: {
        notifications: false,
        dailyReminderTime: '09:00'
      }
    })

    console.log('Dados sincronizados com sucesso!')
    return true
  } catch (error) {
    console.error('Erro na sincronização:', error)
    return false
  }
} 