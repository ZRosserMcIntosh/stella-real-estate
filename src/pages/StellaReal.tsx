import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function StellaReal() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-indigo-500/5" />
        
        <div className="container-padded relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-600 dark:text-brand-400 text-sm mb-8">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              Retail Platform
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              Find Your <span className="text-brand-600 dark:text-brand-400">Perfect Property</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-8 font-light">
              Browse properties from verified realtors and brokerages
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/imoveis"
                className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl"
              >
                Browse All Listings
              </Link>
              <Link
                to="/projetos"
                className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl border border-slate-200 dark:border-slate-700"
              >
                New Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-24">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-12 text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Why Choose Stella Real
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Verified Listings',
                  description: 'All properties are verified and managed by licensed professionals',
                  icon: '✓'
                },
                {
                  title: 'Comprehensive Search',
                  description: 'Advanced filters to find exactly what you\'re looking for',
                  icon: '🔍'
                },
                {
                  title: 'Direct Contact',
                  description: 'Connect directly with realtors and schedule viewings',
                  icon: '�'
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-800/60 rounded-2xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-24">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-brand-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Are You a Realtor?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our platform and start building your real estate business
            </p>
            <Link
              to="/sub/constellation"
              className="inline-block px-8 py-4 bg-white text-brand-600 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Access Constellation Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
