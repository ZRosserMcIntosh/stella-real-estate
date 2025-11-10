import React from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'
import type { UserRole } from '../../types/onboarding'

type RoleCard = {
  role: UserRole
  title: string
  description: string
  route: string
  badge?: string
}

const roleCards: RoleCard[] = [
  {
    role: 'realtor',
    title: 'Sou corretor(a)',
    description: 'Informe seu CRECI individual para liberar o construtor de sites completo.',
    route: '/onboarding/realtor-license',
  },
  {
    role: 'brokerage',
    title: 'Sou imobiliária',
    description: 'Vamos validar o CRECI Jurídico e o corretor responsável da sua operação.',
    route: '/onboarding/brokerage-license',
  },
  {
    role: 'developer',
    title: 'Sou incorporadora/construtora',
    description: 'Vincule um corretor responsável ou convide uma imobiliária parceira.',
    route: '/onboarding/developer-broker-link',
  },
  {
    role: 'employee',
    title: 'Sou funcionário(a) de uma imobiliária',
    description: 'Digite o código de convite enviado pelo seu administrador para acessar o ambiente.',
    route: '/onboarding/employee-code',
    badge: 'Necessário convite',
  },
]

export default function ChooseRole() {
  const navigate = useNavigate()
  const { state, selectRole, redeemDeveloperCode } = useOnboarding()
  const [developerCode, setDeveloperCode] = React.useState('')
  const [devError, setDevError] = React.useState<string | null>(null)
  const [devSuccess, setDevSuccess] = React.useState<string | null>(null)
  const [redeeming, setRedeeming] = React.useState(false)

  React.useEffect(() => {
    if (!state.account) {
      navigate('/criar-site', { replace: true })
    }
  }, [state.account, navigate])

  if (!state.account) return null

  const handleSelect = async (role: UserRole, route: string) => {
    try {
      selectRole(role)
      navigate(route)
    } catch (error) {
      if (error instanceof OnboardingError) {
        // eslint-disable-next-line no-alert -- onboarding fallback notification
        window.alert(error.message)
      } else {
        window.console.error(error)
      }
    }
  }

  const handleRedeemDeveloperCode = async (event: React.FormEvent) => {
    event.preventDefault()
    setDevError(null)
    setDevSuccess(null)
    const trimmed = developerCode.trim()
    if (!trimmed) {
      setDevError('Informe o código no formato XXXX-XXXX-XXXX-XXXX.')
      return
    }
    setRedeeming(true)
    try {
      const { role } = await redeemDeveloperCode(trimmed)
      setDevSuccess('Modo desenvolvedor ativado! Você pode avançar sem preencher a licença agora.')
      const target = roleCards.find((item) => item.role === role)
      if (target) {
        selectRole(role)
        navigate(target.route)
      }
    } catch (error) {
      if (error instanceof OnboardingError) {
        setDevError(error.message)
      } else {
        console.error(error)
        setDevError('Não foi possível validar este código agora.')
      }
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Passo 2 de 4</span>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Como você quer começar?</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Liberamos diferentes recursos com base na sua atuação. Você sempre pode ajustar depois com o time Stella.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10 grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Código de desenvolvedor</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">Liberar sandbox sem validações obrigatórias</h2>
            <p className="mt-1 text-sm text-slate-600">
              Utilize um código emitido em <span className="font-semibold text-brand-600">/admin/developer</span> para pular etapas de licença durante os testes.
            </p>
          </div>
          {state.developerOverride && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Modo desenvolvedor ativo para <span className="font-semibold">{state.account.fullName}</span>.
              Escolha qualquer caminho abaixo ou avance direto para a etapa de site.
            </div>
          )}
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleRedeemDeveloperCode}>
            <label className="flex-1 text-sm font-medium text-slate-700">
              Código
              <input
                value={developerCode}
                onChange={(event) => setDeveloperCode(event.target.value.toUpperCase())}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono uppercase tracking-[0.3em] shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <button
              type="submit"
              disabled={redeeming}
              className="inline-flex h-[46px] items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {redeeming ? 'Validando...' : 'Aplicar código'}
            </button>
          </form>
          {devError && <p className="text-sm text-red-600">{devError}</p>}
          {devSuccess && <p className="text-sm text-emerald-600">{devSuccess}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {roleCards.map((card) => {
            const isActive = state.role === card.role
            return (
              <button
                key={card.role}
                type="button"
                onClick={() => handleSelect(card.role, card.route)}
                className={`flex h-full flex-col rounded-3xl border px-6 py-6 text-left shadow-sm transition ${
                  isActive
                    ? 'border-brand-500 bg-brand-50 shadow-brand-100/50'
                    : 'border-slate-200 bg-white hover:border-brand-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-slate-900">{card.title}</h2>
                  {card.badge && (
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-600">{card.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
                  Escolher <span aria-hidden>&rarr;</span>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
