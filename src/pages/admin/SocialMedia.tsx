import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'threads'
  | 'pinterest'
  | 'bluesky'
  | 'mastodon'
  | 'google_business'

type SocialConnector = SocialPlatform

type SocialConnectionStatus = 'connected' | 'pending' | 'error' | 'disconnected'

type SocialConnection = {
  provider: SocialConnector
  status: SocialConnectionStatus
  connectedAt?: string | null
  userId?: string | null
}

type SocialStatus = 'draft' | 'scheduled' | 'queued' | 'published' | 'failed'

type BillingFrequency = 'monthly' | 'yearly'

type SocialPost = {
  id: string
  content: string
  platforms: SocialPlatform[]
  status: SocialStatus
  scheduledAt?: string | null
  postedAt?: string | null
  timezone?: string | null
  mediaUrls?: string[] | null
  campaign?: string | null
  notes?: string | null
  approvalRequired?: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  failureReason?: string | null
  createdAt: string
  updatedAt: string
}

type SocialSubView = 'publishing' | 'analytics' | 'engage' | 'library' | 'pricing'

const platformMeta: Record<SocialPlatform, { label: string; icon: string; limit?: number }> = {
  instagram: { label: 'Instagram', icon: '📸', limit: 2200 },
  facebook: { label: 'Facebook', icon: '📘', limit: 63206 },
  linkedin: { label: 'LinkedIn', icon: '💼', limit: 3000 },
  x: { label: 'X / Twitter', icon: '🐦', limit: 280 },
  tiktok: { label: 'TikTok', icon: '🎵', limit: 2200 },
  youtube: { label: 'YouTube', icon: '▶️', limit: 5000 },
  threads: { label: 'Threads', icon: '🧵', limit: 500 },
  pinterest: { label: 'Pinterest', icon: '📌', limit: 500 },
  bluesky: { label: 'Bluesky', icon: '🌤️', limit: 3000 },
  mastodon: { label: 'Mastodon', icon: '🦣', limit: 5000 },
  google_business: { label: 'Google Business Profile', icon: '📍', limit: 1500 },
}

const statusLabels: Record<SocialStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  queued: 'Queued',
  published: 'Published',
  failed: 'Failed',
}

const subTabs: { key: SocialSubView; label: string; blurb: string }[] = [
  {
    key: 'publishing',
    label: 'Publishing',
    blurb: 'Plan campaigns, assign assets, and keep every channel stocked with content.',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    blurb: 'Measure reach, engagement, and posting cadence without leaving the dashboard.',
  },
  {
    key: 'engage',
    label: 'Engage',
    blurb: 'Centralize comments and DMs so the team can reply faster with context.',
  },
  {
    key: 'library',
    label: 'Content library',
    blurb: 'Store ideas, templates, and evergreen posts ready for reuse.',
  },
  {
    key: 'pricing',
    label: 'Pricing & plans',
    blurb: 'Package the suite for customers as soon as we flip the monetization switch.',
  },
]

type PlanTier = 'starter' | 'essentials' | 'team'

const tierOrder: PlanTier[] = ['starter', 'essentials', 'team']

const planMeta: Record<PlanTier, { name: string; tagline: string; description: string; cta: string; highlight?: boolean }> = {
  starter: {
    name: 'Free',
    tagline: 'Free forever · Connect up to 3 channels',
    description:
      'Perfect for getting started. Keep ten posts in the queue per channel and explore AI-assisted publishing without spending a cent.',
    cta: 'Let’s go',
  },
  essentials: {
    name: 'Essentials',
    tagline: 'Recommended · Everything you need to grow',
    description:
      'Upgrade to unlimited scheduling, advanced analytics, hashtag management, and the engagement inbox built for lean teams.',
    cta: 'Start 14-day free trial',
    highlight: true,
  },
  team: {
    name: 'Team',
    tagline: 'Scale collaboration across unlimited users',
    description:
      'Unlock approvals, access levels, and white-label reporting so agencies and in-house squads can operate at enterprise speed.',
    cta: 'Talk to sales',
  },
}

const planPricing: Record<PlanTier, { monthly: number; yearly: number }> = {
  starter: { monthly: 0, yearly: 0 },
  essentials: { monthly: 6, yearly: 5 },
  team: { monthly: 12, yearly: 10 },
}

const planHighlights: Record<PlanTier, string[]> = {
  starter: [
    '10 scheduled posts per channel — refill anytime',
    '100 ideas saved in the inspiration inbox',
    '1 user account',
    'AI Assistant',
    'Basic analytics',
    'World-class customer support',
  ],
  essentials: [
    'Unlimited scheduled posts per channel',
    'Unlimited ideas',
    '1 user account',
    'AI Assistant',
    'Advanced analytics',
    'Engagement inbox',
    'Hashtag manager',
    'First comment scheduling',
    'World-class customer support',
  ],
  team: [
    'Unlimited scheduled posts per channel',
    'Unlimited ideas',
    'Unlimited user accounts',
    'AI Assistant',
    'Advanced analytics',
    'Engagement inbox',
    'Hashtag manager',
    'First comment scheduling',
    'Access levels & permissions',
    'Content approval workflows',
    'World-class customer support',
  ],
}

