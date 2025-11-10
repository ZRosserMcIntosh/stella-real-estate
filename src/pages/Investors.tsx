import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Shield, 
  Globe2, 
  Zap, 
  Users, 
  Lock,
  FileText,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2
} from 'lucide-react'

export default function Investors() {
  const { t } = useTranslation()

  const investmentThesis = [
    {
      icon: Globe2,
      title: 'Market Opportunity',
      description: 'TAM $180B in Brazil; expanding to LATAM with $450B+ addressable market across residential and commercial real estate technology.'
    },
    {
      icon: Zap,
      title: 'Technical Innovation',
      description: 'Proprietary smartphone-to-3D property capture pipeline, Constellation graph-based CRM, and Ballet work choreography framework—building moats that compound with every property added.'
    },
    {
      icon: Building2,
      title: 'Platform Architecture',
      description: 'Full-stack real estate operating system: inventory management, CRM, automation workflows, white-label websites, and cinematic property pages—unified data model, zero integration fragility.'
    },
    {
      icon: BarChart3,
      title: 'Business Model',
      description: 'Triple revenue streams: SaaS subscriptions, payment processing infrastructure, and premium automation services. High gross margins with compounding network effects.'
    },
    {
      icon: Shield,
      title: 'Regulatory Posture',
      description: 'Built for CRECI compliance from day one. LGPD-native data protection, established regulatory relationships, and designed for institutional-grade audit trails.'
    }
  ]

  const partners = [
    'CRECI-SP',
    'Supabase',
    'Vercel',
    'Stripe'
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section - Above the Fold */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-padded py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Operating system for modern<br/>real estate empires
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                Building the future of real estate technology in Brazil and beyond
              </p>
              
              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link 
                  to="/investors/request-access"
                  className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                >
                  Request Information
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link 
                  to="/investors/login"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Investor Login
                </Link>
              </div>

              {/* Trust Bar */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-6">Trusted Infrastructure</p>
                <div className="flex flex-wrap justify-center items-center gap-8">
                  {partners.map((partner) => (
                    <div key={partner} className="text-lg font-semibold text-slate-400 dark:text-slate-600">
                      {partner}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-padded py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Investment Thesis
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center max-w-3xl mx-auto">
              A platform built for scale, defensibility, and compounding returns
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investmentThesis.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                    <Icon className="w-10 h-10 text-slate-900 dark:text-white mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="container-padded py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Core Technology Innovations
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center">
              Building defensible technology that compounds with every property
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">3D Property Capture</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Smartphone-to-3D pipeline that transforms simple video walkthroughs into fully explorable 3D property tours. No expensive equipment, no external services—just your phone.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Computer vision + ML reconstruction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Automatic floor plan generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Measurement extraction</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Constellation CRM</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Graph-based relationship database that maps people, properties, deals, and communications as interconnected nodes. See the full context, not just isolated records.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Graph database architecture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Relationship-first data model</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>AI-powered insights from connections</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Ballet Work Choreography</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Task automation framework that orchestrates complex workflows across teams, systems, and touchpoints. Work graphs that execute themselves.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Visual workflow builder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Conditional logic & branching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Cross-platform triggers</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Cinematic Property Pages</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  White-label website builder that generates high-conversion property landing pages with custom domains, localization, and embedded tools.
                </p>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Custom domain mapping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Multi-language content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Embedded scheduling & WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flywheel */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-padded py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Platform Flywheel
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center">
              Each cycle reinforces network effects and defensibility
            </p>
            
            <div className="space-y-4">
              {[
                'More inventory listings → Better media & content generation',
                'Better content → Higher conversion rates & buyer engagement',
                'More transactions → Increased payment processing volume',
                'More data → Smarter AI & predictive insights',
                'Better insights → Attract more supply & premium listings'
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-6 h-6 text-slate-900 dark:text-white flex-shrink-0 mt-0.5" />
                  <p className="text-lg text-slate-700 dark:text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="container-padded py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Governance & Structure
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center">
              Experienced leadership with proven track records
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  Stella Mary Barbosa
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">Chief Executive Officer</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Leading brand, product, and go-to-market strategy. Building a Brazil-born, globally-minded platform for the next decade of real estate technology.
                </p>
              </div>
              
              <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  Z. Rosser McIntosh
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">Chief Technology Officer</p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Architecting engineering, data, and security. Building fast, reliable systems at scale with a focus on developer ergonomics and measurable outcomes.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 rounded-lg border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Corporate Structure</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Stella Real Estate operates as a Brazilian entity (CNPJ: pending registration) with planned holding structure for international expansion and equity distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ESG & Impact */}
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="container-padded py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              ESG & Impact
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center">
              Building responsibly with transparency and accountability
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-12 h-12 text-slate-900 dark:text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Data Privacy</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  LGPD compliant with enterprise-grade security. Fair housing and anti-discrimination policies embedded in our platform.
                </p>
              </div>
              
              <div className="text-center">
                <Globe2 className="w-12 h-12 text-slate-900 dark:text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Sustainability</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Remote 3D property tours reduce carbon footprint. Efficient infrastructure minimizes computational waste.
                </p>
              </div>
              
              <div className="text-center">
                <Users className="w-12 h-12 text-slate-900 dark:text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Social Impact</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Democratizing access to professional real estate tools. CRECI education programs and workforce development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="container-padded py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Latest Updates
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center">
              Recent investor communications and company announcements
            </p>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-950 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Q3 2025 Investor Letter</h3>
                  <span className="text-sm text-slate-500 dark:text-slate-500">Oct 15, 2025</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  340% YoY growth driven by developer platform launch and payment processing expansion.
                </p>
                <Link to="/investors/portal/updates" className="text-slate-900 dark:text-white font-medium hover:underline inline-flex items-center">
                  Read letter <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IR Footer */}
      <section className="bg-slate-900 dark:bg-black text-white">
        <div className="container-padded py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Contact
                </h3>
                <p className="text-slate-400 mb-2">Investor Relations</p>
                <a href="mailto:ir@stella.com.br" className="text-white hover:underline">
                  ir@stella.com.br
                </a>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Documents
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/investors/deck" className="text-slate-400 hover:text-white transition-colors">
                      Investor Deck (Public)
                    </Link>
                  </li>
                  <li>
                    <Link to="/investors/press-kit" className="text-slate-400 hover:text-white transition-colors">
                      Press Kit
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/investors/disclaimers" className="text-slate-400 hover:text-white transition-colors">
                      Forward-Looking Statements
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-800 pt-8">
              <p className="text-sm text-slate-500 leading-relaxed">
                <strong className="text-slate-400">Disclaimer:</strong> This website contains forward-looking statements regarding the company's business, financial condition, and prospects. Actual results may differ materially. This information is not an offer to sell or a solicitation to buy any securities. Access to certain areas requires authorization and is subject to confidentiality obligations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
