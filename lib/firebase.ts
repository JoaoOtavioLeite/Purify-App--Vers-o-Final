// Firebase DISABLED - App funciona completamente offline
// Todo o armazenamento é feito via localStorage
// Removido para evitar problemas de autenticação no Vercel

// Mock para compatibilidade com código existente
export const db = null
export const initAnalytics = async () => null
export const initMessaging = async () => null
export const requestNotificationPermission = async () => null
export const onMessageListener = async () => () => {}