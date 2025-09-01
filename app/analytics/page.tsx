"use client"

import { PremiumAnalytics } from "@/components/PremiumAnalytics"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 pb-12">
      <div className="max-w-sm mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between pt-4 pb-2">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Meu Plano de Recuperação</h1>
          <div className="w-6"></div>
        </div>
        <PremiumAnalytics />
      </div>
      <BottomNavigation />
    </div>
  )
}
