// Sample CRM data scaffolding to power the admin CRM prototypes.
export type TrendDirection = 'up' | 'down' | 'flat'

export interface CrmMetric {
  label: string
  value: string
  change?: string
  trend?: TrendDirection
  description?: string
}

export interface PipelineStage {
  name: string
  amount: string
  deals: number
  velocity: string
  conversion: string
}

export interface ForecastSnapshot {
  period: string
  weighted: string
  bestCase: string
  commit: string
}

export interface AccountRecord {
  id: string
  name: string
  segment: string
  owner: string
  arr: string
  health: 'healthy' | 'risk' | 'warning'
  nextStep: string
}

export interface ContactRecord {
  id: string
  name: string
  title: string
  account: string
  status: 'Active' | 'Onboarding' | 'Churn Risk' | 'Prospect'
  owner: string
  lastActivity: string
}

export interface DealRecord {
  id: string
  name: string
  stage: string
  amount: string
  closeDate: string
  probability: string
  owner: string
}

export interface ActivityRecord {
  id: string
  type: 'Call' | 'Email' | 'Meeting' | 'Demo'
  summary: string
  date: string
  owner: string
  outcome: string
}

export interface TaskRecord {
  id: string
  title: string
  due: string
  owner: string
  priority: 'High' | 'Medium' | 'Low'
  relatedTo: string
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Blocked'
}

export interface CampaignRecord {
  id: string
  name: string
  channel: 'Email' | 'Paid Media' | 'Social' | 'Events'
  status: 'Planning' | 'Live' | 'Completed'
  budget: string
  pipelineInfluence: string
  mqls: number
}

export interface AutomationFlow {
  id: string
  name: string
  trigger: string
  objective: string
  status: 'Active' | 'Draft'
}

export interface ServiceTicket {
  id: string
  title: string
  account: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'New' | 'Assigned' | 'In Progress' | 'Waiting' | 'Resolved'
  owner: string
  createdAt: string
}

export interface IntegrationCard {
  id: string
  name: string
  category: 'Sales' | 'Marketing' | 'Support' | 'Productivity' | 'Finance' | 'Analytics'
  status: 'Connected' | 'Available'
  description: string
}

export interface Playbook {
  id: string
  title: string
  audience: string
  outcome: string
}

export interface BlueprintFeature {
  id: string
  title: string
  summary: string
  todo: string
  tags?: string[]
}

export const overviewMetrics: CrmMetric[] = [
  {
    label: 'Active Deals',
    value: '72',
    change: '+8.5% vs last month',
    trend: 'up',
    description: 'Open opportunities across all pipelines.'
  },
  {
    label: 'Pipeline Value',
    value: 'R$ 38.4M',
    change: '+R$ 4.1M QoQ',
    trend: 'up',
    description: 'Total amount across active opportunities.'
  },
  {
    label: 'Win Rate',
    value: '24.6%',
    change: '-1.2 pts vs goal',
    trend: 'down',
    description: 'Rolling 90-day closed won ratio.'
  },
  {
    label: 'Sales Velocity',
    value: '64 days',
    change: '↓ 5 days MoM',
    trend: 'up',
    description: 'Average time to convert from lead to close.'
  },
  {
    label: 'NPS',
    value: '47',
    change: '+6 pts vs last survey',
    trend: 'up',
    description: 'Net promoter score for current clients.'
  },
  {
    label: 'Renewals',
    value: '92%',
    change: '+3 pts YoY',
    trend: 'up',
    description: 'Renewal rate for managed accounts.'
  },
]

export const pipelineStages: PipelineStage[] = [
  { name: 'Inbound Leads', amount: 'R$ 8.4M', deals: 145, velocity: '3.2 days', conversion: '14%' },
  { name: 'Qualified', amount: 'R$ 12.7M', deals: 86, velocity: '7.1 days', conversion: '35%' },
  { name: 'Proposal', amount: 'R$ 9.9M', deals: 44, velocity: '11.3 days', conversion: '52%' },
  { name: 'Negotiation', amount: 'R$ 5.2M', deals: 24, velocity: '8.6 days', conversion: '63%' },
  { name: 'Contract Sent', amount: 'R$ 2.2M', deals: 12, velocity: '4.4 days', conversion: '71%' },
]

export const forecastByPeriod: ForecastSnapshot[] = [
  { period: 'This Month', weighted: 'R$ 5.4M', bestCase: 'R$ 7.1M', commit: 'R$ 4.6M' },
  { period: 'Next Month', weighted: 'R$ 4.1M', bestCase: 'R$ 6.8M', commit: 'R$ 3.2M' },
  { period: 'Quarter', weighted: 'R$ 15.9M', bestCase: 'R$ 22.4M', commit: 'R$ 12.6M' },
]

