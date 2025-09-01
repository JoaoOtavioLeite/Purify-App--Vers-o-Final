// Sistema de cores personalizado para o Purify App

export const colors = {
  // Cores principais
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Cores neutras suaves
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Cores de superfície
  surface: {
    background: '#f8fafc',
    card: '#ffffff',
    cardAlt: '#f1f5f9',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
  },
  
  // Cores de status
  status: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
  
  // Gradientes principais
  gradients: {
    primary: 'from-blue-500 to-indigo-600',
    secondary: 'from-slate-100 to-slate-200',
    success: 'from-emerald-500 to-teal-600',
    warning: 'from-amber-500 to-orange-600',
    error: 'from-red-500 to-pink-600',
  }
}

export const appTheme = {
  // Background principal
  background: 'bg-slate-50',
  
  // Cards e superfícies
  card: 'bg-white border border-slate-200/60 shadow-sm',
  cardHover: 'hover:shadow-md hover:border-slate-300/60',
  
  // Textos
  textPrimary: 'text-slate-700',
  textSecondary: 'text-slate-500',
  textMuted: 'text-slate-400',
  
  // Botões primários
  buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
  buttonSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  
  // Headers
  header: 'bg-gradient-to-r from-blue-500 to-indigo-600',
}

