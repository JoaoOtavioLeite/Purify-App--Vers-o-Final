"use client"

import { useState } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LastTimePage() {
  const { updateData } = useAddiction()
  const [selectedDate, setSelectedDate] = useState("8 de julho de 2025 às 22:30")
  const router = useRouter()

  const handleSave = () => {
    updateData({
      lastRelapse: new Date("2025-07-08T22:30:00"),
      streakStart: new Date("2025-07-08T22:30:00"),
    })
    router.push("/")
  }

  return (
    <div className="px-6 min-h-screen flex flex-col">
      <div className="flex items-center gap-4 py-4">
        {/* Removido botão de voltar */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-12">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-8">
              <div className="w-20 h-16 bg-gradient-to-b from-red-400 to-orange-400 rounded-lg relative">
                <div className="absolute top-1 left-1 right-1 h-3 bg-red-500 rounded-t-lg"></div>
                <div className="absolute top-5 left-2 right-2 text-xs text-red-600 font-bold text-center">xXx</div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-4 -left-2 w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-12 px-4">Quando foi a última vez que fez isto?</h2>

        <div className="w-full max-w-xs mb-12">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-red-500 text-lg font-semibold text-center w-full outline-none"
            />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold mb-8">
        Guardar
      </button>
    </div>
  )
}
