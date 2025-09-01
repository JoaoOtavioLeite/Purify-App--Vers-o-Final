"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useNotifications } from "@/lib/notifications"

export interface AddictionType {
  id: string
  name: string
  icon: string
  color: string
  defaultReasons: string[]
}

export const ADDICTION_TYPES: AddictionType[] = [
  {
    id: "pornography",
    name: "Pornografia",
    icon: "🚫",
    color: "red",
    defaultReasons: [
      "A pornografia afeta negativamente meus relacionamentos e intimidade.",
      "Quero ter mais controle sobre meus impulsos e comportamentos sexuais.",
      "Desejo melhorar minha saúde mental, autoestima e confiança.",
      "Quero usar meu tempo de forma mais produtiva e significativa.",
      "Desejo me reconectar com a sexualidade real e saudável.",
      "Quero eliminar a culpa e vergonha associadas ao consumo.",
      "Desejo melhorar minha concentração e energia mental.",
      "Quero ser um exemplo positivo e íntegro para outros.",
      "Desejo ter uma vida sexual mais autêntica e satisfatória.",
      "Quero quebrar o ciclo de dependência e comportamento compulsivo.",
    ],
  }
]

interface MotivationEntry {
  text: string
  date: string
  favorite?: boolean
}

interface AddictionData {
  isOnboarded: boolean
  addictionType: AddictionType | null
  lastRelapse: Date | null
  currentGoal: string
  reasons: string[]
  motivation: string
  motivations: MotivationEntry[]
  dailyUsage: { type: "money" | "time"; value: number }
  streakStart: Date | null
  completedGoals: string[]
  personalizedGoals: string[]
}

interface AddictionContextType {
  data: AddictionData
  updateData: (updates: Partial<AddictionData>) => void
  getTimeAbstinent: () => { days: number; hours: number; minutes: number; seconds: number }
  getGoalProgress: () => number
  resetStreak: () => void
  completeGoal: (goal: string) => void
  setAddictionType: (type: AddictionType) => void
  setLastRelapseDate: (date: Date) => void
  addMotivation: (text: string) => void
  removeMotivation: (date: string) => void
  favoriteMotivation: (date: string) => void
  restoreMotivation: (date: string) => void
}

const AddictionContext = createContext<AddictionContextType | undefined>(undefined)

// Remover: currentGoal, completedGoals, progressiveGoals, completeGoal, personalizedGoals, defaultGoals
// Manter: streakStart, lastRelapse, getTimeAbstinent, resetStreak, setAddictionType, setLastRelapseDate, motivações

// Marcos específicos para recuperação da pornografia
export const MILESTONES = [
  { label: '24 Horas Limpo', hours: 24, emoji: '🥇', message: 'Primeiro dia vencido! O mais difícil já passou.' },
  { label: '72 Horas Livres', hours: 72, emoji: '🧠', message: 'Seu cérebro já começou a se rebalancear.' },
  { label: '1 Semana Pura', hours: 168, emoji: '🛡️', message: 'Primeira semana! Você quebrou o ciclo imediato.' },
  { label: '2 Semanas Fortes', hours: 336, emoji: '💪', message: 'Dopamina se normalizando. Foco retornando!' },
  { label: '1 Mês Livre', hours: 720, emoji: '🏆', message: 'Marco histórico! Seu cérebro está se curando.' },
  { label: '45 Dias Limpos', hours: 1080, emoji: '🧘', message: 'Clareza mental aumentando significativamente.' },
  { label: '90 Dias - Reboot', hours: 2160, emoji: '💎', message: 'Reboot completo! Nova versão de você mesmo.' },
  { label: '6 Meses Transformado', hours: 4380, emoji: '🔥', message: 'Mudanças permanentes no cérebro!' },
  { label: '1 Ano Renovado', hours: 8760, emoji: '🌟', message: 'Você é uma nova pessoa. Parabéns pela jornada!' },
]

// Função para retornar marcos atingidos e próximos
export function getMilestones(streakStart: Date | null) {
  if (!streakStart) return { conquered: [], next: MILESTONES[0] }
  const now = new Date()
  const diffMs = now.getTime() - streakStart.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const conquered = MILESTONES.filter(m => diffHours >= m.hours)
  const next = MILESTONES.find(m => diffHours < m.hours) || null
  return { conquered, next }
}

// Função para gerar ID único do usuário
const getUserId = (): string => {
  if (typeof window === 'undefined') {
    return 'temp_user_' + Math.random().toString(36).substr(2, 9)
  }
  
  let userId = localStorage.getItem('purify_user_id')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('purify_user_id', userId)
    console.log('🔑 Novo usuário criado:', userId)
  }
  return userId
}

