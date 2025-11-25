import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '../lib/telemetry'
import { getSiteSettings } from '../lib/siteSettings'

export default function Footer() {
  const { t } = useTranslation()
  const location = useLocation()
  const [footerLogoUrl, setFooterLogoUrl] = useState<string>('')
  const [logoLoading, setLogoLoading] = useState(true)
  
  // Load footer logo from settings
  useEffect(() => {
    const loadFooterLogo = async () => {
      try {
        const settings = await getSiteSettings(['footer_logo_url'])
        if (settings.footer_logo_url) {
          console.log('Using footer logo from Supabase:', settings.footer_logo_url)
          setFooterLogoUrl(settings.footer_logo_url)
        } else {
          console.log('No footer logo in Supabase, using local fallback: /stella-logo.png')
          setFooterLogoUrl('/stella-logo.png')
        }
      } catch (error) {
        console.error('Failed to load footer logo, using local fallback:', error)
        setFooterLogoUrl('/stella-logo.png')
      } finally {
        setLogoLoading(false)
      }
    }
    loadFooterLogo()
  }, [])
  
  // Determine if we're on a page with a gradient/colored background
  const isSpecialPage = ['/privacidade', '/termos', '/cookies', '/msa', '/sla', '/dpa', '/aup', '/politica-suporte', '/termos-beta', '/termos-api', '/termos-indicacao', '/sobre', '/investidores'].includes(location.pathname)
  
  return (
    <footer className={`relative z-50 border-t ${isSpecialPage ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
      <div className="container-padded py-12">
        {/* Grid Layout for Categorized Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          
          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('home.footer.legalTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacidade" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.termsOfUse')}
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.cookiePolicy')}
                </Link>
              </li>
              <li>
                <Link to="/msa" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.masterSubscriptionAgreement')}
                </Link>
              </li>
              <li>
                <Link to="/sla" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.serviceLevelAgreement')}
                </Link>
              </li>
              <li>
                <Link to="/dpa" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.dataProcessingAddendum')}
                </Link>
              </li>
              <li>
                <Link to="/aup" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.acceptableUsePolicy')}
                </Link>
              </li>
              <li>
                <Link to="/politica-suporte" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.supportPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/termos-beta" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.betaTerms')}
                </Link>
              </li>
              <li>
                <Link to="/termos-api" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.apiTerms')}
                </Link>
              </li>
              <li>
                <Link to="/termos-indicacao" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.referralTerms')}
                </Link>
              </li>
              <li>
                <Link to="/juridico" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.legal')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('home.footer.companyTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/sobre" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('header.nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/institucional" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.institutional')}
                </Link>
              </li>
              <li>
                <Link to="/investidores" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.investors')}
                </Link>
              </li>
              <li>
                <Link to="/luisa-marketing" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Luisa Marketing Agency
                </Link>
              </li>
              <li>
                <Link to="/servicos-juridicos" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Serviços Jurídicos
                </Link>
              </li>
              <li>
                <Link to="/seguro-fianca" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Seguro Fiança
                </Link>
              </li>
              <li>
                <Link to="/criar-site" onClick={() => trackEvent('signup_cta_click', { position: 'footer' })} className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Criar meu site
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('home.footer.servicesTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/anuncie-seu-imovel" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.listProperty')}
                </Link>
              </li>
              <li>
                <Link to="/plataforma-stella" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.constellationPlatform')}
                </Link>
              </li>
              <li>
                <Link to="/curso/creci" onClick={() => trackEvent('signup_cta_click', { position: 'footer' })} className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.creciCourse')}
                </Link>
              </li>
              <li>
                <Link to="/consumidores" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.consumers')}
                </Link>
              </li>
              <li>
                <Link to="/corretores-independentes" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.independentAgents')}
                </Link>
              </li>
              <li>
                <Link to="/empresas-imobiliarias" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.brokerageCompanies')}
                </Link>
              </li>
              <li>
                <Link to="/incorporadores" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.propertyDevelopers')}
                </Link>
              </li>
              <li>
                <Link to="/gestores-longo-prazo" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.longTermManagers')}
                </Link>
              </li>
              <li>
                <Link to="/gestores-curto-prazo" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.shortTermManagers')}
                </Link>
              </li>
              <li>
                <Link to="/parceiros-financiamento" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.financingPartners')}
                </Link>
              </li>
              <li>
                <Link to="/inspecoes-avaliacoes" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.inspectionsAppraisals')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Column */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">{t('home.footer.adminTitle')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/admin" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('home.footer.admin')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {t('header.nav.employeeLogin')}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            &copy; <span id="year">{new Date().getFullYear()}</span> Stella Mary Lima Barbosa · CNPJ: 53.152.795/0001-10 · CRECI 309568 · {t('home.footer.copyright')}
          </p>
        </div>

        {/* Social Media Icons - Centered Row */}
        <div className="pt-6 flex justify-center">
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/instagram.png" 
                alt="Instagram" 
                className="h-8 w-auto"
              />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/x-white.png" 
                alt="X (Twitter)" 
                className="h-8 w-auto"
              />
            </a>
            <a href="https://plus.google.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/google-plus.png" 
                alt="Google Plus" 
                className="h-8 w-auto"
              />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/facebook.png" 
                alt="Facebook" 
                className="h-8 w-auto"
              />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/linkedin.png" 
                alt="LinkedIn" 
                className="h-8 w-auto"
              />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/youtube.png" 
                alt="YouTube" 
                className="h-8 w-auto"
              />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="/social-icons/whatsapp.png" 
                alt="WhatsApp" 
                className="h-8 w-auto"
              />
            </a>
          </div>
        </div>

        {/* Footer Logo - Centered at Bottom */}
        {!logoLoading && footerLogoUrl && (
          <div className="pt-6 flex justify-center">
            <img 
              src={footerLogoUrl} 
              alt="Footer Logo" 
              className="h-20 w-auto opacity-80 hover:opacity-100 transition-opacity"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/stella-logo.png') {
                  console.log('Footer logo failed to load, using fallback: /stella-logo.png');
                  target.src = '/stella-logo.png';
                }
              }}
            />
          </div>
        )}
      </div>
    </footer>
  )
}
