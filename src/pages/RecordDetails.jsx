import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, FileText, Calendar, User, Building2, 
  Stethoscope, Pill, TestTube, Eye, Download, Share2, Edit
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { medicalRecords, patients } from '../data/mockData'

export default function RecordDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const record = medicalRecords.find(r => r.id === id)
  const patient = record ? patients.find(p => p.id === record.patientId) : null

  if (!record) {
    return (
      <div className="min-h-screen bg-[#F6FAFB] flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-heading font-semibold text-[#1D2D35] mb-2">Dossier non trouvé</h2>
          <p className="text-[#5E7480] mb-4">Ce dossier n&apos;existe pas dans la base de données.</p>
          <Button onClick={() => navigate('/records')}>Retour aux dossiers</Button>
        </Card>
      </div>
    )
  }

  const statusConfig = {
    completed: { label: 'Terminé', variant: 'success' },
    pending: { label: 'En attente', variant: 'warning' },
    'in-review': { label: 'En révision', variant: 'default' },
    'in-progress': { label: 'En cours', variant: 'info' },
  }

  // Mock detailed data
  const prescriptions = [
    { name: 'Amlodipine', dosage: '5mg', frequency: '1x/jour', duration: '3 mois' },
    { name: 'Aspirine', dosage: '100mg', frequency: '1x/jour', duration: '6 mois' },
  ]

  const examResults = [
    { name: 'Tension artérielle', value: '140/90 mmHg', status: 'warning' },
    { name: 'Fréquence cardiaque', value: '72 bpm', status: 'normal' },
    { name: 'Glycémie', value: '1.05 g/L', status: 'normal' },
    { name: 'Cholestérol total', value: '2.4 g/L', status: 'warning' },
  ]

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/records')}
              className="p-2 rounded-xl hover:bg-white text-[#5E7480] hover:text-[#1D2D35] transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">{record.type}</h1>
                <Badge variant={statusConfig[record.status]?.variant || 'default'}>
                  {statusConfig[record.status]?.label || record.status}
                </Badge>
              </div>
              <p className="text-[#5E7480]">Dossier {record.id}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Share2 size={18} />
                Partager
              </Button>
              <Button variant="outline">
                <Download size={18} />
                Télécharger
              </Button>
              <Button>
                <Edit size={18} />
                Modifier
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Diagnostic */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Diagnostic</Card.Title>
                  </div>
                </Card.Header>
                <div className="p-4 rounded-xl bg-[#F6FAFB]">
                  <p className="text-[#1D2D35]">{record.diagnosis}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-[#1D2D35] mb-2">Observations</h4>
                  <p className="text-sm text-[#5E7480]">
                    Patient présentant une hypertension artérielle modérée. Tension artérielle légèrement élevée 
                    lors de la consultation. Recommandation de maintenir le traitement actuel et de surveiller 
                    régulièrement la tension à domicile. Prochain contrôle dans 3 mois.
                  </p>
                </div>
              </Card>

              {/* Prescriptions */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Pill size={20} className="text-[#4FAF8F]" />
                    <Card.Title>Prescriptions</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-3">
                  {prescriptions.map((rx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F6FAFB]">
                      <div>
                        <p className="font-medium text-[#1D2D35]">{rx.name}</p>
                        <p className="text-sm text-[#5E7480]">{rx.dosage} - {rx.frequency}</p>
                      </div>
                      <Badge variant="default">{rx.duration}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Exam Results */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <TestTube size={20} className="text-[#F4B860]" />
                    <Card.Title>Résultats d&apos;examens</Card.Title>
                  </div>
                </Card.Header>
                <div className="grid grid-cols-2 gap-3">
                  {examResults.map((exam, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#F6FAFB]">
                      <p className="text-sm text-[#5E7480] mb-1">{exam.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#1D2D35]">{exam.value}</p>
                        <div className={`w-2 h-2 rounded-full ${
                          exam.status === 'normal' ? 'bg-[#4FAF8F]' : 'bg-[#F4B860]'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Record Info */}
              <Card>
                <Card.Header>
                  <Card.Title>Informations</Card.Title>
                </Card.Header>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F4] flex items-center justify-center">
                      <Calendar size={18} className="text-[#5E7480]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5E7480]">Date</p>
                      <p className="font-medium text-[#1D2D35]">{record.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F4] flex items-center justify-center">
                      <User size={18} className="text-[#5E7480]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5E7480]">Médecin</p>
                      <p className="font-medium text-[#1D2D35]">{record.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F4] flex items-center justify-center">
                      <Building2 size={18} className="text-[#5E7480]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5E7480]">Centre</p>
                      <p className="font-medium text-[#1D2D35]">{record.center}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Patient */}
              {patient && (
                <Card>
                  <Card.Header>
                    <Card.Title>Patient</Card.Title>
                  </Card.Header>
                  <div 
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F6FAFB] cursor-pointer hover:bg-[#EAF1F4] transition-colors"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                      patient.gender === 'F' 
                        ? 'bg-gradient-to-br from-[#D96C6C] to-[#F4B860]' 
                        : 'bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3]'
                    }`}>
                      {patient.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-[#1D2D35]">{patient.name}</p>
                      <p className="text-sm text-[#5E7480]">{patient.age} ans - {patient.condition}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <Card>
                <Card.Header>
                  <Card.Title>Actions</Card.Title>
                </Card.Header>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye size={18} />
                    Voir historique complet
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText size={18} />
                    Ajouter une note
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
