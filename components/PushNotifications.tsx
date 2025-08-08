"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellOff, Smartphone, Globe } from 'lucide-react'
import { useNotifications } from '@/lib/notifications'

export default function PushNotifications() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const { requestPermission, isDisabledByUser } = useNotifications()

  useEffect(() => {
    // Verificar se já tem permissão para notificações
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted' && !isDisabledByUser())
    }

    // Verificar se o PWA está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    setIsInstalled(isStandalone || isInWebAppiOS)
  }, [isDisabledByUser])

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      // Desabilitar notificações
      setIsEnabled(false)
      localStorage.setItem('notifications_disabled', 'true')
      
      // Mostrar instruções para desabilitar completamente
      alert('Notificações pausadas! Para desabilitar completamente, vá nas configurações do seu navegador > Site Settings > Notificações.')
    } else {
      // Solicitar permissão para notificações
      const granted = await requestPermission()
      if (granted) {
        setIsEnabled(true)
        localStorage.removeItem('notifications_disabled')
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Status do PWA */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          {isInstalled ? (
            <Smartphone className="h-5 w-5 text-blue-600" />
          ) : (
            <Globe className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              Status do App
            </h3>
            <p className="text-sm text-gray-600">
              {isInstalled 
                ? '✅ PWA instalado - Notificações funcionam mesmo com app fechado!' 
                : '📱 Instale o app para melhor experiência com notificações'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Controle de Notificações */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Bell className="h-5 w-5 text-green-600" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              Notificações Push
            </h3>
            <p className="text-sm text-gray-500">
              {isEnabled 
                ? 'Receba lembretes motivacionais e marcos de progresso' 
                : 'Habilite para receber lembretes diários e suporte'
              }
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleToggleNotifications}
          variant={isEnabled ? "destructive" : "default"}
          size="sm"
        >
          {isEnabled ? 'Pausar' : 'Habilitar'}
        </Button>
      </div>

      {/* Informações sobre PWA */}
      {!isInstalled && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">💡 Dica: Instale o PWA</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Para receber notificações mesmo com o navegador fechado, instale o Purify como aplicativo:
          </p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Chrome/Edge:</strong> Ícone de instalação na barra de endereços</li>
            <li>• <strong>Safari (iOS):</strong> Compartilhar → "Adicionar à Tela de Início"</li>
            <li>• <strong>Android:</strong> Menu → "Instalar aplicativo"</li>
          </ul>
        </div>
      )}
    </div>
  )
} 