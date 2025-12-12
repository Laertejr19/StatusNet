// src/components/TestConnection.jsx
import { useEffect } from 'react';

export function TestConnection() {
  useEffect(() => {
    // Teste manual
    fetch('/api/status')
      .then(res => res.json())
      .then(data => console.log('✅ Backend response:', data))
      .catch(err => console.error('❌ Backend error:', err));
    
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => console.log('✅ Devices response:', data))
      .catch(err => console.error('❌ Devices error:', err));
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3 className="font-bold">Debug: Testando Conexão</h3>
      <p>Verifique o console do navegador (F12 → Console)</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Recarregar Teste
      </button>
    </div>
  );
}