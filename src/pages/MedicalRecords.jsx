import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Download, FileText, Search } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import Badge from '../components/Badge'
import { medicalRecords } from '../data/mockData'
import { cn } from '../utils/helpers'

export default function MedicalRecords() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const types = ['all', 'Consultation', 'Analyse', 'Imagerie', 'ECG', 'Hospitalisation']

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          record.id.toLowerCase().includes(search.toLowerCase()) ||
                          record.diagnosis.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    return matchesSearch && matchesType
  })

  const statusConfig = {
    completed: { label: 'Terminé', variant: 'success' },
    pending: { label: 'En attente', variant: 'warning' },
    'in-review': { label: 'En révision', variant: 'default' },
    'in-progress': { label: 'En cours', variant: 'info' },
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Dossiers Médicaux</h1>
              <p className="text-[#5E7480]">Gestion des dossiers et documents médicaux</p>
            </div>
            <Button>
              <Plus size={18} />
              Nouveau Dossier
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Dossiers', value: medicalRecords.length, color: 'from-[#0F4C5C] to-[#3BA7B8]' },
              { label: 'Terminés', value: medicalRecords.filter(r => r.status === 'completed').length, color: 'from-[#4FAF8F] to-[#58D6C3]' },
              { label: 'En attente', value: medicalRecords.filter(r => r.status === 'pending').length, color: 'from-[#F4B860] to-[#D96C6C]' },
              { label: 'En cours', value: medicalRecords.filter(r => r.status === 'in-progress').length, color: 'from-[#3BA7B8] to-[#58D6C3]' },
            ].map((stat, i) => (
              <Card key={i} className="relative overflow-hidden">
                <div className={cn('absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-gradient-to-br', stat.color)} />
                <p className="text-2xl font-bold text-[#1D2D35]">{stat.value}</p>
                <p className="text-sm text-[#5E7480]">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <SearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Rechercher un dossier..."
                className="w-80"
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#F6FAFB] rounded-xl p-1">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        typeFilter === type
                          ? 'bg-white shadow-sm text-[#0F4C5C]'
                          : 'text-[#5E7480] hover:text-[#1D2D35]'
                      }`}
                    >
                      {type === 'all' ? 'Tous' : type}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                  Exporter
                </Button>
              </div>
            </div>
          </Card>

          {/* Records Grid */}
          <div className="grid grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <Card 
                key={record.id} 
                hover 
                className="cursor-pointer"
                onClick={() => navigate(`/records/${record.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center shrink-0">
                    <FileText size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-heading font-semibold text-[#1D2D35]">{record.type}</h3>
                      <Badge variant={statusConfig[record.status]?.variant || 'default'}>
                        {statusConfig[record.status]?.label || record.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#5E7480] mb-2 truncate">{record.diagnosis}</p>
                    <div className="flex items-center justify-between text-xs text-[#5E7480]">
                      <span>{record.patientName}</span>
                      <span>{record.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#5E7480] mt-1">
                      <span>{record.doctor}</span>
                      <span className="font-mono">{record.id}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
