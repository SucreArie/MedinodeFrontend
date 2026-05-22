import { cn } from '../utils/helpers'

export default function Card({ children, className = '', glass = false, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        glass 
          ? 'glass' 
          : 'bg-white shadow-soft',
        hover && 'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('font-heading font-semibold text-[#1D2D35]', className)}>
      {children}
    </h3>
  )
}

Card.Content = function CardContent({ children, className = '' }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}
