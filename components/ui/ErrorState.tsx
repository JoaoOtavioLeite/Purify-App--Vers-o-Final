"use client"

import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  showHomeButton?: boolean
  size?: "sm" | "md" | "lg"
}

export function ErrorState({
  title = "Oops! Algo deu errado",
  message = "Não foi possível carregar esta seção. Tente novamente.",
  onRetry,
  showHomeButton = true,
  size = "md"
}: ErrorStateProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-16", 
    lg: "py-24"
  }

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64
  }

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} px-6 text-center`}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle 
          className="text-red-600 dark:text-red-400" 
          size={iconSizes[size] * 0.6} 
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
        {message}
      </p>
      
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </button>
        )}
        
        {showHomeButton && (
          <Link 
            href="/"
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl transition-colors"
          >
            <Home size={16} />
            Voltar ao Início
          </Link>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 max-w-md">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          <strong>💡 Dica:</strong> Se o problema persistir, verifique sua conexão com a internet ou tente reiniciar o app.
        </p>
      </div>
    </div>
  )
}

// Estados de erro específicos
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Sem Conexão"
      message="Verifique sua conexão com a internet e tente novamente. O app também funciona offline com dados salvos."
      onRetry={onRetry}
    />
  )
}

export function DataErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Erro ao Carregar Dados"
      message="Não foi possível carregar seus dados. Seus dados estão seguros, tente novamente em alguns segundos."
      onRetry={onRetry}
    />
  )
}

export function NotFoundState() {
  return (
    <ErrorState
      title="Página Não Encontrada"
      message="A página que você está procurando não existe ou foi movida."
      showHomeButton={true}
    />
  )
}
