import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Globe, Rocket, TrendingUp, Users, MapPin, Award, CheckCircle, ArrowRight } from 'lucide-react'
import { useEffect } from 'react'

export default function International() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const markets = [
    {
      region: 'North America',
      countries: ['United States', 'Canada'],
      status: 'Coming Q2 2026',
      icon: '🇺🇸',
      features: ['MLS Integration', 'NAR Compliance', 'USD Pricing']
    },
    {
      region: 'Europe',
      countries: ['Portugal', 'Spain', 'Italy', 'France', 'UK'],
      status: 'Coming Q3 2026',
      icon: '🇪🇺',
      features: ['GDPR Compliant', 'Multi-Language', 'EUR Pricing']
    },
    {
      region: 'Latin America',
      countries: ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Mexico'],
      status: 'Live Now - Brazil',
      icon: '🌎',
      features: ['Portuguese/Spanish', 'Local Payment', 'CRECI Support']
    },
    {
      region: 'Asia Pacific',
      countries: ['Australia', 'Singapore', 'Japan', 'Dubai'],
      status: 'Coming 2027',
      icon: '🌏',
      features: ['Multi-Currency', 'Regional Support', 'Local Compliance']
    }
  ]

  const benefits = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Reach, Local Expertise',
      description: 'Operate across borders while maintaining deep local market knowledge and compliance.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'International Client Base',
      description: 'Connect with buyers and sellers from around the world looking for cross-border opportunities.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Multi-Currency Support',
      description: 'Handle transactions in multiple currencies with automatic conversion and local payment methods.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Verified International Network',
      description: 'Partner with vetted real estate professionals in key markets worldwide.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Helmet>
        <title>Stella International - Global Real Estate Platform Expansion</title>
        <meta name="description" content="Expanding Stella's real estate platform globally. Connect with international markets, manage cross-border transactions, and grow your global real estate business." />
        <meta name="keywords" content="international real estate, global property platform, cross-border real estate, international property investment" />
        <link rel="canonical" href="https://stellareal.com.br/international" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 pt-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(59, 130, 246) 1px, transparent 0)', 
            backgroundSize: '48px 48px' 
          }} />
        </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8">
              <Globe className="w-4 h-4" />
              Expanding Globally
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                Stella International
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-slate-300 mb-4 font-light">
              Your Real Estate Business, Without Borders
            </p>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              We're bringing Stella's powerful real estate platform to markets worldwide. Connect with international clients, 
              manage cross-border transactions, and expand your business globally with the same platform you trust in Brazil.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contato"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                Join Waitlist
              </Link>
              <a
                href="#markets"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                Explore Markets
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Global Markets */}
      <section id="markets" className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Expanding to Key Markets
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Strategic expansion into the world's most dynamic real estate markets
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {markets.map((market, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{market.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {market.region}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs mb-3">
                        <Rocket className="w-3 h-3" />
                        {market.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-slate-400 mb-2">Key Markets:</p>
                    <p className="text-slate-300">{market.countries.join(', ')}</p>
                  </div>

                  <div className="space-y-2">
                    {market.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-24 relative bg-slate-900/50">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Why Go International with Stella?
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Everything you need to expand your real estate business globally
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Perfect For
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'International Investors',
                  description: 'Looking for property opportunities across multiple countries and markets',
                  icon: <TrendingUp className="w-6 h-6" />
                },
                {
                  title: 'Expat Realtors',
                  description: 'Serving clients relocating between countries and need multi-market expertise',
                  icon: <MapPin className="w-6 h-6" />
                },
                {
                  title: 'Global Brokerages',
                  description: 'Operating in multiple countries and need a unified platform',
                  icon: <Users className="w-6 h-6" />
                }
              ].map((useCase, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/40 via-cyan-900/40 to-emerald-900/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/50 text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-slate-300">
                    {useCase.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-24 relative bg-slate-900/50">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Expansion Timeline
              </h2>
              <p className="text-lg text-slate-400">
                Our roadmap to global real estate domination
              </p>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  quarter: 'Q1 2026',
                  title: 'Foundation Phase',
                  items: ['Launch Brazil operations (✓ Live)', 'International partnerships', 'Multi-currency framework']
                },
                {
                  quarter: 'Q2 2026',
                  title: 'North American Launch',
                  items: ['US & Canada expansion', 'MLS integration', 'English language support']
                },
                {
                  quarter: 'Q3 2026',
                  title: 'European Expansion',
                  items: ['Portugal, Spain, UK launch', 'GDPR compliance', 'Multi-language platform']
                },
                {
                  quarter: '2027+',
                  title: 'Global Scale',
                  items: ['Asia Pacific markets', 'Middle East entry', 'Full global coverage']
                }
              ].map((phase, idx) => (
                <div
                  key={idx}
                  className="relative pl-8 border-l-2 border-blue-500/30 hover:border-blue-500 transition-colors"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-950"></div>
                  <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold">
                        {phase.quarter}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {phase.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <ArrowRight className="w-4 h-4 text-blue-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-12 backdrop-blur-sm">
              <h2 className="text-3xl sm:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Ready to Go Global?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join our waitlist to be among the first to access Stella International when we launch in your market.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/contato"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Join International Waitlist
                </Link>
                <Link
                  to="/constellation"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30"
                >
                  Start with Constellation (Brazil)
                </Link>
              </div>
              <p className="text-sm text-slate-400 mt-6">
                Early access • Founding member benefits • Priority support
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
