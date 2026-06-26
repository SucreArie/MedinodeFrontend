import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, User, FileText, Save } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { patients as mockPatients, users as mockUsers } from '../data/mockData'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { useNotifications } from '../context/NotificationContext'

export default function AddConsultation() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { addNotification } = useNotifications()
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    centreId: '',
    date: '',
    time: '',
    type: '',
    duration: '30',
    notes: '',
    symptomes: '',
    diagnostic: '',
    traitement: '',
  })
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [centres, setCentres] = useState([])
  const [loading, setLoading] = useState(true)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      patient_id: formData.patientId,
      medecin_id: formData.doctorId,
      centre_medical_id: formData.centreId,
      date: formData.date && formData.time ? `${formData.date} ${formData.time}:00` : formData.date,
      motif: formData.type,
      symptomes: formData.symptomes,
      diagnostic: formData.diagnostic,
      traitement: formData.traitement,
      notes: formData.notes,
    }

    api.post('/consultations', payload)
      .then(() => {
        showToast('Consultation planifiée avec succès !')
        const patientName = patients.find(p => String(p.id) === String(formData.patientId))?.name || 'Inconnu'
        addNotification({
          type: 'info',
          message: `Nouvelle consultation planifiée pour ${patientName} le ${formData.date}.`,
        })
        navigate('/consultations')
      })
      .catch((err) => {
        console.error('Erreur création consultation', err)
        showToast(err.response?.data?.message || 'Erreur lors de la création', 'error')
      })
  }

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      setLoading(true)
      try {
        // Charger patients, médecins et centres
        const [patientsRes, doctorsRes, centresRes] = await Promise.all([
          api.get('/patients').catch(() => ({ data: [] })), // Supprimer le filtre par rôle
          api.get('/doctors').catch(() => ({ data: [] })),
          api.get('/centres-medicaux').catch(() => ({ data: [] }))
        ])
        
        // Mapper les patients pour construire le nom complet
        const mappedPatients = (patientsRes.data || []).map(p => ({
          ...p,
          name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        }));

        if (mounted) {
          setPatients(mappedPatients);
          setDoctors(Array.isArray(doctorsRes.data) ? doctorsRes.data : (doctorsRes.data?.data || []))
          setCentres(Array.isArray(centresRes.data) ? centresRes.data : (centresRes.data?.data || []))
        }
      } catch (err) {
        console.error('Erreur chargement données', err)
        if (mounted) {
          alert("Erreur lors de la récupération des données de la base")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    loadData()
    return () => { mounted = false }
  }, [])

  const consultationTypes = ['Première consultation', 'Suivi', 'Urgence', 'Résultats', 'Contrôle']

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate('/consultations')}
              className="p-2 rounded-xl hover:bg-white text-[#5E7480] hover:text-[#1D2D35] transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Nouvelle Consultation</h1>
              <p className="text-[#5E7480]">Planifier un nouveau rendez-vous</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                {/* Patient & Doctor */}
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <User size={20} className="text-[#3BA7B8]" />
                      <Card.Title>Patient et Médecin</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Patient</label>
                      <select
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                        required
                      >
                        <option value="">Sélectionner un patient</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Médecin</label>
                      <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                        required
                      >
                        <option value="">Sélectionner un médecin</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>{d.name} - {d.specialite || d.specialty}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Centre Médical</label>
                      <select
                        name="centreId"
                        value={formData.centreId}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                        required
                      >
                        <option value="">Sélectionner un centre</option>
                        {centres.map(c => (
                          <option key={c.id} value={c.id}>{c.nom || c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Date & Time */}
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-[#3BA7B8]" />
                      <Card.Title>Date et Heure</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="Date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Heure"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Durée (min)</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 heure</option>
                        <option value="90">1h30</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Type & Notes */}
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-[#3BA7B8]" />
                      <Card.Title>Détails</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Motif de consultation</label>
                      <textarea
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Motif de la consultation..."
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Symptômes</label>
                        <textarea
                          name="symptomes"
                          value={formData.symptomes}
                          onChange={handleChange}
                          placeholder="Symptômes observés..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Diagnostic</label>
                        <textarea
                          name="diagnostic"
                          value={formData.diagnostic}
                          onChange={handleChange}
                          placeholder="Diagnostic médical..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all resize-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Traitement</label>
                      <input
                        name="traitement"
                        value={formData.traitement}
                        onChange={handleChange}
                        placeholder="Prescription et traitement..."
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Notes pour la consultation..."
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all resize-none"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Résumé</Card.Title>
                  </Card.Header>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#5E7480]">Patient</span>
                      <span className="font-medium text-[#1D2D35]">
                        {formData.patientId ? patients.find(p => String(p.id) === String(formData.patientId))?.name : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E7480]">Médecin</span>
                      <span className="font-medium text-[#1D2D35]">
                        {formData.doctorId ? doctors.find(d => String(d.id) === String(formData.doctorId))?.name : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E7480]">Date</span>
                      <span className="font-medium text-[#1D2D35]">{formData.date || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E7480]">Heure</span>
                      <span className="font-medium text-[#1D2D35]">{formData.time || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E7480]">Durée</span>
                      <span className="font-medium text-[#1D2D35]">{formData.duration} min</span>
                    </div>
                  </div>
                </Card>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    <Save size={18} />
                    Créer la consultation
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/consultations')}>
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
