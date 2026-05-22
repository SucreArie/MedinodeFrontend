import { FileX } from 'lucide-react'
import { cn } from '../utils/helpers'

export default function EmptyState({ 
  icon: Icon = FileX, 
  title = 'Aucune donnée', 
  description = 'Aucun élément à afficher pour le moment.',
  action,
  className = ''
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-[#EAF1F4] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#5E7480]" />
      </div>
      <h3 className="font-heading font-semibold text-[#1D2D35] mb-2">{title}</h3>
      <p className="text-sm text-[#5E7480] max-w-sm mb-4">{description}</p>
      {action}
    </div>
  )
}
