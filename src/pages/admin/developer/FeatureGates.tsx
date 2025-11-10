import React from 'react'

type GateStatus = 'internal' | 'beta' | 'ga'

type FeatureFlag = {
  id: string
  name: string
  description: string
  owner: string
  status: GateStatus
  segments: Array<{ label: string; audience: string; enabled: boolean }>
  lastUpdated: string
  nextReview: string
}

const statusLabel: Record<GateStatus, string> = {
  internal: 'Somente equipe Stella',
  beta: 'Beta fechado',
  ga: 'Liberado para todos',
}

const statusTone: Record<GateStatus, string> = {
  internal: 'bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-400/40',
  beta: 'bg-amber-500/20 text-amber-200 border border-amber-500/40',
  ga: 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40',
}

const seedFlags: FeatureFlag[] = [
  {
    id: 'ballet',
    name: 'Ballet Workflow Automations',
    description: 'Quadros de tarefas com automações, SLAs e integração com Constellation.',
    owner: 'Workflow guild',
    status: 'internal',
    segments: [
      { label: 'Equipe Stella', audience: 'Engenharia / Produto', enabled: true },
      { label: 'Agentes beta', audience: 'Tenant interno (São Paulo)', enabled: false },
      { label: 'Todos os tenants', audience: 'Liberação geral', enabled: false },
    ],
    lastUpdated: '2024-11-04',
    nextReview: '2024-11-15',
  },
  {
    id: 'listing-qa',
    name: 'QA Automático de Listings',
    description: 'Checklist obrigatório antes de publicar no marketplace.',
    owner: 'Listings team',
    status: 'beta',
    segments: [
      { label: 'Equipe Stella', audience: 'Engenharia / Produto', enabled: true },
      { label: 'Agentes beta', audience: 'Tenant interno (São Paulo)', enabled: true },
      { label: 'Todos os tenants', audience: 'Liberação geral', enabled: false },
    ],
    lastUpdated: '2024-10-30',
    nextReview: '2024-11-18',
  },
  {
    id: 'theme-builder',
    name: 'Editor de temas avançado',
    description: 'Permite criar variações de tipografia, cores e efeitos.',
    owner: 'Site Builder squad',
    status: 'ga',
    segments: [
      { label: 'Equipe Stella', audience: 'Engenharia / Produto', enabled: true },
      { label: 'Agentes beta', audience: 'Tenant interno (São Paulo)', enabled: true },
      { label: 'Todos os tenants', audience: 'Liberação geral', enabled: true },
    ],
    lastUpdated: '2024-10-12',
    nextReview: '2024-12-01',
  },
]

const gateOptions: Array<{ value: GateStatus; label: string }> = [
  { value: 'internal', label: 'Interno' },
  { value: 'beta', label: 'Beta fechado' },
  { value: 'ga', label: 'GA' },
]

