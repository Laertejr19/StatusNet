import { useState, useEffect } from 'react'
import { X, Save, Server, Router, Cpu, Camera, Database, Shield, Wifi, AlertCircle } from 'lucide-react'

const deviceTypes = [
  { value: 'server', label: 'Servidor', icon: Server },
  { value: 'router', label: 'Roteador', icon: Router },
  { value: 'switch', label: 'Switch', icon: Cpu },
  { value: 'access-point', label: 'Access Point', icon: Wifi },
  { value: 'firewall', label: 'Firewall', icon: Shield },
  { value: 'nas', label: 'NAS Storage', icon: Database },
  { value: 'camera', label: 'Câmera', icon: Camera },
  { value: 'other', label: 'Outro', icon: Server }
]

export function DeviceForm({ device, onSubmit, onCancel, title = "Dispositivo" }) {
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    type: 'server',
    location: '',
    description: '',
    tags: '',
    pollingInterval: 60,
    critical: false,
    notificationEmail: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || '',
        ip: device.ip || '',
        type: device.type || 'server',
        location: device.location || '',
        description: device.description || '',
        tags: device.tags?.join(', ') || '',
        pollingInterval: device.pollingInterval || 60,
        critical: device.critical || false,
        notificationEmail: device.notificationEmail || ''
      })
    }
  }, [device])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!formData.ip.trim()) {
      newErrors.ip = 'IP é obrigatório'
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(formData.ip)) {
      newErrors.ip = 'IP inválido (ex: 192.168.1.1)'
    }
    
    if (!formData.type) {
      newErrors.type = 'Tipo é obrigatório'
    }
    
    if (formData.notificationEmail && !/\S+@\S+\.\S+/.test(formData.notificationEmail)) {
      newErrors.notificationEmail = 'Email inválido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const dataToSubmit = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        pollingInterval: parseInt(formData.pollingInterval)
      }
      
      await onSubmit(dataToSubmit)
    } catch (error) {
      console.error('Erro ao salvar dispositivo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleTypeSelect = (typeValue) => {
    setFormData(prev => ({ ...prev, type: typeValue }))
    if (errors.type) {
      setErrors(prev => ({ ...prev, type: '' }))
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and IP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Dispositivo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ex: Servidor Principal"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço IP *
            </label>
            <input
              type="text"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              className={`input ${errors.ip ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Ex: 192.168.1.1"
              disabled={isSubmitting}
            />
            {errors.ip && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.ip}
              </p>
            )}
          </div>
        </div>

        {/* Type and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Dispositivo *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {deviceTypes.map(type => {
                const Icon = type.icon
                const isSelected = formData.type === type.value
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeSelect(type.value)}
                    disabled={isSubmitting}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon size={20} className={isSelected ? 'text-primary-600' : 'text-gray-500'} />
                    <span className={`text-xs mt-1 ${
                      isSelected ? 'text-primary-700 font-medium' : 'text-gray-600'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.type}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localização
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input"
              placeholder="Ex: Sala de Servidores, Rack A"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Polling Interval and Critical */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de Verificação
            </label>
            <select
              name="pollingInterval"
              value={formData.pollingInterval}
              onChange={handleChange}
              className="input"
              disabled={isSubmitting}
            >
              <option value="30">30 segundos</option>
              <option value="60">1 minuto</option>
              <option value="300">5 minutos</option>
              <option value="600">10 minutos</option>
              <option value="1800">30 minutos</option>
              <option value="3600">1 hora</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Com que frequência verificar o status
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notificações por Email
            </label>
            <input
              type="email"
              name="notificationEmail"
              value={formData.notificationEmail}
              onChange={handleChange}
              className={`input ${errors.notificationEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="email@exemplo.com"
              disabled={isSubmitting}
            />
            {errors.notificationEmail && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.notificationEmail}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Receber alertas quando o dispositivo ficar offline
            </p>
          </div>
        </div>

        {/* Critical Device Checkbox */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="critical"
            name="critical"
            checked={formData.critical}
            onChange={handleChange}
            disabled={isSubmitting}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <div>
            <label htmlFor="critical" className="font-medium text-gray-900">
              Dispositivo Crítico
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Marque se este dispositivo é essencial para a operação. 
              Dispositivos críticos geram alertas prioritários quando ficam offline.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input"
            placeholder="Ex: produção, rack-a, servidor"
            disabled={isSubmitting}
          />
          <p className="mt-1 text-sm text-gray-500">
            Use tags para organizar e filtrar dispositivos
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input min-h-[100px] resize-none"
            placeholder="Descreva o dispositivo, sua função, especificações..."
            disabled={isSubmitting}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                {device ? 'Atualizar Dispositivo' : 'Adicionar Dispositivo'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DeviceForm