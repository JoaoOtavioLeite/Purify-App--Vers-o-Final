"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "./LoadingSpinner"

interface LoadingStateProps {
  message?: string
  showMotivation?: boolean
  size?: "sm" | "md" | "lg"
}

export function LoadingState({ 
  message = "Carregando...", 
  showMotivation = true,
  size = "md"
}: LoadingStateProps) {
  const [currentMotivation, setCurrentMotivation] = useState(0)
  
  const motivationalMessages = [
    "Cada segundo de espera vale a pena! 💪",
    "Sua paciência é parte da jornada! ⭐",
    "Preparando algo especial para você! ✨",
    "Quase lá! Continue firme! 🚀",
    "A persistência constrói o caráter! 🌟",
    "Você está fazendo progresso! 💎"
  ]

  useEffect(() => {
    if (showMotivation) {
      const interval = setInterval(() => {
        setCurrentMotivation(prev => (prev + 1) % motivationalMessages.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [showMotivation, motivationalMessages.length])

  const sizeClasses = {
    sm: "py-8",
    md: "py-16",
    lg: "py-24"
  }

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} px-6`}>
      <div className="text-center">
        <div className="mb-4">
          <LoadingSpinner size={size} color="primary" />
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
          {message}
        </p>
        
        {showMotivation && (
          <p 
            key={currentMotivation}
            className="text-sm text-blue-600 dark:text-blue-400 animate-fade-in italic"
          >
            {motivationalMessages[currentMotivation]}
          </p>
        )}
      </div>
    </div>
  )
}

// Loading state específico para diferentes seções
export function PageLoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800">
      <LoadingState 
        message="Carregando sua jornada..."
        size="lg"
      />
    </div>
  )
}

export function SectionLoadingState({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <LoadingState 
        message={`Carregando ${title.toLowerCase()}...`}
        size="md"
      />
    </div>
  )
}
