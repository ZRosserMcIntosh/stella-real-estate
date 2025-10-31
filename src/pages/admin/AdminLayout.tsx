import React from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, isDemo, loading: authLoading, signOut: signOutAuth } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [listingsOpen, setListingsOpen] = React.useState(false)
  const [companyOpen, setCompanyOpen] = React.useState(false)
  const [accountOpen, setAccountOpen] = React.useState(false)
  const [logoFailed, setLogoFailed] = React.useState(false)
  const listingsCloseTimer = React.useRef<NodeJS.Timeout | null>(null)
  const companyCloseTimer = React.useRef<NodeJS.Timeout | null>(null)
  const accountCloseTimer = React.useRef<NodeJS.Timeout | null>(null)
  const handleSignOut = React.useCallback(async () => {
    await signOutAuth()
    navigate('/login')
  }, [signOutAuth, navigate])

  React.useEffect(() => {
    if (authLoading) return
    if (!session && !isDemo) navigate('/login', { replace: true })
  }, [authLoading, session, isDemo, navigate])
  if (authLoading) return null
  if (!session && !isDemo) return null
  
  // Navigation structure with icons
  const navItems = [
    { icon: '📊', label: 'Deal Room', path: '/admin', end: true },
    { icon: '📋', label: 'Listings', submenu: [
      { label: 'New Projects', path: '/admin/listings/new-projects' },
      { label: 'For Sale', path: '/admin/listings/for-sale' },
      { label: 'For Rent', path: '/admin/listings/for-rent' },
    ]},
    { icon: '🏢', label: 'Company', submenu: [
      { label: 'Analytics', path: '/admin/analytics' },
      { label: 'Team', path: '/admin/team' },
      { label: 'Site Admin', path: '/admin/site-admin' },
    ]},
    { icon: '👥', label: 'Constelação', path: '/admin/crm' },
    { icon: '🩰', label: 'Ballet', path: '/admin/ballet' },
    { icon: '📱', label: 'Social Media', path: '/admin/social-media' },
    { icon: '⚙️', label: 'Developer', path: '/admin/developer' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex flex-nowrap items-center gap-2 px-4 py-3 md:gap-6 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            {!logoFailed ? (
              <img
                src="/stella-favicon.png"
                className="h-8 w-auto object-contain"
                alt="Stella"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center text-white text-xs font-bold">S</div>
            )}
            <span className="hidden sm:inline text-sm font-semibold text-slate-900">Stella</span>
          </Link>

          {/* Desktop Navigation - Horizontal tabs */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-6">
            {/* Deal Room */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              📊 Deal Room
            </NavLink>

            {/* Listings Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (listingsCloseTimer.current) clearTimeout(listingsCloseTimer.current)
                setListingsOpen(true)
              }}
              onMouseLeave={() => {
                listingsCloseTimer.current = setTimeout(() => setListingsOpen(false), 200)
              }}
            >
              <button
                type="button"
                onClick={() => setListingsOpen(!listingsOpen)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                  listingsOpen
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                📋 Listings
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${listingsOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {listingsOpen && createPortal(
                <div 
                  className="fixed z-[60] mt-0 w-56 rounded-lg border border-slate-200 bg-white shadow-lg" 
                  style={{top: '56px', left: '180px'}}
                  onMouseEnter={() => {
                    if (listingsCloseTimer.current) clearTimeout(listingsCloseTimer.current)
                  }}
                  onMouseLeave={() => {
                    listingsCloseTimer.current = setTimeout(() => setListingsOpen(false), 200)
                  }}
                >
                  <div className="p-1">
                    <NavLink to="/admin/listings/new-projects" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-100'}`} onClick={() => setListingsOpen(false)}>New Projects</NavLink>
                    <NavLink to="/admin/listings/for-sale" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-100'}`} onClick={() => setListingsOpen(false)}>For Sale</NavLink>
                    <NavLink to="/admin/listings/for-rent" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-100'}`} onClick={() => setListingsOpen(false)}>For Rent</NavLink>
                  </div>
                </div>,
                document.body
              )}
            </div>

            {/* Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (companyCloseTimer.current) clearTimeout(companyCloseTimer.current)
                setCompanyOpen(true)
              }}
              onMouseLeave={() => {
                companyCloseTimer.current = setTimeout(() => setCompanyOpen(false), 200)
              }}
            >
              <button
                type="button"
                onClick={() => setCompanyOpen(!companyOpen)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                  companyOpen
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                🏢 Company
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {companyOpen && createPortal(
                <div 
                  className="fixed z-[60] mt-0 w-56 rounded-lg border border-slate-200 bg-white shadow-lg" 
                  style={{top: '56px', left: '340px'}}
                  onMouseEnter={() => {
                    if (companyCloseTimer.current) clearTimeout(companyCloseTimer.current)
                  }}
                  onMouseLeave={() => {
                    companyCloseTimer.current = setTimeout(() => setCompanyOpen(false), 200)
                  }}
                >
                  <div className="p-1">
                    <NavLink to="/admin/analytics" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-100'}`} onClick={() => setCompanyOpen(false)}>Analytics</NavLink>
                    <NavLink to="/admin/team" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-100'}`} onClick={() => setCompanyOpen(false)}>Team</NavLink>
                    <NavLink to="/admin/site-admin" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-800 hover:bg-slate-100'}`} onClick={() => setCompanyOpen(false)}>Site Admin</NavLink>
                  </div>
                </div>,
                document.body
              )}
            </div>

            {/* Constellation */}
            <NavLink
              to="/admin/crm"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              👥 Constelação
            </NavLink>

            {/* Ballet */}
            <NavLink
              to="/admin/ballet"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              🩰 Ballet
            </NavLink>

            {/* Social Media */}
            <NavLink
              to="/admin/social-media"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              📱 Social
            </NavLink>

            {/* Developer */}
            <NavLink
              to="/admin/developer"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              ⚙️ Dev
            </NavLink>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex shrink-0 items-center gap-2">
            {/* My Account */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
                setAccountOpen(true)
              }}
              onMouseLeave={() => {
                accountCloseTimer.current = setTimeout(() => setAccountOpen(false), 200)
              }}
            >
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 ${
                  accountOpen
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                👤
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${accountOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {accountOpen && (
                <div 
                  className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg" 
                  onMouseEnter={() => {
                    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
                  }}
                  onMouseLeave={() => {
                    accountCloseTimer.current = setTimeout(() => setAccountOpen(false), 200)
                  }}
                >
                  <NavLink to="/admin/account" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-800 hover:bg-slate-50'}`} onClick={() => setAccountOpen(false)}>Edit Account</NavLink>
                  <NavLink to="/admin/calendar" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-800 hover:bg-slate-50'}`} onClick={() => setAccountOpen(false)}>Calendar</NavLink>
                  <NavLink to="/admin/document-vault" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-800 hover:bg-slate-50'}`} onClick={() => setAccountOpen(false)}>Document Vault</NavLink>
                </div>
              )}
            </div>

            {isDemo && (
              <span className="inline-flex items-center rounded-lg border border-amber-300/80 bg-amber-100/80 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Demo
              </span>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={authLoading}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign out
            </button>

            <LanguageSwitcher />
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-800 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              {mobileOpen ? (
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-30 mt-[56px] max-h-[calc(100vh-56px)] overflow-y-auto rounded-b-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="grid gap-2 text-base font-medium">
              <NavLink to="/admin" end onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>📊 Deal Room</NavLink>

              {/* Listings */}
              <div className="rounded-lg border border-slate-200">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-500">📋 Listings</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="/admin/listings/new-projects" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>New Projects</NavLink>
                  <NavLink to="/admin/listings/for-sale" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>For Sale</NavLink>
                  <NavLink to="/admin/listings/for-rent" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>For Rent</NavLink>
                </div>
              </div>

              {/* Company */}
              <div className="rounded-lg border border-slate-200">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-500">🏢 Company</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="/admin/analytics" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Analytics</NavLink>
                  <NavLink to="/admin/team" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Team</NavLink>
                  <NavLink to="/admin/site-admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Site Admin</NavLink>
                </div>
              </div>

              <NavLink to="/admin/crm" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>👥 Constelação</NavLink>
              <NavLink to="/admin/ballet" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>🩰 Ballet</NavLink>
              <NavLink to="/admin/social-media" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>📱 Social Media</NavLink>
              <NavLink to="/admin/developer" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>⚙️ Developer</NavLink>

              {/* My Account */}
              <div className="rounded-lg border border-slate-200">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-500">👤 My Account</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="/admin/account" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Edit Account</NavLink>
                  <NavLink to="/admin/calendar" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Calendar</NavLink>
                  <NavLink to="/admin/document-vault" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Document Vault</NavLink>
                </div>
              </div>

              {isDemo && (
                <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Demo mode · read-only
                </div>
              )}

              <button
                onClick={async () => {
                  setMobileOpen(false)
                  await handleSignOut()
                }}
                className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                disabled={authLoading}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content area - adjusted for fixed header */}
      <div className="pt-20 pb-8 flex-1">
        <div className="container-padded text-slate-900">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
