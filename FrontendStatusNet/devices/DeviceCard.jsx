import { useState } from 'react'
import {
  Server,
  Router,
  Cpu,
  Camera,
  Database,
  Shield,
  Wifi,
  WifiOff,
  AlertTriangle,
  Clock,
  MapPin,
  RefreshCw,
  Edit2,
  Trash2,
  MoreVertical,
  BarChart3
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const deviceIcons = {
  server: Server,
  router: Router,
  switch: Cpu,
  'access-point': Wifi,
  firewall: Shield,
  nas: Database,
  camera: Camera,
  default: Server
}

const statusConfig = {
  online: {
    color: 'border-l-green-500 bg-green-50',
    badge: 'status-online',
    icon: Wifi,
    text: 'Online'
  },
  offline: {
    color: 'border-l-red-500 bg-red-50',
    badge: 'status-offline',
    icon: WifiOff,
    text: 'Offline'
  },
  slow: {
    color: 'border-l-yellow-500 bg-yellow-50',
    badge: 'status-slow',
    icon: AlertTriangle,
    text: 'Lento'
  },
  unknown: {
    color: 'border-l-gray-500 bg-gray-50',
    badge: 'status-unknown',
    icon: Clock,
    text: 'Desconhecido'
  }
}

const typeNames = {
  server: 'Servidor',
  router: 'Roteador',
  switch: 'Switch',
  'access-point': 'Access Point',
  firewall: 'Firewall',
  nas: 'NAS Storage',
  camera: 'Câmera',
  default: 'Dispositivo'
}

export function DeviceCard({ 
  device, 
  onRefresh, 
  onEdit, 
  onDelete,
  showActions = true,
  compact = false 
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const DeviceIcon = deviceIcons[device.type] || deviceIcons.default
  const status = statusConfig[device.status] || statusConfig.unknown
  const StatusIcon = status.icon
  const typeName = typeNames[device.type] || typeNames.default

  const handleRefresh = async () => {
    if (!onRefresh) return
    
    setIsRefreshing(true)
    try {
      await onRefresh(device.id)
      toast.success(`${device.name} atualizado`)
    } catch (error) {
      toast.error('Falha ao atualizar dispositivo')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir "${device.name}"?`)) {
      onDelete?.(device.id)
    }
  }

  const lastCheck = new Date(device.lastCheck)
  const timeDiff = Math.floor((new Date() - lastCheck) / 1000)
  const timeAgo = timeDiff < 60 ? 'Agora mesmo' :
                  timeDiff < 3600 ? `${Math.floor(timeDiff / 60)} min` :
                  `${Math.floor(timeDiff / 3600)} h`

  if (compact) {
    return (
      <div className={`p-4 rounded-lg border-l-4 ${status.color} relative`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${status.badge.replace('status-', 'bg-')} bg-opacity-20`}>
              <DeviceIcon size={20} className={status.badge.replace('status-', 'text-')} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{device.name}</h3>
              <p className="text-sm text-gray-600">{device.ip}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`status-badge ${status.badge}`}>
              <StatusIcon size={12} />
              {status.text}
            </span>
            {device.responseTime && (
              <span className="text-sm text-gray-500">{device.responseTime}ms</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`card border-l-4 ${status.color} relative hover:shadow-card-hover transition-all duration-200`}>
      {/* Status Badge */}
      <div className="absolute -top-2 -right-2">
        <span className={`status-badge ${status.badge} px-3 py-1.5`}>
          <StatusIcon size={14} />
          {status.text}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${status.badge.replace('status-', 'bg-')} bg-opacity-10`}>
            <DeviceIcon size={24} className={status.badge.replace('status-', 'text-')} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{device.name}</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {typeName}
              </span>
            </div>
            <p className="text-gray-600 font-mono">{device.ip}</p>
          </div>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical size={20} />
            </button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-20">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleRefresh()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                  >
                    <RefreshCw size={16} />
                    Atualizar Status
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      onEdit?.(device)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleDelete()
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left text-red-600"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-3">
        {/* Location */}
        {device.location && (
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={16} className="text-gray-400" />
            <span className="text-sm">{device.location}</span>
          </div>
        )}

        {/* Performance */}
        <div className="grid grid-cols-2 gap-3">
          {device.responseTime !== null && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Tempo de Resposta</div>
              <div className="font-semibold">{device.responseTime}ms</div>
            </div>
          )}
          
          {device.uptime && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-500">Uptime</div>
              <div className="font-semibold">{device.uptime}</div>
            </div>
          )}
        </div>

        {/* Description */}
        {device.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{device.description}</p>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Verificado {timeAgo}</span>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1.5 hover:bg-gray-100 rounded"
                  title="Atualizar status"
                >
                  <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => onEdit?.(device)}
                  className="p-1.5 hover:bg-gray-100 rounded"
                  title="Editar"
                >
                  <Edit2 size={16} className="text-blue-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}