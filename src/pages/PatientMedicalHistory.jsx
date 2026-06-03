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

export default function PatientMedicalHistory() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    consultations: [],
    prescriptions: [],
    examens: [],
    dossiers: []
  })
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const res = await api.get('/patient/medical-history')
        setData(res.data)
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
              <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Mon Parcours de Soins</h1>
              <p className="text-[#5E7480]">Historique complet de vos activités médicales</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-white p-1 rounded-2xl border border-[#EAF1F4] w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-[#3BA7B8] text-white shadow-md" 
                    : "text-[#5E7480] hover:bg-[#F6FAFB]"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20"><Loader /></div>
          ) : (
            <div className="space-y-6">
              {/* Section Consultations */}
              {(activeTab === 'all' || activeTab === 'consultations') && (
                <section>
                  <h2 className="text-sm font-bold text-[#5E7480] uppercase tracking-wider mb-3 px-2">Consultations Récentes</h2>
                  <div className="grid gap-3">
                    {data.consultations.length > 0 ? data.consultations.map(c => (
                      <Card key={c.id} hover className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#3BA7B8]/10 flex items-center justify-center text-[#3BA7B8]">
                            <Calendar size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-[#1D2D35]">{c.motif}</p>
                            <p className="text-xs text-[#5E7480]">Dr. {c.medecin?.name} • {c.centre_medical?.nom}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#1D2D35]">{c.date?.split(' ')[0]}</p>
                          <Badge variant="success">Terminé</Badge>
                        </div>
                      </Card>
                    )) : <p className="text-sm text-[#5E7480] italic px-2">Aucune consultation enregistrée.</p>}
                  </div>
                </section>
              )}

              {/* Section Ordonnances */}
              {(activeTab === 'all' || activeTab === 'prescriptions') && (
                <section>
                  <h2 className="text-sm font-bold text-[#5E7480] uppercase tracking-wider mb-3 px-2">Mes Prescriptions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {data.prescriptions.length > 0 ? data.prescriptions.map(p => (
                      <Card key={p.id} hover>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#4FAF8F]/10 flex items-center justify-center text-[#4FAF8F]">
                              <Pill size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-[#1D2D35]">{p.medicament}</p>
                              <p className="text-xs text-[#5E7480]">{p.dosage} • {p.frequence}</p>
                            </div>
                          </div>
                          <Badge variant="default">{p.duree_jours}j</Badge>
                        </div>
                        {p.observations && (
                          <div className="p-3 bg-[#F6FAFB] rounded-lg text-xs text-[#5E7480] italic">
                            &quot;{p.observations}&quot;
                          </div>
                        )}
                      </Card>
                    )) : <p className="text-sm text-[#5E7480] italic px-2">Aucune prescription en cours.</p>}
                  </div>
                </section>
              )}

              {/* Section Examens */}
              {(activeTab === 'all' || activeTab === 'examens') && (
                <section>
                  <h2 className="text-sm font-bold text-[#5E7480] uppercase tracking-wider mb-3 px-2">Résultats d&apos;Examens</h2>
                  <div className="grid gap-3">
                    {data.examens.length > 0 ? data.examens.map(e => (
                      <Card key={e.id} hover className="flex items-center justify-between border-l-4 border-[#F4B860]">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#F4B860]/10 flex items-center justify-center text-[#F4B860]">
                            <TestTube size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-[#1D2D35]">{e.type_examen}</p>
                            <p className="text-xs text-[#5E7480]">{e.laboratoire}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {e.urgence && <Badge variant="danger">Urgent</Badge>}
                          <button className="p-2 hover:bg-[#F6FAFB] rounded-lg text-[#3BA7B8]">
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      </Card>
                    )) : <p className="text-sm text-[#5E7480] italic px-2">Aucun examen enregistré.</p>}
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