export const accountRecords: AccountRecord[] = [
  { id: 'ACC-001', name: 'Atlas Development Group', segment: 'Enterprise', owner: 'Amanda Costa', arr: 'R$ 1.8M', health: 'healthy', nextStep: 'Executive QBR · 18 Jun' },
  { id: 'ACC-014', name: 'Verde Residence', segment: 'Mid-Market', owner: 'Patrick Silva', arr: 'R$ 720K', health: 'warning', nextStep: 'Renewal proposal · due 5 Jul' },
  { id: 'ACC-031', name: 'Prime Towers', segment: 'Enterprise', owner: 'Luciana Souza', arr: 'R$ 2.1M', health: 'healthy', nextStep: 'On-site visit · scheduled 21 Jun' },
  { id: 'ACC-052', name: 'Horizonte Flats', segment: 'SMB', owner: 'Julio Martins', arr: 'R$ 210K', health: 'risk', nextStep: 'Escalated ticket · awaiting reply' },
]

export const contactRecords: ContactRecord[] = [
  { id: 'CON-104', name: 'Carla Ramos', title: 'Ops Director', account: 'Atlas Development Group', status: 'Active', owner: 'Amanda Costa', lastActivity: 'Executive sync · 14 Jun' },
  { id: 'CON-155', name: 'Eduardo Lopes', title: 'CFO', account: 'Verde Residence', status: 'Churn Risk', owner: 'Patrick Silva', lastActivity: 'Open escalations · 9 Jun' },
  { id: 'CON-192', name: 'Fernanda Maia', title: 'Sales Lead', account: 'Prime Towers', status: 'Onboarding', owner: 'Luciana Souza', lastActivity: 'Enablement session · 13 Jun' },
  { id: 'CON-211', name: 'Rafael Siqueira', title: 'CEO', account: 'Horizonte Flats', status: 'Prospect', owner: 'Julio Martins', lastActivity: 'Intro call · 11 Jun' },
]

export const dealRecords: DealRecord[] = [
  { id: 'DL-883', name: 'Prime Towers · Tower B', stage: 'Negotiation', amount: 'R$ 6.8M', closeDate: '30 Jun 2024', probability: '65%', owner: 'Luciana Souza' },
  { id: 'DL-877', name: 'Atlas Residence · Phase II', stage: 'Proposal', amount: 'R$ 4.2M', closeDate: '18 Jul 2024', probability: '45%', owner: 'Amanda Costa' },
  { id: 'DL-872', name: 'Verde Residence · Renew', stage: 'Contract Sent', amount: 'R$ 2.1M', closeDate: '05 Jul 2024', probability: '70%', owner: 'Patrick Silva' },
  { id: 'DL-861', name: 'Horizonte Flats · Expansion', stage: 'Qualified', amount: 'R$ 1.2M', closeDate: '28 Aug 2024', probability: '25%', owner: 'Julio Martins' },
]

export const activityRecords: ActivityRecord[] = [
  { id: 'ACT-998', type: 'Meeting', summary: 'Prime Towers renewal strategy session', date: '14 Jun · 10:00', owner: 'Luciana Souza', outcome: 'Contract adjustments shared' },
  { id: 'ACT-1003', type: 'Call', summary: 'Atlas onboarding sprint alignment', date: '13 Jun · 16:30', owner: 'Amanda Costa', outcome: 'Action items assigned' },
  { id: 'ACT-989', type: 'Email', summary: 'Verde CFO follow-up on pricing', date: '12 Jun · 09:20', owner: 'Patrick Silva', outcome: 'Awaiting finance feedback' },
  { id: 'ACT-965', type: 'Demo', summary: 'Horizonte partner portal walk-through', date: '11 Jun · 15:00', owner: 'Julio Martins', outcome: 'Positive · scheduling trial' },
]

export const taskRecords: TaskRecord[] = [
  { id: 'TASK-118', title: 'Prep Verde renewal deck', due: '17 Jun', owner: 'Patrick Silva', priority: 'High', relatedTo: 'Verde Residence', status: 'In Progress' },
  { id: 'TASK-119', title: 'Prime legal review', due: '19 Jun', owner: 'Luciana Souza', priority: 'High', relatedTo: 'Prime Towers', status: 'Upcoming' },
  { id: 'TASK-120', title: 'Atlas technical audit', due: '21 Jun', owner: 'Amanda Costa', priority: 'Medium', relatedTo: 'Atlas Development Group', status: 'In Progress' },
  { id: 'TASK-121', title: 'Horizonte onboarding plan', due: '24 Jun', owner: 'Julio Martins', priority: 'Low', relatedTo: 'Horizonte Flats', status: 'Blocked' },
]

