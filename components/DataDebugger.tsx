"use client"

import { useEffect, useState } from "react"
import { usePremium } from "@/contexts/PremiumContext"
import { useAddiction } from "@/contexts/AddictionContext"

export function DataDebugger() {
  const { user, validateDataIntegrity } = usePremium()
  const { data } = useAddiction()
  const [localStorageData, setLocalStorageData] = useState<any>(null)
  const [integrityStatus, setIntegrityStatus] = useState<boolean | null>(null)

  useEffect(() => {
    // Verificar dados do localStorage
    try {
      const premiumData = localStorage.getItem("premiumData")
      const addictionData = localStorage.getItem("addictionData")
      
      setLocalStorageData({
        premium: premiumData ? JSON.parse(premiumData) : null,
        addiction: addictionData ? JSON.parse(addictionData) : null
      })
      
      // Verificar integridade dos dados
      const integrity = validateDataIntegrity()
      setIntegrityStatus(integrity)
    } catch (error) {
      console.error("Erro ao ler localStorage:", error)
      setIntegrityStatus(false)
    }
  }, [user, data, validateDataIntegrity])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm max-h-96 overflow-y-auto z-50 text-xs">
      <h3 className="font-bold mb-2">🔍 Data Debug</h3>
      
      <div className="mb-3">
        <h4 className="font-semibold text-green-400">Premium Context:</h4>
        <div className="text-xs">
          <div>Assessment Completed: {user.assessmentCompleted ? '✅' : '❌'}</div>
          <div>Assessment Level: {user.assessmentLevel || 'null'}</div>
          <div>Assessment Answers: {user.assessmentAnswers ? Object.keys(user.assessmentAnswers).length + ' answers' : 'null'}</div>
          <div>Assessment Score: {user.assessmentScore || 'null'}</div>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-blue-400">Addiction Context:</h4>
        <div className="text-xs">
          <div>Onboarded: {data.isOnboarded ? '✅' : '❌'}</div>
          <div>Addiction Type: {data.addictionType?.name || 'null'}</div>
          <div>Streak Start: {data.streakStart ? new Date(data.streakStart).toLocaleDateString() : 'null'}</div>
          <div>Last Relapse: {data.lastRelapse ? new Date(data.lastRelapse).toLocaleDateString() : 'null'}</div>
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-semibold text-yellow-400">LocalStorage:</h4>
        <div className="text-xs">
          <div>Premium Data: {localStorageData?.premium ? '✅ Present' : '❌ Missing'}</div>
          <div>Addiction Data: {localStorageData?.addiction ? '✅ Present' : '❌ Missing'}</div>
          <div>Data Integrity: {
            integrityStatus === null ? '⏳ Checking...' : 
            integrityStatus ? '✅ Valid' : '❌ Invalid'
          }</div>
        </div>
      </div>

      <button
        onClick={() => {
          console.log("=== DATA DEBUG ===")
          console.log("Premium Context:", user)
          console.log("Addiction Context:", data)
          console.log("LocalStorage Premium:", localStorageData?.premium)
          console.log("LocalStorage Addiction:", localStorageData?.addiction)
        }}
        className="bg-purple-600 px-2 py-1 rounded text-xs"
      >
        Log to Console
      </button>
    </div>
  )
}
