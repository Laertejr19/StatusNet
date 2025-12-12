
import { IP_REGEX } from './constants.js'


export const isValidIP = (ip) => {
  if (!ip || typeof ip !== 'string') return false
  
  if (!IP_REGEX.test(ip)) return false
  
  const parts = ip.split('.')
  
  
  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255 && part === num.toString()
  })
}

/**
 * Valida nome de dispositivo
 */
export const isValidDeviceName = (name) => {
  if (!name || typeof name !== 'string') return false
  
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= 100
}

/**
 * Valida descrição
 */
export const isValidDescription = (description) => {
  if (!description) return true // Descrição é opcional
  
  if (typeof description !== 'string') return false
  
  const trimmed = description.trim()
  return trimmed.length <= 500 // Máximo 500 caracteres
}

/**
 * Valida localização
 */
export const isValidLocation = (location) => {
  if (!location) return true // Localização é opcional
  
  if (typeof location !== 'string') return false
  
  const trimmed = location.trim()
  return trimmed.length <= 200 // Máximo 200 caracteres
}

/**
 * Valida email para notificações
 */
export const isValidEmail = (email) => {
  if (!email) return true // Email é opcional
  
  if (typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Valida tags
 */
export const isValidTags = (tags) => {
  if (!tags) return true // Tags são opcionais
  
  if (typeof tags !== 'string') return false
  
  const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
  
  // Verifica cada tag
  return tagList.every(tag => {
    return tag.length >= 1 && 
           tag.length <= 50 && 
           /^[a-zA-Z0-9\-_]+$/.test(tag)
  })
}

/**
 * Valida intervalo de polling
 */
export const isValidPollingInterval = (interval) => {
  const validIntervals = [10000, 30000, 60000, 300000, 600000]
  return validIntervals.includes(parseInt(interval))
}

/**
 * Valida dados completos de dispositivo
 */
export const validateDeviceData = (deviceData) => {
  const errors = {}
  
  // Valida nome
  if (!isValidDeviceName(deviceData.name)) {
    errors.name = 'Nome deve ter entre 2 e 100 caracteres'
  }
  
  // Valida IP
  if (!isValidIP(deviceData.ip)) {
    errors.ip = 'Endereço IP inválido (ex: 192.168.1.1)'
  }
  
  // Valida tipo (deve existir)
  if (!deviceData.type) {
    errors.type = 'Tipo de dispositivo é obrigatório'
  }
  
  // Valida localização (se fornecida)
  if (deviceData.location && !isValidLocation(deviceData.location)) {
    errors.location = 'Localização muito longa (máx. 200 caracteres)'
  }
  
  // Valida descrição (se fornecida)
  if (deviceData.description && !isValidDescription(deviceData.description)) {
    errors.description = 'Descrição muito longa (máx. 500 caracteres)'
  }
  
  // Valida email (se fornecido)
  if (deviceData.notificationEmail && !isValidEmail(deviceData.notificationEmail)) {
    errors.notificationEmail = 'Email inválido'
  }
  
  // Valida tags (se fornecidas)
  if (deviceData.tags && !isValidTags(deviceData.tags)) {
    errors.tags = 'Tags inválidas. Use apenas letras, números, hífens e underlines'
  }
  
  // Valida intervalo de polling
  if (deviceData.pollingInterval && !isValidPollingInterval(deviceData.pollingInterval)) {
    errors.pollingInterval = 'Intervalo de verificação inválido'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Valida dados de log
 */
export const validateLogData = (logData) => {
  const errors = {}
  
  // Valida device_id
  if (!logData.device_id || isNaN(parseInt(logData.device_id))) {
    errors.device_id = 'ID do dispositivo é obrigatório'
  }
  
  // Valida status
  const validStatuses = ['online', 'offline', 'slow', 'unknown']
  if (!logData.status || !validStatuses.includes(logData.status)) {
    errors.status = 'Status inválido'
  }
  
  // Valida response_time (se fornecido)
  if (logData.response_time !== undefined && 
      logData.response_time !== null && 
      (isNaN(parseFloat(logData.response_time)) || parseFloat(logData.response_time) < 0)) {
    errors.response_time = 'Tempo de resposta inválido'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Valida configurações
 */
export const validateSettings = (settings) => {
  const errors = {}
  
  // Valida URL da API
  try {
    const url = new URL(settings.apiUrl)
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.apiUrl = 'URL deve usar HTTP ou HTTPS'
    }
  } catch {
    errors.apiUrl = 'URL inválida'
  }
  
  // Valida intervalo de polling
  if (!isValidPollingInterval(settings.pollInterval)) {
    errors.pollInterval = 'Intervalo de verificação inválido'
  }
  
  // Valida tema
  if (!['light', 'dark', 'auto'].includes(settings.theme)) {
    errors.theme = 'Tema inválido'
  }
  
  // Valida idioma
  if (!['pt-BR', 'en-US', 'es-ES'].includes(settings.language)) {
    errors.language = 'Idioma inválido'
  }
  
  // Valida retenção de dados
  if (settings.dataRetention < 0) {
    errors.dataRetention = 'Retenção de dados inválida'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Sanitiza dados de entrada
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[<>"'`]/g, '')  // Remove caracteres perigosos
  }
  return input
}

/**
 * Sanitiza dados de dispositivo
 */
export const sanitizeDeviceData = (deviceData) => {
  const sanitized = { ...deviceData }
  
  // Sanitiza strings
  const stringFields = ['name', 'ip', 'location', 'description', 'tags', 'notificationEmail']
  stringFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeInput(sanitized[field])
    }
  })
  
  // Converte tipos
  if (sanitized.pollingInterval) {
    sanitized.pollingInterval = parseInt(sanitized.pollingInterval)
  }
  
  if (sanitized.critical !== undefined) {
    sanitized.critical = Boolean(sanitized.critical)
  }
  
  return sanitized
}

export default {
  isValidIP,
  isValidDeviceName,
  isValidDescription,
  isValidLocation,
  isValidEmail,
  isValidTags,
  isValidPollingInterval,
  validateDeviceData,
  validateLogData,
  validateSettings,
  sanitizeInput,
  sanitizeDeviceData
}