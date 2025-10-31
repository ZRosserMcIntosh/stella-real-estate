import React, { useState } from 'react'
import type { DealRoomFilters, KpiTileData } from './dealroom/types'

// Tooltip component for KPI explanations
const Tooltip = ({ text }: { text: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 transition-colors"
        title={text}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 005.747 15H5a.75.75 0 000 1.5h.75a3.25 3.25 0 003.102-2.331l.459-2.066a1.25 1.25 0 001.21-1.52A1.75 1.75 0 009.75 9H9z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-64 p-3 text-sm text-slate-700 bg-white rounded-lg border border-slate-200 shadow-lg">
          <p className="leading-relaxed">{text}</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

const Tile = ({ label, value, sub, tooltip }: KpiTileData) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-wide text-slate-500 flex-1">{label}</div>
      {tooltip && <Tooltip text={tooltip} />}
    </div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
)

export default function DealRoom() {
  const [filters, setFilters] = useState<DealRoomFilters>({ transaction: 'all', timeRange: '30d' })

  const headline: KpiTileData[] = [
    { 
      label: 'TCLV · Venda', 
      value: 'R$ 12.3M',
      tooltip: 'Total Closed Loan Value for Sales transactions. Represents the total value of all properties sold during this period.'
    },
    { 
      label: 'TCLV · Locação (annualizado)', 
      value: 'R$ 4.7M',
      tooltip: 'Total Closed Loan Value for Rentals, annualized. Annual projection of rental income from closed deals.'
    },
    { 
      label: 'TCLV · Temporada', 
      value: 'R$ 1.2M',
      tooltip: 'Total Closed Loan Value for Seasonal rentals. Value generated from short-term vacation rental deals.'
    },
    { 
      label: 'Ativos · Venda', 
      value: 24,
      tooltip: 'Active listings for sale. Number of properties currently listed and available for purchase.'
    },
    { 
      label: 'Ativos · Locação', 
      value: 17,
      tooltip: 'Active listings for long-term rental. Number of properties currently available for lease.'
    },
    { 
      label: 'Ativos · Temporada', 
      value: 9,
      tooltip: 'Active vacation rental listings. Number of properties currently available for short-term seasonal rentals.'
    },
    { 
      label: 'Under Contract', 
      value: '6 (R$ 8.1M)',
      tooltip: 'Properties under contract/pending sale. Deals in progress that are expected to close soon. Number shows both count and total value.'
    },
    { 
      label: 'Fechados (MTD)', 
      value: '3 · R$ 2.4M',
      tooltip: 'Closed deals this month (Month-to-Date). Shows both number of deals closed and their total value in the current month.'
    },
  ]

  // Additional KPIs for expanded dashboard
  const additionalKpis: KpiTileData[] = [
    {
      label: 'Taxa de Conversão',
      value: '18.5%',
      sub: '↑ 2.3% vs. mês anterior',
      tooltip: 'Percentage of leads that convert to closed deals. Higher is better. Compare month-over-month trends.'
    },
    {
      label: 'Dias Médios em Mercado',
      value: '45 dias',
      sub: '↓ 5 dias vs. 90d avg',
      tooltip: 'Average number of days a property stays listed before selling. Lower is better, indicates faster sales.'
    },
    {
      label: 'Preço Médio/m²',
      value: 'R$ 8,450',
      sub: 'Venda | Market Index: 100',
      tooltip: 'Average price per square meter for sales. Use Market Index to compare against regional benchmarks.'
    },
    {
      label: 'Crescimento YoY',
      value: '+12.4%',
      sub: 'vs. período do ano anterior',
      tooltip: 'Year-over-Year growth comparing current period to the same period last year.'
    },
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

      {/* Row 1b: Additional KPIs & Metrics */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalKpis.map((t, i) => <Tile key={`additional-${i}`} {...t} />)}
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

