import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restaurer la session au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
        setRole(parsedUser.role || null)
      } catch (error) {
        console.error('Erreur lors de la restauration de la session:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password })
      const { token: newToken, user: newUser } = response.data

      // Stocker le token et l'utilisateur
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      // Mettre à jour l'état
      setToken(newToken)
      setUser(newUser)
      setRole(newUser.role || null)

      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      }
    }
  }

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appel optionnel au backend pour invalider la session
      await api.post('/logout')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // Toujours nettoyer le localStorage et l'état
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      setRole(null)
    }
  }

  // Fonction pour vérifier si l'utilisateur a un rôle
  const hasRole = (roles) => {
    if (!role) return false
    if (Array.isArray(roles)) {
      return roles.includes(role)
    }
    return role === roles
  }

  // Fonction pour vérifier si authentifié
  const isAuthenticated = () => {
    return !!token && !!user
  }

  const value = {
    user,
    token,
    role,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider')
  }
  return context
}
