import React, { useMemo, useState } from 'react'

type SignatureIntegration = {
  id: string
  name: string
  description: string
  documentationUrl: string
}

type StorageIntegration = {
  id: string
  name: string
  description: string
  ownership: 'personal' | 'company'
  documentationUrl: string
}

type DocumentCategory = {
  id: string
  title: string
  description: string
  recommendedOwnership: 'personal' | 'company'
  suggestedDestinations: string[]
}

const signatureIntegrations: SignatureIntegration[] = [
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Route agreements for signature with company managed templates and recipient workflows.',
    documentationUrl: 'https://support.docusign.com/s/articles/How-do-I-connect-DocuSign-to-my-applications',
  },
  {
    id: 'hellosign',
    name: 'Dropbox Sign (HelloSign)',
    description: 'Lightweight e-signature flows for quick approvals and recurring internal documents.',
    documentationUrl: 'https://help.hellosign.com/hc/en-us/articles/217115367',
  },
]

const storageIntegrations: StorageIntegration[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Shared drives for brokerage-wide documents with granular permission controls.',
    ownership: 'company',
    documentationUrl: 'https://support.google.com/a/answer/60781',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Distribute folders to agents and partners with activity logging and file versioning.',
    ownership: 'company',
    documentationUrl: 'https://help.dropbox.com/guide/admin/team-integration',
  },
  {
    id: 'proton-drive',
    name: 'Proton Drive',
    description: 'End-to-end encrypted storage for sensitive personal files and compliance artifacts.',
    ownership: 'personal',
    documentationUrl: 'https://proton.me/support/proton-drive-web',
  },
  {
    id: 'company-bucket',
    name: 'Company Cloud Bucket',
    description: 'Central S3-compatible storage managed by operations for retention and audit trails.',
    ownership: 'company',
    documentationUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-with-s3-actions.html',
  },
]

const documentCategories: DocumentCategory[] = [
  {
    id: 'leases',
    title: 'Leases & Renewals',
    description: 'Executed residential and commercial leases, amendments, and renewal paperwork.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['google-drive', 'dropbox', 'company-bucket'],
  },
  {
    id: 'sales-contracts',
    title: 'Sales Contracts & Closings',
    description: 'Purchase agreements, closing statements, escrow instructions, and title docs.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['google-drive', 'company-bucket', 'dropbox'],
  },
  {
    id: 'ndas',
    title: 'NDAs & Confidentiality Agreements',
    description: 'Signed NDAs with investors, vendors, and prospects.',
    recommendedOwnership: 'personal',
    suggestedDestinations: ['proton-drive', 'google-drive'],
  },
  {
    id: 'employee-agreements',
    title: 'Employee Agreements',
    description: 'Offer letters, employment agreements, contractor packets, and onboarding checklists.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['dropbox', 'google-drive', 'company-bucket'],
  },
  {
    id: 'compliance',
    title: 'Compliance & Licensing',
    description: 'Regulatory filings, brokerage licenses, MLS certificates, and audit packages.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['company-bucket', 'google-drive'],
  },
  {
    id: 'financials',
    title: 'Financial Statements',
    description: 'Budgets, P&L reports, investor updates, and quarterly financial snapshots.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['company-bucket', 'google-drive'],
  },
  {
    id: 'vendor-contracts',
    title: 'Vendor & Service Contracts',
    description: 'Agreements with maintenance vendors, staging partners, and marketing agencies.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['dropbox', 'google-drive'],
  },
  {
    id: 'property-disclosures',
    title: 'Property Disclosures & Inspections',
    description: 'Inspection reports, disclosures, and warranties tied to specific listings.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['google-drive', 'company-bucket'],
  },
  {
    id: 'marketing-assets',
    title: 'Marketing Assets',
    description: 'Approved photos, floor plans, brand kits, and campaign collateral.',
    recommendedOwnership: 'company',
    suggestedDestinations: ['dropbox', 'google-drive'],
  },
  {
    id: 'executive',
    title: 'Executive & Board Records',
    description: 'Board minutes, investor communications, strategic planning docs.',
    recommendedOwnership: 'personal',
    suggestedDestinations: ['proton-drive', 'company-bucket'],
  },
]

