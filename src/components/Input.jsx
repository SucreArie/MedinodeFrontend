import { cn } from '../utils/helpers'

export default function Input({
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E7480]">
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-3 rounded-xl border bg-white text-[#1D2D35] placeholder:text-[#5E7480]/60',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/30 focus:border-[#3BA7B8]',
            Icon && 'pl-11',
            error ? 'border-[#D96C6C] focus:ring-[#D96C6C]/30 focus:border-[#D96C6C]' : 'border-[#EAF1F4]',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-[#D96C6C]">{error}</p>
      )}
    </div>
  )
}
