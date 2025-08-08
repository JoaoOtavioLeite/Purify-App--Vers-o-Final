"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellOff } from 'lucide-react'

export default function PushNotifications() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Verificar se já tem permissão para notificações nativas
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted')
    }
  }, [])

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      // Desabilitar notificações
      setIsEnabled(false)
      localStorage.setItem('notifications_enabled', 'false')
      alert('Notificações desabilitadas')
    } else {
      // Solicitar permissão para notificações nativas
      if ('Notification' in window) {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          setIsEnabled(true)
          localStorage.setItem('notifications_enabled', 'true')
          alert('Notificações habilitadas! Você receberá lembretes motivacionais.')
          
          // Teste de notificação
          new Notification('Purify App', {
            body: 'Notificações ativadas com sucesso!',
            icon: '/icon-192.png'
          })
        } else {
          alert('Permissão negada para notificações')
        }
      } else {
        alert('Seu navegador não suporta notificações')
      }
    }
  }

  return (
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
              ? 'Receba lembretes e motivação diária' 
              : 'Habilite para receber lembretes'
            }
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleToggleNotifications}
        variant={isEnabled ? "destructive" : "default"}
        size="sm"
      >
        {isEnabled ? 'Desabilitar' : 'Habilitar'}
      </Button>
    </div>
  )
} 