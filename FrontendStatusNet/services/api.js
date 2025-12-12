const USE_MOCK = true; 
const mockData = {
  status: { status: 'online', message: 'Sistema integrado funcionando' },
  devices: {
    total: 8,
    online: 6,
    offline: 2,
    devices: [
      { id: 1, name: 'Servidor Principal', status: 'online', type: 'server' },
      { id: 2, name: 'Banco de Dados', status: 'online', type: 'database' },
      
    ]
  }
};

export const api = {
  async getSystemStatus() {
    if (USE_MOCK) {
      return new Promise(resolve => 
        setTimeout(() => resolve(mockData.status), 500)
      );
    }
    
  },
 
};