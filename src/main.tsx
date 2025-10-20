import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './i18n'
import Layout from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import Listings from './pages/Listings'
import Projects from './pages/Projects'
import ProjectsIndex from './pages/projects/ProjectsIndex'
import ProjectDetail from './pages/projects/ProjectDetail'
import Privacy from './pages/Privacy'
import Legal from './pages/Legal'
import ListYourProperty from './pages/ListYourProperty'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import DealRoom from './pages/admin/DealRoom'
import AdminLayout from './pages/admin/AdminLayout'
import Account from './pages/admin/Account'
import ListingsNewProjects from './pages/admin/ListingsNewProjects'
import ListingsForSale from './pages/admin/ListingsForSale'
import ListingsForRent from './pages/admin/ListingsForRent'
import CRM from './pages/admin/CRM'
import SocialMedia from './pages/admin/SocialMedia'
import Team from './pages/admin/Team'
import Calendar from './pages/admin/Calendar'
import Analytics from './pages/admin/Analytics'
import DocumentVault from './pages/admin/DocumentVault'
import SiteAdmin from './pages/admin/SiteAdmin'
import DeveloperLayout from './pages/admin/DeveloperLayout'
import SubmitTicket from './pages/admin/developer/SubmitTicket'
import DeveloperUpdates from './pages/admin/developer/Updates'
import PendingRequests from './pages/admin/developer/PendingRequests'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { CurrencyProvider } from './context/CurrencyContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'listings', element: <Listings /> },
  { path: 'projects', element: <ProjectsIndex /> },
  { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'legal', element: <Legal /> },
      { path: 'list-your-property', element: <ListYourProperty /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
  { index: true, element: <DealRoom /> },
      { path: 'account', element: <Account /> },
      { path: 'listings/new-projects', element: <ListingsNewProjects /> },
      { path: 'listings/for-sale', element: <ListingsForSale /> },
      { path: 'listings/for-rent', element: <ListingsForRent /> },
      { path: 'crm', element: <CRM /> },
      { path: 'social-media', element: <SocialMedia /> },
      { path: 'team', element: <Team /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'analytics', element: <Analytics /> },
  { path: 'document-vault', element: <DocumentVault /> },
  { path: 'site-admin', element: <SiteAdmin /> },
      {
        path: 'developer',
        element: <DeveloperLayout />,
        children: [
          { index: true, element: <Navigate to="submit-ticket" replace /> },
          { path: 'submit-ticket', element: <SubmitTicket /> },
          { path: 'pending-requests', element: <PendingRequests /> },
          { path: 'updates', element: <DeveloperUpdates /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CurrencyProvider>
      <RouterProvider router={router} />
    </CurrencyProvider>
  </React.StrictMode>,
)
