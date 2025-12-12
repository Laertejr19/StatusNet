// src/components/common/ErrorBoundary.jsx
import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
    this.setState({ errorInfo })
    
    // Aqui você poderia enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oops! Algo deu errado
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Detalhes do erro:</h3>
              <code className="text-sm text-red-600 font-mono break-all">
                {this.state.error?.toString()}
              </code>
              
              {this.state.errorInfo && (
                <details className="mt-3">
                  <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    Stack trace
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Tentar novamente
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="btn btn-secondary flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Ir para o Dashboard
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Se o erro persistir, entre em contato com o suporte técnico.
              </p>
              <button
                onClick={() => {
                  const errorDetails = {
                    error: this.state.error?.toString(),
                    componentStack: this.state.errorInfo?.componentStack,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                  }
                  
                  // Aqui você implementaria o envio do erro
                  console.log('Relatório de erro:', errorDetails)
                  alert('Relatório de erro enviado. Obrigado!')
                }}
                className="mt-3 text-sm text-primary-600 hover:text-primary-700 hover:underline"
              >
                Reportar este erro
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Componente para erros específicos
export function ErrorMessage({ 
  error, 
  onRetry, 
  title = "Erro", 
  message = "Ocorreu um erro ao carregar os dados." 
}) {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-red-600 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-bold text-red-900">{title}</h3>
          <p className="text-red-700 text-sm mt-1">{message}</p>
          
          {error && (
            <details className="mt-2">
              <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                Detalhes técnicos
              </summary>
              <code className="mt-1 block p-2 bg-red-100 rounded text-xs font-mono">
                {error.toString()}
              </code>
            </details>
          )}
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente para estados vazios
export function EmptyState({ 
  icon: Icon = AlertTriangle,
  title = "Nenhum dado encontrado",
  message = "Não há dados para exibir no momento.",
  actionLabel,
  onAction 
}) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Icon className="text-gray-400" size={32} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default {
  ErrorBoundary,
  ErrorMessage,
  EmptyState
}