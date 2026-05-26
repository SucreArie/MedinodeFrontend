import { useState, useEffect } from 'react'
import { 
  Settings as SettingsIcon, User, Bell, Shield, Database,
  Moon, Sun, Globe, Save, Upload
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/helpers'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    center: '',
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    alerts: true,
    sync: true,
    reports: false,
  })
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('fr')

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'system', label: 'Système', icon: Database },
  ]

  const { user, fetchProfile, updateUser } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingProfile(true)
      // Try to fetch from backend first
      const res = await fetchProfile()
      if (res.success && mounted) {
        setProfile((p) => ({ ...p, ...res.data }))
      } else if (user && mounted) {
        // fallback to context user
        setProfile((p) => ({ ...p, name: user.name || '', email: user.email || '', phone: user.phone || '', specialty: user.specialty || '', center: user.center || '' }))
      }
      setLoadingProfile(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Paramètres</h1>
              <p className="text-[#5E7480]">Gérez vos préférences et configurations</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Sidebar Tabs */}
            <Card className="h-fit">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#0F4C5C] to-[#3BA7B8] text-white'
                        : 'text-[#5E7480] hover:bg-[#F6FAFB] hover:text-[#1D2D35]'
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>

            {/* Content */}
            <div className="col-span-3 space-y-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <Card>
                    <Card.Header>
                      <Card.Title>Informations du profil</Card.Title>
                    </Card.Header>
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center text-white font-bold text-2xl">
                          TL
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-[#5E7480] hover:text-[#1D2D35] transition-colors">
                          <Upload size={14} />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1D2D35]">Photo de profil</p>
                        <p className="text-sm text-[#5E7480] mb-3">JPG, PNG ou GIF. Max 2MB.</p>
                        <Button variant="outline" size="sm">
                          <Upload size={14} />
                          Changer la photo
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Nom complet"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                      <Input
                        label="Téléphone"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                      <Input
                        label="Spécialité"
                        value={profile.specialty}
                        onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                      />
                      <Input
                        label="Centre médical"
                        value={profile.center}
                        onChange={(e) => setProfile({...profile, center: e.target.value})}
                        className="col-span-2"
                      />
                    </div>
                    <div className="mt-6 pt-6 border-t border-[#EAF1F4] flex justify-end">
                      <Button
                        onClick={async () => {
                          // Use updateUser from context to persist and update global state
                          const payload = {
                            name: profile.name,
                            email: profile.email,
                            phone: profile.phone,
                            specialty: profile.specialty,
                            center: profile.center,
                          }
                          const res = await updateUser(payload)
                          if (!res.success) {
                            alert(res.message || 'Erreur lors de la sauvegarde')
                          }
                        }}
                      >
                        <Save size={18} />
                        Enregistrer
                      </Button>
                    </div>
                  </Card>
                </>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <Card>
                  <Card.Header>
                    <Card.Title>Préférences de notification</Card.Title>
                  </Card.Header>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Notifications par email', desc: 'Recevoir les alertes par email' },
                      { key: 'push', label: 'Notifications push', desc: 'Notifications dans le navigateur' },
                      { key: 'sms', label: 'Notifications SMS', desc: 'Alertes critiques par SMS' },
                      { key: 'alerts', label: 'Alertes patients', desc: 'Notifications pour les patients critiques' },
                      { key: 'sync', label: 'Synchronisation', desc: 'Alertes de synchronisation système' },
                      { key: 'reports', label: 'Rapports hebdomadaires', desc: 'Résumé d\'activité par email' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-[#F6FAFB]">
                        <div>
                          <p className="font-medium text-[#1D2D35]">{item.label}</p>
                          <p className="text-sm text-[#5E7480]">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
                          className={cn(
                            'w-12 h-6 rounded-full transition-colors relative',
                            notifications[item.key] ? 'bg-[#4FAF8F]' : 'bg-[#EAF1F4]'
                          )}
                        >
                          <div className={cn(
                            'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                            notifications[item.key] ? 'left-7' : 'left-1'
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <>
                  <Card>
                    <Card.Header>
                      <Card.Title>Changer le mot de passe</Card.Title>
                    </Card.Header>
                    <div className="space-y-4 max-w-md">
                      <Input
                        label="Mot de passe actuel"
                        type="password"
                        placeholder="********"
                      />
                      <Input
                        label="Nouveau mot de passe"
                        type="password"
                        placeholder="********"
                      />
                      <Input
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="********"
                      />
                      <Button>
                        <Shield size={18} />
                        Mettre à jour
                      </Button>
                    </div>
                  </Card>

                  <Card>
                    <Card.Header>
                      <Card.Title>Authentification à deux facteurs</Card.Title>
                    </Card.Header>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#4FAF8F]/10">
                      <div>
                        <p className="font-medium text-[#1D2D35]">2FA activée</p>
                        <p className="text-sm text-[#5E7480]">Votre compte est protégé par l&apos;authentification à deux facteurs</p>
                      </div>
                      <Button variant="outline" size="sm">Gérer</Button>
                    </div>
                  </Card>
                </>
              )}

              {/* System Tab */}
              {activeTab === 'system' && (
                <>
                  <Card>
                    <Card.Header>
                      <Card.Title>Apparence</Card.Title>
                    </Card.Header>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#F6FAFB]">
                      <div className="flex items-center gap-3">
                        {darkMode ? <Moon size={20} className="text-[#5E7480]" /> : <Sun size={20} className="text-[#F4B860]" />}
                        <div>
                          <p className="font-medium text-[#1D2D35]">Mode sombre</p>
                          <p className="text-sm text-[#5E7480]">Basculer entre le thème clair et sombre</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          darkMode ? 'bg-[#0F4C5C]' : 'bg-[#EAF1F4]'
                        )}
                      >
                        <div className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all',
                          darkMode ? 'left-7' : 'left-1'
                        )} />
                      </button>
                    </div>
                  </Card>

                  <Card>
                    <Card.Header>
                      <Card.Title>Langue</Card.Title>
                    </Card.Header>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F6FAFB]">
                      <Globe size={20} className="text-[#5E7480]" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="flex-1 bg-transparent text-[#1D2D35] focus:outline-none"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </Card>

                  <Card>
                    <Card.Header>
                      <Card.Title>Données et stockage</Card.Title>
                    </Card.Header>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#F6FAFB]">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[#5E7480]">Espace utilisé</span>
                          <span className="text-sm font-medium text-[#1D2D35]">2.4 GB / 10 GB</span>
                        </div>
                        <div className="h-2 bg-[#EAF1F4] rounded-full">
                          <div className="h-full w-1/4 bg-gradient-to-r from-[#0F4C5C] to-[#3BA7B8] rounded-full" />
                        </div>
                      </div>
                      <Button variant="outline" className="text-[#D96C6C] hover:bg-[#D96C6C]/10">
                        Vider le cache
                      </Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
