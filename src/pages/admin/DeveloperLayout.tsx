import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const developerTabs = [
  { to: 'submit-ticket', label: 'Submit a Ticket', description: 'Share feature ideas or bug reports.' },
  { to: 'pending-requests', label: 'Pending Requests', description: 'Track items waiting on engineering.' },
  { to: 'updates', label: 'Updates', description: 'Latest changes shipped to Stella Admin.' },
]

export default function DeveloperLayout() {
  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-[1px] shadow-xl">
        <div className="rounded-3xl bg-white px-6 py-8 text-center shadow-sm dark:bg-slate-900/90 sm:text-left">
          <span className="inline-flex items-center justify-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            Developer
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Developer Desk</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Coordinate roadmap requests, follow progress, and keep stakeholders in the loop on every release.
          </p>
        </div>
      </header>

      <nav className="rounded-3xl border border-slate-100 bg-white p-3 shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70">
        <ul className="grid gap-3 sm:grid-cols-3">
          {developerTabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) =>
                  `flex h-full flex-col gap-1 rounded-2xl border px-5 py-4 text-left shadow-sm transition-all ${
                    isActive
                      ? 'border-brand-500 bg-brand-50/80 text-brand-700 shadow-md dark:border-brand-400/80 dark:bg-brand-500/10 dark:text-brand-200'
                      : 'border-slate-100 text-slate-700 hover:border-brand-200 hover:bg-brand-50/50 hover:shadow-md dark:border-slate-800 dark:text-slate-200 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10'
                  }`
                }
                end={false}
              >
                <span className="text-sm font-semibold">{tab.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{tab.description}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <section className="min-h-[360px] rounded-3xl border border-slate-100 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <Outlet />
      </section>
    </div>
  )
}
