import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import Card from './Card'
import { cn } from '../utils/helpers'

export default function SyncStatusCard({ node, status, lastSync, records, className = '' }) {
  const statusConfig = {
    synced: { icon: CheckCircle2, color: 'text-[#4FAF8F]', bg: 'bg-[#4FAF8F]/10', label: 'Synchronisé' },
    syncing: { icon: RefreshCw, color: 'text-[#3BA7B8]', bg: 'bg-[#3BA7B8]/10', label: 'En cours' },
    error: { icon: AlertCircle, color: 'text-[#D96C6C]', bg: 'bg-[#D96C6C]/10', label: 'Erreur' },
    paused: { icon: Clock, color: 'text-[#F4B860]', bg: 'bg-[#F4B860]/10', label: 'En pause' },
  }

  const config = statusConfig[status] || statusConfig.synced
  const Icon = config.icon

  return (
    <Card className={cn('relative overflow-hidden', className)} hover>
      <div className={cn('absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20', config.bg)} />
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-heading font-semibold text-[#1D2D35]">{node}</h4>
          <p className="text-xs text-[#5E7480]">{lastSync}</p>
        </div>
        <div className={cn('p-2 rounded-xl', config.bg)}>
          <Icon size={18} className={cn(config.color, status === 'syncing' && 'animate-spin')} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-medium', config.color)}>{config.label}</span>
        <span className="text-sm font-semibold text-[#1D2D35]">{records} fichiers</span>
      </div>
    </Card>
  )
}
