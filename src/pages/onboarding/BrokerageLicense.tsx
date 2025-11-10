import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAZIL_STATES } from '../../constants/brazilStates'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'

const formatCnpjDisplay = (value: string) => {
  const digits = value.replace(/[^\d]/g, '').slice(0, 14)
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 8),
    digits.slice(8, 12),
    digits.slice(12, 14),
  ]
  return parts
    .map((part, index) => {
      if (index === 0) return part
      if (!part) return ''
      if (index === 3) return `/${part}`
      if (index === 4) return `-${part}`
      return `.${part}`
    })
    .join('')
}

export default function BrokerageLicense() {
  const navigate = useNavigate()
  const { state, saveBrokerageLicense, redeemDeveloperCode } = useOnboarding()
  const license = state.license && state.license.type === 'brokerage' ? state.license : undefined

  const [legalName, setLegalName] = React.useState(license?.legalName ?? '')
  const [cnpj, setCnpj] = React.useState(license ? formatCnpjDisplay(license.cnpj) : '')
  const [creciNumber, setCreciNumber] = React.useState(license?.creciNumber ?? '')
  const [uf, setUf] = React.useState(license?.uf ?? '')
  const [responsible, setResponsible] = React.useState(license?.responsibleCreci ?? '')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [developerCode, setDeveloperCode] = React.useState('')
  const [devError, setDevError] = React.useState<string | null>(null)
  const [devLoading, setDevLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.account) {
      navigate('/criar-site', { replace: true })
      return
    }
    if (state.role !== 'brokerage') {
      navigate('/onboarding/choose-role', { replace: true })
    }
  }, [state.account, state.role, navigate])

  if (!state.account || state.role !== 'brokerage') return null

  const handleDeveloperCode = async (event?: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault()
    setDevError(null)
    if (!developerCode.trim()) {
      setDevError('Informe o código no formato XXXX-XXXX-XXXX-XXXX.')
      return
    }
    setDevLoading(true)
    try {
      await redeemDeveloperCode(developerCode.trim())
      navigate('/onboarding/site-setup')
    } catch (err) {
      if (err instanceof OnboardingError) {
        setDevError(err.message)
      } else {
        console.error(err)
        setDevError('Não foi possível validar este código agora.')
      }
    } finally {
      setDevLoading(false)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      saveBrokerageLicense({
        legalName,
        cnpj,
        creciNumber,
        uf,
        responsibleCreci: responsible,
      })
      navigate('/onboarding/site-setup')
    } catch (err) {
      if (err instanceof OnboardingError) {
        setError(err.message)
      } else {
        setError('Não foi possível salvar os dados agora. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Passo 3 de 4</span>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dados da sua imobiliária</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Precisamos validar o CRECI Jurídico e o corretor responsável para liberar o construtor de sites.
            Você poderá convidar equipe e liberar acessos depois que o ambiente estiver ativo.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
          {state.developerOverride && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Código de desenvolvedor ativo. Você pode avançar para a criação do site sem preencher o CRECI agora.
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              Razão social
              <input
                type="text"
                value={legalName}
                onChange={(event) => setLegalName(event.target.value)}
                placeholder="Nome completo da empresa"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              CNPJ
              <input
                type="text"
                value={cnpj}
                onChange={(event) => setCnpj(formatCnpjDisplay(event.target.value))}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              CRECI Jurídico
              <input
                type="text"
                value={creciNumber}
                onChange={(event) => setCreciNumber(event.target.value.toUpperCase())}
                placeholder="12345-J"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              UF do CRECI
              <select
                value={uf}
                onChange={(event) => setUf(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="">Selecione...</option>
                {BRAZIL_STATES.map((stateOption) => (
                  <option key={stateOption.value} value={stateOption.value}>
                    {stateOption.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700 md:col-span-2">
              CRECI do corretor responsável
              <input
                type="text"
                value={responsible}
                onChange={(event) => setResponsible(event.target.value.toUpperCase())}
                placeholder="12345-F"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Usar código sandbox</p>
            <p className="text-xs text-slate-500">
              Se estiver testando a jornada, valide um código de desenvolvedor para pular a etapa de licença jurídica.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="flex-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Código
                <input
                  value={developerCode}
                  onChange={(event) => setDeveloperCode(event.target.value.toUpperCase())}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-mono uppercase tracking-[0.3em] shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </label>
              <button
                type="button"
                onClick={handleDeveloperCode}
                disabled={devLoading}
                className="inline-flex h-[44px] items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {devLoading ? 'Validando...' : 'Aplicar'}
              </button>
            </div>
            {devError && <p className="text-xs text-red-600">{devError}</p>}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-slate-500">
              Usamos esses dados para habilitar permissões, emitir convites e publicar listagens conforme regras regionais.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Validando...' : 'Salvar e continuar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
