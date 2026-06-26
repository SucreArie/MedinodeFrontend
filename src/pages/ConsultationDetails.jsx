import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Calendar, Clock, User, FileText, Plus,
  Stethoscope, Pill, TestTube, Printer, Activity, Eye,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Card from '../components/Card'
import Button from '../components/Button'
import Badge from '../components/Badge'
import api from '../services/api'
import Modal from '../components/Modal'
import Input from '../components/Input'
import { useToast } from '../context/ToastContext'
import Loader from '../components/Loader'

export default function ConsultationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [consultation, setConsultation] = useState(null)

  const [isPrescModalOpen, setIsPrescModalOpen] = useState(false)
  const [isExamenModalOpen, setIsExamenModalOpen] = useState(false)
  const [prescForm, setPrescForm] = useState({ medicament: '', dosage: '', frequence: '', duree_jours: '', observations: '' })
  const [examenForm, setExamenForm] = useState({ type_examen: '', laboratoire: '', urgence: false, fichier_joint: null })
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedResultFile, setSelectedResultFile] = useState(null);
  const [selectedResultName, setSelectedResultName] = useState('');

  const fetchDetails = useCallback(async () => {
    try {
      console.log("Tentative de récupération de la consultation ID:", id);
      setLoading(true)
      // Note: Assurez-vous que le backend retourne les relations prescriptions et examens
      const res = await api.get(`/consultations/${id}`)
      setConsultation(res.data)
    } catch (err) {
      console.error("Erreur chargement détails consultation", err)
      // Debug log spécifique
      if (err.response?.data?.debug) {
          console.error("DEBUG SERVEUR:", err.response.data.debug)
      }
      showToast("Impossible de charger les détails de la consultation", "error")
    } finally {
      setLoading(false)
    }
  }, [id, showToast])

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  const handleAddPrescription = async () => {
    try {
      await api.post('/prescriptions', { ...prescForm, consultation_id: consultation.id })
      showToast('Prescription ajoutée avec succès !')
      setIsPrescModalOpen(false)
      setPrescForm({ medicament: '', dosage: '', frequence: '', duree_jours: '', observations: '' })
      // Re-fetch consultation details to update the lists
      await fetchDetails()
    } catch (err) {
      console.error("Erreur lors de l'ajout de la prescription", err)
      showToast("Erreur lors de l'ajout de la prescription", 'error')
    }
  }
