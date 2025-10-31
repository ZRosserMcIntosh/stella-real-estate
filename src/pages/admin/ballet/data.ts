// Blueprint scaffolding for the Ballet (Asana-style) workspace.

export interface BalletFeature {
  id: string
  title: string
  summary: string
  todo: string
  tags?: string[]
}

export interface BalletSection {
  id: string
  title: string
  description: string
  features: BalletFeature[]
  actionLabel?: string
  actionIcon?: string
}

const bubble = (text: string) => `⚠️ ${text}`

export const coreStructureFeatures: BalletFeature[] = [
  {
    id: 'org-workspaces',
    title: 'Organizations & Workspaces',
    summary: 'Hierarchical container model for companies, workspaces, and team privacy controls.',
    todo: bubble('Implement multi-tenant org model, workspace provisioning, team privacy tiers, and admin API.'),
    tags: ['structure', 'multi-tenant']
  },
  {
    id: 'projects-access',
    title: 'Projects & Access Levels',
    summary: 'Private/public/comment-only projects with team-based permissions.',
    todo: bubble('Deliver project schema, share settings UI, comment-only role enforcement, and audit logging.'),
    tags: ['projects']
  },
  {
    id: 'tasks-subtasks',
    title: 'Tasks & Subtasks',
    summary: 'Single assignee, collaborators/followers, multi-home across projects.',
    todo: bubble('Ship task object, collaborator model, multi-home relationships, and follower notification routing.'),
    tags: ['tasks']
  },
  {
    id: 'sections-fields',
    title: 'Sections & Fields',
    summary: 'Project sections, overview/brief, and custom fields.',
    todo: bubble('Add section ordering, project brief editor, and configurable field library per project type.'),
    tags: ['ux']
  },
  {
    id: 'portfolios',
    title: 'Portfolios',
    summary: 'Roll-up of multiple projects with status and KPI tracking.',
    todo: bubble('Create portfolio object, project aggregation jobs, and status reporting views.'),
    tags: ['portfolio']
  },
  {
    id: 'goals',
    title: 'Goals & Alignments',
    summary: 'Company/team/individual goals aligned to work with auto rollups.',
    todo: bubble('Implement goal hierarchy, alignment links to tasks/projects, and progress calculation engine.'),
    tags: ['goals']
  },
  {
    id: 'admin-console',
    title: 'Admin Console',
    summary: 'Org-level settings and governance controls.',
    todo: bubble('Design admin console UI, policy storage, usage analytics, and audit events.'),
    tags: ['admin']
  },
  {
    id: 'apps',
    title: 'Desktop & Mobile Apps',
    summary: 'macOS/Windows desktop plus iOS and Android clients.',
    todo: bubble('Create client shells, offline sync layer, deep linking, and release pipelines.'),
    tags: ['mobile', 'desktop']
  },
  {
    id: 'inbox-notifications',
    title: 'Global Inbox & Notifications',
    summary: 'Unified notification center with filters and DND.',
    todo: bubble('Build inbox feed service, notification preferences, email digests, and quiet hours.'),
    tags: ['notifications']
  },
  {
    id: 'search',
    title: 'Search & Saved Searches',
    summary: 'Global search, advanced filters, saved query library.',
    todo: bubble('Add search index, advanced filter builder, saved search persistence, and sharing.'),
    tags: ['search']
  },
]

