import { useState, useEffect } from 'react'
import { 
  Calendar, FileText, Pill, TestTube, ArrowLeft, 
  Clock, User, Building2, ChevronRight, Activity
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import api from '../services/api'
import Loader from '../components/Loader'
import { cn } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function PatientMedicalHistory() {
  const navigate = useNavigate()
  const { user } = useAuth() // Pour récupérer les infos du patient connecté

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    consultations: [],
    prescriptions: [],
    examens: [],
    dossiers: []
  })
  const [activeTab, setActiveTab] = useState('all')
  const [patientInfo, setPatientInfo] = useState(null)
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await api.get('/patient/medical-history')
        
        console.log("Données reçues :", res.data); // Debug temporaire

        setData({
          consultations: res.data.consultations || [],
          prescriptions: res.data.prescriptions || [],
          examens: res.data.examens || [],
          dossiers: res.data.dossiers || []
        })

        // === CORRECTION IMPORTANTE ===
        setPatientInfo(res.data.patient)

      } catch (err) {
        console.error("Erreur chargement historique", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const tabs = [
    { id: 'all', label: 'Tout', icon: Activity },
    { id: 'consultations', label: 'Consultations', icon: Calendar },
    { id: 'prescriptions', label: 'Ordonnances', icon: Pill },
    { id: 'examens', label: 'Examens', icon: TestTube },
  ]

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
            <div>
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">
                Mon Parcours de Soins
              </h1>
              <p className="text-[#5E7480]">
                Historique médical complet du patient
              </p>
            </div>
          </div>

          {/* Affichage du nom du patient */}
                    {/* Affichage du nom du patient */}
                    <Card className="mb-8">
            <div className="flex items-center gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-[#3BA7B8] flex items-center justify-center text-white text-3xl font-bold">
                {patientInfo?.firstName?.[0]}{patientInfo?.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1D2D35]">
                  {patientInfo?.fullName || `${patientInfo?.firstName || ''} ${patientInfo?.lastName || ''}`.trim() || 'Patient'}
                </h2>
                <p className="text-[#5E7480]">Patient • ID: {patientInfo?.id}</p>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white p-1 rounded-2xl border border-[#EAF1F4] w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-[#3BA7B8] text-white shadow-md" 
                    : "text-[#5E7480] hover:bg-[#F6FAFB]"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20"><Loader /></div>
          ) : (
            <div className="space-y-8">
              {/* Consultations */}
              {(activeTab === 'all' || activeTab === 'consultations') && (
                <section>
                  <h2 className="text-lg font-semibold text-[#1D2D35] mb-4 flex items-center gap-2">
                    <Calendar size={22} /> Consultations
                  </h2>
                  <div className="grid gap-4">
                    {data.consultations?.length > 0 ? data.consultations.map(c => (
                      <Card key={c.id} hover className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-xl text-[#1D2D35]">{c.motif}</p>
                            <p className="text-[#5E7480] mt-1">
                              Dr. {c.medecin?.name} • {c.centreMedical?.nom || c.centre_medical?.nom}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{c.date?.split(' ')[0]}</p>
                            <Badge variant="success" className="mt-1">Terminée</Badge>
                          </div>
                        </div>
                      </Card>
                    )) : (
                      <p className="text-[#5E7480] italic py-8 text-center">Aucune consultation enregistrée pour le moment.</p>
                    )}
                  </div>
                </section>
              )}

              {/* Prescriptions */}
              {(activeTab === 'all' || activeTab === 'prescriptions') && (
                <section>
                  <h2 className="text-lg font-semibold text-[#1D2D35] mb-4 flex items-center gap-2">
                    <Pill size={22} /> Ordonnances
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.prescriptions?.length > 0 ? data.prescriptions.map(p => (
                      <Card key={p.id} hover className="p-6">
                        <p className="font-bold text-[#1D2D35]">{p.medicament}</p>
                        <p className="text-sm text-[#5E7480] mt-1">{p.dosage} • {p.frequence} • {p.duree_jours} jours</p>
                        {p.observations && (
                          <p className="text-xs italic text-[#5E7480] mt-3">« {p.observations} »</p>
                        )}
                      </Card>
                    )) : (
                      <p className="text-[#5E7480] italic py-8 text-center col-span-2">Aucune ordonnance enregistrée.</p>
                    )}
                  </div>
                </section>
              )}

              {/* Examens */}
              {(activeTab === 'all' || activeTab === 'examens') && (
                <section>
                  <h2 className="text-lg font-semibold text-[#1D2D35] mb-4 flex items-center gap-2">
                    <TestTube size={22} /> Examens
                  </h2>
                  <div className="grid gap-4">
                    {data.examens?.length > 0 ? data.examens.map(e => (
                      <Card key={e.id} hover className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 flex items-center justify-center text-[#F4B860]">
                            <TestTube size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-[#1D2D35]">{e.type_examen}</p>
                            <p className="text-sm text-[#5E7480]">{e.laboratoire}</p>
                          </div>
                        </div>
                        <div>
                          {e.urgence && <Badge variant="danger">Urgent</Badge>}
                        </div>
                      </Card>
                    )) : (
                      <p className="text-[#5E7480] italic py-8 text-center">Aucun examen enregistré.</p>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}