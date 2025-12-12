import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useSystemData() {
  const [data, setData] = useState({
    status: { online: false, message: 'Carregando...' },
    devices: { online: 0, offline: 0, total: 0, list: [] },
    loading: true,
    error: null
  });

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      const [statusRes, devicesRes] = await Promise.all([
        api.getSystemStatus(),
        api.getDevices()
      ]);

      setData({
        status: {
          online: statusRes.status === 'online',
          message: statusRes.message || 'Sistema operacional'
        },
        devices: {
          online: devicesRes.online || devicesRes.total - devicesRes.offline,
          offline: devicesRes.offline || 0,
          total: devicesRes.total || 0,
          list: devicesRes.devices || []
        },
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setData({
        status: { online: false, message: 'Backend offline - Modo demonstração' },
        devices: { online: 6, offline: 2, total: 8, list: [] },
        loading: false,
        error: error.message
      });
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    try {
      const result = await api.testConnection();
      alert(`✅ ${result.message}\nHora do servidor: ${new Date(result.serverTime).toLocaleTimeString()}`);
      return true;
    } catch (error) {
      alert('❌ Falha na conexão com o backend');
      return false;
    }
  };

  return { 
    ...data, 
    testConnection, 
    refreshData: fetchData 
  };
}