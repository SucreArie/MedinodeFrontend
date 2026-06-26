import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, User, Phone, Mail, MapPin, Heart, AlertTriangle, Save, Activity } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import api from '../services/api'
import { useToast } from '../context/ToastContext'
import { useNotifications } from '../context/NotificationContext'

export default function AddPatient() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    city: '',
    postalCode: '',
    bloodType: '',
    allergies: '',
    emergencyName: '',
    emergencyPhone: '',
    insuranceId: '',
    condition: '',
    notes: '',
    status: 'stable',
    centre_medical_id: '',
  })
  const [centres, setCentres] = useState([])

  // Charger les données si nous sommes en mode modification
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await api.get('/centres-medicaux')
        setCentres(Array.isArray(res.data) ? res.data : (res.data?.data || []))
      } catch (err) {
        console.error("Erreur centres", err)
      }
    }
    fetchCentres()

    if (id) {
      const fetchPatient = async () => {
        try {
          const response = await api.get(`/patients/${id}`)
          const patient = response.data
          setFormData({
            ...formData,
            firstName: patient.firstName || '', // Utiliser directement firstName
            lastName: patient.lastName || '',   // Utiliser directement lastName
            email: patient.email || '',
            phone: patient.phone || '', 
            birthDate: patient.birthDate || '',
            gender: patient.gender || '',
            address: patient.address || '',
            city: patient.city || '',
            postalCode: patient.postalCode || '',
            bloodType: patient.bloodType || '',
            allergies: patient.allergies || '',
            emergencyName: patient.emergencyName || '',
            emergencyPhone: patient.emergencyPhone || '',
            insuranceId: patient.insuranceId || '',
            condition: patient.condition || '',
            notes: patient.notes || '',
            status: patient.status || 'stable',
            centre_medical_id: patient.centre_medical_id || '',
          })
        } catch (error) {
          showToast("Erreur lors du chargement des données", "error")
        }
      }
      fetchPatient()
    }
  }, [id, showToast])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: 'password123', // Mot de passe par défaut pour les patients créés par le personnel
      role: 'patient',
      phone: formData.phone,
      birthDate: formData.birthDate,
      gender: formData.gender,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode, // Correction : correspond à la validation Laravel
      bloodType: formData.bloodType,   // Correction : correspond à la validation Laravel
      allergies: formData.allergies,
      emergencyName: formData.emergencyName,   // Correction : correspond à la validation Laravel
      emergencyPhone: formData.emergencyPhone, // Correction : correspond à la validation Laravel
      insuranceId: formData.insuranceId,       // Correction : correspond à la validation Laravel
      condition: formData.condition,
      notes: formData.notes,
      status: formData.status,
      centre_medical_id: formData.centre_medical_id || null,
    }
    
    try {
      if (id) {
        await api.put(`/patients/${id}`, payload)
        showToast('Patient mis à jour avec succès')
      } else {
        await api.post('/patients', payload)
        showToast('Patient créé avec succès')
        addNotification({
          type: 'success', // Correction: Utiliser firstName et lastName pour la notification
          message: `Nouveau patient ${payload.firstName} ${payload.lastName} ajouté au système.`,
        })
      }
      navigate('/patients')
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'enregistrement", "error")
    } finally {
      setLoading(false)
    }
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
              onClick={() => navigate('/patients')}
              className="p-2 rounded-xl hover:bg-white text-[#5E7480] hover:text-[#1D2D35] transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">{id ? 'Modifier Patient' : 'Nouveau Patient'}</h1>
              <p className="text-[#5E7480]">{id ? 'Mettre à jour les informations du patient' : 'Ajouter un nouveau patient au système'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-6">
              {/* Personal Info */}
              <div className="col-span-2 space-y-6">
                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <User size={20} className="text-[#3BA7B8]" />
                      <Card.Title>Informations Personnelles</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Prénom du patient"
                      required
                    />
                    <Input
                      label="Nom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Nom du patient"
                      required
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemple.fr"
                      icon={Mail}
                    />
                    <Input
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+229 01 XX XX XX XX"
                      icon={Phone}
                      required
                    />
                    <Input
                      label="Date de naissance"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Genre</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                        required
                      >
                        <option value="">Sélectionner</option>
                        <option value="M">Homme</option>
                        <option value="F">Femme</option>
                        <option value="O">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Centre Médical</label>
                      <select
                        name="centre_medical_id"
                        value={formData.centre_medical_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      >
                        <option value="">Sélectionner un centre</option>
                        {centres.map(c => (
                          <option key={c.id} value={c.id}>{c.nom || c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>

                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-[#3BA7B8]" />
                      <Card.Title>Adresse</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="space-y-4">
                    <Input
                      label="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleChange} // Bind to formData.address
                      placeholder="Numéro et nom de rue"
                      required // Address should be required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Ville"
                        name="city"
                        value={formData.city}
                        onChange={handleChange} // Bind to formData.city
                        placeholder="Ville"
                        required // City should be required
                      />
                      <Input
                        label="Code postal"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="75001"
                      />
                    </div>
                  </div>
                </Card>

                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <Heart size={20} className="text-[#D96C6C]" />
                      <Card.Title>Informations Médicales</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Groupe sanguin</label>
                      <select
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      // Removed 'required' as it was causing issues if not selected initially
                      >
                        <option value="">Sélectionner</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <Input
                      label="N° Assurance"
                      name="insuranceId"
                      value={formData.insuranceId}
                      onChange={handleChange}
                      placeholder="INS-2024-XXX"
                    />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">
                        <span className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-[#F4B860]" />
                          Allergies (séparées par des virgules)
                        </span>
                      </label>
                      <input
                        name="allergies"
                        value={formData.allergies} // Bind to formData.allergies
                        onChange={handleChange}
                        placeholder="Pénicilline, Latex, ..."
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">Condition médicale principale</label>
                      <input
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        placeholder="Ex: Hypertension, Diabète..."
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      />
                    </div>
                  </div>
                </Card>

                <Card>
                  <Card.Header>
                    <div className="flex items-center gap-2">
                      <Activity size={20} className="text-[#3BA7B8]" />
                      <Card.Title>Statut Actuel</Card.Title>
                    </div>
                  </Card.Header>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1D2D35] mb-1.5">État de santé</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all"
                      >
                        <option value="stable">Stable</option>
                        <option value="monitoring">Surveillance</option>
                        <option value="critical">Critique</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <Card.Header>
                    <Card.Title>Contact d&apos;urgence</Card.Title>
                  </Card.Header>
                  <div className="space-y-4">
                    <Input
                      label="Nom complet"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange} // Bind to formData.emergencyName
                      placeholder="Nom du contact"
                    />
                    <Input
                      label="Téléphone"
                      name="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone} // Bind to formData.emergencyPhone
                      onChange={handleChange}
                      placeholder="+229 01 XX XX XX XX"
                      icon={Phone}
                    />
                  </div>
                </Card>

                <Card>
                  <Card.Header>
                    <Card.Title>Notes</Card.Title>
                  </Card.Header>
                  <textarea
                    name="notes"
                    value={formData.notes} // Bind to formData.notes
                    onChange={handleChange}
                    placeholder="Notes additionnelles..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAF1F4] bg-white text-[#1D2D35] placeholder:text-[#5E7480] focus:outline-none focus:ring-2 focus:ring-[#3BA7B8]/20 focus:border-[#3BA7B8] transition-all resize-none"
                  />
                </Card>

                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" loading={loading}>
                    <Save size={18} />
                    Enregistrer le patient
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/patients')}>
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
