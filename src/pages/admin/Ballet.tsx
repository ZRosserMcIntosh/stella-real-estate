import React from 'react'
import { balletSections, type BalletFeature, type BalletSection } from './ballet/data'

const sectionContainer = 'rounded-2xl border border-slate-200 bg-white p-5'

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
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
      {label}
    </span>
  )
}

function TodoBubble({ todo }: { todo: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
      {todo}
    </span>
  )
}

function BlueprintFeatureCard({ feature }: { feature: BalletFeature }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/95 p-4 shadow-sm transition hover:border-brand-200 hover:shadow">
      <div className="text-sm font-semibold text-slate-900">{feature.title}</div>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.summary}</p>
      <div className="mt-3">
        <TodoBubble todo={feature.todo} />
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

function SectionCard({
  title,
  description,
  actionLabel,
  actionIcon,
  children,
}: BalletSection & { children: React.ReactNode }) {
  return (
    <section className={sectionContainer}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {actionLabel && (
          <PillButton icon={actionIcon}>
            {actionLabel}
          </PillButton>
        )}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  )
}

export default function Ballet() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ballet Work Graph</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Blueprint for an Asana-style orchestration layer: organizations, projects, automation, goals, reporting,
            integrations, and admin guardrails.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            ⚠️ Prototype data only — wire up to production services, authorization, and background jobs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PillButton icon="🧭">Workflow Navigator</PillButton>
          <PillButton icon="📝">Create Blueprint</PillButton>
          <PillButton icon="📤">Export Requirements</PillButton>
        </div>
      </header>

      <div className="space-y-4">
        {balletSections.map((section) => (
          <SectionCard key={section.id} {...section}>
            {section.features.map((feature) => (
              <BlueprintFeatureCard key={feature.id} feature={feature} />
            ))}
          </SectionCard>
        ))}

        <section className={`${sectionContainer} border-dashed`}>
          <h2 className="text-base font-semibold text-slate-900">Identify Additional Gaps</h2>
          <p className="mt-1 text-sm text-slate-600">
            Drop any missing Asana parity requirements here so we can extend the Ballet backlog and link them to delivery milestones.
          </p>
          <TodoBubble todo="⚠️ Capture: backlog additions, dependency notes, timeline assumptions." />
        </section>
      </div>
    </div>
  )
}
