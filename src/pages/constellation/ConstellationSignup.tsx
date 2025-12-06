import React, { useState, useMemo, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ConstellationUrls } from '../../utils/constellationUrl'
import { trackPurchaseComplete, trackStartRegistration } from '../../utils/analytics'
import { ConstellationGTMHead, ConstellationGTMBody } from '../../components/ConstellationGTM'

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
  phone: string // Optional - can be added later in "complete your account"
  email: string
  password: string
  // Optional CRECI fields (page 2)
  cpf: string
  accountType: 'individual' | 'company'
  companyName: string
  cnpj: string
  creciNumber: string
  creciUf: string
}

// Payment Form Component
function PaymentForm({ 
  onSuccess, 
  onBack, 
  signupData,
}: { 
  onSuccess: () => void
  onBack: () => void
  signupData: SignupFormData
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { t } = useTranslation()

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
        return_url: `${window.location.origin}${ConstellationUrls.dashboard()}`,
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
            Entrada de Pré-Lançamento + Benefícios Vitalícios
          </h3>
          <p className="text-2xl font-bold text-indigo-400">
            R$ 99
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Pagamento único • Acesso no lançamento
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
          {t('constellation.back')}
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 py-3 px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-light uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {isProcessing ? t('constellation.processing') : t('constellation.confirm_payment')}
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
      animationDelay: Math.random() * 10, // Random delay up to 10s for staggered twinkling
      animationDuration: Math.random() * 3 + 2, // 2-5 seconds per twinkle
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
  
  const [signupStep, setSignupStep] = useState<'account' | 'payment'>('account')
  const [signupData, setSignupData] = useState<SignupFormData>({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    // Optional CRECI fields
    cpf: '',
    accountType: 'individual',
    companyName: '',
    cnpj: '',
    creciNumber: '',
    creciUf: '',
  })
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null) // Store user ID after creation
  const [isRegistering, setIsRegistering] = useState(false) // Prevent redirect during registration
  
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { session, isDemo, loading: authLoading } = useAuth()

  React.useEffect(() => {
    if (authLoading) return
    // Don't redirect during registration process
    if (isRegistering) return
    
    // Only redirect if they already have a session AND are a constellation user with payment completed
    if (session && !isDemo) {
      // Check if this user is a constellation user with a COMPLETED payment
      const checkConstellationUser = async () => {
        try {
          const { data, error } = await supabase
            .from('founding_members')
            .select('payment_status, user_id')
            .eq('user_id', session.user.id)
            .single()
          
          // Only redirect if user has COMPLETED payment (payment_status === 'paid')
          if (data && data.payment_status === 'paid') {
            // If they just registered (userId is set), stay on payment page
            if (userId === data.user_id) {
              return
            }
            
            // Otherwise redirect to dashboard - they're already a paid member
            navigate(ConstellationUrls.dashboard(), { replace: true })
          }
          // If no record, or payment not completed, allow them to stay on signup/payment page
        } catch (err) {
          // If error (no record found), they're not a constellation user - allow signup
          console.log('Not a constellation user yet, allowing signup')
        }
      }
      
      checkConstellationUser()
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

  // Step 1: Account Info validation (name, email, password only - phone is optional)
  const validateAccountInfo = () => {
    if (!signupData.fullName.trim()) {
      setError('Por favor, informe seu nome completo')
      return false
    }
    if (!signupData.email.includes('@')) {
      setError('Por favor, informe um email válido')
      return false
    }
    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    return true
  }

  // Step handlers
  const handleAccountInfoNext = async () => {
    if (!validateAccountInfo()) {
      return
    }
    
    // Track qualify_lead event when user initiates the payment flow
    trackStartRegistration({ 
      source: 'constellation_signup', 
      step: 'finalizar_button',
      account_type: signupData.accountType 
    });
    
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
          creci_number: null, // Optional, can be added later
          creci_uf: null,
          creci_type: null,
          phone: null, // Optional, can be added later in "complete your account"
          company_name: null, // Optional, can be added later
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        console.error('Profile error details:', JSON.stringify(profileError, null, 2))
        throw new Error(`Profile error: ${profileError.message || profileError.details || 'Unknown error'}`)
      }

      // Step 3: Create founding_member record with status 'pending' (WHILE STILL SIGNED IN)
      console.log('Step 3: Creating founding member record...')
      
      const memberData = {
        user_id: newUserId,
        email: signupData.email,
        phone: null, // Optional, can be added later in "complete your account"
        full_name: signupData.fullName,
        cpf: null, // Optional, can be added later
        account_type: 'individual', // Default to individual
        company_name: null,
        cnpj: null,
        creci_number: null,
        creci_uf: null,
        payment_status: 'paid', // Mark as paid immediately (no payment required)
        payment_amount: 0.00, // Free signup
      }
      
      console.log('Inserting founding member with data:', memberData)
      
      const { error: memberError } = await supabase
        .from('founding_members')
        .insert(memberData)

      if (memberError) {
        console.error('Error creating founding member:', memberError)
        console.error('Member error details:', JSON.stringify(memberError, null, 2))
        throw new Error(`Founding member error: ${memberError.message || memberError.details || 'Unknown error'}`)
      }

      console.log('Founding member record created successfully')
      
      // Sign out and sign back in to ensure session is fresh
      await supabase.auth.signOut()
      
      // Sign them in with their credentials
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: signupData.email,
        password: signupData.password,
      })

      if (signInError) {
        console.error('Error signing in after signup:', signInError)
        setError(`Conta criada! Por favor, faça login em ${ConstellationUrls.login()}`)
        setLoading(false)
        return
      }
      
      console.log('User signed in, redirecting to dashboard...')
      setIsRegistering(false)
      
      // Redirect directly to Constellation dashboard
      navigate(ConstellationUrls.dashboard(), { replace: true })
      
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
    
    // Track Google Ads conversion for completed purchase
    trackPurchaseComplete(
      99.00, // R$ 99 purchase value
      paymentIntentId || undefined, // Stripe payment intent ID as transaction ID
      {
        source: 'constellation_signup',
        plan: 'founding_100',
        email: signupData.email,
      }
    )
    
    setIsRegistering(false) // Allow navigation now
    
    // Sign them in so they have a session
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: signupData.email,
      password: signupData.password,
    })

    if (signInError) {
      console.error('Error signing in after payment:', signInError)
      setError(`Payment successful! Please log in at ${ConstellationUrls.login()}`)
      return
    }
    
    // Redirect to Constellation dashboard
    navigate(ConstellationUrls.dashboard(), { replace: true })
  }

  const handleSignupSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    await handlePaymentSuccess()
  }

  return (
    <>
      <ConstellationGTMHead />
      <Helmet>
        <title>Entrada de Pré-Lançamento - Constellation | R$ 99</title>
        <meta name="description" content="Garanta sua Entrada de Pré-Lançamento + Benefícios Vitalícios por R$ 99 - Plataforma completa para corretores com CRM, automação e marketing imobiliário." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://constellation.stellareal.com.br/signup" />
      </Helmet>

      <ConstellationGTMBody />

      <style>{`
        html, body {
          background: #020617 !important;
          background-attachment: fixed;
          min-height: 100vh;
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          20% {
            opacity: 0.5;
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.2));
          }
          30% {
            opacity: 1;
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
          }
          60% {
            opacity: 1;
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
          }
          75% {
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
          }
          95% {
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
          }
          100% {
            transform: translateX(-300px) translateY(300px) rotate(-45deg);
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shootingStar linear infinite;
        }
      `}</style>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950 flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
        {staticStars.map((star) => (
          <div
            key={`static-${star.id}`}
            className="star"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              opacity: star.opacity,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="shooting-star"
            style={{
              width: `${star.width}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Shooting stars effect */}
      <style>{`
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
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}</style>

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

            {/* Sign Up Form - Account Info (Name, Email, Password) - Fast signup! */}
            {signupStep === 'account' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Crie sua conta</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres</p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAccountInfoNext}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-light uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {loading ? 'Finalizando...' : 'Finalizar'}
                </button>
              </div>
            )}

            {/* Sign Up Form - Step 2: Payment */}
            {signupStep === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Acesso Prioritário (Opcional)</p>
                </div>

                {/* Optional Payment Notice */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center mb-4">
                  <p className="text-sm text-emerald-300 mb-2">
                    <strong>Sua conta foi criada com sucesso!</strong>
                  </p>
                  <p className="text-xs text-slate-400">
                    O pagamento de R$ 99 não é obrigatório, mas garante <strong className="text-emerald-400">acesso prioritário</strong> ao lançamento + <strong className="text-emerald-400">12 meses grátis</strong> + <strong className="text-emerald-400">50% OFF vitalício</strong>.
                  </p>
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
                        setSignupStep('account')
                        setError(null)
                      }}
                      signupData={signupData}
                    />
                  </Elements>
                ) : (
                  <div className="p-6 bg-slate-900/50 border border-white/10 rounded-xl text-center">
                    <p className="text-slate-300">{t('constellation.processing')}</p>
                  </div>
                )}

                {/* Skip Payment Option */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Navigate to dashboard without payment
                      window.location.href = ConstellationUrls.dashboard()
                    }}
                    className="text-sm text-slate-400 hover:text-white underline transition-colors"
                  >
                    Pular e acessar minha conta →
                  </button>
                </div>

                {/* Custom Site Option */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center mt-6">
                  <p className="text-sm text-purple-300 mb-3">
                    🎨 Quer um site completamente personalizado?
                  </p>
                  <p className="text-xs text-slate-400 mb-4">
                    Nossa equipe pode criar e entregar um site sob medida para você.
                  </p>
                  <a
                    href="https://wa.me/5511985853836?text=Olá!%20Tenho%20interesse%20em%20um%20site%20personalizado%20para%20minha%20imobiliária."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Falar com Vendas
                  </a>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Links */}
            <div className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] sm:text-xs">
              <a href={ConstellationUrls.home()} className="text-slate-400 hover:text-indigo-400 transition-colors">
                ← Voltar
              </a>
              <Link to={ConstellationUrls.login()} className="text-slate-400 hover:text-indigo-400 transition-colors">
                Já tem uma conta? →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
