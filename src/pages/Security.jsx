import { 
  Shield, AlertTriangle, Lock, Key, Eye, Users,
  CheckCircle2, XCircle, Clock, Activity, Globe
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { securityAlerts, securityStats, accessPermissions } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function Security() {
  const threatColors = {
    low: { bg: 'bg-[#4FAF8F]', text: 'text-[#4FAF8F]', label: 'Faible' },
    medium: { bg: 'bg-[#F4B860]', text: 'text-[#F4B860]', label: 'Moyen' },
    high: { bg: 'bg-[#D96C6C]', text: 'text-[#D96C6C]', label: 'Élevé' },
  }

  const alertSeverity = {
    high: { variant: 'error', color: 'text-[#D96C6C]', bg: 'bg-[#D96C6C]/10' },
    medium: { variant: 'warning', color: 'text-[#F4B860]', bg: 'bg-[#F4B860]/10' },
    low: { variant: 'default', color: 'text-[#5E7480]', bg: 'bg-[#5E7480]/10' },
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Sécurité</h1>
              <p className="text-[#5E7480]">Surveillance et protection du système</p>
            </div>
            <Button>
              <Activity size={18} />
              Lancer un scan
            </Button>
          </div>

          {/* Threat Level Hero */}
          <Card className="mb-6 relative overflow-hidden">
            <div className={cn(
              'absolute inset-0 opacity-10',
              threatColors[securityStats.threatLevel]?.bg || 'bg-[#4FAF8F]'
            )} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center',
                  threatColors[securityStats.threatLevel]?.bg || 'bg-[#4FAF8F]'
                )}>
                  <Shield size={40} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#5E7480] mb-1">Niveau de menace actuel</p>
                  <p className={cn(
                    'text-3xl font-bold',
                    threatColors[securityStats.threatLevel]?.text
                  )}>
                    {threatColors[securityStats.threatLevel]?.label || 'Inconnu'}
                  </p>
                  <p className="text-sm text-[#5E7480]">Dernier scan: {securityStats.lastScan}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#1D2D35]">{securityStats.blockedAttempts}</p>
                  <p className="text-xs text-[#5E7480]">Tentatives bloquées</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#D96C6C]">{securityStats.activeAlerts}</p>
                  <p className="text-xs text-[#5E7480]">Alertes actives</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#3BA7B8]">{securityStats.vpnConnections}</p>
                  <p className="text-xs text-[#5E7480]">Connexions VPN</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#4FAF8F]">{securityStats.twoFactorEnabled}</p>
                  <p className="text-xs text-[#5E7480]">2FA activé</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Status Cards */}
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4FAF8F]/10 flex items-center justify-center">
                  <Lock size={22} className="text-[#4FAF8F]" />
                </div>
                <div>
                  <p className="text-sm text-[#5E7480]">Chiffrement</p>
                  <p className="text-lg font-bold text-[#1D2D35]">{securityStats.encryptionStatus}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3BA7B8]/10 flex items-center justify-center">
                  <Globe size={22} className="text-[#3BA7B8]" />
                </div>
                <div>
                  <p className="text-sm text-[#5E7480]">Pare-feu</p>
                  <p className="text-lg font-bold text-[#4FAF8F] capitalize">{securityStats.firewallStatus}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 flex items-center justify-center">
                  <Key size={22} className="text-[#F4B860]" />
                </div>
                <div>
                  <p className="text-sm text-[#5E7480]">Authentification 2FA</p>
                  <p className="text-lg font-bold text-[#1D2D35]">{securityStats.twoFactorEnabled}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Active Alerts */}
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} className="text-[#D96C6C]" />
                  <Card.Title>Alertes de Sécurité</Card.Title>
                </div>
                <Badge variant="error">{securityAlerts.length} actives</Badge>
              </Card.Header>

              <div className="space-y-3">
                {securityAlerts.map((alert) => {
                  const sevConfig = alertSeverity[alert.severity] || alertSeverity.low
                  return (
                    <div key={alert.id} className={cn('p-4 rounded-xl', sevConfig.bg)}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className={sevConfig.color} />
                          <span className="font-medium text-[#1D2D35]">{alert.title}</span>
                        </div>
                        <Badge variant={sevConfig.variant}>{alert.severity}</Badge>
                      </div>
                      <p className="text-sm text-[#5E7480] mb-2">{alert.description}</p>
                      <div className="flex items-center justify-between text-xs text-[#5E7480]">
                        <span>{alert.date} à {alert.time}</span>
                        <span className="font-mono">{alert.ip}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Access Permissions */}
            <Card>
              <Card.Header>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-[#3BA7B8]" />
                  <Card.Title>Permissions d&apos;accès</Card.Title>
                </div>
              </Card.Header>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EAF1F4]">
                      <th className="text-left py-3 text-xs font-semibold text-[#5E7480] uppercase">Rôle</th>
                      <th className="text-center py-3 text-xs font-semibold text-[#5E7480] uppercase">Lecture</th>
                      <th className="text-center py-3 text-xs font-semibold text-[#5E7480] uppercase">Écriture</th>
                      <th className="text-center py-3 text-xs font-semibold text-[#5E7480] uppercase">Suppression</th>
                      <th className="text-center py-3 text-xs font-semibold text-[#5E7480] uppercase">Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessPermissions.map((perm, i) => (
                      <tr key={i} className="border-b border-[#EAF1F4] last:border-0">
                        <td className="py-3">
                          <span className="font-medium text-[#1D2D35]">{perm.role}</span>
                        </td>
                        <td className="py-3 text-center">
                          {perm.read ? (
                            <CheckCircle2 size={18} className="text-[#4FAF8F] mx-auto" />
                          ) : (
                            <XCircle size={18} className="text-[#D96C6C] mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {perm.write ? (
                            <CheckCircle2 size={18} className="text-[#4FAF8F] mx-auto" />
                          ) : (
                            <XCircle size={18} className="text-[#D96C6C] mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {perm.delete ? (
                            <CheckCircle2 size={18} className="text-[#4FAF8F] mx-auto" />
                          ) : (
                            <XCircle size={18} className="text-[#D96C6C] mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {perm.admin ? (
                            <CheckCircle2 size={18} className="text-[#4FAF8F] mx-auto" />
                          ) : (
                            <XCircle size={18} className="text-[#D96C6C] mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
