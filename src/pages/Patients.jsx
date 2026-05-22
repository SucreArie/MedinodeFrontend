import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Filter, Download, Users } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import SearchBar from '../components/SearchBar'
import PatientTable from '../components/PatientTable'
import Badge from '../components/Badge'
import { patients } from '../data/mockData'

export default function Patients() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(search.toLowerCase()) ||
                          patient.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: patients.length,
    stable: patients.filter(p => p.status === 'stable').length,
    critical: patients.filter(p => p.status === 'critical').length,
    monitoring: patients.filter(p => p.status === 'monitoring').length,
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Patients</h1>
              <p className="text-[#5E7480]">Gestion et suivi des patients</p>
            </div>
            <Button onClick={() => navigate('/patients/add')}>
              <Plus size={18} />
              Nouveau Patient
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
                <Users size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1D2D35]">{stats.total}</p>
                <p className="text-sm text-[#5E7480]">Total patients</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4FAF8F]/10 flex items-center justify-center">
                <span className="text-xl font-bold text-[#4FAF8F]">{stats.stable}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#1D2D35]">Stables</p>
                <p className="text-sm text-[#5E7480]">État stable</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D96C6C]/10 flex items-center justify-center">
                <span className="text-xl font-bold text-[#D96C6C]">{stats.critical}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#1D2D35]">Critiques</p>
                <p className="text-sm text-[#5E7480]">Attention requise</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 flex items-center justify-center">
                <span className="text-xl font-bold text-[#F4B860]">{stats.monitoring}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-[#1D2D35]">Surveillance</p>
                <p className="text-sm text-[#5E7480]">En observation</p>
              </div>
            </Card>
          </div>

          {/* Filters & Search */}
          <Card className="mb-6">
            <div className="flex items-center justify-between gap-4">
              <SearchBar 
                value={search}
                onChange={setSearch}
                placeholder="Rechercher un patient..."
                className="w-80"
              />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#F6FAFB] rounded-xl p-1">
                  {['all', 'stable', 'critical', 'monitoring'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === status
                          ? 'bg-white shadow-sm text-[#0F4C5C]'
                          : 'text-[#5E7480] hover:text-[#1D2D35]'
                      }`}
                    >
                      {status === 'all' && 'Tous'}
                      {status === 'stable' && 'Stables'}
                      {status === 'critical' && 'Critiques'}
                      {status === 'monitoring' && 'Surveillance'}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Filter size={16} />
                  Filtres
                </Button>
                <Button variant="outline" size="sm">
                  <Download size={16} />
                  Exporter
                </Button>
              </div>
            </div>
          </Card>

          {/* Patients Table */}
          <Card>
            <Card.Header>
              <Card.Title>Liste des patients</Card.Title>
              <Badge variant="default">{filteredPatients.length} patients</Badge>
            </Card.Header>
            <PatientTable 
              patients={filteredPatients}
              onRowClick={(patient) => navigate(`/patients/${patient.id}`)}
            />
          </Card>
        </main>
      </div>
    </div>
  )
}
