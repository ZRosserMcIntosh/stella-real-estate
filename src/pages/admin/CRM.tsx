import React, { useMemo, useState } from 'react'
import {
  overviewMetrics,
  pipelineStages,
  forecastByPeriod,
  accountRecords,
  contactRecords,
  dealRecords,
  activityRecords,
  taskRecords,
  campaignRecords,
  automationFlows,
  serviceTickets,
  integrationCards,
  playbooks,
  constellationBlueprints,
  salesProductivityBlueprints,
  cpqBlueprints,
  serviceBlueprints,
  marketingBlueprints,
  commerceBlueprints,
  analyticsBlueprints,
  platformBlueprints,
  collaborationBlueprints,
  securityBlueprints,
  mondayWorkBlueprints,
  mondayViewsBlueprints,
  mondayAutomationBlueprints,
  mondayIntegrationBlueprints,
  mondayCrmBlueprints,
  mondaySuiteBlueprints,
  mondayDocsBlueprints,
  mondayFormsBlueprints,
  mondayPortfolioBlueprints,
  mondayPermissionsBlueprints,
  mondayApiBlueprints,
  mondayAiBlueprints,
  mobileDesktopBlueprints,
  governanceSupportBlueprints,
  type CrmMetric,
  type PipelineStage,
  type ForecastSnapshot,
  type AccountRecord,
  type ContactRecord,
  type DealRecord,
  type ActivityRecord,
  type TaskRecord,
  type CampaignRecord,
  type AutomationFlow,
  type ServiceTicket,
  type IntegrationCard,
  type Playbook,
  type BlueprintFeature,
} from './crm/data'

type TabKey =
  | 'overview'
  | 'pipeline'
  | 'accounts'
  | 'contacts'
  | 'deals'
  | 'activities'
  | 'marketing'
  | 'automation'
  | 'service'
  | 'analytics'
  | 'integrations'
  | 'settings'
  | 'playbooks'
  | 'blueprints'

interface TabDefinition {
  id: TabKey
  label: string
  icon: string
  description: string
}

const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Overview', icon: '📊', description: 'Company-wide health and KPIs.' },
  { id: 'pipeline', label: 'Pipeline', icon: '🪜', description: 'Stage progression and forecast.' },
  { id: 'accounts', label: 'Accounts', icon: '🏢', description: 'Developers, owners, and institutions.' },
  { id: 'contacts', label: 'Contacts', icon: '👤', description: 'People, relationships, and stakeholder mapping.' },
  { id: 'deals', label: 'Deals', icon: '💼', description: 'Opportunities, forecasts, and close plans.' },
  { id: 'activities', label: 'Activities', icon: '📆', description: 'Tasks, meetings, and daily execution.' },
  { id: 'marketing', label: 'Marketing', icon: '📣', description: 'Campaigns, MQLs, and content performance.' },
  { id: 'automation', label: 'Automation', icon: '⚙️', description: 'Workflows, triggers, and process automation.' },
  { id: 'service', label: 'Service', icon: '🛟', description: 'Customer service and implementation health.' },
  { id: 'analytics', label: 'Analytics', icon: '📈', description: 'Dashboards, cohorts, and revenue intelligence.' },
  { id: 'integrations', label: 'Integrations', icon: '🔗', description: 'Connected tools and data syncs.' },
  { id: 'settings', label: 'Settings', icon: '⚖️', description: 'Governance, permissions, and customization.' },
  { id: 'playbooks', label: 'Playbooks', icon: '🧭', description: 'Enablement, best practices, and GTM motions.' },
  { id: 'blueprints', label: 'Blueprints', icon: '🗂️', description: 'Full feature backlog with build notes.' },
]

const trendStyles: Record<string, string> = {
  up: 'text-emerald-600',
  down: 'text-rose-600',
  flat: 'text-slate-500',
}

const healthThemes: Record<AccountRecord['health'], string> = {
  healthy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  risk: 'bg-rose-50 text-rose-700 border-rose-200',
}

const taskPriorityThemes: Record<TaskRecord['priority'], string> = {
  High: 'bg-rose-50 text-rose-700 border-rose-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
}

const taskStatusThemes: Record<TaskRecord['status'], string> = {
  'Upcoming': 'bg-slate-100 text-slate-600 border-slate-200',
  'In Progress': 'bg-brand-50 text-brand-700 border-brand-100',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Blocked': 'bg-rose-50 text-rose-700 border-rose-200',
}

