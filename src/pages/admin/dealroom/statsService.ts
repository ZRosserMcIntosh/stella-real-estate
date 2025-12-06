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
  totalListings: number | null
  
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
  
  // Team metrics
  totalTeamMembers: number | null
  totalRealtors: number | null
  totalEmployees: number | null
  activeProjects: number | null
  
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
    team: boolean
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
    }

    const listings = allListings || []

    // Fetch team members
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('*')
    
    if (teamError) {
      console.error('Error fetching team members:', teamError)
    }

    const team = teamMembers || []

    // Fetch active projects from ballet_projects
    const { data: projects, error: projectsError } = await supabase
      .from('ballet_projects')
      .select('id')
      .eq('archived', false)
    
    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
    }

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

    const totalListings = listings.length

    // Calculate total value of sales listings
    const totalSalesValue = listings
      .filter((l) => l.listing_type === 'for_sale' && l.status === 'published' && l.price)
      .reduce((sum, l) => sum + (l.price || 0), 0)

    // Calculate annualized rental value (monthly rent * 12)
    const totalRentalValueAnnualized = listings
      .filter((l) => l.listing_type === 'for_rent' && l.status === 'published' && l.price)
      .reduce((sum, l) => sum + (l.price || 0) * 12, 0)

    // Calculate under contract
    const underContract = listings.filter((l) => l.status === 'under_contract' || l.status === 'pending')
    const underContractCount = underContract.length
    const underContractValue = underContract.reduce((sum, l) => sum + (l.price || 0), 0)

    // Calculate closed this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const closedThisMonth = listings.filter((l) => {
      if (l.status !== 'sold' && l.status !== 'rented') return false
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

    // Team metrics
    const totalTeamMembers = team.length
    const totalRealtors = team.filter((t) => 
      t.role === 'agent' || t.role === 'broker' || t.role === 'realtor'
    ).length
    const totalEmployees = team.filter((t) => 
      t.employment_type !== 'contractor' && t.employment_type !== 'pj'
    ).length
    const activeProjects = projects?.length || 0

    return {
      totalSalesValue: totalSalesValue > 0 ? totalSalesValue : null,
      totalRentalValueAnnualized: totalRentalValueAnnualized > 0 ? totalRentalValueAnnualized : null,
      totalSeasonalValue: null,
      
      activeForSale: activeForSale > 0 ? activeForSale : null,
      activeForRent: activeForRent > 0 ? activeForRent : null,
      activeSeasonal: activeSeasonal > 0 ? activeSeasonal : null,
      totalListings: totalListings > 0 ? totalListings : null,
      
      underContractCount: underContractCount > 0 ? underContractCount : null,
      underContractValue: underContractValue > 0 ? underContractValue : null,
      
      closedThisMonthCount: closedThisMonthCount > 0 ? closedThisMonthCount : null,
      closedThisMonthValue: closedThisMonthValue > 0 ? closedThisMonthValue : null,
      
      conversionRate: null,
      avgDaysOnMarket: null,
      avgPricePerSqm,
      yoyGrowth: null,
      
      // Team metrics
      totalTeamMembers: totalTeamMembers > 0 ? totalTeamMembers : null,
      totalRealtors: totalRealtors > 0 ? totalRealtors : null,
      totalEmployees: totalEmployees > 0 ? totalEmployees : null,
      activeProjects: activeProjects > 0 ? activeProjects : null,
      
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
        team: totalTeamMembers > 0,
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
    totalListings: null,
    underContractCount: null,
    underContractValue: null,
    closedThisMonthCount: null,
    closedThisMonthValue: null,
    conversionRate: null,
    avgDaysOnMarket: null,
    avgPricePerSqm: null,
    yoyGrowth: null,
    totalTeamMembers: null,
    totalRealtors: null,
    totalEmployees: null,
    activeProjects: null,
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
      team: false,
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
