import React from 'react'

type TemplateStatus = 'published' | 'beta' | 'draft'

type TemplateRecord = {
  id: string
  name: string
  persona: 'realtor' | 'brokerage' | 'developer'
  pages: number
  version: string
  status: TemplateStatus
  defaultTheme: string
  updatedAt: string
  tags: string[]
}

const seedTemplates: TemplateRecord[] = [
  {
    id: 'luxury-glow',
    name: 'Luxury Glow',
    persona: 'realtor',
    pages: 5,
    version: '1.3.0',
    status: 'published',
    defaultTheme: 'Aurora',
    updatedAt: '2024-10-28',
    tags: ['Hero skyline', 'Stats marquee', 'Floating form'],
  },
  {
    id: 'urban-brokerage',
    name: 'Urban Brokerage',
    persona: 'brokerage',
    pages: 7,
    version: '0.9.2',
    status: 'beta',
    defaultTheme: 'Metropolitan',
    updatedAt: '2024-11-02',
    tags: ['Hub navigation', 'Deal room', 'Recruiting CTA'],
  },
  {
    id: 'developer-nimbus',
    name: 'Nimbus Launchpad',
    persona: 'developer',
    pages: 6,
    version: '0.6.5',
    status: 'draft',
    defaultTheme: 'Nebula',
    updatedAt: '2024-11-08',
    tags: ['Project grid', 'Financial metrics', 'Launch timeline'],
  },
]

const personaLabels: Record<TemplateRecord['persona'], string> = {
  realtor: 'Corretor(a) individual',
  brokerage: 'Imobiliária',
  developer: 'Incorporadora',
}

const statusTone: Record<TemplateStatus, string> = {
  published: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
  beta: 'bg-amber-500/20 text-amber-200 border border-amber-500/40',
  draft: 'bg-slate-500/20 text-slate-200 border border-slate-500/40',
}

const statusLabel: Record<TemplateStatus, string> = {
  published: 'Disponível',
  beta: 'Beta interno',
  draft: 'Rascunho',
}

const createId = () => `tpl_${Math.random().toString(36).slice(2, 8)}`

export default function Templates() {
  const [templates, setTemplates] = React.useState<TemplateRecord[]>(seedTemplates)
  const [name, setName] = React.useState('')
  const [persona, setPersona] = React.useState<TemplateRecord['persona']>('realtor')
  const [pages, setPages] = React.useState(5)
  const [theme, setTheme] = React.useState('Nova')
  const [signatureModules, setSignatureModules] = React.useState('')
  const [status, setStatus] = React.useState<TemplateStatus>('draft')
  const [message, setMessage] = React.useState<string | null>(null)

  const publishedCount = React.useMemo(() => templates.filter((tpl) => tpl.status === 'published').length, [templates])
  const betaCount = React.useMemo(() => templates.filter((tpl) => tpl.status === 'beta').length, [templates])
  const draftCount = React.useMemo(() => templates.filter((tpl) => tpl.status === 'draft').length, [templates])

  const clearForm = () => {
    setName('')
    setPersona('realtor')
    setPages(5)
    setTheme('Nova')
    setSignatureModules('')
    setStatus('draft')
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setMessage('Dê um nome ao template antes de salvar.')
      return
    }
    const tags = signatureModules
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    const record: TemplateRecord = {
      id: createId(),
      name: name.trim(),
      persona,
      pages,
      version: '0.1.0',
      status,
      defaultTheme: theme,
      updatedAt: new Date().toISOString().slice(0, 10),
      tags,
    }
    setTemplates((prev) => [record, ...prev])
    setMessage('Template adicionado à fila de revisão. Versionamento automático preparado.')
    clearForm()
    window.setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="space-y-6 text-slate-200">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Disponíveis</p>
          <p className="mt-2 text-2xl font-semibold text-white">{publishedCount}</p>
          <p className="mt-1 text-xs text-slate-400">Templates ativos no construtor</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Beta interno</p>
          <p className="mt-2 text-2xl font-semibold text-white">{betaCount}</p>
          <p className="mt-1 text-xs text-slate-400">Liberados para parceiros</p>
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/60 p-4 shadow-lg shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Rascunhos</p>
          <p className="mt-2 text-2xl font-semibold text-white">{draftCount}</p>
          <p className="mt-1 text-xs text-slate-400">Aguardando QA visual</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Biblioteca de templates</h2>
            <p className="text-sm text-slate-400">
              Versões disponíveis para duplicar e servir como base durante o onboarding dos agentes.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Deploy automatizado via Vercel Edge
          </div>
        </header>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700/60">
          <table className="min-w-full divide-y divide-slate-700/80 text-sm">
            <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Template</th>
                <th className="px-4 py-3 text-left">Persona</th>
                <th className="px-4 py-3 text-left">Páginas</th>
                <th className="px-4 py-3 text-left">Tema</th>
                <th className="px-4 py-3 text-left">Tags chave</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {templates.map((template) => (
                <tr key={template.id} className="hover:bg-slate-800/80 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">
                    {template.name}
                    <div className="text-xs text-slate-400">v{template.version}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{personaLabels[template.persona]}</td>
                  <td className="px-4 py-3 text-slate-300">{template.pages}</td>
                  <td className="px-4 py-3 text-slate-300">{template.defaultTheme}</td>
                  <td className="px-4 py-3 text-slate-400">
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-900/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${statusTone[template.status]}`}>
                      {statusLabel[template.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{template.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
        <h2 className="text-xl font-semibold text-white">Propor novo template</h2>
        <p className="mt-1 text-sm text-slate-400">
          Preencha os módulos principais. O design system renderiza a prévia automaticamente no ambiente de QA.
        </p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Nome interno
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Skyline Focus"
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Persona
            <select
              value={persona}
              onChange={(event) => setPersona(event.target.value as TemplateRecord['persona'])}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              <option value="realtor">Corretor(a)</option>
              <option value="brokerage">Imobiliária</option>
              <option value="developer">Incorporadora</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Páginas
            <input
              type="number"
              min={1}
              max={12}
              value={pages}
              onChange={(event) => setPages(Number(event.target.value))}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Tema base
            <input
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              placeholder="Aurora, Nebula..."
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
          <label className="sm:col-span-2 flex flex-col gap-2 text-sm text-slate-200">
            Módulos assinatura (separados por vírgula)
            <input
              value={signatureModules}
              onChange={(event) => setSignatureModules(event.target.value)}
              placeholder="Hero Skyline, Timeline de lançamento, Form Multi-step"
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Status inicial
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TemplateStatus)}
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              <option value="draft">Rascunho</option>
              <option value="beta">Beta</option>
              <option value="published">Disponível</option>
            </select>
          </label>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600"
            >
              Enfileirar template
            </button>
            {message && <span className="text-xs text-slate-300">{message}</span>}
          </div>
        </form>
      </section>
    </div>
  )
}
