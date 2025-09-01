"use client"

import { useState } from 'react'
import { Plus, Shield, Heart, Trophy, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useHaptics } from '@/lib/haptics'

interface FABAction {
  icon: React.ReactNode
  label: string
  href: string
  color: string
  bgColor: string
}

const fabActions: FABAction[] = [
  {
    icon: <Shield size={20} />,
    label: "SOS",
    href: "/emergencia",
    color: "text-red-400",
    bgColor: "bg-red-500/20 hover:bg-red-500/30"
  },
  {
    icon: <Heart size={20} />,
    label: "Motivação",
    href: "/motivacao",
    color: "text-pink-400",
    bgColor: "bg-pink-500/20 hover:bg-pink-500/30"
  },
  {
    icon: <Trophy size={20} />,
    label: "Conquistas",
    href: "/gamificacao",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20 hover:bg-yellow-500/30"
  },
  {
    icon: <Sparkles size={20} />,
    label: "Bem-estar",
    href: "/bem-estar",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20 hover:bg-purple-500/30"
  }
]

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const haptics = useHaptics()

  const toggleFAB = () => {
    haptics.light()
    setIsOpen(!isOpen)
  }

  const handleActionClick = (href: string) => {
    if (href === "/emergencia") {
      haptics.emergency()
    } else {
      haptics.medium()
    }
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Overlay para fechar quando clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          style={{ zIndex: -1 }}
        />
      )}

      {/* Ações expandidas */}
      <div className={`flex flex-col items-end space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {fabActions.map((action, index) => (
          <div 
            key={action.href}
            className="flex items-center space-x-3"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: isOpen ? 'spring-in 0.3s ease-out forwards' : 'none'
            }}
          >
            {/* Label */}
            <span className="bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-white whitespace-nowrap">
              {action.label}
            </span>
            
            {/* Botão de ação */}
            <Link 
              href={action.href}
              onClick={() => handleActionClick(action.href)}
              className={`
                w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                ${action.bgColor} ${action.color}
                transform transition-all duration-200 
                active:scale-95 hover:scale-105
                native-button-press
              `}
            >
              {action.icon}
            </Link>
          </div>
        ))}
      </div>

      {/* Botão principal */}
      <button
        onClick={toggleFAB}
        className={`
          w-14 h-14 rounded-full shadow-xl flex items-center justify-center
          transition-all duration-300 transform
          ${isOpen 
            ? 'bg-gray-600 hover:bg-gray-700 rotate-45' 
            : 'bg-blue-600 hover:bg-blue-700 rotate-0'
          }
          active:scale-95 hover:scale-105
          native-button-press
        `}
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, #4B5563 0%, #374151 100%)'
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
        }}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Plus size={24} className="text-white" />
        )}
      </button>
    </div>
  )
}
