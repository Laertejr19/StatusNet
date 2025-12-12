// src/styles/theme.js

// Tema claro (padrão)
export const lightTheme = {
    name: 'light',
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      },
      neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
      },
      background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
      },
      text: {
        primary: '#111827',
        secondary: '#374151',
        tertiary: '#6b7280',
        inverted: '#ffffff',
      },
      border: '#e5e7eb',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    transitions: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
  }
  
  // Tema escuro
  export const darkTheme = {
    name: 'dark',
    colors: {
      primary: {
        50: '#1e3a8a',
        100: '#1e40af',
        200: '#1d4ed8',
        300: '#2563eb',
        400: '#3b82f6',
        500: '#60a5fa',
        600: '#93c5fd',
        700: '#bfdbfe',
        800: '#dbeafe',
        900: '#eff6ff',
      },
      success: {
        50: '#14532d',
        100: '#166534',
        200: '#15803d',
        300: '#16a34a',
        400: '#22c55e',
        500: '#4ade80',
        600: '#86efac',
        700: '#bbf7d0',
        800: '#dcfce7',
        900: '#f0fdf4',
      },
      warning: {
        50: '#78350f',
        100: '#92400e',
        200: '#b45309',
        300: '#d97706',
        400: '#f59e0b',
        500: '#fbbf24',
        600: '#fcd34d',
        700: '#fde68a',
        800: '#fef3c7',
        900: '#fffbeb',
      },
      danger: {
        50: '#7f1d1d',
        100: '#991b1b',
        200: '#b91c1c',
        300: '#dc2626',
        400: '#ef4444',
        500: '#f87171',
        600: '#fca5a5',
        700: '#fecaca',
        800: '#fee2e2',
        900: '#fef2f2',
      },
      neutral: {
        50: '#18181b',
        100: '#27272a',
        200: '#3f3f46',
        300: '#52525b',
        400: '#71717a',
        500: '#a1a1aa',
        600: '#d4d4d8',
        700: '#e4e4e7',
        800: '#f4f4f5',
        900: '#fafafa',
      },
      background: {
        primary: '#111827',
        secondary: '#1f2937',
        tertiary: '#374151',
      },
      text: {
        primary: '#f9fafb',
        secondary: '#e5e7eb',
        tertiary: '#9ca3af',
        inverted: '#111827',
      },
      border: '#374151',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
    },
    // O resto das propriedades é o mesmo do tema claro
    typography: lightTheme.typography,
    spacing: lightTheme.spacing,
    borderRadius: lightTheme.borderRadius,
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.5)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.5)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
    },
    transitions: lightTheme.transitions,
  }
  
  // Tema automático (detecta preferência do sistema)
  export const autoTheme = {
    ...lightTheme,
    name: 'auto',
  }
  
  // Função para obter tema atual
  export const getTheme = (themeName = 'light') => {
    switch (themeName) {
      case 'dark':
        return darkTheme
      case 'auto':
        // Verifica preferência do sistema
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return darkTheme
        }
        return lightTheme
      default:
        return lightTheme
    }
  }
  
  // Aplicar tema ao documento
  export const applyTheme = (themeName) => {
    const theme = getTheme(themeName)
    
    // Aplica cores CSS custom properties
    const root = document.documentElement
    
    // Aplica cores primárias
    Object.entries(theme.colors.primary).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value)
    })
    
    // Aplica cores de status
    root.style.setProperty('--color-success', theme.colors.success[500])
    root.style.setProperty('--color-warning', theme.colors.warning[500])
    root.style.setProperty('--color-danger', theme.colors.danger[500])
    
    // Aplica cores de fundo
    root.style.setProperty('--color-bg-primary', theme.colors.background.primary)
    root.style.setProperty('--color-bg-secondary', theme.colors.background.secondary)
    
    // Aplica cores de texto
    root.style.setProperty('--color-text-primary', theme.colors.text.primary)
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary)
    
    // Aplica cor da borda
    root.style.setProperty('--color-border', theme.colors.border)
    
    // Salva preferência no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('netstatus-theme', themeName)
    }
  }
  
  // Verificar tema salvo ou preferência do sistema
  export const getSavedTheme = () => {
    if (typeof window === 'undefined') return 'light'
    
    const saved = localStorage.getItem('netstatus-theme')
    if (saved && ['light', 'dark', 'auto'].includes(saved)) {
      return saved
    }
    
    // Verifica preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'auto'
    }
    
    return 'light'
  }
  
  // Inicializar tema
  export const initializeTheme = () => {
    const themeName = getSavedTheme()
    applyTheme(themeName)
    return themeName
  }
  
  export default {
    lightTheme,
    darkTheme,
    autoTheme,
    getTheme,
    applyTheme,
    getSavedTheme,
    initializeTheme,
  }