import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

export function useDevices(options = {}) {
  const { 
    autoRefresh = true, 
    refreshInterval = 30000,
    initialLoad = true 
  } = options
  
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(initialLoad)
  const [error, setError] = useState(null)
  const [isUsingMock, setIsUsingMock] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadDevices = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      const data = await apiService.getDevices({ silent: true })
      
      
      const usingMock = data.length > 0 && 
        (apiService.config.useMock || 
         data[0].hasOwnProperty('description') || 
         data[0].hasOwnProperty('type'))
      
      setIsUsingMock(usingMock)
      setDevices(data)
      setError(null)
      setLastUpdated(new Date())
      
      if (!silent && data.length > 0) {
        console.log(`[useDevices] Carregados ${data.length} dispositivos`)
      }
    } catch (err) {
      setError('Falha ao carregar dispositivos')
      console.error('[useDevices] Erro:', err)
      
      if (!silent) {
        toast.error('Erro ao carregar dispositivos')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  const refreshDevice = useCallback(async (deviceId) => {
    try {
      const status = await apiService.checkDeviceStatus(deviceId)
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { 
              ...device, 
              status: status.status,
              lastCheck: status.timestamp,
              responseTime: status.responseTime,
              updated_at: new Date().toISOString()
            }
          : device
      ))
      
      toast.success(`Status de ${devices.find(d => d.id === deviceId)?.name} atualizado`)
      return status
    } catch (err) {
      toast.error('Falha ao atualizar dispositivo')
      console.error('[useDevices] Erro ao atualizar:', err)
      throw err
    }
  }, [devices])

  const addDevice = useCallback(async (deviceData) => {
    try {
      const newDevice = await apiService.createDevice(deviceData)
      setDevices(prev => [...prev, newDevice])
      setLastUpdated(new Date())
      return newDevice
    } catch (err) {
      console.error('[useDevices] Erro ao adicionar:', err)
      throw err
    }
  }, [])

  const updateDevice = useCallback(async (id, deviceData) => {
    try {
      const updatedDevice = await apiService.updateDevice(id, deviceData)
      setDevices(prev => prev.map(device => 
        device.id === id ? updatedDevice : device
      ))
      setLastUpdated(new Date())
      return updatedDevice
    } catch (err) {
      console.error('[useDevices] Erro ao atualizar:', err)
      throw err
    }
  }, [])

  const deleteDevice = useCallback(async (id) => {
    try {
      await apiService.deleteDevice(id)
      setDevices(prev => prev.filter(device => device.id !== id))
      setLastUpdated(new Date())
      return true
    } catch (err) {
      console.error('[useDevices] Erro ao excluir:', err)
      throw err
    }
  }, [])

  const refreshAll = useCallback(async () => {
    try {
      const checks = await apiService.checkAllDevices()
      
      setDevices(prev => prev.map(device => {
        const check = checks.find(c => c.deviceId === device.id)
        if (check) {
          return {
            ...device,
            status: check.status,
            lastCheck: check.timestamp,
            responseTime: check.responseTime
          }
        }
        return device
      }))
      
      setLastUpdated(new Date())
      toast.success('Todos dispositivos atualizados')
    } catch (err) {
      toast.error('Falha ao atualizar dispositivos')
    }
  }, [])

  // Efeitos
  useEffect(() => {
    if (initialLoad) {
      loadDevices()
    }
  }, [initialLoad, loadDevices])

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      loadDevices(true) 
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, loadDevices])

  return {

    devices,
    loading,
    error,
    isUsingMock,
    lastUpdated,
    
    // Ações
    loadDevices,
    refreshDevice,
    refreshAll,
    addDevice,
    updateDevice,
    deleteDevice,
    
    onlineDevices: devices.filter(d => d.status === 'online').length,
    offlineDevices: devices.filter(d => d.status === 'offline').length,
    slowDevices: devices.filter(d => d.status === 'slow').length,
    deviceTypes: devices.reduce((acc, device) => {
      const type = device.type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {}),
    
    getDevice: (id) => devices.find(d => d.id === id),
    getDevicesByType: (type) => devices.filter(d => d.type === type),
    getDevicesByStatus: (status) => devices.filter(d => d.status === status)
  }
}