export const taskCapabilitiesFeatures: BalletFeature[] = [
  {
    id: 'dates',
    title: 'Due & Start Dates',
    summary: 'Due dates/times, start dates/times, date ranges, recurring tasks.',
    todo: bubble('Extend task scheduling engine, recurrence generator, and conflict warnings.'),
    tags: ['schedule']
  },
  {
    id: 'dependencies',
    title: 'Dependencies',
    summary: 'Blockers/blocked by relationships with visual cues.',
    todo: bubble('Implement dependency graph, constraint validation, and auto notifications.'),
    tags: ['dependencies']
  },
  {
    id: 'milestones',
    title: 'Milestones',
    summary: 'Dedicated milestone task type for key deliverables.',
    todo: bubble('Add milestone type, milestone reporting, and timeline indicators.'),
    tags: ['milestones']
  },
  {
    id: 'approvals',
    title: 'Approvals',
    summary: 'Approve/request changes/reject tasks with status trail.',
    todo: bubble('Create approval state machine, reviewer UI, and audit logs.'),
    tags: ['approvals']
  },
  {
    id: 'collaboration',
    title: 'Comments & Attachments',
    summary: 'Rich text comments, @mentions, file uploads, cloud links.',
    todo: bubble('Implement collaborative editor, mention routing, file storage gateways, and previews.'),
    tags: ['collaboration']
  },
  {
    id: 'proofing',
    title: 'Proofing & Markup',
    summary: 'Pin comments on images/PDFs for review workflows.',
    todo: bubble('Add proofing UI, asset annotation storage, and feedback resolution flow.'),
    tags: ['design']
  },
  {
    id: 'custom-fields',
    title: 'Tags & Custom Fields',
    summary: 'Tags plus custom field types (text, number, select, etc.).',
    todo: bubble('Build custom field registry, validation, API access, and tag management.'),
    tags: ['fields']
  },
  {
    id: 'time-tracking',
    title: 'Native Time Tracking',
    summary: 'Estimate vs actuals with time logs on tasks.',
    todo: bubble('Ship time entry UI, reporting rollups, and billing/export integrations.'),
    tags: ['time']
  },
]

export const viewsFeatures: BalletFeature[] = [
  {
    id: 'list-view',
    title: 'List View',
    summary: 'Default spreadsheet-like view with inline editing.',
    todo: bubble('Build column renderer, inline edits, and bulk actions.'),
    tags: ['view']
  },
  {
    id: 'board-view',
    title: 'Board View',
    summary: 'Kanban workflow organized by columns/sections.',
    todo: bubble('Implement drag-and-drop board, WIP limits, and swimlanes.'),
    tags: ['view', 'kanban']
  },
  {
    id: 'calendar-view',
    title: 'Calendar View',
    summary: 'Visualize tasks on a calendar with drag scheduling.',
    todo: bubble('Integrate calendar grid, drag-to-reschedule, and ICS export.'),
    tags: ['calendar']
  },
  {
    id: 'timeline-view',
    title: 'Timeline View',
    summary: 'Gantt-style timeline for project planning.',
    todo: bubble('Create timeline renderer, dependency lines, critical path highlighting.'),
    tags: ['timeline']
  },
  {
    id: 'gantt-view',
    title: 'Dedicated Gantt',
    summary: 'Standalone Gantt chart with baselines and compare mode.',
    todo: bubble('Provide baseline snapshots, compare mode UI, and PDF export.'),
    tags: ['gantt']
  },
  {
    id: 'workload-view',
    title: 'Workload View',
    summary: 'Capacity per person based on effort fields.',
    todo: bubble('Aggregate effort data, highlight over/under allocation, and scenario planning.'),
    tags: ['resource']
  },
  {
    id: 'my-tasks',
    title: 'My Tasks',
    summary: 'Personal view for all assigned work across projects.',
    todo: bubble('Unify task inbox, smart sections, and custom rules for personal prioritization.'),
    tags: ['personal']
  },
]

export const goalsFeatures: BalletFeature[] = [
  {
    id: 'okr-linking',
    title: 'Goals & OKRs',
    summary: 'Link goals directly to projects, milestones, and tasks.',
    todo: bubble('Goal hierarchy UI, linkage metadata, and progress rollup automation.'),
    tags: ['goals']
  },
  {
    id: 'weighted-goals',
    title: 'Weighted Goals',
    summary: 'Assign percentage weights to sub-goals and inputs.',
    todo: bubble('Add weighting controls, weighted progress calculations, and reporting.'),
    tags: ['analytics']
  },
  {
    id: 'strategy-map',
    title: 'Strategy Map',
    summary: 'Visual map of goals and connected work.',
    todo: bubble('Design map visualization, zoom/filters, and share/export options.'),
    tags: ['visualization']
  },
  {
    id: 'goal-status',
    title: 'Goal Status & History',
    summary: 'Status updates, history timelines, and commentary.',
    todo: bubble('Implement status templates, history tracking, and notifications.'),
    tags: ['reporting']
  },
]

