import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BRAZIL_STATES } from '../../constants/brazilStates'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'

const creciPattern = /^\d{4,8}-[A-Z]{1,2}$/

const formatCreci = (value: string) => value.trim().toUpperCase()

export default function RealtorLicense() {
  const navigate = useNavigate()
  const { state, saveRealtorLicense, redeemDeveloperCode } = useOnboarding()

  const license = state.license && state.license.type === 'realtor' ? state.license : undefined
  const [creciNumber, setCreciNumber] = React.useState(license?.creciNumber ?? '')
  const [uf, setUf] = React.useState(license?.uf ?? '')
  const [creciName, setCreciName] = React.useState(license?.creciName ?? state.account?.fullName ?? '')
  const [defer, setDefer] = React.useState<boolean>(license?.deferred ?? false)
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
    if (state.role !== 'realtor') {
      navigate('/onboarding/choose-role', { replace: true })
    }
  }, [state.account, state.role, navigate])

  if (!state.account || state.role !== 'realtor') return null

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
      saveRealtorLicense({
        creciNumber: defer ? undefined : formatCreci(creciNumber),
        uf: defer ? undefined : uf,
        creciName,
        deferred: defer,
      })
      navigate('/onboarding/site-setup')
    } catch (err) {
      if (err instanceof OnboardingError) {
        setError(err.message)
      } else {
        setError('Não foi possível salvar seus dados agora. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const showFormatHint = creciNumber.length > 0 && !creciPattern.test(creciNumber.trim().toUpperCase())

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Passo 3 de 4</span>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Informe seu CRECI para liberar o construtor</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Com seus dados de licença, ativamos o construtor completo e registramos a autorização junto à Constellation.
            Caso prefira adicionar depois, o construtor fica bloqueado até você atualizar as informações.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form className="mx-auto max-w-2xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
          {state.developerOverride && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Código de desenvolvedor ativo. Você pode seguir direto para a configuração do site sem informar o CRECI agora.
            </div>
          )}
          <div className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <p>
              Validamos o formato agora e faremos a verificação completa em segundo plano. Seus dados ficam visíveis apenas para a equipe Stella.
            </p>
          </div>

          <label className="block text-sm font-medium text-slate-700">
            CRECI Individual
            <input
              type="text"
              value={creciNumber}
              onChange={(event) => setCreciNumber(event.target.value)}
              disabled={defer}
              placeholder="12345-F"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            {showFormatHint && !defer && (
              <p className="mt-2 text-xs text-amber-600">
                Formato recomendado: 12345-F. Vamos aceitar este padrão e validar manualmente depois.
              </p>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            UF do CRECI
            <select
              value={uf}
              onChange={(event) => setUf(event.target.value)}
              disabled={defer}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">Selecione...</option>
              {BRAZIL_STATES.map((stateOption) => (
                <option key={stateOption.value} value={stateOption.value}>
                  {stateOption.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Nome que aparece no CRECI
            <input
              type="text"
              value={creciName}
              onChange={(event) => setCreciName(event.target.value)}
              placeholder="Nome cadastrado no conselho"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={defer}
              onChange={(event) => setDefer(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/50"
            />
            <span>
              Vou adicionar depois.
              <span className="block text-xs text-slate-500">
                Você poderá navegar pela vitrine da Constellation, mas o construtor permanecerá bloqueado.
              </span>
            </span>
          </label>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Tem código de desenvolvedor?</p>
            <p className="text-xs text-slate-500">
              Aplique um código sandbox para liberar o construtor sem preencher o CRECI neste passo.
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Seus dados serão criptografados e usados apenas para validar a autorização de atuação regional.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Salvando...' : 'Salvar e continuar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
