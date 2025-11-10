import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ReferralTerms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-slate-900 dark:via-amber-950 dark:to-yellow-950 -mt-20 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 dark:from-amber-400 dark:to-yellow-400 rounded-2xl mb-6 shadow-lg shadow-amber-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Referral / Affiliate Program Terms
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Terms Governing Participation in Stella's Referral and Affiliate Programs
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-800">
            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-slate-600 dark:text-slate-300">Last updated: November 5, 2025</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 mb-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">
              These Referral / Affiliate Program Terms ("<strong>Terms</strong>") govern participation in the referral and affiliate programs operated by <span className="text-amber-600 dark:text-amber-400">Stella Mary Lima Barbosa</span>, CNPJ <span className="text-amber-600 dark:text-amber-400">53.152.795/0001-10</span>, headquartered at <strong>[ENDEREÇO COMPLETO]</strong> ("<strong>Stella</strong>", "<strong>we</strong>", "<strong>our</strong>"). By applying to or participating in the Program, you ("<strong>Affiliate</strong>", "<strong>you</strong>") agree to these Terms and to the <strong>Terms of Use</strong>, <strong>MSA</strong> (if applicable), <strong>AUP</strong>, <strong>Privacy Policy</strong>, <strong>Cookie Policy</strong>, and any <strong>Program Materials</strong> we publish.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-4">
              If you participate on behalf of a business, you represent you are authorized to bind that entity.
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gradient-to-br from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 rounded-2xl shadow-xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              '1. Definitions',
              '2. Enrollment & Eligibility',
              '3. License to Use Program Materials',
              '4. Tracking & Attribution',
              '5. Qualified Leads & Sales',
              '6. Commissions & Payment',
              '7. Refunds, Chargebacks, Reversals',
              '8. Marketing Rules',
              '9. Brand & IP',
              '10. Data Protection',
              '11. Independent Contractor',
              '12. Publicity & Confidentiality',
              '13. Fraud; Audit; Compliance',
              '14. Term; Suspension; Termination',
              '15. Warranties; Disclaimers',
              '16. Limitation of Liability',
              '17. Indemnification',
              '18. Changes to the Program',
              '19. Governing Law; Venue; Language',
              '20. Notices',
              '21. Entire Agreement',
              'Appendix A: Commission Matrix',
              'Appendix B: Creative Guidelines',
              'Appendix C: Prohibited Keywords',
              'Appendix D: Tax & KYC Requirements'
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index < 21 ? index + 1 : `appendix-${String.fromCharCode(65 + (index - 21))}`}`}
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
          <section id="section-1" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">1</span>
              Definitions
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-3">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Program:</strong> Stella's referral and/or affiliate programs.</li>
                <li><strong>Program Materials:</strong> Program policies, creatives, brand guidelines, links, coupon codes, APIs, and portal access we provide.</li>
                <li><strong>Referral Link / Code:</strong> Unique URL or code that attributes Leads and Sales to you.</li>
                <li><strong>Lead:</strong> A person or entity that follows your Referral Link or submits your referral code.</li>
                <li><strong>Qualified Lead:</strong> A Lead that meets Section 5.</li>
                <li><strong>Qualified Sale / Conversion:</strong> A paid subscription or purchase by a Qualified Lead that meets Section 5.</li>
                <li><strong>Commission:</strong> The fee we pay for a Qualified Sale as defined in Appendix A.</li>
                <li><strong>Attribution Window:</strong> Time period after first click or code use within which a Conversion is attributed to you (Appendix A).</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">2</span>
              Enrollment & Eligibility
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.1 Application.</strong> Apply via the Program portal. We may approve, reject, or revoke participation in our discretion.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.2 Eligibility.</strong> You must be at least 18, provide complete/accurate contact, tax, and payment info (CPF/CNPJ, bank/PIX), and comply with applicable laws and industry rules (including COFECI/CRECI and advertising standards).
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>2.3 Conflicts.</strong> If these Terms conflict with other Stella terms, these Terms control for the Program.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">3</span>
              License to Use Program Materials
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We grant you a <strong>limited, revocable, non-transferable, non-sublicensable</strong> license to use Program Materials <strong>solely</strong> to promote Stella. You will follow our <strong>Brand Guidelines</strong> and not alter creatives except as permitted.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">4</span>
              Tracking & Attribution
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.1 Mechanism.</strong> We track using cookies, device identifiers, and/or referral codes. Clearing cookies, privacy settings, or third-party blockers may affect tracking.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.2 Model.</strong> Unless stated otherwise in Appendix A, Program uses <strong>last non-direct click</strong> within the Attribution Window. Direct or internal Stella traffic (no referrer) does not override your click within the window.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.3 Disputes.</strong> Our tracking and logs prevail in case of conflict. We may reattribute or deny credit in cases of abuse, fraud, or policy breach.
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>4.4 Self-referrals.</strong> You may not refer yourself, your own employer account, or accounts you control. We may void such attributions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">5</span>
              Qualified Leads & Sales
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  A <strong>Qualified Lead</strong> is a Lead that: (a) is new to Stella (no active or recently active account within <strong>180 days</strong>); (b) provides valid contact and billing details; (c) does not originate from incentivized clicks, fake accounts, or bots; and (d) signs up within the <strong>Attribution Window</strong>.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  A <strong>Qualified Sale / Conversion</strong> occurs when a Qualified Lead: (i) purchases an eligible paid plan listed in Appendix A; (ii) passes fraud and payment verification; and (iii) remains in good standing beyond the <strong>hold period</strong> (see Section 7 / Appendix A). Free trials, courtesy credits, internal transfers, demo/sandbox tenants, and one-off professional services (unless listed) are <strong>not</strong> Conversions unless Appendix A states otherwise.
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  We may exclude (without limitation): duplicates, bulk/lead-list imports, coupon-site traffic if disallowed, and channel conflicts with our direct sales where an existing opportunity already exists.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="section-6" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">6</span>
              Commissions & Payment
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.1 Rates.</strong> Commission types, rates, and eligible products are in <strong>Appendix A</strong>. We may update them prospectively with notice via the portal/email.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.2 Currency & Threshold.</strong> Commissions are calculated and paid in <strong>BRL</strong>. Minimum payout <strong>R$ 200</strong> per cycle. Balances below this carry forward.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.3 Schedule.</strong> Payouts occur <strong>monthly</strong> for Conversions that cleared the <strong>45-day</strong> hold.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.4 Method.</strong> Payments via <strong>PIX</strong> / <strong>bank transfer</strong> / <strong>invoice</strong> as specified in your profile. You must provide accurate bank/PIX details and, where applicable, issue <strong>nota fiscal</strong>.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.5 Taxes.</strong> Commissions are gross of taxes. You are responsible for taxes, withholdings, and any required invoices. If withholding applies, you will gross-up so we receive the net due.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>6.6 Cap.</strong> We may impose caps per Lead, per account, or per period (listed in Appendix A).
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="section-7" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">7</span>
              Refunds, Chargebacks, Reversals
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                If a Conversion is refunded, charged back, marked fraudulent, or canceled within the hold period, <strong>no Commission</strong> is due. If reversal occurs <strong>after</strong> payout, we may <strong>offset</strong> against future payouts or invoice you for the negative balance.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="section-8" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">8</span>
              Marketing Rules (Channels & Conduct)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>8.1 Permitted Channels (examples):</strong> your owned websites, content/blog posts, email to your consented lists, organic social, events, webinars, and compliant paid ads as allowed below.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>8.2 Paid Search / Brand Bidding:</strong>
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  <li>Do <strong>not</strong> bid on or use our trademarks, misspellings, or domain names as keywords, in ad text, or as display URLs (see Appendix C).</li>
                  <li>No direct-linking from search ads to Stella domains without a compliant pre-landing page.</li>
                </ul>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>8.3 Coupons/Deals:</strong> Coupon/extension/loyalty sites require <strong>prior written approval</strong>. Unauthorized code promotion voids attribution.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>8.4 Email, SMS, WhatsApp:</strong> Must comply with LGPD, Marco Civil, ANATEL, WhatsApp Business policies, and anti-spam rules. Only message users with valid consent; include identification and opt-out.
                </p>
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>8.5 Claims & Disclosures:</strong>
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  <li>No false, misleading, or unsubstantiated claims.</li>
                  <li>Disclose the <strong>material connection</strong> (e.g., "I may earn a commission…") where required by law/CONAR/consumer-protection rules.</li>
                  <li>Do not imply partnership, investment, employment, or exclusive discounts unless authorized.</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>8.6 Prohibited Conduct:</strong>
                </p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
                  <li>Incentivized clicks/installs, forced redirects, adware, toolbars, cookie stuffing, brand impersonation, fake reviews/testimonials, bots.</li>
                  <li>Framing, scraping, bulk exporting of content/data, or using confidential Program Materials outside the Program.</li>
                  <li>Purchasing from your own link, referring current customers within the cool-off window, or diverting existing Stella opportunities.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sections 9-21 (shorter sections) */}
          <section id="section-9" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">9</span>
              Brand & IP
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Use our marks only as permitted by the <strong>Brand Guidelines</strong> at <strong>[URL das Diretrizes de Marca]</strong>. No registration of confusingly similar domains, social handles, or apps. No modification of logos beyond provided assets.
              </p>
            </div>
          </section>

          <section id="section-10" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">10</span>
              Data Protection
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Handle personal data collected via your channels under your own privacy notice and in compliance with <strong>LGPD</strong> and applicable laws. Do not share raw lead lists with us unless requested through Program tools. Do not use Program data for purposes other than the Program. Security incidents affecting Program data must be reported to <strong>[security@yourdomain]</strong> within <strong>48 hours</strong>.
              </p>
            </div>
          </section>

          <section id="section-11" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">11</span>
              Independent Contractor
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                You are an independent contractor, not our employee, partner, or agent. You may not negotiate prices, make offers, or bind Stella.
              </p>
            </div>
          </section>

          <section id="section-12" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">12</span>
              Publicity & Confidentiality
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Program rates, dashboards, and non-public information are <strong>Confidential Information</strong>. You may not publish performance/benchmarking without our consent. We may identify you as a participant (name/logo) unless you opt out in writing.
              </p>
            </div>
          </section>

          <section id="section-13" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">13</span>
              Fraud; Audit; Compliance
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We may review traffic quality and request reasonable evidence (source URLs, ad accounts, screenshots). You will keep accurate records for <strong>24 months</strong> and provide them within <strong>10 business days</strong> of request. We may suspend or withhold payouts during investigations. We may terminate for fraud or material breach immediately.
              </p>
            </div>
          </section>

          <section id="section-14" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">14</span>
              Term; Suspension; Termination
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                These Terms start on approval and continue until terminated. Either party may terminate <strong>at will</strong> with notice via the portal/email. We may suspend or terminate immediately for breach, fraud, reputational risk, or legal requirement. Upon termination: (a) stop using Program Materials; (b) remove Referral Links/codes; (c) unpaid eligible Commissions accrued <strong>before</strong> termination will be paid per Section 6, minus offsets.
              </p>
            </div>
          </section>

          <section id="section-15" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">15</span>
              Warranties; Disclaimers
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We provide the Program and Program Materials <strong>"as is"</strong> and <strong>"as available."</strong> We do not guarantee any click-through, conversion, or revenue.
              </p>
            </div>
          </section>

          <section id="section-16" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">16</span>
              Limitation of Liability
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                To the maximum extent permitted by law, neither party will be liable for <strong>indirect, incidental, special, consequential, exemplary, or punitive damages</strong>, or lost profits/revenue/data. Stella's aggregate liability related to the Program in any 12-month period is capped at the <strong>Commissions paid or payable</strong> to you in that period. Consumer non-waivable rights remain unaffected.
              </p>
            </div>
          </section>

          <section id="section-17" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">17</span>
              Indemnification
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                You will <strong>defend, indemnify, and hold harmless</strong> Stella from claims, damages, fines, and costs arising out of: (a) your channels, content, or ads; (b) your breach of these Terms or law; (c) your misuse of Program Materials or data; (d) your taxes, invoices, or employment obligations.
              </p>
            </div>
          </section>

          <section id="section-18" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">18</span>
              Changes to the Program
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                We may modify Program rules, rates, eligible products, or these Terms. Material changes will be posted in the portal or emailed. Continued participation after the effective date constitutes acceptance.
              </p>
            </div>
          </section>

          <section id="section-19" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">19</span>
              Governing Law; Venue; Language
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                These Terms are governed by <strong>Brazilian law</strong>. Venue follows the <strong>MSA/Terms of Use</strong>: for businesses, <strong>São Paulo—Capital</strong>; for consumers, CDC rules apply. If published in Portuguese and English, the <strong>Portuguese version prevails</strong> for Brazil.
              </p>
            </div>
          </section>

          <section id="section-20" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">20</span>
              Notices
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                Program notices may be sent via portal messages or email to your registered address. Legal notices to Stella: <strong>[legal@yourdomain]</strong>.
              </p>
            </div>
          </section>

          <section id="section-21" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-500 text-white rounded-lg text-sm font-bold">21</span>
              Entire Agreement; Order of Precedence
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300">
                These Terms (plus Program Materials referenced herein) are the entire agreement for the Program and supersede prior or contemporaneous communications about the Program. In a conflict with other Stella documents, these Terms control <strong>for the Program</strong> (data-protection conflicts: <strong>DPA</strong> controls).
              </p>
            </div>
          </section>

          {/* Appendices */}
          <section id="section-appendix-A" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold">A</span>
              Appendix A — Commission & Attribution Matrix
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Replace with your actual rules:</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Eligible Products:</strong> Constellation CRM [Starter/Pro/Enterprise], Site Builder, Automations, 2D→3D Credits.</li>
                <li><strong>Default Commission:</strong> <strong>20%</strong> of first invoice (new customer) OR <strong>10%</strong> of first year subscription excluding taxes/fees/credits.</li>
                <li><strong>Recurring Commission (optional):</strong> <strong>X%</strong> for months 2–12 on active subscriptions (Enterprise plans excluded).</li>
                <li><strong>Milestone Bonuses (optional):</strong> +<strong>R$ [ ]</strong> at 5 qualified new customers in a quarter; +<strong>R$ [ ]</strong> at 10.</li>
                <li><strong>Attribution Window:</strong> <strong>90 days</strong> last non-direct click or <strong>30 days</strong> code redemption, whichever is later.</li>
                <li><strong>Hold Period:</strong> <strong>45 days</strong> after first payment clears (or longer if noted).</li>
                <li><strong>Caps:</strong> Max <strong>R$ [ ]</strong> per customer; max <strong>R$ [ ]</strong> per month per Affiliate (unless Enterprise Partner addendum).</li>
                <li><strong>Ineligible:</strong> Downgrades, renewals after churn &lt;180 days, upgrades within existing orgs, one-off services (unless listed), free trials without conversion, internal or self-referrals.</li>
                <li><strong>Channel Conflicts:</strong> If Stella sales was actively engaged with a prospect <strong>before</strong> your first touch (logged opportunity), attribution may be denied or shared per Program rules.</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-B" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold">B</span>
              Appendix B — Creative & Messaging Guidelines
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Examples:</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>Use only <strong>current</strong> logos and product names.</li>
                <li>Always include a clear <strong>disclosure</strong> of your affiliate relationship.</li>
                <li>Do not promise features, pricing, discounts, or timelines not published by Stella.</li>
                <li>Label AI renders and 3D visuals as <strong>illustrative</strong> where applicable.</li>
                <li>No superlatives like "best/guaranteed returns" without substantiation.</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-C" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold">C</span>
              Appendix C — Prohibited Keywords / Brand Terms
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">Examples (do not bid on these):</p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>"Stella", "Stella Real Estate", "Constellation CRM", misspellings/typos, branded domains, and any registered or common-law marks of Stella.</li>
                <li>"Official", "Stella desconto", "Stella cupom" (unless we run an authorized campaign).</li>
              </ul>
            </div>
          </section>

          <section id="section-appendix-D" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8 scroll-mt-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold">D</span>
              Appendix D — Tax & KYC Requirements (Brazil)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Individuals:</strong> <strong>CPF</strong>, full name, address, PIX key; declaration for tax reporting when requested.</li>
                <li><strong>Legal entities:</strong> <strong>CNPJ</strong>, razão social, endereço, bank/PIX details, and <strong>nota fiscal</strong> issuance (if required).</li>
                <li><strong>International affiliates (if any):</strong> provide W-8/W-9 equivalent forms and accept wire fees; FX conversion by receiving bank.</li>
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-br from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Join the Affiliate Program
            </h2>
            <p className="text-white/90 mb-6">
              Interested in becoming an affiliate partner? Questions about the program?
            </p>
            <div className="space-y-2 text-white/90">
              <p><strong>Stella Mary Lima Barbosa</strong></p>
              <p>CNPJ: 53.152.795/0001-10 · CRECI: 309568</p>
              <p>Endereço: <strong>[ENDEREÇO COMPLETO]</strong></p>
              <p>Program Portal: <strong>[PORTAL URL]</strong></p>
              <p>Affiliate Support: <strong>[affiliates@yourdomain]</strong></p>
              <p>Legal: <strong>[legal@yourdomain]</strong></p>
              <p>Security: <strong>[security@yourdomain]</strong></p>
              <p>Brand Guidelines: <strong>[URL das Diretrizes de Marca]</strong></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
