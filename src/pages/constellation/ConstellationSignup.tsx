import React, { useState, useMemo, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ConstellationUrls } from '../../utils/constellationUrl'
import { trackPurchaseComplete, trackStartRegistration } from '../../utils/analytics'

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
  phone: string
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
            Founding 100 - Constellation Prime
          </h3>
          <p className="text-2xl font-bold text-indigo-400">
            R$ 99,00
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
  
  const [signupStep, setSignupStep] = useState<'account' | 'professional' | 'payment'>('account')
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
    
    // Only redirect if they already have a session AND have completed payment
    if (session || isDemo) {
      // Check if user has paid before redirecting
      if (userId) {
        // User just registered, stay on payment page
        return
      }
      
      // Check if user already has a founding_members record with payment completed
      const checkPaymentStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('founding_members')
            .select('payment_status')
            .eq('user_id', session?.user?.id)
            .single()
          
          // Only redirect if user has already paid
          if (data && data.payment_status === 'paid') {
            navigate(ConstellationUrls.dashboard(), { replace: true })
          } else if (data && data.payment_status === 'pending') {
            // If payment is pending, redirect to dashboard which will show pending state
            navigate(ConstellationUrls.dashboard(), { replace: true })
          }
          // If they have a pending payment or no record, let them stay on signup page
        } catch (err) {
          // If error (no record found), allow them to stay on signup page
          console.log('No payment record found, allowing signup')
        }
      }
      
      checkPaymentStatus()
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

  // Step 1: Account Info validation (name, email, phone, password)
  const validateAccountInfo = () => {
    if (!signupData.fullName.trim()) {
      setError('Por favor, informe seu nome completo')
      return false
    }
    if (!signupData.email.includes('@')) {
      setError('Por favor, informe um email válido')
      return false
    }
    if (!validatePhone(signupData.phone)) {
      setError('Por favor, informe um telefone válido')
      return false
    }
    if (signupData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return false
    }
    return true
  }

  // Step 2: Professional Info validation (all optional)
  const validateProfessionalInfo = () => {
    // All professional fields are optional
    // Only validate format if provided
    if (signupData.accountType === 'company' && signupData.companyName.trim()) {
      if (!validateCNPJ(signupData.cnpj)) {
        setError('CNPJ inválido')
        return false
      }
    }
    // If CRECI number is provided, UF is required
    if (signupData.creciNumber.trim() && !signupData.creciUf) {
      setError('Por favor, selecione o estado do CRECI')
      return false
    }
    return true
  }

  // Step handlers
  const handleAccountInfoNext = () => {
    if (validateAccountInfo()) {
      setError(null)
      setSignupStep('professional')
    }
  }

  const handleProfessionalInfoNext = async () => {
    if (!validateProfessionalInfo()) {
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
          creci_number: signupData.creciNumber || null,
          creci_uf: signupData.creciUf || null,
          creci_type: signupData.creciNumber ? (signupData.accountType === 'company' ? 'corporate' : 'individual') : null,
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
          cpf: signupData.cpf || null,
          account_type: signupData.accountType,
          company_name: signupData.companyName || null,
          cnpj: signupData.cnpj || null,
          creci_number: signupData.creciNumber || null,
          creci_uf: signupData.creciUf || null,
          payment_status: 'pending', // Mark as pending until payment
          payment_amount: 99.00,
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
      
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupData,
          userId: newUserId, // Pass user ID to payment API
          amount: 9900, // R$ 99.00 in cents
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

            {/* Sign Up Form - Step 1: Account Info (Name, Email, Phone, Password) */}
            {signupStep === 'account' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Passo 1 de 2 - Informações da Conta</p>
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
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={signupData.phone}
                    onChange={(e) => setSignupData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    placeholder="(00) 00000-0000"
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
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-light uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Próximo
                </button>
              </div>
            )}

            {/* Sign Up Form - Step 2: Professional Info (Optional CRECI) */}
            {signupStep === 'professional' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">Passo 2 de 2 - Informações Profissionais (Opcional)</p>
                  <p className="text-xs text-slate-400 mt-2">Estas informações são opcionais mas ajudam a personalizar sua experiência</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CPF <span className="text-slate-500 font-normal">(opcional)</span>
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
                    Tipo de Conta
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
                      Empresa
                    </button>
                  </div>
                </div>

                {signupData.accountType === 'company' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Nome da Empresa <span className="text-slate-500 font-normal">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={signupData.companyName}
                        onChange={(e) => setSignupData(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Nome da empresa"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        CNPJ <span className="text-slate-500 font-normal">(opcional)</span>
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
                    Número CRECI <span className="text-slate-500 font-normal">(opcional)</span>
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
                    Estado do CRECI <span className="text-slate-500 font-normal">(opcional)</span>
                  </label>
                  <select
                    value={signupData.creciUf}
                    onChange={(e) => setSignupData(prev => ({ ...prev, creciUf: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  >
                    <option value="">Selecione o estado</option>
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
                      setSignupStep('account')
                      setError(null)
                    }}
                    className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleProfessionalInfoNext}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-light uppercase tracking-[0.2em] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {loading ? 'Criando conta...' : 'Finalizar'}
                  </button>
                </div>
              </div>
            )}

            {/* Sign Up Form - Step 3: Payment */}
            {signupStep === 'payment' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center mb-4">
                  <p className="text-xs text-indigo-300/60 uppercase tracking-wider">{t('constellation.step_4_title')}</p>
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
                        setSignupStep('professional')
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