export const intakeFeatures: BalletFeature[] = [
  {
    id: 'forms',
    title: 'Forms & Intake',
    summary: 'Branching forms with field mapping and file questions.',
    todo: bubble('Create form builder, branching logic engine, file upload support, and task mapping rules.'),
    tags: ['intake']
  },
  {
    id: 'project-templates',
    title: 'Project & Task Templates',
    summary: 'Template gallery plus custom templates.',
    todo: bubble('Template library UI, duplication engine, and version updates.'),
    tags: ['templates']
  },
  {
    id: 'bundles',
    title: 'Bundles',
    summary: 'Reusable combos of sections, fields, rules, and task templates.',
    todo: bubble('Bundle composer, rollout engine, and update propagation jobs.'),
    tags: ['automation']
  },
  {
    id: 'project-intake',
    title: 'Project Intake Flows',
    summary: 'Triage projects, auto-route, and multi-home assignments.',
    todo: bubble('Routing rules, assignment engine, and intake dashboard.'),
    tags: ['routing']
  },
  {
    id: 'importers',
    title: 'CSV & Trello Importers',
    summary: 'Import data from CSV and other tools.',
    todo: bubble('Build import wizards, field mapping, error handling, and undo support.'),
    tags: ['migration']
  },
]

export const automationFeatures: BalletFeature[] = [
  {
    id: 'rules-engine',
    title: 'Rules Engine',
    summary: 'Triggers, conditions, actions, and branching logic.',
    todo: bubble('Automation runtime, rule builder UI, and monitoring alerts.'),
    tags: ['automation']
  },
  {
    id: 'workflow-builder',
    title: 'Workflow Builder',
    summary: 'Visual builder for multi-step workflows, forms, and rules.',
    todo: bubble('Design canvas UI, connector library, and publish versioning.'),
    tags: ['workflow']
  },
  {
    id: 'rule-gallery',
    title: 'Rule Gallery',
    summary: 'Pre-built recipes for quick automation setup.',
    todo: bubble('Create recipe catalog, install wizard, and usage metrics.'),
    tags: ['templates']
  },
  {
    id: 'asana-ai',
    title: 'Asana AI Studio',
    summary: 'AI-assisted workflows, drafting, and routing.',
    todo: bubble('Integrate LLM service layer, prompt governance, and feedback loops.'),
    tags: ['ai']
  },
  {
    id: 'smart-workflows',
    title: 'Smart Workflows',
    summary: 'LLM-powered classification, routing, and drafting.',
    todo: bubble('Automated classification models, routing policies, and confidence thresholds.'),
    tags: ['ai', 'automation']
  },
  {
    id: 'smart-chat',
    title: 'Smart Chat & AI Assists',
    summary: 'Summaries, answers, and status drafting.',
    todo: bubble('Chat assistant UI, contextual embeddings, and activity logging.'),
    tags: ['ai']
  },
  {
    id: 'ai-controls',
    title: 'Org-level AI Controls',
    summary: 'Enable/disable and govern AI usage across org.',
    todo: bubble('Admin policy center, turn-key controls, and usage telemetry.'),
    tags: ['governance']
  },
]

export const collaborationFeatures: BalletFeature[] = [
  {
    id: 'status-updates',
    title: 'Project Status Updates',
    summary: 'Structured updates with highlights and charts.',
    todo: bubble('Status composer, chart embeds, and automated metrics.'),
    tags: ['communication']
  },
  {
    id: 'messages',
    title: 'Messages',
    summary: 'Direct, team, and project-level messaging.',
    todo: bubble('Messaging threads, notifications, and search integration.'),
    tags: ['communication']
  },
  {
    id: 'global-inbox',
    title: 'Global Inbox Controls',
    summary: 'Filtering, pause/Do Not Disturb, email routing.',
    todo: bubble('Inbox filters, DND scheduling, email preferences, and cross-device sync.'),
    tags: ['notifications']
  },
  {
    id: 'proofing-approvals',
    title: 'Proofing & Approvals',
    summary: 'Visual feedback loops tied to approval workflows.',
    todo: bubble('Link proofing annotations to approval states with resolution tracking.'),
    tags: ['approvals', 'creative']
  },
]

