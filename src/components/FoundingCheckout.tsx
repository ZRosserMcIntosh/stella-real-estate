import React, { useState } from 'react'
import { X, Loader2, Check } from 'lucide-react'
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

interface FoundingCheckoutProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  fullName: string
  cpf: string
  phone: string
  accountType: 'individual' | 'company'
  companyName: string
  cnpj: string
  numberOfPartners: string
  creciNumber: string
  creciUf: string
  email: string
  password: string
  acceptTerms: boolean
}

function CheckoutForm({ formData, onSuccess }: { formData: FormData; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Confirm payment with Stripe
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setError(submitError.message || 'Erro ao processar pagamento')
        setProcessing(false)
        return
      }

      // Create payment intent on your backend
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: 297000, // R$ 2,970.00 in cents
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/precos?success=true`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Erro ao confirmar pagamento')
      } else {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Resumo do Pedido</h3>
        <div className="flex justify-between text-slate-300">
          <span>Founding 100 - Constellation Prime</span>
          <span className="font-semibold text-emerald-400">R$ 3,00</span>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>Finalizar Pagamento - R$ 3,00</>
        )}
      </button>

      <p className="text-xs text-center text-slate-400">
        Ao finalizar, você concorda com os termos do programa Founding 100
      </p>
    </form>
  )
}

export default function FoundingCheckout({ isOpen, onClose, onSuccess }: FoundingCheckoutProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    cpf: '',
    phone: '',
    accountType: 'individual',
    companyName: '',
    cnpj: '',
    numberOfPartners: '',
    creciNumber: '',
    creciUf: '',
    email: '',
    password: '',
    acceptTerms: false,
  })

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateCPF = (cpf: string) => {
    // Remove non-digits
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.length === 11
  }

  const validateCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, '')
    return cleaned.length === 14
  }

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || cleaned.length === 11 // Supports both landline and mobile
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Nome completo é obrigatório')
      return false
    }
    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido')
      return false
    }
    if (!validatePhone(formData.phone)) {
      setError('Telefone inválido')
      return false
    }
    if (formData.accountType === 'company') {
      if (!formData.companyName.trim()) {
        setError('Nome da empresa é obrigatório')
        return false
      }
      if (!validateCNPJ(formData.cnpj)) {
        setError('CNPJ inválido')
        return false
      }
    }
    if (!formData.creciNumber.trim()) {
      setError('Número CRECI é obrigatório')
      return false
    }
    if (!formData.creciUf) {
      setError('UF do CRECI é obrigatório')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Email inválido - deve conter @')
      return false
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (!formData.acceptTerms) {
      setError('Você deve aceitar os termos para continuar')
      return false
    }
    return true
  }

  const handleContinueToPayment = async () => {
    setError(null)
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Create payment intent
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: 300, // R$ 3.00 target amount (TEST - change to 297000 for R$ 2,970.00)
          // Backend will adjust to 290 cents (R$ 2.90) so PIX fee brings it to R$ 3.00
        }),
      })

      if (!response.ok) {
        // Try to parse error message
        let errorMessage = 'Erro ao criar pagamento'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // If JSON parsing fails, use status text
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (err) {
      console.error('Payment creation error:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar requisição')
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 11)
    
    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    } else if (cleaned.length <= 9) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    } else {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }
  }

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 14)
    
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
    } else if (cleaned.length <= 12) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`
    } else {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`
    }
  }

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 11)
    
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    } else if (cleaned.length <= 10) {
      // Landline format: (XX) XXXX-XXXX
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    } else {
      // Mobile format: (XX) 9XXXX-XXXX
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
  }

  if (!isOpen) return null

  const stripeOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#10b981',
        colorBackground: '#1e293b',
        colorText: '#f1f5f9',
        colorDanger: '#ef4444',
        fontFamily: 'Outfit, system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
    // Pre-fill billing details from form
    defaultValues: {
      billingDetails: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: {
          country: 'BR',
        },
      },
    },
  } : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {step === 'form' ? 'Cadastro Founding 100' : 'Pagamento'}
            </h2>
            <p className="text-slate-300 text-sm">
              {step === 'form' ? 'Preencha seus dados para continuar' : 'Finalize seu pagamento'}
            </p>
          </div>

          {step === 'form' ? (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="(11) 98765-4321"
                  maxLength={15}
                />
              </div>

              {/* Account Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Conta *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('accountType', 'individual')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      formData.accountType === 'individual'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Para Mim
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('accountType', 'company')}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                      formData.accountType === 'company'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Para Empresa
                  </button>
                </div>
              </div>

              {/* Company Fields (conditional) */}
              {formData.accountType === 'company' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nome da Empresa *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Nome da sua imobiliária"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      CNPJ *
                    </label>
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', formatCNPJ(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Número de Sócios/Funcionários
                    </label>
                    <input
                      type="number"
                      value={formData.numberOfPartners}
                      onChange={(e) => handleInputChange('numberOfPartners', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      placeholder="Ex: 5"
                      min="1"
                    />
                  </div>
                </>
              )}

              {/* CRECI */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Número CRECI *
                  </label>
                  <input
                    type="text"
                    value={formData.creciNumber}
                    onChange={(e) => handleInputChange('creciNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    placeholder="12345-F"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    UF *
                  </label>
                  <select
                    value={formData.creciUf}
                    onChange={(e) => handleInputChange('creciUf', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Selecione</option>
                    {BRAZIL_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-300">
                    Aceito os{' '}
                    <a 
                      href="/founder-terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      termos e condições
                    </a>
                    {' '}do programa Founding 100, incluindo:{' '}
                    <strong>24 meses de acesso ao Plano Team</strong>, desconto vitalício de 75%,
                    mapas 3D extras por R$ 10, e reconhecimento como Founding Partner.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleContinueToPayment}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>Continuar para Pagamento</>
                )}
              </button>
            </div>
          ) : (
            clientSecret && stripeOptions && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm 
                  formData={formData} 
                  onSuccess={() => {
                    onSuccess?.()
                    onClose()
                  }} 
                />
              </Elements>
            )
          )}
        </div>
      </div>
    </div>
  )
}
