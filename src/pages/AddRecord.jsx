import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Save, Calendar, User, Stethoscope, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Input from '../components/Input'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { useNotifications } from '../context/NotificationContext'

export default function AddRecord() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [consultations, setConsultations] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [examens, setExamens] = useState([])
  const [patients, setPatients] = useState([])
  const [centres, setCentres] = useState([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    consultation_id: '',
    patient_id: '',
    prescription_id: '',
    examen_id: '',
    centre_medical_id: '',
  })

  // Modal states
  const [isPrescModalOpen, setIsPrescModalOpen] = useState(false)
  const [isExamenModalOpen, setIsExamenModalOpen] = useState(false)
  const [prescForm, setPrescForm] = useState({ medicament: '', dosage: '', frequence: '', duree_jours: '', observations: '' })
  const [examenForm, setExamenForm] = useState({ type_examen: '', laboratoire: '', urgence: false })

  const loadData = async () => {
    try {
      const [consRes, prescRes, examRes, patientsRes, centresRes] = await Promise.all([
        api.get('/consultations'),
        api.get('/prescriptions'),
        api.get('/examens'),
        api.get('/patients'), // Supprimer le filtre par rôle
        api.get('/centres-medicaux')
      ])
      setConsultations(Array.isArray(consRes.data) ? consRes.data : (consRes.data?.data || []))
      
      // Mapper les patients pour construire le nom complet
      const mappedPatients = (patientsRes.data || []).map(p => ({
        ...p,
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
      }));
      setPrescriptions(Array.isArray(prescRes.data) ? prescRes.data : (prescRes.data?.data || []))
      setExamens(Array.isArray(examRes.data) ? examRes.data : (examRes.data?.data || []))
      setPatients(mappedPatients);
      setCentres(Array.isArray(centresRes.data) ? centresRes.data : (centresRes.data?.data || []))
    } catch (err) {
      console.error("Erreur chargement options", err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Trouver la consultation pour extraire patient et médecin
    const selectedCons = consultations.find(c => String(c.id) === String(formData.consultation_id))
    
    const payload = {
      ...formData,
      patient_id: formData.patient_id || selectedCons?.patient_id,
      medecin_id: selectedCons?.medecin_id,
      // Laravel attend une date avec heure pour le type dateTime
      date: `${formData.date} ${new Date().toLocaleTimeString('fr-FR')}`
    }

    try {
      await api.post('/dossiers', payload)
      showToast('Le dossier médical a été créé avec succès.')
      addNotification({
        type: 'success',
        message: `Nouveau dossier médical créé : "${formData.name}".`,
      })
      navigate('/records')
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la création du dossier", 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPrescription = async () => {
    if (!formData.consultation_id) return alert("Veuillez d'abord sélectionner une consultation")
    try {
      const res = await api.post('/prescriptions', { ...prescForm, consultation_id: formData.consultation_id })
      const newPresc = res.data.data || res.data
      setIsPrescModalOpen(false)
      await loadData()
      setFormData(prev => ({ ...prev, prescription_id: newPresc.id }))
      setPrescForm({ medicament: '', dosage: '', frequence: '', duree_jours: '', observations: '' })
      showToast('Prescription ajoutée')
    } catch (err) { 
      showToast("Erreur lors de l'ajout de la prescription", 'error')
    }
  }

  const handleAddExamen = async () => {
    if (!formData.consultation_id) return alert("Veuillez d'abord sélectionner une consultation")
    try {
      const res = await api.post('/examens', { ...examenForm, consultation_id: formData.consultation_id })
      const newExam = res.data.data || res.data
      setIsExamenModalOpen(false)
      await loadData()
      setFormData(prev => ({ ...prev, examen_id: newExam.id }))
      setExamenForm({ type_examen: '', laboratoire: '', urgence: false })
      showToast('Examen ajouté au dossier')
    } catch (err) { 
      showToast("Erreur lors de l'ajout de l'examen", 'error')
    }
  }

  // Filtrer les consultations si un patient est sélectionné
  const filteredConsultations = formData.patient_id && formData.patient_id !== 'new'
    ? consultations.filter(c => String(c.patient_id) === String(formData.patient_id))
    : consultations;

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/records')} className="p-2 rounded-xl hover:bg-white text-[#5E7480]">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Nouveau Dossier Médical</h1>
              <p className="text-[#5E7480]">Lier une consultation à un dossier patient</p>
            </div>
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
                    placeholder="ex: Suivi Cardiologie - Janvier 2024" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Description / Résumé</label>
                    <textarea 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20"
                      rows={4}
                      placeholder="Résumé global du cas..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </Card>

              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <User size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Patient</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Sélectionner un patient</label>
                        <select 
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20"
                          value={formData.patient_id}
                          onChange={e => {
                            if (e.target.value === 'new') navigate('/patients/add')
                            else setFormData({...formData, patient_id: e.target.value})
                          }}
                        >
                          <option value="">Choisir dans la liste</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                          <option value="new" className="text-[#3BA7B8] font-medium">+ Créer un nouveau patient</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Liaison de données</Card.Title>
                  </div>
                </Card.Header>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-[#1D2D35]">Consultation de référence</label>
                      <button 
                        type="button" 
                        onClick={() => navigate('/consultations/add')}
                        className="text-xs text-[#3BA7B8] hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> Créer une consultation
                      </button>
                    </div>
                    <select 
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white"
                      value={formData.consultation_id}
                      onChange={e => setFormData({...formData, consultation_id: e.target.value})}
                      required
                    >
                      <option value="">{formData.patient_id && formData.patient_id !== 'new' ? 'Choisir une consultation du patient' : 'Sélectionner une consultation'}</option>
                      {filteredConsultations.map(c => (
                        <option key={c.id} value={c.id}>
                          #{c.id} - {c.date.split(' ')[0]} - {c.motif}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Centre Médical</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20"
                        value={formData.centre_medical_id}
                        onChange={e => setFormData({...formData, centre_medical_id: e.target.value})}
                        required
                      >
                        <option value="">Sélectionner le centre</option>
                        {centres.map(c => (
                          <option key={c.id} value={c.id}>{c.nom || c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-[#1D2D35]">Prescription liée</label>
                        <button 
                          type="button" 
                          onClick={() => setIsPrescModalOpen(true)}
                          className="text-xs text-[#3BA7B8] hover:underline flex items-center gap-1"
                        >
                          <Plus size={12} /> Nouveau
                        </button>
                      </div>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-sm"
                        value={formData.prescription_id}
                        onChange={e => setFormData({...formData, prescription_id: e.target.value})}
                      >
                        <option value="">Aucune</option>
                        {prescriptions.map(p => (
                          <option key={p.id} value={p.id}>{p.medicament} - {p.dosage}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-[#1D2D35]">Examen lié</label>
                        <button 
                          type="button" 
                          onClick={() => setIsExamenModalOpen(true)}
                          className="text-xs text-[#3BA7B8] hover:underline flex items-center gap-1"
                        >
                          <Plus size={12} /> Nouveau
                        </button>
                      </div>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-sm"
                        value={formData.examen_id}
                        onChange={e => setFormData({...formData, examen_id: e.target.value})}
                      >
                        <option value="">Aucun</option>
                        {examens.map(ex => (
                          <option key={ex.id} value={ex.id}>{ex.type_examen} - {ex.laboratoire}</option>
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
                  <Save size={18} /> Créer le dossier
                </Button>
              </Card>
            </div>
          </form>
        </main>
      </div>

      {/* Modal Prescription */}
      <Modal isOpen={isPrescModalOpen} onClose={() => setIsPrescModalOpen(false)} title="Ajouter une prescription">
        <div className="space-y-4">
          {!formData.consultation_id && <p className="text-sm text-[#D96C6C]">Veuillez d'abord sélectionner une consultation.</p>}
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
          <Button 
            className="w-full" 
            onClick={handleAddPrescription}
            disabled={!formData.consultation_id}
          >
            Enregistrer la prescription
          </Button>
        </div>
      </Modal>

      {/* Modal Examen */}
      <Modal isOpen={isExamenModalOpen} onClose={() => setIsExamenModalOpen(false)} title="Prescrire un examen">
        <div className="space-y-4">
          {!formData.consultation_id && <p className="text-sm text-[#D96C6C]">Veuillez d'abord sélectionner une consultation.</p>}
          <Input label="Type d'examen" placeholder="ex: NFS, Radio..." value={examenForm.type_examen} onChange={e => setExamenForm({...examenForm, type_examen: e.target.value})} />
          <Input label="Laboratoire" placeholder="Nom du labo" value={examenForm.laboratoire} onChange={e => setExamenForm({...examenForm, laboratoire: e.target.value})} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={examenForm.urgence} onChange={e => setExamenForm({...examenForm, urgence: e.target.checked})} />
            <span className="text-sm">Examen urgent</span>
          </label>
          <Button 
            className="w-full" 
            onClick={handleAddExamen}
            disabled={!formData.consultation_id}
          >
            Demander l'examen
          </Button>
        </div>
      </Modal>
    </div>
  )
}