import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'
import type { InviteRedemption } from '../../types/onboarding'

export default function EmployeeInvite() {
  const navigate = useNavigate()
  const { state, builderGate, redeemInvite, redeemDeveloperCode } = useOnboarding()
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState<InviteRedemption | null>(state.invite ?? null)
  const [developerCode, setDeveloperCode] = React.useState('')
  const [devError, setDevError] = React.useState<string | null>(null)
  const [devLoading, setDevLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.account) {
      navigate('/criar-site', { replace: true })
      return
    }
    if (state.role !== 'employee') {
      navigate('/onboarding/choose-role', { replace: true })
    }
  }, [state.account, state.role, navigate])

  React.useEffect(() => {
    if (success && builderGate.mode !== 'locked') {
      const timer = window.setTimeout(() => {
        navigate('/admin/website-builder')
      }, 1600)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [builderGate.mode, navigate, success])

  if (!state.account || state.role !== 'employee') return null

  const handleDeveloperCode = async (event: React.FormEvent) => {
    event.preventDefault()
    setDevError(null)
    if (!developerCode.trim()) {
      setDevError('Informe o código no formato XXXX-XXXX-XXXX-XXXX.')
      return
    }
    setDevLoading(true)
    try {
      await redeemDeveloperCode(developerCode.trim())
    } catch (err) {
      if (err instanceof OnboardingError) {
        setDevError(err.message)
      } else {
        console.error(err)
        setDevError('Não foi possível validar o código agora.')
      }
    } finally {
      setDevLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const redemption = await redeemInvite(code)
      setSuccess(redemption)
    } catch (err) {
      if (err instanceof OnboardingError) {
        setError(err.message)
      } else {
        setError('Não foi possível validar o convite agora. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Convite da equipe</span>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Insira o código enviado pela sua imobiliária</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            O convite garante que você seja associado à organização correta e receba as permissões adequadas.
            Peça ao administrador para gerar um novo caso esteja expirado.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto mb-10 max-w-lg space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Testando com código de desenvolvedor?</h2>
          <p className="text-sm text-slate-600">
            Informe um código sandbox para liberar o acesso ao construtor sem depender do convite da imobiliária.
          </p>
          {state.developerOverride && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Modo desenvolvedor já ativo. Acesse o builder no menu principal ou continue os testes por aqui.
            </div>
          )}
          <form className="space-y-3" onSubmit={handleDeveloperCode}>
            <label className="block text-sm font-medium text-slate-700">
              Código de desenvolvedor
              <input
                value={developerCode}
                onChange={(event) => setDeveloperCode(event.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono uppercase tracking-[0.3em] shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <button
              type="submit"
              disabled={devLoading}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {devLoading ? 'Validando...' : 'Aplicar código sandbox'}
            </button>
          </form>
          {devError && <p className="text-sm text-red-600">{devError}</p>}
        </div>

        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Código de convite
              <input
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value.trim())}
                placeholder="Ex.: Q7X9M2PA"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm uppercase tracking-[0.3em] shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Validando convite...' : 'Validar convite'}
            </button>
          </form>

          {success && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-4 text-sm text-emerald-700">
              <p className="font-semibold">
                Convite aceito! Você agora faz parte de <span className="underline decoration-emerald-400">{success.orgName}</span>
                {' '}como {success.role === 'listing_manager' ? 'gestor(a) de listings' : success.role}.
              </p>
              <p className="mt-2 text-emerald-800/80">
                {builderGate.mode === 'locked'
                  ? 'Seu administrador ainda precisa liberar o acesso ao construtor. Avise-o caso precise publicar algo.'
                  : 'Estamos encaminhando você para o construtor de sites. Caso não aconteça automaticamente, acesse o menu Website Builder.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center rounded-full border border-emerald-300 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 hover:bg-white"
                >
                  Ir para o painel
                </Link>
                <Link
                  to="/admin/website-builder"
                  className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-emerald-700"
                >
                  Abrir Website Builder
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
