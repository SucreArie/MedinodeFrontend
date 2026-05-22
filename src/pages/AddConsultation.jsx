import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, User, FileText, Save } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { patients, users } from '../data/mockData'

export default function AddConsultation() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: '',
    duration: '30',
    notes: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/consultations')
  }

  const doctors = users.filter(u => u.role === 'Médecin')
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
                  <div className="grid grid-cols-2 gap-4">
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
                          <option key={d.id} value={d.id}>{d.name} - {d.specialty}</option>
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
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Type de consultation</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        {consultationTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
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
                        {formData.patientId ? patients.find(p => p.id === formData.patientId)?.name : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5E7480]">Médecin</span>
                      <span className="font-medium text-[#1D2D35]">
                        {formData.doctorId ? doctors.find(d => d.id === formData.doctorId)?.name : '-'}
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
