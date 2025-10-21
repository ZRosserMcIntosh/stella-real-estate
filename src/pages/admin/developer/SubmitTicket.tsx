import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'

type TicketCategory = 'feature' | 'bug' | 'integration' | 'content' | 'other'
type TicketPriority = 'p0' | 'p1' | 'p2' | 'p3'

const categories: Record<TicketCategory, string> = {
  feature: 'Feature request',
  bug: 'Bug report',
  integration: 'Integration or API',
  content: 'Content/data update',
  other: 'Something else',
}

const priorities: Record<
  TicketPriority,
  { label: string; description: string; cardActive: string; button: string }
> = {
  p0: {
    label: 'Critical',
    description: 'Blocking revenue or core workflows',
    cardActive:
      'border-red-500 bg-gradient-to-r from-red-500 to-red-400 text-white shadow-lg dark:from-red-500 dark:to-red-500',
    button: 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-500',
  },
  p1: {
    label: 'High',
    description: 'Important but has a workaround',
    cardActive:
      'border-orange-400 bg-gradient-to-r from-orange-400 to-orange-300 text-white shadow-lg dark:from-orange-500 dark:to-orange-400',
    button: 'bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-500',
  },
  p2: {
    label: 'Medium',
    description: 'Quality-of-life improvement',
    cardActive:
      'border-brand-500 bg-gradient-to-r from-brand-500 via-brand-500 to-brand-400 text-white shadow-lg dark:from-brand-500 dark:to-brand-400',
    button: 'bg-brand-500 hover:bg-brand-600 focus-visible:ring-brand-500',
  },
  p3: {
    label: 'Low',
    description: 'Nice-to-have or research',
    cardActive:
      'border-slate-400 bg-gradient-to-r from-slate-500 to-slate-400 text-white shadow-lg dark:from-slate-500 dark:to-slate-400',
    button: 'bg-slate-500 hover:bg-slate-600 focus-visible:ring-slate-500',
  },
}

export default function SubmitTicket() {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [category, setCategory] = useState<TicketCategory>('feature')
  const [priority, setPriority] = useState<TicketPriority>('p2')
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [attachments, setAttachments] = useState<FileList | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isDemo } = useAuth()

  const supabaseConfigured = Boolean((import.meta as any).env?.VITE_SUPABASE_URL)

  useEffect(() => {
    if (!supabaseConfigured) {
      setUserId('demo-user')
      setUserName('Demo User')
      setUserEmail('demo@stellaestate.local')
      return
    }
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      if (user) {
        setUserId(user.id)
        const fullName = (user.user_metadata?.full_name as string | undefined)?.trim()
        setUserName(fullName || user.email || 'Current user')
        setUserEmail(user.email ?? null)
      }
    })
  }, [supabaseConfigured])

  const submitButtonTone = useMemo(() => priorities[priority].button, [priority])

  const resetForm = () => {
    setCategory('feature')
    setPriority('p2')
    setTitle('')
    setDetails('')
    setAttachments(null)
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isDemo) {
      setError('Demo mode: ticket submission is disabled.')
      return
    }
    setSubmitting(true)
    setError(null)

    const payload = {
      category,
      priority,
      title,
      details,
      attachments: attachments ? Array.from(attachments).map((file) => file.name) : [],
      submittedAt: new Date().toISOString(),
    }
    console.info('Submitting developer ticket', payload)

    if (supabaseConfigured) {
      const { error: insertError } = await supabase.from('developer_requests').insert([
        {
          title,
          details,
          category,
          priority,
          status: 'pending',
          attachments: payload.attachments ?? [],
          submitted_by: userId,
          submitted_name: userName,
          submitted_email: userEmail,
        },
      ])

      if (insertError) {
        console.error(insertError)
        setError(insertError.message ?? 'Failed to submit ticket. Try again.')
        setSubmitting(false)
        return
      }
    } else {
      // Fallback delay so UI feels responsive even without Supabase
      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    setSubmitting(false)
    setSubmitted(true)
    resetForm()
    window.setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Submit a ticket</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Need a new feature, noticed a bug, or want an integration? Share the details and the product team will follow up. Tickets inherit
          your Stella account automatically.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800/70 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {userName ? `Signed in as ${userName}${userEmail ? ` · ${userEmail}` : ''}` : 'Detecting your account…'}
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">Category</span>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {Object.entries(categories).map(([value, label]) => (
                <label
                  key={value}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] ${
                    category === value
                      ? 'border-brand-400/80 bg-brand-50 text-brand-700 shadow-md dark:border-brand-400/80 dark:bg-brand-500/10 dark:text-brand-200'
                      : 'border-slate-200 text-slate-600 hover:border-brand-200 hover:bg-brand-50/60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={value}
                    checked={category === value}
                    onChange={() => setCategory(value as TicketCategory)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium capitalize">{label}</span>
                </label>
              ))}
            </div>
          </label>
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">Priority</span>
            <div className="grid gap-2">
              {Object.entries(priorities).map(([value, meta]) => {
                const isActive = priority === value
                return (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-[1px] ${
                      isActive
                        ? meta.cardActive
                        : 'border-slate-200 text-slate-600 hover:border-amber-200 hover:bg-amber-50/60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-400/50 dark:hover:bg-amber-500/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={value}
                      checked={priority === value}
                      onChange={() => setPriority(value as TicketPriority)}
                      className="sr-only"
                    />
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wide">{meta.label}</span>
                      <p className={`text-xs ${isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>{meta.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </label>
        </div>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enable WhatsApp notifications for new leads"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 dark:border-slate-700 dark:bg-slate-900/40 text-slate-900 placeholder-slate-400 caret-slate-900 dark:text-white dark:placeholder-slate-500 dark:caret-white"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Details</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
            rows={6}
            placeholder="What problem are you seeing? Include URLs, steps to reproduce, or links to designs if you have them."
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none shadow-sm transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 dark:border-slate-700 dark:bg-slate-900/40 text-slate-900 placeholder-slate-400 caret-slate-900 dark:text-white dark:placeholder-slate-500 dark:caret-white"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-200">Attachments</span>
          <input
            type="file"
            multiple
            onChange={(event) => setAttachments(event.target.files)}
            className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 transition hover:border-brand-400 hover:bg-brand-50/60 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Upload screenshots, spreadsheets, or recordings. Attachments sync to the ticket once API integration is enabled.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {submitted ? (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ticket received! We’ll review and follow up.</p>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">Average response time: &lt; 1 business day.</span>
          )}
          <button
            type="submit"
            disabled={submitting || isDemo}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-brand-300 ${submitButtonTone}`}
            title={isDemo ? 'Disabled in demo mode' : undefined}
          >
            {submitting ? 'Sending…' : 'Submit ticket'}
          </button>
        </div>
      </form>
    </div>
  )
}