export default function DocumentVault() {
  const signatureState = useMemo(
    () =>
      signatureIntegrations.reduce<Record<string, boolean>>((acc, integration) => {
        acc[integration.id] = false
        return acc
      }, {}),
    []
  )

  const storageState = useMemo(
    () =>
      storageIntegrations.reduce<Record<string, boolean>>((acc, integration) => {
        acc[integration.id] = false
        return acc
      }, {}),
    []
  )

  const [signatureConnections, setSignatureConnections] = useState(signatureState)
  const [storageConnections, setStorageConnections] = useState(storageState)

  const toggleSignature = (id: string) => {
    setSignatureConnections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    console.info(`Signature integration toggled: ${id}`)
  }

  const toggleStorage = (id: string) => {
    setStorageConnections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    console.info(`Storage integration toggled: ${id}`)
  }

  const renderToggleButton = (isConnected: boolean, onClick: () => void, label: string) => (
    <button
      type="button"
      onClick={onClick}
      className={`mt-4 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
        isConnected ? 'border border-slate-700/60 bg-slate-800/50 text-slate-200 hover:bg-slate-700/60' : 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600'
      }`}
    >
      {isConnected ? `Disconnect ${label}` : `Connect ${label}`}
    </button>
  )

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100">Document Vault</h1>
        <p className="mt-2 max-w-3xl text-slate-400">
          Centralize visibility into contracts, compliance, and collateral while allowing teams to sync files to their preferred cloud
          storage providers.
        </p>
      </header>

      <section className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg shadow-lg shadow-slate-950/20">
        <div className="border-b border-slate-700/60 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-100">E-signature providers</h2>
          <p className="mt-1 text-sm text-slate-400">
            Route documents to DocuSign or Dropbox Sign and automatically file completed packets into the storage destinations you enable
            below.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {signatureIntegrations.map((integration) => {
            const isConnected = signatureConnections[integration.id]
            return (
              <article key={integration.id} className="flex flex-col justify-between rounded-lg border border-slate-200 p-5">
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
                  <a
                    className="inline-flex text-sm font-medium text-sky-600 hover:text-sky-700"
                    href={integration.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View connection guide
                  </a>
                </div>
                {renderToggleButton(isConnected, () => toggleSignature(integration.id), integration.name)}
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg shadow-lg shadow-slate-950/20">
        <div className="border-b border-slate-700/60 px-6 py-5">
          <h2 className="text-lg font-semibold text-slate-100">Storage destinations</h2>
          <p className="mt-1 text-sm text-slate-400">
            Decide where signed files and supporting documents live. Mix company-controlled drives with agent-managed storage for a hybrid
            approach.
          </p>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-2">
          {storageIntegrations.map((integration) => {
            const isConnected = storageConnections[integration.id]
            return (
              <article key={integration.id} className="flex flex-col justify-between rounded-lg border border-slate-700/60 bg-slate-800/50 p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-100">{integration.name}</h3>
                      <p className="mt-1 text-sm text-slate-400">{integration.description}</p>
                      <p className="mt-2 inline-flex items-center rounded-md bg-slate-700/60 px-2 py-0.5 text-xs font-medium text-slate-400">
                        {integration.ownership === 'company' ? 'Company-managed' : 'Individual agent storage'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        isConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      {isConnected ? 'Connected' : 'Not connected'}
                    </span>
                  </div>
                  <a
                    className="inline-flex text-sm font-medium text-sky-600 hover:text-sky-700"
                    href={integration.documentationUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Provision & security checklist
                  </a>
                </div>
                {renderToggleButton(isConnected, () => toggleStorage(integration.id), integration.name)}
              </article>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-slate-700/60 bg-slate-800/30 backdrop-blur-lg p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-100">Document categories & routing</h2>
          <p className="text-sm text-slate-400">
            Assign a default destination per document type. Agents can override for their personal storage when the category recommends a
            personal vault.
          </p>
        </div>

        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {documentCategories.map((category) => (
            <li key={category.id} className="rounded-lg border border-slate-700/60 bg-slate-800/50 p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-200">{category.title}</p>
              <p className="mt-1 text-sm text-slate-400">{category.description}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Recommended storage: {category.recommendedOwnership === 'company' ? 'Company drive' : 'Personal drive'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {category.suggestedDestinations.map((destination) => {
                  const integration = storageIntegrations.find((item) => item.id === destination)
                  if (!integration) return null
                  const isConnected = storageConnections[integration.id]
                  return (
                    <span
                      key={destination}
                      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${
                        isConnected ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-600'
                      }`}
                    >
                      {integration.name}
                    </span>
                  )
                })}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
