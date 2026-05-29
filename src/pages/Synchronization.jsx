import { useState, useEffect } from 'react'
import { 
  RefreshCw, Database, Server, ArrowRight, 
  CheckCircle2, AlertCircle, Clock, Zap, Globe, 
  ArrowUpRight, Save, MapPin, Building2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Badge from '../components/Badge'
import SyncStatusCard from '../components/SyncStatusCard'
import Button from '../components/Button'
import Modal from '../components/Modal'
import api from '../services/api'
import { cn } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

export default function Synchronization() {
  const { showToast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [data, setData] = useState({ networkStats: {}, history: [], centers: [] })
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [hoveredCenterId, setHoveredCenterId] = useState(null)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [syncingCenterId, setSyncingCenterId] = useState(null)
  const [selectedCenterForSync, setSelectedCenterForSync] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/sync/dashboard')
      setData(res.data)
      if (res.data.centers?.length > 0 && !selectedCenterForSync) {
        setSelectedCenterForSync(res.data.centers[0].id)
      }
    } catch (err) {
      console.error('Erreur sync data', err)
      showToast('Impossible de charger les données de synchronisation.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleTriggerSync = async (centerId) => {
    if (!centerId) return showToast('Veuillez sélectionner un centre.', 'error')

    const targetCenter = data.centers.find((c) => c.id === centerId)
    if (!targetCenter) return showToast('Centre sélectionné introuvable.', 'error')

    setSyncing(true)
    setSyncingCenterId(centerId)
    setIsSyncModalOpen(false)

    try {
      await api.post('/admin/sync/trigger', { center_id: centerId })
      showToast(`Synchronisation réussie avec ${targetCenter.nom}`)
      await fetchData()
    } catch (err) {
      console.error('Erreur trigger sync', err)
      showToast('Erreur lors de la synchronisation.', 'error')
    } finally {
      setSyncing(false)
      setSyncingCenterId(null)
    }
  }

  const formatLastSync = (dateString) => {
    if (!dateString) return 'Jamais'
    const now = new Date()
    const syncDate = new Date(dateString)
    const diffInMinutes = Math.floor((now - syncDate) / 60000)
    
    if (diffInMinutes < 1) return "À l'instant"
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `Il y a ${diffInHours} h`
  }

  const onlineCenters = data.centers || []
  const statCards = [
    { label: 'Dossiers Totaux', value: (data.networkStats.totalRecords || 0).toLocaleString(), icon: Database, color: 'from-[#3BA7B8] to-[#58D6C3]' },
    { label: 'Synchronisés', value: (data.networkStats.syncedRecords || 0).toLocaleString(), icon: CheckCircle2, color: 'from-[#4FAF8F] to-[#58D6C3]', trend: '+234' },
    { label: 'En attente', value: (data.networkStats.pendingSync || 0).toString(), icon: Clock, color: 'from-[#F4B860] to-[#D96C6C]' },
    { label: 'Latence Moy.', value: data.networkStats.avgLatency || '0ms', icon: Zap, color: 'from-[#0F4C5C] to-[#3BA7B8]' },
  ]

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Synchronisation</h1>
              <p className="text-[#5E7480]">Vue en temps réel du système distribué MediNode</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsSyncModalOpen(true)} loading={syncing} variant="accent">
                <RefreshCw size={18} className={cn(syncing && 'animate-spin')} />
                Lancer Synchronisation
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4FAF8F]/10">
                <div className="w-2 h-2 rounded-full bg-[#4FAF8F] animate-pulse" />
                <span className="text-sm font-medium text-[#4FAF8F]">Système actif</span>
              </div>
              <span className="text-sm text-[#5E7480]">{currentTime.toLocaleTimeString('fr-FR')}</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4 mb-6">
            <Card className="col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] text-white">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-white" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={20} />
                  <span className="text-white/80 text-sm">Réseau Global</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{data.networkStats.totalNodes || 0}</span>
                  <span className="text-white/60 mb-1">noeuds</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#58D6C3]" />
                    {data.networkStats.activeNodes || 0} actifs
                  </span>
                  <span className="text-white/60">Consistance: {data.networkStats.consistency}</span>
                </div>
              </div>
            </Card>

            {statCards.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
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

          <div className="space-y-6 mb-6">
            {/* Network Topology - Full Width */}
            <Card className="w-full">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <Globe size={22} className="text-[#4FAF8F]" />
                  <Card.Title>Topologie du Réseau</Card.Title>
                </div>
                <Badge variant="success">{onlineCenters.length} connectés</Badge>
              </Card.Header>
              
              <div className="relative h-[450px] bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 mb-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4FAF8F] to-[#58D6C3] flex items-center justify-center shadow-lg border-4 border-white">
                      <Database size={36} className="text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-[#4FAF8F]/20 animate-ping" />
                  </div>
                  <p className="text-center mt-2 text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">MediNode Core</p>
                </div>

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
                  {onlineCenters.map((center, index) => {
                    const angle = (index * 360) / onlineCenters.length
                    const radius = 145
                    const x = 300 + Math.cos((angle * Math.PI) / 180) * radius
                    const y = 200 + Math.sin((angle * Math.PI) / 180) * radius
                    const isCurrentlySyncing = syncingCenterId === center.id && syncing
                    const isSynced = center.sync_status === 'synced' || !center.sync_status

                    return (
                      <g key={center.id}>
                        {/* Connection Line */}
                        <line
                          x1="300"
                          y1="200"
                          x2={x}
                          y2={y}
                          stroke={isCurrentlySyncing ? '#3BA7B8' : (isSynced ? '#4FAF8F' : '#CBD5E1')}
                          strokeWidth="2"
                          strokeDasharray="4,4"
                          className={isCurrentlySyncing ? 'animate-dash-flow' : ''}
                        />

                        {/* Communication Flow Animation (Moving green dots) */}
                        {(isSynced || isCurrentlySyncing) && (
                          <circle r="3" fill="#4FAF8F">
                            <animateMotion 
                              dur={isCurrentlySyncing ? "1.5s" : "4s"} 
                              repeatCount="indefinite" 
                              path={`M 300 200 L ${x} ${y}`} 
                            />
                          </circle>
                        )}

                        {/* HTML Node overlays */}
                        <foreignObject x={x - 60} y={y - 40} width="120" height="80">
                          <div 
                            className="flex flex-col items-center group cursor-help"
                            onMouseEnter={() => setHoveredCenterId(center.id)}
                            onMouseLeave={() => setHoveredCenterId(null)}
                          >
                            <div className={cn(
                              'w-11 h-11 rounded-xl flex items-center justify-center shadow-sm border transition-all duration-300',
                              center.status !== 'offline' 
                                ? 'bg-white border-slate-200 group-hover:scale-110 group-hover:border-[#4FAF8F]/50 group-hover:shadow-md' 
                                : 'bg-slate-100 border-transparent'
                            )}>
                              <Server size={20} className={center.status !== 'offline' ? "text-[#0F4C5C]" : "text-slate-400"} />
                            </div>
                            <div className={cn(
                              'w-2 h-2 rounded-full mt-1 border border-white',
                              center.status !== 'offline' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'
                            )} />
                            <span className="text-[11px] font-bold text-slate-700 mt-1 uppercase tracking-tight text-center leading-none px-1 drop-shadow-sm">
                              {center.nom}
                            </span>
                          </div>
                        </foreignObject>
                      </g>
                    )
                  })}
                </svg>

                {/* Center Info Tooltip - S'affiche au survol */}
                {hoveredCenterId && (
                  <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-[#EAF1F4] shadow-soft-lg animate-fade-in w-60">
                    {(() => {
                      const c = data.centers.find(item => item.id === hoveredCenterId);
                      if (!c) return null;
                      return (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-[#EAF1F4]">
                            <div className="w-8 h-8 rounded-lg bg-[#4FAF8F]/10 flex items-center justify-center">
                              <Building2 size={16} className="text-[#4FAF8F]" />
                            </div>
                            <p className="text-xs font-bold text-[#1D2D35] truncate">{c.nom}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-[#5E7480]">
                              <MapPin size={12} className="text-[#3BA7B8] shrink-0" />
                              <span className="truncate">{c.ville || 'Emplacement distant'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#5E7480]">
                              <Database size={12} className="text-[#3BA7B8] shrink-0" />
                              <span>{c.dossiers_count || 0} dossiers synchronisés</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 pt-1">
                              <div className={cn("w-1.5 h-1.5 rounded-full", c.status !== 'offline' ? "bg-emerald-500" : "bg-rose-500")} />
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#1D2D35]">
                                {c.status !== 'offline' ? 'Système Connecté' : 'Mode Hors Ligne'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              {/* Real-time Activity moved here */}
              <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <RefreshCw size={20} className="text-[#3BA7B8] animate-spin" style={{ animationDuration: '3s' }} />
                  <Card.Title>Activité Temps Réel</Card.Title>
                </div>
              </Card.Header>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {data.history.map((sync, index) => (
                  <div
                    key={sync.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl transition-all',
                      index === 0 ? 'bg-[#3BA7B8]/10 border border-[#3BA7B8]/20' : 'bg-[#F6FAFB]'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      sync.status === 'success' || sync.status === 'acknowledged' ? 'bg-[#4FAF8F]/10' : 'bg-[#D96C6C]/10'
                    )}>
                      {sync.status === 'success' || sync.status === 'acknowledged' ? (
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
                      <p className="text-xs text-[#5E7480]">{sync.records} dossiers - {sync.duration}</p>
                    </div>
                    <span className="text-xs text-[#5E7480]">{sync.time}</span>
                  </div>
                ))}
              </div>
            </Card>

              {/* Node Status Grid moved here */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Server size={20} className="text-[#3BA7B8]" />
                    <Card.Title>État des Noeuds</Card.Title>
                  </div>
                </Card.Header>
                <div className="grid grid-cols-1 gap-4 max-h-72 overflow-y-auto pr-2">
                  {data.centers.map((center) => (
                    <SyncStatusCard
                      key={center.id}
                      node={center.nom}
                      status={center.sync_status || 'synced'}
                      lastSync={formatLastSync(center.synced_at)}
                      records={center.dossiers_count || 0}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <Modal
            isOpen={isSyncModalOpen}
            onClose={() => setIsSyncModalOpen(false)}
            title="Lancer la synchronisation"
          >
            <p className="text-sm text-[#5E7480] mb-4">Sélectionnez le centre avec lequel vous souhaitez lancer une synchronisation manuelle.</p>
            <div className="space-y-3">
              {data.centers.length === 0 ? (
                <p className="text-sm text-[#D96C6C]">Aucun centre médical disponible.</p>
              ) : (
                data.centers.map((center) => (
                  <label key={center.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#EAF1F4] hover:bg-[#F6FAFB] cursor-pointer">
                    <input
                      type="radio"
                      name="syncCenter"
                      value={center.id}
                      checked={selectedCenterForSync === center.id}
                      onChange={(e) => setSelectedCenterForSync(Number(e.target.value))}
                      className="form-radio text-[#3BA7B8] focus:ring-[#3BA7B8]"
                    />
                    <span className="font-medium text-[#1D2D35]">{center.nom}</span>
                  </label>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSyncModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => handleTriggerSync(selectedCenterForSync)} loading={syncing} variant="accent">
                <Save size={16} className="mr-2" />
                Lancer
              </Button>
            </div>
          </Modal>
        </main>
      </div>
    </div>
  )
}
