"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Calendar, Lightbulb, TrendingUp, Settings, Shield } from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Início",
    icon: Menu,
    color: "text-blue-600",
    bg: "bg-blue-100",
    text: "text-blue-600 font-semibold"
  },
  {
    href: "/emergencia",
    label: "SOS",
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-100",
    text: "text-red-600 font-semibold"
  },
  {
    href: "/estatistica",
    label: "Progresso",
    icon: TrendingUp,
    color: "text-purple-600",
    bg: "bg-purple-100",
    text: "text-purple-600 font-semibold"
  },
  {
    href: "/definicoes",
    label: "Menu",
    icon: Settings,
    color: "text-gray-700",
    bg: "bg-gray-100",
    text: "text-gray-700 font-semibold"
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200/50 rounded-t-3xl shadow-2xl mx-2 mb-2">
        <div className="flex justify-around py-3 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link href={item.href} key={item.href} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`rounded-2xl p-3 flex items-center justify-center transition-all duration-300 relative
                    ${isActive 
                      ? `${item.bg} shadow-md` 
                      : "hover:bg-gray-100/50 hover:scale-105 active:scale-95"
                    }
                  `}
                >
                  <item.icon 
                    className={`${isActive ? item.color : "text-gray-700"} transition-colors duration-300`} 
                    size={24} 
                    strokeWidth={2.5}
                  />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full opacity-60"></div>
                  )}
                </div>
                <span 
                  className={`text-xs transition-all duration-300 text-center font-medium
                    ${isActive ? item.text : "text-gray-500"}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 