export const campaignRecords: CampaignRecord[] = [
  { id: 'CMP-401', name: 'Luxury Buyer Journey 2024', channel: 'Email', status: 'Live', budget: 'R$ 180K', pipelineInfluence: 'R$ 6.4M', mqls: 312 },
  { id: 'CMP-384', name: 'Developers Summit · São Paulo', channel: 'Events', status: 'Planning', budget: 'R$ 420K', pipelineInfluence: 'R$ 4.8M', mqls: 0 },
  { id: 'CMP-372', name: 'Paid Social · Launch', channel: 'Social', status: 'Completed', budget: 'R$ 95K', pipelineInfluence: 'R$ 2.3M', mqls: 118 },
  { id: 'CMP-365', name: 'Investor Insights Webinar', channel: 'Email', status: 'Live', budget: 'R$ 60K', pipelineInfluence: 'R$ 1.7M', mqls: 76 },
]

export const automationFlows: AutomationFlow[] = [
  { id: 'FLOW-08', name: 'Lead assignment · São Paulo', trigger: 'New lead in territory', objective: 'Route to territory owner', status: 'Active' },
  { id: 'FLOW-09', name: 'Contract reminder', trigger: 'Contract sent · 72h no signature', objective: 'Reminder to client + owner', status: 'Active' },
  { id: 'FLOW-10', name: 'Post-close checklist', trigger: 'Deal stage = Closed Won', objective: 'Kickoff onboarding workflow', status: 'Draft' },
]

export const serviceTickets: ServiceTicket[] = [
  { id: 'TCK-221', title: 'Portal access outage', account: 'Horizonte Flats', priority: 'High', status: 'In Progress', owner: 'Support · Camila', createdAt: '14 Jun · 08:14' },
  { id: 'TCK-219', title: 'Billing enquiry · Verde', account: 'Verde Residence', priority: 'Medium', status: 'Assigned', owner: 'Support · Felipe', createdAt: '13 Jun · 12:42' },
  { id: 'TCK-217', title: 'Custom report request', account: 'Prime Towers', priority: 'Low', status: 'Waiting', owner: 'Analytics · Sofia', createdAt: '12 Jun · 09:05' },
]

export const integrationCards: IntegrationCard[] = [
  { id: 'INT-02', name: 'HubSpot Marketing', category: 'Marketing', status: 'Connected', description: 'Sync marketing qualified leads and campaign performance.' },
  { id: 'INT-05', name: 'Zendesk', category: 'Support', status: 'Connected', description: 'Surface customer tickets and SLAs inside the CRM.' },
  { id: 'INT-07', name: 'DocuSign', category: 'Sales', status: 'Available', description: 'Trigger agreements and track signing status from deals.' },
  { id: 'INT-11', name: 'Slack', category: 'Productivity', status: 'Connected', description: 'Push pipeline alerts into channel workflows.' },
  { id: 'INT-14', name: 'Google Data Studio', category: 'Analytics', status: 'Available', description: 'Advanced analytics and blended dashboards.' },
]

export const playbooks: Playbook[] = [
  { id: 'PL-01', title: 'Enterprise Onboarding', audience: 'CS & Implementation', outcome: 'Accelerate time-to-value for complex accounts.' },
  { id: 'PL-02', title: 'Renewal Risk Mitigation', audience: 'Account Management', outcome: 'Early detection and intervention for churn signals.' },
  { id: 'PL-03', title: 'Upsell Motion · Premium Services', audience: 'Sales & CS', outcome: 'Coordinate cross-sell across developers and brokers.' },
]

