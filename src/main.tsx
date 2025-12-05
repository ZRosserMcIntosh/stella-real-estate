import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider, Navigate, useParams } from 'react-router-dom'
import './i18n'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client for React Query with optimized cache settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // Data is fresh for 30 minutes (increased from 5 for cache reduction)
      gcTime: 60 * 60 * 1000, // Cache kept for 60 minutes (increased from 10 for cache reduction)
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      retry: 1, // Only retry failed requests once
    },
  },
})

// Force dark mode globally
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark')
  // Also set the color-scheme meta tag
  const meta = document.createElement('meta')
  meta.name = 'color-scheme'
  meta.content = 'dark'
  document.head.appendChild(meta)
}

// Helper component for dynamic project redirects
const ProjectRedirect = () => {
  const { slug } = useParams()
  return <Navigate to={`/projetos/${slug}`} replace />
}
import Layout from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Listings from './pages/Listings'
import ProjectsIndex from './pages/projects/ProjectsIndex'
import ProjectDetail from './pages/projects/ProjectDetail'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import FounderTerms from './pages/FounderTerms'
import MSA from './pages/MSA'
import SLA from './pages/SLA'
import DPA from './pages/DPA'
import AUP from './pages/AUP'
import SupportPolicy from './pages/SupportPolicy'
import BetaTerms from './pages/BetaTerms'
import APITerms from './pages/APITerms'
import ReferralTerms from './pages/ReferralTerms'
import Legal from './pages/Legal'
import ListYourProperty from './pages/ListYourProperty'
import NotFound from './pages/NotFound'
import Institutional from './pages/Institutional'
import Investors from './pages/Investors'
import LuisaMarketing from './pages/LuisaMarketing'
import LegalServices from './pages/LegalServices'
import SeguroFianca from './pages/SeguroFianca'
import RequestAccess from './pages/investors/RequestAccess'
import ConstellationRedirect from './pages/ConstellationRedirect'
import PrecosRedirect from './pages/PrecosRedirect'
import Members from './pages/Members'
import StellaReal from './pages/StellaReal'
import International from './pages/International'
import ConstellationPortal from './pages/ConstellationPortal'
import ConstellationLogin from './pages/constellation/ConstellationLogin'
import ConstellationSignup from './pages/constellation/ConstellationSignup'
import ConstellationReset from './pages/constellation/ConstellationReset'
import ConstellationDashboard from './pages/constellation/ConstellationDashboard'
import ConstellationPaymentPending from './pages/constellation/ConstellationPaymentPending'
import ConstellationVisuals from './pages/constellation/ConstellationVisuals'
import ConstellationSiteBuilder from './pages/constellation/ConstellationSiteBuilder'
import { SubdomainRedirect } from './components/SubdomainRedirect'
import { SubdomainToPathRedirect } from './components/SubdomainToPathRedirect'
import ConditionalLoginRedirect from './components/ConditionalLoginRedirect'
import ConditionalSignupRedirect from './components/ConditionalSignupRedirect'
import ConditionalResetRedirect from './components/ConditionalResetRedirect'
import AdminRoute from './components/AdminRoute'
import CreateSite from './pages/onboarding/CreateSite'
import ChooseRole from './pages/onboarding/ChooseRole'
import RealtorLicense from './pages/onboarding/RealtorLicense'
import BrokerageLicense from './pages/onboarding/BrokerageLicense'
import DeveloperBrokerLink from './pages/onboarding/DeveloperBrokerLink'
import EmployeeInvite from './pages/onboarding/EmployeeInvite'
import SiteSetup from './pages/onboarding/SiteSetup'
import CreciCourse from './pages/CreciCourse'
import DealRoom from './pages/admin/DealRoom'
import AdminLayout from './pages/admin/AdminLayout'
import Account from './pages/admin/Account'
import ListingsNewProjects from './pages/admin/ListingsNewProjects'
import ListingsForSale from './pages/admin/ListingsForSale'
import ListingsForRent from './pages/admin/ListingsForRent'
import Constellation from './pages/admin/CRM'
import Ballet from './pages/admin/Ballet'
import SocialMedia from './pages/admin/SocialMedia'
import WebsiteBuilder from './pages/admin/WebsiteBuilder'
import Team from './pages/admin/Team'
import Calendar from './pages/admin/Calendar'
import Analytics from './pages/admin/Analytics'
import DocumentVault from './pages/admin/DocumentVault'
import SiteAdmin from './pages/admin/SiteAdmin'
import Equity from './pages/admin/Equity'
import RosserStella from './pages/admin/RosserStella'
import DeveloperLayout from './pages/admin/DeveloperLayout'
import SubmitTicket from './pages/admin/developer/SubmitTicket'
import DeveloperUpdates from './pages/admin/developer/Updates'
import PendingRequests from './pages/admin/developer/PendingRequests'
import DeveloperTemplates from './pages/admin/developer/Templates'
import DeveloperFeatureGates from './pages/admin/developer/FeatureGates'
import DeveloperAccessCodes from './pages/admin/developer/AccessCodes'
import DeveloperVisuals from './pages/admin/developer/Visuals'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import MobileLogins from './pages/mobile/MobileLogins'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
import { OnboardingProvider } from './context/OnboardingContext'
import { SubdomainRouter } from './components/SubdomainRouter'
import { ErrorBoundary } from './components/ErrorBoundary'
import ConditionalLayout from './components/ConditionalLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ConditionalLayout />,
    children: [
      { index: true, element: <App /> },
      // Portuguese URLs (primary)
      { path: 'sobre', element: <About /> },
      { path: 'contato', element: <Contact /> },
      { path: 'imoveis', element: <Listings /> },
      { path: 'projetos', element: <ProjectsIndex /> },
      { path: 'projetos/:slug', element: <ProjectDetail /> },
      { path: 'privacidade', element: <Privacy /> },
      { path: 'termos', element: <Terms /> },
      { path: 'cookies', element: <Cookies /> },
      { path: 'founder-terms', element: <FounderTerms /> },
      { path: 'msa', element: <MSA /> },
      { path: 'sla', element: <SLA /> },
      { path: 'dpa', element: <DPA /> },
      { path: 'aup', element: <AUP /> },
      { path: 'politica-suporte', element: <SupportPolicy /> },
      { path: 'termos-beta', element: <BetaTerms /> },
      { path: 'termos-api', element: <APITerms /> },
      { path: 'termos-indicacao', element: <ReferralTerms /> },
      { path: 'juridico', element: <Legal /> },
      { path: 'institucional', element: <Institutional /> },
      { path: 'investidores', element: <Investors /> },
      { path: 'luisa-marketing', element: <LuisaMarketing /> },
      { path: 'servicos-juridicos', element: <LegalServices /> },
      { path: 'seguro-fianca', element: <SeguroFianca /> },
      { path: 'constellation', element: <ConstellationRedirect /> },
      { path: 'precos', element: <PrecosRedirect /> },
      { path: 'international', element: <International /> },
      { path: 'anuncie-seu-imovel', element: <ListYourProperty /> },
      { path: 'consumidores', element: <ListYourProperty /> },
      { path: 'corretores-independentes', element: <ListYourProperty /> },
      { path: 'empresas-imobiliarias', element: <ListYourProperty /> },
      { path: 'incorporadores', element: <ListYourProperty /> },
      { path: 'gestores-longo-prazo', element: <ListYourProperty /> },
      { path: 'gestores-curto-prazo', element: <ListYourProperty /> },
      { path: 'parceiros-financiamento', element: <ListYourProperty /> },
      { path: 'inspecoes-avaliacoes', element: <ListYourProperty /> },
      // English URL redirects (for backward compatibility & SEO)
      { path: 'about', element: <Navigate to="/sobre" replace /> },
      { path: 'contact', element: <Navigate to="/contato" replace /> },
      { path: 'listings', element: <Navigate to="/imoveis" replace /> },
      { path: 'projects', element: <Navigate to="/projetos" replace /> },
      { path: 'projects/:slug', element: <ProjectRedirect /> },
      { path: 'privacy', element: <Navigate to="/privacidade" replace /> },
      { path: 'terms', element: <Navigate to="/termos" replace /> },
      { path: 'support-policy', element: <Navigate to="/politica-suporte" replace /> },
      { path: 'beta-terms', element: <Navigate to="/termos-beta" replace /> },
      { path: 'api-terms', element: <Navigate to="/termos-api" replace /> },
      { path: 'referral-terms', element: <Navigate to="/termos-indicacao" replace /> },
      { path: 'legal', element: <Navigate to="/juridico" replace /> },
      { path: 'institutional', element: <Navigate to="/institucional" replace /> },
      { path: 'investors', element: <Navigate to="/investidores" replace /> },
      { path: 'plataforma-stella', element: <Navigate to="/constellation" replace /> },
      { path: 'stella-platform', element: <Navigate to="/constellation" replace /> },
      { path: 'pricing', element: <Navigate to="/precos" replace /> },
      { path: 'list-your-property', element: <Navigate to="/anuncie-seu-imovel" replace /> },
      { path: 'members', element: <Members /> },
      // Subdomain routes (temporary paths until custom domains are configured)
      { path: 'sub/stellareal', element: <StellaReal /> },
    ],
  },
  // Constellation subdomain routes (when visiting constellation.stellareal.com.br)
  // These are the clean URLs without /sub/constellation prefix - NO HEADER/FOOTER
  { path: '/login', element: <ConditionalLoginRedirect /> },
  { path: '/signup', element: <ConditionalSignupRedirect /> },
  { path: '/reset', element: <ConditionalResetRedirect /> },
  { path: '/payment-pending', element: <ConstellationPaymentPending /> },
  { path: '/admin', element: <ConstellationDashboard /> },
  { path: '/dashboard', element: <ConstellationDashboard /> },
  { path: '/visuals', element: <ConstellationVisuals /> },
  { path: '/site-builder', element: <ConstellationSiteBuilder /> },
  // Constellation routes - standalone without main site header/footer
  { path: '/sub/constellation', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/login', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/signup', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/reset', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/admin', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/dashboard', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/visuals', element: <SubdomainRedirect /> },
  { path: '/sub/constellation/site-builder', element: <SubdomainRedirect /> },
  // NEW: Constellation routes on main domain (path-based, not subdomain)
  // These routes replace the subdomain constellation.stellareal.com.br URLs
  { path: '/constellation', element: <ConstellationPortal /> },
  { path: '/constellation/login', element: <ConstellationLogin /> },
  { path: '/constellation/signup', element: <ConstellationSignup /> },
  { path: '/constellation/reset', element: <ConstellationReset /> },
  { path: '/constellation/dashboard', element: <ConstellationDashboard /> },
  { path: '/constellation/admin', element: <ConstellationDashboard /> },
  { path: '/constellation/visuals', element: <ConstellationVisuals /> },
  { path: '/constellation/site-builder', element: <ConstellationSiteBuilder /> },
  { path: '/criar-site', element: <CreateSite /> },
  { path: '/onboarding/choose-role', element: <ChooseRole /> },
  { path: '/onboarding/realtor-license', element: <RealtorLicense /> },
  { path: '/onboarding/brokerage-license', element: <BrokerageLicense /> },
  { path: '/onboarding/developer-broker-link', element: <DeveloperBrokerLink /> },
  { path: '/onboarding/employee-code', element: <EmployeeInvite /> },
  { path: '/onboarding/site-setup', element: <SiteSetup /> },
  { path: '/curso/creci', element: <CreciCourse /> },
  { path: '/investors/login', element: <Navigate to="/admin/login" replace /> },
  { path: '/investors/request-access', element: <RequestAccess /> },
  { path: '/mobile/logins', element: <MobileLogins /> },
  { path: '/admin/login', element: <Login /> },
  { path: '/admin/signup', element: <SignUp /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  {
    path: '/admin',
    element: <AdminRoute />, // Protected route - only stella_admin and stella_team
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DealRoom /> },
      { path: 'account', element: <Account /> },
      { path: 'listings/new-projects', element: <ListingsNewProjects /> },
      { path: 'listings/for-sale', element: <ListingsForSale /> },
      { path: 'listings/for-rent', element: <ListingsForRent /> },
      { path: 'crm', element: <Constellation /> },
      { path: 'ballet', element: <Ballet /> },
      { path: 'social-media', element: <SocialMedia /> },
      { path: 'website-builder', element: <WebsiteBuilder /> },
      { path: 'team', element: <Team /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'analytics', element: <Analytics /> },
  { path: 'document-vault', element: <DocumentVault /> },
  { path: 'site-admin', element: <SiteAdmin /> },
      { path: 'equity', element: <Equity /> },
      { path: 'rosser-stella', element: <RosserStella /> },
      {
        path: 'developer',
        element: <DeveloperLayout />,
        children: [
          { index: true, element: <Navigate to="submit-ticket" replace /> },
          { path: 'submit-ticket', element: <SubmitTicket /> },
          { path: 'pending-requests', element: <PendingRequests /> },
          { path: 'updates', element: <DeveloperUpdates /> },
          { path: 'templates', element: <DeveloperTemplates /> },
          { path: 'feature-gates', element: <DeveloperFeatureGates /> },
          { path: 'access-codes', element: <DeveloperAccessCodes /> },
          { path: 'visuals', element: <DeveloperVisuals /> },
        ],
      },
    ],
    }], // Close AdminRoute children and AdminLayout children
  },
  { path: '/builder', element: <Navigate to="/admin/website-builder" replace /> },
  { path: '*', element: <NotFound /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <OnboardingProvider>
              <CurrencyProvider>
                <SubdomainRouter>
                  <RouterProvider router={router} />
                </SubdomainRouter>
              </CurrencyProvider>
            </OnboardingProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
