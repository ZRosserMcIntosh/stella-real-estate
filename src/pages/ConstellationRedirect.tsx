import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

/**
 * SEO-friendly redirect from /constellation to canonical Constellation subdomain
 * 
 * This component:
 * 1. Sets 301 redirect via meta refresh (client-side equivalent)
 * 2. Sets canonical URL to constellation.stellareal.com.br
 * 3. Immediately redirects users to avoid cannibalization
 */
export default function ConstellationRedirect() {
  useEffect(() => {
    // Immediate redirect to canonical Constellation URL
    window.location.replace('https://constellation.stellareal.com.br/')
  }, [])

  return (
    <>
      <Helmet>
        {/* 301 equivalent - meta refresh with 0 second delay */}
        <meta httpEquiv="refresh" content="0; url=https://constellation.stellareal.com.br/" />
        
        {/* Canonical URL - tells Google the preferred version */}
        <link rel="canonical" href="https://constellation.stellareal.com.br/" />
        
        {/* Robots: allow indexing of canonical, noindex this redirect page */}
        <meta name="robots" content="noindex, follow" />
        
        {/* Page title for brief moment before redirect */}
        <title>Redirecting to Constellation...</title>
      </Helmet>
      
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Redirecting to Constellation...</p>
          <p className="text-sm text-slate-500 mt-2">
            If you are not redirected,{' '}
            <a href="https://constellation.stellareal.com.br/" className="text-indigo-400 hover:text-indigo-300">
              click here
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
