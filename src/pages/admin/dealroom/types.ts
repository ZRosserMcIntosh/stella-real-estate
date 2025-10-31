export type TransactionType = 'venda' | 'locacao' | 'temporada'

export type TimeRange = '7d' | '30d' | '90d' | 'qtd' | 'ytd' | '12m'

export interface DealRoomFilters {
  state?: string
  city?: string
  neighborhood?: string
  transaction?: TransactionType | 'all'
  stage?: string
  priceBand?: string
  propertyType?: string
  sourceChannel?: string
  agentId?: string
  teamId?: string
  timeRange?: TimeRange
}

export interface KpiTileData {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  alert?: 'ok' | 'warn' | 'error'
  tooltip?: string
}
