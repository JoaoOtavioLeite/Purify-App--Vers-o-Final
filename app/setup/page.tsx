"use client"

import { useState } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const { updateData } = useAddiction()
  const [usageType, setUsageType] = useState<"money" | "time">("time")
  const [value, setValue] = useState(15)
  const router = useRouter()

  const handleNext = () => {
    updateData({
      dailyUsage: { type: usageType, value },
    })
    router.push("/setup/last-time")
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
              <div className="w-16 h-20 bg-red-500 rounded-lg relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-400 rounded-full"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-300 rounded-full"></div>
                <div className="absolute top-4 left-2 right-2 h-1 bg-red-600 rounded"></div>
                <div className="absolute top-6 left-2 right-2 h-1 bg-red-600 rounded"></div>
                <div className="absolute top-8 left-2 right-2 h-1 bg-red-600 rounded"></div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-4 -left-2 w-10 h-10 bg-gray-600 rounded-full"></div>
            <div className="absolute -bottom-2 -right-4 w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-8 px-4">
          Em média, quanto dinheiro ou tempo gastou por dia?
        </h2>

        <div className="w-full max-w-xs mb-6">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setUsageType("money")}
              className={`flex-1 py-2 px-4 rounded-md text-center transition-colors ${
                usageType === "money" ? "bg-gray-600 text-white" : "text-gray-300"
              }`}
            >
              Dinheiro
            </button>
            <button
              onClick={() => setUsageType("time")}
              className={`flex-1 py-2 px-4 rounded-md text-center transition-colors ${
                usageType === "time" ? "bg-gray-600 text-white" : "text-gray-300"
              }`}
            >
              Hora
            </button>
          </div>
        </div>

        <div className="w-full max-w-xs mb-12">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="bg-transparent text-red-500 text-xl font-semibold text-center w-full outline-none"
            />
            <span className="text-gray-400 text-sm">{usageType === "time" ? "minutos" : "reais"}</span>
          </div>
        </div>
      </div>

      <button onClick={handleNext} className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold mb-8">
        Próximo
      </button>
    </div>
  )
}
