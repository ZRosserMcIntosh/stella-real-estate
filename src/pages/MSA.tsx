import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MSA() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 rounded-2xl mb-6 shadow-lg shadow-emerald-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Master Subscription Agreement (MSA)
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Stella Real Estate Platform – B2B Subscription Terms
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-emerald-200 dark:border-emerald-800">
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Effective Date: [DATE]</span>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Contracting Parties
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Provider:</strong> <span className="text-emerald-600 dark:text-emerald-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-emerald-600 dark:text-emerald-400">53.152.795/0001-10</span>, headquartered at <strong>[ENDEREÇO COMPLETO]</strong> ("<strong>Stella</strong>").
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>Customer:</strong> The entity identified in the applicable <strong>Order Form</strong> ("<strong>Customer</strong>").
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              This MSA governs Customer's paid access to Stella's subscription Services. By executing an Order Form that references this MSA, the parties agree to these terms and to the incorporated policies (SLA, DPA, AUP, and any Product-Specific Terms).
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Definitions',
              '2. Access and Use',
              '3. Customer Responsibilities',
              '4. Stella IP; Customer Content; Feedback',
              '5. Acceptable Use Policy (AUP)',
              '6. Orders, Fees, and Taxes',
              '7. Term, Renewal, and Termination',
              '8. Confidentiality',
              '9. Security; Media Processing; Disaster Recovery',
              '10. Service Levels and Support',
              '11. Data Protection',
              '12. Warranties and Disclaimers',
              '13. Indemnification',
              '14. Limitation of Liability',
              '15. Compliance',
              '16. Publicity; References',
              '17. Assignment; Subcontracting',
              '18. Force Majeure',
              '19. Notices',
              '20. Governing Law; Venue; Language',
              '21. Order of Precedence; Entire Agreement; Amendments',
              '22. Counterparts; e-Signatures',
              'Exhibit A — Order Form Template'
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
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">1</span>
              Definitions
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li><strong>"Services"</strong>: Stella's hosted platform(s) including the Constellation CRM, site builder, automation features, media processing (e.g., 2D-to-3D), dashboards, and related modules described in an Order Form.</li>
                <li><strong>"Order Form"</strong>: a document signed or accepted by Customer specifying purchased Services, term, fees, and limits.</li>
                <li><strong>"Customer Content"</strong>: data, images, videos, floor plans, 3D tours, text, listings, and other materials submitted or imported by or for Customer.</li>
                <li><strong>"Authorized Users"</strong>: employees, contractors, and agents whom Customer authorizes to use the Services under Customer's account.</li>
                <li><strong>"Documentation"</strong>: online help, specs, and user guides for the Services.</li>
                <li><strong>"Beta Services"</strong>: features marked beta/preview/evaluation.</li>
                <li><strong>"AUP"</strong>: Acceptable Use Policy referenced in Section 5.</li>
                <li><strong>"SLA"</strong>: Service Level Agreement referenced in Section 10.</li>
                <li><strong>"DPA"</strong>: Data Processing Addendum referenced in Section 11.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">2</span>
              Access and Use
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2.1 Subscriptions</h3>
                <p className="text-slate-700 dark:text-slate-300">During the Subscription Term specified in an Order Form, Stella grants Customer a non-exclusive, non-transferable right for Authorized Users to access and use the Services in accordance with this MSA, the Documentation, and the AUP.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2.2 Seats/limits</h3>
                <p className="text-slate-700 dark:text-slate-300">Usage is limited by the quantities, environments, and caps shown in the Order Form (e.g., seats, properties/listings, storage, API calls). Overages may incur fees per the Order Form.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2.3 Company accounts & invites</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer is responsible for (a) provisioning/deprovisioning Authorized Users (including invite codes), (b) configuring roles/permissions, and (c) activities under its accounts. Customer will keep credentials confidential and use MFA where available.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2.4 Third-party components</h3>
                <p className="text-slate-700 dark:text-slate-300">Certain features rely on third parties (e.g., maps, messaging, telephony, analytics). Use may require enabling those integrations and agreeing to their terms. Stella is not responsible for third-party services it does not control.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">3</span>
              Customer Responsibilities
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">3.1 Accuracy & rights</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer must have all necessary rights and consents for Customer Content (including image/voice/property rights for media captured on site) and will ensure listings are accurate, lawful, and compliant with COFECI/CRECI and consumer-law rules.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">3.2 Prohibited conduct</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer will not: (a) breach laws or third-party rights; (b) upload unlawful/defamatory/abusive content; (c) attempt to copy, reverse engineer, or circumvent security of the Services; (d) perform unsupported scraping or bulk extraction; (e) send spam or unsolicited marketing; (f) misuse invite codes or impersonate others. See AUP for details.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">3.3 Equipment & network</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer is responsible for internet access, devices, and their security.</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">4</span>
              Stella IP; Customer Content; Feedback
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">4.1 Reservation of rights</h3>
                <p className="text-slate-700 dark:text-slate-300">Stella and its licensors retain all rights, title, and interest in and to the Services and Stella Materials (software, designs, trademarks). No rights are granted except as expressly stated.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">4.2 Customer Content ownership</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer retains ownership of Customer Content. Customer grants Stella a worldwide, non-exclusive, royalty-free license to host, store, process, reproduce, adapt, display, and distribute Customer Content <strong>solely</strong> to provide and support the Services (including transcoding, optimization, search/indexing, thumbnails, and 2D-to-3D processing), to comply with law, and to prevent fraud/abuse. This license continues for the Subscription Term and a reasonable period thereafter for backups and legal retention.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">4.3 Listings promotion (optional)</h3>
                <p className="text-slate-700 dark:text-slate-300">If Customer enables promotional placements, Customer authorizes Stella to feature Customer listings/media within Stella surfaces consistent with Customer's settings.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">4.4 Feedback</h3>
                <p className="text-slate-700 dark:text-slate-300">Suggestions or feedback may be used by Stella without restriction; Customer assigns applicable rights or grants a perpetual, irrevocable, royalty-free license.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">5</span>
              Acceptable Use Policy (AUP)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Customer must comply with the AUP incorporated by reference at <strong>[AUP URL]</strong>. Stella may suspend access (with prompt notice) for material AUP violations to prevent harm or illegal activity.</p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">6</span>
              Orders, Fees, and Taxes
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">6.1 Fees</h3>
                <p className="text-slate-700 dark:text-slate-300">Fees and payment schedules are set out in the Order Form. Except as stated in the SLA (service credits) or Section 12 (indemnity), <strong>fees are non-refundable</strong>.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">6.2 Invoicing & payment</h3>
                <p className="text-slate-700 dark:text-slate-300">Unless the Order Form states otherwise, invoices are due <strong>net 15 days</strong> from invoice date. Late amounts may accrue <strong>1% per month</strong> (or the maximum allowed by law), plus reasonable collection costs. Stella may suspend the Services for amounts overdue by more than <strong>15 days</strong> after written notice.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">6.3 Taxes</h3>
                <p className="text-slate-700 dark:text-slate-300">Fees exclude taxes. Customer will pay applicable taxes (e.g., ISS, ICMS, VAT) and is responsible for withholdings. If withholding applies, amounts are <strong>grossed-up</strong> so Stella receives the full amount invoiced.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">6.4 Price changes</h3>
                <p className="text-slate-700 dark:text-slate-300">Fees for renewed terms may be updated upon renewal with at least <strong>30 days'</strong> prior notice, unless otherwise fixed in the Order Form.</p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">7</span>
              Term, Renewal, and Termination
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">7.1 Subscription Term</h3>
                <p className="text-slate-700 dark:text-slate-300">Each subscription runs for the initial term in the Order Form and <strong>renews automatically</strong> for successive terms of the same length unless either party gives <strong>30 days'</strong> written notice before the end of the then-current term.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">7.2 Termination for cause</h3>
                <p className="text-slate-700 dark:text-slate-300">Either party may terminate: (a) for material breach not cured within <strong>30 days</strong> of notice; or (b) immediately if the other party becomes insolvent, enters bankruptcy, or ceases business.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">7.3 Effect of termination</h3>
                <p className="text-slate-700 dark:text-slate-300">Upon termination/expiration, access ends and unpaid fees become due. For <strong>30 days</strong> after termination (if requested within that window), Stella will make Customer Content available for export in a commercially reasonable format. Thereafter, Stella may delete or archive Customer Content subject to legal retention. Sections that by nature survive (e.g., 4, 6, 8–16) will survive.</p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">8</span>
              Confidentiality
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Each party (the <strong>Receiving Party</strong>) will protect the other's Confidential Information using reasonable care and use it only for purposes of this MSA. <strong>Confidential Information</strong> excludes information that is public without breach, already known, independently developed, or rightfully received from a third party without confidentiality obligations. If legally compelled to disclose, the Receiving Party will provide notice (if lawful) and cooperate to seek protective measures. <strong>Injunctive relief</strong> is available for threatened breaches.</p>
            </div>
          </section>

          {/* Section 9 */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">9</span>
              Security; Media Processing; Disaster Recovery
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Stella will maintain <strong>industry-standard technical and organizational measures</strong>, including access controls, vulnerability management, logging/monitoring, employee training, encryption in transit (and at rest where applicable), regular backups, and tested disaster-recovery procedures. Media features (e.g., 2D-to-3D) are provided using automated processing that may contain artifacts; Customers must not rely on outputs for structural/engineering decisions.</p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">10</span>
              Service Levels and Support
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Availability targets, exclusions, maintenance windows, and service credits are defined in the <strong>SLA</strong> at <strong>[SLA URL]</strong>. Support tiers and response targets are described in the <strong>Support Policy</strong> at <strong>[SUPPORT POLICY URL]</strong> (if separate). Credits (if any) are Customer's <strong>exclusive remedy</strong> for covered service-level failures.</p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">11</span>
              Data Protection
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">11.1 Roles</h3>
                <p className="text-slate-700 dark:text-slate-300">For <strong>Customer Personal Data</strong> processed on Customer's behalf within the Services, Customer is the <strong>Controller</strong> and Stella is the <strong>Operator</strong> under the LGPD.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">11.2 DPA</h3>
                <p className="text-slate-700 dark:text-slate-300">The parties' data processing terms are set out in the <strong>DPA</strong> at <strong>[DPA URL]</strong>, incorporated by reference, including description of processing, security measures, subprocessor disclosures, cross-border transfers, and assistance with data subject requests.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">11.3 Incident notice</h3>
                <p className="text-slate-700 dark:text-slate-300">Stella will notify Customer <strong>without undue delay</strong> after becoming aware of a personal-data incident in Stella's systems affecting Customer Personal Data, and will provide information reasonably available for Customer to meet its legal obligations.</p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">12</span>
              Warranties and Disclaimers
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">12.1 Stella warranties</h3>
                <p className="text-slate-700 dark:text-slate-300">Stella warrants that (a) the Services will materially conform to the Documentation; and (b) it will provide the Services with reasonable care and skill.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">12.2 Customer warranties</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer warrants that it has and will maintain all necessary rights and consents for Customer Content and will comply with laws and sector rules (including COFECI/CRECI advertising rules and consumer protection).</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">12.3 Beta Services</h3>
                <p className="text-slate-700 dark:text-slate-300">Beta Services are provided <strong>as is</strong> without warranties and may be modified or discontinued at any time.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">12.4 General disclaimer</h3>
                <p className="text-slate-700 dark:text-slate-300">Except as expressly stated, the Services are provided <strong>"as is"</strong> and <strong>"as available"</strong>, and Stella disclaims all other warranties (express, implied, statutory), including merchantability, fitness for a particular purpose, and non-infringement. Stella does not warrant uninterrupted or error-free operation or the accuracy of automated outputs.</p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">13</span>
              Indemnification
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">13.1 By Stella (IP)</h3>
                <p className="text-slate-700 dark:text-slate-300">Stella will defend and indemnify Customer against third-party claims that the Services, as provided by Stella, <strong>infringe</strong> a patent, copyright, or trademark, or misappropriate a trade secret, and will pay resulting damages and reasonable attorneys' fees finally awarded, provided Customer (a) promptly notifies Stella, (b) gives sole control of the defense to Stella, and (c) cooperates. If a claim arises, Stella may (i) procure the right for Customer to continue using the Services; (ii) modify the Services to be non-infringing; or (iii) terminate the impacted Services and refund prepaid, unused fees. This Section does not apply to claims arising from combinations with non-Stella items, Customer Content, or use contrary to the Documentation.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">13.2 By Customer</h3>
                <p className="text-slate-700 dark:text-slate-300">Customer will defend and indemnify Stella against claims arising from (a) Customer Content; (b) Customer's or Authorized Users' breach of this MSA or law; or (c) Customer's use of the Services in violation of the AUP or third-party rights.</p>
              </div>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">14</span>
              Limitation of Liability
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">To the maximum extent permitted by law, neither party is liable for <strong>indirect, incidental, special, consequential, exemplary, or punitive damages</strong>, or loss of profits, revenue, data, or business, even if advised of the possibility.</p>
              <p className="text-slate-700 dark:text-slate-300">Each party's aggregate liability for all claims in a Subscription Term will not exceed the <strong>amounts paid or payable by Customer to Stella for the Services giving rise to the claim in the 12 months</strong> preceding the event. These limits do <strong>not</strong> apply to (a) payment obligations; (b) breach of confidentiality; (c) IP infringement indemnity obligations; or (d) Customer's misuse of the Services or violation of the AUP.</p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">15</span>
              Compliance
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Each party will comply with applicable laws, including anti-corruption laws (e.g., Lei nº 12.846/2013), competition, export controls, sanctions, marketing/communications rules (e.g., WhatsApp Business policies), labor, tax, and privacy laws. Customer is responsible for honoring end-user opt-outs and consent preferences.</p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">16</span>
              Publicity; References
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Stella may use Customer's name and logo in a customer list and case studies, subject to Customer's brand guidelines. Any other publicity requires prior written consent.</p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">17</span>
              Assignment; Subcontracting
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Neither party may assign this MSA without the other's consent, except to an affiliate or in connection with a merger, acquisition, or sale of substantially all assets, with notice. Stella may use subprocessors to provide the Services and remains responsible for their performance.</p>
            </div>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">18</span>
              Force Majeure
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Neither party is liable for delays or failures due to causes beyond its reasonable control (e.g., internet/hosting outages, DDoS, strikes, acts of government, natural events), provided it uses reasonable efforts to mitigate.</p>
            </div>
          </section>

          {/* Section 19 */}
          <section id="section-19" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">19</span>
              Notices
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Notices must be in writing and sent to the contacts on the Order Form (and for legal notices to <strong>[E-MAIL DE CONTATO JURÍDICO]</strong>). Notices are deemed given upon receipt or, for email, when sent without bounce-back.</p>
            </div>
          </section>

          {/* Section 20 */}
          <section id="section-20" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">20</span>
              Governing Law; Venue; Language
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">This MSA is governed by <strong>Brazilian law</strong>. The parties elect the <strong>Foro da Comarca de São Paulo, Capital</strong>, as the exclusive venue, except that injunctive relief may be sought where needed. If this MSA is provided in Portuguese and English, the <strong>Portuguese version prevails</strong> for Customers in Brazil.</p>
            </div>
          </section>

          {/* Section 21 */}
          <section id="section-21" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">21</span>
              Order of Precedence; Entire Agreement; Amendments
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">Order of precedence: (1) Order Form; (2) Product-Specific Terms (if any); (3) this MSA; (4) SLA; (5) DPA; (6) AUP; (7) Documentation. This MSA, together with incorporated documents, is the entire agreement and supersedes prior proposals and NDAs relating to the same subject (except that separate bilateral NDAs continue for topics outside this MSA). Amendments must be in writing and signed or accepted via the Order Form process.</p>
            </div>
          </section>

          {/* Section 22 */}
          <section id="section-22" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">22</span>
              Counterparts; e-Signatures
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">This MSA may be executed in counterparts and by electronic signatures, each deemed an original.</p>
            </div>
          </section>

          {/* Exhibit A */}
          <section id="section-23" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-bold">A</span>
              Exhibit A — Order Form Template
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-4">Example Order Form</h3>
                
                <div className="space-y-3 text-sm">
                  <p><strong>Customer:</strong> [Entity name], [CNPJ], [Address]</p>
                  <p><strong>Contact:</strong> [Name, email, phone]</p>
                  
                  <div className="mt-4">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2">Services:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Constellation CRM — Plan: [Starter/Pro/Enterprise] — Seats: [#]</li>
                      <li>Site Builder — Sites: [#] — Monthly PV cap: [#]</li>
                      <li>Media/3D Processing — Credits per month: [#]</li>
                      <li>Automations — Runs per month: [#]</li>
                      <li>Add-ons: [e.g., WhatsApp Business integration, Telephony, Advanced Analytics]</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p><strong>Term:</strong> Initial [12] months, start: [DATE], end: [DATE] (auto-renewal)</p>
                    <p><strong>Fees:</strong> Setup R$ [ ], Monthly R$ [ ], Annual R$ [ ] (prepaid/postpaid as checked)</p>
                    <p><strong>SLA Tier:</strong> [Standard/Premium]</p>
                    <p><strong>Support Tier:</strong> [Standard/Priority/Enterprise]</p>
                    <p><strong>Professional Verification:</strong> CRECI validation required for listing features (Yes/No)</p>
                    <p><strong>Usage Limits:</strong> As above and Documentation</p>
                    <p><strong>Billing:</strong> Invoices to [email]; PO #[ ] (if any). Net [15] days.</p>
                    <p><strong>Special Terms:</strong> [e.g., capped overage rates; bespoke integrations; migration hours]</p>
                    <p><strong>Documents incorporated:</strong> MSA, SLA, DPA, AUP, Product-Specific Terms (if any).</p>
                    <p><strong>Signatures:</strong> [e-signature block]</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Questions About This Agreement?
            </h2>
            <p className="text-white/90 mb-6">
              For questions about this Master Subscription Agreement, please contact:
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10</p>
              <p>Address: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Legal/Commercial Inquiries: <strong>[E-MAIL DE CONTATO JURÍDICO]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
