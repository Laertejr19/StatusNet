import { useState, useEffect } from 'react'
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'
import { apiService } from '../../services/api'
import toast from 'react-hot-toast'

export function ConnectionAlert() {
  const [status, setStatus] = useState({
    isOnline: false,
    isLoading: true,
    lastChecked: null,
    error: null,
    isMock: apiService.config.useMock
  })

  const checkConnection = async (showToast = false) => {
    setStatus(prev => ({ ...prev, isLoading: true }))
    
    try {
      const result = await apiService.testBackendConnection()
      const backendStatus = apiService.getBackendStatus()
      
      const newStatus = {
        isOnline: result.success,
        isLoading: false,
        lastChecked: new Date(),
        error: result.error || null,
        isMock: apiService.config.useMock || !result.success
      }
      
      setStatus(newStatus)
      
      if (showToast) {
        if (result.success) {
          toast.success(`Backend conectado! (${result.responseTime}ms)`)
        } else {
          toast.error('Backend offline - Usando dados de demonstração')
        }
      }
      
      return result.success
    } catch (error) {
      setStatus({
        isOnline: false,
        isLoading: false,
        lastChecked: new Date(),
        error: error.message,
        isMock: true
      })
      
      if (showToast) {
        toast.error('Erro ao verificar conexão')
      }
      
      return false
    }
  }

  useEffect(() => {
  
    checkConnection()
    
    
    const interval = setInterval(() => {
      checkConnection()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date) => {
    if (!date) return 'Nunca'
    const diff = Math.floor((new Date() - new Date(date)) / 1000)
    
    if (diff < 60) return 'Agora mesmo'
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`
    return `${Math.floor(diff / 3600)} horas atrás`
  }

  if (status.isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-lg">
          <RefreshCw size={18} className="animate-spin" />
          <span className="font-medium">Verificando conexão...</span>
        </div>
      </div>
    )
  }

  if (status.isOnline && !status.isMock) {
    return (
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg border border-green-200">
          <CheckCircle size={18} className="text-green-600" />
          <div>
            <div className="font-medium">✅ Backend Conectado</div>
            <div className="text-xs opacity-75">
              Dados em tempo real • {formatTime(status.lastChecked)}
            </div>
          </div>
          <button
            onClick={() => checkConnection(true)}
            disabled={status.isLoading}
            className="ml-2 p-1 hover:bg-green-200 rounded transition-colors"
            title="Testar conexão novamente"
          >
            <RefreshCw size={16} className={status.isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    )
  }

  if (status.isOnline && status.isMock) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg border border-blue-200">
          <AlertTriangle size={18} className="text-blue-600" />
          <div>
            <div className="font-medium">⚠️ Modo Demonstração</div>
            <div className="text-xs opacity-75">
              Backend com dados limitados • {formatTime(status.lastChecked)}
            </div>
          </div>
          <button
            onClick={() => checkConnection(true)}
            className="ml-2 p-1 hover:bg-blue-200 rounded transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="fixed top-4 right-4 z-50 animate-pulse">
      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg border border-yellow-200">
        <WifiOff size={18} className="text-yellow-600" />
        <div>
          <div className="font-medium">🔌 Backend Offline</div>
          <div className="text-xs opacity-75">
            Usando dados de demonstração • {formatTime(status.lastChecked)}
            {status.error && (
              <div className="mt-1 text-xs font-mono bg-yellow-200 px-2 py-1 rounded">
                Erro: {status.error}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => checkConnection(true)}
          disabled={status.isLoading}
          className="ml-2 p-1 hover:bg-yellow-200 rounded transition-colors"
          title="Tentar reconectar"
        >
          <RefreshCw size={16} className={status.isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  )
}