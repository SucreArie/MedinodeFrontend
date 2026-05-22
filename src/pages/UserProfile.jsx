import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Mail, Phone, Building2, Calendar, Clock,
  Edit, Shield, Activity, FileText, Users as UsersIcon
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { users, activityLogs } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const user = users.find(u => u.id === id)
  const userLogs = activityLogs.filter(log => log.user === user?.name).slice(0, 5)

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F6FAFB] flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-heading font-semibold text-[#1D2D35] mb-2">Utilisateur non trouvé</h2>
          <Button onClick={() => navigate('/users')}>Retour aux utilisateurs</Button>
        </Card>
      </div>
    )
  }

  const roleColors = {
    'Médecin': 'from-[#3BA7B8] to-[#58D6C3]',
    'Administrateur': 'from-[#0F4C5C] to-[#3BA7B8]',
    'Secrétaire': 'from-[#F4B860] to-[#D96C6C]',
  }

  const statusConfig = {
    active: { label: 'Actif', variant: 'success' },
    away: { label: 'Absent', variant: 'warning' },
    inactive: { label: 'Inactif', variant: 'default' },
  }

  const permissions = {
    'Médecin': ['Lire dossiers', 'Modifier dossiers', 'Créer consultations', 'Prescrire'],
    'Administrateur': ['Lire dossiers', 'Modifier dossiers', 'Supprimer dossiers', 'Gérer utilisateurs', 'Configuration système'],
    'Secrétaire': ['Lire dossiers', 'Gérer rendez-vous', 'Accueil patients'],
  }

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/users')}
              className="p-2 rounded-xl hover:bg-white text-[#5E7480] hover:text-[#1D2D35] transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">{user.name}</h1>
              <p className="text-[#5E7480]">{user.role} - {user.specialty}</p>
            </div>
            <Button variant="outline">
              <Edit size={18} />
              Modifier
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="col-span-2 space-y-6">
              <Card>
                <div className="flex items-start gap-6">
                  <div className={cn(
                    'w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-3xl',
                    roleColors[user.role] || 'from-[#5E7480] to-[#1D2D35]'
                  )}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-heading font-semibold text-[#1D2D35]">{user.name}</h2>
                      <Badge variant={statusConfig[user.status]?.variant || 'default'}>
                        {statusConfig[user.status]?.label}
                      </Badge>
                    </div>
                    <p className="text-[#5E7480] mb-4">{user.role} - {user.specialty}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                        <Mail size={16} />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                        <Phone size={16} />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                        <Building2 size={16} />
                        {user.center}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                        <Clock size={16} />
                        Dernière activité: {user.lastActive}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats */}
              {user.patientsCount !== null && (
                <div className="grid grid-cols-3 gap-4">
                  <Card className="text-center">
                    <p className="text-3xl font-bold text-[#0F4C5C]">{user.patientsCount}</p>
                    <p className="text-sm text-[#5E7480]">Patients suivis</p>
                  </Card>
                  <Card className="text-center">
                    <p className="text-3xl font-bold text-[#3BA7B8]">247</p>
                    <p className="text-sm text-[#5E7480]">Consultations (mois)</p>
                  </Card>
                  <Card className="text-center">
                    <p className="text-3xl font-bold text-[#4FAF8F]">98%</p>
                    <p className="text-sm text-[#5E7480]">Taux satisfaction</p>
                  </Card>
                </div>
              )}

              {/* Recent Activity */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Activity size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Activité Récente</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-3">
                  {userLogs.length > 0 ? userLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAFB]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#3BA7B8]/10 flex items-center justify-center">
                          <FileText size={14} className="text-[#3BA7B8]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1D2D35]">{log.action}</p>
                          <p className="text-xs text-[#5E7480]">{log.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#5E7480]">{log.time}</span>
                    </div>
                  )) : (
                    <p className="text-center text-[#5E7480] py-4">Aucune activité récente</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Shield size={20} className="text-[#0F4C5C]" />
                    <Card.Title>Permissions</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-2">
                  {(permissions[user.role] || []).map((permission, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F6FAFB]">
                      <div className="w-2 h-2 rounded-full bg-[#4FAF8F]" />
                      <span className="text-sm text-[#1D2D35]">{permission}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Actions Rapides</Card.Title>
                </Card.Header>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar size={18} />
                    Voir planning
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <UsersIcon size={18} />
                    Voir patients
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[#D96C6C] hover:bg-[#D96C6C]/10">
                    <Shield size={18} />
                    Modifier permissions
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
