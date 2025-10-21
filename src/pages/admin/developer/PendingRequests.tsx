import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../context/AuthContext'

type TicketCategory = 'feature' | 'bug' | 'integration' | 'content' | 'other'
type TicketPriority = 'p0' | 'p1' | 'p2' | 'p3'
type TicketStatus = 'pending' | 'completed' | 'rejected'

type DeveloperRequestReaction = {
  id: string
  request_id: string
  created_by: string | null
  created_name: string | null
  created_email: string | null
  reaction: 'like' | 'dislike'
}

type DeveloperRequestComment = {
  id: string
  request_id: string
  comment: string
  created_at: string
  created_name: string | null
  created_email: string | null
}

type DeveloperRequest = {
  id: string
  title: string
  details: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  submitted_name: string | null
  submitted_email: string | null
  created_at: string
  developer_request_comments?: DeveloperRequestComment[]
  developer_request_reactions?: DeveloperRequestReaction[]
}

const statusMeta: Record<
  TicketStatus,
  { label: string; badge: string; description: string }
> = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    description: 'Waiting on developer capacity. Update with notes or schedule soon.',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    description: 'Shipped! Add a link to release notes or production verification.',
  },
  rejected: {
    label: 'Declined',
    badge: 'bg-slate-200 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
    description: 'Not moving forward. Capture the reasoning so requesters are informed.',
  },
}

const priorityChip: Record<TicketPriority, { label: string; color: string }> = {
  p0: {
    label: 'Critical',
    color: 'bg-red-500/15 text-red-600 ring-1 ring-red-500/30 dark:bg-red-500/20 dark:text-red-200',
  },
  p1: {
    label: 'High',
    color: 'bg-orange-500/15 text-orange-600 ring-1 ring-orange-500/30 dark:bg-orange-500/20 dark:text-orange-200',
  },
  p2: {
    label: 'Medium',
    color: 'bg-brand-500/15 text-brand-600 ring-1 ring-brand-500/30 dark:bg-brand-500/20 dark:text-brand-200',
  },
  p3: {
    label: 'Low',
    color: 'bg-slate-400/15 text-slate-500 ring-1 ring-slate-400/30 dark:bg-slate-500/20 dark:text-slate-200',
  },
}

const fallbackRequests: DeveloperRequest[] = [
  {
    id: 'mock-312',
    title: 'WhatsApp notification bridge for new leads',
    details: 'Marketing wants instant alerts when a lead comes in from landing pages.',
    category: 'feature',
    priority: 'p1',
    status: 'pending',
    submitted_name: 'Stella McIntosh',
    submitted_email: 'stella@stellaestate.com',
    created_at: new Date('2024-10-18T09:35:00Z').toISOString(),
    developer_request_comments: [
      {
        id: 'mock-comment-1',
        request_id: 'mock-312',
        comment: 'Testing webhooks in staging this week.',
        created_at: new Date('2024-10-19T12:00:00Z').toISOString(),
        created_name: 'Marina (Engineering)',
        created_email: 'marina@stellaestate.com',
      },
    ],
    developer_request_reactions: [
      {
        id: 'mock-like-1',
        request_id: 'mock-312',
        created_by: null,
        created_name: 'Ops',
        created_email: null,
        reaction: 'like',
      },
    ],
  },
  {
    id: 'mock-287',
    title: 'MLS import throttling errors',
    details: 'Imports fail each morning with rate limit errors, blocking new listings.',
    category: 'bug',
    priority: 'p0',
    status: 'pending',
    submitted_name: 'Operations',
    submitted_email: 'ops@stellaestate.com',
    created_at: new Date('2024-10-14T15:02:00Z').toISOString(),
  },
  {
    id: 'mock-215',
    title: 'Add Proton Drive option to property docs',
    details: 'Agents using Proton want the vault to push to their secure drive automatically.',
    category: 'feature',
    priority: 'p2',
    status: 'completed',
    submitted_name: 'Diego Ramos',
    submitted_email: 'diego@stellaestate.com',
    created_at: new Date('2024-10-10T10:22:00Z').toISOString(),
  },
  {
    id: 'mock-199',
    title: 'Dark mode for investor portal',
    details: 'Design preference. Putting on ice until Q1 brand refresh.',
    category: 'other',
    priority: 'p3',
    status: 'rejected',
    submitted_name: 'Investor Relations',
    submitted_email: 'investors@stellaestate.com',
    created_at: new Date('2024-10-01T08:00:00Z').toISOString(),
  },
]

