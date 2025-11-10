import React from 'react';
import { useTranslation } from 'react-i18next';

export default function BetaTerms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 dark:from-slate-900 dark:via-teal-950 dark:to-emerald-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 dark:from-teal-400 dark:to-emerald-400 rounded-2xl mb-6 shadow-lg shadow-teal-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Beta / Preview Test Terms
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Terms Governing Pre-Release and Experimental Features
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-teal-200 dark:border-teal-800">
            <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Last updated: November 5, 2025</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              These Beta / Preview Test Terms ("<strong>Beta Terms</strong>") govern access to any <strong>pre-release, beta, labs, experimental, limited-availability or preview</strong> features of Stella's services (collectively, "<strong>Beta Services</strong>") provided by <span className="text-teal-600 dark:text-teal-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-teal-600 dark:text-teal-400">53.152.795/0001-10</span>, headquartered at <strong>[ENDEREÇO COMPLETO]</strong> ("<strong>Stella</strong>"), to the customer or user identified in the applicable Order Form or enrollment ("<strong>You</strong>" or "<strong>Customer</strong>"). Capitalized terms not defined here have the meanings set in the <strong>MSA</strong> and <strong>Terms of Use</strong>.
            </p>
          </div>
        </div>

        {/* Important Warning */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Important Notice
          </h2>
          <p className="text-white/90 text-lg">
            Beta Services may be incomplete, may change without notice, and may never become generally available. Do <strong>not</strong> rely on them for production-critical workflows.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-500 dark:from-teal-600 dark:to-emerald-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Eligibility and Access',
              '2. License and Restrictions',
              '3. Feedback; Telemetry',
              '4. Data Protection and Content',
              '5. Security; Availability; Support',
              '6. Publicity and Confidentiality',
              '7. Acceptable Use; Sector Rules',
              '8. Safety & Media Capture',
              '9. Term; Suspension; Termination',
              '10. Post-Beta; Data Handling',
              '11. Warranties; Disclaimers; Liability',
              '12. Export; Compliance',
              '13. Order of Precedence; Changes',
              '14. Governing Law; Venue; Language',
              'Exhibit A: Beta-Specific Disclosures'
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index < 14 ? index + 1 : 'exhibit-a'}`}
                className="text-white/90 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-white/60 group-hover:text-white/80 font-mono text-sm">→</span>
                <span className="text-sm">{item}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">1</span>
              Eligibility and Access
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>1.1 Enrollment.</strong> Access requires Stella's invitation or enrollment via console. Stella may limit seats, geographies, usage, or duration.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>1.2 Non-transferable.</strong> Beta access is personal to Your account and may not be assigned, resold, or shared outside Your organization.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>1.3 Conflicts.</strong> If these Beta Terms conflict with the MSA, these Beta Terms control <strong>solely</strong> for Beta Services.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">2</span>
              License and Restrictions
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.1 License.</strong> Subject to these Beta Terms, Stella grants You a limited, revocable, non-exclusive, non-transferable right to use the Beta Services for <strong>testing and evaluation</strong> only.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>2.2 Restrictions.</strong> You will not:
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>(a) use Beta Services in production unless explicitly allowed in writing;</li>
                  <li>(b) disclose performance or benchmarking results without Stella's prior written consent;</li>
                  <li>(c) circumvent rate limits/quotas;</li>
                  <li>(d) copy, reverse engineer, or create derivative works;</li>
                  <li>(e) use Beta to provide services to third parties unless authorized;</li>
                  <li>(f) train models or build competing datasets from Beta outputs.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">3</span>
              Feedback; Telemetry
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>3.1 Feedback.</strong> You agree to provide reasonable feedback, suggestions, and bug reports. You grant Stella a <strong>perpetual, irrevocable, worldwide, royalty-free</strong> license to use such feedback without restriction.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>3.2 Telemetry.</strong> Beta Services may collect <strong>enhanced diagnostics</strong> (e.g., feature flags, performance counters, crash logs, anonymized traces). Where logs include personal data, Stella processes them pursuant to the Privacy Policy/DPA for <strong>service improvement and security</strong>, applying minimization and retention limits.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">4</span>
              Data Protection and Content
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.1 Personal Data.</strong> Unless otherwise stated here, the <strong>DPA</strong> applies to Beta Services. However, (i) certain Betas may use <strong>distinct subprocessors</strong> or regions; Stella will list them at <strong>[URL de Suboperadores]</strong> and may update that list during the Beta; (ii) some controls (e.g., granular retention settings, export tooling) may be limited or unavailable.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.2 Sensitive Data.</strong> Do <strong>not</strong> intentionally upload <strong>special categories</strong> of personal data (health, biometric, union, sexual life) or other regulated data unless Stella confirms in writing that the specific Beta supports it.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.3 Your Content.</strong> You retain ownership of Your Content. You grant Stella the licenses necessary to host, process, transcode, index, and analyze Content to operate the Beta, improve stability and accuracy, and provide support.
                </p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.4 AI/Media Notice.</strong> For 2D→3D reconstruction and media AI Betas, outputs are <strong>approximate</strong> and may include artifacts. Do not use outputs for <strong>structural, engineering, or safety</strong> decisions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">5</span>
              Security; Availability; Support
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.1 Security.</strong> Stella applies industry-standard controls; some enterprise features (e.g., SSO variants, private networking) may be unavailable during Beta.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.2 No SLA.</strong> Beta Services are provided <strong>outside</strong> the SLA and <strong>without</strong> service credits.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.3 Support.</strong> Best-effort support during coverage hours per the Support Policy; response targets may not apply to Beta.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">6</span>
              Publicity and Confidentiality
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.1 Confidentiality.</strong> Beta features, UI, documentation, and performance are <strong>Confidential Information</strong>. You may discuss the Beta internally under NDA-equivalent obligations; public disclosures require Stella's written consent.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.2 Publicity.</strong> With Your consent, Stella may identify You as a Beta participant and use non-confidential feedback in case studies.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">7</span>
              Acceptable Use; Sector Rules
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                You must comply with the <strong>AUP</strong>, real-estate advertising standards (e.g., <strong>COFECI/CRECI</strong>), consumer-law disclosures, and privacy/communications rules for any messaging or lead handling performed during the Beta.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">8</span>
              Safety & Media Capture (Real-Estate Betas)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>8.1</strong> Obtain <strong>property-owner/occupant permission</strong> before filming; avoid capturing minors or bystanders without consent; respect private areas.</li>
                <li><strong>8.2</strong> Follow on-site safety rules; do not attempt hazardous capture to "improve" scans.</li>
                <li><strong>8.3</strong> Remove or blur sensitive material upon request where feasible.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">9</span>
              Term; Suspension; Termination
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>9.1 Term.</strong> Beta access begins at enablement and continues until the earlier of: (a) the Beta's end date; (b) Your subscription's end; or (c) termination under this Section.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>9.2 Suspension/Termination.</strong> Stella may suspend or terminate Beta access at any time for any reason, including stability, security, or non-compliance. You may disable Beta at any time via console or by request.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">10</span>
              Post-Beta; Data Handling
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>10.1 General Availability.</strong> Features tested in Beta may change materially or be discontinued. Pricing and limits for GA versions (if any) will be set in the Order Form or price list.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>10.2 Exports.</strong> During Beta or within <strong>30 days</strong> after termination, upon request, Stella will make available a commercially reasonable export of Your Content from Beta-exclusive stores (if applicable). Some transient artifacts, logs, or model intermediates may not be exportable.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>10.3 Deletion.</strong> After the window in 10.2, Stella will delete or anonymize Beta-stored personal data consistent with its retention schedules and legal obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">11</span>
              Warranties; Disclaimers; Liability
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>11.1 As-Is.</strong> Beta Services are provided <strong>"as is"</strong> and <strong>"as available"</strong>, with <strong>no warranties</strong> of any kind, express or implied, including merchantability, fitness for a particular purpose, non-infringement, accuracy, or quiet enjoyment.
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>11.2 Limitation.</strong> To the maximum extent permitted by law, Stella will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or lost profits, revenue, data, or goodwill, arising from or related to Beta use. Stella's aggregate liability for Beta will not exceed the <strong>greater of</strong>: (a) amounts You paid for the specific Beta (if any) in the 12 months preceding the claim; or (b) <strong>R$ [VALOR]</strong>. Consumer rights under applicable law remain unaffected.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">12</span>
              Export; Compliance
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                You represent that You are not subject to sanctions and will not use Beta in violation of export, sanctions, anti-corruption, or competition laws. Messaging features must follow channel rules (e.g., <strong>WhatsApp Business</strong> and ANATEL requirements).
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">13</span>
              Order of Precedence; Changes
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                For Beta Services only, these Beta Terms supersede conflicting terms in the MSA/SLA/Support Policy/AUP. Stella may update these Beta Terms; material changes will be notified via console or email.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-200 dark:border-teal-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold">14</span>
              Governing Law; Venue; Language
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Brazilian law governs; venue follows the MSA. If available in Portuguese and English, the <strong>Portuguese version prevails</strong> for Customers in Brazil.
              </p>
            </div>
          </section>

          {/* Exhibit A */}
          <section id="section-exhibit-a" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">A</span>
              Exhibit A — Beta-Specific Disclosures
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Fill per Beta program:
              </p>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Name/Module:</strong> <span className="text-purple-600 dark:text-purple-400">[e.g., 2D→3D Ultra, Smart Lead Scoring, AI Listing Writer]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Purpose:</strong> <span className="text-purple-600 dark:text-purple-400">[what it does]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Data categories:</strong> <span className="text-purple-600 dark:text-purple-400">[inputs/outputs; e.g., videos, property metadata, lead fields, logs]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Subprocessors/Regions:</strong> <span className="text-purple-600 dark:text-purple-400">[link to live list]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Known limitations:</strong> <span className="text-purple-600 dark:text-purple-400">[e.g., artifacts in reflective surfaces; no floor-area guarantee]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Disabled controls:</strong> <span className="text-purple-600 dark:text-purple-400">[e.g., no SSO SAML; limited retention settings]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Not for:</strong> <span className="text-purple-600 dark:text-purple-400">[e.g., structural assessments; life/safety workflows]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Sunset date:</strong> <span className="text-purple-600 dark:text-purple-400">[DATE or "TBD"]</span></p>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p><strong>Contact for Beta:</strong> <span className="text-purple-600 dark:text-purple-400">[email/Slack channel/CSM]</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-teal-500 to-emerald-500 dark:from-teal-600 dark:to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Questions About Beta Programs?
            </h2>
            <p className="text-white/90 mb-6">
              For questions about Beta/Preview programs or to request enrollment:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10 · CRECI: 309568</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Beta Program: <strong>[E-MAIL DE CONTATO BETA]</strong></p>
              <p>Subprocessors List: <strong>[URL de Suboperadores]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
