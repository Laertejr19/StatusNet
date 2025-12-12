const API_URL = 'http://localhost:3000/api';

export const checkBackendStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/devices`);
    const data = await response.json();
    return { online: true, data, message: '✅ Backend conectado' };
  } catch (error) {
    console.log('⚠️ Backend offline');
    return { online: false, data: null, message: '⚠️ Modo demonstração' };
  }
};

export const fetchDevices = async () => {
  try {
    const response = await fetch(`${API_URL}/devices`);
    const data = await response.json();
    return data;
  } catch (error) {
    
    return [
      { id: 1, name: 'Servidor Principal', status: 'online', ip: '192.168.1.100' },
      { id: 2, name: 'Roteador WiFi', status: 'online', ip: '192.168.1.1' },
      { id: 3, name: 'Switch Andar 1', status: 'offline', ip: '192.168.1.2' },
    ];
  }
};