"use client"

import { useEffect, useState } from 'react'
import { Heart, Sparkles } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
  duration?: number
}

export function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'loading' | 'fadeOut'>('initial')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer1 = setTimeout(() => setAnimationPhase('loading'), 300)
    const timer2 = setTimeout(() => setAnimationPhase('fadeOut'), duration - 500)
    const timer3 = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, duration)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        animationPhase === 'fadeOut' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Efeito de particles de fundo */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            // Usar índice para valores determinísticos (sem Math.random)
            const leftPercent = (i * 17 + 13) % 100
            const topPercent = (i * 23 + 7) % 100
            const delaySeconds = (i * 0.15) % 3
            const durationSeconds = 3 + (i * 0.1) % 2
            const sizeValue = 8 + (i * 2) % 16
            
            return (
              <div
                key={i}
                className="absolute animate-float opacity-20"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  animationDelay: `${delaySeconds}s`,
                  animationDuration: `${durationSeconds}s`,
                }}
              >
                <Sparkles size={sizeValue} className="text-white" />
              </div>
            )
          })}
        </div>
      )}

      {/* Logo central */}
      <div className="text-center z-10 px-8">
        <div 
          className={`mb-6 transition-all duration-700 ${
            animationPhase === 'initial' ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
          }`}
        >
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
              <img 
                src="/512.png" 
                alt="Purify Logo" 
                className="w-24 h-24 drop-shadow-lg"
              />
            </div>
            
            {/* Efeito de pulso */}
            <div className={`absolute inset-0 w-32 h-32 mx-auto bg-white/10 rounded-3xl ${
              animationPhase === 'loading' ? 'animate-ping' : ''
            }`} />
          </div>
        </div>

        <h1 
          className={`text-4xl font-bold text-white mb-2 transition-all duration-700 delay-300 ${
            animationPhase === 'initial' ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          Purify
        </h1>
        
        <p 
          className={`text-white/80 text-lg font-medium transition-all duration-700 delay-500 ${
            animationPhase === 'initial' ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          Sua jornada de superação
        </p>

        {/* Indicador de carregamento */}
        {animationPhase === 'loading' && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* iOS style home indicator (para PWA instalada) */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
    </div>
  )
}

// Hook para controlar o splash screen
export const useSplashScreen = () => {
  const [showSplash, setShowSplash] = useState(false) // Começa false para evitar hydration mismatch
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Verificar se é o primeiro carregamento ou uma nova sessão
    if (typeof window !== 'undefined') {
      const lastVisit = localStorage.getItem('last_visit')
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000

      if (lastVisit && now - parseInt(lastVisit) < fiveMinutes) {
        setIsFirstLoad(false)
        setShowSplash(false)
      } else {
        localStorage.setItem('last_visit', now.toString())
        setShowSplash(true)
      }
    }
  }, [])

  const hideSplash = () => {
    setShowSplash(false)
  }

  return {
    showSplash: isMounted && showSplash && isFirstLoad,
    hideSplash,
  }
}
