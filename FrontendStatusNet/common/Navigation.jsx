import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Server, 
  History, 
  Settings,
  BarChart3,
  AlertCircle,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useBackendStatus } from '../../hooks/useBackendStatus'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isOnline, isMock } = useBackendStatus()

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/devices', label: 'Dispositivos', icon: <Server size={20} /> },
    { to: '/logs', label: 'Histórico', icon: <History size={20} /> },
    { to: '/settings', label: 'Configurações', icon: <Settings size={20} /> },
  ]

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NetStatus</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-gray-600">
                  {isMock ? 'Modo Demonstração' : 'Online'}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm">
                {isOnline ? 'Conectado' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              
              <div className="px-4 py-3 mt-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm">
                    Status: {isOnline ? 'Conectado' : 'Offline'}
                  </span>
                </div>
                {isMock && (
                  <div className="text-xs text-yellow-600 mt-1">
                    ⚠️ Usando dados de demonstração
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}