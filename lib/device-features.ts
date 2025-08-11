/**
 * Utilitários para integração com funcionalidades nativas do dispositivo
 */

// Detecção de dispositivo e plataforma
export const DeviceDetection = {
  isIOS: (): boolean => {
    if (typeof navigator === 'undefined') return false
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  },

  isAndroid: (): boolean => {
    if (typeof navigator === 'undefined') return false
    return /Android/.test(navigator.userAgent)
  },

  isMobile: (): boolean => {
    if (typeof navigator === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  },

  isStandalone: (): boolean => {
    if (typeof window === 'undefined') return false
    // Verifica se o PWA está rodando como app instalado
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  },

  getDeviceInfo: () => {
    if (typeof navigator === 'undefined') {
      return {
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        isStandalone: false,
        userAgent: '',
        platform: '',
        language: 'pt-BR',
      }
    }
    
    return {
      isIOS: DeviceDetection.isIOS(),
      isAndroid: DeviceDetection.isAndroid(),
      isMobile: DeviceDetection.isMobile(),
      isStandalone: DeviceDetection.isStandalone(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    }
  }
}

// Gestão de orientação da tela
export const ScreenOrientation = {
  lock: async (orientation: 'portrait' | 'landscape'): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false
      if ('screen' in window && 'orientation' in window.screen && 'lock' in window.screen.orientation) {
        await window.screen.orientation.lock(orientation)
        return true
      }
      return false
    } catch (error) {
      console.warn('Orientation lock not supported or failed:', error)
      return false
    }
  },

  unlock: async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined') return false
      if ('screen' in window && 'orientation' in window.screen && 'unlock' in window.screen.orientation) {
        window.screen.orientation.unlock()
        return true
      }
      return false
    } catch (error) {
      console.warn('Orientation unlock not supported or failed:', error)
      return false
    }
  },

  onChange: (callback: (orientation: string) => void) => {
    if (typeof window === 'undefined') return
    if ('screen' in window && 'orientation' in window.screen) {
      window.screen.orientation.addEventListener('change', () => {
        callback(window.screen.orientation.type)
      })
    }
  }
}

// Wake Lock - manter tela ligada
export const WakeLock = {
  request: async (): Promise<WakeLockSentinel | null> => {
    try {
      if (typeof navigator === 'undefined') return null
      if ('wakeLock' in navigator) {
        const wakeLock = await navigator.wakeLock.request('screen')
        return wakeLock
      }
      return null
    } catch (error) {
      console.warn('Wake Lock not supported or failed:', error)
      return null
    }
  },

  release: async (wakeLock: WakeLockSentinel | null): Promise<void> => {
    try {
      if (wakeLock) {
        await wakeLock.release()
      }
    } catch (error) {
      console.warn('Wake Lock release failed:', error)
    }
  }
}

// Compartilhamento nativo
export const NativeShare = {
  isSupported: (): boolean => {
    if (typeof navigator === 'undefined') return false
    return 'share' in navigator
  },

  share: async (data: {
    title?: string
    text?: string
    url?: string
  }): Promise<boolean> => {
    try {
      if (typeof navigator === 'undefined') return false
      
      if (NativeShare.isSupported()) {
        // Tentar compartilhamento nativo
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url
        })
        return true
      } else {
        // Fallback para clipboard com texto completo
        if ('clipboard' in navigator) {
          const fullText = `${data.title || ''}\n\n${data.text || ''}\n\n${data.url || ''}`
          await navigator.clipboard.writeText(fullText.trim())
          return true
        }
        return false
      }
    } catch (error) {
      // Se o usuário cancelou o compartilhamento, não é um erro real
      if (error.name === 'AbortError') {
        console.log('Compartilhamento cancelado pelo usuário')
        return true // Retorna true pois não é um erro técnico
      }
      console.warn('Native share failed:', error)
      return false
    }
  }
}

// Status da bateria
export const BatteryStatus = {
  get: async () => {
    try {
      if (typeof navigator === 'undefined') return null
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery()
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        }
      }
      return null
    } catch (error) {
      console.warn('Battery API not supported:', error)
      return null
    }
  }
}

// Acesso à câmera/foto
export const MediaAccess = {
  takePicture: async (): Promise<string | null> => {
    try {
      if (typeof navigator === 'undefined') return null
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        
        // Aqui você precisaria implementar a captura da foto
        // usando canvas ou MediaRecorder
        return 'data:image/jpeg;base64,...' // placeholder
      }
      return null
    } catch (error) {
      console.warn('Camera access failed:', error)
      return null
    }
  },

  selectFromGallery: (): Promise<File | null> => {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') {
        resolve(null)
        return
      }
      
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        resolve(file || null)
      }
      input.click()
    })
  }
}

// Notificações em tela cheia
export const FullScreenNotification = {
  show: (title: string, message: string, urgent = false) => {
    if (typeof document === 'undefined') return
    if (!DeviceDetection.isStandalone()) return

    const notification = document.createElement('div')
    notification.className = `
      fixed top-0 left-0 right-0 z-[9999] p-4 
      ${urgent ? 'bg-red-600' : 'bg-blue-600'} 
      text-white shadow-lg transform -translate-y-full 
      transition-transform duration-300 ease-out
    `
    
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-semibold">${title}</h3>
          <p class="text-sm opacity-90">${message}</p>
        </div>
        <button class="text-white/80 hover:text-white" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `

    document.body.appendChild(notification)
    
    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateY(0)'
    }, 10)

    // Auto-remover após 5 segundos
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)'
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove()
        }
      }, 300)
    }, 5000)
  }
}

// Hook React para usar funcionalidades do dispositivo
export const useDeviceFeatures = () => {
  const deviceInfo = DeviceDetection.getDeviceInfo()

  return {
    deviceInfo,
    orientation: ScreenOrientation,
    wakeLock: WakeLock,
    share: NativeShare,
    battery: BatteryStatus,
    media: MediaAccess,
    notification: FullScreenNotification,
  }
}
