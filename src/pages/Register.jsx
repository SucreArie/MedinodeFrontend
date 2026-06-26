import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff, Stethoscope, UserCog, Shield } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Input from '../components/Input'
import { cn } from '../utils/helpers'
import api from '../services/api';   // ← Ajoute cette ligne

const roles = [
  { id: 'medecin', label: 'Médecin', icon: Stethoscope, description: 'Praticien médical' },
  { id: 'admin', label: 'Administrateur', icon: UserCog, description: 'Gestion établissement' },
  { id: 'secretaire', label: 'Secrétaire', icon: Shield, description: 'Support médical' },
]

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState('medecin')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    establishment: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName) newErrors.fullName = 'Nom requis'
    if (!formData.email) newErrors.email = 'Email requis'
    if (!formData.establishment) newErrors.establishment = 'Établissement requis'
    if (!formData.password) newErrors.password = 'Mot de passe requis'
    if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setLoading(true);

    try {
        const response = await api.post('/register', {
            name: formData.fullName,           // Backend attend "name"
            email: formData.email,
            password: formData.password,
            etablissement: formData.establishment,
            // Tu peux ajouter establishment et role plus tard dans la table users
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        navigate('/dashboard');
    } catch (error) {
        console.error(error.response?.data);

        if (error.response?.data?.errors) {
            // Gestion des erreurs de validation Laravel
            const backendErrors = {};
            Object.keys(error.response.data.errors).forEach(key => {
                backendErrors[key === 'name' ? 'fullName' : key] = error.response.data.errors[key][0];
            });
            setErrors(backendErrors);
        } else {
            alert(error.response?.data?.message || "Erreur lors de l'inscription");
        }
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F6FAFB]">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="inline-block mb-8">
              <Logo />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-[#1D2D35] mb-2">
              Créer un compte
            </h1>
            <p className="text-[#5E7480]">
              Rejoignez MediNode et commencez à gérer vos dossiers médicaux
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            {/*
            <div>
              <label className="block text-sm font-medium text-[#1D2D35] mb-3">
                Type de compte
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-center transition-all duration-200',
                      selectedRole === role.id
                        ? 'border-[#3BA7B8] bg-[#3BA7B8]/5'
                        : 'border-[#EAF1F4] hover:border-[#3BA7B8]/50'
                    )}
                  >
                    <role.icon
                      size={24}
                      className={cn(
                        'mx-auto mb-2',
                        selectedRole === role.id ? 'text-[#3BA7B8]' : 'text-[#5E7480]'
                      )}
                    />
                    <p className={cn(
                      'text-sm font-medium',
                      selectedRole === role.id ? 'text-[#0F4C5C]' : 'text-[#5E7480]'
                    )}>
                      {role.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            */}

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nom complet"
                name="fullName"
                placeholder="Dr. Jean Dupont"
                icon={User}
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Input
                label="Établissement"
                name="establishment"
                placeholder="Hôpital Central"
                icon={Building2}
                value={formData.establishment}
                onChange={handleChange}
                error={errors.establishment}
              />
            </div>

            <Input
              label="Email professionnel"
              name="email"
              type="email"
              placeholder="docteur@etablissement.fr"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-[#5E7480] hover:text-[#0F4C5C] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Input
                label="Confirmer"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>

            {/* Password strength indicator */}
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      formData.password.length >= i * 3
                        ? i <= 2 ? 'bg-[#F4B860]' : 'bg-[#4FAF8F]'
                        : 'bg-[#EAF1F4]'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-[#5E7480]">
                {formData.password.length < 6 ? 'Faible' : formData.password.length < 10 ? 'Moyen' : 'Fort'}
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-[#EAF1F4] text-[#3BA7B8] focus:ring-[#3BA7B8]/30"
              />
              <span className="text-sm text-[#5E7480]">
                J&apos;accepte les{' '}
                <a href="#" className="text-[#3BA7B8] hover:underline">conditions d&apos;utilisation</a>
                {' '}et la{' '}
                <a href="#" className="text-[#3BA7B8] hover:underline">politique de confidentialité</a>
              </span>
            </label>

            <Button
              type="submit"
              variant="accent"
              size="large"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Créer mon compte
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#5E7480]">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-[#3BA7B8] hover:text-[#0F4C5C] transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3BA7B8] to-[#58D6C3] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-20 w-48 h-48 bg-[#0F4C5C]/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <h2 className="font-heading text-3xl font-bold mb-4">
              Rejoignez notre réseau médical
            </h2>
            <p className="text-white/80 leading-relaxed mb-8">
              Plus de 200 établissements font déjà confiance à MediNode pour la gestion 
              sécurisée de leurs dossiers médicaux.
            </p>
            
            {/* Features list */}
            <div className="space-y-4">
              {[
                'Synchronisation en temps réel',
                'Sécurité de niveau hospitalier',
                'Support technique 24/7',
                'Formation personnalisée',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur-sm">
              <p className="text-white/90 italic mb-4">
                &quot;MediNode a transformé notre façon de gérer les dossiers patients. 
                Une solution vraiment innovante.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                  PM
                </div>
                <div>
                  <p className="font-medium">Dr. Pierre Martin</p>
                  <p className="text-sm text-white/70">Directeur médical, CHU Lyon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
