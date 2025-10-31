import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function StellaPlatform() {
  const { t } = useTranslation()

  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(146,171,255,0.28),_rgba(15,23,42,0.95))]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
            {t('stellaPlatform.badge')}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t('stellaPlatform.hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-200">
            {t('stellaPlatform.hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
            >
              {t('stellaPlatform.hero.inquire')}
            </Link>
            <a
              href="#beta"
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/50 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
            >
              {t('stellaPlatform.hero.reserveBeta')}
            </a>
          </div>
        </div>
      </section>

      {/* Revolutionary 2D-to-3D Video Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.15),_transparent_50%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr] lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 mb-6">
                {t('stellaPlatform.video3d.badge')}
              </div>
              <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
                {t('stellaPlatform.video3d.title')}
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                {t('stellaPlatform.video3d.description')}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/30">
                    <svg className="h-3 w-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t('stellaPlatform.video3d.feature1.title')}</div>
                    <div className="text-sm text-slate-400">{t('stellaPlatform.video3d.feature1.description')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/30">
                    <svg className="h-3 w-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t('stellaPlatform.video3d.feature2.title')}</div>
                    <div className="text-sm text-slate-400">{t('stellaPlatform.video3d.feature2.description')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-400/30">
                    <svg className="h-3 w-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t('stellaPlatform.video3d.feature3.title')}</div>
                    <div className="text-sm text-slate-400">{t('stellaPlatform.video3d.feature3.description')}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 border border-emerald-400/20">
                <div className="text-sm font-semibold text-emerald-200 mb-2">{t('stellaPlatform.video3d.impact.label')}</div>
                <div className="text-3xl font-bold text-white mb-2">{t('stellaPlatform.video3d.impact.value')}</div>
                <div className="text-xs text-slate-300">{t('stellaPlatform.video3d.impact.description')}</div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-emerald-400/30 shadow-[0_30px_100px_-30px_rgba(16,185,129,0.5)]">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                  poster="/video/office-3D-poster.jpg"
                >
                  <source src="/video/office-3D.mp4" type="video/mp4" />
                </video>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-1">
                    {t('stellaPlatform.video3d.demo.label')}
                  </div>
                  <div className="text-sm text-slate-300">{t('stellaPlatform.video3d.demo.caption')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl mb-4">
            {t('stellaPlatform.metrics.title')}
          </h2>
          <div className="grid gap-6 mt-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(99,102,241,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(99,102,241,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl font-bold text-indigo-300 mb-2">{t('stellaPlatform.metrics.productivity.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.productivity.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.productivity.description')}</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(168,85,247,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(168,85,247,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl font-bold text-purple-300 mb-2">{t('stellaPlatform.metrics.automation.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.automation.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.automation.description')}</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-pink-400/30 bg-gradient-to-br from-pink-500/10 to-rose-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(236,72,153,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(236,72,153,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-5xl font-bold text-pink-300 mb-2">{t('stellaPlatform.metrics.satisfaction.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.satisfaction.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.satisfaction.description')}</div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 shadow-[0_20px_60px_-20px_rgba(34,211,238,0.4)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(34,211,238,0.6)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-4xl font-bold text-cyan-300 mb-2">{t('stellaPlatform.metrics.roi.value')}</div>
                <div className="text-sm font-semibold text-white mb-2">{t('stellaPlatform.metrics.roi.label')}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{t('stellaPlatform.metrics.roi.description')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t('stellaPlatform.pillars.title')}</h2>
          <p className="mt-4 text-base text-slate-300">
            {t('stellaPlatform.pillars.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <article className="flex h-full flex-col rounded-3xl border border-indigo-400/20 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.5)] transition hover:-translate-y-1 hover:border-indigo-300/50 hover:shadow-[0_40px_120px_-40px_rgba(37,99,235,0.65)]">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-200">{t('stellaPlatform.pillars.constelacao.subtitle')}</div>
            <h3 className="mt-3 text-2xl font-semibold text-white">{t('stellaPlatform.pillars.constelacao.title')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{t('stellaPlatform.pillars.constelacao.description')}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {(t('stellaPlatform.pillars.constelacao.bullets', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="flex h-full flex-col rounded-3xl border border-indigo-400/20 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.5)] transition hover:-translate-y-1 hover:border-indigo-300/50 hover:shadow-[0_40px_120px_-40px_rgba(37,99,235,0.65)]">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-200">{t('stellaPlatform.pillars.bale.subtitle')}</div>
            <h3 className="mt-3 text-2xl font-semibold text-white">{t('stellaPlatform.pillars.bale.title')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{t('stellaPlatform.pillars.bale.description')}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {(t('stellaPlatform.pillars.bale.bullets', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="flex h-full flex-col rounded-3xl border border-indigo-400/20 bg-white/5 p-6 shadow-[0_30px_80px_-40px_rgba(37,99,235,0.5)] transition hover:-translate-y-1 hover:border-indigo-300/50 hover:shadow-[0_40px_120px_-40px_rgba(37,99,235,0.65)]">
            <div className="text-sm font-semibold uppercase tracking-wider text-indigo-200">{t('stellaPlatform.pillars.sites.subtitle')}</div>
            <h3 className="mt-3 text-2xl font-semibold text-white">{t('stellaPlatform.pillars.sites.title')}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200">{t('stellaPlatform.pillars.sites.description')}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {(t('stellaPlatform.pillars.sites.bullets', { returnObjects: true }) as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-slate-900/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t('stellaPlatform.stack.title')}</h2>
              <p className="mt-4 text-base text-slate-300">{t('stellaPlatform.stack.subtitle')}</p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.unifiedLogin.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.unifiedLogin.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.socialStudio.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.socialStudio.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.calendar.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.calendar.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.docVault.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.docVault.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.analytics.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.analytics.description')}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-indigo-300/60 hover:bg-slate-900/90">
                  <h3 className="text-lg font-semibold text-white">{t('stellaPlatform.stack.api.title')}</h3>
                  <p className="mt-3 text-sm text-slate-300">{t('stellaPlatform.stack.api.description')}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent blur-3xl" />
              <div className="rounded-3xl border border-indigo-400/30 bg-slate-900/80 p-8 shadow-[0_30px_80px_-30px_rgba(99,102,241,0.6)]">
                <h3 className="text-xl font-semibold text-white">{t('stellaPlatform.stack.checklist.title')}</h3>
                <ul className="mt-6 space-y-4 text-sm text-slate-200">
                  {(t('stellaPlatform.stack.checklist.items', { returnObjects: true }) as string[]).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-400"
                >
                  {t('stellaPlatform.stack.checklist.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beta" className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{t('stellaPlatform.beta.title')}</h2>
        <p className="mt-4 text-base text-slate-300">{t('stellaPlatform.beta.subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-200">
          {(t('stellaPlatform.beta.badges', { returnObjects: true }) as string[]).map((badge, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 px-4 py-2">
              {badge}
            </span>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:platform@stella.com?subject=Quero%20testar%20a%20Stella%20Platform"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-200"
          >
            {t('stellaPlatform.beta.joinShortlist')}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-indigo-400/60 px-6 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-200 hover:text-white"
          >
            {t('stellaPlatform.beta.talkStrategists')}
          </Link>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-500">{t('stellaPlatform.beta.footer')}</p>
      </section>
    </div>
  )
}
