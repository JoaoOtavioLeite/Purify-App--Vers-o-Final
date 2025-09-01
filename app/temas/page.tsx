"use client"

import { PremiumThemes } from "@/components/PremiumThemes"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TemasPage() {
  const [currentTheme, setCurrentTheme] = useState("default")

  const handleApplyTheme = (themeName: string) => {
    setCurrentTheme(themeName)
    alert(`Tema "${themeName}" aplicado!`)
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-sm mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between pt-4 pb-2">
          <Link href="/definicoes" className="text-white/70 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Temas Premium</h1>
          <div className="w-6"></div>
        </div>
        <PremiumThemes
          isPremium={true}
          onUpgradeClick={() => {}}
          onApplyTheme={handleApplyTheme}
          currentTheme={currentTheme}
        />
      </div>
      <BottomNavigation />
    </div>
  )
}