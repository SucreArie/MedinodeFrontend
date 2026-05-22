import { cn, getStatusColor } from '../utils/helpers'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  className = '',
}) {
  const colors = {
    primary: 'from-[#0F4C5C] to-[#3BA7B8]',
    accent: 'from-[#3BA7B8] to-[#58D6C3]',
    success: 'from-[#4FAF8F] to-[#58D6C3]',
    warning: 'from-[#F4B860] to-[#F4B860]/70',
    danger: 'from-[#D96C6C] to-[#D96C6C]/70',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 bg-white shadow-soft',
        'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#5E7480] mb-1">{title}</p>
          <p className="text-2xl font-heading font-bold text-[#1D2D35]">{value}</p>
          {subtitle && (
            <p className="text-xs text-[#5E7480] mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trend === 'up' ? 'text-[#4FAF8F]' : 'text-[#D96C6C]'
            )}>
              {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
            colors[color]
          )}>
            <Icon className="text-white" size={22} />
          </div>
        )}
      </div>
      
      {/* Decorative gradient line */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r',
        colors[color]
      )} />
    </div>
  )
}