export function AddictionProvider({ children }: { children: ReactNode }) {
  const [userId] = useState<string>(getUserId())
  const [data, setData] = useState<AddictionData>({
    isOnboarded: false,
    addictionType: null,
    lastRelapse: null,
    currentGoal: "1 Dia",
    reasons: [],
    motivation: "",
    motivations: [],
    dailyUsage: { type: "time", value: 30 },
    streakStart: null,
    completedGoals: [],
    personalizedGoals: [],
  })

  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastNotifiedDay, setLastNotifiedDay] = useState(0)
  const notifications = useNotifications()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Inicializar sistema de notificações
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const initialized = await notifications.initialize()
        if (initialized) {
          console.log('🔔 Sistema de notificações inicializado')
        }
      } catch (error) {
        console.log('❌ Erro ao inicializar notificações:', error)
      }
    }

    initNotifications()
  }, [])

  // Verificar marcos e agendar notificações de progresso
  useEffect(() => {
    if (data.streakStart) {
      const timeAbstinent = getTimeAbstinent()
      const currentDays = timeAbstinent.days
      
      // Marcos importantes que devem gerar notificações
      const milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365]
      
      // Verificar se completou um marco hoje
      if (milestones.includes(currentDays) && currentDays > lastNotifiedDay) {
        console.log(`🎯 Marco alcançado: ${currentDays} dias`)
        setLastNotifiedDay(currentDays)
        
        // Salvar último dia notificado
        if (typeof window !== 'undefined') {
          localStorage.setItem('lastNotifiedDay', currentDays.toString())
        }
      }

      // Agendar notificação para o próximo marco diário (sempre às 00:01)
      if (notifications.hasPermission()) {
        notifications.scheduleMilestoneNotification(currentDays)
      }
    }
  }, [currentTime, data.streakStart, lastNotifiedDay, notifications])

  // Carregar último dia notificado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastNotifiedDay')
      if (saved) {
        setLastNotifiedDay(parseInt(saved))
      }
    }
  }, [])

  // Carregar dados salvos na inicialização
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem(`addictionData_${userId}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          console.log(`✅ Dados carregados para usuário ${userId}:`, parsed)
          
          // Validar se os dados são válidos
          if (parsed && typeof parsed === 'object') {
            setData({
              ...parsed,
              lastRelapse: parsed.lastRelapse ? new Date(parsed.lastRelapse) : null,
              streakStart: parsed.streakStart ? new Date(parsed.streakStart) : null,
              addictionType: parsed.addictionType
                ? ADDICTION_TYPES.find((t) => t.id === parsed.addictionType.id) || null
                : null,
              currentGoal: parsed.currentGoal || "1 Dia",
              completedGoals: parsed.completedGoals || [],
              motivations: parsed.motivations || [],
              reasons: parsed.reasons || [],
              motivation: parsed.motivation || "",
              dailyUsage: parsed.dailyUsage || { type: "time", value: 30 },
              personalizedGoals: parsed.personalizedGoals || [],
            })
          } else {
            console.log("⚠️ Dados inválidos no localStorage, usando padrão")
            localStorage.removeItem(`addictionData_${userId}`)
          }
        } else {
          console.log(`ℹ️ Nenhum dado salvo encontrado para usuário ${userId}, usando dados padrão`)
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados salvos:", error)
        // Em caso de erro, limpar localStorage e usar dados padrão
        localStorage.removeItem(`addictionData_${userId}`)
      }
    }

    loadSavedData()
  }, [userId])

  // Salvar dados sempre que houver mudanças
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (data.isOnboarded || data.addictionType) {
      const dataToSave = {
        ...data,
        lastRelapse: data.lastRelapse?.toISOString(),
        streakStart: data.streakStart?.toISOString(),
      }
      
      try {
        localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave))
        console.log(`💾 Dados salvos para usuário ${userId}:`, {
          isOnboarded: dataToSave.isOnboarded,
          addictionType: dataToSave.addictionType?.name,
          lastRelapse: dataToSave.lastRelapse,
          streakStart: dataToSave.streakStart
        })
      } catch (error) {
        console.error("❌ Erro ao salvar dados:", error)
        // Tentar limpar localStorage e salvar novamente
        try {
          localStorage.removeItem("addictionData")
          localStorage.setItem("addictionData", JSON.stringify(dataToSave))
          console.log("🔄 Dados salvos após limpeza do localStorage")
        } catch (retryError) {
          console.error("❌ Erro crítico ao salvar dados:", retryError)
        }
      }
    }
  }, [data, userId])

  const updateData = (updates: Partial<AddictionData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const getTimeAbstinent = () => {
    if (!data.streakStart) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

    const diff = currentTime.getTime() - data.streakStart.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  const getGoalProgress = () => {
    if (!data.streakStart) return 0

    const goalHours = {
      "1 Hora": 1,
      "6 Horas": 6,
      "12 Horas": 12,
      "1 Dia": 24,
      "2 Dias": 48,
      "3 Dias": 72,
      "1 Semana": 168,
      "2 Semanas": 336,
      "1 Mês": 720,
      "3 Meses": 2160,
      "6 Meses": 4320,
      "1 Ano": 8760,
    }

    const targetHours = goalHours[data.currentGoal as keyof typeof goalHours] || 24
    const { days, hours, minutes } = getTimeAbstinent()
    const totalHours = days * 24 + hours + minutes / 60

    return Math.min((totalHours / targetHours) * 100, 100)
  }

  const resetStreak = () => {
    const now = new Date()
    const newData = {
      ...data,
      streakStart: now,
      lastRelapse: now,
      currentGoal: "1 Dia",
      completedGoals: [],
    };
    setData(newData);
    
    // Salvar imediatamente
    try {
      const dataToSave = {
        ...newData,
        lastRelapse: now.toISOString(),
        streakStart: now.toISOString(),
      };
      localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
      console.log("Streak resetado e salvo:", dataToSave);
    } catch (error) {
      console.error("Erro ao resetar streak:", error);
    }
  }

  const completeGoal = (goal: string) => {
    // This function is no longer needed as goals are removed.
    // Keeping it here for now, but it will be removed in a subsequent edit.
  }

  const setAddictionType = (type: AddictionType) => {
    const newData = {
      ...data,
      addictionType: type,
      reasons: type.defaultReasons,
      currentGoal: "1 Dia",
      completedGoals: [],
      motivations: data.motivations || [],
      motivation: data.motivation || "",
      dailyUsage: data.dailyUsage || { type: "time", value: 30 },
      personalizedGoals: data.personalizedGoals || [],
    };
    setData(newData);
    
    // Salvar imediatamente
    try {
      const dataToSave = {
        ...newData,
        lastRelapse: newData.lastRelapse?.toISOString(),
        streakStart: newData.streakStart?.toISOString(),
      };
      localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
      console.log("Tipo de vício salvo com sucesso:", dataToSave);
    } catch (error) {
      console.error("Erro ao salvar tipo de vício:", error);
    }
  }

  const setLastRelapseDate = (date: Date) => {
    const newData = {
      ...data,
      lastRelapse: date,
      streakStart: date,
    };
    setData(newData);
    
    // Salvar imediatamente
    try {
      const dataToSave = {
        ...newData,
        lastRelapse: date.toISOString(),
        streakStart: date.toISOString(),
      };
      localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
      console.log("Data de recaída salva com sucesso:", dataToSave);
    } catch (error) {
      console.error("Erro ao salvar data de recaída:", error);
    }
  }

  // Métodos para histórico de motivações
  const addMotivation = (text: string) => {
    const entry = { text, date: new Date().toISOString(), favorite: false }
    const newData = {
      ...data,
      motivations: [entry, ...(data.motivations || [])],
      motivation: text,
    };
    setData(newData);
    
    // Salvar imediatamente
    try {
      const dataToSave = {
        ...newData,
        lastRelapse: newData.lastRelapse?.toISOString(),
        streakStart: newData.streakStart?.toISOString(),
      };
      localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
      console.log("Motivação adicionada e salva:", entry);
    } catch (error) {
      console.error("Erro ao salvar motivação:", error);
    }
  }
  
  const removeMotivation = (date: string) => {
    const newData = {
      ...data,
      motivations: (data.motivations || []).filter(m => m.date !== date),
    };
    setData(newData);
    
    // Salvar imediatamente
    try {
      const dataToSave = {
        ...newData,
        lastRelapse: newData.lastRelapse?.toISOString(),
        streakStart: newData.streakStart?.toISOString(),
      };
      localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
      console.log("Motivação removida e salva");
    } catch (error) {
      console.error("Erro ao remover motivação:", error);
    }
  }
  
  const favoriteMotivation = (date: string) => {
    const newData = {
      ...data,
      motivations: (data.motivations || []).map(m => m.date === date ? { ...m, favorite: !m.favorite } : m),
    };
    setData(newData);
    
    // Salvar imediatamente
    try {
      const dataToSave = {
        ...newData,
        lastRelapse: newData.lastRelapse?.toISOString(),
        streakStart: newData.streakStart?.toISOString(),
      };
      localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
      console.log("Motivação favoritada e salva");
    } catch (error) {
      console.error("Erro ao favoritar motivação:", error);
    }
  }
  
  const restoreMotivation = (date: string) => {
    const entry = (data.motivations || []).find(m => m.date === date)
    if (entry) {
      const newData = { ...data, motivation: entry.text };
      setData(newData);
      
      // Salvar imediatamente
      try {
        const dataToSave = {
          ...newData,
          lastRelapse: newData.lastRelapse?.toISOString(),
          streakStart: newData.streakStart?.toISOString(),
        };
        localStorage.setItem(`addictionData_${userId}`, JSON.stringify(dataToSave));
        console.log("Motivação restaurada e salva");
      } catch (error) {
        console.error("Erro ao restaurar motivação:", error);
      }
    }
  }

  return (
    <AddictionContext.Provider
      value={{
        data,
        updateData,
        getTimeAbstinent,
        getGoalProgress,
        resetStreak,
        completeGoal,
        setAddictionType,
        setLastRelapseDate,
        addMotivation,
        removeMotivation,
        favoriteMotivation,
        restoreMotivation,
      }}
    >
      {children}
    </AddictionContext.Provider>
  )
}

export const useAddiction = () => {
  const context = useContext(AddictionContext)
  if (!context) {
    throw new Error("useAddiction must be used within AddictionProvider")
  }
  return context
}
