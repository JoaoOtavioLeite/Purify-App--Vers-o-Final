"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    )
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "dark":
        return <Moon className="h-5 w-5 text-blue-400" />
      default:
        return <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Claro"
      case "dark":
        return "Escuro"
      default:
        return "Sistema"
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
      title={`Mudar para próximo tema (atual: ${getLabel()})`}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {getIcon()}
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {getLabel()}
      </span>
    </button>
  )
}

