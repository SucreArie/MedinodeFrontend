import { useState, useEffect } from 'react'
import { 
  RefreshCw, Database, Server, Activity, ArrowRight, 
  CheckCircle2, AlertCircle, Clock, Zap, Globe, 
  TrendingUp, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { medicalCenters, syncHistory, networkStats } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function Synchronization() {
  const [activeFlows, setActiveFlows] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Simulate active sync flows
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlows(prev => {
        const newFlows = [...prev]
        if (Math.random() > 0.7 && newFlows.length < 3) {
          const from = medicalCenters[Math.floor(Math.random() * medicalCenters.length)]
          const to = medicalCenters.filter(c => c.id !== from.id)[Math.floor(Math.random() * (medicalCenters.length - 1))]
          newFlows.push({ id: Date.now(), from: from.name, to: to.name, progress: 0 })
        }
        return newFlows.map(f => ({ ...f, progress: Math.min(f.progress + 10, 100) })).filter(f => f.progress < 100)
      })
      setCurrentTime(new Date())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const onlineCenters = medicalCenters.filter(c => c.status === 'online')

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Synchronisation</h1>
              <p className="text-[#5E7480]">Vue en temps réel du système distribué MediNode</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4FAF8F]/10">
                <div className="w-2 h-2 rounded-full bg-[#4FAF8F] animate-pulse" />
                <span className="text-sm font-medium text-[#4FAF8F]">Système actif</span>
              </div>
              <span className="text-sm text-[#5E7480]">
                {currentTime.toLocaleTimeString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Network Stats - Hero Section */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <Card className="col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] text-white">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-white" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={20} />
                  <span className="text-white/80 text-sm">Réseau Global</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{networkStats.totalNodes}</span>
                  <span className="text-white/60 mb-1">noeuds</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#58D6C3]" />
                    {networkStats.activeNodes} actifs
                  </span>
                  <span className="text-white/60">
                    Consistance: {networkStats.consistency}
                  </span>
                </div>
              </div>
            </Card>

            {[
              { label: 'Dossiers Totaux', value: networkStats.totalRecords.toLocaleString(), icon: Database, color: 'from-[#3BA7B8] to-[#58D6C3]' },
              { label: 'Synchronisés', value: networkStats.syncedRecords.toLocaleString(), icon: CheckCircle2, color: 'from-[#4FAF8F] to-[#58D6C3]', trend: '+234' },
              { label: 'En attente', value: networkStats.pendingSync.toString(), icon: Clock, color: 'from-[#F4B860] to-[#D96C6C]' },
              { label: 'Latence Moy.', value: networkStats.avgLatency, icon: Zap, color: 'from-[#0F4C5C] to-[#3BA7B8]' },
            ].map((stat, i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className={cn('absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-30 bg-gradient-to-br', stat.color)} />
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={16} className="text-[#5E7480]" />
                  <span className="text-xs text-[#5E7480]">{stat.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-[#1D2D35]">{stat.value}</span>
                  {stat.trend && (
                    <span className="text-xs text-[#4FAF8F] flex items-center">
                      <ArrowUpRight size={12} />
                      {stat.trend}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Main Visualization */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Network Topology */}
            <Card className="col-span-2">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <Activity size={20} className="text-[#3BA7B8]" />
                  <Card.Title>Topologie du Réseau</Card.Title>
                </div>
                <Badge variant="success">{onlineCenters.length} connectés</Badge>
              </Card.Header>

              {/* Visual Network Map */}
              <div className="relative h-80 bg-gradient-to-br from-[#F6FAFB] to-[#EAF1F4] rounded-2xl overflow-hidden">
                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center shadow-lg">
                      <Database size={32} className="text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#3BA7B8]/30 animate-ping" />
                  </div>
                  <p className="text-center mt-2 text-xs font-medium text-[#1D2D35]">MediNode Core</p>
                </div>

                {/* Connected Nodes */}
                {onlineCenters.map((center, index) => {
                  const angle = (index * 360) / onlineCenters.length
                  const radius = 120
                  const x = Math.cos((angle * Math.PI) / 180) * radius
                  const y = Math.sin((angle * Math.PI) / 180) * radius
                  const isSyncing = center.syncStatus === 'syncing'

                  return (
                    <div key={center.id}>
                      {/* Connection Line */}
                      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                        <line
                          x1="50%"
                          y1="50%"
                          x2={`calc(50% + ${x}px)`}
                          y2={`calc(50% + ${y}px)`}
                          stroke={isSyncing ? '#3BA7B8' : '#EAF1F4'}
                          strokeWidth={isSyncing ? 3 : 2}
                          strokeDasharray={isSyncing ? '5,5' : 'none'}
                          className={isSyncing ? 'animate-pulse' : ''}
                        />
                      </svg>

                      {/* Node */}
                      <div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                      >
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shadow-soft transition-all',
                          center.status === 'online' 
                            ? 'bg-white hover:scale-110' 
                            : 'bg-[#EAF1F4]'
                        )}>
                          <Server size={20} className={center.status === 'online' ? 'text-[#0F4C5C]' : 'text-[#5E7480]'} />
                        </div>
                        <div className={cn(
                          'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
                          center.status === 'online' ? 'bg-[#4FAF8F]' : 'bg-[#D96C6C]'
                        )} />
                        <p className="text-[10px] text-center mt-1 text-[#5E7480] font-medium whitespace-nowrap">
                          {center.name.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  )
                })}

                {/* Active Data Flows Animation */}
                {activeFlows.map((flow) => (
                  <div 
                    key={flow.id}
                    className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-[#58D6C3] shadow-lg animate-pulse"
                    style={{
                      transform: `translate(${-8 + flow.progress}px, ${-8}px)`,
                      opacity: 1 - flow.progress / 100
                    }}
                  />
                ))}
              </div>
            </Card>

            {/* Real-time Activity */}
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <RefreshCw size={20} className="text-[#3BA7B8] animate-spin" style={{ animationDuration: '3s' }} />
                  <Card.Title>Activité Temps Réel</Card.Title>
                </div>
              </Card.Header>

              <div className="space-y-3 max-h-72 overflow-y-auto">
                {syncHistory.slice(0, 8).map((sync, index) => (
                  <div 
                    key={sync.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all',
                      index === 0 ? 'bg-[#3BA7B8]/10 border border-[#3BA7B8]/20' : 'bg-[#F6FAFB]'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      sync.status === 'success' ? 'bg-[#4FAF8F]/10' : 'bg-[#D96C6C]/10'
                    )}>
                      {sync.status === 'success' ? (
                        <CheckCircle2 size={16} className="text-[#4FAF8F]" />
                      ) : (
                        <AlertCircle size={16} className="text-[#D96C6C]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs text-[#5E7480]">
                        <span className="font-medium text-[#1D2D35] truncate">{sync.from.split(' ')[0]}</span>
                        <ArrowRight size={12} />
                        <span className="font-medium text-[#1D2D35] truncate">{sync.to.split(' ')[0]}</span>
                      </div>
                      <p className="text-xs text-[#5E7480]">{sync.records} fichiers - {sync.duration}</p>
                    </div>
                    <span className="text-xs text-[#5E7480]">{sync.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Node Status Grid */}
          <Card>
            <Card.Header>
              <div className="flex items-center gap-2">
                <Server size={20} className="text-[#3BA7B8]" />
                <Card.Title>État des Noeuds</Card.Title>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4FAF8F]" />
                  Synchronisé
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#3BA7B8] animate-pulse" />
                  En cours
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F4B860]" />
                  En pause
                </span>
              </div>
            </Card.Header>

            <div className="grid grid-cols-3 gap-4">
              {medicalCenters.map((center) => (
                <div 
                  key={center.id}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all',
                    center.syncStatus === 'synced' && 'border-[#4FAF8F]/30 bg-[#4FAF8F]/5',
                    center.syncStatus === 'syncing' && 'border-[#3BA7B8]/30 bg-[#3BA7B8]/5',
                    center.syncStatus === 'paused' && 'border-[#F4B860]/30 bg-[#F4B860]/5',
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        center.syncStatus === 'synced' && 'bg-[#4FAF8F]',
                        center.syncStatus === 'syncing' && 'bg-[#3BA7B8] animate-pulse',
                        center.syncStatus === 'paused' && 'bg-[#F4B860]',
                      )} />
                      <span className="font-medium text-[#1D2D35]">{center.name}</span>
                    </div>
                    <Badge variant={center.status === 'online' ? 'success' : 'warning'} className="text-xs">
                      {center.status === 'online' ? 'En ligne' : 'Maintenance'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-[#5E7480]">Dossiers:</span>
                      <span className="ml-1 font-semibold text-[#1D2D35]">{center.totalRecords}</span>
                    </div>
                    <div>
                      <span className="text-[#5E7480]">Charge:</span>
                      <span className={cn(
                        'ml-1 font-semibold',
                        center.serverLoad < 50 ? 'text-[#4FAF8F]' : center.serverLoad < 80 ? 'text-[#F4B860]' : 'text-[#D96C6C]'
                      )}>{center.serverLoad}%</span>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[#5E7480] mb-1">
                      <span>Dernière sync</span>
                      <span>{center.lastSync}</span>
                    </div>
                    <div className="h-1.5 bg-[#EAF1F4] rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all',
                          center.syncStatus === 'synced' && 'bg-[#4FAF8F] w-full',
                          center.syncStatus === 'syncing' && 'bg-[#3BA7B8] w-2/3 animate-pulse',
                          center.syncStatus === 'paused' && 'bg-[#F4B860] w-1/3',
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
