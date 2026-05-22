import Card from './Card'
import { cn } from '../utils/helpers'

export default function MedicalCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  value, 
  trend, 
  status,
  children,
  className = '' 
}) {
  const statusColors = {
    success: 'bg-[#4FAF8F]/10 text-[#4FAF8F]',
    warning: 'bg-[#F4B860]/10 text-[#F4B860]',
    error: 'bg-[#D96C6C]/10 text-[#D96C6C]',
    info: 'bg-[#3BA7B8]/10 text-[#3BA7B8]',
  }

  return (
    <Card className={cn('relative overflow-hidden', className)} hover>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
              <Icon size={22} className="text-white" />
            </div>
          )}
          <div>
            <h4 className="font-heading font-semibold text-[#1D2D35]">{title}</h4>
            {subtitle && <p className="text-xs text-[#5E7480]">{subtitle}</p>}
          </div>
        </div>
        {status && (
          <span className={cn('px-2 py-1 rounded-lg text-xs font-medium', statusColors[status])}>
            {status === 'success' && 'Actif'}
            {status === 'warning' && 'Attention'}
            {status === 'error' && 'Erreur'}
            {status === 'info' && 'Info'}
          </span>
        )}
      </div>
      
      {value && (
        <div className="mb-2">
          <span className="text-3xl font-bold text-[#1D2D35]">{value}</span>
          {trend && (
            <span className={cn(
              'ml-2 text-sm font-medium',
              trend.startsWith('+') ? 'text-[#4FAF8F]' : 'text-[#D96C6C]'
            )}>
              {trend}
            </span>
          )}
        </div>
      )}

      {children}
    </Card>
  )
}