export const reportingFeatures: BalletFeature[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    summary: 'Project, portfolio, and org-wide dashboards.',
    todo: bubble('Dashboard builder, data pipeline, and share controls.'),
    tags: ['analytics']
  },
  {
    id: 'chart-types',
    title: 'Chart Types',
    summary: 'Bar, stacked, line, burnup/down, donut, number, lollipop (20 per dashboard).',
    todo: bubble('Chart library, configuration UI, and cache strategy.'),
    tags: ['visualization']
  },
  {
    id: 'real-time-reporting',
    title: 'Real-time Reporting',
    summary: 'Custom fields, workloads, timeline progress, portfolio dashboards.',
    todo: bubble('Real-time aggregation workers, portfolio metrics, and alerting.'),
    tags: ['analytics']
  },
  {
    id: 'exports',
    title: 'Exports & Scheduling',
    summary: 'CSV export, print/share, and scheduled status reports.',
    todo: bubble('Export services, scheduling engine, and delivery preferences.'),
    tags: ['reporting']
  },
]

export const resourceFeatures: BalletFeature[] = [
  {
    id: 'workload-capacity',
    title: 'Workload & Capacity',
    summary: 'Manage capacity by person across projects.',
    todo: bubble('Capacity modeling, alerts, and balancing suggestions.'),
    tags: ['resource']
  },
  {
    id: 'time-tracking-reporting',
    title: 'Time Tracking Reporting',
    summary: 'Consolidated reporting for estimates vs actuals.',
    todo: bubble('Time analytics, export options, and billing integrations.'),
    tags: ['time']
  },
  {
    id: 'capacity-planning',
    title: 'Capacity Planning',
    summary: 'Effort/time fields and portfolio roll-ups for planning.',
    todo: bubble('Scenario planning tools, portfolio-level rollups, and staffing recommendations.'),
    tags: ['planning']
  },
]

export const integrationsFeatures: BalletFeature[] = [
  {
    id: 'integrations-directory',
    title: 'Integrations Directory',
    summary: 'Catalog of native integrations with discovery tools.',
    todo: bubble('Integrations marketplace UI, search, and entitlement controls.'),
    tags: ['integrations']
  },
  {
    id: 'deep-connectors',
    title: 'Deep Connectors',
    summary: 'Slack, Teams, Google Workspace, Jira two-way sync, etc.',
    todo: bubble('Connector blueprints, sync jobs, and conflict resolution strategies.'),
    tags: ['integrations']
  },
  {
    id: 'files-design',
    title: 'Creative & File Integrations',
    summary: 'Zoom, Drive, OneDrive, Dropbox, Adobe, Figma integrations.',
    todo: bubble('OAuth flows, file picker components, and embedded previews.'),
    tags: ['files']
  },
  {
    id: 'email-addins',
    title: 'Email Add-ins',
    summary: 'Gmail/Outlook add-ins to turn emails into tasks.',
    todo: bubble('Build add-in clients, authentication handshake, and task creation pipeline.'),
    tags: ['email']
  },
]

export const developerFeatures: BalletFeature[] = [
  {
    id: 'rest-api',
    title: 'REST API',
    summary: 'Endpoints for tasks, projects, portfolios, goals.',
    todo: bubble('Design REST schema, pagination, rate limits, and docs.'),
    tags: ['api']
  },
  {
    id: 'webhooks',
    title: 'Webhooks & Events',
    summary: 'Realtime change notifications.',
    todo: bubble('Event bus, webhook subscriptions, retries, and monitoring.'),
    tags: ['api']
  },
  {
    id: 'audit-log',
    title: 'Audit Log API',
    summary: 'Enterprise/compliance audit export.',
    todo: bubble('Audit data pipeline, API endpoints, and SIEM integrations.'),
    tags: ['compliance']
  },
  {
    id: 'scim',
    title: 'SCIM Provisioning',
    summary: 'User provisioning via Okta/Entra/Ping/etc.',
    todo: bubble('SCIM endpoints, provisioning jobs, and admin UI.'),
    tags: ['identity']
  },
  {
    id: 'import-export-api',
    title: 'Import/Export APIs',
    summary: 'Programmatic data import/export plus attachments.',
    todo: bubble('Bulk endpoint pipeline, attachment transfer, and job monitoring.'),
    tags: ['api']
  },
]

