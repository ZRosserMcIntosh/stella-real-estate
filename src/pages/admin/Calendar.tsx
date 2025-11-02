import React, { useMemo, useState } from 'react'

type CalendarIntegration = {
  id: string
  name: string
  description: string
  documentationUrl?: string
  documentationLabel?: string
}

const calendarIntegrations: CalendarIntegration[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    description:
      'Sync company tours, client meetings, and reminders with your organization’s Google Workspace calendar.',
    documentationUrl: 'https://support.google.com/calendar/answer/2465776',
    documentationLabel: 'Google Workspace calendar sync guide',
  },
  {
    id: 'proton',
    name: 'Proton Calendar',
    description:
      'Connect to Proton Calendar via CalDAV to keep privacy-first scheduling in sync with the operations team.',
    documentationUrl: 'https://proton.me/calendar/import-export',
    documentationLabel: 'How to connect Proton Calendar',
  },
  {
    id: 'icloud',
    name: 'Apple iCloud Calendar',
    description:
      'Use secure app-specific passwords to push Stella Real Estate events into shared iCloud calendars.',
    documentationUrl: 'https://support.apple.com/HT204397',
    documentationLabel: 'Generate an app-specific password',
  },
]

const upcomingIntegrations: CalendarIntegration[] = [
  {
    id: 'outlook',
    name: 'Outlook / Microsoft 365',
    description:
      'Bi-directional sync for Outlook and Microsoft 365 resource calendars for onsite visits and closings.',
  },
  {
    id: 'caldav',
    name: 'Generic CalDAV',
    description: 'Connect any CalDAV compatible provider using ICS feeds for team-wide availability.',
  },
  {
    id: 'zoom',
    name: 'Zoom Meetings',
    description: 'Auto-create Zoom meeting links whenever a virtual appointment is booked.',
  },
]

export default function Calendar() {
  const initialConnections = useMemo(
    () =>
      calendarIntegrations.reduce<Record<string, boolean>>((acc, integration) => {
        acc[integration.id] = false
        return acc
      }, {}),
    []
  )

  const [connections, setConnections] = useState(initialConnections)

  const toggleConnection = (integrationId: string) => {
    setConnections((prev) => ({
      ...prev,
      [integrationId]: !prev[integrationId],
    }))
    console.info(`Calendar integration toggled: ${integrationId}`)
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-xl font-semibold">Calendar</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Manage meetings, tours, and availability. Connect external calendars so the entire team sees the same
          schedule.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg shadow-lg shadow-slate-950/20">
        <div className="border-b border-slate-700/60 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-100">Calendar integrations</h2>
          <p className="mt-1 text-sm text-slate-400">
            Connect your existing calendars so bookings inside Stella stay in sync with the tools your team already
            uses.
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-3">
          {calendarIntegrations.map((integration) => {
            const isConnected = connections[integration.id]
            return (
              <div key={integration.id} className="flex flex-col justify-between rounded-lg border border-slate-700/60 bg-slate-800/50 p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-100">{integration.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{integration.description}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      {isConnected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                  {integration.documentationUrl && (
                    <a
                      className="inline-flex text-sm font-medium text-sky-600 hover:text-sky-700"
                      href={integration.documentationUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {integration.documentationLabel ?? 'View connection guide'}
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => toggleConnection(integration.id)}
                  className={`mt-4 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    isConnected
                      ? 'border border-slate-700/60 bg-slate-800/50 text-slate-200 hover:bg-slate-700/60'
                      : 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-dashed border-slate-700/60 bg-slate-800/30 backdrop-blur-lg p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">Upcoming & manual options</h2>
          <p className="text-sm text-slate-400">
            If you need another provider today, you can use ICS feeds or CalDAV credentials while we finalize native
            integrations.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingIntegrations.map((integration) => (
            <li key={integration.id} className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-200">{integration.name}</p>
              <p className="mt-1 text-sm text-slate-400">{integration.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
