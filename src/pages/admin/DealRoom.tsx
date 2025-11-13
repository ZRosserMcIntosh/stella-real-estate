import React, { useState, useEffect } from 'react'
import type { DealRoomFilters, KpiTileData } from './dealroom/types'
import { fetchDashboardStats, formatCurrency, type DashboardStats } from './dealroom/statsService'

const Tooltip = ({ text }: { text: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-slate-300 transition-colors"
        title={text}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 005.747 15H5a.75.75 0 000 1.5h.75a3.25 3.25 0 003.102-2.331l.459-2.066a1.25 1.25 0 001.21-1.52A1.75 1.75 0 009.75 9H9z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 right-0 mt-2 w-64 p-3 text-sm text-slate-300 bg-slate-800/95 backdrop-blur-lg rounded-lg border border-slate-700/60 shadow-2xl shadow-slate-950/50">
          <p className="leading-relaxed">{text}</p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="mt-2 text-xs text-slate-500 hover:text-slate-400 underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

const WarningIndicator = ({ explanation }: { explanation: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 text-amber-500 hover:text-amber-400 transition-colors"
        title="Data not available"
      >
        ⚠️
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 right-0 mt-2 w-72 p-4 text-sm text-slate-200 bg-slate-800/98 backdrop-blur-lg rounded-lg border border-amber-500/30 shadow-2xl shadow-slate-950/50">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <h4 className="font-semibold text-amber-400">Data Not Available</h4>
            </div>
            <p className="leading-relaxed text-slate-300">{explanation}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-3 text-xs text-slate-500 hover:text-slate-400 underline"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  )
}

interface TileProps extends KpiTileData {
  warning?: string
}

const Tile = ({ label, value, sub, tooltip, warning }: TileProps) => (
  <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
    <div className="flex items-center justify-between">
      <div className="text-xs uppercase tracking-wide text-slate-400 flex-1 flex items-center">
        {label}
        {warning && <WarningIndicator explanation={warning} />}
      </div>
      {tooltip && <Tooltip text={tooltip} />}
    </div>
    <div className="mt-2 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">{value}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
  </div>
)

export default function DealRoom() {
  const [filters, setFilters] = useState<DealRoomFilters>({ transaction: 'all', timeRange: '30d' })
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    async function loadStats() {
      try {
        setLoading(true)
        const data = await fetchDashboardStats()
        if (mounted) {
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadStats()
    return () => { mounted = false }
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading statistics...</div>
      </div>
    )
  }

  const headline: TileProps[] = [
    { 
      label: 'TCLV · Venda', 
      value: stats.totalSalesValue ? formatCurrency(stats.totalSalesValue, true) : 'R$ 0',
      tooltip: 'Total Closed Loan Value for Sales transactions. Represents the total value of all properties sold during this period.',
      warning: !stats.dataAvailable.sales ? 'No sales data available. Add listings with type "for_sale" and status "published" to see this metric.' : undefined
    },
    { 
      label: 'TCLV · Locação (annualizado)', 
      value: stats.totalRentalValueAnnualized ? formatCurrency(stats.totalRentalValueAnnualized, true) : 'R$ 0',
      tooltip: 'Total Closed Loan Value for Rentals, annualized. Annual projection of rental income from closed deals.',
      warning: !stats.dataAvailable.rentals ? 'No rental data available. Add listings with type "for_rent" and status "published" to see this metric.' : undefined
    },
    { 
      label: 'TCLV · Temporada', 
      value: stats.totalSeasonalValue ? formatCurrency(stats.totalSeasonalValue, true) : 'R$ 0',
      tooltip: 'Total Closed Loan Value for Seasonal rentals. Value generated from short-term vacation rental deals.',
      warning: 'Seasonal booking data not yet available. Requires integration with booking system to track seasonal rental revenue.'
    },
    { 
      label: 'Ativos · Venda', 
      value: stats.activeForSale ?? 0,
      tooltip: 'Active listings for sale. Number of properties currently listed and available for purchase.',
      warning: !stats.dataAvailable.sales ? 'No active sale listings found. Publish listings with type "for_sale" to see this count.' : undefined
    },
    { 
      label: 'Ativos · Locação', 
      value: stats.activeForRent ?? 0,
      tooltip: 'Active listings for long-term rental. Number of properties currently available for lease.',
      warning: !stats.dataAvailable.rentals ? 'No active rental listings found. Publish listings with type "for_rent" to see this count.' : undefined
    },
    { 
      label: 'Ativos · Temporada', 
      value: stats.activeSeasonal ?? 0,
      tooltip: 'Active vacation rental listings. Number of properties currently available for short-term seasonal rentals.',
      warning: !stats.dataAvailable.seasonal ? 'No seasonal listings found. Add listings with usage_type "vacation_rental" to track seasonal inventory.' : undefined
    },
    { 
      label: 'Under Contract', 
      value: stats.underContractCount ? `${stats.underContractCount} (${formatCurrency(stats.underContractValue, true)})` : '0',
      tooltip: 'Properties under contract/pending sale. Deals in progress that are expected to close soon. Number shows both count and total value.',
      warning: !stats.dataAvailable.underContract ? 'No properties under contract. Update listing status to "under_contract" or "pending" to track pipeline.' : undefined
    },
    { 
      label: 'Fechados (MTD)', 
      value: stats.closedThisMonthCount ? `${stats.closedThisMonthCount} · ${formatCurrency(stats.closedThisMonthValue, true)}` : '0',
      tooltip: 'Closed deals this month (Month-to-Date). Shows both number of deals closed and their total value in the current month.',
      warning: !stats.dataAvailable.closedMTD ? 'No deals closed this month. Update listing status to "sold" or "rented" when deals close.' : undefined
    },
  ]

  // Additional KPIs for expanded dashboard
  const additionalKpis: TileProps[] = [
    {
      label: 'Taxa de Conversão',
      value: stats.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : 'N/A',
      sub: stats.conversionRate ? '↑ 2.3% vs. mês anterior' : undefined,
      tooltip: 'Percentage of leads that convert to closed deals. Higher is better. Compare month-over-month trends.',
      warning: 'Conversion rate tracking requires CRM integration. Implement lead tracking to calculate this metric from inquiry to closed deal.'
    },
    {
      label: 'Dias Médios em Mercado',
      value: stats.avgDaysOnMarket ? `${Math.round(stats.avgDaysOnMarket)} dias` : 'N/A',
      sub: stats.avgDaysOnMarket ? '↓ 5 dias vs. 90d avg' : undefined,
      tooltip: 'Average number of days a property stays listed before selling. Lower is better, indicates faster sales.',
      warning: 'Days on market calculation requires listing_date tracking. Add a "listed_date" field to listings table to calculate this metric.'
    },
    {
      label: 'Preço Médio/m²',
      value: stats.avgPricePerSqm ? formatCurrency(stats.avgPricePerSqm).replace('R$', 'R$ ') : 'N/A',
      sub: stats.avgPricePerSqm ? 'Venda | Market Index: 100' : undefined,
      tooltip: 'Average price per square meter for sales. Use Market Index to compare against regional benchmarks.',
      warning: !stats.dataAvailable.pricePerSqm ? 'Price per sqm requires listings with both price and area fields populated.' : undefined
    },
    {
      label: 'Crescimento YoY',
      value: stats.yoyGrowth ? `${stats.yoyGrowth > 0 ? '+' : ''}${stats.yoyGrowth.toFixed(1)}%` : 'N/A',
      sub: stats.yoyGrowth ? 'vs. período do ano anterior' : undefined,
      tooltip: 'Year-over-Year growth comparing current period to the same period last year.',
      warning: 'YoY growth requires historical data. System needs at least 12 months of data to calculate year-over-year comparisons.'
    },
  ]

  return (
    <div className="space-y-8">
      {/* Filters */}
      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 shadow-lg shadow-slate-950/20">
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
            placeholder="State"
          />
          <input
            className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
            placeholder="City"
          />
          <input
            className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
            placeholder="Neighborhood"
          />
          <select
            className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
            value={filters.transaction}
                  onChange={e=>setFilters(f=>({ ...f, transaction: e.target.value as any }))}>
            <option value="all">All Transactions</option>
            <option value="venda">Venda</option>
            <option value="locacao">Locação</option>
            <option value="temporada">Temporada</option>
          </select>
          <select
            className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
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
            className="w-full h-10 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 text-sm text-slate-100 placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/60 transition-all"
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
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 lg:col-span-2 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Pipeline por estágio</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Forecast 30/60/90</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
      </section>

      {/* Row 3: Funnel + Time-in-Stage */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Conversão (funil)</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 lg:col-span-2 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Tempo em estágio (heatmap)</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
      </section>

      {/* Row 4: Listing Health */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 lg:col-span-2 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">DOM distribuição</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Canais · ROI mini-cards</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
      </section>

      {/* Row 5: Leaderboard + Risks */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 lg:col-span-2 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Leaderboard (agentes/equipes)</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 hover:border-slate-600/80 hover:from-slate-800 hover:to-slate-900/60 transition-all shadow-lg shadow-slate-950/20">
          <div className="font-medium text-slate-100">Riscos & exceções</div>
          <div className="mt-3 h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/40" />
        </div>
      </section>
    </div>
  )
}

