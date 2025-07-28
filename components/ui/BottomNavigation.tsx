"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Calendar, Lightbulb, TrendingUp, Settings } from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Visão Geral",
    icon: Menu,
    color: "text-blue-500",
    bg: "bg-blue-100 border-blue-400",
    text: "text-blue-500 font-semibold"
  },
  {
    href: "/motivacao",
    label: "Motivação",
    icon: Lightbulb,
    color: "text-sky-500",
    bg: "bg-sky-100 border-sky-400",
    text: "text-sky-500 font-semibold"
  },
  {
    href: "/estatistica",
    label: "Estatística",
    icon: TrendingUp,
    color: "text-purple-500",
    bg: "bg-purple-100 border-purple-400",
    text: "text-purple-500 font-semibold"
  },
  {
    href: "/definicoes",
    label: "Definições",
    icon: Settings,
    color: "text-gray-600",
    bg: "bg-gray-100 border-gray-300",
    text: "text-gray-600 font-semibold"
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
      <div className="flex justify-around py-2 bg-transparent">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link href={item.href} key={item.href} className="flex flex-col items-center gap-1">
              <span
                className={`rounded-full border-2 p-1 flex items-center justify-center transition-all duration-200
                  ${isActive ? `${item.bg}` : "bg-white/70 border-white"}
                `}
              >
                <item.icon className={`${isActive ? item.color : "text-gray-400"}`} size={24} />
              </span>
              <span className={`text-xs transition-all duration-200 ${isActive ? item.text : "text-gray-400"}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 