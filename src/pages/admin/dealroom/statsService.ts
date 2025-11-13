import { supabase } from '../../../lib/supabaseClient'

export interface DashboardStats {
  // Sales metrics
  totalSalesValue: number | null
  totalRentalValueAnnualized: number | null
  totalSeasonalValue: number | null
  
  // Active listings count
  activeForSale: number | null
  activeForRent: number | null
  activeSeasonal: number | null
  
  // Under contract
  underContractCount: number | null
  underContractValue: number | null
  
  // Closed this month
  closedThisMonthCount: number | null
  closedThisMonthValue: number | null
  
  // Additional metrics
  conversionRate: number | null
  avgDaysOnMarket: number | null
  avgPricePerSqm: number | null
  yoyGrowth: number | null
  
  // Indicators for which stats have data
  dataAvailable: {
    sales: boolean
    rentals: boolean
    seasonal: boolean
    underContract: boolean
    closedMTD: boolean
    conversion: boolean
    daysOnMarket: boolean
    pricePerSqm: boolean
    yoyGrowth: boolean
  }
}

/**
 * Fetches real statistics from the database for the admin dashboard
 * Returns null for stats that don't have data yet (will show ⚠️ indicator)
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    // Fetch all listings
    const { data: allListings, error: listingsError } = await supabase
      .from('listings')
      .select('*')
    
    if (listingsError) {
      console.error('Error fetching listings:', listingsError)
      return getEmptyStats()
    }

    const listings = allListings || []

    // Calculate active listings by type
    const activeForSale = listings.filter(
      (l) => l.listing_type === 'for_sale' && l.status === 'published'
    ).length

    const activeForRent = listings.filter(
      (l) => l.listing_type === 'for_rent' && l.status === 'published'
    ).length

    const activeSeasonal = listings.filter(
      (l) => l.listing_type === 'for_rent' && l.usage_type === 'vacation_rental' && l.status === 'published'
    ).length

    // Calculate total value of sales listings
    const totalSalesValue = listings
      .filter((l) => l.listing_type === 'for_sale' && l.status === 'published' && l.price)
      .reduce((sum, l) => sum + (l.price || 0), 0)

    // Calculate annualized rental value (monthly rent * 12)
    const totalRentalValueAnnualized = listings
      .filter((l) => l.listing_type === 'for_rent' && l.status === 'published' && l.price)
      .reduce((sum, l) => sum + (l.price || 0) * 12, 0)

    // TODO: Add seasonal value calculation when we have booking data

    // Calculate under contract
    const underContract = listings.filter((l) => l.status === 'under_contract' || l.status === 'pending')
    const underContractCount = underContract.length
    const underContractValue = underContract.reduce((sum, l) => sum + (l.price || 0), 0)

    // Calculate closed this month (need to check if we have closed_date field)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const closedThisMonth = listings.filter((l) => {
      if (l.status !== 'sold' && l.status !== 'rented') return false
      // Check if we have a sold_date or closed_date field
      const closedDate = l.sold_date || l.closed_date || l.updated_at
      if (!closedDate) return false
      return new Date(closedDate) >= startOfMonth
    })
    
    const closedThisMonthCount = closedThisMonth.length
    const closedThisMonthValue = closedThisMonth.reduce((sum, l) => sum + (l.price || 0), 0)

    // Calculate average price per sqm for sales
    const salesWithArea = listings.filter(
      (l) => l.listing_type === 'for_sale' && l.status === 'published' && l.price && l.area && l.area > 0
    )
    const avgPricePerSqm = salesWithArea.length > 0
      ? salesWithArea.reduce((sum, l) => sum + (l.price || 0) / (l.area || 1), 0) / salesWithArea.length
      : null

    // TODO: Calculate conversion rate, days on market, YoY growth
    // These require historical data or additional tracking

    return {
      totalSalesValue: totalSalesValue > 0 ? totalSalesValue : null,
      totalRentalValueAnnualized: totalRentalValueAnnualized > 0 ? totalRentalValueAnnualized : null,
      totalSeasonalValue: null, // TODO: implement when booking data available
      
      activeForSale: activeForSale > 0 ? activeForSale : null,
      activeForRent: activeForRent > 0 ? activeForRent : null,
      activeSeasonal: activeSeasonal > 0 ? activeSeasonal : null,
      
      underContractCount: underContractCount > 0 ? underContractCount : null,
      underContractValue: underContractValue > 0 ? underContractValue : null,
      
      closedThisMonthCount: closedThisMonthCount > 0 ? closedThisMonthCount : null,
      closedThisMonthValue: closedThisMonthValue > 0 ? closedThisMonthValue : null,
      
      conversionRate: null, // TODO: requires lead tracking
      avgDaysOnMarket: null, // TODO: requires listing_date tracking
      avgPricePerSqm,
      yoyGrowth: null, // TODO: requires historical comparison
      
      dataAvailable: {
        sales: totalSalesValue > 0,
        rentals: totalRentalValueAnnualized > 0,
        seasonal: false,
        underContract: underContractCount > 0,
        closedMTD: closedThisMonthCount > 0,
        conversion: false,
        daysOnMarket: false,
        pricePerSqm: avgPricePerSqm !== null,
        yoyGrowth: false,
      },
    }
  } catch (error) {
    console.error('Error calculating dashboard stats:', error)
    return getEmptyStats()
  }
}

function getEmptyStats(): DashboardStats {
  return {
    totalSalesValue: null,
    totalRentalValueAnnualized: null,
    totalSeasonalValue: null,
    activeForSale: null,
    activeForRent: null,
    activeSeasonal: null,
    underContractCount: null,
    underContractValue: null,
    closedThisMonthCount: null,
    closedThisMonthValue: null,
    conversionRate: null,
    avgDaysOnMarket: null,
    avgPricePerSqm: null,
    yoyGrowth: null,
    dataAvailable: {
      sales: false,
      rentals: false,
      seasonal: false,
      underContract: false,
      closedMTD: false,
      conversion: false,
      daysOnMarket: false,
      pricePerSqm: false,
      yoyGrowth: false,
    },
  }
}

/**
 * Format currency value to Brazilian Real
 */
export function formatCurrency(value: number | null, compact = false): string {
  if (value === null || value === 0) return 'R$ 0'
  
  if (compact && value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
