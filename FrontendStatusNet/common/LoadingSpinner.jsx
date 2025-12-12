
export function LoadingSpinner({ 
    size = 'md',
    color = 'primary',
    text,
    fullScreen = false 
  }) {
    const sizeClasses = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-2',
      lg: 'h-12 w-12 border-3',
      xl: 'h-16 w-16 border-4'
    }
  
    const colorClasses = {
      primary: 'border-primary-600 border-t-transparent',
      white: 'border-white border-t-transparent',
      gray: 'border-gray-400 border-t-transparent',
      success: 'border-green-600 border-t-transparent',
      danger: 'border-red-600 border-t-transparent'
    }
  
    const spinner = (
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`} />
    )
  
    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
          {spinner}
          {text && (
            <p className="mt-4 text-gray-600 font-medium">{text}</p>
          )}
        </div>
      )
    }
  
    if (text) {
      return (
        <div className="flex flex-col items-center justify-center">
          {spinner}
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        </div>
      )
    }
  
    return spinner
  }
  
  
  export function ButtonSpinner({ color = 'white' }) {
    return (
      <div className={`h-4 w-4 border-2 ${
        color === 'white' 
          ? 'border-white border-t-transparent' 
          : 'border-current border-t-transparent'
      } rounded-full animate-spin`} />
    )
  }
  
  
  export function TableSpinner({ colSpan = 1 }) {
    return (
      <tr>
        <td colSpan={colSpan} className="py-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="mt-2 text-sm text-gray-500">Carregando dados...</p>
          </div>
        </td>
      </tr>
    )
  }
  
  
export function PageSpinner({ message = "Carregando..." }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Aguarde enquanto os dados são carregados...
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  
  export function ChartSpinner() {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <div className="h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-gray-500">Carregando gráfico...</p>
      </div>
    )
  }
  
  
  export function CardSkeleton({ count = 3 }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  export default {
    LoadingSpinner,
    ButtonSpinner,
    TableSpinner,
    PageSpinner,
    ChartSpinner,
    CardSkeleton
  }