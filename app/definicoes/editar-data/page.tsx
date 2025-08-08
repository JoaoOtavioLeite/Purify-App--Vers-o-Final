"use client"

import { useState, useEffect } from "react"
import { useAddiction } from "@/contexts/AddictionContext"
import { ChevronLeft, Calendar, Clock, Save, AlertTriangle } from "lucide-react"
import { BottomNavigation } from "@/components/ui/BottomNavigation"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function EditarDataPage() {
  const { data, setLastRelapseDate } = useAddiction()
  const router = useRouter()
  
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)

  // Inicializar com a data atual da última recaída ou agora
  useEffect(() => {
    const currentDate = data.lastRelapse || new Date()
    
    // Formatar data para input date (YYYY-MM-DD)
    const dateStr = currentDate.toISOString().split('T')[0]
    
    // Formatar hora para input time (HH:MM)
    const timeStr = currentDate.toTimeString().split(' ')[0].substring(0, 5)
    
    setSelectedDate(dateStr)
    setSelectedTime(timeStr)
  }, [data.lastRelapse])

  const handleSave = () => {
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione uma data e hora válidas.")
      return
    }

    // Criar nova data combinando data e hora selecionadas
    const newDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
    
    // Verificar se a data é válida
    if (isNaN(newDateTime.getTime())) {
      alert("Data ou hora inválida.")
      return
    }

    // Verificar se a data não é no futuro
    if (newDateTime > new Date()) {
      alert("A data da última recaída não pode ser no futuro.")
      return
    }

    setLastRelapseDate(newDateTime)
    router.push("/definicoes")
  }

  const handleConfirm = () => {
    setIsConfirming(true)
  }

  const formatDateTimeForDisplay = () => {
    if (!selectedDate || !selectedTime) return ""
    
    const dateTime = new Date(`${selectedDate}T${selectedTime}:00`)
    return dateTime.toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateNewStreak = () => {
    if (!selectedDate || !selectedTime) return { days: 0, hours: 0, minutes: 0 }
    
    const startDate = new Date(`${selectedDate}T${selectedTime}:00`)
    const now = new Date()
    const diff = now.getTime() - startDate.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  }

  const newStreak = calculateNewStreak()

  if (!data.addictionType) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 pt-14 pb-6 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/definicoes">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ChevronLeft className="text-white" size={20} />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-medium text-white">Editar Data de Recaída</h1>
              <p className="text-white/80 text-sm">Ajuste quando sua jornada começou</p>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-yellow-300" size={18} />
              <span className="text-white font-semibold text-sm">Atenção:</span>
            </div>
            <p className="text-white/90 text-xs leading-relaxed">
              Alterar esta data irá recalcular todo seu progresso atual. Certifique-se de inserir a data correta.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-2 relative z-20 space-y-4">
        {!isConfirming ? (
          <>
            {/* Seleção de Data */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold text-base">Data da Última Recaída</h2>
                  <p className="text-gray-600 text-sm">Selecione o dia que sua jornada começou</p>
                </div>
              </div>
              
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Seleção de Hora */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Clock className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold text-base">Hora da Última Recaída</h2>
                  <p className="text-gray-600 text-sm">Defina o horário específico</p>
                </div>
              </div>
              
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Preview do Novo Streak */}
            {selectedDate && selectedTime && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="text-white" size={20} />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-base mb-2">Novo Tempo Limpo</h3>
                <div className="bg-white/15 rounded-xl p-3 mb-3">
                  <div className="text-2xl font-bold text-white mb-1">
                    {newStreak.days} dias, {newStreak.hours}h {newStreak.minutes}m
                  </div>
                  <div className="text-white/80 text-xs">
                    Desde {formatDateTimeForDisplay()}
                  </div>
                </div>
                
                <button
                  onClick={handleConfirm}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Continuar →
                </button>
              </div>
            )}
          </>
        ) : (
          /* Tela de Confirmação */
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-yellow-600" size={32} />
              </div>
              <h2 className="text-gray-900 font-semibold text-lg mb-2">Confirmar Alteração</h2>
              <p className="text-gray-600 text-sm">
                Tem certeza que deseja alterar a data da sua última recaída?
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Nova data:</span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {formatDateTimeForDisplay()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Novo tempo limpo:</span>
                  <span className="font-semibold text-green-600 text-sm">
                    {newStreak.days} dias, {newStreak.hours}h {newStreak.minutes}m
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirming(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}