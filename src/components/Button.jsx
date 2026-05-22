import { cn } from '../utils/helpers'

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  ...props
}) {
  const variants = {
    primary: 'bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90 shadow-soft',
    secondary: 'bg-[#EAF1F4] text-[#0F4C5C] hover:bg-[#EAF1F4]/80',
    accent: 'bg-gradient-to-r from-[#3BA7B8] to-[#58D6C3] text-white hover:opacity-90 shadow-soft',
    outline: 'border-2 border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white',
    ghost: 'text-[#5E7480] hover:bg-[#EAF1F4] hover:text-[#0F4C5C]',
    danger: 'bg-[#D96C6C] text-white hover:bg-[#D96C6C]/90',
  }

  const sizes = {
    small: 'px-3 py-1.5 text-sm gap-1.5',
    default: 'px-5 py-2.5 text-sm gap-2',
    large: 'px-7 py-3.5 text-base gap-2.5',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/50 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Chargement...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'small' ? 14 : 18} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'small' ? 14 : 18} />}
        </>
      )}
    </button>
  )
}