export default function PendingRequests() {
  const supabaseConfigured = Boolean((import.meta as any).env?.VITE_SUPABASE_URL)
  const [user, setUser] = useState<{ id: string | null; name: string | null; email: string | null }>({
    id: null,
    name: null,
    email: null,
  })
  const [requests, setRequests] = useState<DeveloperRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [expandedCompleted, setExpandedCompleted] = useState(false)
  const [expandedRejected, setExpandedRejected] = useState(false)
  const { isDemo } = useAuth()

  useEffect(() => {
    if (!supabaseConfigured) {
      setRequests(fallbackRequests)
      setUser({
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@stellaestate.local',
      })
      return
    }
    supabase.auth.getUser().then(({ data }) => {
      const authUser = data.user
      if (authUser) {
        setUser({
          id: authUser.id,
          name: (authUser.user_metadata?.full_name as string | undefined) || authUser.email || 'Current user',
          email: authUser.email ?? null,
        })
      }
    })
  }, [supabaseConfigured])

  const fetchRequests = useCallback(async () => {
    if (!supabaseConfigured) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('developer_requests')
      .select(
        `
        id,
        title,
        details,
        category,
        priority,
        status,
        submitted_name,
        submitted_email,
        created_at,
        developer_request_comments ( id, request_id, comment, created_at, created_name, created_email ),
        developer_request_reactions ( id, request_id, reaction, created_by, created_name, created_email )
      `
      )
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error(fetchError)
      setError(fetchError.message ?? 'Unable to load developer requests.')
      setRequests([])
    } else if (data) {
      setRequests(data as DeveloperRequest[])
    }
    setLoading(false)
  }, [supabaseConfigured])

  useEffect(() => {
    if (supabaseConfigured) {
      fetchRequests()
    }
  }, [fetchRequests, supabaseConfigured])

  const updateLocalRequests = (updater: (prev: DeveloperRequest[]) => DeveloperRequest[]) => {
    setRequests((prev) => updater(prev))
  }

  const handleStatusChange = async (requestId: string, nextStatus: TicketStatus) => {
    if (isDemo) {
      setError('Demo mode: status changes are disabled.')
      return
    }
    if (supabaseConfigured) {
      const { error: updateError } = await supabase
        .from('developer_requests')
        .update({ status: nextStatus })
        .eq('id', requestId)
      if (updateError) {
        console.error(updateError)
        setError(updateError.message ?? 'Unable to update status.')
        return
      }
      fetchRequests()
    } else {
      updateLocalRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: nextStatus } : req))
      )
    }
  }

  const handleReaction = async (requestId: string, reaction: 'like' | 'dislike') => {
    if (isDemo) {
      setError('Demo mode: reactions are disabled.')
      return
    }
    if (!user.id) {
      setError('Sign in to react to requests.')
      return
    }
    const request = requests.find((r) => r.id === requestId)
    const existing = request?.developer_request_reactions?.find((r) => r.created_by === user.id)

    if (supabaseConfigured) {
      if (existing) {
        if (existing.reaction === reaction) {
          await supabase.from('developer_request_reactions').delete().eq('id', existing.id)
        } else {
          await supabase.from('developer_request_reactions').update({ reaction }).eq('id', existing.id)
        }
      } else {
        await supabase.from('developer_request_reactions').insert({
          request_id: requestId,
          reaction,
          created_by: user.id,
          created_name: user.name,
          created_email: user.email,
        })
      }
      fetchRequests()
    } else {
      updateLocalRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req
          const reactions = [...(req.developer_request_reactions ?? [])]
          const currentIndex = reactions.findIndex((r) => r.created_by === user.id)
          if (currentIndex >= 0) {
            if (reactions[currentIndex].reaction === reaction) {
              reactions.splice(currentIndex, 1)
            } else {
              reactions[currentIndex] = {
                ...reactions[currentIndex],
                reaction,
              }
            }
          } else {
            reactions.push({
              id: `local-${Date.now()}`,
              request_id: req.id,
              created_by: user.id,
              created_name: user.name,
              created_email: user.email,
              reaction,
            })
          }
          return { ...req, developer_request_reactions: reactions }
        })
      )
    }
  }

  const handleCommentSubmit = async (requestId: string) => {
    const text = commentDrafts[requestId]?.trim()
    if (!text) return
    if (!user.id && supabaseConfigured) {
      setError('Sign in to add comments.')
      return
    }

    if (isDemo) {
      setError('Demo mode: comments are disabled.')
      return
    }

    if (supabaseConfigured) {
      const { error: insertError } = await supabase.from('developer_request_comments').insert({
        request_id: requestId,
        comment: text,
        created_by: user.id,
        created_name: user.name,
        created_email: user.email,
      })
      if (insertError) {
        console.error(insertError)
        setError(insertError.message ?? 'Unable to add comment.')
        return
      }
      fetchRequests()
    } else {
      updateLocalRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                developer_request_comments: [
                  ...(req.developer_request_comments ?? []),
                  {
                    id: `local-comment-${Date.now()}`,
                    request_id: requestId,
                    comment: text,
                    created_at: new Date().toISOString(),
                    created_name: user.name,
                    created_email: user.email,
                  },
                ],
              }
            : req
        )
      )
    }
    setCommentDrafts((prev) => ({ ...prev, [requestId]: '' }))
  }

  const counts = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'pending')
    const completed = requests.filter((r) => r.status === 'completed')
    const rejected = requests.filter((r) => r.status === 'rejected')
    return { pending, completed, rejected }
  }, [requests])

  const renderRequestCard = (request: DeveloperRequest, compact = false) => {
    const status = statusMeta[request.status]
    const priority = priorityChip[request.priority]
    const reactions = request.developer_request_reactions ?? []
    const likes = reactions.filter((r) => r.reaction === 'like').length
    const dislikes = reactions.filter((r) => r.reaction === 'dislike').length
    const userReaction = reactions.find((r) => r.created_by === user.id)?.reaction
    const comments = request.developer_request_comments ?? []

    return (
      <article
        key={request.id}
        className={`rounded-3xl border border-slate-100 bg-gradient-to-br from-white via-white to-slate-50/70 p-6 shadow-md transition hover:-translate-y-[1px] hover:shadow-lg dark:border-slate-800 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/30 ${
          compact ? 'sm:flex sm:flex-col' : ''
        }`}
      >
        <header className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{new Date(request.created_at).toLocaleDateString()}</span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}>
            {status.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${priority.color}`}>
            {priority.label}
          </span>
          {request.submitted_name && (
            <span className="text-xs text-slate-400">
              {request.submitted_name}
              {request.submitted_email ? ` · ${request.submitted_email}` : ''}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStatusChange(request.id, 'completed')}
              disabled={isDemo}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200"
              title={isDemo ? 'Disabled in demo mode' : undefined}
            >
              Mark completed
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange(request.id, 'rejected')}
              disabled={isDemo}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-200"
              title={isDemo ? 'Disabled in demo mode' : undefined}
            >
              Reject
            </button>
          </div>
        </header>

        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{request.title}</h3>
          {!compact && <p className="text-sm text-slate-600 dark:text-slate-300">{request.details}</p>}
        </div>

        {!compact && (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => handleReaction(request.id, 'like')}
                disabled={isDemo}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  userReaction === 'like'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-600'
                }`}
                title={isDemo ? 'Disabled in demo mode' : undefined}
              >
                👍 {likes}
              </button>
              <button
                type="button"
                onClick={() => handleReaction(request.id, 'dislike')}
                disabled={isDemo}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  userReaction === 'dislike'
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600'
                }`}
                title={isDemo ? 'Disabled in demo mode' : undefined}
              >
                👎 {dislikes}
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {comments.length > 0 && (
                <ul className="space-y-2">
                  {comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>{comment.created_name ?? 'Anonymous'}</span>
                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <p className="mt-1">{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Add a comment
                </label>
                <textarea
                  value={commentDrafts[request.id] ?? ''}
                  onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [request.id]: e.target.value }))}
                  rows={2}
                  placeholder="Share context or an update…"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40 dark:border-slate-600 dark:bg-slate-900"
                />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleCommentSubmit(request.id)}
              disabled={isDemo}
              className="inline-flex items-center rounded-full bg-brand-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              title={isDemo ? 'Disabled in demo mode' : undefined}
            >
              Post comment
            </button>
          </div>
              </div>
            </div>
          </>
        )}

        <footer className="mt-4 text-xs text-slate-500 dark:text-slate-400">{status.description}</footer>
      </article>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Pending requests</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Review requests submitted by the team, add updates, and move them to completed or rejected when decisions are made.
        </p>
        {isDemo && (
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Demo mode · changes disabled
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          Loading requests…
        </div>
      ) : counts.pending.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-6 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          No pending requests. Everything is up to date!
        </div>
      ) : (
        <div className="space-y-4">
          {counts.pending.map((req) => renderRequestCard(req))}
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <button
          type="button"
          onClick={() => setExpandedCompleted((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          Completed requests ({counts.completed.length})
          <span className={`transition-transform ${expandedCompleted ? 'rotate-180' : ''}`}>⌄</span>
        </button>
        {expandedCompleted && (
          <div className="mt-3 space-y-3 px-4 pb-3">
            {counts.completed.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">Nothing shipped yet.</p>
            ) : (
              counts.completed.map((req) => renderRequestCard(req, true))
            )}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
        <button
          type="button"
          onClick={() => setExpandedRejected((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          Rejected requests ({counts.rejected.length})
          <span className={`transition-transform ${expandedRejected ? 'rotate-180' : ''}`}>⌄</span>
        </button>
        {expandedRejected && (
          <div className="mt-3 space-y-3 px-4 pb-3">
            {counts.rejected.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No declined tickets.</p>
            ) : (
              counts.rejected.map((req) => renderRequestCard(req, true))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
