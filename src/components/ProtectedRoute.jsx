import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth()

  // Attendre le chargement de l'auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-[#0F4C5C] border-t-[#58D6C3] rounded-full"></div>
        </div>
      </div>
    )
  }

  // Non authentifié → rediriger vers login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Authentifié mais rôle non autorisé → rediriger vers dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  // Autorisé → afficher le contenu
  return children
}
