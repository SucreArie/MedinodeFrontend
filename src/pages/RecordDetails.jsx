import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  ArrowLeft, FileText, Calendar, User, Building2, 
  Stethoscope, Pill, TestTube, Eye, Download, Share2, Edit, Plus
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import Input from '../components/Input'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function RecordDetails() {
  const { role } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [record, setRecord] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [examResults, setExamResults] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [isPrescModalOpen, setIsPrescModalOpen] = useState(false)
  const [isExamenModalOpen, setIsExamenModalOpen] = useState(false)
  const [prescForm, setPrescForm] = useState({ medicament: '', dosage: '', frequence: '', duree_jours: '', observations: '' })
  const [examenForm, setExamenForm] = useState({ type_examen: '', laboratoire: '', urgence: false })

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/dossiers/${id}`)
      const data = res.data

      if (data) {
        setRecord({
          ...data,
          patientName: data.patient?.name,
          doctorName: data.medecin?.name,
          centreName: data.consultation?.centre_medical?.nom || 'Centre Principal'
        })
        setPrescriptions(data.prescription ? [data.prescription] : [])
        setExamResults(data.examen ? [data.examen] : [])
      }
    } catch (err) {
      console.error("Erreur détails dossier", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleAddPrescription = async () => {
    try {
      await api.post('/prescriptions', { ...prescForm, consultation_id: id })
      setIsPrescModalOpen(false)
      fetchData()
    } catch (err) { alert("Erreur lors de l'ajout") }
  }

  const handleAddExamen = async () => {
    try {
      await api.post('/examens', { ...examenForm, consultation_id: id })
      setIsExamenModalOpen(false)
      fetchData()
    } catch (err) { alert("Erreur lors de l'ajout") }
  }

  if (loading) return <div className="p-20 text-center">Chargement du dossier...</div>

  if (!record && !loading) {
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
                <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">{record.name}</h1>
                <Badge variant="success">
                  Terminé
                </Badge>
              </div>
              <p className="text-[#5E7480]">Dossier #{record.id} - Réf. Consultation #{record.consultation_id}</p>
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
              {role !== 'patient' && (
                <Button onClick={() => navigate(`/records/edit/${id}`)}>
                  <Edit size={18} />
                  Modifier
                </Button>
              )}
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
                  <p className="text-[#1D2D35] font-medium">{record.consultation?.diagnostic || 'Aucun diagnostic saisi'}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-[#1D2D35] mb-2">Symptômes et Notes</h4>
                  <p className="text-sm text-[#5E7480]">
                    {record.consultation?.symptomes} <br/> {record.consultation?.notes}
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
                  <Button variant="ghost" size="small" onClick={() => setIsPrescModalOpen(true)}>
                    <Plus size={16} />
                  </Button>
                </Card.Header>
                <div className="space-y-3">
                  {prescriptions.length > 0 ? prescriptions.map((rx, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[#F6FAFB]">
                      <div>
                        <p className="font-medium text-[#1D2D35]">{rx.medicament}</p>
                        <p className="text-sm text-[#5E7480]">{rx.dosage} - {rx.frequence}</p>
                        {rx.observations && <p className="text-xs text-[#5E7480] mt-1 italic">{rx.observations}</p>}
                      </div>
                      <Badge variant="default">{rx.duree_jours} jours</Badge>
                    </div>
                  )) : (
                    <p className="text-sm text-[#5E7480] italic p-4 text-center">Aucune prescription</p>
                  )}
                </div>
              </Card>

              {/* Exam Results */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <TestTube size={20} className="text-[#F4B860]" />
                    <Card.Title>Résultats d&apos;examens</Card.Title>
                  </div>
                  <Button variant="ghost" size="small" onClick={() => setIsExamenModalOpen(true)}>
                    <Plus size={16} />
                  </Button>
                </Card.Header>
                <div className="grid grid-cols-2 gap-3">
                  {examResults.length > 0 ? examResults.map((exam, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#F6FAFB]">
                      <p className="text-sm text-[#5E7480] mb-1">{exam.type_examen}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#1D2D35]">{exam.laboratoire}</p>
                        <div className={`w-2 h-2 rounded-full ${
                          exam.urgence ? 'bg-[#D96C6C]' : 'bg-[#4FAF8F]'
                        }`} />
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-[#5E7480] italic p-4 text-center col-span-2">Aucun examen</p>
                  )}
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
                      <p className="font-medium text-[#1D2D35]">{record.date ? record.date.split(' ')[0] : '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F4] flex items-center justify-center">
                      <User size={18} className="text-[#5E7480]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5E7480]">Médecin</p>
                      <p className="font-medium text-[#1D2D35]">{record.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF1F4] flex items-center justify-center">
                      <Building2 size={18} className="text-[#5E7480]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5E7480]">Centre</p>
                      <p className="font-medium text-[#1D2D35]">{record.centreName}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Patient */}
              <Card>
                <Card.Header>
                  <Card.Title>Patient</Card.Title>
                </Card.Header>
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#F6FAFB] cursor-pointer hover:bg-[#EAF1F4] transition-colors"
                  onClick={() => navigate(`/patients/${record.patient_id}`)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3]`}>
                    {record.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-[#1D2D35]">{record.patientName}</p>
                    <p className="text-sm text-[#5E7480]">ID: {record.patient_id}</p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <Card>
                <Card.Header>
                  <Card.Title>Actions</Card.Title>
                </Card.Header>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/patient/history')}>
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

      {/* Modal Prescription */}
      <Modal isOpen={isPrescModalOpen} onClose={() => setIsPrescModalOpen(false)} title="Ajouter une prescription">
        <div className="space-y-4">
          <Input label="Médicament" placeholder="ex: Paracétamol" value={prescForm.medicament} onChange={e => setPrescForm({...prescForm, medicament: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosage" placeholder="ex: 500 mg" value={prescForm.dosage} onChange={e => setPrescForm({...prescForm, dosage: e.target.value})} />
            <Input label="Durée (jours)" type="number" value={prescForm.duree_jours} onChange={e => setPrescForm({...prescForm, duree_jours: e.target.value})} />
          </div>
          <Input label="Fréquence" placeholder="ex: 3 fois par jour" value={prescForm.frequence} onChange={e => setPrescForm({...prescForm, frequence: e.target.value})} />
          <div>
            <label className="block text-sm font-medium mb-1">Observations</label>
            <textarea className="w-full p-3 rounded-xl border border-[#EAF1F4]" rows={3} value={prescForm.observations} onChange={e => setPrescForm({...prescForm, observations: e.target.value})} />
          </div>
          <Button className="w-full" onClick={handleAddPrescription}>Enregistrer la prescription</Button>
        </div>
      </Modal>

      {/* Modal Examen */}
      <Modal isOpen={isExamenModalOpen} onClose={() => setIsExamenModalOpen(false)} title="Prescrire un examen">
        <div className="space-y-4">
          <Input label="Type d'examen" placeholder="ex: NFS, Radio..." value={examenForm.type_examen} onChange={e => setExamenForm({...examenForm, type_examen: e.target.value})} />
          <Input label="Laboratoire" placeholder="Nom du labo" value={examenForm.laboratoire} onChange={e => setExamenForm({...examenForm, laboratoire: e.target.value})} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={examenForm.urgence} onChange={e => setExamenForm({...examenForm, urgence: e.target.checked})} />
            <span className="text-sm">Examen urgent</span>
          </label>
          <Button className="w-full" onClick={handleAddExamen}>Demander l'examen</Button>
        </div>
      </Modal>
    </div>
  )
}
