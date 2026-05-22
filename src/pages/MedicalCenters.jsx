import { useState } from 'react'
import { Building2, Users, FileText, Server, Wifi, WifiOff, Settings, MapPin } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Badge from '../components/Badge'
import { medicalCenters } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function MedicalCenters() {
  const [search, setSearch] = useState('')

  const filteredCenters = medicalCenters.filter(center =>
    center.name.toLowerCase().includes(search.toLowerCase()) ||
    center.address.toLowerCase().includes(search.toLowerCase())
  )

  const statusConfig = {
    online: { label: 'En ligne', color: 'bg-[#4FAF8F]', textColor: 'text-[#4FAF8F]' },
    offline: { label: 'Hors ligne', color: 'bg-[#D96C6C]', textColor: 'text-[#D96C6C]' },
    maintenance: { label: 'Maintenance', color: 'bg-[#F4B860]', textColor: 'text-[#F4B860]' },
  }

  const syncConfig = {
    synced: { label: 'Synchronisé', variant: 'success' },
    syncing: { label: 'En cours', variant: 'info' },
    paused: { label: 'En pause', variant: 'warning' },
    error: { label: 'Erreur', variant: 'error' },
  }

  const totalStats = {
    centers: medicalCenters.length,
    online: medicalCenters.filter(c => c.status === 'online').length,
    totalRecords: medicalCenters.reduce((sum, c) => sum + c.totalRecords, 0),
    totalPatients: medicalCenters.reduce((sum, c) => sum + c.activePatients, 0),
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Centres Médicaux</h1>
              <p className="text-[#5E7480]">Gestion des établissements connectés au réseau</p>
            </div>
            <Button>
              <Building2 size={18} />
              Ajouter un centre
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8]" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
                  <Building2 size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1D2D35]">{totalStats.centers}</p>
                  <p className="text-sm text-[#5E7480]">Centres</p>
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-[#4FAF8F]" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#4FAF8F]/10 flex items-center justify-center">
                  <Wifi size={22} className="text-[#4FAF8F]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1D2D35]">{totalStats.online}</p>
                  <p className="text-sm text-[#5E7480]">En ligne</p>
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-[#3BA7B8]" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3BA7B8]/10 flex items-center justify-center">
                  <FileText size={22} className="text-[#3BA7B8]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1D2D35]">{(totalStats.totalRecords / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-[#5E7480]">Dossiers</p>
                </div>
              </div>
            </Card>
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-[#F4B860]" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 flex items-center justify-center">
                  <Users size={22} className="text-[#F4B860]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1D2D35]">{(totalStats.totalPatients / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-[#5E7480]">Patients</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <SearchBar 
              value={search}
              onChange={setSearch}
              placeholder="Rechercher un centre..."
              className="w-80"
            />
          </Card>

          {/* Centers Grid */}
          <div className="grid grid-cols-2 gap-6">
            {filteredCenters.map((center) => (
              <Card key={center.id} hover className="relative overflow-hidden">
                {/* Status Indicator */}
                <div className={cn(
                  'absolute top-4 right-4 w-3 h-3 rounded-full',
                  statusConfig[center.status]?.color,
                  center.status === 'online' && 'animate-pulse'
                )} />

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center shrink-0">
                    <Building2 size={26} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg text-[#1D2D35] mb-1">{center.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                      <MapPin size={14} />
                      {center.address}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#F6FAFB] text-center">
                    <p className="text-lg font-bold text-[#1D2D35]">{center.doctors}</p>
                    <p className="text-xs text-[#5E7480]">Médecins</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6FAFB] text-center">
                    <p className="text-lg font-bold text-[#1D2D35]">{center.activePatients}</p>
                    <p className="text-xs text-[#5E7480]">Patients</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6FAFB] text-center">
                    <p className="text-lg font-bold text-[#1D2D35]">{center.totalRecords}</p>
                    <p className="text-xs text-[#5E7480]">Dossiers</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F6FAFB] text-center">
                    <p className="text-lg font-bold text-[#1D2D35]">{center.uptime}</p>
                    <p className="text-xs text-[#5E7480]">Uptime</p>
                  </div>
                </div>

                {/* Server Status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F6FAFB]">
                  <div className="flex items-center gap-3">
                    <Server size={18} className="text-[#5E7480]" />
                    <div>
                      <p className="text-sm font-medium text-[#1D2D35]">Charge serveur</p>
                      <div className="w-32 h-2 bg-[#EAF1F4] rounded-full mt-1">
                        <div 
                          className={cn(
                            'h-full rounded-full transition-all',
                            center.serverLoad < 50 ? 'bg-[#4FAF8F]' : center.serverLoad < 80 ? 'bg-[#F4B860]' : 'bg-[#D96C6C]'
                          )}
                          style={{ width: `${center.serverLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#1D2D35]">{center.serverLoad}%</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EAF1F4]">
                  <div className="flex items-center gap-2">
                    <Badge variant={syncConfig[center.syncStatus]?.variant || 'default'}>
                      {syncConfig[center.syncStatus]?.label}
                    </Badge>
                    <span className="text-xs text-[#5E7480]">
                      {center.syncStatus === 'syncing' ? 'En cours...' : `Il y a ${center.lastSync}`}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
