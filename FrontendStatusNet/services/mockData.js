import { subMinutes, subHours, subDays, format } from 'date-fns'

export const mockDevices = [
  {
    id: 1,
    name: "Servidor Principal",
    ip: "192.168.1.100",
    type: "server",
    status: "online",
    lastCheck: new Date().toISOString(),
    responseTime: 24,
    location: "Sala de Servidores - Rack A",
    description: "Servidor Dell PowerEdge R740 com virtualização",
    uptime: "99.8%",
    tags: ["critical", "virtualization"],
    created_at: subDays(new Date(), 90).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Roteador Corporativo",
    ip: "192.168.1.1",
    type: "router",
    status: "online",
    lastCheck: subMinutes(new Date(), 2).toISOString(),
    responseTime: 12,
    location: "Network Closet - Piso 1",
    description: "Cisco ISR 4321 com redundância",
    uptime: "99.9%",
    tags: ["gateway", "redundant"],
    created_at: subDays(new Date(), 120).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString()
  },
  {
    id: 3,
    name: "Switch Andar 2",
    ip: "192.168.1.20",
    type: "switch",
    status: "offline",
    lastCheck: subHours(new Date(), 3).toISOString(),
    responseTime: null,
    location: "Sala TI - Andar 2",
    description: "Switch Cisco Catalyst 2960X 24-port",
    uptime: "95.2%",
    tags: ["switch", "floor-2"],
    created_at: subDays(new Date(), 60).toISOString(),
    updated_at: subHours(new Date(), 3).toISOString()
  },
  {
    id: 4,
    name: "Access Point WiFi",
    ip: "192.168.1.50",
    type: "access-point",
    status: "online",
    lastCheck: subMinutes(new Date(), 5).toISOString(),
    responseTime: 45,
    location: "Recepção - Piso Térreo",
    description: "Ubiquiti UniFi AP AC Pro",
    uptime: "98.7%",
    tags: ["wifi", "public"],
    created_at: subDays(new Date(), 45).toISOString(),
    updated_at: subDays(new Date(), 2).toISOString()
  },
  {
    id: 5,
    name: "Firewall Perimeter",
    ip: "192.168.1.254",
    type: "firewall",
    status: "slow",
    lastCheck: subMinutes(new Date(), 1).toISOString(),
    responseTime: 120,
    location: "DMZ - Rack de Segurança",
    description: "FortiGate 100F com IPS/IDS ativo",
    uptime: "99.5%",
    tags: ["security", "critical"],
    created_at: subDays(new Date(), 180).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 6,
    name: "NAS Storage",
    ip: "192.168.1.30",
    type: "nas",
    status: "online",
    lastCheck: subMinutes(new Date(), 10).toISOString(),
    responseTime: 28,
    location: "Sala de Servidores - Rack B",
    description: "Synology RS2416+ com 48TB RAID6",
    uptime: "99.9%",
    tags: ["storage", "backup"],
    created_at: subDays(new Date(), 200).toISOString(),
    updated_at: subDays(new Date(), 5).toISOString()
  },
  {
    id: 7,
    name: "Câmera PTZ Externa",
    ip: "192.168.1.101",
    type: "camera",
    status: "offline",
    lastCheck: subHours(new Date(), 8).toISOString(),
    responseTime: null,
    location: "Estacionamento - Entrada Principal",
    description: "Câmera Hikvision DS-2DE4225IW-DE com visão noturna",
    uptime: "88.3%",
    tags: ["security", "external"],
    created_at: subDays(new Date(), 30).toISOString(),
    updated_at: subHours(new Date(), 8).toISOString()
  },
  {
    id: 8,
    name: "Servidor Backup",
    ip: "192.168.1.102",
    type: "server",
    status: "online",
    lastCheck: new Date().toISOString(),
    responseTime: 32,
    location: "Sala de Servidores - Rack C",
    description: "Servidor de backup com Veeam",
    uptime: "99.6%",
    tags: ["backup", "secondary"],
    created_at: subDays(new Date(), 150).toISOString(),
    updated_at: new Date().toISOString()
  }
]


export const mockLogs = []
const statusOptions = ['online', 'offline', 'slow']


