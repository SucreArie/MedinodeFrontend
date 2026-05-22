import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Calendar, Clock, User, CheckCircle2, AlertCircle, PlayCircle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Badge from '../components/Badge'
import { consultations } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function Consultations() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const statusConfig = {
    scheduled: { label: 'Planifié', variant: 'default', icon: Clock, color: 'text-[#5E7480]' },
    'in-progress': { label: 'En cours', variant: 'info', icon: PlayCircle, color: 'text-[#3BA7B8]' },
    completed: { label: 'Terminé', variant: 'success', icon: CheckCircle2, color: 'text-[#4FAF8F]' },
    cancelled: { label: 'Annulé', variant: 'error', icon: AlertCircle, color: 'text-[#D96C6C]' },
  }

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = c.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          c.doctorName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Group by date
  const groupedByDate = filteredConsultations.reduce((acc, c) => {
    if (!acc[c.date]) acc[c.date] = []
    acc[c.date].push(c)
    return acc
  }, {})

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Consultations</h1>
              <p className="text-[#5E7480]">Gestion des rendez-vous et consultations</p>
            </div>
            <Button onClick={() => navigate('/consultations/add')}>
              <Plus size={18} />
              Nouvelle Consultation
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1D2D35]">{consultations.length}</p>
                <p className="text-sm text-[#5E7480]">Total</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#5E7480]/10 flex items-center justify-center">
                <Clock size={22} className="text-[#5E7480]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1D2D35]">{consultations.filter(c => c.status === 'scheduled').length}</p>
                <p className="text-sm text-[#5E7480]">Planifiées</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3BA7B8]/10 flex items-center justify-center">
                <PlayCircle size={22} className="text-[#3BA7B8]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1D2D35]">{consultations.filter(c => c.status === 'in-progress').length}</p>
                <p className="text-sm text-[#5E7480]">En cours</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4FAF8F]/10 flex items-center justify-center">
                <CheckCircle2 size={22} className="text-[#4FAF8F]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1D2D35]">{consultations.filter(c => c.status === 'completed').length}</p>
                <p className="text-sm text-[#5E7480]">Terminées</p>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <SearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Rechercher une consultation..."
                className="w-80"
              />
              <div className="flex items-center gap-2 bg-[#F6FAFB] rounded-xl p-1">
                {['all', 'scheduled', 'in-progress', 'completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === status
                        ? 'bg-white shadow-sm text-[#0F4C5C]'
                        : 'text-[#5E7480] hover:text-[#1D2D35]'
                    }`}
                  >
                    {status === 'all' ? 'Tous' : statusConfig[status]?.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Consultations by Date */}
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([date, dateConsultations]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-heading font-semibold text-[#1D2D35]">
                    {date === today ? 'Aujourd\'hui' : date}
                  </h2>
                  <Badge variant="default">{dateConsultations.length}</Badge>
                </div>
                <div className="grid gap-4">
                  {dateConsultations.map((consultation) => {
                    const StatusIcon = statusConfig[consultation.status]?.icon || Clock
                    return (
                      <Card key={consultation.id} hover className="cursor-pointer">
                        <div className="flex items-center gap-4">
                          {/* Time */}
                          <div className="w-20 text-center shrink-0">
                            <p className="text-xl font-bold text-[#0F4C5C]">{consultation.time}</p>
                            <p className="text-xs text-[#5E7480]">{consultation.duration} min</p>
                          </div>

                          <div className="w-px h-12 bg-[#EAF1F4]" />

                          {/* Patient */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center text-white font-semibold text-sm">
                              {consultation.patientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-[#1D2D35]">{consultation.patientName}</p>
                              <p className="text-sm text-[#5E7480]">{consultation.type}</p>
                            </div>
                          </div>

                          {/* Doctor */}
                          <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                            <User size={16} />
                            {consultation.doctorName}
                          </div>

                          {/* Status */}
                          <div className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-xl',
                            consultation.status === 'in-progress' && 'bg-[#3BA7B8]/10',
                            consultation.status === 'completed' && 'bg-[#4FAF8F]/10',
                            consultation.status === 'scheduled' && 'bg-[#EAF1F4]',
                          )}>
                            <StatusIcon size={16} className={statusConfig[consultation.status]?.color} />
                            <span className={cn('text-sm font-medium', statusConfig[consultation.status]?.color)}>
                              {statusConfig[consultation.status]?.label}
                            </span>
                          </div>
                        </div>
                        {consultation.notes && (
                          <div className="mt-3 pt-3 border-t border-[#EAF1F4]">
                            <p className="text-sm text-[#5E7480]">{consultation.notes}</p>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
