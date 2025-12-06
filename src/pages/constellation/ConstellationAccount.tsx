import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationAuthHeader from '../../components/ConstellationAuthHeader'
import { 
  User, 
  Building2, 
  FileText, 
  Save, 
  Check, 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  AlertCircle
} from 'lucide-react'

// Brazilian states for CRECI
const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function ConstellationAccount() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [memberData, setMemberData] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cpf: '',
    company_name: '',
    cnpj: '',
    creci_number: '',
    creci_uf: '',
  })
  
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const { i18n } = useTranslation()
  const isPt = i18n.language?.startsWith('pt')

  useEffect(() => {
    if (authLoading) return
    
    if (!session) {
      navigate(ConstellationUrls.login(), { replace: true })
      return
    }

    fetchMemberData()
  }, [session, authLoading])

  const fetchMemberData = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single()

      if (data) {
        setMemberData(data)
        setFormData({
          full_name: data.full_name || '',
          email: data.email || session?.user?.email || '',
          phone: data.phone || '',
          cpf: data.cpf || '',
          company_name: data.company_name || '',
          cnpj: data.cnpj || '',
          creci_number: data.creci_number || '',
          creci_uf: data.creci_uf || '',
        })
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  // Format CPF: 000.000.000-00
  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11)
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  // Format CNPJ: 00.000.000/0000-00
  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14)
    return cleaned
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }

  // Format phone: (00) 00000-0000
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11)
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    if (name === 'cpf') {
      formattedValue = formatCPF(value)
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value)
    } else if (name === 'phone') {
      formattedValue = formatPhone(value)
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    setSaved(false)
    setError('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const { error } = await supabase
        .from('founding_members')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          cpf: formData.cpf,
          company_name: formData.company_name,
          cnpj: formData.cnpj,
          creci_number: formData.creci_number,
          creci_uf: formData.creci_uf,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', session?.user?.id)

      if (error) {
        console.error('Error saving:', error)
        setError(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      console.error('Error:', err)
      setError(isPt ? 'Erro ao salvar. Tente novamente.' : 'Error saving. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{isPt ? 'Minha Conta' : 'My Account'} - Constellation</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <ConstellationAuthHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center pt-28">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-slate-400">{isPt ? 'Carregando...' : 'Loading...'}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{isPt ? 'Minha Conta' : 'My Account'} - Constellation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ConstellationAuthHeader />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/dashboard"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isPt ? 'Minha Conta' : 'My Account'}
              </h1>
              <p className="text-slate-400 text-sm">
                {isPt ? 'Gerencie suas informações pessoais e profissionais' : 'Manage your personal and professional information'}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {isPt ? 'Informações Pessoais' : 'Personal Information'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    {isPt ? 'Nome Completo' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder={isPt ? 'Seu nome completo' : 'Your full name'}
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isPt ? 'Email não pode ser alterado' : 'Email cannot be changed'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    {isPt ? 'Telefone' : 'Phone'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {isPt ? 'Empresa / Marca' : 'Company / Brand'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">
                    {isPt ? 'Nome da Empresa / Marca' : 'Company / Brand Name'}
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder={isPt ? 'Ex: Imobiliária Silva, João Corretor' : 'Ex: Silva Realty, John Realtor'}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {isPt ? 'Este nome aparecerá no seu site' : 'This name will appear on your site'}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-400 mb-2">
                    CNPJ <span className="text-slate-500">({isPt ? 'opcional' : 'optional'})</span>
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              </div>
            </div>

            {/* CRECI Information */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {isPt ? 'Registro CRECI' : 'CRECI Registration'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    {isPt ? 'Número CRECI' : 'CRECI Number'}
                  </label>
                  <input
                    type="text"
                    name="creci_number"
                    value={formData.creci_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="000000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    {isPt ? 'Estado (UF)' : 'State (UF)'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      name="creci_uf"
                      value={formData.creci_uf}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">{isPt ? 'Selecione o estado' : 'Select state'}</option>
                      {BRAZILIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                {isPt 
                  ? 'Seu número CRECI será exibido no seu site para validar sua atuação profissional.'
                  : 'Your CRECI number will be displayed on your site to validate your professional practice.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300">{error}</span>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  saved
                    ? 'bg-green-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    {isPt ? 'Salvo!' : 'Saved!'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isPt ? 'Salvar Alterações' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