export const constellationBlueprints: BlueprintFeature[] = [
  {
    id: 'core-objects',
    title: 'Constelação Core Objects',
    summary: 'Accounts, contacts, leads, and opportunities with pipeline stages, probability, and close dates.',
    todo: '⚠️ Build: Prisma schema + Supabase migrations, CRUD APIs, record linking UI, pipeline kanban, probability model, and SLA rules.',
    tags: ['data-model', 'salesforce', 'monday']
  },
  {
    id: 'activities-sync',
    title: 'Activities & Calendar Sync',
    summary: 'Tasks, events, calls with bi-directional Gmail/Outlook sync.',
    todo: '⚠️ Build: Activity object, background sync workers (Google/Microsoft APIs), webhook listeners, timeline/calendar UI, ownership routing.',
    tags: ['productivity']
  },
  {
    id: 'products-catalog',
    title: 'Products, Price Books, Quotes, Contracts, Orders, Assets',
    summary: 'Commercial catalog and post-sale lifecycle artifacts.',
    todo: '⚠️ Build: Hierarchical product catalog, price-book matrix, quote composer, contract versioning, order fulfillment workflow, asset tracking.',
    tags: ['cpq']
  },
  {
    id: 'campaign-members',
    title: 'Constelação Campaigns & Members',
    summary: 'Marketing attribution and segmentation within CRM records.',
    todo: '⚠️ Build: Campaign entity, member linking, response tracking, multi-touch attribution, list view filters, sync to marketing tools.',
    tags: ['marketing']
  },
  {
    id: 'notes-files',
    title: 'Notes, Files, Content Delivery & Versioning',
    summary: 'Record-level collaboration with asset lifecycle management.',
    todo: '⚠️ Build: Rich-text notes, file storage (S3/Supabase), version history, share settings, preview + DocuSign attachment hooks.',
    tags: ['collaboration']
  },
  {
    id: 'data-quality',
    title: 'Data Quality & Governance',
    summary: 'Validation rules, duplicate detection, merge flows, required fields, record types, page layouts.',
    todo: '⚠️ Build: Validation engine, duplicate jobs, merge UI, configurable layouts, admin UI for rules, field-level audit trail.',
    tags: ['governance']
  },
  {
    id: 'global-search',
    title: 'Global Search & Smart Lists',
    summary: 'Cross-object search, list views, inline edit, related lists, path guidance.',
    todo: '⚠️ Build: Search index (Meilisearch/Elastic), saved filters, inline editing, related list component, stage path UI with checklist.',
    tags: ['ux']
  },
]

export const salesProductivityBlueprints: BlueprintFeature[] = [
  {
    id: 'einstein-ai',
    title: 'Einstein / AI Assistants',
    summary: 'Lead scoring, next-best actions, conversation insights.',
    todo: '⚠️ Build: Scoring models, action recommendation engine, call transcription service, coaching UI, feedback loop.',
    tags: ['ai']
  },
  {
    id: 'sales-cadences',
    title: 'Sales Cadences & Communication Tools',
    summary: 'Sequences, dialer, logged calls, email templates, tracking, scheduling.',
    todo: '⚠️ Build: Cadence designer, telephony integration (Twilio), template management, open/click tracking, meeting scheduler link.',
    tags: ['sales']
  },
  {
    id: 'forecasting',
    title: 'Forecasting & Quota Management',
    summary: 'Rollups by rep, team, product, territory with submission workflows.',
    todo: '⚠️ Build: Forecast hierarchy, rollup jobs, override approvals, quota assignments, forecast commit UI.',
    tags: ['forecast']
  },
  {
    id: 'territory-management',
    title: 'Territory Management & Assignment',
    summary: 'Rules, hierarchies, round-robin, geo/segment routing.',
    todo: '⚠️ Build: Territory model, rule builder, scheduler to reassign owners, visual maps, performance analytics.',
    tags: ['routing']
  },
  {
    id: 'prm-portals',
    title: 'Partner Relationship Management',
    summary: 'External partner portals and shared pipelines.',
    todo: '⚠️ Build: Partner portal auth, shared objects with permission layers, deal registration, MDF workflows, co-selling analytics.',
    tags: ['portals']
  },
  {
    id: 'slack-integration',
    title: 'Slack Integration on Records & Rooms',
    summary: 'Collaborative deal rooms embedded in CRM.',
    todo: '⚠️ Build: Slack app, record-linked channels, slash commands, message actions, alert routing, incident fallback.',
    tags: ['collaboration']
  },
]

export const cpqBlueprints: BlueprintFeature[] = [
  {
    id: 'quotes-workflows',
    title: 'Quotes & Approvals',
    summary: 'Generate PDF proposals with approval flows.',
    todo: '⚠️ Build: Quote templates, pricing merge fields, approval routing UI, PDF generation, version control.',
    tags: ['cpq']
  },
  {
    id: 'cpq-engine',
    title: 'CPQ Lifecycle',
    summary: 'Bundles, configuration rules, pricing tiers, discount schedules, renewals, amendments.',
    todo: '⚠️ Build: Rules engine, bundle configurator, pricing calculator, amendment wizard, renew/upsell automation, audit logging.',
    tags: ['cpq']
  },
  {
    id: 'subscriptions-usage',
    title: 'Subscriptions & Usage Deals',
    summary: 'Manage ramp deals, consumption tracking, quote-to-cash handoff.',
    todo: '⚠️ Build: Usage metering pipeline, schedule-based billing plans, integration to finance ERP, reconciliation dashboards.',
    tags: ['billing']
  },
  {
    id: 'orders-invoicing',
    title: 'Orders, Invoicing, Billing',
    summary: 'Post-quote financial processes via add-ons.',
    todo: '⚠️ Build: Order object, invoice generator, payment status sync, revenue recognition schedules, ERP connectors.',
    tags: ['finance']
  },
  {
    id: 'trailhead-integration',
    title: 'Trailhead Enablement',
    summary: 'Training resources tied to CPQ rollout.',
    todo: '⚠️ Build: Embed Trailhead modules, progress tracking, launch plan checklists for sales ops enablement.',
    tags: ['enablement']
  },
]

