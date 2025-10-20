import React from 'react'

type ReleaseNote = {
  version: string
  releasedAt: string
  author: string
  highlights: string[]
  workstream?: string
}

const releaseNotes: ReleaseNote[] = [
  {
    version: '2024.10.19',
    releasedAt: 'Oct 19, 2024',
    author: 'Codex AI',
    workstream: 'Developer Portal',
    highlights: [
      'Introduced the Developer Desk with ticket submission, pending request management, and release tracking.',
      'Tickets now persist in Supabase, gather comments, and support like/dislike feedback for quick prioritization.',
      'Added collapsible sections for completed and rejected requests so the team can review decisions at a glance.',
    ],
  },
  {
    version: '2024.10.18',
    releasedAt: 'Oct 18, 2024',
    author: 'Codex AI',
    workstream: 'Admin Portal',
    highlights: [
      'Calendar page now supports quick connect buttons for Google, Proton, and iCloud calendars.',
      'Document Vault introduces DocuSign/Dropbox Sign and multi-cloud storage destinations, including Proton Drive.',
      'Admin header redesigned for clearer spacing and centered content.',
    ],
  },
  {
    version: '2024.10.17',
    releasedAt: 'Oct 17, 2024',
    author: 'Codex AI',
    workstream: 'Currency Platform',
    highlights: [
      'Currency switcher removes Bitcoin and now uses reliable fallback exchange rates when the API is unreachable.',
      'Navigation pills in the admin stay visible on smaller screens thanks to improved flex wrapping.',
    ],
  },
]

export default function Updates() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Latest updates</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Every release should include a short, human-friendly summary. Copy this to investor emails, Slack, or the client portal.
        </p>
      </div>

      <div className="space-y-4">
        {releaseNotes.map((release) => (
          <article
            key={release.version}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-brand-500/40"
          >
            <header className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-300">Release {release.version}</span>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{release.releasedAt}</span>
              {release.workstream && (
                <span className="ml-auto inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {release.workstream}
                </span>
              )}
            </header>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {release.highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-300">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Automation idea</h3>
        <p className="mt-1">
          Hook this feed up to your git repository by publishing a small JSON file (e.g. <code>releases.json</code>) from CI/CD. Each deploy
          can append a new entry with version, author, and plain-language bullet points.
        </p>
        <p className="mt-2">
          For now, edit <code>releaseNotes</code> in <code>src/pages/admin/developer/Updates.tsx</code> so the team always sees the latest
          shipped work.
        </p>
      </section>
    </div>
  )
}
