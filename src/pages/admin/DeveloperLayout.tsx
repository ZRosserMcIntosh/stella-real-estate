import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const developerTabs = [
  { to: 'submit-ticket', label: 'Submit a Ticket', description: 'Share feature ideas or bug reports.' },
  { to: 'pending-requests', label: 'Pending Requests', description: 'Track items waiting on engineering.' },
  { to: 'updates', label: 'Updates', description: 'Latest changes shipped to Stella Admin.' },
  { to: 'templates', label: 'Templates', description: 'Curate default site experiences for tenants.' },
  { to: 'feature-gates', label: 'Feature Gates', description: 'Control rollouts like Ballet and QA automations.' },
  { to: 'access-codes', label: 'Access Codes', description: 'Generate employee invites and developer sandbox logins.' },
  { to: 'visuals', label: 'Visuals', description: 'Create branded images, placeholders, and graphics.' },
]

export default function DeveloperLayout() {
  return (
    <div className="space-y-8">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 p-[1px] shadow-xl">
        <div className="rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-6 py-8 text-center shadow-sm sm:text-left">
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-300">
            Developer
          </span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-100">Developer Desk</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Coordinate roadmap requests, follow progress, and keep stakeholders in the loop on every release.
          </p>
        </div>
      </header>

      <nav className="rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3 shadow-lg shadow-slate-950/20">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {developerTabs.map((tab) => (
            <li key={tab.to}>
              <NavLink
                to={tab.to}
                className={({ isActive }) =>
                  `flex h-full flex-col gap-1 rounded-2xl border px-5 py-4 text-left shadow-sm transition-all ${
                    isActive
                      ? 'border-indigo-500/40 bg-indigo-600/30 text-indigo-200 shadow-md'
                      : 'border-slate-700/60 text-slate-300 hover:border-slate-600/80 hover:bg-slate-800/50 hover:text-slate-200 hover:shadow-md'
                  }`
                }
                end={false}
              >
                <span className="text-sm font-semibold">{tab.label}</span>
                <span className="text-xs text-slate-500">{tab.description}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <section className="min-h-[360px] rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <Outlet />
      </section>
    </div>
  )
}
