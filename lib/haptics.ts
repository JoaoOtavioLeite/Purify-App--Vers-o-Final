/**
 * Utilitários para Feedback Tátil (Haptic Feedback)
 * Simula vibração nativa em dispositivos móveis
 */

export class HapticFeedback {
  static isSupported(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false
    }
    return 'vibrate' in navigator || 'Vibration' in window
  }

  /**
   * Feedback leve para interações básicas (botões, taps)
   */
  static light() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.(10) // 10ms - muito sutil
    }
  }

  /**
   * Feedback médio para ações importantes (confirmações)
   */
  static medium() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.(25) // 25ms
    }
  }

  /**
   * Feedback forte para ações críticas (avisos, erro)
   */
  static heavy() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.(50) // 50ms
    }
  }

  /**
   * Padrão de sucesso (2 toques rápidos)
   */
  static success() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.([10, 50, 10])
    }
  }

  /**
   * Padrão de erro (3 toques)
   */
  static error() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.([50, 100, 50, 100, 50])
    }
  }

  /**
   * Padrão de notificação (vibração longa + pausa + curta)
   */
  static notification() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.([200, 100, 50])
    }
  }

  /**
   * Para botões de ação crítica (SOS)
   */
  static emergency() {
    if (HapticFeedback.isSupported() && typeof navigator !== 'undefined') {
      navigator.vibrate?.([100, 50, 100, 50, 100])
    }
  }
}

// Hook personalizado para usar haptics facilmente
export const useHaptics = () => {
  return {
    light: HapticFeedback.light,
    medium: HapticFeedback.medium,
    heavy: HapticFeedback.heavy,
    success: HapticFeedback.success,
    error: HapticFeedback.error,
    notification: HapticFeedback.notification,
    emergency: HapticFeedback.emergency,
    isSupported: HapticFeedback.isSupported(),
  }
}
