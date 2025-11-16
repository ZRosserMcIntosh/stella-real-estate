import React, { useState, useMemo, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

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

// Payment Form Component
function PaymentForm({ 
  onSuccess, 
  onBack, 
  signupData,
  isTestMode = false,
}: { 
  onSuccess: () => void
  onBack: () => void
  signupData: SignupFormData
  isTestMode?: boolean
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setMessage(submitError.message || 'An error occurred')
      setIsProcessing(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/sub/constellation/payment-success`,
        receipt_email: signupData.email,
      },
      redirect: 'if_required',
    })

    if (error) {
      setMessage(error.message || 'Payment failed')
      setIsProcessing(false)
    } else {
      // Payment successful
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-slate-900/50 border border-white/10 rounded-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            Founding 100 - Constellation Prime
            {isTestMode && <span className="ml-2 text-xs text-amber-400">(TEST MODE)</span>}
          </h3>
          <p className="text-2xl font-bold text-indigo-400">
            {isTestMode ? 'R$ 3,00' : 'R$ 2.970,00'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Pagamento único • Acesso vitalício
          </p>
        </div>
        
        <PaymentElement />
      </div>

      {message && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-sm text-red-300">{message}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
        </button>
      </div>
    </form>
  )
}

export default function ConstellationSignup() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // Static background stars - memoized to prevent regeneration on re-renders
  const staticStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []); // Empty deps - only generate once
  
  // Shooting stars - memoized to prevent regeneration on re-renders
  const shootingStars = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: 0,
      duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6),
      left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80,
      top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50,
      width: 100 * (0.7 + Math.random() * 0.6),
      opacity: 0.7 + Math.random() * 0.6,
    }));
  }, []); // Empty deps - only generate once
  
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
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null) // Store user ID after creation
  const [useTestPayment, setUseTestPayment] = useState(false) // Toggle for test payment
  const [isRegistering, setIsRegistering] = useState(false) // Prevent redirect during registration
  
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { session, isDemo, loading: authLoading } = useAuth()

  React.useEffect(() => {
    if (authLoading) return
    // Don't redirect during registration process
    if (isRegistering) return
    // Only redirect if they already have a session AND have completed payment
    if (session || isDemo) {
      // Check if user has paid before redirecting
      if (userId) {
        // User just registered, stay on payment page
        return
      }
      navigate('/sub/constellation/dashboard', { replace: true })
    }
  }, [authLoading, session, isDemo, navigate, isRegistering, userId])

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

  const handleCredentialsNext = async () => {
    if (!signupData.email.includes('@')) {
      setError('Invalid email address')
      return
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setError(null)
    setLoading(true)
    setIsRegistering(true) // Prevent redirect during registration

    try {
      console.log('Step 0: Checking if user already exists...')
      
      // Check if user with this email already exists
      const { data: existingMember } = await supabase
        .from('founding_members')
        .select('user_id, email')
        .eq('email', signupData.email)
        .single()
      
      if (existingMember) {
        setError('User with this email is already registered. Please login instead.')
        setLoading(false)
        setIsRegistering(false)
        return
      }
      
      console.log('Step 1: Creating user account...')
      
      // Step 1: Create auth account WITHOUT auto-signing them in
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: undefined, // Don't redirect
          data: {
            user_type: 'constellation_user', // Mark as Constellation user
            full_name: signupData.fullName,
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('Failed to create user account')
      }

      const newUserId = authData.user.id
      setUserId(newUserId)
      console.log('User created:', newUserId)

      // Step 2: Create user_profile with constellation_user type (WHILE STILL SIGNED IN)
      console.log('Step 2: Creating user profile...')
      
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: newUserId,
          full_name: signupData.fullName,
          user_type: 'constellation_user',
          creci_number: signupData.creciNumber,
          creci_uf: signupData.creciUf,
          creci_type: signupData.accountType === 'company' ? 'corporate' : 'individual',
          phone: signupData.phone,
          company_name: signupData.companyName || null,
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        throw new Error(profileError.message)
      }

      // Step 3: Create founding_member record with status 'pending' (WHILE STILL SIGNED IN)
      console.log('Step 3: Creating founding member record...')
      
      const { error: memberError } = await supabase
        .from('founding_members')
        .insert({
          user_id: newUserId,
          email: signupData.email,
          phone: signupData.phone,
          full_name: signupData.fullName,
          cpf: signupData.cpf,
          account_type: signupData.accountType,
          company_name: signupData.companyName || null,
          cnpj: signupData.cnpj || null,
          creci_number: signupData.creciNumber,
          creci_uf: signupData.creciUf,
          payment_status: 'pending', // Mark as pending until payment
          payment_amount: useTestPayment ? 3.00 : 2970.00,
        })

      if (memberError) {
        console.error('Error creating founding member:', memberError)
        throw new Error(memberError.message)
      }

      console.log('Founding member record created with pending status')
      
      // NOW sign out so they stay on the payment page (after all DB inserts)
      await supabase.auth.signOut()
      console.log('User signed out, staying on payment page')

      // Step 4: Create payment intent
      console.log('Step 4: Creating payment intent...')
      
      const apiEndpoint = useTestPayment 
        ? '/api/stripe/create-test-payment' 
        : '/api/stripe/create-payment-intent'
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupData,
          userId: newUserId, // Pass user ID to payment API
          amount: useTestPayment ? 300 : 297000, // R$ 3.00 or R$ 2,970.00 in cents
        }),
      })

      const text = await response.text()
      console.log('Payment API Response:', text)
      
      if (!text) {
        throw new Error('Empty response from payment server. Are you running with `vercel dev`?')
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError)
        throw new Error('Invalid response format from payment server')
      }

      if (!response.ok) {
        throw new Error(data.error || `Payment server error: ${response.status}`)
      }

      if (!data.clientSecret) {
        throw new Error('Missing client secret in response')
      }

      setClientSecret(data.clientSecret)
      setPaymentIntentId(data.paymentIntentId)
      
      // User is now created with pending status, move to payment
      setSignupStep('payment')
      
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Error creating account')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    // User and founding_member record already created with pending status
    // Payment webhook will update status to 'paid' when payment succeeds
    console.log('Payment successful! Signing in and redirecting...')
    
    setIsRegistering(false) // Allow navigation now
    
    // Sign them in so they have a session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: signupData.email,
      password: signupData.password,
    })

    if (signInError) {
      console.error('Error signing in after payment:', signInError)
      setError('Payment successful! Please log in at /sub/constellation/login')
      return
    }
    
    // Redirect to Constellation portal (they are external realtors, not internal admin)
    // TODO: Create a Constellation dashboard at /sub/constellation/dashboard
    navigate('/sub/constellation', { replace: true })
  }

  const handleSignupSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    await handlePaymentSuccess()
  }

  return (
    <>
      <style>{`
        html, body {
          background: #020617 !important;
          background-attachment: fixed;
          min-height: 100vh;
        }
      `}</style>
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          {staticStars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: star.width + 'px',
                height: star.height + 'px',
                top: star.top + '%',
                left: star.left + '%',
                animationDelay: star.animationDelay + 's',
                animationDuration: star.animationDuration + 's',
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        {/* Shooting stars effect */}
        <style>{`
          @keyframes shoot {
            0% {
              transform: translateX(0) translateY(0) rotate(-45deg);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            85% {
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
              width: `${star.width}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}

        {/* Signup Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8">
            {/* Constellation Logo/Title */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4 sm:mb-6">
                <img 
                  src="/tech-icons/contellation-logo.png" 
                  alt="Constellation" 
                  className="h-24 sm:h-32 w-auto object-contain"
                  style={{
                    filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(129, 140, 248, 0.4)) drop-shadow(0 0 16px rgba(129, 140, 248, 0.2))'
                  }}
                />
              </div>
              <h1 
                className="text-xl sm:text-2xl font-light uppercase tracking-[0.4em] text-indigo-200/80 mb-2" 
                style={{ 
                  fontFamily: 'Outfit, sans-serif',
                  textShadow: '0 0 20px rgba(129, 140, 248, 0.5), 0 0 40px rgba(129, 140, 248, 0.2)'
                }}
              >
                CONSTELLATION
              </h1>
              <p className="text-[10px] sm:text-xs font-light uppercase tracking-[0.4em] text-indigo-200/60 mt-3 sm:mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('constellation.signup_subtitle')}
              </p>
            </div>

            {/* Sign Up Form - Step 1: Personal Info */}
            {signupStep === 'personal' && (
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
            {signupStep === 'business' && (
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
            {signupStep === 'credentials' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Step 3 of 4: Login Credentials</p>
                </div>

                {/* Test Payment Toggle */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-amber-300">Test Mode (R$ 3.00)</p>
                      <p className="text-xs text-amber-400/60">For testing only - still confirms as realtor</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={useTestPayment}
                      onChange={(e) => setUseTestPayment(e.target.checked)}
                      className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-2 focus:ring-amber-500/50"
                    />
                  </label>
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
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Finish Registration'}
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Form - Step 4: Payment */}
            {signupStep === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Step 4 of 4: Payment</p>
                </div>

                {clientSecret ? (
                  <Elements 
                    stripe={stripePromise} 
                    options={{ 
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#6366f1',
                          colorBackground: '#0f172a',
                          colorText: '#e2e8f0',
                          colorDanger: '#ef4444',
                          fontFamily: 'system-ui, sans-serif',
                          borderRadius: '12px',
                        },
                      },
                    }}
                  >
                    <PaymentForm
                      onSuccess={handlePaymentSuccess}
                      onBack={() => {
                        setSignupStep('credentials')
                        setError(null)
                      }}
                      signupData={signupData}
                      isTestMode={useTestPayment}
                    />
                  </Elements>
                ) : (
                  <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl text-center">
                    <p className="text-slate-300">Preparando pagamento...</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Links */}
            <div className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] sm:text-xs">
              <Link to="/sub/constellation" className="text-slate-400 hover:text-indigo-400 transition-colors">
                ← Voltar
              </Link>
              <Link to="/sub/constellation/reset" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Esqueci Senha
              </Link>
              <Link to="/sub/constellation/login" className="text-slate-400 hover:text-indigo-400 transition-colors">
                Fazer Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
