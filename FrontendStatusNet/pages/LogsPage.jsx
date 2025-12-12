import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { apiService } from '../services/api'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function LogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [devices, setDevices] = useState([])
  const [expandedLog, setExpandedLog] = useState(null)
  const [stats, setStats] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [logsData, devicesData] = await Promise.all([
        apiService.getLogs(),
        apiService.getDevices({ silent: true })
      ])
      
      setLogs(logsData)
      setDevices(devicesData)
      
      // Calculate stats
      const totalLogs = logsData.length
      const errorLogs = logsData.filter(log => log.status !== 'online').length
      const avgResponse = logsData.reduce((sum, log) => sum + (log.response_time || 0), 0) / totalLogs
      
      setStats({
        totalLogs,
        errorLogs,
        errorRate: totalLogs > 0 ? ((errorLogs / totalLogs) * 100).toFixed(1) : 0,
        avgResponse: avgResponse.toFixed(0),
        lastUpdate: new Date().toISOString()
      })
    } catch (error) {
      console.error('Erro ao carregar logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.device_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase()) ||
      log.device_ip?.includes(search)
    
    const matchesDevice = 
      deviceFilter === 'all' || 
      log.device_id?.toString() === deviceFilter
    
    const matchesStatus = 
      statusFilter === 'all' || 
      log.status === statusFilter
    

    const logDate = new Date(log.timestamp)
    const now = new Date()
    let matchesDate = true
    
    switch (dateRange) {
      case 'today':
        matchesDate = logDate.toDateString() === now.toDateString()
        break
      case 'yesterday':
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        matchesDate = logDate.toDateString() === yesterday.toDateString()
        break
      case 'week':
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesDate = logDate >= weekAgo
        break
      case 'month':
        const monthAgo = new Date(now)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        matchesDate = logDate >= monthAgo
        break
      default:
        matchesDate = true
    }
    
    return matchesSearch && matchesDevice && matchesStatus && matchesDate
  })

  const formatDateTime = (dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
    } catch {
      return dateString
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    
    if (diffMins < 1) return 'Agora mesmo'
    if (diffMins < 60) return `Há ${diffMins} min`
    if (diffHours < 24) return `Há ${diffHours} h`
    return `Há ${diffDays} dias`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800'
      case 'slow': return 'bg-yellow-100 text-yellow-800'
      case 'offline': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Dispositivo', 'IP', 'Status', 'Tempo de Resposta', 'Detalhes'],
      ...filteredLogs.map(log => [
        formatDateTime(log.timestamp),
        log.device_name,
        log.device_ip,
        log.status,
        log.response_time ? `${log.response_time}ms` : 'N/A',
        log.details || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Logs</h1>
          <p className="text-gray-600 mt-1">
            Registro de todas as verificações de status
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
          <button
            onClick={exportLogs}
            className="btn btn-primary flex items-center gap-2"
            disabled={filteredLogs.length === 0}
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.totalLogs}</div>
            <div className="text-sm text-gray-600">Total de Verificações</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">{stats.errorLogs}</div>
            <div className="text-sm text-gray-600">Falhas Detectadas</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.errorRate}%</div>
            <div className="text-sm text-gray-600">Taxa de Erro</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.avgResponse}ms</div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar em logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Device Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dispositivo
            </label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos Dispositivos</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">Todos Status</option>
              <option value="online">Online</option>
              <option value="slow">Lento</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input"
            >
              <option value="today">Hoje</option>
              <option value="yesterday">Ontem</option>
              <option value="week">Últimos 7 dias</option>
              <option value="month">Últimos 30 dias</option>
              <option value="all">Todo período</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600">Carregando logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-12 text-center">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum log encontrado</h3>
              <p className="text-gray-600">
                {search || deviceFilter !== 'all' || statusFilter !== 'all' || dateRange !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Nenhum registro de log disponível'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Dispositivo</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Tempo</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.slice(0, 50).map(log => (
                  <>
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDateTime(log.timestamp)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTimeAgo(log.timestamp)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{log.device_name}</div>
                        <div className="text-sm text-gray-500 font-mono">{log.device_ip}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status === 'online' ? '✅ Online' :
                           log.status === 'slow' ? '⚠️ Lento' :
                           '❌ Offline'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {log.response_time ? (
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="font-mono">{log.response_time}ms</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedLog === log.id ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log.id && (
                      <tr className="bg-blue-50">
                        <td colSpan="5" className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle size={16} className="text-blue-600" />
                              <h4 className="font-medium text-gray-900">Detalhes do Log</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs text-gray-500">ID do Log</label>
                                <div className="font-mono text-sm">{log.id}</div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">ID do Dispositivo</label>
                                <div className="font-mono text-sm">{log.device_id}</div>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Perda de Pacotes</label>
                                <div className="text-sm">
                                  {log.packet_loss !== undefined ? `${log.packet_loss}%` : 'N/A'}
                                </div>
                              </div>
                            </div>
                            {log.details && (
                              <div className="mt-2">
                                <label className="text-xs text-gray-500">Mensagem</label>
                                <div className="text-sm p-2 bg-white rounded border">{log.details}</div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1-{Math.min(50, filteredLogs.length)}</span> de{' '}
              <span className="font-medium">{filteredLogs.length}</span> logs
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50">
                Anterior
              </button>
              <span className="px-3 py-1 bg-primary-600 text-white rounded">1</span>
              <button className="px-3 py-1 rounded border hover:bg-gray-50">
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}