const ticketStatusThemes: Record<ServiceTicket['status'], string> = {
  'New': 'bg-slate-100 text-slate-600 border-slate-200',
  'Assigned': 'bg-brand-50 text-brand-700 border-brand-100',
  'In Progress': 'bg-brand-100 text-brand-700 border-brand-200',
  'Waiting': 'bg-amber-50 text-amber-700 border-amber-200',
  'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

const integrationThemes: Record<IntegrationCard['status'], string> = {
  'Connected': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Available': 'bg-slate-100 text-slate-600 border-slate-200',
}

const sectionContainer = 'rounded-2xl border border-slate-200 bg-white p-5'
const tableBase =
  'w-full border-separate border-spacing-y-2 text-sm'
const tableHeader =
  'text-left text-xs font-semibold uppercase tracking-wide text-slate-500 pb-2'
const tableRow =
  'bg-slate-50/60 hover:bg-slate-100 transition-colors rounded-xl overflow-hidden'
const cell =
  'px-4 py-3 text-sm text-slate-700 align-middle'

function MetricCard({ metric }: { metric: CrmMetric }) {
  return (
    <div className={`${sectionContainer}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">{metric.label}</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</div>
        </div>
        {metric.change && (
          <div className={`text-xs font-medium ${metric.trend ? trendStyles[metric.trend] : 'text-slate-500'}`}>
            {metric.change}
          </div>
        )}
      </div>
      {metric.description && <p className="mt-4 text-sm text-slate-600 leading-relaxed">{metric.description}</p>}
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
  actions,
}: {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <section className={sectionContainer}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

function StatusBadge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>{children}</span>
}

function PillButton({ icon, children }: { icon?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700 hover:shadow"
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

function TagChip({ label }: { label: string }) {
  return <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{label}</span>
}

function TodoBubble({ text }: { text: string }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">{text}</span>
}

function BlueprintFeatureCard({ feature }: { feature: BlueprintFeature }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/95 p-4 shadow-sm hover:border-brand-200 hover:shadow transition">
      <div className="text-sm font-semibold text-slate-900">{feature.title}</div>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.summary}</p>
      <div className="mt-3">
        <TodoBubble text={feature.todo} />
      </div>
      {feature.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {feature.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function BlueprintSection({
  title,
  description,
  features,
  actions,
}: {
  title: string
  description: string
  features: BlueprintFeature[]
  actions?: React.ReactNode
}) {
  return (
    <SectionCard title={title} description={description} actions={actions}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <BlueprintFeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </SectionCard>
  )
}

const TabPills = ({ activeTab, onSelect }: { activeTab: TabKey; onSelect: (tab: TabKey) => void }) => (
  <div className="flex w-full gap-2 overflow-x-auto pb-1">
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          className={`group flex min-w-[140px] flex-col items-start rounded-2xl border px-3 py-3 transition-all ${
            isActive
              ? 'border-brand-500 bg-brand-50 shadow-sm'
              : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50/40'
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          <span className={`mt-1 text-sm font-semibold ${isActive ? 'text-brand-700' : 'text-slate-700 group-hover:text-brand-700'}`}>
            {tab.label}
          </span>
          <span className="mt-1 text-xs text-slate-500">{tab.description}</span>
        </button>
      )
    })}
  </div>
)

