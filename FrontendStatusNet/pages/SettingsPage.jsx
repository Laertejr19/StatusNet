import { useState } from 'react'
import {
  Settings,
  Save,
  Globe,
  Bell,
  Database,
  Shield,
  RefreshCw,
  TestTube,
  Link,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const [settings, setSettings] = useState({
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    useMock: import.meta.env.VITE_USE_MOCK === 'true',
    pollInterval: 30000,
    notifications: {
      email: true,
      push: false,
      criticalOnly: true,
      sound: true
    },
    autoRefresh: true,
    theme: 'light',
    language: 'pt-BR',
    dataRetention: 30
  })

  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const testConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const result = await apiService.testBackendConnection()
      setTestResult(result)
      
      if (result.success) {
        toast.success(`✅ Conexão bem-sucedida! (${result.responseTime}ms)`)
      } else {
        toast.error(`❌ Falha na conexão: ${result.error || 'Desconhecido'}`)
      }
    } catch (error) {
      toast.error('❌ Erro ao testar conexão')
      setTestResult({ success: false, error: error.message })
    } finally {
      setIsTesting(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    
    try {
      
      localStorage.setItem('netstatus-settings', JSON.stringify(settings))
          
      if (window.confirm('Algumas configurações requerem recarregar a página. Continuar?')) {
        toast.success('✅ Configurações salvas com sucesso!')
        
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.success('✅ Configurações salvas (recarregue para aplicar)')
        setIsSaving(false)
      }
    } catch (error) {
      toast.error('❌ Erro ao salvar configurações')
      setIsSaving(false)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.')
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }
      }
      return { ...prev, [key]: value }
    })
  }

  const resetSettings = () => {
    if (window.confirm('Tem certeza que deseja redefinir todas as configurações para os padrões?')) {
      setSettings({
        apiUrl: 'http://localhost:3000',
        useMock: true,
        pollInterval: 30000,
        notifications: {
          email: true,
          push: false,
          criticalOnly: true,
          sound: true
        },
        autoRefresh: true,
        theme: 'light',
        language: 'pt-BR',
        dataRetention: 30
      })
      toast.success('⚙️ Configurações redefinidas para padrões')
    }
  }

  const pollIntervals = [
    { value: 10000, label: '10 segundos' },
    { value: 30000, label: '30 segundos' },
    { value: 60000, label: '1 minuto' },
    { value: 300000, label: '5 minutos' },
    { value: 600000, label: '10 minutos' }
  ]

  const dataRetentionOptions = [
    { value: 7, label: '7 dias' },
    { value: 30, label: '30 dias' },
    { value: 90, label: '90 dias' },
    { value: 365, label: '1 ano' },
    { value: 0, label: 'Para sempre' }
  ]
    return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600 mt-1">
                Configure o comportamento do painel de monitoramento
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={resetSettings}
                className="btn btn-secondary"
              >
                Redefinir Tudo
              </button>
              <button
                onClick={saveSettings}
                disabled={isSaving}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save size={18} />
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
    
          {/* API Configuration */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Configuração da API</h2>
                <p className="text-gray-600">Configure a conexão com o backend</p>
              </div>
            </div>
    
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da API Backend
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.apiUrl}
                    onChange={(e) => handleChange('apiUrl', e.target.value)}
                    className="input flex-1"
                    placeholder="http://localhost:3000"
                  />
                  <button
                    onClick={testConnection}
                    disabled={isTesting}
                    className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
                  >
                    <TestTube size={16} />
                    {isTesting ? 'Testando...' : 'Testar Conexão'}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Endereço do servidor backend do seu colega
                </p>
                
                {testResult && (
                  <div className={`mt-2 p-3 rounded-lg ${
                    testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      {testResult.success ? '✅' : '❌'}
                      <span className="font-medium">
                        {testResult.success ? 'Conexão bem-sucedida' : 'Falha na conexão'}
                      </span>
                    </div>
                    {testResult.responseTime && (
                      <div className="text-sm mt-1">
                        Tempo de resposta: <strong>{testResult.responseTime}ms</strong>
                      </div>
                    )}
                    {testResult.error && (
                      <div className="text-sm mt-1 font-mono">
                        {testResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
    
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="useMock"
                  checked={settings.useMock}
                  onChange={(e) => handleChange('useMock', e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="useMock" className="font-medium text-gray-900">
                    Usar Modo Demonstração
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Quando ativado, usa dados simulados caso o backend esteja offline. 
                    Recomendado para desenvolvimento e quando o backend não estiver disponível.
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  settings.useMock 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {settings.useMock ? 'Ativo' : 'Inativo'}
                </div>
              </div>
            </div>
          </div>
    
          {/* Polling Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <RefreshCw className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Atualização Automática</h2>
                <p className="text-gray-600">Configure como o sistema verifica os dispositivos</p>
              </div>
            </div>
    
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intervalo de Verificação
                </label>
                <select
                  value={settings.pollInterval}
                  onChange={(e) => handleChange('pollInterval', parseInt(e.target.value))}
                  className="input"
                >
                  {pollIntervals.map(interval => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Frequência com que o sistema verifica o status dos dispositivos
                </p>
              </div>
    
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleChange('autoRefresh', e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div>
                  <label htmlFor="autoRefresh" className="font-medium text-gray-900">
                    Atualização Automática da Interface
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Atualiza automaticamente a interface quando novos dados estão disponíveis
                  </p>
                </div>
              </div>
            </div>
          </div>
    
          {/* CONTINUA NA PARTE 3...

                {/* ...continuação do return */}

      {/* Notifications Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell className="text-purple-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
            <p className="text-gray-600">Configure alertas e notificações</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="notifications.email"
              checked={settings.notifications.email}
              onChange={(e) => handleChange('notifications.email', e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div>
              <label htmlFor="notifications.email" className="font-medium text-gray-900">
                Notificações por Email
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Receba alertas por email quando dispositivos ficarem offline
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="notifications.criticalOnly"
              checked={settings.notifications.criticalOnly}
              onChange={(e) => handleChange('notifications.criticalOnly', e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div>
              <label htmlFor="notifications.criticalOnly" className="font-medium text-gray-900">
                Apenas Dispositivos Críticos
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Notificar apenas quando dispositivos marcados como críticos ficarem offline
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="notifications.sound"
              checked={settings.notifications.sound}
              onChange={(e) => handleChange('notifications.sound', e.target.checked)}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div>
              <label htmlFor="notifications.sound" className="font-medium text-gray-900">
                Efeitos Sonoros
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Reproduzir sons para alertas importantes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Globe className="text-yellow-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Aparência</h2>
            <p className="text-gray-600">Personalize a interface</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleChange('theme', 'light')}
                className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center ${
                  settings.theme === 'light'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun size={24} className="mb-2" />
                <span className="font-medium">Claro</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('theme', 'dark')}
                className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center ${
                  settings.theme === 'dark'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon size={24} className="mb-2" />
                <span className="font-medium">Escuro</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="input"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Database className="text-red-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dados</h2>
            <p className="text-gray-600">Configure o armazenamento de dados</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retenção de Logs
            </label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleChange('dataRetention', parseInt(e.target.value))}
              className="input"
            >
              {dataRetentionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Período que os logs de verificação são mantidos
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Limpar Dados Locais</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Remove todos os dados armazenados localmente, incluindo configurações e cache.
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('Isso removerá todos os dados locais. Continuar?')) {
                      localStorage.clear()
                      toast.success('Dados locais removidos')
                      window.location.reload()
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Limpar Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-300 bg-red-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-200 rounded-lg">
            <Shield className="text-red-700" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900">Zona de Perigo</h2>
            <p className="text-red-700">Ações irreversíveis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-red-200">
            <h4 className="font-bold text-red-900 mb-2">Remover Todos os Dispositivos</h4>
            <p className="text-sm text-red-700 mb-3">
              Isso removerá todos os dispositivos do sistema. Esta ação não pode ser desfeita.
            </p>
            <button
              onClick={() => {
                if (window.confirm('ATENÇÃO: Isso removerá TODOS os dispositivos. Tem certeza ABSOLUTA?')) {
                  toast.success('Dispositivos removidos (modo demonstração)')
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              Remover Todos Dispositivos
            </button>
          </div>

          <div className="p-4 bg-white rounded-lg border border-red-200">
            <h4 className="font-bold text-red-900 mb-2">Exportar Todos os Dados</h4>
            <p className="text-sm text-red-700 mb-3">
              Exporta um backup completo de todos os dados do sistema.
            </p>
            <button
              onClick={() => {
                toast.success('Backup exportado com sucesso!')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Exportar Backup
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={resetSettings}
          className="btn btn-secondary"
        >
          Redefinir Tudo
        </button>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          {isSaving ? 'Salvando...' : 'Salvar Todas as Configurações'}
        </button>
      </div>
    </div>
  )
}

export default SettingsPage