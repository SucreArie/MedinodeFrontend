import {
  Users,
  FileText,
  RefreshCw,
  AlertTriangle,
  Activity,
  Clock,
  ChevronRight,
  Edit,
  Shield,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { analytics } from '../data/mockData'
import { getStatusColor, getStatusTextColor, cn } from '../utils/helpers'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Loader from '../components/Loader'

const initialForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || ''
})

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { notifications } = useNotifications()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(initialForm(user))
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  
  // Real data states
  const [loading, setLoading] = useState(true)
  const [recentPatients, setRecentPatients] = useState([])
  const [weeklyVisits, setWeeklyVisits] = useState([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeRecords: 0,
    syncedNodes: 0,
    pendingAlerts: 0,
    uptime: '99.9%'
  })
  const [syncStatusData, setSyncStatusData] = useState([])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [patientsRes, dossiersRes, syncRes, consultationsRes] = await Promise.all([
        api.get('/patients?role=patient'),
        api.get('/dossiers'),
        api.get('/admin/sync/dashboard').catch(() => ({ data: { networkStats: {}, centers: [] } })),
        api.get('/consultations').catch(() => ({ data: [] }))
      ])

      const allPatients = Array.isArray(patientsRes.data) ? patientsRes.data : (patientsRes.data?.data || [])
      const allDossiers = Array.isArray(dossiersRes.data) ? dossiersRes.data : (dossiersRes.data?.data || [])
      const allConsultations = Array.isArray(consultationsRes.data) ? consultationsRes.data : (consultationsRes.data?.data || [])
      const syncInfo = syncRes.data

      // Sort and take last 10 patients
      const sortedPatients = [...allPatients].sort((a, b) => b.id - a.id).slice(0, 10)
      
      setRecentPatients(sortedPatients)
      setStats({
        totalPatients: allPatients.length,
        activeRecords: allDossiers.length,
        syncedNodes: syncInfo.networkStats?.totalNodes || 0,
        pendingAlerts: notifications.filter(n => n.type === 'critical' || n.type === 'error').length,
        uptime: '99.97%',
        monthlyGrowth: '+12%' // Simulation car non stocké en DB
      })
      
      // Logic to calculate visits for the current week
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      const now = new Date()
      const currentDay = now.getDay() // 0 (Dim) to 6 (Sam)
      const monday = new Date(now)
      monday.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1)) // Set to Monday

      const weeklyData = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday)
        date.setDate(monday.getDate() + i)
        const dateString = date.toISOString().split('T')[0]
        const count = allConsultations.filter(c => c.date?.startsWith(dateString)).length
        weeklyData.push({
          day: days[date.getDay()],
          visits: count
        })
      }
      setWeeklyVisits(weeklyData)
      setSyncStatusData(syncInfo.centers || [])
    } catch (err) {
      console.error("Erreur chargement dashboard", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter notifications to show only critical or warning alerts in the specific Alerts card
  const activeAlerts = notifications.filter(n => n.type === 'critical' || n.type === 'error' || n.type === 'warning')

  useEffect(() => {
    fetchDashboardData()
  }, [notifications]) // Re-fetch stats if notifications change (like new critical alerts)

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSaveMessage('')
    setFormData(initialForm(user))
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await updateUser(formData)
    setSaving(false)
    setSaveMessage(result.success ? 'Informations mises à jour.' : result.message)
    if (result.success) {
      setTimeout(handleCloseModal, 1200)
    }
  }
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#1D2D35]">
          Tableau de bord
        </h1>
        <p className="text-[#5E7480] mt-1">
          Bienvenue {user?.name || 'Utilisateur'}, voici votre aperçu quotidien
        </p>
        <div className="mt-4">
          {/* <Button variant="outline" size="small" onClick={() => setIsModalOpen(true)}>
            <Edit size={16} />
            Mes informations
          </Button> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          subtitle="dans votre réseau"
          icon={Users}
          trend="up"
          trendValue={stats.monthlyGrowth || '+0%'}
          color="primary"
        />
        <StatCard
          title="Dossiers Actifs"
          value={stats.activeRecords.toLocaleString()}
          subtitle="Dossiers DME créés"
          icon={FileText}
          trend="up"
          trendValue="+4.1%"
          color="accent"
        />
        <StatCard
          title="Nœuds Synchronisés"
          value={stats.syncedNodes}
          subtitle={`Uptime: ${stats.uptime}`}
          icon={RefreshCw}
          color="success"
        />
        <StatCard
          title="Alertes en Attente"
          value={stats.pendingAlerts}
          subtitle="à traiter"
          icon={AlertTriangle}
          color="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Patients */}
          <Card>
            <Card.Header>
              <Card.Title>Patients Récents</Card.Title>
              <Button variant="ghost" size="small" icon={ChevronRight} iconPosition="right" onClick={() => navigate('/patients')}>
                Voir tout
              </Button>
            </Card.Header>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-12"><Loader /></div>
              ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#EAF1F4]">
                    <th className="pb-3 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Patient</th>
                    <th className="pb-3 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">ID</th>
                    <th className="pb-3 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Condition</th>
                    <th className="pb-3 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Statut</th>
                    <th className="pb-3 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAF1F4]">
                  {recentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-[#F6FAFB] transition-colors cursor-pointer" onClick={() => navigate(`/patients/${patient.id}`)}>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center text-white text-xs font-semibold">
                            {patient.name ? patient.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'P'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1D2D35]">{patient.name}</p>
                            <p className="text-xs text-[#5E7480]">{patient.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-[#5E7480] font-mono">{patient.id}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-[#1D2D35]">{patient.condition}</span>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            patient.status === 'stable' ? 'success' :
                            patient.status === 'critical' ? 'danger' : 'warning'
                          }
                        >
                          {patient.status === 'stable' ? 'Stable' :
                           patient.status === 'critical' ? 'Critique' : 'Surveillance'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <button className="p-2 hover:bg-[#EAF1F4] rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-[#5E7480]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </Card>

          {/* Mini Analytics */}
          <Card>
            <Card.Header>
              <Card.Title>Calendrier hebdomadaire</Card.Title>
              <Badge variant="accent">Consultations planifiées</Badge>
            </Card.Header>
            <div className="h-48 flex items-end justify-between gap-2 mt-4">
              {weeklyVisits.map((day, i) => {
                const maxVisits = Math.max(...weeklyVisits.map(v => v.visits), 1)
                return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div
                    className="w-full bg-gradient-to-t from-[#3BA7B8] to-[#58D6C3] rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(day.visits / (maxVisits + 2)) * 100}%`, minHeight: day.visits > 0 ? '4px' : '2px' }}
                  />
                  <span className="absolute -top-6 text-[10px] font-bold text-[#3BA7B8] opacity-0 group-hover:opacity-100 transition-opacity">{day.visits}</span>
                  <span className="text-xs text-[#5E7480]">{day.day}</span>
                </div>
              )})}
            </div>
          </Card>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Sync Status */}
          <Card>
            <Card.Header>
              <Card.Title>État Synchronisation</Card.Title>
              <RefreshCw size={16} className="text-[#4FAF8F] animate-spin" style={{ animationDuration: '3s' }} />
            </Card.Header>
            <div className="space-y-3">
              {syncStatusData.slice(0, 4).map((node, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAFB] hover:bg-[#EAF1F4] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full', node.status === 'offline' ? 'bg-[#D96C6C]' : 'bg-[#4FAF8F]')} />
                    <div>
                      <p className="text-sm font-medium text-[#1D2D35] truncate max-w-[120px]">{node.nom}</p>
                      <p className="text-xs text-[#5E7480]">{node.dossiers_count || 0} dossiers</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#5E7480]">
                    {node.sync_status || 'synced'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <Card.Title>Activité Récente</Card.Title>
              <Button variant="ghost" size="small" onClick={() => navigate('/logs')}>Voir tout</Button>
            </Card.Header>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-xs text-center text-[#5E7480] py-4">Aucune activité récente</p>
              ) : (
                notifications.slice(0, 5).map((activity, i) => {
                const Icon = activity.type === 'critical' ? AlertTriangle : (activity.type === 'success' ? CheckCircle2 : FileText)
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      activity.type === 'critical' ? 'bg-[#D96C6C]/10' :
                      activity.type === 'success' ? 'bg-[#4FAF8F]/10' :
                      'bg-[#3BA7B8]/10'
                    )}>
                      {Icon && (
                        <Icon
                          size={16}
                          className={
                            activity.type === 'critical' ? 'text-[#D96C6C]' :
                            activity.type === 'success' ? 'text-[#4FAF8F]' :
                            'text-[#3BA7B8]'
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1D2D35] line-clamp-1">{activity.message}</p>
                      <p className="text-[10px] text-[#5E7480]">
                        {activity.type.toUpperCase()}
                      </p>
                    </div>
                    <span className="text-xs text-[#5E7480] shrink-0">{activity.time}</span>
                  </div>
                )
              })
              )}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="border-l-4 border-[#D96C6C]">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#D96C6C]" />
                Alertes Actives
              </Card.Title>
              <Badge variant="danger">{activeAlerts.length}</Badge>
            </Card.Header>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-3 rounded-xl cursor-pointer transition-colors',
                    alert.type === 'critical' ? 'bg-[#D96C6C]/10 hover:bg-[#D96C6C]/15' :
                    alert.type === 'warning' ? 'bg-[#F4B860]/10 hover:bg-[#F4B860]/15' :
                    'bg-[#3BA7B8]/10 hover:bg-[#3BA7B8]/15'
                  )}
                >
                  <p className="text-sm text-[#1D2D35]">{alert.message}</p>
                  <p className="text-xs text-[#5E7480] mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="small" className="w-full mt-4">
              Gérer les alertes
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Modifier mes informations"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nom complet"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Votre nom"
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="votre.email@exemple.com"
          />
          <Input
            label="Téléphone"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="06 12 34 56 78"
          />
          {saveMessage && (
            <p className="text-sm text-[#5E7480]">{saveMessage}</p>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
