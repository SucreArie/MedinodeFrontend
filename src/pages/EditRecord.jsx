import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Save, User, Stethoscope, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import api from '../services/api'
import { useToast } from '../context/ToastContext'

export default function EditRecord() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [consultations, setConsultations] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [examens, setExamens] = useState([])
  const [patients, setPatients] = useState([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    consultation_id: '',
    patient_id: '',
    prescription_id: '',
    examen_id: '',
  })

  const loadOptions = async () => {
    try {
      setFetching(true)
      const [consRes, prescRes, examRes, patientsRes, recordRes] = await Promise.all([
        api.get('/consultations'),
        api.get('/prescriptions'),
        api.get('/examens'),
        api.get('/patients'),
        api.get(`/dossiers/${id}`)
      ])
      
      setConsultations(Array.isArray(consRes.data) ? consRes.data : (consRes.data?.data || []))
      setPrescriptions(Array.isArray(prescRes.data) ? prescRes.data : (prescRes.data?.data || []))
      setExamens(Array.isArray(examRes.data) ? examRes.data : (examRes.data?.data || []))
      setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : (patientsRes.data?.data || []))
      
      const record = recordRes?.data
      if (record) {
        setFormData({
          name: record.name || '',
          description: record.description || '',
          date: record.date ? record.date.split(' ')[0] : '',
          consultation_id: record.consultation_id || '',
          patient_id: record.patient_id || '',
          prescription_id: record.prescription_id || '',
          examen_id: record.examen_id || '',
        })
      }
    } catch (err) {
      console.error("Erreur chargement", err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    loadOptions()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const selectedCons = consultations.find(c => String(c.id) === String(formData.consultation_id))
    const payload = {
      ...formData,
      patient_id: formData.patient_id || selectedCons?.patient_id,
      medecin_id: selectedCons?.medecin_id,
      date: formData.date.includes(':') ? formData.date : `${formData.date} ${new Date().toLocaleTimeString('fr-FR')}`
    }

    try {
      await api.put(`/dossiers/${id}`, payload)
      showToast('Le dossier a été mis à jour.')
      navigate(`/records/${id}`)
    } catch (err) {
      showToast("Erreur lors de la modification du dossier", 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="flex items-center justify-center min-h-screen">Chargement du dossier...</div>

  const filteredConsultations = formData.patient_id 
    ? consultations.filter(c => String(c.patient_id) === String(formData.patient_id))
    : consultations;

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white text-[#5E7480]">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Modifier le Dossier</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Informations Générales</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-4">
                  <Input 
                    label="Titre du dossier" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <textarea 
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20"
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
              </Card>

              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Patient</Card.Title>
                  </div>
                </Card.Header>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white"
                  value={formData.patient_id}
                  onChange={e => {
                    if (e.target.value === 'new') navigate('/patients/add')
                    else setFormData({...formData, patient_id: e.target.value})
                  }}
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </Card>

              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Liaison de données</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Consultation de référence</label>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white"
                      value={formData.consultation_id}
                      onChange={e => setFormData({...formData, consultation_id: e.target.value})}
                      required
                    >
                      <option value="">Sélectionner la consultation</option>
                      {filteredConsultations.map(c => (
                        <option key={c.id} value={c.id}>#{c.id} - {c.date.split(' ')[0]} - {c.motif}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Prescription liée</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-sm"
                        value={formData.prescription_id}
                        onChange={e => setFormData({...formData, prescription_id: e.target.value})}
                      >
                        <option value="">Aucune</option>
                        {prescriptions.map(p => (
                          <option key={p.id} value={p.id}>{p.medicament}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Examen lié</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-sm"
                        value={formData.examen_id}
                        onChange={e => setFormData({...formData, examen_id: e.target.value})}
                      >
                        <option value="">Aucun</option>
                        {examens.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.type_examen}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <Input label="Date du dossier" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                <Button className="w-full mt-4" type="submit" loading={loading}>
                  <Save size={18} /> Enregistrer les modifications
                </Button>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}