export const serviceBlueprints: BlueprintFeature[] = [
  {
    id: 'case-management',
    title: 'Case Management & SLAs',
    summary: 'Email-to-case, web-to-case, queues, entitlements.',
    todo: '⚠️ Build: Case intake forms, routing queues, SLA timers, escalation workflows, customer notification templates.',
    tags: ['service']
  },
  {
    id: 'omni-channel',
    title: 'Omni-Channel Routing',
    summary: 'Chat, voice, messaging, social, skills-based distribution.',
    todo: '⚠️ Build: Channel adapters, presence management, skills engine, unified agent console, concurrency controls.',
    tags: ['contact-center']
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    summary: 'Authoring, versioning, article attach to cases.',
    todo: '⚠️ Build: Knowledge article CMS, review workflow, case attach UI, customer portal exposure, search analytics.',
    tags: ['knowledge']
  },
  {
    id: 'self-service',
    title: 'Self-Service Portals & Chatbot',
    summary: 'Communities, deflection bots, authenticated experiences.',
    todo: '⚠️ Build: Portal templates, chatbot flows, deflection analytics, identity integration, content gating.',
    tags: ['experience']
  },
  {
    id: 'field-service',
    title: 'Field Service Operations',
    summary: 'Work orders, scheduling, dispatcher console, technician mobile app.',
    todo: '⚠️ Build: Work order object, scheduling optimizer, dispatcher UI, technician mobile app shell, parts inventory sync.',
    tags: ['field-service']
  },
]

export const marketingBlueprints: BlueprintFeature[] = [
  {
    id: 'journey-builder',
    title: 'Journey Builder & Automation Studio',
    summary: 'Visual orchestration across channels.',
    todo: '⚠️ Build: Drag-and-drop journey designer, automation scheduler, entry/exit criteria engine, testing sandbox.',
    tags: ['marketing-cloud']
  },
  {
    id: 'email-mobile-studio',
    title: 'Email & Mobile Studios',
    summary: 'Email/SMS/push orchestration, personalization, ad audiences.',
    todo: '⚠️ Build: Content builder, segment sync, deliverability monitoring, ad platform connectors, compliance preferences center.',
    tags: ['messaging']
  },
  {
    id: 'account-engagement',
    title: 'Lead Nurturing & Scoring',
    summary: 'Pardot-style nurturing, landing pages, scoring models.',
    todo: '⚠️ Build: Form builder, scoring rules, grading profiles, asset library, campaign influence reporting.',
    tags: ['pardot']
  },
  {
    id: 'triggered-sends',
    title: 'Triggered Sends & Tracking',
    summary: 'Send classifications, deliverability dashboards.',
    todo: '⚠️ Build: Trigger APIs, send classification settings, deliverability analytics, suppression management.',
    tags: ['marketing-ops']
  },
]

export const commerceBlueprints: BlueprintFeature[] = [
  {
    id: 'commerce-cloud',
    title: 'Commerce Cloud Storefronts',
    summary: 'B2C/B2B stores, catalogs, promotions, checkout.',
    todo: '⚠️ Build: Catalog service, pricing rules, promotion engine, checkout integration, order capture pipeline.',
    tags: ['commerce']
  },
  {
    id: 'experience-cloud',
    title: 'Experience Cloud Sites & CMS',
    summary: 'Portals for customers/partners/employees.',
    todo: '⚠️ Build: Site builder, CMS integration, authentication flows, mobile publisher pipeline.',
    tags: ['experience']
  },
]

export const analyticsBlueprints: BlueprintFeature[] = [
  {
    id: 'reports-dashboards',
    title: 'Reports & Dashboards',
    summary: 'Tabular, summary, matrix, joined, scheduled & subscribed.',
    todo: '⚠️ Build: Report builder, data warehouse views, scheduling engine, subscription notifications, sharing controls.',
    tags: ['analytics']
  },
  {
    id: 'tableau-crm',
    title: 'Tableau & CRM Analytics',
    summary: 'Advanced modeling and visualizations.',
    todo: '⚠️ Build: Tableau embedding, dataset pipelines, predictive dashboards, governance for data refresh.',
    tags: ['bi']
  },
  {
    id: 'data-cloud',
    title: 'Data Cloud (CDP)',
    summary: 'Ingestion connectors, identity resolution, segment activation.',
    todo: '⚠️ Build: CDP schema, connector hub, identity graph service, segment activation APIs, privacy controls.',
    tags: ['cdp']
  },
  {
    id: 'ai-agents',
    title: 'AI Agents (Agentforce 360)',
    summary: 'Agent builder, scripts, Slack/voice integration, governance.',
    todo: '⚠️ Build: Agent design studio, prompt governance, voice/Slack adapters, compliance guardrails, rollout plan.',
    tags: ['ai']
  },
]

