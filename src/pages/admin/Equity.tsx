import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  PieChart, 
  FileText, 
  Vote,
  Share2,
  Plus,
  Download,
  Eye
} from 'lucide-react'

export default function Equity() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cap-table' | 'agreements' | 'voting' | 'transactions'>('overview')

  // Mock data - replace with API calls
  const companyValuation = '$15.5M'
  const totalShares = '10,000,000'
  const outstandingShares = '7,850,000'
  const optionPool = '1,500,000'
  const fullyDiluted = '10,000,000'

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'cap-table', label: 'Cap Table', icon: PieChart },
    { id: 'agreements', label: 'Agreements', icon: FileText },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'transactions', label: 'Transactions', icon: Share2 }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Equity Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage company valuation, cap table, share agreements, and voting
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Company Valuation</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{companyValuation}</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-2">Post-money</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Authorized</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalShares.toLocaleString()}</div>
              <div className="text-sm text-slate-500 dark:text-slate-500 mt-2">shares</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Outstanding</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{outstandingShares.toLocaleString()}</div>
              <div className="text-sm text-slate-500 dark:text-slate-500 mt-2">78.5% issued</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Option Pool</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{optionPool.toLocaleString()}</div>
              <div className="text-sm text-slate-500 dark:text-slate-500 mt-2">15% reserved</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                <Plus className="w-5 h-5" />
                Issue Shares
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <FileText className="w-5 h-5" />
                New Agreement
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <Vote className="w-5 h-5" />
                Create Vote
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                <Download className="w-5 h-5" />
                Export Data
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Option Grant Issued</div>
                    <div className="text-sm text-slate-500">50,000 shares to employee</div>
                  </div>
                </div>
                <div className="text-sm text-slate-500">2 days ago</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <Vote className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Board Vote Completed</div>
                    <div className="text-sm text-slate-500">Q4 Budget Approval - Passed</div>
                  </div>
                </div>
                <div className="text-sm text-slate-500">5 days ago</div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Valuation Updated</div>
                    <div className="text-sm text-slate-500">Post-money valuation: $15.5M</div>
                  </div>
                </div>
                <div className="text-sm text-slate-500">1 week ago</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cap Table Tab */}
      {activeTab === 'cap-table' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Capitalization Table</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
                  As-Converted
                </button>
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                  Fully Diluted
                </button>
                <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Shareholder</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Type</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Shares</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">% Ownership</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">Founders</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Common</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">6,000,000</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">60.0%</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">$9.3M</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">Series Seed Investors</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Preferred</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">1,500,000</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">15.0%</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">$2.3M</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">Employee Options (Issued)</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Options</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">350,000</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">3.5%</td>
                    <td className="py-3 px-4 text-right text-slate-900 dark:text-white">$543K</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Option Pool (Remaining)</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Reserved</td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">1,150,000</td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">11.5%</td>
                    <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400">$1.8M</td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-slate-300 dark:border-slate-600">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Total</td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">10,000,000</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">100.0%</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">$15.5M</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === 'agreements' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Share Agreements</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Generate and manage share purchase, option grant, and transfer agreements</p>
          <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
            Create Agreement
          </button>
        </div>
      )}

      {activeTab === 'voting' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Vote className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Shareholder Voting</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Create polls, manage voting rights, and track resolutions</p>
          <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
            Create Vote
          </button>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Share2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Share Transactions</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Manage buy/sell orders, transfers, and secondary transactions</p>
          <button className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
            New Transaction
          </button>
        </div>
      )}
    </div>
  )
}
