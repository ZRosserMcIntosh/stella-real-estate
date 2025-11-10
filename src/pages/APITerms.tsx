import React from 'react';
import { useTranslation } from 'react-i18next';

export default function APITerms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-fuchsia-950 dark:to-pink-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-pink-500 dark:from-fuchsia-400 dark:to-pink-400 rounded-2xl mb-6 shadow-lg shadow-fuchsia-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            API Terms
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Terms Governing API Access and Developer Tools
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-fuchsia-200 dark:border-fuchsia-800">
            <svg className="w-4 h-4 text-fuchsia-600 dark:text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Last updated: November 5, 2025</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              These API Terms ("<strong>Terms</strong>") govern access to and use of the <strong>Stella APIs, SDKs, Webhooks, and Developer Tools</strong> (collectively, the "<strong>API</strong>") provided by <span className="text-fuchsia-600 dark:text-fuchsia-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-fuchsia-600 dark:text-fuchsia-400">53.152.795/0001-10</span>, headquartered at <strong>[ENDEREÇO COMPLETO]</strong> ("<strong>Stella</strong>", "<strong>we</strong>", "<strong>our</strong>"). If you access the API on behalf of an organization, you represent that you have authority to bind that entity and "<strong>you</strong>" means that entity.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              These Terms incorporate the <strong>MSA</strong> (for paid customers), <strong>Terms of Use</strong> (for individual developers), <strong>AUP</strong>, <strong>SLA</strong> (availability only, with exclusions stated here), <strong>Support Policy</strong>, <strong>Privacy Policy</strong>, and <strong>DPA</strong>. If there is a conflict, <strong>these API Terms control</strong> for API matters, except data-protection conflicts, where the <strong>DPA</strong> controls.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-fuchsia-500 to-pink-500 dark:from-fuchsia-600 dark:to-pink-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Definitions',
              '2. License and Access',
              '3. Permitted and Prohibited Uses',
              '4. Data Use, Privacy, and Retention',
              '5. Credentials, Security, and Incidents',
              '6. Brand, Attribution, and UI Requirements',
              '7. Rates, Quotas, and Fair Use',
              '8. Versioning, Changes, and Deprecation',
              '9. Monitoring, Compliance, and Audit',
              '10. IP; Ownership; Feedback',
              '11. Representations; Warranties; Disclaimers',
              '12. Indemnification',
              '13. Limitation of Liability',
              '14. Suspension and Termination',
              '15. Confidentiality',
              '16. Governing Law; Venue; Language',
              '17. Changes to These Terms',
              '18. Contact',
              'Appendix A: Rate Limits & Quotas',
              'Appendix B: Security Requirements',
              'Appendix C: Attribution & Display',
              'Appendix D: Deprecation & Sunset Policy',
              'Appendix E: Webhook Events'
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index < 18 ? index + 1 : `appendix-${String.fromCharCode(65 + (index - 18))}`}`}
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
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">1</span>
              Definitions
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-3">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>"API"</strong>: any programmatic interface, endpoint, SDK, CLI, webhook, documentation, sample code, test data, and developer portal.</li>
                <li><strong>"Response Data"</strong>: data returned by the API (e.g., listings, leads metadata, analytics, media jobs status).</li>
                <li><strong>"Customer Content"</strong>: data you or your users submit to Stella (e.g., listings, media, contacts).</li>
                <li><strong>"Derived Data"</strong>: data you create from Response Data that <strong>does not</strong> (a) replicate or serve as a substitute for the API/Services; or (b) allow re-identification of individuals from anonymized/aggregated sources.</li>
                <li><strong>"Application"</strong>: your software that calls the API.</li>
                <li><strong>"Credentials"</strong>: keys, tokens, secrets, certificates, or OAuth tokens issued by Stella.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">2</span>
              License and Access
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.1 License.</strong> Subject to these Terms, Stella grants you a <strong>revocable, non-exclusive, non-transferable, non-sublicensable</strong> license to call the API to build and run the Application for permitted use cases.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.2 Sublicensing to processors.</strong> You may permit <strong>your service providers</strong> to use the API solely for you, under written terms at least as protective as these Terms; you remain responsible.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.3 Registration.</strong> Use requires a developer account and valid Credentials. You must provide accurate info and keep it current. We may refuse, limit, or revoke access at our discretion.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">3</span>
              Permitted and Prohibited Uses
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>3.1 Permitted.</strong> Integrate with Constellation CRM, Site Builder, media pipeline (e.g., 2D→3D jobs), lead ingestion/updates, and analytics consistent with the <strong>MSA/AUP</strong>.
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>3.2 Prohibited.</strong> You will <strong>not</strong>:
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  <li>(a) build a competing dataset or service from Response Data;</li>
                  <li>(b) copy, scrape, or export bulk data to seed third-party marketplaces or public archives;</li>
                  <li>(c) resell, broker, lease, or redistribute Response Data outside your organization without written consent;</li>
                  <li>(d) exceed or circumvent rate limits, quotas, or metering; rotate keys to evade limits;</li>
                  <li>(e) use Response Data to train foundation/large language/vision models or embeddings <strong>without prior written permission</strong>;</li>
                  <li>(f) infer sensitive attributes or perform discriminatory targeting;</li>
                  <li>(g) store Credentials in client-side code or mobile apps;</li>
                  <li>(h) misuse personal data contrary to the <strong>DPA/Privacy Policy</strong>;</li>
                  <li>(i) violate real-estate advertising/COFECI-CRECI or communications rules (e.g., WhatsApp Business/ANATEL);</li>
                  <li>(j) perform unsupported scraping of Stella UIs or of third-party property portals via Stella;</li>
                  <li>(k) remove or alter notices, headers, or attribution required by Stella.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">4</span>
              Data Use, Privacy, and Retention
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.1 Roles.</strong> For personal data you fetch or push through the API within your tenant, you act as <strong>Controller</strong> and Stella as <strong>Operator</strong> under the <strong>LGPD</strong>; the <strong>DPA</strong> applies.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.2 Scoping.</strong> Request <strong>only</strong> the data you need; do not store Response Data longer than necessary for the Application's stated purpose.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.3 Caching.</strong> You may cache Response Data <strong>up to 30 days</strong> unless (i) a shorter TTL is specified in headers; (ii) a user deletes/updates data; or (iii) we notify otherwise. You must <strong>purge</strong> cached items on update/delete or opt-out.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.4 Subject rights.</strong> You must support access, correction, deletion, and opt-out, including propagating deletes to your caches/logs/backups where feasible.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.5 Cross-border transfers.</strong> If you export Response Data outside Brazil, you are responsible for lawful transfer mechanisms and disclosures; Stella's subprocessors are listed at <strong>[URL de Suboperadores]</strong>.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.6 No sale.</strong> Do not sell personal data or combine it with third-party brokered lists.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.7 Security.</strong> Encrypt in transit (TLS 1.2+). Store data at rest securely, restrict by role, enable MFA for admin consoles, rotate keys, and never commit secrets to repositories.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">5</span>
              Credentials, Security, and Incidents
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.1 Key handling.</strong> Keep Credentials confidential; do not share, embed in client apps, or email. Use <strong>OAuth 2.0</strong> where available; otherwise, store secrets in a server-side KMS/secret manager.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.2 Webhooks.</strong> Verify <strong>HMAC signatures</strong> and respond with <strong>2xx</strong> within <strong>10s</strong>; retry logic with idempotency keys is required; do not expose webhook URLs publicly.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.3 Incidents.</strong> Notify <strong>[security@yourdomain]</strong> <strong>within 48 hours</strong> of discovering a breach affecting Response Data/Credentials and cooperate in remediation.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>5.4 Audit logs.</strong> Keep API call logs (timestamp, tenant, endpoint, purpose) for <strong>180 days</strong> for security and compliance; protect them as confidential.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">6</span>
              Brand, Attribution, and UI Requirements
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.1 Attribution.</strong> Where Response Data is displayed externally, show "<strong>Powered by Stella</strong>" (or approved variant) and any required third-party attributions (maps, messaging).
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.2 Trademarks.</strong> Use our names/logos only as permitted by our <strong>Brand Guidelines</strong> at <strong>[URL das Diretrizes de Marca]</strong>; no implication of endorsement.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">7</span>
              Rates, Quotas, and Fair Use
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>7.1 Limits.</strong> We may set per-endpoint <strong>RPM/RPS</strong>, daily quotas, concurrency caps, job credits (media/2D→3D), and storage limits as shown in Docs or the Order Form.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>7.2 Throttling.</strong> Exceeding limits may result in HTTP 429/503, delayed jobs, or temporary blocks.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>7.3 Metered billing.</strong> Usage above included quotas may incur <strong>overage fees</strong> per the Order Form or current price list; we may modify prices with notice per the MSA.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">8</span>
              Versioning, Changes, and Deprecation
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>8.1 Versioning.</strong> We use <strong>semantic versions</strong> (<code>v1</code>, <code>v1.1</code>, etc.) or date-based versions.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>8.2 Changes.</strong> Non-breaking changes may ship without notice. For breaking changes, we'll provide <strong>180 days'</strong> deprecation window when commercially reasonable; urgent security or legal changes may be immediate.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>8.3 Changelog.</strong> See <strong>[URL do Changelog]</strong>. Your Application should <strong>gracefully handle</strong> new fields and ignore unknowns.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">9</span>
              Monitoring, Compliance, and Audit
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>9.1 Monitoring.</strong> We may monitor API usage for quality, security, and compliance with these Terms.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>9.2 Remediation.</strong> We may rate-limit, throttle, or suspend access for abuse, instability, or risk.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>9.3 Audit.</strong> With reasonable notice, we may request evidence of your compliance (e.g., key storage, logs, data-deletion processes). Provide such evidence within <strong>10 business days</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">10</span>
              IP; Ownership; Feedback
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>10.1 Stella IP.</strong> The API, Docs, and SDKs are owned by Stella and licensed, not sold.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>10.2 Data.</strong> As between the parties: (a) <strong>Customer Content</strong> remains yours; (b) <strong>Response Data</strong> is licensed for your permitted use and may include data of or about others; (c) <strong>Derived Data</strong> you create is yours, provided it doesn't reconstruct or substitute the Services or re-identify individuals.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>10.3 Feedback.</strong> You grant Stella a perpetual, irrevocable, worldwide, royalty-free license to use feedback.
                </p>
              </div>
            </div>
          </section>

          {/* Sections 11-18 (shorter sections) */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">11</span>
              Representations; Warranties; Disclaimers
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                You represent and warrant that you will comply with laws (privacy, consumer, anti-spam/ANATEL, anti-corruption) and sector rules (COFECI/CRECI). The API is provided <strong>"as is"</strong> and <strong>"as available."</strong> Except as required by law, we disclaim all warranties, including merchantability, fitness, non-infringement, accuracy, or availability. <strong>No SLA credits</strong> apply to the API, webhooks, or SDKs unless expressly stated in your Order Form.
              </p>
            </div>
          </section>

          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">12</span>
              Indemnification
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                You will <strong>defend, indemnify, and hold harmless</strong> Stella from claims arising out of: (a) your Application; (b) your use or misuse of the API/Response Data; (c) your breach of these Terms, AUP, or law; or (d) your processing of personal data outside the DPA.
              </p>
            </div>
          </section>

          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">13</span>
              Limitation of Liability
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                To the maximum extent permitted by law, neither party is liable for <strong>indirect, incidental, special, consequential, exemplary, or punitive damages</strong> or lost profits/data/goodwill. Each party's aggregate liability related to the API in any 12-month period is capped at the <strong>greater of</strong>: (a) amounts you paid for API access in that period; or (b) <strong>R$ [VALOR]</strong>. Consumer rights remain unaffected.
              </p>
            </div>
          </section>

          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">14</span>
              Suspension and Termination
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We may suspend or terminate API access immediately for security risk, legal request, non-payment, or material breach. You may terminate by ceasing use and deleting Credentials. Upon termination, you must <strong>delete Response Data</strong> (except as required by law) and call any available <strong>delete/revoke endpoints</strong>.
              </p>
            </div>
          </section>

          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">15</span>
              Confidentiality
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Credentials, non-public endpoints, pre-release features, and performance data are <strong>Confidential Information</strong>. Handle under Section 8 of the MSA (or equivalent).
              </p>
            </div>
          </section>

          <section id="section-16" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">16</span>
              Governing Law; Venue; Language
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Brazilian law governs; venue follows the <strong>MSA</strong> (São Paulo/Capital for businesses; CDC rules for consumers). If published in Portuguese and English, the <strong>Portuguese version prevails</strong> for Brazil.
              </p>
            </div>
          </section>

          <section id="section-17" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">17</span>
              Changes to These Terms
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We may update these Terms. Material changes will be notified via developer portal or email. Continued use after the effective date constitutes acceptance.
              </p>
            </div>
          </section>

          <section id="section-18" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-fuchsia-200 dark:border-fuchsia-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white rounded-lg text-sm font-bold">18</span>
              Contact
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Developer Relations:</strong> <strong>[dev@yourdomain]</strong></li>
                <li><strong>Security:</strong> <strong>[security@yourdomain]</strong></li>
                <li><strong>Abuse:</strong> <strong>[abuse@yourdomain]</strong></li>
              </ul>
            </div>
          </section>

          {/* Appendices */}
          <section id="section-appendix-A" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">A</span>
              Appendix A — Rate Limits & Quotas
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Examples (replace with actual values):</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Auth & Tenant:</strong> <code>POST /oauth/token</code> — 30 RPM per client.</li>
                <li><strong>Leads:</strong> <code>POST /v1/leads</code> — 300 RPM, burst 1,000 RPH; webhooks must ack &lt;10s.</li>
                <li><strong>Listings:</strong> <code>GET /v1/listings</code> — 600 RPM; <code>POST/PUT</code> — 60 RPM.</li>
                <li><strong>Media/2D→3D:</strong> job <strong>credits</strong> per month: [N]; concurrent jobs: [X]; max upload: [GB].</li>
                <li><strong>Public Pages API/Edge:</strong> 200 RPS per edge region per tenant (subject to CDN).</li>
                <li><strong>GraphQL (if applicable):</strong> query cost cap: [X] units/request; 95th percentile latency SLO (non-credit): [ms].</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-B" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">B</span>
              Appendix B — Security Requirements
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Minimums:</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>TLS 1.2+ everywhere; HSTS on public hosts.</li>
                <li>Server-side key storage (KMS); no secrets in client apps or repos.</li>
                <li>OAuth 2.0 Authorization Code w/ PKCE for user-delegated flows.</li>
                <li>Webhook HMAC with rotating secrets and idempotency keys.</li>
                <li>Principle of least privilege; role-based access; MFA for admins.</li>
                <li>Daily backups for your Application data; secure disposal on delete.</li>
                <li>Incident notice to Stella within <strong>48h</strong>; cooperate on forensics and user notifications as required by law.</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-C" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">C</span>
              Appendix C — Attribution & Display
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Examples:</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>"<strong>Powered by Stella</strong>" link near Response Data displays.</li>
                <li>Map tiles/imagery attributions as required by providers.</li>
                <li>Clear labels for <strong>illustrative renders</strong> and 3D artifacts; no implication of structural accuracy.</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-D" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">D</span>
              Appendix D — Deprecation & Sunset Policy
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Minor breaking changes:</strong> ≥ <strong>90 days</strong> notice.</li>
                <li><strong>Major versions:</strong> parallel support for <strong>180–360 days</strong>, then sunset.</li>
                <li><strong>Security/legal hotfixes:</strong> may be immediate with notice post-facto.</li>
                <li><strong>End-of-life:</strong> we may retire endpoints with commercially reasonable notice and migration guides.</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-E" className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-500 text-white rounded-lg text-sm font-bold">E</span>
              Appendix E — Webhook Events
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Sample events:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'lead.created',
                  'lead.updated',
                  'lead.opted_out',
                  'listing.published',
                  'listing.updated',
                  'listing.unpublished',
                  'media.uploaded',
                  'media.job.started',
                  'media.job.completed',
                  'media.job.failed',
                  'user.invited',
                  'user.permissions.changed'
                ].map((event, index) => (
                  <code key={index} className="text-sm bg-white dark:bg-slate-800 px-3 py-1 rounded text-purple-600 dark:text-purple-400">
                    {event}
                  </code>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-fuchsia-500 to-pink-500 dark:from-fuchsia-600 dark:to-pink-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Developer Support
            </h2>
            <p className="text-white/90 mb-6">
              Questions about the API? Need developer access?
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10 · CRECI: 309568</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Developer Relations: <strong>[dev@yourdomain]</strong></p>
              <p>Security: <strong>[security@yourdomain]</strong></p>
              <p>Abuse: <strong>[abuse@yourdomain]</strong></p>
              <p>Subprocessors: <strong>[URL de Suboperadores]</strong></p>
              <p>Brand Guidelines: <strong>[URL das Diretrizes de Marca]</strong></p>
              <p>Changelog: <strong>[URL do Changelog]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
