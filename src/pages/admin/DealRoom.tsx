import React, { useState } from 'react'
import type { DealRoomFilters, KpiTileData } from './dealroom/types'

const Tile = ({ label, value, sub }: KpiTileData) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
)

export default function DealRoom() {
  const [filters, setFilters] = useState<DealRoomFilters>({ transaction: 'all', timeRange: '30d' })

  const headline: KpiTileData[] = [
    { label: 'TCLV · Venda', value: 'R$ 12.3M' },
    { label: 'TCLV · Locação (annualizado)', value: 'R$ 4.7M' },
    { label: 'TCLV · Temporada', value: 'R$ 1.2M' },
    { label: 'Ativos · Venda', value: 24 },
    { label: 'Ativos · Locação', value: 17 },
    { label: 'Ativos · Temporada', value: 9 },
    { label: 'Under Contract', value: '6 (R$ 8.1M)' },
    { label: 'Fechados (MTD)', value: '3 · R$ 2.4M' },
  ]

  return (
    <div className="space-y-8">
      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-white dark:text-slate-900 dark:placeholder-slate-400 dark:border-slate-200"
            placeholder="State"
          />
          <input
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-white dark:text-slate-900 dark:placeholder-slate-400 dark:border-slate-200"
            placeholder="City"
          />
          <input
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-white dark:text-slate-900 dark:placeholder-slate-400 dark:border-slate-200"
            placeholder="Neighborhood"
          />
          <select
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-white dark:text-slate-900 dark:border-slate-200"
            value={filters.transaction}
                  onChange={e=>setFilters(f=>({ ...f, transaction: e.target.value as any }))}>
            <option value="all">All Transactions</option>
            <option value="venda">Venda</option>
            <option value="locacao">Locação</option>
            <option value="temporada">Temporada</option>
          </select>
          <select
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-white dark:text-slate-900 dark:border-slate-200"
            value={filters.timeRange}
                  onChange={e=>setFilters(f=>({ ...f, timeRange: e.target.value as any }))}>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
            <option value="90d">Last 90d</option>
            <option value="qtd">QTD</option>
            <option value="ytd">YTD</option>
            <option value="12m">12 months</option>
          </select>
          <input
            className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:bg-white dark:text-slate-900 dark:placeholder-slate-400 dark:border-slate-200"
            placeholder="Agent / Team"
          />
        </div>
      </section>

      {/* Row 1: Headline tiles */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {headline.map((t, i) => <Tile key={i} {...t} />)}
      </section>

      {/* Row 2: Pipeline + Forecast */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="font-medium">Pipeline por estágio</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="font-medium">Forecast 30/60/90</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
      </section>

      {/* Row 3: Funnel + Time-in-Stage */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="font-medium">Conversão (funil)</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="font-medium">Tempo em estágio (heatmap)</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
      </section>

      {/* Row 4: Listing Health */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="font-medium">DOM distribuição</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="font-medium">Canais · ROI mini-cards</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
      </section>

      {/* Row 5: Leaderboard + Risks */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="font-medium">Leaderboard (agentes/equipes)</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="font-medium">Riscos & exceções</div>
          <div className="mt-3 h-40 bg-slate-50 rounded-xl" />
        </div>
      </section>
    </div>
  )
}

