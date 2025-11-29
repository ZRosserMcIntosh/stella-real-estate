import React from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { useAuth } from '../../context/AuthContext'
import { getSiteSettings } from '../../lib/siteSettings'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, isDemo, loading: authLoading, signOut: signOutAuth } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [listingsOpen, setListingsOpen] = React.useState(false)
  const [companyOpen, setCompanyOpen] = React.useState(false)
  const [accountOpen, setAccountOpen] = React.useState(false)
  const [logoFailed, setLogoFailed] = React.useState(false)
  const [headerLogoUrl, setHeaderLogoUrl] = React.useState<string>('')
  const [logoLoading, setLogoLoading] = React.useState(true)
  const [triggerShootingStar, setTriggerShootingStar] = React.useState(0)
  const listingsCloseTimer = React.useRef<NodeJS.Timeout | null>(null)
  const companyCloseTimer = React.useRef<NodeJS.Timeout | null>(null)
  const accountCloseTimer = React.useRef<NodeJS.Timeout | null>(null)
  const listingsButtonRef = React.useRef<HTMLButtonElement>(null)
  const companyButtonRef = React.useRef<HTMLButtonElement>(null)
  const accountButtonRef = React.useRef<HTMLButtonElement>(null)
  const [listingsButtonLeft, setListingsButtonLeft] = React.useState(0)
  const [companyButtonLeft, setCompanyButtonLeft] = React.useState(0)
  const [accountButtonLeft, setAccountButtonLeft] = React.useState(0)
  const handleSignOut = React.useCallback(async () => {
    await signOutAuth()
    navigate('/admin/login')
  }, [signOutAuth, navigate])

  React.useEffect(() => {
    if (authLoading) return
    if (!session && !isDemo) navigate('/admin/login', { replace: true })
  }, [authLoading, session, isDemo, navigate])

  // Calculate button positions for dropdowns
  React.useEffect(() => {
    const updatePositions = () => {
      if (listingsButtonRef.current) {
        const rect = listingsButtonRef.current.getBoundingClientRect()
        setListingsButtonLeft(rect.left)
      }
      if (companyButtonRef.current) {
        const rect = companyButtonRef.current.getBoundingClientRect()
        setCompanyButtonLeft(rect.left)
      }
      if (accountButtonRef.current) {
        const rect = accountButtonRef.current.getBoundingClientRect()
        setAccountButtonLeft(rect.left)
      }
    }
    
    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [])

  // Load header logo from settings (same as retail header)
  React.useEffect(() => {
    let cancelled = false
    const loadHeaderLogo = async () => {
      try {
        const settings = await getSiteSettings(['header_logo_url'])
        if (cancelled) return
        if (settings.header_logo_url) {
          setHeaderLogoUrl(settings.header_logo_url)
        } else {
          setHeaderLogoUrl('/stella-logo.png')
        }
      } catch (error) {
        console.error('Failed to load header logo, using local fallback:', error)
        if (!cancelled) {
          setHeaderLogoUrl('/stella-logo.png')
          setLogoFailed(false)
        }
      } finally {
        if (!cancelled) {
          setLogoLoading(false)
        }
      }
    }
    loadHeaderLogo()
    return () => {
      cancelled = true
    }
  }, [])

  if (authLoading) return null
  if (!session && !isDemo) return null
  
  // Navigation structure with icons
  const navItems = [
    { icon: <img src="/admin-icons/deals.png" alt="" className="w-5 h-5" />, label: 'Home', path: '/admin', end: true },
    { icon: <img src="/admin-icons/for-sale.png" alt="" className="w-5 h-5" />, label: 'Listings', submenu: [
      { label: 'New Projects', path: '/admin/listings/new-projects' },
      { label: 'For Sale', path: '/admin/listings/for-sale' },
      { label: 'For Rent', path: '/admin/listings/for-rent' },
    ]},
    { icon: <img src="/admin-icons/stars.png" alt="" className="w-5 h-5" />, label: 'Constelação', submenu: [
      { label: 'Dashboard', path: '/admin/crm' },
      { label: 'Pipeline', path: '/admin/crm?tab=pipeline' },
      { label: 'Contacts & Accounts', path: '/admin/crm?tab=contacts' },
      { label: 'Deals', path: '/admin/crm?tab=deals' },
      { label: 'Social Media', path: '/admin/social-media' },
      { label: 'Marketing', path: '/admin/crm?tab=marketing' },
      { label: 'Analytics', path: '/admin/analytics' },
    ]},
    { icon: <img src="/ballet-new-logo.png" alt="" className="w-5 h-5" />, label: 'Ballet', submenu: [
      { label: 'Projects', path: '/admin/ballet' },
      { label: 'My Tasks', path: '/admin/ballet?view=my-tasks' },
      { label: 'Calendar', path: '/admin/calendar' },
      { label: 'Team Workload', path: '/admin/team' },
    ]},
    { icon: <img src="/admin-icons/company.png" alt="" className="w-5 h-5" />, label: 'Company', submenu: [
      { label: 'Team', path: '/admin/team' },
      { label: 'Site Admin', path: '/admin/site-admin' },
      { label: 'Website Builder', path: '/admin/website-builder' },
    ]},
    { icon: '⚙️', label: 'Developer', path: '/admin/developer' },
    { icon: '💜', label: 'Rosser & Stella', path: '/admin/rosser-stella' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Shooting Star Animation Styles */}
      <style>{`
        @keyframes shootingStar {
          0% {
            left: var(--star-start-x, 100%);
            top: var(--star-start-y, 0%);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            left: var(--star-end-x, 0%);
            top: var(--star-end-y, 66%);
            opacity: 0;
          }
        }
        
        .shooting-star {
          animation: shootingStar 0.4s ease-in 0s 1 forwards;
          width: 2px;
          height: 2px;
          position: absolute;
          --star-start-x: 100%;
          --star-start-y: 0%;
          --star-end-x: 0%;
          --star-end-y: 110%;
          --tail-angle: -33deg;
        }
        
        .shooting-star::before {
          content: '';
          position: absolute;
          width: 80px;
          height: 2px;
          background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
          transform: rotate(var(--tail-angle));
          transform-origin: left center;
          box-shadow: 0 0 8px rgba(255,255,255,0.6);
        }
        
        .shooting-star::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0) 100%);
          box-shadow: 0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.5);
          top: -1px;
          left: -1px;
        }
      `}</style>

      {/* Shooting Star Effect Container */}
      {triggerShootingStar > 0 && (
        <div key={triggerShootingStar} className="shooting-star-container fixed inset-0 pointer-events-none z-[100]">
          <div className="shooting-star"></div>
        </div>
      )}

      {/* Ambient Glow Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl" />
      </div>
      
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-lg">
        <div className="flex flex-nowrap items-center gap-2 px-4 py-3 md:gap-6 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
            {!logoLoading && !logoFailed && headerLogoUrl ? (
              <img
                src={headerLogoUrl}
                className="w-auto object-contain drop-shadow-sm"
                style={{ height: '73.6px' }}
                alt="Stella"
                onError={() => setLogoFailed(true)}
              />
            ) : logoLoading ? (
              <div className="rounded-full bg-slate-700 animate-pulse" style={{ height: '73.6px', width: '73.6px' }} />
            ) : (
              <div className="rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 grid place-items-center text-white text-sm font-bold" style={{ height: '73.6px', width: '73.6px' }}>S</div>
            )}
          </Link>

          {/* Desktop Navigation - Horizontal tabs */}
          <nav className="hidden md:flex items-center gap-1 flex-1 ml-6">
            {/* Deal Room */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <img src="/admin-icons/deals.png" alt="" className="w-5 h-5" />
              <span>Deal Room</span>
            </NavLink>

            {/* Listings Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (listingsCloseTimer.current) clearTimeout(listingsCloseTimer.current)
                if (listingsButtonRef.current) {
                  const rect = listingsButtonRef.current.getBoundingClientRect()
                  setListingsButtonLeft(rect.left)
                }
                setListingsOpen(true)
              }}
              onMouseLeave={() => {
                listingsCloseTimer.current = setTimeout(() => setListingsOpen(false), 200)
              }}
            >
              <button
                ref={listingsButtonRef}
                type="button"
                onClick={() => setListingsOpen(!listingsOpen)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  listingsOpen
                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <img src="/admin-icons/for-sale.png" alt="" className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span>Listings</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-3 w-3 transition-transform ${listingsOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
              {listingsOpen && createPortal(
                <div 
                  className="fixed z-[60] mt-0 w-56 rounded-lg border border-slate-700/80 bg-slate-800/98 backdrop-blur-lg shadow-2xl shadow-slate-950/70" 
                  style={{top: '100px', left: `${listingsButtonLeft}px`}}
                  onMouseEnter={() => {
                    if (listingsCloseTimer.current) clearTimeout(listingsCloseTimer.current)
                  }}
                  onMouseLeave={() => {
                    listingsCloseTimer.current = setTimeout(() => setListingsOpen(false), 200)
                  }}
                >
                  <div className="p-1">
                    <NavLink to="/admin/listings/new-projects" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setListingsOpen(false)}>New Projects</NavLink>
                    <NavLink to="/admin/listings/for-sale" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setListingsOpen(false)}>For Sale</NavLink>
                    <NavLink to="/admin/listings/for-rent" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setListingsOpen(false)}>For Rent</NavLink>
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
                if (companyButtonRef.current) {
                  const rect = companyButtonRef.current.getBoundingClientRect()
                  setCompanyButtonLeft(rect.left)
                }
                setCompanyOpen(true)
              }}
              onMouseLeave={() => {
                companyCloseTimer.current = setTimeout(() => setCompanyOpen(false), 200)
              }}
            >
              <button
                ref={companyButtonRef}
                type="button"
                onClick={() => setCompanyOpen(!companyOpen)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  companyOpen
                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <img src="/admin-icons/company.png" alt="" className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <span>Company</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-3 w-3 transition-transform ${companyOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
              {companyOpen && createPortal(
                <div 
                  className="fixed z-[60] mt-0 w-56 rounded-lg border border-slate-700/80 bg-slate-800/98 backdrop-blur-lg shadow-2xl shadow-slate-950/70" 
                  style={{top: '100px', left: `${companyButtonLeft}px`}}
                  onMouseEnter={() => {
                    if (companyCloseTimer.current) clearTimeout(companyCloseTimer.current)
                  }}
                  onMouseLeave={() => {
                    companyCloseTimer.current = setTimeout(() => setCompanyOpen(false), 200)
                  }}
                >
                  <div className="p-1">
                    <NavLink to="/admin/analytics" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setCompanyOpen(false)}>Analytics</NavLink>
                    <NavLink to="/admin/team" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setCompanyOpen(false)}>Team</NavLink>
                    <NavLink to="/admin/site-admin" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setCompanyOpen(false)}>Site Admin</NavLink>
                    <NavLink to="/admin/website-builder" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/30 text-indigo-200' : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'}`} onClick={() => setCompanyOpen(false)}>Website Builder</NavLink>
                  </div>
                </div>,
                document.body
              )}
            </div>

            {/* Constellation */}
            <NavLink
              to="/admin/crm"
              end
              onMouseEnter={() => setTriggerShootingStar(Date.now())}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/30 border border-emerald-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <img src="/admin-icons/stars.png" alt="" className="w-5 h-5" />
              <span>Constelação</span>
            </NavLink>

            {/* Ballet */}
            <NavLink
              to="/admin/ballet"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-pink-600/90 text-white shadow-lg shadow-pink-500/30 border border-pink-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <img src="/ballet-new-logo.png" alt="" className="w-5 h-5" />
              <span>Ballet</span>
            </NavLink>

            {/* Social Media */}
            <NavLink
              to="/admin/social-media"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-violet-600/90 text-white shadow-lg shadow-violet-500/30 border border-violet-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <img src="/admin-icons/iphone.png" alt="" className="w-5 h-5" />
              <span>Social</span>
            </NavLink>

            {/* Website Builder */}
            <NavLink
              to="/admin/website-builder"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-orange-600/90 text-white shadow-lg shadow-orange-500/30 border border-orange-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <span className="text-lg">🌐</span>
              <span className="whitespace-nowrap">Website Builder</span>
            </NavLink>

            {/* Developer */}
            <NavLink
              to="/admin/developer"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-slate-700/90 text-white shadow-lg shadow-slate-600/30 border border-slate-600/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <span className="text-lg">⚙️</span>
              <span>Dev</span>
            </NavLink>

            {/* Rosser & Stella */}
            <NavLink
              to="/admin/rosser-stella"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-xs font-medium transition-colors flex flex-col items-center gap-1 min-w-[80px] ${
                  isActive
                    ? 'bg-amber-600/90 text-white shadow-lg shadow-amber-500/30 border border-amber-500/40'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <span className="text-2xl">🤍</span>
              <span className="whitespace-nowrap">Rosser & Stella</span>
            </NavLink>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex shrink-0 items-center gap-2">
            {/* My Account */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
                if (accountButtonRef.current) {
                  const rect = accountButtonRef.current.getBoundingClientRect()
                  setAccountButtonLeft(rect.left)
                }
                setAccountOpen(true)
              }}
              onMouseLeave={() => {
                accountCloseTimer.current = setTimeout(() => setAccountOpen(false), 200)
              }}
            >
              <button
                ref={accountButtonRef}
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 ${
                  accountOpen
                    ? 'bg-slate-700/90 text-white shadow-lg shadow-slate-600/30'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                👤
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${accountOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              {accountOpen && (
                <div 
                  className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-700/80 bg-slate-800/98 backdrop-blur-lg p-1 shadow-2xl shadow-slate-950/70" 
                  onMouseEnter={() => {
                    if (accountCloseTimer.current) clearTimeout(accountCloseTimer.current)
                  }}
                  onMouseLeave={() => {
                    accountCloseTimer.current = setTimeout(() => setAccountOpen(false), 200)
                  }}
                >
                  <NavLink to="/admin/account" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setAccountOpen(false)}>Edit Account</NavLink>
                  <NavLink to="/admin/calendar" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setAccountOpen(false)}>Calendar</NavLink>
                  <NavLink to="/admin/document-vault" className={({ isActive }) => `block rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`} onClick={() => setAccountOpen(false)}>Document Vault</NavLink>
                </div>
              )}
            </div>

            {isDemo && (
              <span className="inline-flex items-center rounded-lg border border-amber-400/50 bg-amber-500/15 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
                Demo
              </span>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={authLoading}
              className="inline-flex items-center rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-sm font-medium text-slate-200 hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 hover:shadow-lg hover:shadow-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 transition-all"
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
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-800/50 dark:text-slate-800 md:hidden"
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
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-30 mt-[56px] max-h-[calc(100vh-56px)] overflow-y-auto rounded-b-2xl border border-slate-800/80 bg-slate-900/98 backdrop-blur-lg p-3 shadow-2xl shadow-slate-950/70">
            <div className="grid gap-2 text-base font-medium">
              <NavLink to="/admin" end onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-800/60 hover:text-slate-50'}`}><img src="/admin-icons/deals.png" alt="" className="w-4 h-4 inline-block mr-1.5" /> Deal Room</NavLink>

              {/* Listings */}
              <div className="rounded-lg border border-slate-700/80">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-300"><img src="/admin-icons/for-sale.png" alt="" className="w-4 h-4 inline-block mr-1.5" /> Listings</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="/admin/listings/new-projects" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>New Projects</NavLink>
                  <NavLink to="/admin/listings/for-sale" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>For Sale</NavLink>
                  <NavLink to="/admin/listings/for-rent" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>For Rent</NavLink>
                </div>
              </div>

              {/* Company */}
              <div className="rounded-lg border border-slate-700/80">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-300"><img src="/admin-icons/company.png" alt="" className="w-4 h-4 inline-block mr-1.5" /> Company</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="/admin/analytics" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Analytics</NavLink>
                  <NavLink to="/admin/team" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Team</NavLink>
                  <NavLink to="/admin/site-admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Site Admin</NavLink>
                  <NavLink to="/admin/website-builder" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Website Builder</NavLink>
                </div>
              </div>

              <NavLink to="/admin/crm" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-emerald-600/40 text-emerald-100' : 'text-slate-200 hover:bg-slate-800/60 hover:text-slate-50'}`}><img src="/admin-icons/stars.png" alt="" className="w-4 h-4 inline-block mr-1.5" /> Constelação</NavLink>
              <NavLink to="/admin/ballet" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-pink-600/40 text-pink-100' : 'text-slate-200 hover:bg-slate-800/60 hover:text-slate-50'}`}>
                <img src="/ballet-new-logo.png" alt="" className="w-5 h-5 inline-block mr-2" />
                Ballet
              </NavLink>
              <NavLink to="/admin/social-media" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-violet-600/40 text-violet-100' : 'text-slate-200 hover:bg-slate-800/60 hover:text-slate-50'}`}><img src="/admin-icons/iphone.png" alt="" className="w-4 h-4 inline-block mr-1.5" /> Social Media</NavLink>
              <NavLink to="/admin/developer" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-slate-700/40 text-slate-50' : 'text-slate-200 hover:bg-slate-800/60 hover:text-slate-50'}`}>⚙️ Developer</NavLink>
              <NavLink to="/admin/rosser-stella" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 transition-colors ${isActive ? 'bg-amber-600/40 text-amber-100' : 'text-slate-200 hover:bg-slate-800/60 hover:text-slate-50'}`}>💼 Rosser & Stella</NavLink>

              {/* My Account */}
              <div className="rounded-lg border border-slate-700/80">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-300">👤 My Account</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="/admin/account" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Edit Account</NavLink>
                  <NavLink to="/admin/calendar" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Calendar</NavLink>
                  <NavLink to="/admin/document-vault" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600/40 text-indigo-100' : 'text-slate-200 hover:bg-slate-700/60 hover:text-slate-50'}`}>Document Vault</NavLink>
                </div>
              </div>

              {isDemo && (
                <div className="mt-2 rounded-lg border border-amber-400/50 bg-amber-500/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
                  Demo mode · read-only
                </div>
              )}

              <button
                onClick={async () => {
                  setMobileOpen(false)
                  await handleSignOut()
                }}
                className="mt-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                disabled={authLoading}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content area - adjusted for fixed header */}
      <div className="pt-24 pb-8 flex-1">
        <div className={location.pathname === '/admin/ballet' ? 'text-slate-100' : 'container-padded text-slate-100'}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
