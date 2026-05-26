import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Users as UsersIcon, Stethoscope, Shield, UserCog } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Badge from '../components/Badge'
import api from '../services/api'
import { cn } from '../utils/helpers'

export default function Users() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [usersData, setUsersData] = useState([])
  const [loading, setLoading] = useState(true)

  const roles = [
    { id: 'all', label: 'Tous' },
    { id: 'doctor', label: 'Médecins' },
    { id: 'admin', label: 'Administrateurs' },
    { id: 'receptionist', label: 'Réceptionnistes' }
  ]

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await api.get('/users')
        // On ne garde que le personnel (tout sauf patient)
        const staff = (response.data || []).filter(u => u.role !== 'patient')
        setUsersData(staff)
      } catch (error) {
        console.error("Erreur chargement utilisateurs", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (user.email || '').toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const roleLabels = {
    doctor: 'Médecin',
    admin: 'Administrateur',
    receptionist: 'Réceptionniste',
  }

  const roleIcons = {
    doctor: Stethoscope,
    admin: Shield,
    receptionist: UserCog,
  }

  const roleColors = {
    doctor: 'from-[#3BA7B8] to-[#58D6C3]',
    admin: 'from-[#0F4C5C] to-[#3BA7B8]',
    receptionist: 'from-[#F4B860] to-[#D96C6C]',
  }

  const statusConfig = {
    active: { label: 'Actif', variant: 'success' },
    away: { label: 'Absent', variant: 'warning' },
    inactive: { label: 'Inactif', variant: 'default' },
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Utilisateurs</h1>
              <p className="text-[#5E7480]">Gestion du personnel médical et administratif</p>
            </div>
            <Button onClick={() => navigate('/users/add')}>
              <Plus size={18} />
              Nouvel Utilisateur
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
                <UsersIcon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1D2D35]">{usersData.length}</p>
                <p className="text-sm text-[#5E7480]">Total</p>
              </div>
            </Card>
            {['doctor', 'admin', 'receptionist'].map((roleKey) => {
              const Icon = roleIcons[roleKey]
              const count = usersData.filter(u => u.role === roleKey).length
              return (
                <Card key={roleKey} className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', roleColors[roleKey])}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1D2D35]">{count}</p>
                    <p className="text-sm text-[#5E7480]">{roleLabels[roleKey]}s</p>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <SearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Rechercher un utilisateur..."
                className="w-80"
              />
              <div className="flex items-center gap-2 bg-[#F6FAFB] rounded-xl p-1">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      roleFilter === role.id
                        ? 'bg-white shadow-sm text-[#0F4C5C]'
                        : 'text-[#5E7480] hover:text-[#1D2D35]'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Users Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredUsers.map((user) => {
              const RoleIcon = roleIcons[user.role] || UsersIcon
              return (
                <Card 
                  key={user.id} 
                  hover 
                  className="cursor-pointer"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg',
                      roleColors[user.role] || 'from-[#5E7480] to-[#1D2D35]'
                    )}>
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-heading font-semibold text-[#1D2D35] truncate">{user.name}</h3>
                        <Badge variant={statusConfig[user.status]?.variant || 'default'}>
                          {statusConfig[user.status]?.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5E7480] mb-2">
                        <RoleIcon size={14} />
                      <span>{roleLabels[user.role]} {user.specialty ? `- ${user.specialty}` : ''}</span>
                      </div>
                      <p className="text-xs text-[#5E7480] truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#EAF1F4] flex items-center justify-between text-xs text-[#5E7480]">
                    <span>{user.centre_medical?.nom || user.etablissement || 'N/A'}</span>
                    {user.patientsCount !== null && (
                      <span>{user.patientsCount} patients</span>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
