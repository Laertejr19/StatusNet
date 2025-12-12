import React, { useState, useEffect } from 'react';

function App() {
  const [integration, setIntegration] = useState({
    status: 'Conectando ao backend do colega...',
    connected: false,
    port: null,
    data: null,
    stats: { total: 0, online: 0, offline: 0 }
  });

  const connectToBackend = async () => {
    const ports = [5000, 3000, 3001, 3002];
    
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}/api/devices`);
        
        if (response.ok) {
          const result = await response.json();
          
          const online = result.data.filter(d => d.status === 'online').length;
          const offline = result.data.filter(d => d.status === 'offline').length;
          
          setIntegration({
            status: `✅ CONECTADO! Backend na porta ${port}`,
            connected: true,
            port: port,
            data: result,
            stats: {
              total: result.data.length,
              online: online,
              offline: offline
            }
          });
          
          console.log('✅ Backend conectado:', result);
          return;
        }
      } catch (error) {
        console.log(`Porta ${port}: ${error.message}`);
      }
    }
    
    setIntegration({
      status: '❌ Backend offline - Modo demonstração',
      connected: false,
      port: null,
      data: null,
      stats: { total: 8, online: 6, offline: 2 }
    });
  };

  useEffect(() => {
    connectToBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            NetStatus Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Sistema integrado com backend do colega
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Status do Sistema</h2>
              <p className="text-gray-600">Painel de monitoramento integrado</p>
            </div>
            
            <div className={`px-5 py-2 rounded-full font-bold shadow ${integration.connected 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'}`}>
              {integration.connected ? 'INTEGRADO' : 'OFFLINE'}
            </div>
          </div>

          <div className={`p-5 rounded-xl mb-6 ${integration.connected 
            ? 'bg-green-50 border-2 border-green-200' 
            : 'bg-red-50 border-2 border-red-200'}`}>
            
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {integration.connected ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Sistema de Integração
                </h3>
                
                <p className="text-gray-700 font-medium mb-3">
                  {integration.status}
                </p>
                
                {integration.port && (
                  <p className="text-sm text-gray-600 mb-3">
                    Porta: {integration.port} • Endpoint: /api/devices
                  </p>
                )}
                
                {integration.connected && integration.data && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Dados recebidos do backend:
                    </p>
                    <pre className="text-xs overflow-auto max-h-40 bg-gray-50 p-2 rounded">
                      {JSON.stringify(integration.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={connectToBackend}
                className="px-5 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 shadow"
              >
                Testar Conexão
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Dispositivos</p>
              <p className="text-3xl font-bold text-gray-900">{integration.stats.total}</p>
              <p className="text-gray-600 text-sm">
                {integration.connected ? 'Do backend' : 'Monitorados'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Online</p>
              <p className="text-3xl font-bold text-gray-900">{integration.stats.online}</p>
              <p className="text-gray-600 text-sm">
                {integration.connected ? 'Em tempo real' : 'Operacionais'}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600 text-sm font-medium">Offline</p>
              <p className="text-3xl font-bold text-gray-900">{integration.stats.offline}</p>
              <p className="text-gray-600 text-sm">Requer atenção</p>
            </div>
          </div>

          {integration.connected && integration.data?.data && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Dispositivos do Backend do Colega
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {integration.data.data.map(device => (
                  <div key={device.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{device.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {device.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">IP: {device.ip}</p>
                    <p className="text-xs text-gray-500 mt-1">Tipo: {device.tipo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Funcionalidades</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">✓</span>
                </div>
                <div>
                  <p className="font-medium">Dashboard em tempo real</p>
                  <p className="text-sm text-gray-600">Visão do sistema</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600">✓</span>
                </div>
                <div>
                  <p className="font-medium">Gerenciamento de dispositivos</p>
                  <p className="text-sm text-gray-600">CRUD completo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600">✓</span>
                </div>
                <div>
                  <p className="font-medium">Sistema de integração</p>
                  <p className="text-sm text-gray-600">
                    {integration.connected ? 'Backend conectado' : 'API REST'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600">✓</span>
                </div>
                <div>
                  <p className="font-medium">Interface responsiva</p>
                  <p className="text-sm text-gray-600">Mobile & Desktop</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tecnologias</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-white rounded-full shadow">React 18</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">Vite</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">Tailwind CSS</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">Fetch API</span>
            <span className={`px-4 py-2 rounded-full shadow ${integration.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {integration.connected ? 'Backend Colega' : 'Backend'}
            </span>
            <span className="px-4 py-2 bg-white rounded-full shadow">API REST</span>
            <span className="px-4 py-2 bg-white rounded-full shadow">Sistema de Fallback</span>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p>Desenvolvimento do Painel Web (React) com Integração de API</p>
          <p className="text-sm mt-2">
            {integration.connected 
              ? `✅ Sistema integrado com backend do colega • Porta: ${integration.port}` 
              : '⚠️ Modo demonstração • Pronto para integração'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;