export const platformBlueprints: BlueprintFeature[] = [
  {
    id: 'custom-objects',
    title: 'Custom Objects & Dynamic Forms',
    summary: 'Extend data model with layouts and record types.',
    todo: '⚠️ Build: Metadata-driven object builder, dynamic form designer, record type manager, deployment scripts.',
    tags: ['platform']
  },
  {
    id: 'automation-flow',
    title: 'Automation: Flow & Approvals',
    summary: 'Record-triggered, screen flows, orchestrations, approvals.',
    todo: '⚠️ Build: Flow canvas, runtime engine, approval steps, monitoring dashboard, rollback safety.',
    tags: ['automation']
  },
  {
    id: 'code-platform',
    title: 'Apex & LWC Stack',
    summary: 'Server & UI extensibility layers.',
    todo: '⚠️ Build: Apex-like runtime (or Node services), trigger framework, component library, sandboxes for testing.',
    tags: ['dev']
  },
  {
    id: 'api-layer',
    title: 'APIs & Events',
    summary: 'REST/SOAP/Bulk/Streaming, Platform Events, Outbound Messages.',
    todo: '⚠️ Build: API gateway, schema registry, streaming server, outbound messaging infrastructure, throttling controls.',
    tags: ['integration']
  },
  {
    id: 'appexchange',
    title: 'AppExchange & Packaging',
    summary: 'Marketplace, managed packages.',
    todo: '⚠️ Build: Package builder, dependency resolver, marketplace UI, billing/invoicing for apps.',
    tags: ['marketplace']
  },
  {
    id: 'mulesoft-integration',
    title: 'Integration Services (MuleSoft)',
    summary: 'External services, named credentials, orchestration.',
    todo: '⚠️ Build: Integration hub, credential vault, flow connectors, monitoring & retry policies.',
    tags: ['integration']
  },
]

export const collaborationBlueprints: BlueprintFeature[] = [
  {
    id: 'mobile-app',
    title: 'Salesforce Mobile App',
    summary: 'Offline-first mobile access with in-app guidance.',
    todo: '⚠️ Build: React Native/Expo shell, offline cache, guided walkthroughs, push notifications, security hardening.',
    tags: ['mobile']
  },
  {
    id: 'slack-apps',
    title: 'Slack Apps & Quip Docs',
    summary: 'Collaborative docs and messaging extensions.',
    todo: '⚠️ Build: Slack workspace apps, Quip/Docs integration, live doc embeds, mention notifications, collaboration analytics.',
    tags: ['collaboration']
  },
  {
    id: 'email-builder',
    title: 'Email Templates & Builder',
    summary: 'Reusable templates for sales + service.',
    todo: '⚠️ Build: Drag-and-drop email builder, shared content blocks, approval workflow, localization support.',
    tags: ['communication']
  },
]

export const securityBlueprints: BlueprintFeature[] = [
  {
    id: 'access-control',
    title: 'Profiles, Roles, Permission Sets',
    summary: 'Granular sharing and access control.',
    todo: '⚠️ Build: RBAC/ABAC engine, territory/criteria sharing, manual share UI, audit logging.',
    tags: ['security']
  },
  {
    id: 'shield',
    title: 'Shield & Security Controls',
    summary: 'Platform encryption, field audit, event monitoring, MFA, SSO, IP controls.',
    todo: '⚠️ Build: Encryption service, audit data pipeline, SSO integration, MFA policies, IP restriction enforcement.',
    tags: ['security']
  },
  {
    id: 'devops',
    title: 'Sandboxes & DevOps',
    summary: 'Sandboxes, scratch orgs, change sets, DevOps Center, audit logs.',
    todo: '⚠️ Build: Environment provisioning, metadata deployer, change tracking, rollback plans, audit exports.',
    tags: ['devops']
  },
]

