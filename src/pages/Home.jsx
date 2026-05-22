import { Link } from 'react-router-dom'
import {
  Database,
  RefreshCw,
  Shield,
  BarChart3,
  Network,
  Bell,
  ArrowRight,
  CheckCircle,
  Users,
  FileText,
  Zap,
  Globe,
} from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Card from '../components/Card'
import { features, stats } from '../data/mockData'

const iconMap = {
  Database,
  RefreshCw,
  Shield,
  BarChart3,
  Network,
  Bell,
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAF1F4]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#5E7480] hover:text-[#0F4C5C] transition-colors">
              Fonctionnalités
            </a>
            <a href="#stats" className="text-sm font-medium text-[#5E7480] hover:text-[#0F4C5C] transition-colors">
              Statistiques
            </a>
            <a href="#about" className="text-sm font-medium text-[#5E7480] hover:text-[#0F4C5C] transition-colors">
              À propos
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link to="/register">
              <Button variant="accent" icon={ArrowRight} iconPosition="right">
                Commencer
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#58D6C3]/15 text-[#0F4C5C] text-sm font-medium mb-6">
                <Zap size={16} className="text-[#3BA7B8]" />
                Plateforme médicale nouvelle génération
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#1D2D35] leading-tight mb-6">
                Gestion{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C5C] to-[#3BA7B8]">
                  intelligente
                </span>{' '}
                des dossiers médicaux
              </h1>
              <p className="text-lg text-[#5E7480] mb-8 leading-relaxed max-w-xl">
                MediNode révolutionne la gestion des dossiers médicaux avec une architecture distribuée, 
                sécurisée et synchronisée en temps réel entre tous vos établissements.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="large" variant="accent" icon={ArrowRight} iconPosition="right">
                    Essai gratuit
                  </Button>
                </Link>
                <Button size="large" variant="outline">
                  Voir la démo
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-[#EAF1F4]">
                <p className="text-sm text-[#5E7480] mb-4">Certifié et conforme aux normes</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[#0F4C5C]">
                    <Shield size={20} />
                    <span className="text-sm font-medium">RGPD</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0F4C5C]">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">HDS</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0F4C5C]">
                    <Globe size={20} />
                    <span className="text-sm font-medium">HL7 FHIR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-in delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3BA7B8]/20 to-[#58D6C3]/20 rounded-3xl blur-3xl" />
              <div className="relative glass rounded-3xl p-6 shadow-soft-lg">
                {/* Mini Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAF1F4]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center">
                        <Users className="text-white" size={18} />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-[#1D2D35]">Patients actifs</p>
                        <p className="text-xs text-[#5E7480]">Mis à jour en temps réel</p>
                      </div>
                    </div>
                    <span className="text-2xl font-heading font-bold text-[#0F4C5C]">1,247</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#4FAF8F]/10">
                      <p className="text-xs text-[#5E7480]">Dossiers synchro</p>
                      <p className="text-lg font-heading font-bold text-[#4FAF8F]">892</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#3BA7B8]/10">
                      <p className="text-xs text-[#5E7480]">Nœuds actifs</p>
                      <p className="text-lg font-heading font-bold text-[#3BA7B8]">12</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F6FAFB]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#5E7480]">Synchronisation</span>
                      <span className="text-xs font-medium text-[#4FAF8F]">99.97%</span>
                    </div>
                    <div className="h-2 bg-[#EAF1F4] rounded-full overflow-hidden">
                      <div className="h-full w-[99.97%] bg-gradient-to-r from-[#4FAF8F] to-[#58D6C3] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Patients gérés' },
              { value: '200+', label: 'Établissements' },
              { value: '99.97%', label: 'Disponibilité' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0F4C5C] to-[#3BA7B8]">
                  {stat.value}
                </p>
                <p className="text-sm text-[#5E7480] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1D2D35] mb-4">
              Une plateforme complète pour la santé
            </h2>
            <p className="text-[#5E7480]">
              Découvrez les fonctionnalités qui font de MediNode la solution de référence 
              pour la gestion des dossiers médicaux distribués.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon]
              return (
                <Card
                  key={index}
                  hover
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] flex items-center justify-center mb-4">
                    {Icon && <Icon className="text-white" size={22} />}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-[#1D2D35] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#5E7480] leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] p-10 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#58D6C3]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à transformer votre gestion médicale ?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Rejoignez les centaines d&apos;établissements qui font confiance à MediNode 
                pour sécuriser et optimiser leurs dossiers patients.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <Button size="large" className="bg-white text-[#0F4C5C] hover:bg-white/90">
                    Démarrer gratuitement
                  </Button>
                </Link>
                <Button size="large" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contacter les ventes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#1D2D35]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] flex items-center justify-center">
                <FileText className="text-white" size={16} />
              </div>
              <span className="font-heading font-bold text-white">
                Medi<span className="text-[#58D6C3]">Node</span>
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="text-sm text-[#5E7480] hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="text-sm text-[#5E7480] hover:text-white transition-colors">Conditions</a>
              <a href="#" className="text-sm text-[#5E7480] hover:text-white transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-[#5E7480]">
              © 2024 MediNode. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
