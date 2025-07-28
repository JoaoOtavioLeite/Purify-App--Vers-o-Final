"use client"

import { useState, useEffect } from "react"
import { useAddiction, ADDICTION_TYPES, type AddictionType } from "@/contexts/AddictionContext"
import { ChevronRight, ChevronLeft, Calendar, Clock, Edit3 } from "lucide-react"
import Image from "next/image"

export function OnboardingFlow() {
  const { data, updateData, setAddictionType, setLastRelapseDate } = useAddiction()
  const [step, setStep] = useState(1)
  const [selectedAddiction, setSelectedAddiction] = useState<AddictionType | null>(null)
  const [relapseDate, setRelapseDate] = useState("")
  const [relapseTime, setRelapseTime] = useState("")
  const [customAddiction, setCustomAddiction] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  // Resetar estado interno quando o componente é montado
  useEffect(() => {
    setStep(1)
    setSelectedAddiction(null)
    setRelapseDate("")
    setRelapseTime("")
    setCustomAddiction("")
    setIsCustom(false)
  }, [])


  const handleAddictionSelect = (addiction: AddictionType) => {
    setSelectedAddiction(addiction)
    setAddictionType(addiction)
  }

  const handleDateTimeSubmit = () => {
    if (relapseDate && relapseTime) {
      const dateTime = new Date(`${relapseDate}T${relapseTime}`)
      setLastRelapseDate(dateTime)
      setStep(4)
    }
  }

  const completeOnboarding = () => {
    updateData({
      isOnboarded: true,
    })
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center mb-12">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-sky-500 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl animate-float overflow-hidden">
            <Image 
              src="/placeholder-logo.png" 
              alt="Purify Logo" 
              width={64} 
              height={64}
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold mb-6 gradient-text">Purify</h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md">
            Sua jornada de purificação começa aqui. Vamos te ajudar a superar seus desafios e construir uma vida mais
            limpa, saudável e equilibrada.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => setStep(2)}
            className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-sky-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Começar Purificação
            <ChevronRight size={20} />
          </button>

          <p className="text-center text-gray-500 text-sm">🔒 Seus dados são privados e seguros</p>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="flex items-center gap-4 mb-8">
          {/* Botão de voltar removido */}
          <div className="flex-1">
            <div className="w-full bg-white/50 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-sky-500 h-3 rounded-full shadow-sm"
                style={{ width: "33%" }}
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Escolha seu desafio</h2>
          <p className="text-gray-600">Selecione o hábito que você deseja purificar da sua vida</p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8">
          {ADDICTION_TYPES.map((addiction) => {
            const isSelected = selectedAddiction?.id === addiction.id && !isCustom;

            return (
              <button
                key={addiction.id}
                onClick={() => { setIsCustom(false); handleAddictionSelect(addiction); }}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-white/90 shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isSelected ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <span className="text-3xl">{addiction.icon}</span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg text-gray-800">{addiction.name}</h3>
                  </div>
                </div>
              </button>
            )
          })}
          {/* Opção Outro */}
          <button
            onClick={() => {
              setIsCustom(true);
              setSelectedAddiction(null);
            }}
            className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
              isCustom
                ? "border-blue-400 bg-blue-50 shadow-lg"
                : "border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-white/90 shadow-md"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isCustom ? "bg-blue-100" : "bg-gray-100"}`}>
                <Edit3 className="text-2xl text-blue-500" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg text-gray-800">Outro</h3>
                <p className="text-gray-500 text-sm">Personalizar vício</p>
              </div>
            </div>
          </button>
        </div>
        {/* Campo de texto para vício personalizado */}
        {isCustom && (
          <div className="mb-8 flex flex-col gap-2 animate-fade-in">
            <label className="text-gray-700 font-medium mb-1">Qual vício você deseja purificar?</label>
            <input
              type="text"
              value={customAddiction}
              onChange={e => setCustomAddiction(e.target.value)}
              placeholder="Digite aqui..."
              className="w-full bg-white/80 border border-gray-200 rounded-xl py-4 px-4 text-gray-800 focus:border-blue-400 focus:outline-none shadow-sm"
              maxLength={32}
            />
          </div>
        )}
        {/* Botão continuar */}
        {(selectedAddiction || (isCustom && customAddiction.trim().length > 2)) && (
          <button
            onClick={() => {
              if (isCustom && customAddiction.trim().length > 2) {
                setAddictionType({
                  id: "custom",
                  name: customAddiction.trim(),
                  icon: "✨",
                  color: "gray",
                  defaultReasons: [
                    "Quero me libertar desse hábito e viver melhor.",
                    "Desejo mais saúde, equilíbrio e felicidade.",
                  ],
                });
              }
              setStep(3);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continuar
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="flex items-center gap-4 mb-8">
          {/* Botão de voltar removido */}
          <div className="flex-1">
            <div className="w-full bg-white/50 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-sky-500 h-3 rounded-full shadow-sm"
                style={{ width: "66%" }}
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">Última vez</h2>
          <p className="text-gray-600">
            Quando foi a última vez que você teve uma recaída? Isso nos ajudará a calcular seu progresso de purificação.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">Data da última recaída</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none" size={20} />
              <input
                type="date"
                value={relapseDate}
                onChange={(e) => setRelapseDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                placeholder="dd/mm/aaaa"
                className="w-full bg-white/90 border border-blue-200 rounded-2xl py-4 pl-12 pr-4 text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none shadow-md transition-all text-base md:text-lg"
                style={{ minHeight: 56 }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-gray-700">Horário aproximado</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 pointer-events-none" size={20} />
              <input
                type="time"
                value={relapseTime}
                onChange={(e) => setRelapseTime(e.target.value)}
                placeholder="hh:mm"
                className="w-full bg-white/90 border border-blue-200 rounded-2xl py-4 pl-12 pr-4 text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none shadow-md transition-all text-base md:text-lg"
                style={{ minHeight: 56 }}
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>Dica:</strong> Seja honesto com a data e horário. Isso nos ajudará a calcular seu progresso real de recuperação e fornecer o melhor suporte para sua jornada.
            </p>
          </div>
        </div>

        <button
          onClick={handleDateTimeSubmit}
          disabled={!relapseDate || !relapseTime}
          className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
            relapseDate && relapseTime
              ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:shadow-xl transform hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Definir Data
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 to-sky-100">
        <div className="flex items-center gap-4 mb-8">
          {/* Botão de voltar removido */}
          <div className="flex-1">
            <div className="w-full bg-white/50 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-sky-500 h-3 rounded-full shadow-sm"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Tudo pronto!</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            Sua jornada de purificação de <strong>{selectedAddiction?.name.toLowerCase()}</strong> está configurada.
            Vamos começar a acompanhar seu progresso de limpeza!
          </p>
        </div>

        <div className="bg-white/70 rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <span className="text-2xl">{selectedAddiction?.icon}</span>
            Resumo da Configuração
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Desafio selecionado:</span>
              <span className="font-medium text-gray-800">{selectedAddiction?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última recaída:</span>
              <span className="font-medium text-gray-800">
                {new Date(`${relapseDate}T${relapseTime}`).toLocaleString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={completeOnboarding}
          className="w-full bg-gradient-to-r from-blue-500 to-sky-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Iniciar Purificação
          <ChevronRight size={20} />
        </button>
      </div>
    )
  }

  return null
}