const featureMatrix: {
  section: string
  rows: { feature: string; notes?: string; values: Partial<Record<PlanTier, string>> }[]
}[] = [
  {
    section: 'Content creation',
    rows: [
      {
        feature: 'Ideas',
        notes: 'Capture and store content ideas whenever they come to you.',
        values: { starter: '100 ideas', essentials: 'Unlimited', team: 'Unlimited' },
      },
      {
        feature: 'Tags',
        notes: 'Save and reuse hashtags easily.',
        values: { starter: '3 tags', essentials: '250 tags', team: '250 tags' },
      },
      {
        feature: 'Drafts',
        notes: 'Keep early concepts safe until you are ready to schedule.',
        values: { starter: 'Unlimited', essentials: 'Unlimited', team: 'Unlimited' },
      },
      {
        feature: 'Templates',
        notes: 'Social post ideas to spark inspiration.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'AI Assistant',
        notes: 'Refine and repurpose your content using AI. Unlimited credits.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Board view',
        notes: 'Organize your ideas into kanban-style columns.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Browser extension',
        notes: 'Open the studio on any web page and add content directly to your queue.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
    ],
  },
  {
    section: 'Publishing',
    rows: [
      {
        feature: 'Scheduled posts per channel',
        notes: 'Number of posts saved in the queue at one time.',
        values: { starter: '10', essentials: 'Unlimited', team: 'Unlimited' },
      },
      {
        feature: 'Threaded posts',
        notes: 'Publish threads to X, Bluesky, Threads, and Mastodon.',
        values: { starter: '1', essentials: 'Unlimited', team: 'Unlimited' },
      },
      {
        feature: 'Queue',
        notes: 'Reorder, shuffle, or pause your upcoming posts.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Visual content calendar',
        notes: 'See your schedule across weeks or months.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Reminder notifications',
        notes: 'Mobile notifications so you can post natively when needed.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Start Page',
        notes: 'Launch a link-in-bio landing page. Counts as a channel.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Duplicate posts',
        notes: 'Clone high-performing posts to reuse later.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Link shortening',
        notes: 'Automatically shorten links you share.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'First comment scheduling',
        notes: 'Schedule Instagram or LinkedIn first comments.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Channel groups',
        notes: 'Group channels for easy bulk selection when scheduling.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Hashtag manager',
        notes: 'Save, group, and insert hashtags instantly.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Custom video covers',
        notes: 'Choose a thumbnail frame for Facebook, Instagram, and TikTok videos.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
    ],
  },
  {
    section: 'Analytics',
    rows: [
      {
        feature: 'Basic analytics',
        notes: 'Engagement data on individual posts.',
        values: { starter: '30-day history', essentials: 'Unlimited', team: 'Unlimited' },
      },
      {
        feature: 'Performance overview',
        notes: 'Dashboard view of engagements and impressions.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Custom analytics',
        notes: 'Tag content to build bespoke analytics views.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Best time to post',
        notes: 'AI suggestions for what, when, and how often to post.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Audience demographics',
        notes: 'Age, gender, and location insights.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Reports',
        notes: 'Export as spreadsheet, PDF, or images.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Custom UTM parameters',
        notes: 'Set UTM values within the platform to organize traffic data.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Branded reports',
        notes: 'Add your logo and generate cover pages.',
        values: { starter: 'Not included', essentials: 'Not included', team: 'Included' },
      },
    ],
  },
  {
    section: 'Engagement',
    rows: [
      {
        feature: 'Reply to comments',
        notes: 'Reply to Facebook and Instagram comments from the inbox.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Highlight important comments',
        notes: 'Surface questions or negative sentiment automatically.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Hotkeys',
        notes: 'Keyboard hotkeys and smart emojis for speedy replies.',
        values: { starter: 'Not included', essentials: 'Included', team: 'Included' },
      },
    ],
  },
  {
    section: 'Collaboration',
    rows: [
      {
        feature: 'Included users',
        notes: 'Number of users who can contribute content.',
        values: { starter: '1', essentials: '1', team: 'Unlimited' },
      },
      {
        feature: 'Two-factor authentication',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Notes',
        notes: 'Add internal comments to scheduled content.',
        values: { starter: 'Included', essentials: 'Included', team: 'Included' },
      },
      {
        feature: 'Approval workflows',
        values: { starter: 'Not included', essentials: 'Not included', team: 'Included' },
      },
      {
        feature: 'Custom access & permissions',
        values: { starter: 'Not included', essentials: 'Not included', team: 'Included' },
      },
    ],
  },
  {
    section: 'Integrations',
    rows: [
      { feature: 'Canva', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Unsplash', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Dropbox', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Google Drive & Photos', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'One Drive', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Zapier', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'IFTTT', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'WordPress', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Feedly', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Pocket', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Bitly', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
    ],
  },
  {
    section: 'Support',
    rows: [
      { feature: 'Self-service knowledge base', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
      { feature: 'Email support', values: { starter: 'Included', essentials: 'Included', team: 'Included' } },
    ],
  },
]

const testimonials: { quote: string; author: string; role: string }[] = [
  {
    quote:
      'With Stella Social I’m able to save approximately 4–5 hours every week, granting me the freedom to dedicate more of my valuable hours to other important tasks and projects.',
    author: 'CherRaye Glenn-Flowers',
    role: 'Founder, Brownce',
  },
  {
    quote:
      'Scheduling, approvals, and reporting in one place means our listings team never misses a campaign window again.',
    author: 'Lívia Martins',
    role: 'Marketing Lead, Stella Real Estate',
  },
]

const ecosystemColumns: { heading: string; links: string[] }[] = [
  {
    heading: 'Tools',
    links: ['Create', 'Publish', 'Engage', 'Analyze', 'Collaborate'],
  },
  {
    heading: 'Features',
    links: ['AI Assistant', 'Start Page', 'Integrations', 'iOS App', 'Android App', 'Browser Extension'],
  },
  {
    heading: 'Resources',
    links: ['Blog', 'Template Library', 'Social Media Insights', 'Resource Library', 'Social Media Glossary', 'Free Marketing Tools', 'AI Social Media Post Generator'],
  },
  {
    heading: 'Transparency',
    links: ['Open Hub', 'Transparent Metrics', 'Transparent Pricing', 'Transparent Salaries', 'Product Roadmap'],
  },
  {
    heading: 'Support',
    links: ['Help Center', 'Status', 'Changelog', 'Request a Feature'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Press', 'Legal', 'Sitemap'],
  },
]

const connectorCatalog: { provider: SocialConnector; label: string; icon: string }[] = [
  { provider: 'bluesky', label: 'Bluesky', icon: '🌤️' },
  { provider: 'facebook', label: 'Facebook', icon: '📘' },
  { provider: 'google_business', label: 'Google Business Profile', icon: '📍' },
  { provider: 'instagram', label: 'Instagram', icon: '📸' },
  { provider: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { provider: 'mastodon', label: 'Mastodon', icon: '🦣' },
  { provider: 'pinterest', label: 'Pinterest', icon: '📌' },
  { provider: 'threads', label: 'Threads', icon: '🧵' },
  { provider: 'tiktok', label: 'TikTok', icon: '🎵' },
  { provider: 'x', label: 'X', icon: '🐦' },
  { provider: 'youtube', label: 'YouTube', icon: '▶️' },
]

const buildEmptyConnections = (): Record<SocialConnector, SocialConnection> => {
  const map: Record<SocialConnector, SocialConnection> = {} as Record<SocialConnector, SocialConnection>
  connectorCatalog.forEach((connector) => {
    map[connector.provider] = {
      provider: connector.provider,
      status: 'disconnected',
      connectedAt: null,
    }
  })
  return map
}

const faqs: { question: string; answer: string }[] = [
  {
    question: 'Which networks are supported today?',
    answer:
      'Scheduling works for every channel listed above. Direct auto-publish is staged for Instagram, Facebook, X, LinkedIn, Threads, TikTok, YouTube, Pinterest, and Bluesky. Until the APIs are live you can use reminder notifications with upload-ready assets.',
  },
  {
    question: 'How do billing and channels work?',
    answer:
      'Every connected profile counts as one channel. The Starter tier includes three channels for free. Paid tiers bill per channel, annually or monthly, and you can add or remove seats anytime.',
  },
  {
    question: 'Do we offer trials and nonprofit pricing?',
    answer:
      'Essentials and Team include a 14-day trial. Nonprofits and schools qualify for a standing 35% discount—just reach out once your workspace is live.',
  },
  {
    question: 'What happens when the trial ends?',
    answer:
      'If you do nothing the workspace drops back to the Starter limits, so your queue remains intact but new scheduled posts pause until you pick a plan.',
  },
]

function mapRow(row: any): SocialPost {
  return {
    id: row.id,
    content: row.content,
    platforms: Array.isArray(row.platforms) ? (row.platforms as SocialPlatform[]) : [],
    status: (row.status || 'draft') as SocialStatus,
    scheduledAt: row.scheduled_at,
    postedAt: row.posted_at,
    timezone: row.timezone,
    mediaUrls: row.media_urls ?? undefined,
    campaign: row.campaign ?? null,
    notes: row.notes ?? null,
    approvalRequired: row.approval_required ?? false,
    approvalStatus: row.approval_status ?? undefined,
    failureReason: row.failure_reason ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toDatetimeLocal(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function SocialMedia() {
  const supabaseConfigured = Boolean(
    (import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY,
  )
  const [session, setSession] = useState<Session | null>(null)
  const [teamMemberId, setTeamMemberId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(supabaseConfigured)
  const [error, setError] = useState<string | null>(null)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [activeTab, setActiveTab] = useState<SocialSubView>('publishing')
  const [billing, setBilling] = useState<BillingFrequency>('yearly')
  const [channelCount, setChannelCount] = useState<number>(3)
  const { isDemo } = useAuth()

  const [content, setContent] = useState('')
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([])
  const [scheduledAt, setScheduledAt] = useState<string>('')
  const [timezone, setTimezone] = useState<string>(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [timezoneManuallySet, setTimezoneManuallySet] = useState(false)
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [mediaInput, setMediaInput] = useState('')
  const [campaign, setCampaign] = useState('')
  const [notes, setNotes] = useState('')
  const [approvalRequired, setApprovalRequired] = useState(false)
  const [connections, setConnections] = useState<Record<SocialConnector, SocialConnection>>(() => buildEmptyConnections())

  const [statusFilter, setStatusFilter] = useState<'all' | SocialStatus>('all')
  const [platformFilter, setPlatformFilter] = useState<'all' | SocialPlatform>('all')
  const [search, setSearch] = useState('')

  const formatCurrency = useCallback((value: number) => {
    return value.toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    })
  }, [])

  const getPlanPricingSummary = useCallback(
    (tier: PlanTier) => {
      if (tier === 'starter') {
        return {
          perChannel: 'Free',
          billed: 'Free forever',
        }
      }
      const unit = planPricing[tier][billing]
      const billedTotal = billing === 'monthly' ? unit * channelCount : unit * channelCount * 12
      const perChannelLabel = `${formatCurrency(unit)} /mo per channel`
      const billedLabel =
        billing === 'monthly'
          ? `${formatCurrency(unit * channelCount)} billed monthly`
          : `${formatCurrency(billedTotal)} billed yearly (save 2 months)`
      return {
        perChannel: perChannelLabel,
        billed: billedLabel,
      }
    },
    [billing, channelCount, formatCurrency],
  )

  const togglePlatform = (key: SocialPlatform) => {
    if (connections[key]?.status !== 'connected') {
      setError(`Connect ${platformMeta[key]?.label ?? key} before scheduling on it.`)
      return
    }
    setError(null)
    setPlatforms((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]))
  }

  const updateLocalConnection = (provider: SocialConnector, status: SocialConnectionStatus) => {
    setConnections((prev) => {
      const next = { ...prev }
      const existing = prev[provider]
      next[provider] = {
        ...existing,
        provider,
        status,
        connectedAt: status === 'connected' ? new Date().toISOString() : null,
      }
      return next
    })
  }

  const handleConnect = async (provider: SocialConnector) => {
    if (supabaseConfigured && !session && !isDemo) {
      setError('Sign in to connect social accounts.')
      return
    }

    if (!supabaseConfigured || !session || isDemo) {
      const current = connections[provider]?.status ?? 'disconnected'
      updateLocalConnection(provider, current === 'connected' ? 'disconnected' : 'connected')
      setError(null)
      return
    }

    const currentStatus = connections[provider]?.status ?? 'disconnected'

    if (currentStatus === 'connected') {
      const { error: disconnectError } = await supabase
        .from('social_connections')
        .delete()
        .eq('user_id', session.user.id)
        .eq('provider', provider)

      if (disconnectError) {
        setError(disconnectError.message ?? 'Unable to disconnect account.')
        return
      }

      updateLocalConnection(provider, 'disconnected')
      setError(null)
      return
    }

    const payload = {
      user_id: session.user.id,
      provider,
      status: 'connected' as const,
      connected_at: new Date().toISOString(),
    }

    const { error: connectError } = await supabase
      .from('social_connections')
      .upsert(payload, { onConflict: 'user_id,provider' })

    if (connectError) {
      setError(connectError.message ?? 'Unable to connect account.')
      return
    }

    updateLocalConnection(provider, 'connected')
    setError(null)
  }

  const loadSession = useCallback(async () => {
    if (!supabaseConfigured) return
    const { data } = await supabase.auth.getSession()
    setSession(data.session ?? null)
    if (data.session) {
      const { data: member } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', data.session.user.id)
        .maybeSingle()
      setTeamMemberId(member?.id ?? null)
    } else {
      setTeamMemberId(null)
    }
  }, [supabaseConfigured])

  const loadPosts = useCallback(async () => {
    if (!supabaseConfigured) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('social_posts')
      .select(
        'id, content, platforms, status, scheduled_at, posted_at, timezone, media_urls, campaign, notes, approval_required, approval_status, failure_reason, created_at, updated_at',
      )
      .order('scheduled_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message ?? 'Unable to load scheduled posts.')
      setPosts([])
    } else {
      setPosts((data ?? []).map(mapRow))
    }
    setLoading(false)
  }, [supabaseConfigured])

  useEffect(() => {
    if (!supabaseConfigured) return
    void loadSession()
  }, [loadSession, supabaseConfigured])

  useEffect(() => {
    if (!supabaseConfigured) return
    void loadPosts()
  }, [loadPosts, supabaseConfigured])

  useEffect(() => {
    if (timezoneManuallySet) return
    if (typeof fetch === 'undefined') return
    let active = true
    const detectTimezone = async () => {
      try {
        const response = await fetch('https://worldtimeapi.org/api/ip')
        if (!response.ok) return
        const data = await response.json()
        const tz: string | undefined = data?.timezone || data?.time_zone || data?.timezone_name
        if (tz && active) {
          setTimezone(tz)
        }
      } catch (_err) {
        // Ignore failures; fall back to browser-detected timezone
      }
    }
    void detectTimezone()
    return () => {
      active = false
    }
  }, [timezoneManuallySet])

  useEffect(() => {
    if (!supabaseConfigured) {
      return
    }
    if (!session) {
      setConnections(buildEmptyConnections())
      return
    }
    let active = true
    const fetchConnections = async () => {
      const { data, error: fetchError } = await supabase
        .from('social_connections')
        .select('provider,status,connected_at')
        .eq('user_id', session.user.id)

      if (!active) return

      if (fetchError) {
        setError(fetchError.message ?? 'Unable to load social connections.')
        return
      }

      const map = buildEmptyConnections()
      data?.forEach((row: any) => {
        const provider = row.provider as SocialConnector
        if (map[provider]) {
          map[provider] = {
            provider,
            status: (row.status as SocialConnectionStatus) ?? 'connected',
            connectedAt: row.connected_at,
            userId: session.user.id,
          }
        }
      })
      setConnections(map)
    }
    void fetchConnections()
    return () => {
      active = false
    }
  }, [session, supabaseConfigured])

  const connectedPlatforms = useMemo<SocialPlatform[]>(() => {
    return connectorCatalog
      .filter((connector) => connections[connector.provider]?.status === 'connected')
      .map((connector) => connector.provider)
  }, [connections])

  useEffect(() => {
    if (!connectedPlatforms.length) {
      setPlatforms([])
      return
    }
    setPlatforms((prev) => {
      if (!prev.length) return prev
      const filtered = prev.filter((platform) => connectedPlatforms.includes(platform))
      if (filtered.length === prev.length) return prev
      if (filtered.length) return filtered
      return [connectedPlatforms[0]]
    })
  }, [connectedPlatforms])

  const composerReady = connectedPlatforms.length > 0
  const scheduleDisabled = isDemo || !composerReady || !platforms.length || !content.trim()

  const resetComposer = () => {
    setContent('')
    setPlatforms(connectedPlatforms.length ? [connectedPlatforms[0]] : [])
    setScheduledAt('')
    setMediaUrls([])
    setMediaInput('')
    setCampaign('')
    setNotes('')
    setApprovalRequired(false)
  }

  const handleTimezoneChange = (value: string) => {
    setTimezone(value)
    setTimezoneManuallySet(true)
  }

  const resetTimezoneToAuto = () => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    setTimezoneManuallySet(false)
  }

  const handleAddMedia = () => {
    const trimmed = mediaInput.trim()
    if (!trimmed) return
    setMediaUrls((prev) => [...prev, trimmed])
    setMediaInput('')
  }

  const handleCreate = async () => {
    if (!content.trim()) {
      setError('Write something before scheduling a post.')
      return
    }
    if (platforms.length === 0) {
      setError('Select at least one connected platform.')
      return
    }
    const disconnectedSelections = platforms.filter((platform) => connections[platform]?.status !== 'connected')
    if (disconnectedSelections.length) {
      setError('One or more selected platforms are not connected. Connect them first.')
      return
    }

    if (isDemo) {
      setError('Demo mode: publishing is disabled.')
      return
    }

    const scheduledIso = scheduledAt ? new Date(scheduledAt).toISOString() : null
    const status: SocialStatus = scheduledIso ? 'scheduled' : 'draft'

    if (!supabaseConfigured) {
      const now = new Date().toISOString()
      setPosts((prev) => [
        {
          id: 'local-' + Math.random().toString(36).slice(2, 9),
          content: content.trim(),
          platforms,
          status,
          scheduledAt: scheduledIso,
          timezone,
          mediaUrls,
          campaign: campaign || null,
          notes: notes || null,
          approvalRequired,
          approvalStatus: approvalRequired ? 'pending' : 'approved',
          createdAt: now,
          updatedAt: now,
        },
        ...prev,
      ])
      resetComposer()
      setError(null)
      return
    }

    const { data, error: insertError } = await supabase
      .from('social_posts')
      .insert({
        content: content.trim(),
        platforms,
        status,
        scheduled_at: scheduledIso,
        timezone,
        media_urls: mediaUrls,
        campaign: campaign || null,
        notes: notes || null,
        approval_required: approvalRequired,
        approval_status: approvalRequired ? 'pending' : 'approved',
        created_by: session?.user.id ?? null,
        owner_id: teamMemberId,
      })
      .select(
        'id, content, platforms, status, scheduled_at, posted_at, timezone, media_urls, campaign, notes, approval_required, approval_status, failure_reason, created_at, updated_at',
      )
      .single()

    if (insertError) {
      setError(insertError.message ?? 'Failed to schedule post.')
      return
    }

    setPosts((prev) => [mapRow(data), ...prev])
    resetComposer()
    setError(null)
  }

  const updateStatus = async (id: string, nextStatus: SocialStatus) => {
    if (isDemo) {
      setError('Demo mode: status updates are disabled.')
      return
    }
    if (!supabaseConfigured) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                status: nextStatus,
                postedAt: nextStatus === 'published' ? new Date().toISOString() : post.postedAt,
                updatedAt: new Date().toISOString(),
                failureReason:
                  nextStatus === 'failed'
                    ? post.failureReason || 'Manual follow-up required.'
                    : null,
              }
            : post,
        ),
      )
      return
    }

    const payload: Record<string, any> = { status: nextStatus, updated_at: new Date().toISOString() }
    if (nextStatus === 'published') {
      payload.posted_at = new Date().toISOString()
      payload.failure_reason = null
    } else if (nextStatus === 'failed') {
      payload.failure_reason = 'Manual follow-up required.'
    }

    const { data, error: updateError } = await supabase
      .from('social_posts')
      .update(payload)
      .eq('id', id)
      .select(
        'id, content, platforms, status, scheduled_at, posted_at, timezone, media_urls, campaign, notes, approval_required, approval_status, failure_reason, created_at, updated_at',
      )
      .single()

    if (updateError) {
      setError(updateError.message ?? 'Unable to update post status.')
      return
    }

    setPosts((prev) => prev.map((post) => (post.id === id ? mapRow(data) : post)))
    setError(null)
  }

  const deletePost = async (id: string) => {
    if (isDemo) {
      setError('Demo mode: deleting posts is disabled.')
      return
    }
    if (!supabaseConfigured) {
      setPosts((prev) => prev.filter((post) => post.id !== id))
      return
    }
    const { error: deleteError } = await supabase.from('social_posts').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message ?? 'Unable to delete post.')
      return
    }
    setPosts((prev) => prev.filter((post) => post.id !== id))
  }

  const duplicatePost = (post: SocialPost) => {
    setContent(post.content)
    setPlatforms(post.platforms)
    setScheduledAt(post.scheduledAt ? toDatetimeLocal(post.scheduledAt) : '')
    setTimezone(post.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
    setMediaUrls(post.mediaUrls ?? [])
    setCampaign(post.campaign || '')
    setNotes(post.notes || '')
    setApprovalRequired(Boolean(post.approvalRequired))
    setActiveTab('publishing')
  }

  const filtered: SocialPost[] = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter
      const matchesPlatform = platformFilter === 'all' || post.platforms.includes(platformFilter)
      const matchesQuery =
        !q ||
        post.content.toLowerCase().includes(q) ||
        (post.campaign?.toLowerCase().includes(q) ?? false) ||
        (post.notes?.toLowerCase().includes(q) ?? false)
      return matchesStatus && matchesPlatform && matchesQuery
    })
  }, [posts, statusFilter, platformFilter, search])

  const stats = useMemo(() => {
    const totals: Record<SocialStatus, number> = {
      draft: 0,
      scheduled: 0,
      queued: 0,
      published: 0,
      failed: 0,
    }
    posts.forEach((post) => {
      totals[post.status] += 1
    })
    return totals
  }, [posts])

  const upcoming = useMemo(() => {
    const now = Date.now()
    return posts
      .filter((post) => post.scheduledAt && new Date(post.scheduledAt).getTime() >= now)
      .sort((a, b) => new Date(a.scheduledAt ?? 0).getTime() - new Date(b.scheduledAt ?? 0).getTime())
      .slice(0, 8)
  }, [posts])

  const analyticsByPlatform = useMemo(() => {
    const base: Record<SocialPlatform, { total: number; published: number; drafts: number }> = {
      instagram: { total: 0, published: 0, drafts: 0 },
      facebook: { total: 0, published: 0, drafts: 0 },
      linkedin: { total: 0, published: 0, drafts: 0 },
      x: { total: 0, published: 0, drafts: 0 },
      tiktok: { total: 0, published: 0, drafts: 0 },
      youtube: { total: 0, published: 0, drafts: 0 },
      threads: { total: 0, published: 0, drafts: 0 },
      pinterest: { total: 0, published: 0, drafts: 0 },
      bluesky: { total: 0, published: 0, drafts: 0 },
      mastodon: { total: 0, published: 0, drafts: 0 },
      google_business: { total: 0, published: 0, drafts: 0 },
    }
    posts.forEach((post) => {
      post.platforms.forEach((platform) => {
        base[platform].total += 1
        if (post.status === 'published') base[platform].published += 1
        if (post.status === 'draft' || post.status === 'queued') base[platform].drafts += 1
      })
    })
    return base
  }, [posts])

  const publishingView = (
    <>
      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Channel connections</h2>
            <p className="text-sm text-slate-500">Connect a social account to unlock scheduling for that platform.</p>
            {!supabaseConfigured && (
              <p className="text-xs text-slate-400">Local sandbox mode: connections are stored in-memory until refresh.</p>
            )}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {connectedPlatforms.length}/{connectorCatalog.length} connected
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {connectorCatalog.map((connector) => {
            const connection = connections[connector.provider]
            const status = connection?.status ?? 'disconnected'
            const isConnected = status === 'connected'
            const statusLabel =
              status === 'connected'
                ? 'Connected'
                : status === 'pending'
                ? 'Pending'
                : status === 'error'
                ? 'Needs attention'
                : 'Not connected'
            const badgeClass = isConnected
              ? 'bg-emerald-100 text-emerald-700'
              : status === 'error'
              ? 'bg-red-100 text-red-700'
              : status === 'pending'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-400'
            const connectedAtLabel = isConnected && connection?.connectedAt
              ? `Since ${new Date(connection.connectedAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}`
              : 'Not yet connected'
            return (
              <div key={connector.provider} className="rounded-xl border border-slate-700/60 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{connector.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{connector.label}</div>
                      <div className="text-xs text-slate-500">{connectedAtLabel}</div>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${badgeClass}`}>{statusLabel}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleConnect(connector.provider)}
                  disabled={isDemo}
                  className={`mt-4 w-full rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                    isConnected
                      ? 'border border-slate-700/60 text-slate-400 hover:bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg'
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                  title={isDemo ? 'Disabled in demo mode' : undefined}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Compose</h2>
            <p className="text-sm text-slate-500">
              Plan once, distribute everywhere. Tailor voice per network after the publish workflow lands.
            </p>
          </div>
          <div className="flex flex-col gap-1 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Timezone</span>
              <input
                value={timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="w-40 rounded border border-slate-700/60 px-2 py-1"
                placeholder="UTC"
              />
              <button
                type="button"
                onClick={resetTimezoneToAuto}
                className="rounded-full border border-slate-700/60 px-2 py-1 text-[11px] font-semibold text-slate-400 hover:bg-slate-100"
              >
                Auto-detect
              </button>
            </div>
            <span className="text-[11px] text-slate-500">
              {timezoneManuallySet ? 'Manual override active.' : 'Detected automatically from your IP address.'}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-400">
                Primary copy
                <span className="text-[10px] text-slate-400">{content.length} characters</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="mt-2 w-full rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-2 text-sm shadow-inner focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Announce something great..."
              />
            </div>

            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Platforms</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(platformMeta) as SocialPlatform[]).map((key) => {
                  const selected = platforms.includes(key)
                  const meta = platformMeta[key]
                  const isConnected = connections[key]?.status === 'connected'
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePlatform(key)}
                      disabled={!isConnected}
                      title={isConnected ? '' : 'Connect this channel above to enable scheduling.'}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm transition ${
                        !isConnected
                          ? 'cursor-not-allowed border-dashed border-slate-700/60 bg-slate-100 text-slate-400'
                          : selected
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </button>
                  )
                })}
              </div>
              {!composerReady && (
                <p className="text-xs text-amber-600">Connect at least one channel above to enable scheduling.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Schedule
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-2 text-sm focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </label>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Campaign tag
                <input
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="Autumn launch"
                  className="mt-2 w-full rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-2 text-sm focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
              </label>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Internal notes
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-2 text-sm focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  placeholder="Call-to-action options, asset references..."
                />
              </label>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-50 px-4 py-3 text-sm text-slate-400">
              <div>
                <div className="font-medium text-slate-200">Approval required?</div>
                <p className="text-xs text-slate-500">Flag for review so leadership signs off before publishing.</p>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={approvalRequired}
                  onChange={(e) => setApprovalRequired(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700/60 text-sky-600 focus:ring-indigo-500/40"
                />
                Required
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-4 text-sm text-slate-400">
              <div className="font-semibold text-slate-200">Media bucket</div>
              <p className="mt-1 text-xs text-slate-500">
                Paste URLs to creative assets (Supabase storage, Drive, etc.). Drag-and-drop upload is on the roadmap.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={mediaInput}
                  onChange={(e) => setMediaInput(e.target.value)}
                  placeholder="https://"
                  className="flex-1 rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="rounded-lg bg-sky-600 px-3 py-1 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Add
                </button>
              </div>
              {mediaUrls.length > 0 && (
                <ul className="mt-3 space-y-2 text-xs">
                  {mediaUrls.map((url, idx) => (
                    <li key={url} className="flex items-center justify-between gap-2">
                      <span className="truncate">{idx + 1}. {url}</span>
                      <button
                        type="button"
                        onClick={() => setMediaUrls((prev) => prev.filter((item) => item !== url))}
                        className="text-[11px] font-medium uppercase text-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={handleCreate}
              disabled={scheduleDisabled}
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              title={isDemo ? 'Disabled in demo mode' : undefined}
            >
              {scheduledAt ? 'Schedule post' : 'Save draft'}
            </button>
            <button
              type="button"
              onClick={resetComposer}
              className="rounded-xl border border-slate-700/60 px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Upcoming queue</h2>
            <p className="text-sm text-slate-500">Next scheduled posts across every channel.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-1"
            >
              <option value="all">All statuses</option>
              {(Object.keys(statusLabels) as SocialStatus[]).map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-1"
            >
              <option value="all">All platforms</option>
              {(Object.keys(platformMeta) as SocialPlatform[]).map((platform) => (
                <option key={platform} value={platform}>
                  {platformMeta[platform].label}
                </option>
              ))}
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search copy / campaign"
              className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg px-3 py-1"
            />
          </div>
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading schedule…</p>
        ) : posts.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">No posts yet. Draft something above.</p>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {upcoming.length > 0 ? (
              upcoming.map((post) => (
                <article key={post.id} className="flex h-full flex-col justify-between rounded-xl border border-slate-700/60 bg-slate-50 p-4">
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {post.scheduledAt
                          ? new Date(post.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                          : 'Draft'}
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        {post.platforms.map((platform) => platformMeta[platform]?.icon ?? '').join(' ')}{' '}
                        {post.platforms.map((platform) => platformMeta[platform]?.label).join(', ')}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${
                        post.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : post.status === 'scheduled'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {statusLabels[post.status]}
                    </span>
                  </header>
                  <div className="mt-3 whitespace-pre-line text-sm text-slate-200 line-clamp-4">{post.content}</div>
                  {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="mt-3 text-xs text-slate-500">
                      Assets:
                      <ul className="mt-1 space-y-1">
                        {post.mediaUrls.map((url) => (
                          <li key={url} className="truncate">
                            <a href={url} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <footer className="mt-4 flex items-center justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => duplicatePost(post)}
                      className="rounded border border-slate-700/60 px-3 py-1 text-slate-400 hover:bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg"
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(post.id, 'published')}
                      className="rounded border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-100"
                    >
                      Mark published
                    </button>
                  </footer>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-500">No scheduled posts coming up.</p>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <h2 className="text-lg font-semibold">All posts</h2>
        <p className="text-sm text-slate-500">Master list with status controls and quick actions.</p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Content</th>
                <th className="px-3 py-2 text-left">Platforms</th>
                <th className="px-3 py-2 text-left">Scheduled</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Campaign</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-t border-slate-700/60 text-sm">
                  <td className="max-w-sm px-3 py-2 align-top">
                    <div className="whitespace-pre-line text-slate-200 line-clamp-4">{post.content}</div>
                    {post.notes && <div className="mt-2 text-xs text-slate-500">Notes: {post.notes}</div>}
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-400">
                    <div className="flex flex-wrap gap-1">
                      {post.platforms.map((platform) => (
                        <span key={platform} className="rounded-full bg-slate-100 px-2 py-0.5">
                          {platformMeta[platform]?.icon} {platformMeta[platform]?.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-500">
                    {post.scheduledAt
                      ? new Date(post.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                      : '—'}
                  </td>
                  <td className="px-3 py-2 align-top text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold uppercase ${
                        post.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : post.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700'
                          : post.status === 'scheduled'
                          ? 'bg-sky-100 text-sky-700'
                          : post.status === 'queued'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {statusLabels[post.status]}
                    </span>
                    {post.approvalRequired && (
                      <div className="mt-1 text-[10px] uppercase tracking-wide text-amber-600">Awaiting approval</div>
                    )}
                    {post.failureReason && <div className="mt-1 text-[10px] text-red-600">{post.failureReason}</div>}
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-slate-500">{post.campaign || '—'}</td>
                  <td className="px-3 py-2 align-top text-xs text-slate-400">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => duplicatePost(post)}
                        className="rounded border border-slate-700/60 px-2 py-1 hover:bg-slate-50"
                      >
                        Duplicate
                      </button>
                      {post.status !== 'published' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(post.id, 'published')}
                          disabled={isDemo}
                          className="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title={isDemo ? 'Disabled in demo mode' : undefined}
                        >
                          Mark published
                        </button>
                      )}
                      {post.status !== 'failed' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(post.id, 'failed')}
                          disabled={isDemo}
                          className="rounded border border-red-200 bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          title={isDemo ? 'Disabled in demo mode' : undefined}
                        >
                          Flag failed
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deletePost(post.id)}
                        disabled={isDemo}
                        className="rounded border border-slate-700/60 px-2 py-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title={isDemo ? 'Disabled in demo mode' : undefined}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )

  const analyticsView = (
    <>
      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Performance overview</h2>
            <p className="text-sm text-slate-500">
              We will stream real metrics once the network APIs are wired. Today you can track output volume, cadence, and publishing mix.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wide text-slate-500">Published</div>
              <div className="mt-1 text-2xl font-semibold text-slate-100">{stats.published}</div>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wide text-slate-500">Scheduled</div>
              <div className="mt-1 text-2xl font-semibold text-slate-100">{stats.scheduled + stats.queued}</div>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wide text-slate-500">Drafts</div>
              <div className="mt-1 text-2xl font-semibold text-slate-100">{stats.draft}</div>
            </div>
            <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wide text-slate-500">Attention needed</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">{stats.failed}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 shadow-inner">
            <h3 className="text-sm font-semibold text-slate-700">Platform mix</h3>
            <p className="text-xs text-slate-500">Total scheduled + published posts for each network.</p>
            <ul className="mt-4 space-y-3">
              {(Object.keys(analyticsByPlatform) as SocialPlatform[]).map((platform) => {
                const metrics = analyticsByPlatform[platform]
                const total = metrics.total || 1
                const publishedPct = Math.round((metrics.published / total) * 100)
                return (
                  <li key={platform} className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">
                        {platformMeta[platform].icon} {platformMeta[platform].label}
                      </span>
                      <span className="text-xs text-slate-500">{metrics.total} posts</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-sky-500"
                        style={{ width: `${publishedPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{metrics.published} published</span>
                      <span>{metrics.drafts} awaiting</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 shadow-inner">
            <h3 className="text-sm font-semibold text-slate-700">Publishing cadence</h3>
            <p className="text-xs text-slate-500">
              Visual summary of the next 14 days. Auto-scheduling will populate this chart with best-time recommendations.
            </p>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs">
              {Array.from({ length: 14 }).map((_, index) => {
                const day = new Date()
                day.setDate(day.getDate() + index)
                const iso = day.toISOString().slice(0, 10)
                const postsForDay = posts.filter((post) => post.scheduledAt && post.scheduledAt.startsWith(iso))
                return (
                  <div key={iso} className="flex flex-col items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-50 px-2 py-3">
                    <div className="font-medium text-slate-400">{day.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                    <div className="text-lg font-semibold text-slate-100">{postsForDay.length}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <h2 className="text-lg font-semibold">Report templates</h2>
        <p className="text-sm text-slate-500">Coming soon: export to CSV, PDF, or branded decks. For now, use these sections as a checklist.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {['Engagement snapshot', 'Audience growth', 'Experiment tracker'].map((card) => (
            <div key={card} className="rounded-xl border border-slate-700/60 bg-slate-50 p-4 text-sm text-slate-400">
              <div className="text-base font-semibold text-slate-200">{card}</div>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Pull metrics from scheduled posts once publish API is ready.</li>
                <li>Tag campaigns for custom breakouts.</li>
                <li>Export to share with leadership.</li>
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )

  const engageView = (
    <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
      <h2 className="text-lg font-semibold">Engagement inbox (coming soon)</h2>
      <p className="text-sm text-slate-500">
        Aggregate comments and messages from Instagram, Facebook, LinkedIn, Threads, and X. We will mirror Buffer&apos;s unified inbox once API scopes are approved.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-700">Live queue preview</h3>
          <p className="text-xs text-slate-500">These are recent posts that will pull in replies once the webhook layer is online.</p>
          <ul className="mt-3 space-y-3 text-sm">
            {posts.slice(0, 6).map((post) => (
              <li key={post.id} className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {post.platforms.map((platform) => platformMeta[platform]?.label).join(', ') || '—'}
                </div>
                <div className="mt-1 text-slate-200 line-clamp-3">{post.content}</div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{post.scheduledAt ? new Date(post.scheduledAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Draft'}</span>
                  <span className="font-semibold text-slate-700">{statusLabels[post.status]}</span>
                </div>
              </li>
            ))}
            {posts.length === 0 && <li className="text-xs text-slate-500">Schedule content to populate the inbox.</li>}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-700">Workflow roadmap</h3>
          <div className="mt-3 space-y-3 text-sm text-slate-400">
            <div className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stage 1</div>
              <div>Fetch comments via Supabase Edge Functions, sync into `social_post_events`, and surface SLA timers.</div>
            </div>
            <div className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stage 2</div>
              <div>Reply inside the dashboard with canned responses, sentiment tagging, and internal notes for handoffs.</div>
            </div>
            <div className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Stage 3</div>
              <div>Escalate conversations into CRM opportunities or service tickets with one click.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const libraryView = (
    <section className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
      <h2 className="text-lg font-semibold">Content library</h2>
      <p className="text-sm text-slate-500">Organize ideas, templates, and evergreen posts so every launch has a head start.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700">Idea inbox</h3>
            <p className="text-xs text-slate-500">Latest drafts (auto-generated from your saved posts).</p>
            <ul className="mt-3 space-y-3 text-sm">
              {posts.slice(0, 8).map((post) => (
                <li key={post.id} className="rounded-lg border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">{post.campaign || 'General'}</div>
                  <div className="mt-1 text-slate-200 line-clamp-3">{post.content}</div>
                  <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                    <span>{post.platforms.map((platform) => platformMeta[platform]?.icon).join(' ')}</span>
                    <button
                      type="button"
                      onClick={() => duplicatePost(post)}
                      className="font-medium text-sky-600 hover:underline"
                    >
                      Load in composer
                    </button>
                  </div>
                </li>
              ))}
              {posts.length === 0 && <li className="text-xs text-slate-500">Draft a post to seed the library.</li>}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700">Template starter kit</h3>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-slate-400">
              <li>Brand launch announcement</li>
              <li>Property spotlight carousel</li>
              <li>Client testimonial quote</li>
              <li>Agent recruitment pitch</li>
              <li>Market snapshot infographic</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">Import your own templates via CSV or connect to Google Drive.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 shadow-inner">
            <h3 className="text-sm font-semibold text-slate-700">Tag manager</h3>
            <p className="text-xs text-slate-500">Keep branding hashtags ready to drop into the composer.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['#stellaRealEstate', '#luxuryhomes', '#marketwatch', '#teamlife', '#behindthescenes'].map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-400">{tag}</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-4 shadow-inner">
            <h3 className="text-sm font-semibold text-slate-700">Workflow checklists</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>🗂️ Assign owner & reviewer</li>
              <li>🖼️ Attach media from Drive or Supabase storage</li>
              <li>📝 Add CTA + campaign tag</li>
              <li>✅ Request approval if required</li>
              <li>📆 Schedule & confirm reminders</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )

  const pricingView = (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Flexible pricing for everyone</h2>
            <p className="mt-2 text-sm text-slate-400">
              Pick how many channels you want to manage and whether you want monthly or yearly billing. Prices update instantly—no hidden fees, ever.
            </p>
          </div>
          <div className="rounded-xl border border-slate-700/60 bg-slate-50 p-4 text-sm text-slate-400">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Channels</span>
              <span className="text-base font-semibold text-slate-100">{channelCount} {channelCount === 1 ? 'channel' : 'channels'}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={channelCount}
              onChange={(e) => setChannelCount(Number(e.target.value))}
              className="mt-3 w-full"
            />
            <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Billing frequency</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setBilling('monthly')}
                  className={`rounded-full px-3 py-1 ${
                    billing === 'monthly'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('yearly')}
                  className={`rounded-full px-3 py-1 ${
                    billing === 'yearly'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Yearly <span className="hidden sm:inline">(save 2 months)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {tierOrder.map((tier) => {
            const summary = getPlanPricingSummary(tier)
            return (
              <div key={`${tier}-summary`} className="rounded-xl border border-slate-700/60 bg-slate-50 p-4 text-sm text-slate-400">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{planMeta[tier].name}</div>
                <div className="mt-2 text-base font-semibold text-slate-100">{summary.perChannel}</div>
                <div className="text-xs text-slate-500">{summary.billed}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="mt-2 grid gap-4 lg:grid-cols-3">
          {tierOrder.map((tier) => {
            const meta = planMeta[tier]
            const summary = getPlanPricingSummary(tier)
            return (
              <div
                key={tier}
                className={`flex h-full flex-col rounded-2xl border ${
                  meta.highlight ? 'border-sky-500 bg-sky-50 shadow-lg' : 'border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg'
                } p-6`}
              >
                <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">{meta.name}</div>
                <div className="mt-1 text-xs text-slate-500">{meta.tagline}</div>
                <div className="mt-4 text-lg font-semibold text-slate-100">{summary.perChannel}</div>
                <div className="text-xs text-slate-500">{summary.billed}</div>
                <p className="mt-4 text-sm text-slate-400">{meta.description}</p>
                <button
                  className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold ${
                    meta.highlight ? 'bg-sky-600 text-white hover:bg-sky-700' : 'border border-slate-700/60 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {meta.cta}
                </button>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  {planHighlights[tier].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span>✅</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-dashed border-slate-700/60 bg-slate-50 px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center">
          <div>
            <div className="font-semibold text-slate-200">Need more than 10 channels?</div>
            <p>Talk with us about enterprise pricing, dedicated onboarding, and service-level agreements.</p>
          </div>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Get in touch</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <h3 className="text-lg font-semibold">Feature comparison</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Feature</th>
                {tierOrder.map((tier) => (
                  <th key={tier} className="px-4 py-3 text-left">{planMeta[tier].name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureMatrix.map((group) => (
                <React.Fragment key={group.section}>
                  <tr className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
                    <td className="px-4 py-2" colSpan={1 + tierOrder.length}>{group.section}</td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.feature} className="border-b border-slate-700/60">
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {row.feature}
                        {row.notes && <div className="text-xs text-slate-500">{row.notes}</div>}
                      </td>
                      {tierOrder.map((tier) => (
                        <td key={tier} className="px-4 py-3 text-sm text-slate-400">{row.values[tier] || '—'}</td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <h3 className="text-lg font-semibold">Connect your favorite accounts</h3>
        <p className="text-sm text-slate-500">Auto-publishing adapters roll out sequentially; your queue and reminders already work for each profile below.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {connectorCatalog.map((connector) => (
            <div key={connector.label} className="rounded-xl border border-slate-700/60 bg-slate-50 p-3 text-center text-sm text-slate-400">
              <div className="text-2xl">{connector.icon}</div>
              <div className="mt-1 font-medium text-slate-700">{connector.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <h3 className="text-lg font-semibold">What people are saying</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.author} className="rounded-xl border border-slate-700/60 bg-slate-50 p-5 text-sm text-slate-400">
              <p className="text-slate-700">“{testimonial.quote}”</p>
              <footer className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {testimonial.author} — {testimonial.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <h3 className="text-lg font-semibold">FAQs</h3>
        <div className="mt-4 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-slate-700/60 bg-slate-50 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">{faq.question}</summary>
              <p className="mt-2 text-sm text-slate-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-6 shadow-lg shadow-slate-950/20">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          {ecosystemColumns.map((col) => (
            <div key={col.heading} className="text-sm text-slate-400">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{col.heading}</div>
              <ul className="mt-2 space-y-1">
                {col.links.map((link) => (
                  <li key={link} className="text-slate-400">{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-slate-700/60 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-slate-700">Stella Social Studio</div>
          <div className="flex flex-wrap gap-3">
            <span>© {new Date().getFullYear()} Stella</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-slate-700/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Social Media Studio</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Draft, schedule, analyze, and engage—all in one place. We&apos;re mirroring the Buffer experience so the team can graduate from manual tools without paying a cent.
          </p>
          {!supabaseConfigured && (
            <p className="mt-2 text-xs text-amber-600">Supabase credentials missing. Data persists locally only until refresh.</p>
          )}
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
          {(Object.keys(stats) as SocialStatus[]).map((status) => (
            <div key={status} className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg p-3 shadow-lg shadow-slate-950/20">
              <div className="text-[10px] font-semibold uppercase text-slate-500">{statusLabels[status]}</div>
              <div className="mt-1 text-xl font-semibold text-slate-100">{stats[status]}</div>
            </div>
          ))}
        </div>
      </div>

      <nav className="-mb-2 flex flex-wrap gap-3 border-b border-slate-700/60 pb-2 text-sm font-medium text-slate-400" aria-label="Social media sub navigation">
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 transition ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <p className="text-sm text-slate-500">{subTabs.find((tab) => tab.key === activeTab)?.blurb}</p>
      {isDemo && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          Demo mode · changes disabled
        </p>
      )}

      {activeTab === 'publishing' && publishingView}
      {activeTab === 'analytics' && analyticsView}
      {activeTab === 'engage' && engageView}
      {activeTab === 'library' && libraryView}
      {activeTab === 'pricing' && pricingView}
    </div>
  )
}
