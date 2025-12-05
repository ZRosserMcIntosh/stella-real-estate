import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

interface DashboardStats {
  totalListings: number
  newProjects: number
  forSale: number
  forRent: number
  activeListings: number
  draftListings: number
  foundingMembers: number
  totalViews?: number
}

export default function DealRoom() {
  const { session } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get listings stats
      const { data: allListings, error: listingsError } = await supabase
        .from('listings')
        .select('id, listing_type, status', { count: 'exact' })

      if (listingsError) throw listingsError

      const totalListings = allListings?.length || 0
      const newProjects = allListings?.filter(l => l.listing_type === 'new_project').length || 0
      const forSale = allListings?.filter(l => l.listing_type === 'for_sale').length || 0
      const forRent = allListings?.filter(l => l.listing_type === 'for_rent').length || 0
      const activeListings = allListings?.filter(l => l.status === 'active').length || 0
      const draftListings = allListings?.filter(l => l.status === 'draft').length || 0

      // Get founding members count
      const { count: foundingCount, error: foundingError } = await supabase
        .from('founding_members')
        .select('*', { count: 'exact', head: true })

      const foundingMembers = foundingCount || 0

      setStats({
        totalListings,
        newProjects,
        forSale,
        forRent,
        activeListings,
        draftListings,
        foundingMembers
      })
    } catch (err: any) {
      console.error('Failed to load dashboard stats:', err)
      setError(err?.message || 'Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-white mb-6">Dashboard</h1>
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-200">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadDashboardStats}
            className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Listings */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <img src="/admin-icons/for-sale.png" alt="" className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats?.totalListings || 0}</div>
          <div className="text-sm text-slate-400">Total Listings</div>
        </div>

        {/* Active Listings */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-300 uppercase tracking-wider">Live</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats?.activeListings || 0}</div>
          <div className="text-sm text-slate-400">Active Listings</div>
        </div>

        {/* Draft Listings */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-yellow-300 uppercase tracking-wider">Draft</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats?.draftListings || 0}</div>
          <div className="text-sm text-slate-400">Draft Listings</div>
        </div>

        {/* Founding Members */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">Constellation</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats?.foundingMembers || 0}</div>
          <div className="text-sm text-slate-400">Founding Members</div>
        </div>
      </div>

      {/* Listings Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings by Type */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Listings by Type</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300">New Projects</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.newProjects || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">For Sale</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.forSale || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300">For Rent</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats?.forRent || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/listings/new-projects"
              className="block p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">Create New Project</div>
                  <div className="text-sm text-slate-400">Add a new development listing</div>
                </div>
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a
              href="/admin/listings/for-sale"
              className="block p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white group-hover:text-green-300 transition-colors">Create For Sale Listing</div>
                  <div className="text-sm text-slate-400">Add a property for sale</div>
                </div>
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <a
              href="/admin/crm"
              className="block p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">View Constellation Members</div>
                  <div className="text-sm text-slate-400">Manage founding members</div>
                </div>
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
