import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Phone, Mail, MapPin, Heart, Droplets, AlertTriangle,
  FileText, Calendar, Clock, Edit, Trash2, User
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import { cn, getStatusColor } from '../utils/helpers'
import api from '../services/api'
import Loader from '../components/Loader'
import { useToast } from '../context/ToastContext'

export default function PatientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [patient, setPatient] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  // Fonction pour calculer l'âge à partir d'une date de naissance (YYYY-MM-DD)
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A'
    const birth = new Date(birthDate)
    if (isNaN(birth.getTime())) return 'N/A'
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true)
      try {
        const patientRes = await api.get(`/patients/${id}`)
        const fetchedPatient = patientRes.data

        // Vérification défensive: S'assurer que l'ID du patient récupéré correspond à l'ID demandé
        // Ajout d'une vérification pour s'assurer que l'objet retourné est bien un patient (ex: présence de firstName)
        // Note: On accepte firstName, first_name ou name pour être flexible
        const hasName = fetchedPatient.firstName || fetchedPatient.first_name || fetchedPatient.name;
        if (!fetchedPatient || String(fetchedPatient.id) !== String(id) || !hasName) {
          console.error(
            "Erreur: L'ID du patient récupéré ne correspond pas à l'ID demandé ou les données ne sont pas celles d'un patient.",
            { requestedId: id, fetchedPatientId: fetchedPatient?.id, fetchedPatient }
          );
          showToast("Les données du patient ne correspondent pas à l'ID demandé ou sont invalides.", "error");
          setPatient(null); // Empêche l'affichage de données incorrectes
          setLoading(false);
          return; // Arrête l'exécution de la fonction
        }

        // Normalisation pour gérer les différences entre camelCase et snake_case
        const fName = fetchedPatient.firstName || fetchedPatient.first_name || '';
        const lName = fetchedPatient.lastName || fetchedPatient.last_name || '';
        const bDate = fetchedPatient.birthDate || fetchedPatient.birth_date || '';
        const bType = fetchedPatient.bloodType || fetchedPatient.blood_type || 'N/A';
        const insId = fetchedPatient.insuranceId || fetchedPatient.insurance_id || 'N/A';
        const eName = fetchedPatient.emergencyName || fetchedPatient.emergency_name || '';
        const ePhone = fetchedPatient.emergencyPhone || fetchedPatient.emergency_phone || '';

        setPatient({
          ...fetchedPatient,
          name: fName && lName ? `${fName} ${lName}` : (fetchedPatient.name || 'Inconnu'),
          age: calculateAge(bDate),
          avatar: (fName || fetchedPatient.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??',
          // Assurez-vous que les allergies sont un tableau
          allergies: typeof fetchedPatient.allergies === 'string' && fetchedPatient.allergies ? fetchedPatient.allergies.split(',').map(a => a.trim()) : fetchedPatient.allergies || [],
          emergencyContact: `${eName} ${ePhone}`.trim() || 'Non renseigné',
          bloodType: bType,
          insuranceId: insId
        })

        // Récupérer les dossiers médicaux du patient
        const recordsRes = await api.get(`/dossiers?patient_id=${id}`)
        setRecords(recordsRes.data || [])

        // Récupérer les consultations du patient pour la timeline
        const consultationsRes = await api.get(`/consultations?patient_id=${id}`)
        setTimeline(consultationsRes.data.map(c => ({
          date: c.date ? c.date.split(' ')[0] : 'N/A', // Assurez-vous que c.date est une chaîne valide
          type: 'consultation', // Type par défaut, à adapter si d'autres types existent
          title: c.motif || 'Consultation',
          doctor: c.medecin?.name || 'N/A',
          description: c.notes || 'Aucune note',
        })))
      } catch (error) {
        console.error("Erreur lors du chargement des détails du patient", error)
        showToast("Impossible de charger les détails du patient", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchPatientDetails()
  }, [id, showToast])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FAFB] flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!patient && !loading) {
    return (
      <div className="min-h-screen bg-[#F6FAFB] flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-xl font-heading font-semibold text-[#1D2D35] mb-2">Patient non trouvé</h2>
          <p className="text-[#5E7480] mb-4">Ce patient n&apos;existe pas dans la base de données.</p>
          <Button onClick={() => navigate('/patients')}>Retour aux patients</Button>
        </Card>
      </div>
    )
  }

  const timelineIcons = {
    consultation: Calendar,
    analysis: FileText,
    prescription: FileText,
    alert: AlertTriangle,
  }

  const timelineColors = {
    consultation: 'bg-[#3BA7B8]',
    analysis: 'bg-[#4FAF8F]',
    prescription: 'bg-[#F4B860]',
    alert: 'bg-[#D96C6C]',
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">{patient.name}</h1>
              <p className="text-[#5E7480]">Dossier patient {patient.id}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Edit size={18} />
                Modifier
              </Button>
              <Button variant="ghost" className="text-[#D96C6C] hover:bg-[#D96C6C]/10">
                <Trash2 size={18} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="col-span-2 space-y-6">
              {/* Profile Card */}
              <Card>
                <div className="flex items-start gap-6">
                  <div className={cn(
                    'w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl',
                    patient.gender === 'F' 
                      ? 'bg-gradient-to-br from-[#D96C6C] to-[#F4B860]' 
                      : 'bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3]'
                  )}>
                    {patient.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-heading font-semibold text-[#1D2D35]">{patient.name}</h2>
                      <Badge variant={getStatusColor(patient.status)}>
                        {patient.status === 'stable' && 'Stable'}
                        {patient.status === 'critical' && 'Critique'}
                        {patient.status === 'monitoring' && 'Surveillance'}
                      </Badge>
                    </div>
                    <p className="text-[#5E7480] mb-4">{patient.condition}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                        <Phone size={16} />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5E7480]">
                        <Mail size={16} />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#5E7480] col-span-2">
                        <MapPin size={16} />
                        {patient.address}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Medical Info */}
              <Card>
                <Card.Header>
                  <Card.Title>Informations Médicales</Card.Title>
                </Card.Header>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#F6FAFB]">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={18} className="text-[#3BA7B8]" />
                      <span className="text-sm text-[#5E7480]">Âge</span>
                    </div>
                    <p className="text-lg font-semibold text-[#1D2D35]">{patient.age} ans</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F6FAFB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets size={18} className="text-[#D96C6C]" />
                      <span className="text-sm text-[#5E7480]">Groupe sanguin</span>
                    </div>
                    <p className="text-lg font-semibold text-[#1D2D35]">{patient.bloodType}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F6FAFB]">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={18} className="text-[#4FAF8F]" />
                      <span className="text-sm text-[#5E7480]">Assurance</span>
                    </div>
                    <p className="text-lg font-semibold text-[#1D2D35]">{patient.insuranceId}</p>
                  </div>
                </div>
                
                {patient.allergies.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-[#D96C6C]/10 border border-[#D96C6C]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={18} className="text-[#D96C6C]" />
                      <span className="text-sm font-medium text-[#D96C6C]">Allergies</span>
                    </div>
                    <div className="flex gap-2">
                      {patient.allergies?.map((allergy, i) => (
                        <Badge key={i} variant="error">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Recent Records */}
              <Card>
                <Card.Header>
                  <Card.Title>Dossiers Récents</Card.Title>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/records')}>
                    Voir tout
                  </Button>
                </Card.Header>
                <div className="space-y-3">
                  {records.length > 0 ? records.map((record) => (
                    <div 
                      key={record.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#F6FAFB] hover:bg-[#EAF1F4] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
                          <FileText size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1D2D35]">{record.type}</p>
                          <p className="text-sm text-[#5E7480]">{record.diagnosis}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#5E7480]">{record.date}</p>
                        <p className="text-xs text-[#5E7480]">{record.doctor}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-[#5E7480] py-4">Aucun dossier récent</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <Card.Header>
                  <Card.Title>Actions Rapides</Card.Title>
                </Card.Header>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar size={18} />
                    Planifier RDV
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText size={18} />
                    Nouveau dossier
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone size={18} />
                    Appeler
                  </Button>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <Card.Header>
                  <Card.Title>Contact d&apos;urgence</Card.Title>
                </Card.Header>
                <p className="text-sm text-[#5E7480]">{patient.emergencyContact}</p>
              </Card>

              {/* Timeline */}
              <Card>
                <Card.Header>
                  <Card.Title>Historique</Card.Title>
                </Card.Header>
                <div className="space-y-4">
                  {timeline.length > 0 ? timeline.map((event, index) => {
                    const Icon = timelineIcons[event.type] || FileText
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            timelineColors[event.type] || 'bg-[#5E7480]'
                          )}>
                            <Icon size={14} className="text-white" />
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="w-0.5 flex-1 bg-[#EAF1F4] my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#1D2D35] text-sm">{event.title}</p>
                          </div>
                          <p className="text-xs text-[#5E7480] mb-1">{event.date} - {event.doctor}</p>
                          <p className="text-xs text-[#5E7480]">{event.description}</p>
                        </div>
                      </div>
                    )
                  }) : (
                    <p className="text-center text-[#5E7480] py-4 text-sm">Aucun historique</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
