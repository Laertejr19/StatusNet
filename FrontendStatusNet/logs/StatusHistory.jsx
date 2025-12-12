import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend
} from 'recharts'
import { format, parseISO, subHours } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useLogs } from '../../hooks/useLogs'
import { LoadingSpinner } from '../common/LoadingSpinner'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border min-w-[200px]">
        <p className="font-medium text-gray-900 mb-2">
          {format(parseISO(label), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </div>
              <span className="text-sm font-semibold">
                {entry.name === 'Status' 
                  ? (entry.value === 1 ? '✅ Online' : '❌ Offline')
                  : `${entry.value}ms`
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function StatusHistory({ 
  deviceId, 
  hours = 24,
  showResponseTime = true,
  height = 300 
}) {
  const { logs, loading, stats } = useLogs({ deviceId })
  const [timeRange, setTimeRange] = useState(hours)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (logs.length > 0) {
      
      const cutoffTime = subHours(new Date(), timeRange)
      const filteredLogs = logs.filter(log => 
        new Date(log.timestamp) >= cutoffTime
      )

      
      const preparedData = filteredLogs.map(log => ({
        timestamp: log.timestamp,
        time: format(parseISO(log.timestamp), 'HH:mm'),
        status: log.status === 'online' ? 1 : 0,
        responseTime: log.response_time || 0,
        date: format(parseISO(log.timestamp), 'dd/MM HH:mm')
      }))

      
      const groupedData = preparedData.reduce((acc, log) => {
        const hour = format(parseISO(log.timestamp), 'HH:00')
        if (!acc[hour]) {
          acc[hour] = {
            time: hour,
            status: 0,
            responseTime: 0,
            count: 0
          }
        }
        acc[hour].status += log.status
        acc[hour].responseTime += log.responseTime
        acc[hour].count += 1
        return acc
      }, {})

      // Calcula médias
      const finalData = Object.values(groupedData).map(item => ({
        ...item,
        status: item.status / item.count,
        responseTime: item.responseTime / item.count
      }))

      setChartData(finalData)
    } else {
      setChartData([])
    }
  }, [logs, timeRange, deviceId])

  const timeRanges = [
    { value: 1, label: '1 hora' },
    { value: 6, label: '6 horas' },
    { value: 12, label: '12 horas' },
    { value: 24, label: '24 horas' },
    { value: 48, label: '2 dias' },
    { value: 168, label: '7 dias' }
  ]

  if (loading) {
    return <LoadingSpinner text="Carregando histórico..." />
  }

  if (logs.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>Nenhum histórico disponível</p>
          <p className="text-sm mt-1">O dispositivo ainda não tem logs registrados.</p>
        </div>
      </div>
    )
  }

  if (chartData.length < 2) {
    const sampleData = Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 2}:00`,
      status: Math.random() > 0.2 ? 1 : 0,
      responseTime: Math.floor(Math.random() * 100) + 10
    }))

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Histórico de Status</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Período:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[0, 1]}
                tickFormatter={(value) => value === 1 ? 'Online' : 'Offline'}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="status" 
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Status"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Dados de exemplo - Aguardando logs reais do dispositivo
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-gray-900">Histórico de Status</h3>
          {stats && (
            <p className="text-sm text-gray-600">
              Disponibilidade: <span className="font-semibold">{stats.onlinePercentage.toFixed(1)}%</span>
              {' • '}
              Tempo médio: <span className="font-semibold">{stats.avgResponse}ms</span>
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Período:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="text-sm border rounded px-2 py-1 bg-white"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={12}
              domain={[0, 1]}
              tickFormatter={(value) => value === 1 ? 'Online' : 'Offline'}
            />
            {showResponseTime && (
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#10b981"
                fontSize={12}
                domain={['dataMin - 10', 'dataMax + 10']}
                tickFormatter={(value) => `${value}ms`}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="status" 
              stroke="#3b82f6" 
              fill="url(#colorStatus)"
              strokeWidth={2}
              name="Status"
              activeDot={{ r: 6 }}
            />
            {showResponseTime && (
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="responseTime" 
                stroke="#10b981" 
                fill="url(#colorResponse)"
                strokeWidth={2}
                name="Tempo de Resposta"
                fillOpacity={0.3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Status (Online/Offline)</span>
        </div>
        {showResponseTime && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Tempo de Resposta (ms)</span>
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.online}</div>
            <div className="text-sm text-gray-600">Online</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.offline}</div>
            <div className="text-sm text-gray-600">Offline</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.slow}</div>
            <div className="text-sm text-gray-600">Lento</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.onlinePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Disponibilidade</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatusHistory