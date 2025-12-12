import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  Download,
  Server,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { DeviceCard } from '../components/devices/DeviceCard'
import { DeviceForm } from '../components/devices/DeviceForm'
import { useDevices } from '../hooks/useDevices'
import toast from 'react-hot-toast'

export function DevicesPage() {
  const {
    devices,
    loading,
    error,
    isUsingMock,
    refreshDevice,
    addDevice,
    updateDevice,
    deleteDevice,
    refreshAll
  } = useDevices()
  
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)
  const [isRefreshingAll, setIsRefreshingAll] = useState(false)

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.ip.includes(search) ||
      device.description?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || 
      device.status === statusFilter
    
    const matchesType = 
      typeFilter === 'all' ||
      device.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleRefreshAll = async () => {
    setIsRefreshingAll(true)
    try {
      await refreshAll()
      toast.success('Todos dispositivos atualizados')
    } catch (error) {
      toast.error('Erro ao atualizar dispositivos')
    } finally {
      setIsRefreshingAll(false)
    }
  }

  const handleAddDevice = async (deviceData) => {
    try {
      await addDevice(deviceData)
      setShowForm(false)
      toast.success('Dispositivo adicionado com sucesso!')
    } catch (error) {
      toast.error('Erro ao adicionar dispositivo')
    }
  }

  const handleUpdateDevice = async (id, deviceData) => {
    try {
      await updateDevice(id, deviceData)
      setEditingDevice(null)
      toast.success('Dispositivo atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar dispositivo')
    }
  }

  const handleDeleteDevice = async (id) => {
    try {
      await deleteDevice(id)
      toast.success('Dispositivo excluído com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir dispositivo')
    }
  }

  const deviceTypes = [...new Set(devices.map(d => d.type).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispositivos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os dispositivos monitorados
            {isUsingMock && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Modo Demonstração
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshingAll || loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={isRefreshingAll ? 'animate-spin' : ''} />
            Atualizar Todos
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Dispositivo
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{devices.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {devices.filter(d => d.status === 'online').length}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Wifi size={14} />
            Online
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {devices.filter(d => d.status === 'offline').length}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <WifiOff size={14} />
            Offline
          </div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {devices.filter(d => d.status === 'slow').length}
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <AlertTriangle size={14} />
            Lento
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar dispositivos por nome, IP ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">Todos Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="slow">Lento</option>
              <option value="unknown">Desconhecido</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Server size={18} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">Todos Tipos</option>
              {deviceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={() => toast.success('Exportação iniciada!')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Device Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DeviceForm
              onSubmit={handleAddDevice}
              onCancel={() => setShowForm(false)}
              title="Adicionar Novo Dispositivo"
            />
          </div>
        </div>
      )}

      {/* Edit Device Modal */}
      {editingDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DeviceForm
              device={editingDevice}
              onSubmit={(data) => handleUpdateDevice(editingDevice.id, data)}
              onCancel={() => setEditingDevice(null)}
              title="Editar Dispositivo"
            />
          </div>
        </div>
      )}

      {/* Devices Grid */}
      {error ? (
        <div className="card bg-red-50 text-red-800 p-6 text-center">
          <AlertTriangle size={24} className="mx-auto mb-3" />
          <h3 className="font-bold mb-2">Erro ao carregar dispositivos</h3>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onRefresh={refreshDevice}
              onEdit={setEditingDevice}
              onDelete={handleDeleteDevice}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Server className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {search || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Nenhum dispositivo encontrado' 
              : 'Nenhum dispositivo cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6">
            {search || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando seu primeiro dispositivo'}
          </p>
          {!search && statusFilter === 'all' && typeFilter === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Primeiro Dispositivo
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredDevices.length > 0 && (
        <div className="flex items-center justify-between card">
          <div className="text-sm text-gray-600">
            Mostrando {filteredDevices.length} de {devices.length} dispositivos
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded border hover:bg-gray-50">
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
  )
}