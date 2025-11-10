import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AUP() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400 rounded-2xl mb-6 shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Acceptable Use Policy (AUP)
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Guidelines for Responsible Use of Stella Services
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-indigo-200 dark:border-indigo-800">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Last updated: November 5, 2025</span>
          </div>
        </div>

        {/* Terms Reference */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              This AUP forms part of the <strong>Terms of Use</strong> (for individuals) and the <strong>MSA</strong> (for business customers) between <span className="text-indigo-600 dark:text-indigo-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-indigo-600 dark:text-indigo-400">53.152.795/0001-10</span> ("<strong>Stella</strong>"), and you ("<strong>User</strong>" / "<strong>Customer</strong>"). Capitalized terms not defined here have the meanings given in the Terms/MSA.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              This AUP applies to all use of the Services, including the Constellation CRM, site builder, listings, media/2D→3D pipeline, messaging/telephony, APIs, and integrations.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Permitted Use',
              '2. Prohibited Content and Activities',
              '3. Real-Estate Media & 2D→3D Capture',
              '4. Lead Handling and Data Use',
              '5. Listings & Advertising Rules',
              '6. Fair Use, Rates & Quotas',
              '7. Security Requirements',
              '8. Messaging and Telephony',
              '9. Integrations & Third Parties',
              '10. APIs & Automation',
              '11. Vulnerability Disclosure',
              '12. Enforcement',
              '13. Reporting Violations',
              '14. Changes to this AUP',
              '15. Governing Law; Language'
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
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
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">1</span>
              Permitted Use
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Use the Services to: (a) create and manage real-estate listings and sites; (b) capture, store, and process leads lawfully; (c) communicate with leads and clients with proper consent; (d) process media (including 2D→3D) for legitimate marketing; and (e) run compliant workflows and automations under the Terms/MSA, Privacy Policy, Cookie Policy, and this AUP.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">2</span>
              Prohibited Content and Activities
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
              <p className="text-slate-700 dark:text-slate-300 font-semibold">You <strong>must not</strong>:</p>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Illegal & harmful</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Violate any law/regulation; exploit, incite, or depict violence, child endangerment, harassment, or hate; publish doxxing, threats, or defamation.</li>
                  <li>Discriminate in listings or communications based on protected characteristics (e.g., race, color, sex/gender, age, religion, disability). Follow applicable equal-opportunity and advertising rules.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">IP & privacy</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Infringe IP or publicity/image rights; upload content you do not own or lack permission to use (including brand logos, floor plans, or photography).</li>
                  <li>Publish third-party personal data without a lawful basis or required consents (names, faces, contact details, voice, plates, precise addresses when private, documents).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Deceptive listings</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Misrepresent property facts (area/"metragem", pricing, availability, financing, launch status), use bait-and-switch, or omit mandatory disclosures.</li>
                  <li>Use "illustrative" renders without clear labels where required.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Security & integrity</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Probe, scan, or test security; bypass access controls; inject malware; overload or disrupt the service; attempt credential-stuffing or account enumeration.</li>
                  <li>Share or resell access, invite codes, or tokens; impersonate Stella or another person.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Scraping & automation</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Crawl/scrape/bulk-extract content, leads, or media without Stella's <strong>prior written authorization</strong> (see Section 6/10).</li>
                  <li>Circumvent rate limits, cache-controls, or robots directives; mirror or frame the Services.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Spam & unlawful messaging</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Send unsolicited or unlawful marketing (email, SMS, calls, WhatsApp/OTT) without valid consent or lawful basis; ignore opt-out/"STOP" requests; spoof caller IDs; auto-dial without compliance.</li>
                  <li>Upload, buy, sell, or share lead lists from data brokers or unknown provenance.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">Sensitive data</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Intentionally collect or store <strong>special categories</strong> of personal data (health, biometric, union, sexual life) in free-text fields unless strictly necessary and with a valid legal basis set by Customer.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">CRECI & professional status</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>Misuse or falsify <strong>CRECI</strong> or professional verification; publish as a professional without required credentials; allow unverified users to act as verified.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">3</span>
              Real-Estate Media & 2D→3D Capture
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Obtain <strong>property-owner/occupant permission</strong> before filming; avoid capturing minors or bystanders without consent; do not record in private areas without authorization.</li>
                <li>Do not rely on 3D outputs for <strong>structural/engineering/safety</strong> decisions.</li>
                <li>Remove or blur sensitive material upon request where feasible.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">4</span>
              Lead Handling and Data Use
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Use lead data <strong>only</strong> to respond to the expressed interest and for related real-estate services; do not sell, broker, or repurpose beyond permitted purposes.</li>
                <li>Honor <strong>opt-outs</strong> across all channels; sync suppression lists; keep audit trails of consent where applicable.</li>
                <li>Delete or anonymize data when no longer necessary, respecting the DPA/Privacy Policy and your own legal retention duties.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">5</span>
              Listings & Advertising Rules
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Follow <strong>COFECI/CRECI</strong> norms and consumer-protection rules. Keep prices, fees, and availability <strong>current</strong>; promptly remove sold/leased listings.</li>
                <li>Clearly label <strong>illustrative</strong> images/renders; disclose tolerances for floor plans and measurements if required.</li>
                <li><strong>Prohibited:</strong> discriminatory targeting, illegal activity, false endorsements, undisclosed manipulations of reviews.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">6</span>
              Fair Use, Rates & Quotas
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Stay within plan limits (seats, properties, storage, API calls, media/processing credits) in your Order Form.</li>
                <li>Do not attempt to bypass metering, credit accounting, or usage reports.</li>
                <li>Automated access (bots, crawlers, exporters) requires a Stella-approved method and rate (or a written exemption).</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">7</span>
              Security Requirements
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Protect credentials, enable MFA where offered, rotate tokens, and restrict access by role.</li>
                <li>Report suspected compromise or abuse <strong>promptly</strong> to <strong>[E-MAIL DE SEGURANÇA]</strong>.</li>
                <li>Store exports and backups securely; avoid emailing raw datasets unless encrypted.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">8</span>
              Messaging and Telephony
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Comply with channel-specific rules (e.g., <strong>WhatsApp Business</strong>, carrier/ANATEL, local spam laws).
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Allowed:</strong> transactional messages and opted-in marketing with required disclosures.</li>
                <li><strong>Required:</strong> clear identification, opt-out instructions, honoring quiet hours where applicable.</li>
                <li><strong>Prohibited:</strong> high-frequency cold outreach, snowshoeing, list rentals, contact of minors, or evasion of spam defenses.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">9</span>
              Integrations & Third Parties
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Only connect integrations you are authorized to use and that comply with their own terms/policies.</li>
                <li>You are responsible for data you push/pull via integrations (webhooks, imports, custom forms).</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">10</span>
              APIs & Automation
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Use official <strong>APIs/SDKs</strong> only, with valid keys; keep keys confidential.</li>
                <li>Respect documented <strong>rate limits</strong>, pagination, and back-off; no hidden multiplexing or rotating identities.</li>
                <li>Do not replicate core functionality to create a competing service or dataset.</li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">11</span>
              Vulnerability Disclosure (VDP)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Good-faith security research must follow Stella's <strong>VDP</strong> at <strong>[VDP URL]</strong> (safe-harbor terms, allowed methods, out-of-scope areas, report format).</li>
                <li>Do <strong>not</strong> access customer data, degrade service, or pivot beyond your own account. Obtain <strong>explicit written authorization</strong> before any testing that could impact availability.</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">12</span>
              Enforcement
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Stella may <strong>monitor</strong> for compliance (automated and manual). We may <strong>remove content</strong>, <strong>suspend</strong> or <strong>terminate</strong> access (with notice where reasonable), throttle usage, disable features, or block integrations that violate this AUP or create risk. Repeated or egregious violations may result in termination under the Terms/MSA.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">13</span>
              Reporting Violations
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Report abuse or AUP violations to <strong>[E-MAIL DE CONTATO JURÍDICO/ABUSO]</strong> with URLs, timestamps (BRT/UTC-3), and evidence. For urgent security issues, use the security contact above.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">14</span>
              Changes to this AUP
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We may update this AUP to reflect legal/technical changes. The version in force is identified by the date at the top. Material changes will be notified via the admin console or email.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-lg text-sm font-bold">15</span>
              Governing Law; Language
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Governed by <strong>Brazilian law</strong>. Venue/language follow the Terms/MSA.
              </p>
            </div>
          </section>

          {/* Important Notice */}
          <section className="bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Important: CRECI Compliance
            </h2>
            <p className="text-white/90 mb-4">
              As a real estate professional or organization, you must maintain valid <strong>CRECI credentials</strong> and comply with all COFECI/CRECI regulations when using Stella services for professional activities.
            </p>
            <p className="text-white/90">
              Misrepresentation of professional status or credentials is a serious violation of this AUP and may result in immediate account termination and reporting to relevant authorities.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-violet-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Questions or Concerns?
            </h2>
            <p className="text-white/90 mb-6">
              For questions about this Acceptable Use Policy or to report violations:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10 · CRECI: 309568</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Abuse/Legal: <strong>[E-MAIL DE CONTATO JURÍDICO/ABUSO]</strong></p>
              <p>Security: <strong>[E-MAIL DE SEGURANÇA]</strong></p>
              <p>VDP: <strong>[VDP URL]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
