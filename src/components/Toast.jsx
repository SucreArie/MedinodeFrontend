import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { cn } from '../utils/helpers'

export default function Toast({ message, type = 'success', onClose }) {
  const configs = {
    success: {
      bg: 'bg-[#4FAF8F]',
      icon: CheckCircle2,
      label: 'Succès'
    },
    error: {
      bg: 'bg-[#D96C6C]',
      icon: AlertCircle,
      label: 'Erreur'
    }
  }

  const config = configs[type] || configs.success
  const Icon = config.icon

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl text-white shadow-lg animate-fade-in",
      config.bg
    )}>
      <div className="p-1.5 rounded-xl bg-white/20">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-[200px]">
        <p className="font-bold text-sm leading-none mb-1">{config.label}</p>
        <p className="text-sm text-white/90">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2">
        <X size={16} />
      </button>
    </div>
  )
}