import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const BRAZIL_STATES = [
  { value: 'AC', label: 'Acre (AC)' },
  { value: 'AL', label: 'Alagoas (AL)' },
  { value: 'AP', label: 'Amapá (AP)' },
  { value: 'AM', label: 'Amazonas (AM)' },
  { value: 'BA', label: 'Bahia (BA)' },
  { value: 'CE', label: 'Ceará (CE)' },
  { value: 'DF', label: 'Distrito Federal (DF)' },
  { value: 'ES', label: 'Espírito Santo (ES)' },
  { value: 'GO', label: 'Goiás (GO)' },
  { value: 'MA', label: 'Maranhão (MA)' },
  { value: 'MT', label: 'Mato Grosso (MT)' },
  { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
  { value: 'MG', label: 'Minas Gerais (MG)' },
  { value: 'PA', label: 'Pará (PA)' },
  { value: 'PB', label: 'Paraíba (PB)' },
  { value: 'PR', label: 'Paraná (PR)' },
  { value: 'PE', label: 'Pernambuco (PE)' },
  { value: 'PI', label: 'Piauí (PI)' },
  { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
  { value: 'RN', label: 'Rio Grande do Norte (RN)' },
  { value: 'RS', label: 'Rio Grande do Sul (RS)' },
  { value: 'RO', label: 'Rondônia (RO)' },
  { value: 'RR', label: 'Roraima (RR)' },
  { value: 'SC', label: 'Santa Catarina (SC)' },
  { value: 'SP', label: 'São Paulo (SP)' },
  { value: 'SE', label: 'Sergipe (SE)' },
  { value: 'TO', label: 'Tocantins (TO)' },
]

interface SignupFormData {
  fullName: string
  cpf: string
  phone: string
  accountType: 'individual' | 'company'
  companyName: string
  cnpj: string
  creciNumber: string
  creciUf: string
  email: string
  password: string
}

export default function ConstellationLogin() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; delay: number; duration: number; left: number; top: number }>>([])
  const [signupStep, setSignupStep] = useState<'personal' | 'business' | 'credentials' | 'payment'>('personal')
  const [signupData, setSignupData] = useState<SignupFormData>({
    fullName: '',
    cpf: '',
    phone: '',
    accountType: 'individual',
    companyName: '',
    cnpj: '',
    creciNumber: '',
    creciUf: '',
    email: '',
    password: '',
  })
  
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { session, isDemo, loading: authLoading } = useAuth()

  React.useEffect(() => {
    if (authLoading) return
    if (session || isDemo) navigate('/admin', { replace: true })
  }, [authLoading, session, isDemo, navigate])

  // Add shooting stars effect after page loads
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const stars = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: Math.random() * 2 + 2, // Slowed down: 2-4 seconds (was 1-3)
        // Varied origins - some from top-left, some from middle, some from upper-right edge
        left: i < 2 ? Math.random() * 40 : i < 4 ? Math.random() * 60 + 20 : Math.random() * 20 + 80, // Last 2 from right edge (80-100%)
        top: i < 2 ? Math.random() * 30 : i < 4 ? Math.random() * 40 + 10 : Math.random() * 50, // Last 2 from upper half (0-50%)
      }))
      setShootingStars(stars)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Helper functions for formatting
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11)
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
  }

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14)
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11)
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    if (cleaned.length <= 10) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  const validateCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.length === 11
  }

  const validateCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, '')
    return cleaned.length === 14
  }

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || cleaned.length === 11
  }

  // Step 1: Personal Info validation
  const validatePersonalInfo = () => {
    if (!signupData.fullName.trim()) {
      setError('Full name is required')
      return false
    }
    if (!validateCPF(signupData.cpf)) {
      setError('Invalid CPF')
      return false
    }
    if (!validatePhone(signupData.phone)) {
      setError('Invalid phone number')
      return false
    }
    return true
  }

  // Step 2: Business Info validation
  const validateBusinessInfo = () => {
    if (signupData.accountType === 'company') {
      if (!signupData.companyName.trim()) {
        setError('Company name is required')
        return false
      }
      if (!validateCNPJ(signupData.cnpj)) {
        setError('Invalid CNPJ')
        return false
      }
    }
    if (!signupData.creciNumber.trim()) {
      setError('CRECI number is required')
      return false
    }
    if (!signupData.creciUf) {
      setError('CRECI state is required')
      return false
    }
    return true
  }

  // Step handlers
  const handlePersonalInfoNext = () => {
    if (validatePersonalInfo()) {
      setError(null)
      setSignupStep('business')
    }
  }

  const handleBusinessInfoNext = () => {
    if (validateBusinessInfo()) {
      setError(null)
      setSignupStep('credentials')
    }
  }

  const handleCredentialsNext = () => {
    if (!signupData.email.includes('@')) {
      setError('Invalid email address')
      return
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError(null)
    setSignupStep('payment')
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!signupData.email.includes('@')) {
      return setError('Invalid email address')
    }
    if (signupData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)
    
    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
    })

    if (authError) {
      setLoading(false)
      return setError(authError.message)
    }

    // If email confirmations are required
    if (authData?.user && authData.user?.email_confirmed_at == null) {
      setLoading(false)
      return setError('Check your email to confirm your account, then sign in.')
    }

    // Here you would typically save the additional info to your database
    // For now, just navigate to admin
    setLoading(false)
    setTimeout(() => navigate('/admin', { replace: true }), 200)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = identifier.trim()
    
    setLoading(true)
    let error: { message: string } | null = null
    if (mode === 'signin') {
      if (!trimmed || !trimmed.includes('@')) {
        setLoading(false)
        return setError('Enter the email address for your account.')
      }
      const res = await supabase.auth.signInWithPassword({ email: trimmed, password })
      error = res.error
      
      // Safari-specific: Check if localStorage is available
      if (!error && !res.data?.session) {
        try {
          if (typeof window !== 'undefined' && !window.localStorage) {
            setError('Please enable cookies and site data in your browser settings to sign in.')
            setLoading(false)
            return
          }
        } catch (e) {
          setError('Please enable cookies and site data in Safari (Settings > Privacy) to sign in.')
          setLoading(false)
          return
        }
      }
    } else {
      if (!trimmed || !trimmed.includes('@')) {
        setLoading(false)
        return setError('Enter a valid email address to create an account.')
      }
      const res = await supabase.auth.signUp({ email: trimmed, password })
      error = res.error
      // If email confirmations are enabled, user must confirm via email before sign-in
      if (!error && res.data?.user && res.data.user?.email_confirmed_at == null) {
        setLoading(false)
        return setError('Check your email to confirm your account, then sign in.')
      }
    }
    if (error) {
      setLoading(false)
      return setError(error.message || 'An unknown error occurred.')
    }
    // Session should be set automatically by Supabase listener; navigate on next tick
    setLoading(false)
    setTimeout(() => navigate('/admin', { replace: true }), 200)
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 2 + 's',
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Shooting stars effect */}
      <style>{`
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-500px) translateY(500px) rotate(-45deg);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, #fff, transparent);
          animation: shoot linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: '100px',
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-8 transition-all duration-500 ease-in-out">
          {/* Constellation Logo/Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/tech-icons/contellation-logo.png" 
                alt="Constellation" 
                className="h-32 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-light uppercase tracking-[0.4em] text-indigo-200/80 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              CONSTELLATION
            </h1>
            <p className="text-xs font-light uppercase tracking-[0.4em] text-indigo-200/60 mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-900/50 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setSignupStep('personal')
                setError(null)
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setSignupStep('personal')
                setError(null)
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container with smooth transitions */}
          <div className={`transition-all duration-500 ease-in-out ${mode === 'signup' ? 'min-h-[500px]' : 'min-h-[170px]'}`}>
            {/* Sign In Form */}
            {mode === 'signin' && (
              <form onSubmit={onSubmit} className="space-y-4 animate-fadeIn">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : 'Sign In'}
                </button>
              </form>
            )}

            {/* Sign Up Form - Step 1: Personal Info */}
            {mode === 'signup' && signupStep === 'personal' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Step 1 of 4: Personal Information</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={signupData.cpf}
                    onChange={(e) => setSignupData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={signupData.phone}
                    onChange={(e) => setSignupData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePersonalInfoNext}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  Next: Business Information
                </button>
              </div>
            )}

            {/* Sign Up Form - Step 2: Business Info */}
            {mode === 'signup' && signupStep === 'business' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Step 2 of 4: Business Information</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Account Type
                  </label>
                  <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setSignupData(prev => ({ ...prev, accountType: 'individual' }))}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        signupData.accountType === 'individual'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupData(prev => ({ ...prev, accountType: 'company' }))}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        signupData.accountType === 'company'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      Company
                    </button>
                  </div>
                </div>

                {signupData.accountType === 'company' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={signupData.companyName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Company Name"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        value={signupData.cnpj}
                        onChange={(e) => setSignupData(prev => ({ ...prev, cnpj: formatCNPJ(e.target.value) }))}
                        placeholder="00.000.000/0000-00"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CRECI Number
                  </label>
                  <input
                    type="text"
                    value={signupData.creciNumber}
                    onChange={(e) => setSignupData(prev => ({ ...prev, creciNumber: e.target.value }))}
                    placeholder="123456"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CRECI State
                  </label>
                  <select
                    value={signupData.creciUf}
                    onChange={(e) => setSignupData(prev => ({ ...prev, creciUf: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  >
                    <option value="">Select State</option>
                    {BRAZIL_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep('personal')
                      setError(null)
                    }}
                    className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleBusinessInfoNext}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Form - Step 3: Credentials */}
            {mode === 'signup' && signupStep === 'credentials' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Step 3 of 4: Login Credentials</p>
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep('business')
                      setError(null)
                    }}
                    className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCredentialsNext}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    Next: Payment
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Form - Step 4: Payment */}
            {mode === 'signup' && signupStep === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Step 4 of 4: Payment</p>
                </div>

                <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl text-center">
                  <p className="text-slate-300 mb-4">Payment integration coming soon</p>
                  <p className="text-sm text-slate-400">For now, click "Create Account" to complete registration</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep('credentials')
                      setError(null)
                    }}
                    className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSignupSubmit}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link to="/sub/constellation" className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors">
              ← Back to Constellation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
