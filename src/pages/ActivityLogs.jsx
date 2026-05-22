import { useState } from 'react'
import { 
  Activity, Filter, Download, FileText, RefreshCw, 
  Shield, AlertTriangle, CheckCircle2, LogIn, LogOut,
  Edit, Trash2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Badge from '../components/Badge'
import { activityLogs } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function ActivityLogs() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  const types = ['all', 'record', 'sync', 'access', 'security', 'update']
  const severities = ['all', 'info', 'success', 'warning', 'error', 'critical']

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(search.toLowerCase()) ||
                          log.user.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || log.type === typeFilter
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter
    return matchesSearch && matchesType && matchesSeverity
  })

  const typeConfig = {
    record: { icon: FileText, color: 'text-[#3BA7B8]', bg: 'bg-[#3BA7B8]/10' },
    sync: { icon: RefreshCw, color: 'text-[#4FAF8F]', bg: 'bg-[#4FAF8F]/10' },
    access: { icon: LogIn, color: 'text-[#5E7480]', bg: 'bg-[#5E7480]/10' },
    security: { icon: Shield, color: 'text-[#D96C6C]', bg: 'bg-[#D96C6C]/10' },
    update: { icon: Edit, color: 'text-[#F4B860]', bg: 'bg-[#F4B860]/10' },
    alert: { icon: AlertTriangle, color: 'text-[#D96C6C]', bg: 'bg-[#D96C6C]/10' },
  }

  const severityConfig = {
    info: { variant: 'default', color: 'text-[#5E7480]' },
    success: { variant: 'success', color: 'text-[#4FAF8F]' },
    warning: { variant: 'warning', color: 'text-[#F4B860]' },
    error: { variant: 'error', color: 'text-[#D96C6C]' },
    critical: { variant: 'error', color: 'text-[#D96C6C]' },
  }

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Journal d&apos;activité</h1>
              <p className="text-[#5E7480]">Historique des actions et événements système</p>
            </div>
            <Button variant="outline">
              <Download size={18} />
              Exporter
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total', value: activityLogs.length, color: 'from-[#0F4C5C] to-[#3BA7B8]' },
              { label: 'Info', value: activityLogs.filter(l => l.severity === 'info').length, color: 'from-[#5E7480] to-[#1D2D35]' },
              { label: 'Succès', value: activityLogs.filter(l => l.severity === 'success').length, color: 'from-[#4FAF8F] to-[#58D6C3]' },
              { label: 'Alertes', value: activityLogs.filter(l => l.severity === 'warning').length, color: 'from-[#F4B860] to-[#D96C6C]' },
              { label: 'Erreurs', value: activityLogs.filter(l => ['error', 'critical'].includes(l.severity)).length, color: 'from-[#D96C6C] to-[#F4B860]' },
            ].map((stat, i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className={cn('absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-30 bg-gradient-to-br', stat.color)} />
                <p className="text-2xl font-bold text-[#1D2D35]">{stat.value}</p>
                <p className="text-sm text-[#5E7480]">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <SearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Rechercher dans les logs..."
                className="w-80"
              />
              <div className="flex items-center gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#EAF1F4] bg-white text-sm text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20"
                >
                  <option value="all">Tous types</option>
                  <option value="record">Dossiers</option>
                  <option value="sync">Synchronisation</option>
                  <option value="access">Accès</option>
                  <option value="security">Sécurité</option>
                  <option value="update">Modifications</option>
                </select>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#EAF1F4] bg-white text-sm text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20"
                >
                  <option value="all">Toutes sévérités</option>
                  <option value="info">Info</option>
                  <option value="success">Succès</option>
                  <option value="warning">Alerte</option>
                  <option value="error">Erreur</option>
                  <option value="critical">Critique</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Logs Timeline */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Activity size={20} className="text-[#3BA7B8]" />
                <Card.Title>Activité récente</Card.Title>
              </div>
              <Badge variant="default">{filteredLogs.length} entrées</Badge>
            </Card.Header>

            <div className="space-y-1">
              {filteredLogs.map((log, index) => {
                const typeConf = typeConfig[log.type] || typeConfig.record
                const sevConf = severityConfig[log.severity] || severityConfig.info
                const Icon = typeConf.icon

                return (
                  <div 
                    key={log.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-[#F6FAFB]',
                      index === 0 && 'bg-[#F6FAFB]'
                    )}
                  >
                    {/* Time */}
                    <div className="w-16 shrink-0 text-right">
                      <p className="text-sm font-medium text-[#1D2D35]">{log.time}</p>
                      <p className="text-xs text-[#5E7480]">{log.date}</p>
                    </div>

                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', typeConf.bg)}>
                        <Icon size={18} className={typeConf.color} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-[#1D2D35]">{log.action}</p>
                        <Badge variant={sevConf.variant} className="text-xs">
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#5E7480] truncate">{log.description}</p>
                    </div>

                    {/* Meta */}
                    <div className="text-right shrink-0">
                      <p className="text-sm text-[#1D2D35]">{log.user}</p>
                      <p className="text-xs text-[#5E7480] font-mono">{log.ip}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