function OverviewContent({
  metrics,
  pipeline,
  forecast,
  tasks,
  campaigns,
}: {
  metrics: CrmMetric[]
  pipeline: PipelineStage[]
  forecast: ForecastSnapshot[]
  tasks: TaskRecord[]
  campaigns: CampaignRecord[]
}) {
  const topTasks = useMemo(() => tasks.slice(0, 3), [tasks])
  const liveCampaigns = useMemo(() => campaigns.filter((c) => c.status !== 'Completed'), [campaigns])

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Connect KPIs to live Supabase/Prisma data and analytics warehouse refresh jobs.</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Pipeline Health"
          description="Snapshot of current opportunities across major stages."
          actions={<PillButton icon="➕">Add Stage</PillButton>}
        >
          <div className="grid gap-3">
            {pipeline.map((stage) => (
              <div key={stage.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{stage.name}</div>
                  <div className="mt-1 text-xs text-slate-500">Velocity: {stage.velocity} · Conversion: {stage.conversion}</div>
                </div>
                <div className="text-right text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">{stage.amount}</div>
                  <div className="text-xs text-slate-500">{stage.deals} active deals</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Forecast Coverage"
          description="Weighted, commit, and best case revenue projections."
          actions={
            <>
              <PillButton icon="📤">Export</PillButton>
              <PillButton icon="⚙️">Configure</PillButton>
            </>
          }
        >
          <table className={tableBase}>
            <thead>
              <tr>
                <th className={tableHeader}>Period</th>
                <th className={tableHeader}>Weighted</th>
                <th className={tableHeader}>Commit</th>
                <th className={tableHeader}>Best Case</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((row) => (
                <tr key={row.period} className={tableRow}>
                  <td className={cell}>{row.period}</td>
                  <td className={cell}>{row.weighted}</td>
                  <td className={cell}>{row.commit}</td>
                  <td className={cell}>{row.bestCase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Critical Tasks"
          description="Priorities due within the next 10 days."
          actions={<PillButton icon="✅">Mark Complete</PillButton>}
        >
          <div className="space-y-3">
            {topTasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{task.title}</div>
                  <div className="mt-1 text-xs text-slate-500">Related to {task.relatedTo} · Owner: {task.owner}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={taskPriorityThemes[task.priority]}>{task.priority} Priority</StatusBadge>
                  <StatusBadge tone={taskStatusThemes[task.status]}>{task.status}</StatusBadge>
                  <StatusBadge tone="bg-slate-900 text-white border-slate-900">Due {task.due}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Live Campaigns"
          description="Marketing programs influencing the current pipeline."
          actions={<PillButton icon="➕">New Campaign</PillButton>}
        >
          <div className="space-y-3">
            {liveCampaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{campaign.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{campaign.channel} · Status: {campaign.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-900">{campaign.pipelineInfluence}</div>
                    <div className="text-xs text-slate-500">{campaign.mqls} MQLs · Budget {campaign.budget}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function PipelineContent({
  pipeline,
  forecast,
}: {
  pipeline: PipelineStage[]
  forecast: ForecastSnapshot[]
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Feed pipeline analytics from opportunity stage data and forecasting hierarchy submissions.</p>
      <SectionCard
        title="Pipeline Stages"
        description="Track progression, velocity, and conversion across the funnel."
        actions={<PillButton icon="📈">Stage Analytics</PillButton>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pipeline.map((stage) => (
            <div key={stage.name} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{stage.name}</div>
              <div className="mt-3 text-2xl font-semibold text-slate-900">{stage.amount}</div>
              <div className="mt-2 text-xs text-slate-500">{stage.deals} deals · Velocity {stage.velocity}</div>
              <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                Conversion Rate {stage.conversion}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Forecast Commit"
        description="Compare weighted, commit, and best-case projections."
        actions={<PillButton icon="📎">Attach Notes</PillButton>}
      >
        <table className={tableBase}>
          <thead>
            <tr>
              <th className={tableHeader}>Period</th>
              <th className={tableHeader}>Weighted</th>
              <th className={tableHeader}>Commit</th>
              <th className={tableHeader}>Best Case</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((row) => (
              <tr key={row.period} className={tableRow}>
                <td className={cell}>{row.period}</td>
                <td className={cell}>{row.weighted}</td>
                <td className={cell}>{row.commit}</td>
                <td className={cell}>{row.bestCase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Pipeline Intelligence"
        description="Surface stalled deals, aging stages, and coverage gaps."
        actions={<PillButton icon="🧠">AI Insights</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Stalled deals (10+ days)', value: '6 deals · R$ 2.3M', tone: 'bg-rose-50 text-rose-700 border-rose-200' },
            { title: 'Stage velocity ↑ QoQ', value: 'Proposal · +12%', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            { title: 'Coverage vs quota', value: '2.9x · target 3x', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className={`mt-2 inline-flex rounded-lg border px-3 py-2 text-sm font-semibold ${card.tone}`}>
                {card.value}
              </div>
              <p className="mt-2 text-xs text-slate-500">View recommended playbooks to accelerate these deals.</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function AccountsContent({ accounts }: { accounts: AccountRecord[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Implement account hierarchy, ownership rules, and live ARR rollups from finance integrations.</p>
      <SectionCard
        title="Account Workspace"
        description="Segmented view of developers, brokerages, and owners."
        actions={
          <>
            <PillButton icon="➕">New Account</PillButton>
            <PillButton icon="🔁">Import</PillButton>
          </>
        }
      >
        <table className={tableBase}>
          <thead>
            <tr>
              <th className={tableHeader}>Account</th>
              <th className={tableHeader}>Segment</th>
              <th className={tableHeader}>Owner</th>
              <th className={tableHeader}>ARR</th>
              <th className={tableHeader}>Health</th>
              <th className={tableHeader}>Next Step</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className={tableRow}>
                <td className={`${cell} font-semibold text-slate-900`}>
                  <div>{account.name}</div>
                  <div className="text-xs font-normal text-slate-500">{account.id}</div>
                </td>
                <td className={cell}>{account.segment}</td>
                <td className={cell}>{account.owner}</td>
                <td className={cell}>{account.arr}</td>
                <td className={cell}>
                  <StatusBadge tone={healthThemes[account.health]}>
                    {account.health === 'healthy' ? 'Healthy' : account.health === 'warning' ? 'At Risk' : 'Critical'}
                  </StatusBadge>
                </td>
                <td className={cell}>{account.nextStep}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Segmentation"
        description="Understand coverage and whitespace across territories."
        actions={<PillButton icon="🗺️">Launch Territory Map</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Enterprise Coverage', value: '92% assigned', detail: '8 open whitespace accounts' },
            { title: 'Mid-Market Coverage', value: '78% assigned', detail: '15 accounts unassigned' },
            { title: 'SMB Coverage', value: '64% assigned', detail: 'Automate nurture sequences' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{card.value}</div>
              <div className="mt-1 text-xs text-slate-500">{card.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function ContactsContent({ contacts }: { contacts: ContactRecord[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Sync contacts from email/calendar providers and maintain relationship health scoring.</p>
      <SectionCard
        title="Contact Directory"
        description="Layered view of decision makers, influencers, and champions."
        actions={
          <>
            <PillButton icon="👥">Bulk Assign</PillButton>
            <PillButton icon="🧭">Relationship Map</PillButton>
          </>
        }
      >
        <table className={tableBase}>
          <thead>
            <tr>
              <th className={tableHeader}>Name</th>
              <th className={tableHeader}>Title</th>
              <th className={tableHeader}>Account</th>
              <th className={tableHeader}>Status</th>
              <th className={tableHeader}>Owner</th>
              <th className={tableHeader}>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className={tableRow}>
                <td className={`${cell} font-semibold text-slate-900`}>
                  <div>{contact.name}</div>
                  <div className="text-xs font-normal text-slate-500">{contact.id}</div>
                </td>
                <td className={cell}>{contact.title}</td>
                <td className={cell}>{contact.account}</td>
                <td className={cell}>
                  <StatusBadge tone="bg-slate-100 text-slate-600 border-slate-200">{contact.status}</StatusBadge>
                </td>
                <td className={cell}>{contact.owner}</td>
                <td className={cell}>{contact.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Stakeholder Strategy"
        description="Quick insight into influence coverage within top accounts."
        actions={<PillButton icon="🧩">Persona Library</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Economic buyers', value: '12 identified', detail: '3 missing in enterprise accounts' },
            { title: 'Champions', value: '21 active', detail: '8 ready for reference program' },
            { title: 'Risk signals', value: '5 accounts', detail: 'Triggered by inactivity > 21 days' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{card.value}</div>
              <div className="mt-1 text-xs text-slate-500">{card.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function DealsContent({ deals }: { deals: DealRecord[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Drive deal data from opportunity object, sync probabilities, and attach quote/contract status.</p>
      <SectionCard
        title="Opportunity Board"
        description="Active deals, close dates, and probability weighting."
        actions={
          <>
            <PillButton icon="➕">New Deal</PillButton>
            <PillButton icon="📤">Share Board</PillButton>
          </>
        }
      >
        <table className={tableBase}>
          <thead>
            <tr>
              <th className={tableHeader}>Deal</th>
              <th className={tableHeader}>Stage</th>
              <th className={tableHeader}>Amount</th>
              <th className={tableHeader}>Close Date</th>
              <th className={tableHeader}>Probability</th>
              <th className={tableHeader}>Owner</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id} className={tableRow}>
                <td className={`${cell} font-semibold text-slate-900`}>
                  <div>{deal.name}</div>
                  <div className="text-xs font-normal text-slate-500">{deal.id}</div>
                </td>
                <td className={cell}>
                  <StatusBadge tone="bg-brand-50 text-brand-700 border-brand-100">{deal.stage}</StatusBadge>
                </td>
                <td className={cell}>{deal.amount}</td>
                <td className={cell}>{deal.closeDate}</td>
                <td className={cell}>{deal.probability}</td>
                <td className={cell}>{deal.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Close Plan Checklist"
        description="Recommended next actions for late-stage opportunities."
        actions={<PillButton icon="📝">Create Template</PillButton>}
      >
        <div className="space-y-3">
          {[
            { title: 'Executive sponsor alignment', detail: 'Prime Towers — schedule C-level sync', owner: 'Luciana Souza', due: '18 Jun' },
            { title: 'Commercial terms review', detail: 'Verde Residence — finance approvals pending', owner: 'Patrick Silva', due: '20 Jun' },
            { title: 'Implementation scoping', detail: 'Atlas Phase II — finalize project plan', owner: 'Amanda Costa', due: '21 Jun' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{item.title}</div>
              <div className="mt-1 text-xs text-slate-500">{item.detail}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-1">Owner: {item.owner}</span>
                <span className="rounded-full bg-slate-900 px-2 py-1 text-white">Due {item.due}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function ActivitiesContent({ activities, tasks }: { activities: ActivityRecord[]; tasks: TaskRecord[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Implement real-time activity logging with Gmail/Outlook sync and shared task queues.</p>
      <SectionCard
        title="Activity Feed"
        description="Chronological log of calls, meetings, demos, and touchpoints."
        actions={
          <>
            <PillButton icon="➕">Log Activity</PillButton>
            <PillButton icon="🎤">Transcribe Call</PillButton>
          </>
        }
      >
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">{activity.summary}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {activity.type} · {activity.date} · {activity.owner}
                </div>
              </div>
              <div className="text-xs text-slate-500">{activity.outcome}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Task Control Center"
        description="Cross-functional execution for sales, CS, and operations."
        actions={<PillButton icon="⚡">Automate</PillButton>}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{task.title}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    Related to {task.relatedTo} · Owner {task.owner}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={taskPriorityThemes[task.priority]}>{task.priority} Priority</StatusBadge>
                  <StatusBadge tone={taskStatusThemes[task.status]}>{task.status}</StatusBadge>
                  <StatusBadge tone="bg-slate-900 text-white border-slate-900">Due {task.due}</StatusBadge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function MarketingContent({ campaigns }: { campaigns: CampaignRecord[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Sync campaign performance from marketing automation platform and wire attribution analytics.</p>
      <SectionCard
        title="Campaign Performance"
        description="Marketing programs, budget allocation, and influenced revenue."
        actions={
          <>
            <PillButton icon="📈">Performance Dashboard</PillButton>
            <PillButton icon="➕">Create Campaign</PillButton>
          </>
        }
      >
        <table className={tableBase}>
          <thead>
            <tr>
              <th className={tableHeader}>Campaign</th>
              <th className={tableHeader}>Channel</th>
              <th className={tableHeader}>Status</th>
              <th className={tableHeader}>Budget</th>
              <th className={tableHeader}>Pipeline Influence</th>
              <th className={tableHeader}>MQLs</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className={tableRow}>
                <td className={`${cell} font-semibold text-slate-900`}>
                  <div>{campaign.name}</div>
                  <div className="text-xs font-normal text-slate-500">{campaign.id}</div>
                </td>
                <td className={cell}>{campaign.channel}</td>
                <td className={cell}>
                  <StatusBadge tone={campaign.status === 'Live' ? 'bg-brand-50 text-brand-700 border-brand-100' : campaign.status === 'Planning' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                    {campaign.status}
                  </StatusBadge>
                </td>
                <td className={cell}>{campaign.budget}</td>
                <td className={cell}>{campaign.pipelineInfluence}</td>
                <td className={cell}>{campaign.mqls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Audience Journey"
        description="Nurture flows that convert prospects into qualified opportunities."
        actions={<PillButton icon="🧵">Edit Journey</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Developers', metric: 'Avg time to SQL', detail: '14 days · -3 days vs last quarter' },
            { title: 'Investors', metric: 'MQL to SQL', detail: '36% conversion · target 32%' },
            { title: 'Broker Partners', metric: 'Active nurture plays', detail: '4 sequences · open rate 42%' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{card.metric}</div>
              <div className="mt-1 text-xs text-slate-500">{card.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function AutomationContent({ flows }: { flows: AutomationFlow[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Provision workflow runtime, monitoring, and guardrails for automation recipes.</p>
      <SectionCard
        title="Workflow Library"
        description="Orchestrate multi-step automations across Constelação objects."
        actions={
          <>
            <PillButton icon="➕">New Flow</PillButton>
            <PillButton icon="📦">Templates</PillButton>
          </>
        }
      >
        <div className="space-y-3">
          {flows.map((flow) => (
            <div key={flow.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{flow.name}</div>
                  <div className="mt-1 text-xs text-slate-500">Trigger: {flow.trigger}</div>
                  <div className="mt-1 text-xs text-slate-500">{flow.objective}</div>
                </div>
                <StatusBadge tone={flow.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                  {flow.status}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Automation Insights"
        description="Measure automation impact and identify bottlenecks."
        actions={<PillButton icon="📉">View Analytics</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Hours saved last 30 days', metric: '184 hrs', detail: 'Equivalent to 1.1 FTE' },
            { title: 'Deals touched by automation', metric: '58%', detail: '+12 pts vs last quarter' },
            { title: 'Failed runs', metric: '4 flows', detail: 'Flagged for review · assign owner' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{card.metric}</div>
              <div className="mt-1 text-xs text-slate-500">{card.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function ServiceContent({ tickets }: { tickets: ServiceTicket[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Implement omni-channel routing, SLA timers, and sync with service case data sources.</p>
      <SectionCard
        title="Customer Service Queue"
        description="Combined view of escalations, SLAs, and implementation blockers."
        actions={
          <>
            <PillButton icon="🛠️">Dispatch</PillButton>
            <PillButton icon="📎">Attach Asset</PillButton>
          </>
        }
      >
        <table className={tableBase}>
          <thead>
            <tr>
              <th className={tableHeader}>Ticket</th>
              <th className={tableHeader}>Account</th>
              <th className={tableHeader}>Priority</th>
              <th className={tableHeader}>Status</th>
              <th className={tableHeader}>Owner</th>
              <th className={tableHeader}>Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className={tableRow}>
                <td className={`${cell} font-semibold text-slate-900`}>
                  <div>{ticket.title}</div>
                  <div className="text-xs font-normal text-slate-500">{ticket.id}</div>
                </td>
                <td className={cell}>{ticket.account}</td>
                <td className={cell}>
                  <StatusBadge tone={ticket.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : ticket.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                    {ticket.priority}
                  </StatusBadge>
                </td>
                <td className={cell}>
                  <StatusBadge tone={ticketStatusThemes[ticket.status]}>{ticket.status}</StatusBadge>
                </td>
                <td className={cell}>{ticket.owner}</td>
                <td className={cell}>{ticket.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard
        title="Implementation Health"
        description="Gauge onboarding progress and escalations per account."
        actions={<PillButton icon="📋">View Runbooks</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Avg onboarding duration', metric: '32 days', detail: '-4 days vs last quarter' },
            { title: 'Active escalations', metric: '3 accounts', detail: 'Two require engineering support' },
            { title: 'SLA attainment', metric: '94%', detail: 'Goal 95% · adjust staffing next week' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{card.metric}</div>
              <div className="mt-1 text-xs text-slate-500">{card.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function AnalyticsContent() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Stand up reporting warehouse, BI embeddings, and permissions-aware data sharing.</p>
      <SectionCard
        title="Revenue Intelligence"
        description="Blend Constelação data with marketing, finance, and operations for deeper insights."
        actions={
          <>
            <PillButton icon="📊">Build Dashboard</PillButton>
            <PillButton icon="📤">Share</PillButton>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 rounded-2xl border border-slate-200 bg-slate-100/70 shadow-inner" />
          <div className="h-48 rounded-2xl border border-slate-200 bg-slate-100/70 shadow-inner" />
        </div>
        <p className="text-xs text-slate-500">
          Integrate with BI tools (Looker, Power BI, Data Studio) to model revenue, cohort retention,
          and sales efficiency metrics.
        </p>
      </SectionCard>

      <SectionCard
        title="Advanced Analytics"
        description="Predictive scoring, churn likelihood, territory performance, and cohort analysis."
        actions={<PillButton icon="🧠">Enable AI Scoring</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: 'Lead Score Model', metric: 'Accuracy 81%', detail: '16 signals · retrain weekly' },
            { title: 'Churn Likelihood', metric: 'High risk accounts: 7', detail: 'CSAT < 7 · usage decline' },
            { title: 'Territory Attainment', metric: 'Quotas met: 5/7', detail: 'Flag areas with <80% attainment' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">{card.title}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{card.metric}</div>
              <div className="mt-1 text-xs text-slate-500">{card.detail}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function IntegrationsContent({ integrations }: { integrations: IntegrationCard[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Connect actual integrations with auth flows, sync schedules, and conflict resolution logic.</p>
      <SectionCard
        title="Connected Systems"
        description="Keep data, workflows, and teams aligned across the go-to-market stack."
        actions={<PillButton icon="➕">Add Integration</PillButton>}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <div key={integration.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{integration.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{integration.category}</div>
                </div>
                <StatusBadge tone={integrationThemes[integration.status]}>{integration.status}</StatusBadge>
              </div>
              <p className="mt-3 text-sm text-slate-600">{integration.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Data Governance"
        description="Define sync frequency, ownership, and conflict resolution rules."
        actions={<PillButton icon="⚖️">Policies</PillButton>}
      >
        <div className="space-y-2 text-sm text-slate-600">
          <p>• Schedule nightly full sync and hourly delta sync for critical systems.</p>
          <p>• Ownership: Constelação is source-of-truth for accounts, marketing automation for leads.</p>
          <p>• Conflict resolution: last-touch for contacts, owner hierarchy for accounts.</p>
        </div>
      </SectionCard>
    </div>
  )
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Deliver admin consoles for permissions, custom objects, and compliance tooling.</p>
      <SectionCard
        title="Constelação Settings"
        description="Control permissions, custom objects, page layouts, and automations."
        actions={<PillButton icon="🛡️">Role Matrix</PillButton>}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Permission Sets</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Sales · full access to opportunities, read-only to finance data.</li>
              <li>• CS · full access to accounts, limited edit rights on deals.</li>
              <li>• Marketing · campaign builder, attribution dashboards, read-only pipeline.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Custom Objects</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Projects / Developments · tie listings, phases, and investors.</li>
              <li>• Units · inventory tracking, price history, release schedule.</li>
              <li>• Service Requests · link to tickets and implementation steps.</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Compliance & Auditing"
        description="Manage data retention, audit trails, and regulatory requirements."
        actions={<PillButton icon="🔍">Audit Logs</PillButton>}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'GDPR / LGPD', detail: 'Consent tracking · right-to-be-forgotten requests automated.' },
            { title: 'Change History', detail: 'Field level history for critical objects stored 24 months.' },
            { title: 'Security', detail: 'SAML, MFA enforcement, IP restrictions, field encryption.' },
          ].map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm text-sm text-slate-600">
              <div className="text-sm font-semibold text-slate-900">{card.title}</div>
              <p className="mt-1 text-xs text-slate-500">{card.detail}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function PlaybooksContent({ playbooks }: { playbooks: Playbook[] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-amber-600">⚠️ Build: Maintain enablement content library with versioning, ownership, and analytics.</p>
      <SectionCard
        title="Strategic Playbooks"
        description="Codify repeatable revenue motions for sales, CS, and marketing."
        actions={<PillButton icon="➕">New Playbook</PillButton>}
      >
        <div className="space-y-3">
          {playbooks.map((playbook) => (
            <div key={playbook.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">{playbook.title}</div>
              <div className="mt-1 text-xs text-slate-500">Audience: {playbook.audience}</div>
              <p className="mt-2 text-sm text-slate-600">{playbook.outcome}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Enablement Hub"
        description="Surface assets, templates, and critical documentation inside Constelação."
        actions={<PillButton icon="📚">Open Library</PillButton>}
      >
        <div className="grid gap-3 md:grid-cols-3 text-sm text-slate-600">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Deal Desk</div>
            <p className="mt-2 text-xs text-slate-500">Pricing approvals, commercial guardrails, exceptions matrix.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Implementation Kits</div>
            <p className="mt-2 text-xs text-slate-500">Project timelines, stakeholder templates, status reports.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">Partner Programs</div>
            <p className="mt-2 text-xs text-slate-500">Referral workflows, co-marketing packages, certification paths.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

function BlueprintsContent() {
  const sections = [
    {
      id: 'core-crm',
      title: 'Constelação Core & Data Model',
      description: 'Primary Salesforce-style data model foundations mirrored for Stella.',
      features: constellationBlueprints,
      actions: <PillButton icon="🗄️">Review Data Schema</PillButton>,
    },
    {
      id: 'sales-productivity',
      title: 'Sales Productivity (Sales Cloud)',
      description: 'Tools that accelerate reps, managers, and partner sellers.',
      features: salesProductivityBlueprints,
      actions: <PillButton icon="🚀">Prioritize MVP</PillButton>,
    },
    {
      id: 'cpq-revenue',
      title: 'Quoting, CPQ & Revenue',
      description: 'Configure-price-quote lifecycle and revenue management.',
      features: cpqBlueprints,
      actions: <PillButton icon="🧮">Scope CPQ Engine</PillButton>,
    },
    {
      id: 'service-cloud',
      title: 'Service Cloud',
      description: 'Customer service operations, omni-channel, and field service.',
      features: serviceBlueprints,
      actions: <PillButton icon="🛎️">Design Service Console</PillButton>,
    },
    {
      id: 'marketing-cloud',
      title: 'Marketing & Growth',
      description: 'Marketing Cloud / Account Engagement style functionality.',
      features: marketingBlueprints,
      actions: <PillButton icon="📣">Marketing Ops Plan</PillButton>,
    },
    {
      id: 'commerce-experience',
      title: 'Commerce & Experience',
      description: 'Digital storefronts and experience cloud portals.',
      features: commerceBlueprints,
      actions: <PillButton icon="🛒">Ecommerce Discovery</PillButton>,
    },
    {
      id: 'analytics-data',
      title: 'Analytics & Data',
      description: 'Reporting, BI, CDP, and AI agents.',
      features: analyticsBlueprints,
      actions: <PillButton icon="📊">Plan Data Stack</PillButton>,
    },
    {
      id: 'platform-extensibility',
      title: 'Platform & Extensibility',
      description: 'Lightning Platform style extensibility, automation, and integration.',
      features: platformBlueprints,
      actions: <PillButton icon="🧩">Define Platform APIs</PillButton>,
    },
    {
      id: 'collaboration-docs',
      title: 'Collaboration, Mobile, Docs',
      description: 'Mobile, Slack, Quip, and communication tooling.',
      features: collaborationBlueprints,
      actions: <PillButton icon="📱">Mobile Strategy</PillButton>,
    },
    {
      id: 'security-devops',
      title: 'Security, Admin, DevOps',
      description: 'Controls for security, compliance, and release management.',
      features: securityBlueprints,
      actions: <PillButton icon="🛡️">Security Review</PillButton>,
    },
    {
      id: 'monday-work',
      title: 'monday.com Work OS · Structure',
      description: 'Workspaces, boards, column types, updates, templates.',
      features: mondayWorkBlueprints,
      actions: <PillButton icon="🧱">Design Board Schema</PillButton>,
    },
    {
      id: 'monday-views',
      title: 'monday.com Views & Dashboards',
      description: 'Views, visualization, and dashboards fed by boards.',
      features: mondayViewsBlueprints,
      actions: <PillButton icon="🖥️">Visual Framework</PillButton>,
    },
    {
      id: 'monday-automations',
      title: 'monday.com Automations',
      description: 'No-code recipes, run history, and governance.',
      features: mondayAutomationBlueprints,
      actions: <PillButton icon="⚡">Automation Engine</PillButton>,
    },
    {
      id: 'monday-integrations',
      title: 'monday.com Integrations',
      description: 'Native connectors, governance, metering.',
      features: mondayIntegrationBlueprints,
      actions: <PillButton icon="🔌">Integration Catalog</PillButton>,
    },
    {
      id: 'monday-crm',
      title: 'monday sales CRM',
      description: 'CRM-specific features layered on Work OS.',
      features: mondayCrmBlueprints,
      actions: <PillButton icon="🎯">CRM Template</PillButton>,
    },
    {
      id: 'monday-suites',
      title: 'monday Product Suites',
      description: 'Work management, marketer, service, dev suites.',
      features: mondaySuiteBlueprints,
      actions: <PillButton icon="🧰">Portfolio Rollout</PillButton>,
    },
    {
      id: 'monday-docs',
      title: 'monday Docs & Collaboration',
      description: 'Workdocs, whiteboards, chat, notifications.',
      features: mondayDocsBlueprints,
      actions: <PillButton icon="📝">Doc Engine</PillButton>,
    },
    {
      id: 'monday-forms',
      title: 'monday Forms & Intake',
      description: 'Board-backed forms, dedupe, conditional logic.',
      features: mondayFormsBlueprints,
      actions: <PillButton icon="🧾">Form Builder</PillButton>,
    },
    {
      id: 'monday-portfolio',
      title: 'monday Portfolio & Resource',
      description: 'Cross-project dependencies and capacity.',
      features: mondayPortfolioBlueprints,
      actions: <PillButton icon="📦">Resource Planner</PillButton>,
    },
    {
      id: 'monday-permissions',
      title: 'monday Permissions & Admin',
      description: 'Enterprise security, compliance, backups.',
      features: mondayPermissionsBlueprints,
      actions: <PillButton icon="🗝️">Admin Policies</PillButton>,
    },
    {
      id: 'monday-api',
      title: 'monday API & Extensibility',
      description: 'GraphQL API, SDK, app marketplace.',
      features: mondayApiBlueprints,
      actions: <PillButton icon="🧪">Developer Program</PillButton>,
    },
    {
      id: 'monday-ai',
      title: 'monday AI',
      description: 'AI assistants and workflow generation.',
      features: mondayAiBlueprints,
      actions: <PillButton icon="🤖">AI Governance</PillButton>,
    },
    {
      id: 'mobile-desktop',
      title: 'Mobile & Desktop',
      description: 'Client experiences and offline capabilities.',
      features: mobileDesktopBlueprints,
      actions: <PillButton icon="📲">Client Roadmap</PillButton>,
    },
    {
      id: 'governance-support',
      title: 'Governance & Support',
      description: 'Admin console, provisioning, support ecosystem.',
      features: governanceSupportBlueprints,
      actions: <PillButton icon="🗂️">Support Playbook</PillButton>,
    },
  ]

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <BlueprintSection
          key={section.id}
          title={section.title}
          description={section.description}
          features={section.features}
          actions={section.actions}
        />
      ))}
      <section className={`${sectionContainer} border-dashed`}>
        <h3 className="text-base font-semibold text-slate-900">Need additional capabilities?</h3>
        <p className="mt-2 text-sm text-slate-600">
          ⚠️ Build: Document any newly identified feature gaps here so we can extend the backlog and link them to delivery
          milestones.
        </p>
      </section>
    </div>
  )
}

export default function Constellation() {
  const [activeTab, setActiveTab] = useState<TabKey>('blueprints')

  const renderContent = (tab: TabKey) => {
    switch (tab) {
      case 'overview':
        return (
          <OverviewContent
            metrics={overviewMetrics}
            pipeline={pipelineStages}
            forecast={forecastByPeriod}
            tasks={taskRecords}
            campaigns={campaignRecords}
          />
        )
      case 'pipeline':
        return <PipelineContent pipeline={pipelineStages} forecast={forecastByPeriod} />
      case 'accounts':
        return <AccountsContent accounts={accountRecords} />
      case 'contacts':
        return <ContactsContent contacts={contactRecords} />
      case 'deals':
        return <DealsContent deals={dealRecords} />
      case 'activities':
        return <ActivitiesContent activities={activityRecords} tasks={taskRecords} />
      case 'marketing':
        return <MarketingContent campaigns={campaignRecords} />
      case 'automation':
        return <AutomationContent flows={automationFlows} />
      case 'service':
        return <ServiceContent tickets={serviceTickets} />
      case 'analytics':
        return <AnalyticsContent />
      case 'integrations':
        return <IntegrationsContent integrations={integrationCards} />
      case 'settings':
        return <SettingsContent />
      case 'playbooks':
        return <PlaybooksContent playbooks={playbooks} />
      case 'blueprints':
        return <BlueprintsContent />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Constelação Control Center</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Manage every relationship, pipeline, and revenue motion from one workspace. This scaffolding mirrors
            enterprise Constelação suites with dedicated areas for sales, marketing, service, and operations.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Prototype data shown — wire up to Supabase/Prisma models for production.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PillButton icon="🔍">Global Search</PillButton>
          <PillButton icon="➕">Quick Create</PillButton>
          <PillButton icon="📎">Log Activity</PillButton>
        </div>
      </header>

      <TabPills activeTab={activeTab} onSelect={setActiveTab} />

      <div className="space-y-4">
        {renderContent(activeTab)}
      </div>
    </div>
  )
}
