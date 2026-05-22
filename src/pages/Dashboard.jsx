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
  MoreVertical,
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatCard from '../components/StatCard'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import {
  patients,
  stats,
  syncStatus,
  recentActivity,
  alerts,
  analytics,
} from '../data/mockData'
import { getStatusColor, getStatusTextColor, cn } from '../utils/helpers'

const iconMap = {
  FileText,
  RefreshCw,
  AlertTriangle,
  Edit,
  Shield,
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#1D2D35]">
          Tableau de bord
        </h1>
        <p className="text-[#5E7480] mt-1">
          Bienvenue Dr. Laurent, voici votre aperçu quotidien
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toLocaleString()}
          subtitle="dans votre réseau"
          icon={Users}
          trend="up"
          trendValue={stats.monthlyGrowth}
          color="primary"
        />
        <StatCard
          title="Dossiers Actifs"
          value={stats.activeRecords.toLocaleString()}
          subtitle="en consultation"
          icon={FileText}
          trend="up"
          trendValue="+8.2%"
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
              <Button variant="ghost" size="small" icon={ChevronRight} iconPosition="right">
                Voir tout
              </Button>
            </Card.Header>
            <div className="overflow-x-auto">
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
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-[#F6FAFB] transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center text-white text-xs font-semibold">
                            {patient.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1D2D35]">{patient.name}</p>
                            <p className="text-xs text-[#5E7480]">{patient.age} ans, {patient.gender}</p>
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
            </div>
          </Card>

          {/* Mini Analytics */}
          <Card>
            <Card.Header>
              <Card.Title>Visites cette semaine</Card.Title>
              <Badge variant="accent">+12% vs semaine dernière</Badge>
            </Card.Header>
            <div className="h-48 flex items-end justify-between gap-2 mt-4">
              {analytics.weeklyVisits.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-[#3BA7B8] to-[#58D6C3] rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{ height: `${(day.visits / 65) * 100}%` }}
                  />
                  <span className="text-xs text-[#5E7480]">{day.day}</span>
                </div>
              ))}
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
              {syncStatus.map((node, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAFB] hover:bg-[#EAF1F4] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full', getStatusColor(node.status))} />
                    <div>
                      <p className="text-sm font-medium text-[#1D2D35]">{node.node}</p>
                      <p className="text-xs text-[#5E7480]">{node.records} dossiers</p>
                    </div>
                  </div>
                  <span className={cn('text-xs font-medium', getStatusTextColor(node.status))}>
                    {node.lastSync}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <Card.Title>Activité Récente</Card.Title>
              <Button variant="ghost" size="small">Voir tout</Button>
            </Card.Header>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, i) => {
                const Icon = iconMap[activity.icon]
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      activity.type === 'alert' ? 'bg-[#D96C6C]/10' :
                      activity.type === 'sync' ? 'bg-[#4FAF8F]/10' :
                      'bg-[#3BA7B8]/10'
                    )}>
                      {Icon && (
                        <Icon
                          size={16}
                          className={
                            activity.type === 'alert' ? 'text-[#D96C6C]' :
                            activity.type === 'sync' ? 'text-[#4FAF8F]' :
                            'text-[#3BA7B8]'
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1D2D35]">{activity.action}</p>
                      <p className="text-xs text-[#5E7480] truncate">
                        {activity.patient || activity.node || activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-[#5E7480] shrink-0">{activity.time}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="border-l-4 border-[#D96C6C]">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#D96C6C]" />
                Alertes Actives
              </Card.Title>
              <Badge variant="danger">{alerts.length}</Badge>
            </Card.Header>
            <div className="space-y-3">
              {alerts.map((alert) => (
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
    </DashboardLayout>
  )
}