const handleAddExamen = async () => {
  try {
    const formData = new FormData();
    formData.append('consultation_id', consultation.id);
    formData.append('type_examen', examenForm.type_examen);
    formData.append('laboratoire', examenForm.laboratoire || '');
    formData.append('urgence', examenForm.urgence ? 1 : 0);
    
    if (examenForm.fichier_joint) {
      formData.append('fichier_joint', examenForm.fichier_joint);
    }

    await api.post('/examens', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    showToast('Examen ajouté avec succès !');
    setIsExamenModalOpen(false);
    setExamenForm({ type_examen: '', laboratoire: '', urgence: false, fichier_joint: null });
    await fetchDetails();
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'examen", err);
    showToast("Erreur lors de l'ajout de l'examen", 'error');
  }
};
const handleGeneratePrescription = () => {
  showToast("Préparation de l'ordonnance pour impression...");

  // Masquer temporairement les éléments non désirés
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      #printable-ordonnance, #printable-ordonnance * { visibility: visible; }
      #printable-ordonnance { position: absolute; left: 0; top: 0; width: 100%; }
      .no-print { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  window.print();

  // Nettoyage après impression
  setTimeout(() => {
    document.head.removeChild(style);
  }, 1000);
};

  if (loading) return <div className="min-h-screen bg-[#F6FAFB] flex items-center justify-center"><Loader /></div>

  if (!consultation) return (
    <div className="min-h-screen bg-[#F6FAFB] flex items-center justify-center">
      <Card className="text-center p-8">
        <h2 className="text-xl font-bold text-[#1D2D35] mb-2">Consultation non trouvée</h2>
        <Button onClick={() => navigate('/consultations')}>Retour à la liste</Button>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      <Sidebar />
      <div className="ml-64">
        <Topbar />
        <main className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white text-[#5E7480]">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-heading font-bold text-[#1D2D35]">Consultation Médicale</h1>
                <p className="text-[#5E7480]">ID: #{consultation.id} • {consultation.date?.split(' ')[0]}</p>
              </div>
            </div>
            <Button variant="accent" icon={Printer} onClick={handleGeneratePrescription}>
              Imprimer l'ordonnance
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Clinical Section */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-[#3BA7B8]" />
                    <Card.Title>Examen Clinique</Card.Title>
                  </div>
                </Card.Header>
                <div className="space-y-6">
                  <div className="bg-[#F6FAFB] p-4 rounded-xl border border-[#EAF1F4]">
                    <h4 className="text-[10px] font-bold text-[#5E7480] uppercase mb-2">Motif</h4>
                    <p className="text-[#1D2D35] font-medium">{consultation.motif}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#5E7480] uppercase mb-2">Symptômes</h4>
                      <p className="text-sm text-[#1D2D35] whitespace-pre-wrap">{consultation.symptomes || 'Aucun symptôme noté'}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-[#5E7480] uppercase mb-2">Diagnostic</h4>
                      <p className="text-sm text-[#1D2D35] font-bold whitespace-pre-wrap">{consultation.diagnostic || 'En attente de conclusion'}</p>
                    </div>
                  </div>
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
                  {consultation.prescriptions?.length > 0 ? consultation.prescriptions.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-[#F6FAFB] rounded-xl border border-[#EAF1F4]">
                      <div>
                        <p className="font-bold text-[#1D2D35]">{p.medicament}</p>
                        <p className="text-xs text-[#5E7480]">{p.dosage} • {p.frequence} ({p.duree_jours} jours)</p>
                      </div>
                      <Badge variant="primary">Actif</Badge>
                    </div>
                  )) : (
                    <p className="text-sm text-[#5E7480] italic text-center py-4">Aucune prescription associée.</p>
                  )}
                </div>
              </Card>

              {/* Examens */}
              <Card>
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <TestTube size={20} className="text-[#F4B860]" />
                    <Card.Title>Examens Demandés</Card.Title>
                  </div>
                  <Button variant="ghost" size="small" onClick={() => setIsExamenModalOpen(true)}>
                    <Plus size={16} />
                   </Button>
                </Card.Header>
                <div className="grid grid-cols-2 gap-4">
                {consultation.examens?.length > 0 ? consultation.examens.map(e => (
  <div key={e.id} className="p-4 bg-[#F6FAFB] rounded-xl border border-[#EAF1F4] flex items-center justify-between">
    <div>
      <p className="font-bold text-[#1D2D35]">{e.type_examen}</p>
      <p className="text-xs text-[#5E7480]">{e.laboratoire}</p>
      {e.date_resultat && (
        <p className="text-xs text-[#4FAF8F]">Résultat du {e.date_resultat}</p>
      )}
    </div>
    
    <div className="flex items-center gap-2">
      {e.urgence && <Badge variant="danger">Urgent</Badge>}
      
      {/* Icône pour ouvrir le fichier joint */}
      {e.fichier_joint && (
  <Button 
    variant="ghost" 
    size="small"
    onClick={() => {
      let fileUrl = e.fichier_joint;
      
      // Correction robuste de l'URL
      if (fileUrl && !fileUrl.startsWith('http')) {
        fileUrl = fileUrl.startsWith('/') 
          ? `http://127.0.0.1:8000${fileUrl}` 
          : `http://127.0.0.1:8000/${fileUrl}`;
      }

      console.log("URL finale utilisée :", fileUrl);

      setSelectedResultFile(fileUrl);
      setSelectedResultName(e.type_examen || 'Résultat d\'examen');
      setIsResultModalOpen(true);
    }}
    title="Voir le résultat"
  >
    <Eye size={18} />
  </Button>
)}
    </div>
  </div>
)) : (
  <p className="text-sm text-[#5E7480] italic text-center py-4 col-span-2">Aucun examen prescrit.</p>
)}
                </div>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
  <Card>
    <Card.Header><Card.Title>Patient</Card.Title></Card.Header>
    <div className="flex flex-col items-center p-4">
      <div className="w-16 h-16 rounded-full bg-[#3BA7B8] flex items-center justify-center text-white text-xl font-bold mb-3">
        {consultation.patient?.firstName?.charAt(0)}{consultation.patient?.lastName?.charAt(0)}
      </div>
      <h3 className="font-bold text-[#1D2D35]">
        {consultation.patient?.firstName} {consultation.patient?.lastName}
      </h3>
      <p className="text-xs text-[#5E7480] mb-4">ID: {consultation.patient_id}</p>
      <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`/patients/${consultation.patient_id}`)}>
        Dossier médical administratif
      </Button>
    </div>
  </Card>


              <Card>
                <Card.Header><Card.Title>Session</Card.Title></Card.Header>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-[#5E7480]">Date</span><span className="font-medium">{consultation.date?.split(' ')[0]}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#5E7480]">Heure</span><span className="font-medium">{consultation.date?.split(' ')[1]}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#5E7480]">Statut</span><Badge variant="success">Terminée</Badge></div>
                </div>
              </Card>
            </div>
          </div>
                    {/* === SECTION IMPRIMABLE (cachée à l'écran) === */}
                    <div id="printable-ordonnance" className="hidden print:block">
            <div className="max-w-3xl mx-auto p-8 bg-white text-black">
              {/* En-tête Ordonnance */}
              <div className="border-b-2 border-[#1D2D35] pb-6 mb-8 text-center">
                <h1 className="text-3xl font-bold text-[#1D2D35]">ORDONNANCE MÉDICALE</h1>
                <p className="text-lg mt-1">MediNode - Plateforme de Gestion Distribuée</p>
              </div>

              {/* Informations Médecin + Patient */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-lg">Médecin :</h3>
                  <p className="text-xl">{consultation.medecin?.name || 'Dr. [Nom du Médecin]'}</p>
                  <p className="text-sm text-gray-600">Médecin traitant</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Date : {consultation.date?.split(' ')[0]}</p>
                  <p className="text-sm">ID Consultation : #{consultation.id}</p>
                </div>
              </div>

              {/* Patient */}
              <div className="mb-8 p-4 border border-gray-300 rounded-xl">
                <h3 className="font-semibold mb-2">Patient :</h3>
                <p className="text-xl">
                  {consultation.patient?.firstName} {consultation.patient?.lastName}
                </p>
                <p className="text-sm text-gray-600">ID Patient : {consultation.patient_id}</p>
              </div>

              {/* Prescriptions */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Prescriptions</h3>
                {consultation.prescriptions?.length > 0 ? (
                  consultation.prescriptions.map((p, index) => (
                    <div key={index} className="mb-6 pl-4 border-l-4 border-[#4FAF8F]">
                      <p className="text-lg font-medium">{p.medicament}</p>
                      <p className="text-sm">{p.dosage} — {p.frequence} — {p.duree_jours} jours</p>
                      {p.observations && <p className="text-sm italic mt-1">Note : {p.observations}</p>}
                    </div>
                  ))
                ) : (
                  <p className="italic text-gray-500">Aucune prescription enregistrée</p>
                )}
              </div>

              {/* Signature */}
              <div className="text-right mt-12 pt-8 border-t">
                <p className="font-medium">Dr. {consultation.medecin?.name || '[Nom du Médecin]'}</p>
                <p className="text-sm text-gray-500">Signature et cachet</p>
              </div>
            </div>
          </div>
        </main>
      </div>
         {/* === MODALES === */}
         {/* Modal Ajout Prescription */}
         <Modal 
           isOpen={isPrescModalOpen} 
           onClose={() => setIsPrescModalOpen(false)} 
           title="Ajouter une prescription"
         >
           <div className="space-y-4">
             <Input 
               label="Médicament" 
               placeholder="ex: Paracétamol" 
               value={prescForm.medicament} 
               onChange={e => setPrescForm({...prescForm, medicament: e.target.value})} 
               required 
             />
             <div className="grid grid-cols-2 gap-4">
               <Input 
                 label="Dosage" 
                 placeholder="ex: 500 mg" 
                 value={prescForm.dosage} 
                 onChange={e => setPrescForm({...prescForm, dosage: e.target.value})} 
                 required 
               />
               <Input 
                 label="Fréquence" 
                 placeholder="ex: 3 fois par jour" 
                 value={prescForm.frequence} 
                 onChange={e => setPrescForm({...prescForm, frequence: e.target.value})} 
                 required 
               />
             </div>
             <Input 
               label="Durée (jours)" 
               type="number" 
               value={prescForm.duree_jours} 
               onChange={e => setPrescForm({...prescForm, duree_jours: e.target.value})} 
               required 
             />
             <div>
               <label className="block text-sm font-medium mb-1">Observations</label>
               <textarea 
                 className="w-full p-3 rounded-xl border border-[#EAF1F4]" 
                 rows={3} 
                 value={prescForm.observations} 
                 onChange={e => setPrescForm({...prescForm, observations: e.target.value})} 
               />
             </div>
             <Button className="w-full" onClick={handleAddPrescription}>
               Enregistrer la prescription
             </Button>
           </div>
         </Modal>
   {/* Modal Ajout Examen */}
<Modal 
  isOpen={isExamenModalOpen} 
  onClose={() => setIsExamenModalOpen(false)} 
  title="Demander un examen"
>
  <div className="space-y-4">
    <Input 
      label="Type d'examen" 
      placeholder="ex: NFS, Radio..." 
      value={examenForm.type_examen} 
      onChange={e => setExamenForm({...examenForm, type_examen: e.target.value})} 
      required 
    />
    <Input 
      label="Laboratoire" 
      placeholder="Nom du laboratoire" 
      value={examenForm.laboratoire} 
      onChange={e => setExamenForm({...examenForm, laboratoire: e.target.value})} 
    />
    
    {/* Nouveau champ Pièce jointe */}
    <div>
      <label className="block text-sm font-medium mb-1">Pièce jointe (Résultat)</label>
      <input 
        type="file" 
        onChange={e => setExamenForm({...examenForm, fichier_joint: e.target.files[0]})}
        className="w-full p-3 rounded-xl border border-[#EAF1F4] text-sm"
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <p className="text-xs text-[#5E7480] mt-1">PDF, JPG ou PNG (optionnel)</p>
    </div>

    <label className="flex items-center gap-2 cursor-pointer">
      <input 
        type="checkbox" 
        checked={examenForm.urgence} 
        onChange={e => setExamenForm({...examenForm, urgence: e.target.checked})} 
      />
      <span className="text-sm">Examen urgent</span>
    </label>

    <Button className="w-full" onClick={handleAddExamen}>
      Demander l'examen
    </Button>
  </div>
</Modal>
            {/* Modal Visualisation Résultat */}
            <Modal 
        isOpen={isResultModalOpen} 
        onClose={() => setIsResultModalOpen(false)} 
        title={selectedResultName}
      >
        <div className="flex flex-col items-center p-2">
          {selectedResultFile ? (
            <>
              {selectedResultFile.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={selectedResultFile} 
                  className="w-full h-[75vh] border border-[#EAF1F4] rounded-xl"
                  title="Résultat PDF"
                />
              ) : (
                <img 
                  src={selectedResultFile} 
                  alt="Résultat d'examen" 
                  className="max-h-[75vh] w-auto object-contain rounded-xl border border-[#EAF1F4] bg-white p-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x400?text=Erreur+Chargement+Image';
                    console.error("Erreur chargement image :", selectedResultFile);
                  }}
                />
              )}

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => window.open(selectedResultFile, '_blank')}
                >
                  Ouvrir dans un nouvel onglet
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setIsResultModalOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </>
          ) : (
            <p className="text-[#5E7480] py-8">Aucun fichier disponible</p>
          )}
        </div>
      </Modal>
       </div>
     )
   }

 