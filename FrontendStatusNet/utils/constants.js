// src/utils/constants.js

// Status dos dispositivos
export const DEVICE_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    SLOW: 'slow',
    UNKNOWN: 'unknown'
  }
  
  // Tipos de dispositivos
  export const DEVICE_TYPES = {
    SERVER: 'server',
    ROUTER: 'router',
    SWITCH: 'switch',
    ACCESS_POINT: 'access-point',
    FIREWALL: 'firewall',
    NAS: 'nas',
    CAMERA: 'camera',
    OTHER: 'other'
  }
  
  // Mapeamento de tipos para nomes amigáveis
  export const DEVICE_TYPE_NAMES = {
    [DEVICE_TYPES.SERVER]: 'Servidor',
    [DEVICE_TYPES.ROUTER]: 'Roteador',
    [DEVICE_TYPES.SWITCH]: 'Switch',
    [DEVICE_TYPES.ACCESS_POINT]: 'Access Point',
    [DEVICE_TYPES.FIREWALL]: 'Firewall',
    [DEVICE_TYPES.NAS]: 'NAS Storage',
    [DEVICE_TYPES.CAMERA]: 'Câmera',
    [DEVICE_TYPES.OTHER]: 'Outro'
  }
  
  // Cores para cada status
  export const STATUS_COLORS = {
    [DEVICE_STATUS.ONLINE]: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-500',
      hex: '#10b981'
    },
    [DEVICE_STATUS.OFFLINE]: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-500',
      hex: '#ef4444'
    },
    [DEVICE_STATUS.SLOW]: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-500',
      hex: '#f59e0b'
    },
    [DEVICE_STATUS.UNKNOWN]: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-500',
      hex: '#6b7280'
    }
  }
  
  // Ícones para cada tipo de dispositivo
  export const DEVICE_ICONS = {
    [DEVICE_TYPES.SERVER]: 'Server',
    [DEVICE_TYPES.ROUTER]: 'Router',
    [DEVICE_TYPES.SWITCH]: 'Cpu',
    [DEVICE_TYPES.ACCESS_POINT]: 'Wifi',
    [DEVICE_TYPES.FIREWALL]: 'Shield',
    [DEVICE_TYPES.NAS]: 'Database',
    [DEVICE_TYPES.CAMERA]: 'Camera',
    [DEVICE_TYPES.OTHER]: 'Server'
  }
  
  // Intervalos de polling (em milissegundos)
  export const POLLING_INTERVALS = {
    FAST: 10000,     // 10 segundos
    NORMAL: 30000,   // 30 segundos
    SLOW: 60000,     // 1 minuto
    VERY_SLOW: 300000 // 5 minutos
  }
  
  // Configurações padrão
  export const DEFAULT_SETTINGS = {
    API_URL: 'http://localhost:3000',
    USE_MOCK: true,
    POLL_INTERVAL: POLLING_INTERVALS.NORMAL,
    THEME: 'light',
    LANGUAGE: 'pt-BR',
    NOTIFICATIONS: {
      email: true,
      push: false,
      criticalOnly: true,
      sound: true
    }
  }
  
  // Chaves do localStorage
  export const STORAGE_KEYS = {
    SETTINGS: 'netstatus-settings',
    DEVICES: 'netstatus-devices',
    LOGS: 'netstatus-logs',
    THEME: 'netstatus-theme'
  }
  
  // Mensagens de erro
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Erro de conexão com o servidor',
    DEVICE_NOT_FOUND: 'Dispositivo não encontrado',
    INVALID_IP: 'Endereço IP inválido',
    REQUIRED_FIELD: 'Este campo é obrigatório',
    BACKEND_OFFLINE: 'Backend offline. Usando dados de demonstração.'
  }
  
  // URLs da API (baseado no backend do seu colega)
  export const API_ENDPOINTS = {
    DEVICES: '/devices',
    DEVICE_BY_ID: '/devices/:id',
    LOGS: '/logs',
    LOG_BY_ID: '/logs/:id',
    // Endpoints que seu colega DEVERIA implementar:
    STATS: '/stats',
    PING_DEVICE: '/ping/:id',
    CHECK_ALL: '/check-all'
  }
  
  // Tempos limite (em milissegundos)
  export const TIMEOUTS = {
    API_REQUEST: 8000,
    CONNECTION_TEST: 3000,
    TOAST: 4000,
    DEBOUNCE: 300
  }
  
  // Validação de IP
  export const IP_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/
  
  export default {
    DEVICE_STATUS,
    DEVICE_TYPES,
    DEVICE_TYPE_NAMES,
    STATUS_COLORS,
    DEVICE_ICONS,
    POLLING_INTERVALS,
    DEFAULT_SETTINGS,
    STORAGE_KEYS,
    ERROR_MESSAGES,
    API_ENDPOINTS,
    TIMEOUTS,
    IP_REGEX
  }