"use client"

import { useAddiction } from "@/contexts/AddictionContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RelapsePage() {
  const { resetStreak } = useAddiction()
  const router = useRouter()

  useEffect(() => {
    resetStreak()

    const timer = setTimeout(() => {
      router.push("/")
    }, 3000)

    return () => clearTimeout(timer)
  }, [resetStreak, router])

  return (
    <div className="px-6 min-h-screen flex flex-col items-center justify-center">
      <div className="mb-12">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
            <div className="relative">
              {/* Broken chain illustration */}
              <div className="flex items-center">
                <div className="w-8 h-12 bg-gray-500 rounded-lg"></div>
                <div className="w-4 h-8 bg-red-500 rounded-full mx-2"></div>
                <div className="w-8 h-12 bg-gray-500 rounded-lg"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-red-500 font-bold text-lg">💔</div>
              </div>
            </div>
          </div>
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-600 rounded-full"></div>
          <div className="absolute -top-2 -right-6 w-6 h-6 bg-gray-600 rounded-full"></div>
          <div className="absolute -bottom-4 -left-2 w-10 h-10 bg-gray-600 rounded-full"></div>
          <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Recaída Registrada</h2>
        <p className="text-gray-400 mb-8">Não desista. Cada recomeço é uma nova oportunidade de crescer.</p>

        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>

        <p className="text-gray-500 text-sm mt-4">Redirecionando...</p>
      </div>
    </div>
  )
}
