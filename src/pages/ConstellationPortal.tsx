import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ConstellationHeader from '../components/ConstellationHeader'

export default function ConstellationPortal() {
  const { t } = useTranslation()
  // Static background stars - memoized to prevent regeneration on re-renders
  const staticStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10, // Random delay up to 10s for staggered twinkling
      animationDuration: Math.random() * 3 + 2, // 2-5 seconds per twinkle
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []); // Empty deps - only generate once
  
  // Shooting stars - memoized to prevent regeneration on re-renders
  const shootingStars = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: 0,
      duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6),
      left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80,
      top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50,
      width: 100 * (0.7 + Math.random() * 0.6),
      opacity: 0.7 + Math.random() * 0.6,
    }));
  }, []); // Empty deps - only generate once

  return (
    <>
      <style>{`
        html, body {
          background: #020617 !important;
          background-attachment: fixed;
          min-height: 100vh;
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
          20% {
            opacity: 0.5;
            filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.2));
          }
          30% {
            opacity: 1;
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.4));
          }
          60% {
            opacity: 1;
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
          }
          75% {
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
          }
          95% {
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.9));
          }
          100% {
            transform: translateX(-300px) translateY(300px) rotate(-45deg);
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(255, 255, 255, 0));
          }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shootingStar linear infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-950">
        {/* Constellation Header */}
        <ConstellationHeader />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32 pt-32">
          {/* Animated stars background */}
          <div className="absolute inset-0 overflow-hidden">
            {staticStars.map((star) => (
              <div
                key={`static-${star.id}`}
                className="star"
                style={{
                  width: `${star.width}px`,
                  height: `${star.height}px`,
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  animationDelay: `${star.animationDelay}s`,
                  animationDuration: `${star.animationDuration}s`,
                  opacity: star.opacity,
                }}
              />
            ))}

            {/* Shooting stars */}
            {shootingStars.map((star) => (
              <div
                key={`shooting-${star.id}`}
                className="shooting-star"
                style={{
                  width: `${star.width}px`,
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                  opacity: star.opacity,
                }}
              />
            ))}
          </div>
        
        <div className="container-padded relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full text-brand-400 text-sm mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {t('constellation.hero.badge')}
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-purple-400">
                Constellation
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-slate-300 mb-4 font-light">
              {t('constellation.hero.title')}
            </p>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('constellation.hero.description')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/precos"
                className="px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                {t('constellation.hero.get_started_free')}
              </Link>
              <Link
                to="/sub/constellation/login"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                {t('constellation.hero.sign_in')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('constellation.benefits.title')}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                {t('constellation.benefits.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: t('constellation.benefits.features.websites.title'),
                  description: t('constellation.benefits.features.websites.description'),
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )
                },
                {
                  title: t('constellation.benefits.features.listings.title'),
                  description: t('constellation.benefits.features.listings.description'),
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )
                },
                {
                  title: t('constellation.benefits.features.crm.title'),
                  description: t('constellation.benefits.features.crm.description'),
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: t('constellation.benefits.features.tasks.title'),
                  description: t('constellation.benefits.features.tasks.description'),
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                },
                {
                  title: t('constellation.benefits.features.marketplace.title'),
                  description: t('constellation.benefits.features.marketplace.description'),
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  )
                },
                {
                  title: t('constellation.benefits.features.analytics.title'),
                  description: t('constellation.benefits.features.analytics.description'),
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-brand-500/50 transition-all hover:shadow-xl hover:shadow-brand-500/10 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {t('constellation.how_it_works.title')}
              </h2>
              <p className="text-lg text-slate-400">
                {t('constellation.how_it_works.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: t('constellation.how_it_works.steps.step1.title'),
                  description: t('constellation.how_it_works.steps.step1.description')
                },
                {
                  step: '2',
                  title: t('constellation.how_it_works.steps.step2.title'),
                  description: t('constellation.how_it_works.steps.step2.description')
                },
                {
                  step: '3',
                  title: t('constellation.how_it_works.steps.step3.title'),
                  description: t('constellation.how_it_works.steps.step3.description')
                }
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-gradient-to-br from-brand-500/10 to-indigo-500/10 border border-brand-500/30 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-400">
                      {item.description}
                    </p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg className="w-8 h-8 text-brand-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-brand-600/20 to-indigo-600/20 border border-brand-500/30 rounded-3xl p-12 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {t('constellation.pricing.title')}
                </h2>
                <p className="text-xl text-slate-300">
                  {t('constellation.pricing.subtitle')}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                {[
                  { plan: t('constellation.pricing.plans.starter.name'), price: 'R$ 97', features: [t('constellation.pricing.plans.starter.features.0'), t('constellation.pricing.plans.starter.features.1'), t('constellation.pricing.plans.starter.features.2')] },
                  { plan: t('constellation.pricing.plans.pro.name'), price: 'R$ 297', popular: true, features: [t('constellation.pricing.plans.pro.features.0'), t('constellation.pricing.plans.pro.features.1'), t('constellation.pricing.plans.pro.features.2'), t('constellation.pricing.plans.pro.features.3')] },
                  { plan: t('constellation.pricing.plans.team.name'), price: 'R$ 797', features: [t('constellation.pricing.plans.team.features.0'), t('constellation.pricing.plans.team.features.1'), t('constellation.pricing.plans.team.features.2'), t('constellation.pricing.plans.team.features.3')] }
                ].map((tier, idx) => (
                  <div
                    key={idx}
                    className={`relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border ${
                      tier.popular ? 'border-brand-500 ring-2 ring-brand-500/50' : 'border-slate-700/50'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold rounded-full">
                          {t('constellation.pricing.most_popular')}
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2">{tier.plan}</h3>
                    <div className="text-3xl font-bold text-brand-400 mb-4">{tier.price}<span className="text-sm text-slate-400">/{t('constellation.pricing.per_month')}</span></div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-brand-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/precos"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  {t('constellation.pricing.view_all_plans')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-24 relative">
        <div className="container-padded">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {t('constellation.cta.title')}
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              {t('constellation.cta.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/precos"
                className="px-8 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
              >
                {t('constellation.cta.start_trial')}
              </Link>
              <Link
                to="/contato"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-medium transition-all border border-white/20 hover:border-white/30 text-lg"
              >
                {t('constellation.cta.schedule_demo')}
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-6">
              {t('constellation.cta.no_credit_card')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12">
        <div className="container-padded">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-semibold mb-4">{t('constellation.footer.product')}</h4>
                <ul className="space-y-2">
                  <li><Link to="/plataforma-stella" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.features')}</Link></li>
                  <li><Link to="/precos" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.pricing')}</Link></li>
                  <li><Link to="/sub/stellareal" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.retail_platform')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">{t('constellation.footer.company')}</h4>
                <ul className="space-y-2">
                  <li><Link to="/sobre" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.about')}</Link></li>
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.contact')}</Link></li>
                  <li><Link to="/institucional" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.institutional')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">{t('constellation.footer.legal')}</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacidade" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.privacy')}</Link></li>
                  <li><Link to="/termos" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.terms')}</Link></li>
                  <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.cookies')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">{t('constellation.footer.support')}</h4>
                <ul className="space-y-2">
                  <li><Link to="/contato" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.help_center')}</Link></li>
                  <li><Link to="/sub/constellation/login" className="text-slate-400 hover:text-white transition-colors">{t('constellation.footer.sign_in')}</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
              <p>{t('constellation.footer.copyright')}</p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
