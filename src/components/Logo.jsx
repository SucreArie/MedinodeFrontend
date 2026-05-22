import { Activity, Zap } from 'lucide-react'

export default function Logo({ size = 'default', showText = true }) {
  const sizes = {
    small: { icon: 20, text: 'text-lg' },
    default: { icon: 28, text: 'text-xl' },
    large: { icon: 36, text: 'text-2xl' },
  }

  const { icon, text } = sizes[size] || sizes.default

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center shadow-soft">
          <Activity className="text-white" size={icon} strokeWidth={2.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#58D6C3] flex items-center justify-center">
          <Zap className="text-[#0F4C5C]" size={10} strokeWidth={3} />
        </div>
      </div>
      {showText && (
        <span className={`font-heading font-bold ${text} text-[#0F4C5C]`}>
          Medi<span className="text-[#3BA7B8]">Node</span>
        </span>
      )}
    </div>
  )
}
