import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Input from '../components/Input'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F4C5C] to-[#3BA7B8] relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Decorative elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-[#58D6C3]/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#F4B860]/20 rounded-full blur-2xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            {/* Medical Illustration */}
            <div className="mb-10">
              <div className="w-full h-64 rounded-2xl glass-dark p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 h-full">
                  <div className="col-span-2 space-y-4">
                    <div className="h-8 w-3/4 bg-white/20 rounded-lg animate-pulse-soft" />
                    <div className="h-6 w-1/2 bg-white/15 rounded-lg animate-pulse-soft delay-100" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-16 w-16 bg-[#58D6C3]/30 rounded-xl" />
                      <div className="h-16 w-16 bg-[#4FAF8F]/30 rounded-xl" />
                      <div className="h-16 w-16 bg-[#F4B860]/30 rounded-xl" />
                    </div>
                    <div className="h-4 w-full bg-white/10 rounded-lg animate-pulse-soft delay-200" />
                    <div className="h-4 w-4/5 bg-white/10 rounded-lg animate-pulse-soft delay-300" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 bg-white/20 rounded-xl" />
                    <div className="h-12 bg-[#4FAF8F]/40 rounded-xl" />
                    <div className="h-12 bg-white/15 rounded-xl" />
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="font-heading text-3xl font-bold mb-4">
              Bienvenue sur MediNode
            </h2>
            <p className="text-white/80 leading-relaxed">
              Accédez à votre espace sécurisé pour gérer les dossiers médicaux de vos patients 
              en temps réel, où que vous soyez.
            </p>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {['DL', 'MR', 'SC'].map((initials, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-[#3BA7B8] flex items-center justify-center text-xs font-semibold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/70">
                +200 médecins connectés aujourd&apos;hui
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F6FAFB]">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="inline-block mb-8">
              <Logo />
            </Link>
            <h1 className="font-heading text-2xl font-bold text-[#1D2D35] mb-2">
              Connexion
            </h1>
            <p className="text-[#5E7480]">
              Entrez vos identifiants pour accéder à votre espace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            <Input
              label="Email professionnel"
              type="email"
              placeholder="docteur@etablissement.fr"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-[#5E7480] hover:text-[#0F4C5C] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#EAF1F4] text-[#3BA7B8] focus:ring-[#3BA7B8]/30"
                />
                <span className="text-sm text-[#5E7480]">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-sm font-medium text-[#3BA7B8] hover:text-[#0F4C5C] transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="large"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Se connecter
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAF1F4]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F6FAFB] text-[#5E7480]">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="secondary" className="w-full">
                <svg className="w-5 h-5 mr-2" fill="#0078D4" viewBox="0 0 24 24">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
                Microsoft
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[#5E7480]">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-medium text-[#3BA7B8] hover:text-[#0F4C5C] transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
