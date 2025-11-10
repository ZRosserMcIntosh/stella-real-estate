import React from 'react'
import { Link } from 'react-router-dom'
import StellaSiteBuilder from '../../components/StellaSiteBuilder'
import { useOnboarding } from '../../context/OnboardingContext'
import type { UserRole } from '../../types/onboarding'

const lockConfigs: Record<UserRole, { heading: string; body: string; route: string; cta: string }> = {
  realtor: {
    heading: 'Adicione seu CRECI para continuar',
    body: 'Precisamos do CRECI individual para liberar todas as ferramentas do construtor e a publicação de listings.',
    route: '/onboarding/realtor-license',
    cta: 'Adicionar CRECI',
  },
  brokerage: {
    heading: 'Informe o CRECI Jurídico',
    body: 'Valide o CRECI da imobiliária e o corretor responsável para habilitar o construtor completo.',
    route: '/onboarding/brokerage-license',
    cta: 'Validar licença',
  },
  developer: {
    heading: 'Vincule um corretor responsável',
    body: 'Sem um corretor ou imobiliária parceira suas publicações ficam em modo rascunho.',
    route: '/onboarding/developer-broker-link',
    cta: 'Vincular agora',
  },
  employee: {
    heading: 'Confirme o convite da sua imobiliária',
    body: 'Use o código enviado pelo administrador para acessar o construtor.',
    route: '/onboarding/employee-code',
    cta: 'Validar convite',
  },
}

export default function WebsiteBuilder() {
  const { builderGate, state } = useOnboarding()
  const role = state.role
  const tenant = state.tenant

  if (!role) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-lg shadow-slate-900/10">
        <h1 className="text-2xl font-semibold text-slate-900">Ative o construtor com sua conta Stella</h1>
        <p className="mt-3 text-sm text-slate-600">
          Crie sua conta e conclua o onboarding para desenhar seu site com o builder da Stella.
        </p>
        <Link
          to="/criar-site"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700"
        >
          Começar agora
        </Link>
      </div>
    )
  }

  if (builderGate.mode === 'locked') {
    const config = lockConfigs[role]
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-lg shadow-slate-900/10">
        <h1 className="text-2xl font-semibold text-slate-900">{config.heading}</h1>
        <p className="mt-3 text-sm text-slate-600">{builderGate.reason ?? config.body}</p>
        <Link
          to={config.route}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700"
        >
          {config.cta}
        </Link>
      </div>
    )
  }

  if (!tenant && role !== 'employee') {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-lg shadow-slate-900/10">
        <h1 className="text-2xl font-semibold text-slate-900">Crie o site base para usar o builder</h1>
        <p className="mt-3 text-sm text-slate-600">
          Escolha o nome e o endereço temporário do seu site antes de personalizar componentes.
        </p>
        <Link
          to="/onboarding/site-setup"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700"
        >
          Configurar site
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tenant && (
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Site ativo</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">{tenant.name}</h2>
              <p className="mt-1 text-xs text-slate-500">Slug: {tenant.slug}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={tenant.defaultRoute}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-brand-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-600 hover:bg-brand-50"
              >
                Abrir endereço temporário
              </a>
              <a
                href={tenant.pathFallback ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 hover:bg-slate-100"
              >
                Ver fallback /t/{tenant.slug}
              </a>
            </div>
          </div>
        </section>
      )}

      {builderGate.mode === 'limited' && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          <p>{builderGate.reason ?? 'O construtor está em modo leitura até concluirmos a verificação.'}</p>
          {role === 'developer' && (
            <Link
              to="/onboarding/developer-broker-link"
              className="mt-3 inline-flex items-center rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 hover:bg-amber-100"
            >
              Atualizar vínculo agora
            </Link>
          )}
        </div>
      )}

      {!tenant && role === 'employee' && (
        <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 text-sm text-slate-600">
          <p>
            O site principal ainda não está conectado a esta conta. Avise o administrador para concluir a configuração ou selecione
            outro tenant.
          </p>
        </div>
      )}

      <StellaSiteBuilder />
    </div>
  )
}
