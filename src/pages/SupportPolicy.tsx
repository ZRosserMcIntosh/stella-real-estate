import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SupportPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950 dark:to-sky-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-sky-500 dark:from-cyan-400 dark:to-sky-400 rounded-2xl mb-6 shadow-lg shadow-cyan-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Support Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            How Stella Provides Customer Support
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-cyan-200 dark:border-cyan-800">
            <svg className="w-4 h-4 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Last updated: November 5, 2025</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              This Support Policy ("<strong>Policy</strong>") describes how <span className="text-cyan-600 dark:text-cyan-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-cyan-600 dark:text-cyan-400">53.152.795/0001-10</span> ("<strong>Stella</strong>") provides customer support for the Services. Capitalized terms follow the <strong>MSA</strong>. Availability commitments and service credits are governed by the <strong>SLA</strong>; this Policy sets response targets and processes (non-credit-bearing unless expressly stated).
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-cyan-500 to-sky-500 dark:from-cyan-600 dark:to-sky-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Scope',
              '2. Contact Channels',
              '3. Hours of Coverage',
              '4. Severity Definitions',
              '5. Initial Response Targets',
              '6. What We Do vs. Don\'t',
              '7. Customer Responsibilities',
              '8. Escalation Path',
              '9. Ticket Lifecycle',
              '10. Changes, Releases & Maintenance',
              '11. Training & Resources',
              '12. Data Recovery & Backups',
              '13. Feature Requests & Feedback',
              '14. Abuse, AUP & Security',
              '15. Policy Changes',
              'Appendix A: Contact Matrix',
              'Appendix B: Required Ticket Fields',
              'Appendix C: Supported Environments'
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index < 15 ? index + 1 : `appendix-${String.fromCharCode(65 + (index - 15))}`}`}
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
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">1</span>
              Scope
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Support covers the Stella platform (Constellation CRM, Site Builder, automations, media/2D→3D pipeline, admin console, public pages, and documented APIs). We assist with break/fix, configuration, and product usage. We do not manage your networks, devices, third-party platforms, or bespoke code unless agreed in writing.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">2</span>
              Contact Channels
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Ticket Portal / Email:</strong> <strong>[support@yourdomain]</strong> or <strong>[PORTAL URL]</strong></li>
                <li><strong>In-Product Chat (if enabled):</strong> Admin console → "Help"</li>
                <li><strong>Phone (Premium/Enterprise for P1 only):</strong> <strong>[+55 (11) xxx-xxxx]</strong></li>
                <li><strong>Status Page:</strong> <strong>[STATUS URL]</strong></li>
                <li><strong>Security Incidents:</strong> <strong>[security@yourdomain]</strong></li>
              </ul>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mt-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  <strong>Note:</strong> To open a P1, use <strong>phone</strong> (if available) or file a ticket and then escalate via chat/phone.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">3</span>
              Hours of Coverage
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4 font-semibold">America/São_Paulo, UTC-3</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Standard:</strong> Mon–Fri <strong>08:00–19:00 BRT</strong> (excluding BR national holidays).</li>
                <li><strong>Premium:</strong> Mon–Sat <strong>08:00–22:00 BRT</strong>; Sun <strong>10:00–16:00 BRT</strong> for P1/P2.</li>
                <li><strong>Enterprise:</strong> <strong>24×7 for P1</strong>, P2–P4 during <strong>08:00–22:00 BRT</strong> daily.</li>
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mt-4">
                Maintenance windows follow the <strong>SLA</strong> (Sun 01:00–03:00 BRT, or as notified).
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">4</span>
              Severity Definitions
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded">
                <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">P1 — Critical</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Production down; login or public site render fails for most users; critical data loss; confirmed security incident. No workaround.
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 dark:border-orange-400 p-4 rounded">
                <h3 className="text-orange-700 dark:text-orange-400 font-semibold mb-2">P2 — High</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Major degradation or feature outage impacting business operations; workaround not feasible.
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 rounded">
                <h3 className="text-yellow-700 dark:text-yellow-400 font-semibold mb-2">P3 — Normal</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Minor degradation; bugs with workaround; how-to/config requests.
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded">
                <h3 className="text-blue-700 dark:text-blue-400 font-semibold mb-2">P4 — Low</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Cosmetic issues; general guidance; feature requests.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">5</span>
              Initial Response Targets
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">From ticket creation:</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-600">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">Plan \ Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">P1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">P2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">P3</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300 uppercase tracking-wider">P4</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">Standard</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"><strong>2h</strong> (best-effort 24×7)</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">4h business</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">1 business day</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">2 business days</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">Premium</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"><strong>1h (24×7)</strong></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">2h business</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">8 business hours</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">1 business day</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">Enterprise</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"><strong>30 min (24×7)</strong></td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">1h business</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">4 business hours</td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">1 business day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">Engagement & Updates:</h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>P1: continuous engagement until mitigation; updates <strong>every 60 min</strong> (or as agreed).</li>
                  <li>P2: updates <strong>every business day</strong> or sooner on material changes.</li>
                  <li>P3/P4: updates when materially progressed or upon request.</li>
                </ul>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mt-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  <strong>Note:</strong> Response ≠ resolution. We use commercially reasonable efforts to restore service quickly (see SLA for availability commitments).
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">6</span>
              What We Do vs. Don't
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">✓ Included</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Break/fix; configuration guidance; admin setup; best-practice advice; API usage per Docs; billing questions; restore from backups (where applicable).
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">✗ Excluded (unless contracted as Professional Services)</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  Custom development/integrations, data modeling/migration beyond tools provided, content entry, SEO/ads, training beyond included hours, third-party outages (e.g., WhatsApp BSP, telephony, maps, ad networks).
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">7</span>
              Customer Responsibilities
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Maintain <strong>up-to-date admin contacts</strong> and a 24×7 P1 contact (Premium/Enterprise).</li>
                <li>Provide <strong>clear replication steps</strong>, screenshots/recordings, timestamps (BRT), affected users, and recent changes.</li>
                <li>Use <strong>supported environments</strong> (latest two versions of Chrome/Edge/Safari; current iOS/Android major).</li>
                <li>Safeguard credentials; enable <strong>MFA</strong>; control roles/permissions.</li>
                <li>For security matters, notify <strong>immediately</strong> at <strong>[security@yourdomain]</strong> and suspend compromised accounts.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">8</span>
              Escalation Path
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                L1 Support Engineer → L2 Product/Infra → L3 On-Call Engineer → <strong>Duty Manager</strong> → <strong>Head of Engineering</strong> (as needed).
              </p>
              <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  You can request management escalation by replying <strong>"ESCALATE"</strong> on the ticket.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">9</span>
              Ticket Lifecycle
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ol className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Open</strong> (timestamped); priority set using Section 4.</li>
                <li><strong>Acknowledge</strong> (initial response per Section 5).</li>
                <li><strong>Mitigate</strong> (workaround or partial restore).</li>
                <li><strong>Resolve</strong> (fix deployed or change implemented).</li>
                <li><strong>Post-Incident Review</strong> (P1/P2 on request; available by default for Enterprise).</li>
                <li><strong>Close</strong> (after your confirmation or 5 business days without reply).</li>
              </ol>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">10</span>
              Changes, Releases & Maintenance
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Changes follow staged rollouts and automated testing.</li>
                <li>Maintenance windows and exclusions are defined in the <strong>SLA</strong>.</li>
                <li>You'll be notified of <strong>material changes</strong> that affect behavior, deprecations, or admin actions required (console + email).</li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">11</span>
              Training & Resources
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Knowledge Base:</strong> <strong>[DOCS URL]</strong></li>
                <li><strong>Release Notes/Changelog:</strong> <strong>[CHANGELOG URL]</strong></li>
                <li><strong>Onboarding:</strong> Standard (up to <strong>1h</strong> remote); Premium (<strong>2h</strong> remote); Enterprise (<strong>4h</strong> remote or onsite by agreement).</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">12</span>
              Data Recovery & Backups
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Per the <strong>SLA</strong>: regular backups of core data; <strong>RPO ≤ 24h</strong>, <strong>RTO ≤ 24h</strong> for multi-tenant core. Media/raw uploads and third-party data may not be fully covered—see product docs.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">13</span>
              Feature Requests & Feedback
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Submit via the portal using type <strong>"Feature Request (P4)"</strong>. We triage by impact, feasibility, and alignment. Submission does not guarantee delivery; roadmap is at Stella's discretion.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">14</span>
              Abuse, AUP & Security
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Use must comply with the <strong>AUP</strong>. We may throttle, suspend, or block abusive or unsafe activity and coordinate remediation with your admins.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-cyan-200 dark:border-cyan-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-500 text-white rounded-lg text-sm font-bold">15</span>
              Policy Changes
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We may update this Policy to reflect legal/operational changes. The effective version is indicated by the date at the top; material changes will be notified via console/email.
              </p>
            </div>
          </section>

          {/* Appendices */}
          <section id="section-appendix-A" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">A</span>
              Appendix A — Contact Matrix
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Standard:</strong> Ticket/Email; Chat (business hours).</li>
                <li><strong>Premium:</strong> Ticket/Email; Chat; Phone (P1).</li>
                <li><strong>Enterprise:</strong> Ticket/Email; Chat; Phone (P1 & as agreed); TAM/CSM <strong>[if included]</strong>.</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-B" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">B</span>
              Appendix B — Required Ticket Fields
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Environment (prod/sandbox), module, steps to reproduce, expected vs. actual, severity, impact (# users/regions), attachments (HAR/logs), consent to access test data.
              </p>
            </div>
          </section>

          <section id="section-appendix-C" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">C</span>
              Appendix C — Supported Environments
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Browsers (last 2 versions: Chrome, Edge, Safari); Mobile (iOS/Android current–1); No support for legacy/embedded browsers.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-cyan-500 to-sky-500 dark:from-cyan-600 dark:to-sky-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Need Support?
            </h2>
            <p className="text-white/90 mb-6">
              Contact our support team through any of these channels:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10 · CRECI: 309568</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Support Email: <strong>[support@yourdomain]</strong></p>
              <p>Support Portal: <strong>[PORTAL URL]</strong></p>
              <p>Phone (P1): <strong>[+55 (11) xxx-xxxx]</strong></p>
              <p>Security: <strong>[security@yourdomain]</strong></p>
              <p>Status Page: <strong>[STATUS URL]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
