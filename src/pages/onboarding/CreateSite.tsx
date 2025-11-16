import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'

const ATTEMPTS_KEY = 'stella:onboarding:signupAttempts'
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_ATTEMPTS = 10

const readAttempts = () => {
  if (typeof window === 'undefined') return [] as number[]
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as number[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((value) => typeof value === 'number')
  } catch {
    return []
  }
}

const writeAttempts = (attempts: number[]) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts))
  } catch {
    /* ignore storage issues */
  }
}

const recordAttempt = () => {
  const now = Date.now()
  const attempts = readAttempts().filter((timestamp) => now - timestamp < ATTEMPT_WINDOW_MS)
  attempts.push(now)
  writeAttempts(attempts)
  return attempts.length
}

const attemptsExceeded = () => {
  const now = Date.now()
  const recent = readAttempts().filter((timestamp) => now - timestamp < ATTEMPT_WINDOW_MS)
  return recent.length >= MAX_ATTEMPTS
}

export default function CreateSite() {
  const navigate = useNavigate()
  const { createAccount, state } = useOnboarding()
  const [fullName, setFullName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [consent, setConsent] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const hasAccount = Boolean(state.account)

  React.useEffect(() => {
    if (hasAccount) {
      navigate('/onboarding/choose-role', { replace: true })
    }
  }, [hasAccount, navigate])

  if (hasAccount) return null

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (attemptsExceeded()) {
      setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.')
      return
    }

    setLoading(true)
    try {
      await createAccount({
        fullName,
        email,
        password,
        consent,
        authMethod: 'email',
      })
      recordAttempt()
      navigate('/onboarding/choose-role')
    } catch (err) {
      recordAttempt()
      if (err instanceof OnboardingError) {
        setError(err.message)
      } else {
        setError('Não foi possível criar sua conta agora. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Create your site with Stella</span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Crie sua conta para começar</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Em poucos passos você desbloqueia o construtor de sites e publica seu portfólio na nossa vitrine.
            Precisamos confirmar seus dados e licença profissional antes do lançamento.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-12 lg:grid-cols-[2fr,3fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Como funciona</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Este fluxo cria sua conta Stella, valida o tipo de operação e prepara o ambiente para o seu site.
                  </p>
                </div>
                <ol className="space-y-4 text-sm text-slate-600">
                  <li>
                    <span className="font-semibold text-slate-900">1. Identidade</span>
                    <p className="mt-1 text-slate-500">Confirme nome e e-mail para criarmos suas credenciais de acesso.</p>
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">2. Licença profissional</span>
                    <p className="mt-1 text-slate-500">Informe CRECI ou convide sua imobiliária para liberar o construtor.</p>
                  </li>
                  <li>
                    <span className="font-semibold text-slate-900">3. Nome do site</span>
                    <p className="mt-1 text-slate-500">Escolha o nome público e o slug que será usado no endereço temporário.</p>
                  </li>
                </ol>
                <div className="rounded-2xl bg-slate-900 text-white p-6 space-y-3">
                  <h3 className="text-base font-semibold">Precisa testar antes?</h3>
                  <p className="text-sm text-white/80">
                    Fale com o time Stella para uma demonstração guiada do construtor e das ferramentas da plataforma.
                  </p>
                  <Link
                    to="/contato"
                    className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition"
                  >
                    Agendar conversa
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
              <form className="space-y-6" onSubmit={onSubmit} noValidate>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Passo 1 de 4</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Vamos começar com seus dados</h2>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Nome completo
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    autoComplete="name"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    placeholder="Como deseja aparecer no site"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  E-mail profissional
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    placeholder="voce@suamarca.com"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Senha
                    <div className="mt-2 relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                  </label>
                  <p className="mt-2 text-xs text-slate-500">
                    Use pelo menos 8 caracteres com letras e números. Você pode ativar login social depois.
                  </p>
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/50"
                  />
                  <span>
                    Concordo com a&nbsp;
                    <Link to="/privacidade" className="text-brand-600 hover:underline">Política de Privacidade</Link>
                    &nbsp;e os&nbsp;
                    <Link to="/juridico" className="text-brand-600 hover:underline">Termos de Uso</Link>
                    &nbsp;da Stella.
                  </span>
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
                  {loading ? 'Criando conta...' : 'Criar conta e continuar'}
                </button>

                <p className="text-sm text-slate-500">
                  Já tem conta?{' '}
                  <Link to="/admin/login" className="font-semibold text-brand-600 hover:underline">
                    Entre com suas credenciais
                  </Link>
                  .
                </p>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
