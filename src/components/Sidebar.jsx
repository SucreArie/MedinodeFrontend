import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  RefreshCw,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Building2,
  Calendar,
  Activity,
  UserCog,
} from 'lucide-react'
import Logo from './Logo'
import { cn } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

// Définition des items accessibles par rôle
const navItemsByRole = {
  admin: [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', roles: ['admin'] },
    { name: 'Patients', icon: Users, path: '/patients', roles: ['admin'] },
    { name: 'Dossiers', icon: FileText, path: '/records', roles: ['admin'] },
    { name: 'Consultations', icon: Calendar, path: '/consultations', roles: ['admin'] },
    { name: 'Centres Médicaux', icon: Building2, path: '/centers', roles: ['admin'] },
    { name: 'Synchronisation', icon: RefreshCw, path: '/sync', roles: ['admin'] },
    { name: 'Utilisateurs', icon: UserCog, path: '/users', roles: ['admin'] },
    { name: 'Journal activité', icon: Activity, path: '/logs', roles: ['admin'] },
    { name: 'Sécurité', icon: Shield, path: '/security', roles: ['admin'] },
  ],
  doctor: [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', roles: ['doctor'] },
    { name: 'Patients', icon: Users, path: '/patients', roles: ['doctor'] },
    { name: 'Dossiers', icon: FileText, path: '/records', roles: ['doctor'] },
    { name: 'Consultations', icon: Calendar, path: '/consultations', roles: ['doctor'] },
  ],
  receptionist: [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', roles: ['receptionist'] },
    { name: 'Patients', icon: Users, path: '/patients', roles: ['receptionist'] },
  ],
  patient: [
    { name: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard', roles: ['patient'] },
    { name: 'Mes dossiers', icon: FileText, path: '/records', roles: ['patient'] },
  ],
}

export default function Sidebar() {
  const { role, user, logout } = useAuth()
  const navigate = useNavigate()

  // Récupérer les items accessibles pour ce rôle
  const accessibleItems = navItemsByRole[role] || []

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Initiales du nom d'utilisateur
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return 'U'
  }

  // Nom du rôle affiché en français
  const getRoleLabel = () => {
    const roles = {
      admin: 'Administrateur',
      doctor: 'Médecin',
      receptionist: 'Réceptionniste',
      patient: 'Patient',
    }
    return roles[role] || role
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-[#EAF1F4] flex flex-col z-40">
      {/* Logo */}
      <div className="p-5 border-b border-[#EAF1F4]">
        <Logo />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {accessibleItems.length > 0 && (
          <>
            <p className="px-3 py-2 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">
              Navigation
            </p>
            {accessibleItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-[#0F4C5C] to-[#3BA7B8] text-white shadow-soft'
                      : 'text-[#5E7480] hover:bg-[#EAF1F4] hover:text-[#0F4C5C]'
                  )
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </>
        )}

        {/* Paramètres - accessible à tous */}
        <p className="px-3 py-2 mt-4 text-xs font-semibold text-[#5E7480] uppercase tracking-wider">
          Préférences
        </p>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[#EAF1F4] text-[#0F4C5C]'
                : 'text-[#5E7480] hover:bg-[#EAF1F4] hover:text-[#0F4C5C]'
            )
          }
        >
          <Settings size={18} />
          Paramètres
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#EAF1F4] space-y-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#D96C6C] hover:bg-[#D96C6C]/10 w-full transition-all duration-200"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>

      {/* User Profile Mini */}
      <div className="p-4 border-t border-[#EAF1F4]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6FAFB]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center text-white font-semibold text-sm">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1D2D35] truncate">{user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-[#5E7480] truncate">{getRoleLabel()}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
