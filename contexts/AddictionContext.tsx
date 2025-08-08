"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getNotifications } from "@/lib/notifications"

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
      "Quero ter mais controle sobre meus impulsos e comportamentos.",
      "Desejo melhorar minha saúde mental e autoestima.",
      "Quero usar meu tempo de forma mais produtiva e significativa.",
    ],
  },
  {
    id: "smoking",
    name: "Cigarro",
    icon: "🚭",
    color: "orange",
    defaultReasons: [
      "Quero melhorar minha saúde pulmonar e cardiovascular.",
      "Desejo economizar dinheiro gasto com cigarros.",
      "Quero me livrar do mau hálito e odor de cigarro.",
      "Desejo ser um exemplo positivo para minha família.",
    ],
  },
  {
    id: "alcohol",
    name: "Álcool",
    icon: "🍷",
    color: "purple",
    defaultReasons: [
      "Quero melhorar minha saúde física e mental.",
      "Desejo ter mais controle sobre minhas decisões.",
      "Quero melhorar meus relacionamentos familiares.",
      "Desejo ter mais energia e disposição no dia a dia.",
    ],
  },
  {
    id: "drugs",
    name: "Drogas",
    icon: "💊",
    color: "blue",
    defaultReasons: [
      "Quero recuperar minha saúde e bem-estar.",
      "Desejo reconstruir relacionamentos importantes.",
      "Quero ter uma vida mais estável e produtiva.",
      "Desejo ser uma pessoa melhor para mim e outros.",
    ],
  },
  {
    id: "gambling",
    name: "Jogos/Apostas",
    icon: "🎰",
    color: "green",
    defaultReasons: [
      "Quero ter controle financeiro e estabilidade.",
      "Desejo reduzir o estresse e ansiedade.",
      "Quero focar em atividades mais saudáveis.",
      "Desejo reconstruir a confiança da minha família.",
    ],
  },
  {
    id: "social_media",
    name: "Redes Sociais",
    icon: "📱",
    color: "pink",
    defaultReasons: [
      "Quero ter mais tempo para atividades importantes.",
      "Desejo melhorar meu foco e produtividade.",
      "Quero reduzir comparações e ansiedade social.",
      "Desejo ter relacionamentos mais autênticos.",
    ],
  },
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

// Lista de marcos em horas
export const MILESTONES = [
  { label: '1 Dia', hours: 24, emoji: '🥇' },
  { label: '3 Dias', hours: 72, emoji: '🥈' },
  { label: '7 Dias', hours: 168, emoji: '🥉' },
  { label: '15 Dias', hours: 360, emoji: '🏅' },
  { label: '30 Dias', hours: 720, emoji: '🏆' },
  { label: '90 Dias', hours: 2160, emoji: '🎖️' },
  { label: '180 Dias', hours: 4320, emoji: '👑' },
  { label: '1 Ano', hours: 8760, emoji: '🌟' },
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

export function AddictionProvider({ children }: { children: ReactNode }) {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Verificar marcos e enviar notificações
  useEffect(() => {
    if (data.streakStart) {
      const timeAbstinent = getTimeAbstinent()
      const currentDays = timeAbstinent.days
      
      // Verificar se é um marco importante e se ainda não foi notificado
      const milestones = [1, 3, 7, 15, 30, 60, 90, 180, 365]
      
      if (milestones.includes(currentDays) && currentDays > lastNotifiedDay) {
        try {
          const notifications = getNotifications()
          notifications.sendMilestoneNotification?.(currentDays)
          setLastNotifiedDay(currentDays)
        } catch (error) {
          console.log('Notificações não disponíveis:', error)
        }
      }
    }
  }, [currentTime, data.streakStart, lastNotifiedDay])

  // Carregar dados salvos na inicialização
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem("addictionData")
        if (saved) {
          const parsed = JSON.parse(saved)
          console.log("✅ Dados carregados do localStorage:", parsed)
          
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
            localStorage.removeItem("addictionData")
          }
        } else {
          console.log("ℹ️ Nenhum dado salvo encontrado, usando dados padrão")
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados salvos:", error)
        // Em caso de erro, limpar localStorage e usar dados padrão
        localStorage.removeItem("addictionData")
      }
    }

    loadSavedData()
  }, [])

  // Salvar dados sempre que houver mudanças
  useEffect(() => {
    if (data.isOnboarded || data.addictionType) {
      const dataToSave = {
        ...data,
        lastRelapse: data.lastRelapse?.toISOString(),
        streakStart: data.streakStart?.toISOString(),
      }
      
      try {
        localStorage.setItem("addictionData", JSON.stringify(dataToSave))
        console.log("💾 Dados salvos com sucesso:", {
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
  }, [data])

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
      localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
      localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
      localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
      localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
      localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
      localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
        localStorage.setItem("addictionData", JSON.stringify(dataToSave));
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
