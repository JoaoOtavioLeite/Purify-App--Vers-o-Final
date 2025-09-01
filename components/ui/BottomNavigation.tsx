"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Calendar, Lightbulb, TrendingUp, Settings, Shield, Crown, Users } from "lucide-react"
import { useHaptics } from "@/lib/haptics"
const navItems = [
  {
    href: "/",
    label: "Início",
    icon: Menu,
    color: "text-blue-500",
    bg: "bg-gradient-to-br from-blue-500 to-cyan-600",
    activeGlow: "shadow-blue-500/30",
    text: "text-blue-400 font-bold"
  },
  {
    href: "/emergencia",
    label: "SOS",
    icon: Shield,
    color: "text-red-500",
    bg: "bg-gradient-to-br from-red-500 to-pink-600",
    activeGlow: "shadow-red-500/30",
    text: "text-red-400 font-bold"
  },
  {
    href: "/analytics",
    label: "Análise",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
    activeGlow: "shadow-purple-500/30",
    text: "text-purple-400 font-bold"
  },
  {
    href: "/definicoes",
    label: "Menu",
    icon: Settings,
    color: "text-emerald-500",
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    activeGlow: "shadow-emerald-500/30",
    text: "text-emerald-400 font-bold"
  },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const haptics = useHaptics()

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-40">
      {/* Background com blur e gradiente */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-purple-900/90 to-transparent backdrop-blur-xl rounded-t-3xl"></div>
        
        {/* Borda superior brilhante */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        
        {/* Container principal */}
        <div className="relative glass-card border-t border-white/30 rounded-t-2xl mx-2 mb-1 shadow-2xl">
          <div className="flex justify-around py-1 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link 
                  href={item.href} 
                  key={item.href} 
                  className="flex flex-col items-center gap-1 flex-1 relative"
                  onClick={() => {
                    if (item.href === "/emergencia") {
                      haptics.emergency()
                    } else {
                      haptics.light()
                    }
                  }}
                >
                  <div
                    className={`rounded-xl p-2 flex items-center justify-center transition-all duration-500 relative transform
                      ${isActive 
                        ? `${item.bg} shadow-xl ${item.activeGlow} shadow-2xl scale-110` 
                        : "hover:bg-white/15 hover:scale-110 active:scale-95 hover:shadow-lg"
                      }
                    `}
                  >
                    {/* Efeito de brilho interno para item ativo */}
                    {isActive && (
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm"></div>
                    )}
                    
                    <item.icon 
                      className={`${isActive ? "text-white" : "text-white/80"} transition-all duration-300 relative z-10`} 
                      size={18} 
                      strokeWidth={isActive ? 3 : 2}
                    />
                    
                    {/* Indicador de ativo */}
                    {isActive && (
                      <>
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/90 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-pulse"></div>
                      </>
                    )}
                  </div>
                  
                  <span 
                    className={`text-[10px] transition-all duration-300 text-center font-medium tracking-wide
                      ${isActive ? item.text : "text-white/70"}
                    `}
                  >
                    {item.label}
                  </span>
                  
                  {/* Linha de ativo embaixo */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-current rounded-full opacity-60"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 