export default function FeatureGates() {
  const [flags, setFlags] = React.useState(seedFlags)
  const [notes, setNotes] = React.useState<Record<string, string>>({})
  const [toast, setToast] = React.useState<string | null>(null)

  const handleStatusChange = (featureId: string, status: GateStatus) => {
    setFlags((prev) =>
      prev.map((flag) => (flag.id === featureId ? { ...flag, status } : flag)),
    )
    setToast('Status atualizado. Documente a decisão no changelog.')
    window.setTimeout(() => setToast(null), 2500)
  }

  const toggleSegment = (featureId: string, index: number) => {
    setFlags((prev) =>
      prev.map((flag) => {
        if (flag.id !== featureId) return flag
        const segments = flag.segments.map((segment, idx) =>
          idx === index ? { ...segment, enabled: !segment.enabled } : segment,
        )
        return { ...flag, segments }
      }),
    )
  }

  const handleNoteSubmit = (event: React.FormEvent, featureId: string) => {
    event.preventDefault()
    const message = notes[featureId]
    if (!message?.trim()) return
    console.info('Feature gate note', { featureId, message })
    setNotes((prev) => ({ ...prev, [featureId]: '' }))
    setToast('Nota registrada para este feature gate.')
    window.setTimeout(() => setToast(null), 2500)
  }

  const internalOnly = flags.filter((flag) => flag.status === 'internal').length
  const betaRollouts = flags.filter((flag) => flag.status === 'beta').length
  const generalAvail = flags.filter((flag) => flag.status === 'ga').length

  return (
    <div className="space-y-6 text-slate-200">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Interno</p>
          <p className="mt-2 text-2xl font-semibold text-white">{internalOnly}</p>
          <p className="mt-1 text-xs text-slate-400">Somente time Stella</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Beta fechado</p>
          <p className="mt-2 text-2xl font-semibold text-white">{betaRollouts}</p>
          <p className="mt-1 text-xs text-slate-400">Rolando com parceiros selecionados</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">GA</p>
          <p className="mt-2 text-2xl font-semibold text-white">{generalAvail}</p>
          <p className="mt-1 text-xs text-slate-400">Disponível para todos os tenants</p>
        </div>
      </section>

      {toast && (
        <div className="rounded-2xl border border-brand-500/40 bg-brand-500/20 px-4 py-3 text-sm text-brand-100">
          {toast}
        </div>
      )}

      <section className="space-y-4">
        {flags.map((flag) => (
          <article key={flag.id} className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{flag.name}</h2>
                <p className="text-sm text-slate-400">{flag.description}</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Squad owner: {flag.owner}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusTone[flag.status]}`}>
                  {statusLabel[flag.status]}
                </span>
                <select
                  value={flag.status}
                  onChange={(event) => handleStatusChange(flag.id, event.target.value as GateStatus)}
                  className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                >
                  {gateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {flag.segments.map((segment, index) => (
                <button
                  key={segment.label}
                  type="button"
                  onClick={() => toggleSegment(flag.id, index)}
                  className={`flex h-full flex-col justify-between rounded-2xl border px-4 py-4 text-left text-sm transition ${
                    segment.enabled
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200 shadow-md shadow-emerald-500/20'
                      : 'border-slate-700/60 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-100">{segment.label}</p>
                    <p className="mt-1 text-xs text-slate-400">{segment.audience}</p>
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-wide">
                    {segment.enabled ? 'Ativo' : 'Desligado'}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-4 text-xs text-slate-300">
                <p>
                  Última atualização: <span className="font-semibold text-white">{flag.lastUpdated}</span>
                </p>
                <p className="mt-1">
                  Próxima revisão: <span className="font-semibold text-white">{flag.nextReview}</span>
                </p>
              </div>
              <form className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-4 py-4 text-sm text-slate-300" onSubmit={(event) => handleNoteSubmit(event, flag.id)}>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-wide text-slate-400">
                  Registrar nota de rollout
                  <textarea
                    rows={2}
                    value={notes[flag.id] ?? ''}
                    onChange={(event) => setNotes((prev) => ({ ...prev, [flag.id]: event.target.value }))}
                    placeholder="Ex.: Bloquear acesso ao Ballet para tenants sem CRECI verificado."
                    className="rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-3 inline-flex items-center rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
                >
                  Salvar nota
                </button>
              </form>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
        <h2 className="text-lg font-semibold text-white">Plano de rollout das próximas 2 semanas</h2>
        <ol className="mt-3 space-y-3 text-sm text-slate-300 list-decimal list-inside">
          <li>
            <span className="font-semibold text-white">15 Nov</span> · Liberar Ballet para 3 tenants pilotos com CRECI verificado.
          </li>
          <li>
            <span className="font-semibold text-white">20 Nov</span> · QA automatizado obrigatório para listings de venda.
          </li>
          <li>
            <span className="font-semibold text-white">22 Nov</span> · Tema Nebula disponível como template padrão para incorporadoras.
          </li>
        </ol>
      </section>
    </div>
  )
}
