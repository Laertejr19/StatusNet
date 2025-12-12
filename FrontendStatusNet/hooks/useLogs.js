import { useState, useEffect, useCallback } from 'react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

export function useLogs(options = {}) {
  const {
    deviceId = null,
    limit = 100,
    autoRefresh = false,
    refreshInterval = 30000,
    initialLoad = true
  } = options

  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(initialLoad)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      const logsData = await apiService.getLogs(deviceId)
      
     
      const sortedLogs = [...logsData].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      
     
      const limitedLogs = sortedLogs.slice(0, limit)
      
      setLogs(limitedLogs)
      setError(null)
      setLastUpdated(new Date())
      
      
      if (limitedLogs.length > 0) {
        const total = limitedLogs.length
        const online = limitedLogs.filter(log => log.status === 'online').length
        const offline = limitedLogs.filter(log => log.status === 'offline').length
        const slow = limitedLogs.filter(log => log.status === 'slow').length
        
        const responseTimes = limitedLogs
          .map(log => log.response_time)
          .filter(time => time !== null && time !== undefined)
        
        const avgResponse = responseTimes.length > 0
          ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
          : 0
        
        setStats({
          total,
          online,
          offline,
          slow,
          onlinePercentage: total > 0 ? (online / total) * 100 : 0,
          avgResponse: Math.round(avgResponse),
          lastLog: limitedLogs[0]?.timestamp,
          firstLog: limitedLogs[limitedLogs.length - 1]?.timestamp
        })
      }
      
      if (!silent && limitedLogs.length > 0) {
        console.log(`[useLogs] Carregados ${limitedLogs.length} logs`)
      }
    } catch (err) {
      setError('Falha ao carregar logs')
      console.error('[useLogs] Erro:', err)
      
      if (!silent) {
        toast.error('Erro ao carregar logs')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [deviceId, limit])

  const addLog = useCallback(async (logData) => {
    try {
      const newLog = await apiService.createLog(logData)
      
      
      setLogs(prev => [newLog, ...prev.slice(0, limit - 1)])
      setLastUpdated(new Date())
      
      return newLog
    } catch (err) {
      console.error('[useLogs] Erro ao adicionar log:', err)
      throw err
    }
  }, [limit])

  const clearLogs = useCallback(async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os logs?')) {
      setLogs([])
      setStats(null)
      setLastUpdated(new Date())
      toast.success('Logs limpos')
    }
  }, [])

  const exportLogs = useCallback(() => {
    if (logs.length === 0) {
      toast.error('Nenhum log para exportar')
      return
    }

    try {
      
      const headers = ['Data/Hora', 'Dispositivo', 'IP', 'Status', 'Tempo de Resposta (ms)', 'Detalhes']
      const rows = logs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.device_name || `Dispositivo ${log.device_id}`,
        log.device_ip || 'N/A',
        log.status,
        log.response_time || '',
        log.details || ''
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      // Cria e baixa arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `logs_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Logs exportados com sucesso!')
    } catch (err) {
      console.error('[useLogs] Erro ao exportar logs:', err)
      toast.error('Erro ao exportar logs')
    }
  }, [logs])

  const filterByStatus = useCallback((status) => {
    return logs.filter(log => log.status === status)
  }, [logs])

  const filterByDateRange = useCallback((startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    })
  }, [logs])

  const getDeviceLogs = useCallback((deviceId) => {
    return logs.filter(log => log.device_id === deviceId)
  }, [logs])

  
  useEffect(() => {
    if (initialLoad) {
      loadLogs()
    }
  }, [initialLoad, loadLogs])

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      loadLogs(true) 
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, loadLogs])

  return {
    
    logs,
    loading,
    error,
    stats,
    lastUpdated,
    
  
    loadLogs,
    addLog,
    clearLogs,
    exportLogs,
    
   
    filterByStatus,
    filterByDateRange,
    getDeviceLogs,
    
    
    totalLogs: logs.length,
    onlineLogs: logs.filter(log => log.status === 'online').length,
    offlineLogs: logs.filter(log => log.status === 'offline').length,
    slowLogs: logs.filter(log => log.status === 'slow').length,
    
    // Utilitários
    getLatestLogs: (count = 10) => logs.slice(0, count),
    getLog: (id) => logs.find(log => log.id === id),
    hasErrors: logs.some(log => log.status !== 'online')
  }
}