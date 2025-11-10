import React from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'

type LinkMode = 'creci' | 'partner' | 'defer'

export default function DeveloperBrokerLink() {
  const navigate = useNavigate()
  const { state, saveDeveloperLink, redeemDeveloperCode } = useOnboarding()
  const license = state.license && state.license.type === 'developer' ? state.license : undefined

  const [mode, setMode] = React.useState<LinkMode>(license?.linkType ?? 'creci')
  const [responsibleCreci, setResponsibleCreci] = React.useState(license?.responsibleCreci ?? '')
  const [partnerName, setPartnerName] = React.useState(license?.partnerOrgName ?? '')
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
    if (state.role !== 'developer') {
      navigate('/onboarding/choose-role', { replace: true })
    }
  }, [state.account, state.role, navigate])

  if (!state.account || state.role !== 'developer') return null

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
      if (mode === 'creci') {
        saveDeveloperLink({
          linkType: 'creci',
          responsibleCreci: responsibleCreci.toUpperCase().trim(),
        })
      } else if (mode === 'partner') {
        saveDeveloperLink({
          linkType: 'partner',
          partnerOrgId: license?.partnerOrgId ?? '',
          partnerOrgName: partnerName,
        })
      } else {
        saveDeveloperLink({ linkType: 'defer' })
      }
      navigate('/onboarding/site-setup')
    } catch (err) {
      if (err instanceof OnboardingError) {
        setError(err.message)
      } else {
        setError('Não foi possível salvar as informações agora. Tente novamente.')
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
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vincule um corretor responsável</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Para publicar novos projetos na vitrine da Constellation você precisa de um corretor credenciado ou de uma
            imobiliária parceira. Sem esse vínculo, o construtor funciona em modo rascunho (listagens não são publicadas).
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
          {state.developerOverride && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Código de desenvolvedor ativo. Siga para o setup do site assim que estiver pronto.
            </div>
          )}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-slate-700">Escolha como quer comprovar a responsabilidade técnica</legend>
            <label className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-sm transition ${mode === 'creci' ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}>
              <input
                type="radio"
                name="link-mode"
                value="creci"
                checked={mode === 'creci'}
                onChange={() => setMode('creci')}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="font-semibold text-slate-900">Informar o CRECI do corretor responsável</span>
                <p className="text-xs text-slate-500">Ideal para equipes enxutas ou quando o corretor faz parte da incorporadora.</p>
              </div>
            </label>

            <label className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-sm transition ${mode === 'partner' ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}>
              <input
                type="radio"
                name="link-mode"
                value="partner"
                checked={mode === 'partner'}
                onChange={() => setMode('partner')}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="font-semibold text-slate-900">Vincular uma imobiliária parceira</span>
                <p className="text-xs text-slate-500">Convide uma imobiliária que já tenha CRECI ativo para publicar em seu nome.</p>
              </div>
            </label>

            <label className={`flex flex-col gap-2 rounded-2xl border px-4 py-4 text-sm transition ${mode === 'defer' ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}>
              <input
                type="radio"
                name="link-mode"
                value="defer"
                checked={mode === 'defer'}
                onChange={() => setMode('defer')}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500"
              />
              <div>
                <span className="font-semibold text-slate-900">Vou convidar um corretor depois</span>
                <p className="text-xs text-slate-500">Você pode desenhar o site agora. A publicação de listagens fica travada até confirmar a parceria.</p>
              </div>
            </label>
          </fieldset>

          {mode === 'creci' && (
            <label className="block text-sm font-medium text-slate-700">
              CRECI do corretor responsável
              <input
                type="text"
                value={responsibleCreci}
                onChange={(event) => setResponsibleCreci(event.target.value)}
                placeholder="12345-F"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
          )}

          {mode === 'partner' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Nome da imobiliária parceira
                <input
                  type="text"
                  value={partnerName}
                  onChange={(event) => setPartnerName(event.target.value)}
                  placeholder="Ex.: Constellation Brokers"
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </label>
              <p className="text-xs text-slate-500">
                Após salvar enviaremos um convite para que a imobiliária confirme a parceria. Você pode acompanhar o status em
                Configurações &gt; Parceiros.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Testar sem vincular agora</p>
            <p className="text-xs text-slate-500">
              Aplique um código sandbox para manter o construtor liberado enquanto o vínculo real é configurado.
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
              Assim que o vínculo for verificado, suas listagens publicadas também entram automaticamente no marketplace Constellation.
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