export const mondayWorkBlueprints: BlueprintFeature[] = [
  {
    id: 'workspaces-boards',
    title: 'Workspaces, Folders, Boards',
    summary: 'Work OS hierarchy mirroring monday.com structure.',
    todo: '⚠️ Build: Workspace management, board schema, permissions, sharing controls, folder organization.',
    tags: ['monday']
  },
  {
    id: 'items-columns',
    title: 'Items & Column Types',
    summary: 'Support column types (status, text, numbers, people, timeline, dependency, mirror, formula, files, etc.).',
    todo: '⚠️ Build: Dynamic column engine, formula parser, dependency graph, file storage, board-to-board mirroring.',
    tags: ['monday']
  },
  {
    id: 'item-updates',
    title: 'Item Updates & Activity Logs',
    summary: 'Threaded discussions, mentions, files, audit history.',
    todo: '⚠️ Build: Comment system, mention notifications, versioning, audit export APIs.',
    tags: ['collaboration']
  },
  {
    id: 'templates-library',
    title: 'Templates Library',
    summary: 'Pre-built boards for CRM, marketing, IT, etc.',
    todo: '⚠️ Build: Template catalog, duplication engine, metadata tagging, onboarding walkthrough.',
    tags: ['templates']
  },
]

export const mondayViewsBlueprints: BlueprintFeature[] = [
  {
    id: 'views-visualization',
    title: 'Views & Visualization',
    summary: 'Table, Kanban, Gantt, Timeline, Calendar, Chart, Workload, Map.',
    todo: '⚠️ Build: View framework, data transforms, workload calculations, geospatial rendering, share/export options.',
    tags: ['visualization']
  },
  {
    id: 'dashboards-widgets',
    title: 'Dashboards & Widgets',
    summary: 'Cross-board dashboards with widget catalog.',
    todo: '⚠️ Build: Dashboard builder, widget SDK, multi-board aggregation, goal tracking, permission inheritance.',
    tags: ['dashboard']
  },
]

export const mondayAutomationBlueprints: BlueprintFeature[] = [
  {
    id: 'automation-recipes',
    title: 'Automation Recipes',
    summary: 'No-code triggers/conditions/actions across boards.',
    todo: '⚠️ Build: Recipe builder, execution engine, SLA reminders, quota controls, audit logs.',
    tags: ['automation']
  },
  {
    id: 'automation-governance',
    title: 'Automation Governance',
    summary: 'Run history, ownership transfer, error handling.',
    todo: '⚠️ Build: Monitoring UI, quota management, ownership reassignment, failure notifications.',
    tags: ['governance']
  },
]

export const mondayIntegrationBlueprints: BlueprintFeature[] = [
  {
    id: 'native-integrations',
    title: 'Native Integrations',
    summary: 'Gmail, Outlook, Slack, Teams, Zoom, Drive, Jira, GitHub, HubSpot, Mailchimp, Shopify, Stripe, Zendesk, etc.',
    todo: '⚠️ Build: Integration catalog, OAuth connectors, job schedulers, data mapping UI, rate limit handling.',
    tags: ['integrations']
  },
  {
    id: 'integration-governance',
    title: 'Integration Governance',
    summary: 'Webhooks, action metering, governance controls.',
    todo: '⚠️ Build: Webhook dispatcher, metering dashboard, cost tracking, policy enforcement.',
    tags: ['governance']
  },
]

export const mondayCrmBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-crm-objects',
    title: 'Lead/Contact/Account/Deal Objects',
    summary: 'Customizable CRM schema inside boards.',
    todo: '⚠️ Build: Board templates for CRM, customizable columns, sync to core CRM objects, view presets.',
    tags: ['crm']
  },
  {
    id: 'monday-email-sync',
    title: 'Two-way Email Sync',
    summary: 'Gmail/Outlook sync, tracking, templates.',
    todo: '⚠️ Build: IMAP/Graph connectors, timeline mapping, template library, email tracking pixel.',
    tags: ['email']
  },
  {
    id: 'monday-web-forms',
    title: 'Web Forms & Lead Intake',
    summary: 'Lead capture, assignment rules, SLA views.',
    todo: '⚠️ Build: Form builder, routing automations, SLA dashboards, spam controls.',
    tags: ['intake']
  },
  {
    id: 'monday-quotes',
    title: 'Quotes & Forecasting',
    summary: 'Catalog, basic forecasting dashboards.',
    todo: '⚠️ Build: Product catalog board, quote generator, forecasting widgets, pipeline dashboards.',
    tags: ['sales']
  },
  {
    id: 'monday-calendar-calls',
    title: 'Calendar & Call Logging',
    summary: 'Meeting scheduling, call integrations.',
    todo: '⚠️ Build: Calendar integrations, scheduling links, call log board, integration with VoIP providers.',
    tags: ['productivity']
  },
]

