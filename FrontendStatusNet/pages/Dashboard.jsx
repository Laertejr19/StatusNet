import { useSystemData } from '../hooks/useSystemData';

export function Dashboard() {
  const { status, devices, loading, error, testConnection } = useSystemData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Conectando ao backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">NetStatus Dashboard</h1>
          <p className="text-gray-600">Sistema integrado com backend do colega</p>
        </div>

        {/* Status do Sistema */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Status do Sistema</h2>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className={`w-6 h-6 rounded-full ${status.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-2xl font-bold ${status.online ? 'text-green-700' : 'text-red-700'}`}>
                {status.online ? 'ONLINE' : 'OFFLINE'}
              </span>
              <span className="text-gray-600 text-lg">{status.message}</span>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700">⚠️ {error}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-4 h-4 rounded-full mr-3 ${status.online ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={status.online ? 'text-green-700' : 'text-red-700'}>
                <strong>Sistema de Integração</strong> - {status.online ? 'Backend online e funcionando' : 'Backend offline - Modo demonstração'}
              </span>
            </div>
            
            <button
              onClick={testConnection}
              className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors w-full md:w-auto"
            >
              <div className="w-4 h-4 border-2 border-blue-500 rounded mr-3"></div>
              <strong className="text-blue-700">Testar Conexão com Backend</strong>
            </button>
          </div>
        </div>

        {/* Dispositivos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Dispositivos Monitorados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-700">{devices.online}</div>
              <div className="text-gray-600 mt-2">Online</div>
              <div className="text-sm text-green-600">Operacionais</div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-red-700">{devices.offline}</div>
              <div className="text-gray-600 mt-2">Offline</div>
              <div className="text-sm text-red-600">Requer atenção</div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-4xl font-bold text-blue-700">{devices.total}</div>
              <div className="text-gray-600 mt-2">Total</div>
              <div className="text-sm text-blue-600">Monitorados</div>
            </div>
          </div>

          {/* Lista de dispositivos */}
          {devices.list.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Lista de Dispositivos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.list.map(device => (
                  <div key={device.id} className="flex items-center p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-3 ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{device.type}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {device.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tecnologias */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Tecnologias</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {['React 18', 'Vite', 'Tailwind CSS', 'Fetch API', 'Backend', 'API REST', 'Sistema de Fallback'].map((tech, index) => (
              <div key={index} className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition-colors">
                <div className="font-medium text-gray-800">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}