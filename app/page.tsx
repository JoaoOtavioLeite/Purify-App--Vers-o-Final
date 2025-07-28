"use client"

import { useState } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { X, Lightbulb, Menu, Settings, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import { OnboardingFlow } from "@/components/OnboardingFlow"
import { Dashboard } from "@/components/Dashboard"
import { BottomNavigation } from "@/components/ui/BottomNavigation"

import { getDailyContent } from "@/lib/daily-content"

export default function HomePage() {
  const [showQuote, setShowQuote] = useState(true)
  const { bibleQuote } = getDailyContent()
  const { data, getTimeAbstinent, getGoalProgress } = useAddiction()

  if (!data.isOnboarded || !data.addictionType) {
    return <OnboardingFlow />
  }

  const timeAbstinent = getTimeAbstinent()
  const progress = getGoalProgress()

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex flex-col items-center">
      {showQuote && (
        <div className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-red-500 rounded-2xl p-5 mb-8 mt-8 relative shadow-xl">

          <div className="flex items-start gap-4">
            <div className="bg-white/30 rounded-full p-3 flex-shrink-0 shadow-md">
              <Lightbulb className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-white font-bold text-base mb-2 drop-shadow">Citação do dia</h3>
              <p className="text-white/90 mb-3 leading-relaxed text-base font-medium">{bibleQuote.text}</p>
              <p className="text-white/70 text-sm">{bibleQuote.author}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <Dashboard />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
