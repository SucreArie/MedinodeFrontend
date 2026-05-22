import { cn } from '../utils/helpers'

export default function Badge({ children, variant = 'default', size = 'default', className = '' }) {
  const variants = {
    default: 'bg-[#EAF1F4] text-[#5E7480]',
    primary: 'bg-[#0F4C5C]/10 text-[#0F4C5C]',
    success: 'bg-[#4FAF8F]/15 text-[#4FAF8F]',
    warning: 'bg-[#F4B860]/15 text-[#F4B860]',
    danger: 'bg-[#D96C6C]/15 text-[#D96C6C]',
    accent: 'bg-[#58D6C3]/15 text-[#3BA7B8]',
  }

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-lg',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}