export const adminSecurityFeatures: BalletFeature[] = [
  {
    id: 'sso',
    title: 'SSO & Authentication',
    summary: 'SSO/SAML, 2FA, and session controls.',
    todo: bubble('Identity provider integration, MFA policies, and session management console.'),
    tags: ['security']
  },
  {
    id: 'scim-service-accounts',
    title: 'SCIM & Service Accounts',
    summary: 'Provision/deprovision and service account governance.',
    todo: bubble('Provisioning workflows, service account policies, and admin tooling.'),
    tags: ['identity']
  },
  {
    id: 'compliance',
    title: 'Compliance & Residency',
    summary: 'Data residency, Enterprise Key Management, privacy controls.',
    todo: bubble('Regional data storage, key management service, and privacy request automation.'),
    tags: ['compliance']
  },
  {
    id: 'data-exports',
    title: 'Org-wide Data Exports',
    summary: 'Admin export/deletion controls with logging.',
    todo: bubble('Bulk export tooling, deletion scheduler, and audit logs.'),
    tags: ['compliance']
  },
]

export const balletSections: BalletSection[] = [
  { id: 'core-structure', title: 'Core Structure & Objects', description: 'Foundational Asana entities, hierarchy, and platform scaffolding.', features: coreStructureFeatures, actionLabel: 'Architecture Review', actionIcon: '🧱' },
  { id: 'task-capabilities', title: 'Task-Level Capabilities', description: 'Scheduling, approvals, proofing, and collaborative tooling on tasks.', features: taskCapabilitiesFeatures, actionLabel: 'Task Engine Plan', actionIcon: '🗂️' },
  { id: 'views', title: 'Views & Visualizations', description: 'Multiple perspectives on the same work.', features: viewsFeatures, actionLabel: 'View Framework', actionIcon: '🖥️' },
  { id: 'goals', title: 'Planning & Goals', description: 'Goal management aligned to work execution.', features: goalsFeatures, actionLabel: 'Goals Rollout', actionIcon: '🎯' },
  { id: 'intake', title: 'Intake, Templates & Standardization', description: 'Reusable processes, forms, and bundles.', features: intakeFeatures, actionLabel: 'Template Strategy', actionIcon: '🧰' },
  { id: 'automation', title: 'Automation & AI', description: 'Rules engine, workflow builder, and AI augmentations.', features: automationFeatures, actionLabel: 'Automation Roadmap', actionIcon: '⚡' },
  { id: 'collab', title: 'Collaboration & Communication', description: 'Status updates, messaging, proofing, and inbox controls.', features: collaborationFeatures, actionLabel: 'Communications Plan', actionIcon: '💬' },
  { id: 'reporting', title: 'Reporting & Analytics', description: 'Dashboards, charts, exports, and scheduling.', features: reportingFeatures, actionLabel: 'Analytics Stack', actionIcon: '📊' },
  { id: 'resource', title: 'Resource Management & Time', description: 'Capacity, time tracking, and planning.', features: resourceFeatures, actionLabel: 'Capacity Modeling', actionIcon: '🧮' },
  { id: 'integrations', title: 'Integrations & Ecosystem', description: 'Native connectors, directory, and email add-ins.', features: integrationsFeatures, actionLabel: 'Integration Catalog', actionIcon: '🔌' },
  { id: 'developer', title: 'Developer Platform', description: 'APIs, webhooks, SCIM, and bulk endpoints.', features: developerFeatures, actionLabel: 'API Specs', actionIcon: '📜' },
  { id: 'admin-security', title: 'Admin, Security & Compliance', description: 'Authentication, provisioning, and compliance programs.', features: adminSecurityFeatures, actionLabel: 'Security Review', actionIcon: '🛡️' },
]
