import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function RequestAccess() {
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    email: '',
    reason: '',
    ndaAccepted: false
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implement API call
    console.log('Request access:', formData)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Request Submitted
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            We review requests within 1–2 business days. You'll receive an email at <strong>{formData.email}</strong> once your access is approved.
          </p>
          
          <Link 
            to="/investidores"
            className="inline-flex items-center text-slate-900 dark:text-white font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Investor Relations
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            to="/investidores"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investor Relations
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Request Portal Access
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            We review requests within 1–2 business days. An NDA is required before granting access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Firm */}
            <div>
              <label htmlFor="firm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Firm / Organization *
              </label>
              <input
                type="text"
                id="firm"
                value={formData.firm}
                onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Reason for Access *
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent bg-white dark:bg-slate-950 text-slate-900 dark:text-white resize-none"
                placeholder="Please describe your interest in accessing the investor portal..."
                required
              />
            </div>

            {/* NDA Agreement */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-6 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Non-Disclosure Agreement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Access to the Investor Portal requires acceptance of our standard NDA. All information accessed through the portal is confidential and proprietary.
                  </p>
                  <a 
                    href="/docs/investor-nda.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-slate-900 dark:text-white font-medium hover:underline"
                  >
                    Review Full NDA Document →
                  </a>
                </div>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.ndaAccepted}
                  onChange={(e) => setFormData({ ...formData, ndaAccepted: e.target.checked })}
                  className="mt-1 w-4 h-4 border-slate-300 dark:border-slate-700 rounded focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                  required
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  I have reviewed and agree to the terms of the Non-Disclosure Agreement. I understand that all information accessed through the portal is confidential. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.ndaAccepted}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            Already have access?{' '}
            <Link to="/investors/login" className="text-slate-900 dark:text-white font-semibold hover:underline">
              Sign in to Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
