import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Mail, Shield } from 'lucide-react'

export default function InvestorLogin() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: Implement magic link auth
    console.log('Sending magic link to:', email)
    setTimeout(() => setLoading(false), 2000)
  }

  const handleSSO = (provider: 'google' | 'microsoft') => {
    // TODO: Implement SSO
    console.log('SSO with:', provider)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 dark:bg-white rounded-full mb-4">
            <Lock className="w-8 h-8 text-white dark:text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Investor Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Authorized investors can access the Portal with SSO and two-factor authentication.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
          {/* SSO Options */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSSO('google')}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <button
              onClick={() => handleSSO('microsoft')}
              className="w-full flex items-center justify-center px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-slate-700 dark:text-slate-300"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 23 23">
                <path fill="#f35325" d="M0 0h11v11H0z"/>
                <path fill="#81bc06" d="M12 0h11v11H12z"/>
                <path fill="#05a6f0" d="M0 12h11v11H0z"/>
                <path fill="#ffba08" d="M12 12h11v11H12z"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">Or continue with email</span>
            </div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                  placeholder="investor@firm.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
              <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>
                All access requires mandatory two-factor authentication. After login, you'll be prompted to set up TOTP if not already configured.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Don't have access?
          </p>
          <Link 
            to="/investors/request-access" 
            className="text-slate-900 dark:text-white font-semibold hover:underline"
          >
            Request Portal Access
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link 
            to="/investidores" 
            className="text-sm text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            ← Back to Investor Relations
          </Link>
        </div>
      </div>
    </div>
  )
}