mockDevices.forEach(device => {
  const logsPerDevice = 96 
  let consecutiveErrors = 0
  
  for (let i = 0; i < logsPerDevice; i++) {
    const hoursAgo = (logsPerDevice - i) / 2 
    const timestamp = subHours(new Date(), hoursAgo)
    
    
    let status
    if (device.id === 3 || device.id === 7) {
     
      status = i < 20 ? 'offline' : (i < 30 ? 'slow' : 'online')
    } else if (device.id === 5) {
      
      status = (i > 40 && i < 60) ? 'slow' : 'online'
    } else {
    
      if (Math.random() < 0.05) {
        consecutiveErrors++
        status = consecutiveErrors > 3 ? 'offline' : 'slow'
      } else {
        consecutiveErrors = 0
        status = 'online'
      }
    }
    
    const log = {
      id: mockLogs.length + 1,
      device_id: device.id,
      device_name: device.name,
      device_ip: device.ip,
      status: status,
      response_time: status === 'online' ? Math.floor(Math.random() * 50) + 10 : 
                    status === 'slow' ? Math.floor(Math.random() * 200) + 100 : null,
      ping_time: status === 'online' ? Math.floor(Math.random() * 30) + 5 : null,
      packet_loss: status === 'online' ? Math.random() < 0.1 ? Math.floor(Math.random() * 20) : 0 : 100,
      timestamp: timestamp.toISOString(),
      created_at: timestamp.toISOString(),
      details: status === 'offline' ? 'Timeout na conexão' :
               status === 'slow' ? 'Alta latência detectada' :
               'Conexão estável'
    }
    
    mockLogs.push(log)
  }
})


mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))


export const mockStats = {
  overview: {
    totalDevices: mockDevices.length,
    onlineDevices: mockDevices.filter(d => d.status === 'online').length,
    offlineDevices: mockDevices.filter(d => d.status === 'offline').length,
    slowDevices: mockDevices.filter(d => d.status === 'slow').length,
    totalChecks: mockLogs.length
  },
  performance: {
    uptime24h: "98.4%",
    avgResponseTime: 28,
    maxResponseTime: 245,
    minResponseTime: 5,
    availability30d: "99.1%"
  },
  recentIncidents: [
    {
      id: 1,
      device_id: 3,
      device_name: "Switch Andar 2",
      type: "offline",
      started_at: subHours(new Date(), 3).toISOString(),
      duration: "3 horas",
      resolved: false
    },
    {
      id: 2,
      device_id: 7,
      device_name: "Câmera PTZ Externa",
      type: "offline",
      started_at: subHours(new Date(), 8).toISOString(),
      duration: "8 horas",
      resolved: false
    },
    {
      id: 3,
      device_id: 5,
      device_name: "Firewall Perimeter",
      type: "high_latency",
      started_at: subMinutes(new Date(), 45).toISOString(),
      duration: "45 minutos",
      resolved: true
    }
  ],
  dailyStats: Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      uptime: 95 + Math.random() * 4,
      incidents: Math.floor(Math.random() * 4),
      avgResponseTime: Math.floor(Math.random() * 40) + 10,
      checks: 1000 + Math.floor(Math.random() * 500)
    }
  }),
  deviceTypeStats: mockDevices.reduce((acc, device) => {
    const type = device.type
    if (!acc[type]) {
      acc[type] = { total: 0, online: 0, offline: 0 }
    }
    acc[type].total++
    if (device.status === 'online') acc[type].online++
    if (device.status === 'offline') acc[type].offline++
    return acc
  }, {}),
  alerts: {
    critical: 2,
    warning: 1,
    info: 3
  }
}


export const mockUtils = {
  generateDeviceLogs(deviceId, hours = 24) {
    return mockLogs
      .filter(log => log.device_id === deviceId)
      .slice(0, hours * 2) 
  },
  
  getDeviceStatusHistory(deviceId) {
    const deviceLogs = mockLogs.filter(log => log.device_id === deviceId)
    return deviceLogs.map(log => ({
      time: new Date(log.timestamp),
      status: log.status,
      responseTime: log.response_time
    }))
  },
  
  calculateUptime(deviceId) {
    const deviceLogs = mockLogs.filter(log => log.device_id === deviceId)
    const onlineLogs = deviceLogs.filter(log => log.status === 'online')
    return deviceLogs.length > 0 
      ? `${((onlineLogs.length / deviceLogs.length) * 100).toFixed(1)}%`
      : '0%'
  }
}

export default {
  mockDevices,
  mockLogs,
  mockStats,
  mockUtils
}