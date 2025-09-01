"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface PremiumUser {
  isPremium: boolean
  subscriptionType: "free" | "monthly" | "yearly"
  expiresAt: Date | null
  features: string[]
  assessmentCompleted: boolean
  assessmentScore?: number
  assessmentLevel?: "low" | "moderate" | "high" | "severe"
  assessmentAnswers?: Record<string, any>
  assessmentRiskFactors?: string[]
  assessmentSpecificTriggers?: string[]
}

interface PremiumContextType {
  user: PremiumUser
  updateUser: (updates: Partial<PremiumUser>) => void
  canAccessFeature: (feature: string) => boolean
  upgradeUser: (subscriptionType: "monthly" | "yearly") => void
  hasCompletedAssessment: () => boolean
  needsUrgentAttention: () => boolean
  validateDataIntegrity: () => boolean
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

const PREMIUM_FEATURES = [
  "advanced_analytics",
  "accountability_partners", 
  "premium_themes",
  "pdf_reports",
  "content_blocker",
  "cloud_sync",
  "ai_insights",
  "unlimited_motivations",
  "priority_support"
]

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

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [userId] = useState<string>(getUserId())
  const [user, setUser] = useState<PremiumUser>({
    isPremium: false,
    subscriptionType: "free",
    expiresAt: null,
    features: [],
    assessmentCompleted: false
  })

  // Carregar dados salvos na inicialização
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadPremiumData = () => {
      try {
        const saved = localStorage.getItem(`premiumData_${userId}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          console.log(`✅ Dados premium carregados para usuário ${userId}:`, parsed)
          setUser({
            ...parsed,
            expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null
          })
        } else {
          console.log(`ℹ️ Nenhum dado premium encontrado para usuário ${userId}`)
        }
      } catch (error) {
        console.error("Erro ao carregar dados premium:", error)
      }
    }

    loadPremiumData()
  }, [userId])

  // Salvar dados sempre que houver mudanças
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const dataToSave = {
      ...user,
      expiresAt: user.expiresAt?.toISOString(),
      lastSaved: new Date().toISOString()
    }
    
    try {
      // Verificar se há espaço suficiente no localStorage
      const testData = JSON.stringify(dataToSave)
      if (testData.length > 5 * 1024 * 1024) { // 5MB limit check
        console.warn("⚠️ Dados muito grandes para localStorage")
        return
      }
      
      localStorage.setItem(`premiumData_${userId}`, testData)
      console.log(`💾 Dados premium salvos para usuário ${userId}:`, {
        assessmentCompleted: user.assessmentCompleted,
        assessmentLevel: user.assessmentLevel,
        hasAnswers: !!user.assessmentAnswers && Object.keys(user.assessmentAnswers).length > 0
      })
    } catch (error) {
      console.error("❌ Erro ao salvar dados premium:", error)
      
      // Tentar liberar espaço e salvar novamente
      try {
        // Remover dados antigos se existirem
        const oldKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('temp_') || key.includes('cache_')
        )
        oldKeys.forEach(key => localStorage.removeItem(key))
        
        localStorage.setItem(`premiumData_${userId}`, JSON.stringify(dataToSave))
        console.log("🔄 Dados premium salvos após limpeza")
      } catch (retryError) {
        console.error("❌ Erro crítico ao salvar dados premium:", retryError)
      }
    }
  }, [user, userId])

  const updateUser = (updates: Partial<PremiumUser>) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const canAccessFeature = (feature: string): boolean => {
    if (!user.isPremium) return false
    return user.features.includes(feature) || PREMIUM_FEATURES.includes(feature)
  }

  const upgradeUser = (subscriptionType: "monthly" | "yearly") => {
    const now = new Date()
    const expiresAt = new Date()
    
    if (subscriptionType === "monthly") {
      expiresAt.setMonth(now.getMonth() + 1)
    } else {
      expiresAt.setFullYear(now.getFullYear() + 1)
    }

    setUser(prev => ({
      ...prev,
      isPremium: true,
      subscriptionType,
      expiresAt,
      features: PREMIUM_FEATURES
    }))
  }

  const hasCompletedAssessment = (): boolean => {
    return user.assessmentCompleted
  }

  const needsUrgentAttention = (): boolean => {
    return user.assessmentScore !== undefined && user.assessmentScore >= 70
  }

  // Função para verificar integridade dos dados
  const validateDataIntegrity = (): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      // Verificar se dados existem no localStorage
      const savedData = localStorage.getItem(`premiumData_${userId}`)
      if (!savedData) {
        console.warn("⚠️ Nenhum dado premium encontrado no localStorage")
        return false
      }

      const parsed = JSON.parse(savedData)
      
      // Verificar estrutura básica
      const hasValidStructure = typeof parsed === 'object' && 
        typeof parsed.assessmentCompleted === 'boolean'
      
      if (!hasValidStructure) {
        console.warn("⚠️ Estrutura de dados premium inválida")
        return false
      }

      // Verificar consistência com estado atual
      const isConsistent = 
        parsed.assessmentCompleted === user.assessmentCompleted &&
        parsed.assessmentLevel === user.assessmentLevel

      if (!isConsistent) {
        console.warn("⚠️ Inconsistência entre localStorage e contexto premium")
        return false
      }

      console.log("✅ Integridade dos dados premium verificada")
      return true
    } catch (error) {
      console.error("❌ Erro ao verificar integridade dos dados:", error)
      return false
    }
  }

  return (
    <PremiumContext.Provider
      value={{
        user,
        updateUser,
        canAccessFeature,
        upgradeUser,
        hasCompletedAssessment,
        needsUrgentAttention,
        validateDataIntegrity
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export const usePremium = () => {
  const context = useContext(PremiumContext)
  if (!context) {
    throw new Error("usePremium must be used within PremiumProvider")
  }
  return context
}

