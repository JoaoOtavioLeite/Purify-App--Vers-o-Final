"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellOff } from 'lucide-react'
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase'
import { toast } from 'sonner'

export default function PushNotifications() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se já tem permissão
    if ('Notification' in window) {
      setIsEnabled(Notification.permission === 'granted')
    }

    // Escutar mensagens em foreground
    const setupMessageListener = async () => {
      try {
        await onMessageListener((payload) => {
          console.log('Mensagem recebida em foreground:', payload)
          toast.success(payload.notification?.title || 'Nova notificação!', {
            description: payload.notification?.body
          })
        })
      } catch (error) {
        console.error('Erro ao configurar listener:', error)
      }
    }

    setupMessageListener()
  }, [])

  const handleToggleNotifications = async () => {
    if (isEnabled) {
      // Desabilitar (apenas visualmente, não há como revogar permissão)
      setIsEnabled(false)
      setToken(null)
      toast.info('Notificações desabilitadas')
    } else {
      // Solicitar permissão
      const fcmToken = await requestNotificationPermission()
      if (fcmToken) {
        setToken(fcmToken)
        setIsEnabled(true)
        toast.success('Notificações habilitadas!', {
          description: 'Você receberá lembretes motivacionais'
        })
        
        // Aqui você pode salvar o token no Firestore
        // saveTokenToFirestore(fcmToken)
      } else {
        toast.error('Permissão negada para notificações')
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