export const mondaySuiteBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-projects',
    title: 'Work Management Portfolios',
    summary: 'Portfolios, milestones, dependencies, resource planning, risk signals.',
    todo: '⚠️ Build: Portfolio hierarchy, milestone tracking, dependency engine, risk scoring, capacity planner.',
    tags: ['projects']
  },
  {
    id: 'monday-marketer',
    title: 'Marketing Suite',
    summary: 'Campaign briefs, approvals, content calendar.',
    todo: '⚠️ Build: Campaign brief templates, approval workflows, shared calendars, asset repository.',
    tags: ['marketing']
  },
  {
    id: 'monday-service',
    title: 'Service Suite',
    summary: 'Ticket intake, routing, knowledge boards, SLAs.',
    todo: '⚠️ Build: Service board templates, automation recipes, knowledge base linking, SLA monitoring.',
    tags: ['service']
  },
  {
    id: 'monday-dev',
    title: 'Dev Suite',
    summary: 'Roadmap, epics/stories, sprints, bug boards, git integrations.',
    todo: '⚠️ Build: Dev board templates, sprint planning tools, GitHub/Jira integration recipes, release dashboards.',
    tags: ['dev']
  },
]

export const mondayDocsBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-workdocs',
    title: 'monday Workdocs & Whiteboards',
    summary: 'Collaborative docs with live embeds.',
    todo: '⚠️ Build: Doc editor, board embed blocks, version history, live cursors, export options.',
    tags: ['docs']
  },
  {
    id: 'monday-chat',
    title: 'In-item Threads & Notifications',
    summary: 'Board chat, inbox, mentions.',
    todo: '⚠️ Build: Notification center, real-time chat, mention routing, digest emails.',
    tags: ['collaboration']
  },
]

export const mondayFormsBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-forms',
    title: 'Forms & Intake',
    summary: 'Board-backed forms with conditional logic and file upload.',
    todo: '⚠️ Build: Form designer, conditional branching, public share links, file handling, dedupe rules.',
    tags: ['forms']
  },
  {
    id: 'monday-duplicate-control',
    title: 'Duplicate Control',
    summary: 'Prevent duplicate submissions.',
    todo: '⚠️ Build: Submission fingerprinting, dedupe review UI, merge workflow.',
    tags: ['data-quality']
  },
]

export const mondayPortfolioBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-cross-dependencies',
    title: 'Portfolio & Resource Roll-ups',
    summary: 'Cross-project dependencies and workload views.',
    todo: '⚠️ Build: Portfolio boards, dependency matrix, workload heatmap, capacity thresholds, alerts.',
    tags: ['portfolio']
  },
]

export const mondayPermissionsBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-permissions',
    title: 'Permissions & Admin',
    summary: 'Workspace/board/item permissions, guests, private boards.',
    todo: '⚠️ Build: Permission engine, guest access controls, privacy settings UI, audit logs.',
    tags: ['security']
  },
  {
    id: 'monday-enterprise',
    title: 'Enterprise Compliance',
    summary: 'SSO/SAML/SCIM, audit logs, session management, IP restrictions, data residency, HIPAA/GDPR, backups.',
    todo: '⚠️ Build: Identity provider integration, provisioning sync, compliance dashboards, backup/restore tooling.',
    tags: ['enterprise']
  },
]

export const mondayApiBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-graphql',
    title: 'GraphQL API & Webhooks',
    summary: 'Single endpoint API with mutations and webhooks.',
    todo: '⚠️ Build: GraphQL gateway, schema explorer, webhook subscriptions, rate limiting.',
    tags: ['api']
  },
  {
    id: 'monday-app-framework',
    title: 'App Framework & SDK',
    summary: 'Custom views, widgets, integrations.',
    todo: '⚠️ Build: App scaffolding CLI, SDKs, sandbox environment, marketplace submission flow.',
    tags: ['platform']
  },
]

export const mondayAiBlueprints: BlueprintFeature[] = [
  {
    id: 'monday-ai',
    title: 'monday AI Assistants',
    summary: 'Workflow generation, summaries, insights, content helpers.',
    todo: '⚠️ Build: AI service layer, prompt templates, workflow generator, governance controls, telemetry.',
    tags: ['ai']
  },
]

export const mobileDesktopBlueprints: BlueprintFeature[] = [
  {
    id: 'mobile-desktop',
    title: 'Mobile & Desktop Apps',
    summary: 'iOS/Android/desktop clients with offline-lite and push notifications.',
    todo: '⚠️ Build: Mobile shell, sync engine, offline caching, desktop wrapper, push pipeline.',
    tags: ['mobile']
  },
]

export const governanceSupportBlueprints: BlueprintFeature[] = [
  {
    id: 'governance-support',
    title: 'Governance & Support',
    summary: 'Admin console, user provisioning, audit exports, support ecosystem.',
    todo: '⚠️ Build: Admin analytics, provisioning workflows, export APIs, partner marketplace, support ticket routing.',
    tags: ['governance']
  },
]
