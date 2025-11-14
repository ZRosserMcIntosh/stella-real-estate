import React, { useState } from 'react'
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

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

interface RealtorSignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function RealtorSignupModal({ isOpen, onClose, onSuccess }: RealtorSignupModalProps) {
  const [step, setStep] = useState<'account' | 'creci' | 'processing'>('account')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null)

  // Account fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  
  // CRECI fields
  const [userType, setUserType] = useState<'realtor' | 'company'>('realtor')
  const [creciNumber, setCreciNumber] = useState('')
  const [creciUf, setCreciUf] = useState('')
  const [companyName, setCompanyName] = useState('')

  // Success state
  const [userId, setUserId] = useState<string | null>(null)
  const [memberNumber, setMemberNumber] = useState<number | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      fetchSlotsRemaining()
    }
  }, [isOpen])

  const fetchSlotsRemaining = async () => {
    try {
      const { data, error } = await supabase.rpc('get_founding_slots_remaining')
      if (!error && data !== null) {
        setSlotsRemaining(data)
      }
    } catch (err) {
      console.error('Error fetching slots:', err)
    }
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateCRECI = (creci: string) => {
    // Basic validation - should be numbers followed by optional -F or -J
    return /^\d{4,6}(-[FJ])?$/i.test(creci.trim())
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!fullName.trim()) {
      setError('Nome completo é obrigatório')
      return
    }
    if (!validateEmail(email)) {
      setError('Email inválido')
      return
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      // Create account with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
          },
        },
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      if (!data.user) {
        throw new Error('Failed to create account')
      }

      setUserId(data.user.id)
      setStep('creci')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const handleCreciSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!creciNumber.trim() || !creciUf) {
      setError('CRECI e UF são obrigatórios para corretores e imobiliárias')
      return
    }

    if (!validateCRECI(creciNumber)) {
      setError('CRECI inválido. Use o formato: 12345-F ou 12345')
      return
    }

    if (userType === 'company' && !companyName.trim()) {
      setError('Nome da empresa é obrigatório')
      return
    }

    if (!userId) {
      setError('Erro: usuário não encontrado. Por favor, reinicie o processo.')
      return
    }

    setLoading(true)
    setStep('processing')

    try {
      // Call API to create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          fullName,
          creciNumber: creciNumber.trim().toUpperCase(),
          creciUf,
          userType,
          companyName: userType === 'company' ? companyName : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      setMemberNumber(data.memberNumber)
      setSlotsRemaining(data.slotsRemaining)

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar requisição')
      setStep('creci')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('account')
    setEmail('')
    setPassword('')
    setFullName('')
    setPhone('')
    setCreciNumber('')
    setCreciUf('')
    setCompanyName('')
    setUserType('realtor')
    setError(null)
    setUserId(null)
    setMemberNumber(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {step === 'account' ? 'Criar Conta' : step === 'creci' ? 'Verificação CRECI' : 'Processando...'}
            </h2>
            {slotsRemaining !== null && (
              <p className="text-emerald-400 font-semibold">
                {slotsRemaining} vagas restantes de 100
              </p>
            )}
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'account' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {step === 'account' ? '1' : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div className={`w-16 h-0.5 ${step !== 'account' ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'creci' ? 'bg-emerald-500 text-white' : step === 'processing' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {step === 'processing' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <div className={`w-16 h-0.5 ${step === 'processing' ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'processing' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}>
              3
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Step 1: Account Creation */}
          {step === 'account' && (
            <form onSubmit={handleAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Continuar'
                )}
              </button>
            </form>
          )}

          {/* Step 2: CRECI Verification */}
          {step === 'creci' && (
            <form onSubmit={handleCreciSubmit} className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-200">
                  Para garantir a qualidade da plataforma, apenas corretores e imobiliárias com CRECI ativo podem se inscrever.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Cadastro *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('realtor')}
                    className={`p-4 rounded-lg border-2 transition ${
                      userType === 'realtor'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold">Corretor Individual</div>
                    <div className="text-xs mt-1">CRECI Pessoa Física</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('company')}
                    className={`p-4 rounded-lg border-2 transition ${
                      userType === 'company'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold">Imobiliária</div>
                    <div className="text-xs mt-1">CRECI Pessoa Jurídica</div>
                  </button>
                </div>
              </div>

              {userType === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nome da sua imobiliária"
                    required={userType === 'company'}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Número CRECI *
                  </label>
                  <input
                    type="text"
                    value={creciNumber}
                    onChange={(e) => setCreciNumber(e.target.value)}
                    placeholder="12345-F"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    UF do CRECI *
                  </label>
                  <select
                    value={creciUf}
                    onChange={(e) => setCreciUf(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  >
                    <option value="">Selecione...</option>
                    {BRAZIL_STATES.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-white mb-2">Verificação CRECI</h4>
                <p className="text-xs text-slate-400">
                  Validaremos seu CRECI nos próximos dias úteis. Você terá acesso imediato ao plano Team por 24 meses após o pagamento.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('account')}
                  disabled={loading}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Ir para Pagamento'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Processing */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-emerald-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Preparando seu pagamento...</h3>
              <p className="text-slate-400">
                Você será redirecionado para o checkout do Stripe em instantes.
              </p>
              {memberNumber && (
                <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-300">
                    Você é o membro fundador #{memberNumber}!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
