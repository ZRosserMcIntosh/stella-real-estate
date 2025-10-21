import React from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
  const listingsRef = React.useRef<HTMLDivElement | null>(null)
  const companyRef = React.useRef<HTMLDivElement | null>(null)
  const accountRef = React.useRef<HTMLDivElement | null>(null)
  const listingsButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const companyButtonRef = React.useRef<HTMLButtonElement | null>(null)
  const [listingsMenuPos, setListingsMenuPos] = React.useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const [companyMenuPos, setCompanyMenuPos] = React.useState<{ left: number; top: number }>({ left: 0, top: 0 })
  const listingsCloseTimer = React.useRef<number | null>(null)
  const companyCloseTimer = React.useRef<number | null>(null)
  const accountCloseTimer = React.useRef<number | null>(null)
  const listingsActive = location.pathname.startsWith('/admin/listings/')
  const companyActive =
    location.pathname.startsWith('/admin/analytics') ||
    location.pathname.startsWith('/admin/team') ||
    location.pathname.startsWith('/admin/site-admin')
  const accountActive =
    location.pathname.startsWith('/admin/account') ||
    location.pathname.startsWith('/admin/calendar') ||
    location.pathname.startsWith('/admin/document-vault')
  const handleSignOut = React.useCallback(async () => {
    await signOutAuth()
    navigate('/login')
  }, [signOutAuth, navigate])

  React.useEffect(() => {
    if (authLoading) return
    if (!session && !isDemo) navigate('/login', { replace: true })
  }, [authLoading, session, isDemo, navigate])

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (listingsRef.current && !listingsRef.current.contains(target)) {
        setListingsOpen(false)
      }
      if (companyRef.current && !companyRef.current.contains(target)) {
        setCompanyOpen(false)
      }
      if (accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // Helper to position dropdowns as fixed overlays (avoid clipping by scroller)
  const positionMenu = React.useCallback((btn: HTMLButtonElement | null, setPos: (p: { left: number; top: number }) => void) => {
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const menuWidth = 224 // w-56 = 14rem = 224px
    const margin = 8
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - menuWidth - margin))
    const top = rect.bottom + 8
    setPos({ left, top })
  }, [])

  React.useEffect(() => {
    if (!listingsOpen) return
    const handler = () => positionMenu(listingsButtonRef.current, setListingsMenuPos)
    handler()
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('scroll', handler)
    }
  }, [listingsOpen, positionMenu])

  React.useEffect(() => {
    if (!companyOpen) return
    const handler = () => positionMenu(companyButtonRef.current, setCompanyMenuPos)
    handler()
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      window.removeEventListener('resize', handler)
      window.removeEventListener('scroll', handler)
    }
  }, [companyOpen, positionMenu])
  if (authLoading) return null
  if (!session && !isDemo) return null
  return (
    <div className="min-h-screen bg-white">
  {/* Clean admin header */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-padded flex flex-nowrap items-center gap-3 py-3 md:gap-6">
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
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto overflow-y-visible px-2 text-sm font-medium no-scrollbar md:-mx-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-800 hover:bg-brand-600 hover:text-white'
                }`
              }
            >
              Deal Room
            </NavLink>
            {/* Listings dropdown */}
            <div
              ref={listingsRef}
              className="relative"
              onMouseEnter={() => {
                if (listingsCloseTimer.current) {
                  window.clearTimeout(listingsCloseTimer.current)
                  listingsCloseTimer.current = null
                }
                setListingsOpen(true)
              }}
              onMouseLeave={() => {
                if (listingsCloseTimer.current) window.clearTimeout(listingsCloseTimer.current)
                listingsCloseTimer.current = window.setTimeout(() => setListingsOpen(false), 220)
              }}
            >
              <button
                ref={listingsButtonRef}
                type="button"
                onClick={() => setListingsOpen((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-center whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
                  listingsActive || listingsOpen
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-800 hover:bg-brand-600 hover:text-white'
                }`}
              >
                Listings
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform ${
                    listingsOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {listingsOpen && createPortal(
                <div
                  style={{ position: 'fixed', left: `${listingsMenuPos.left}px`, top: `${listingsMenuPos.top}px` }}
                  className="z-[60] w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                  onMouseEnter={() => {
                    if (listingsCloseTimer.current) {
                      window.clearTimeout(listingsCloseTimer.current)
                      listingsCloseTimer.current = null
                    }
                  }}
                  onMouseLeave={() => {
                    if (listingsCloseTimer.current) window.clearTimeout(listingsCloseTimer.current)
                    listingsCloseTimer.current = window.setTimeout(() => setListingsOpen(false), 220)
                  }}
                >
                  <NavLink
                    to="listings/new-projects"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`
                    }
                    onClick={() => setListingsOpen(false)}
                  >
                    New Projects
                  </NavLink>
                  <NavLink
                    to="listings/for-sale"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`
                    }
                    onClick={() => setListingsOpen(false)}
                  >
                    For Sale
                  </NavLink>
                  <NavLink
                    to="listings/for-rent"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`
                    }
                    onClick={() => setListingsOpen(false)}
                  >
                    For Rent
                  </NavLink>
                </div>,
                document.body
              )}
            </div>
            {/* Company dropdown */}
            <div
              ref={companyRef}
              className="relative"
              onMouseEnter={() => {
                if (companyCloseTimer.current) {
                  window.clearTimeout(companyCloseTimer.current)
                  companyCloseTimer.current = null
                }
                setCompanyOpen(true)
              }}
              onMouseLeave={() => {
                if (companyCloseTimer.current) window.clearTimeout(companyCloseTimer.current)
                companyCloseTimer.current = window.setTimeout(() => setCompanyOpen(false), 220)
              }}
            >
              <button
                ref={companyButtonRef}
                type="button"
                onClick={() => setCompanyOpen((v) => !v)}
                className={`px-3 py-1.5 rounded-lg text-center whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
                  companyActive || companyOpen
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-800 hover:bg-brand-600 hover:text-white'
                }`}
              >
                Company
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform ${
                    companyOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {companyOpen && createPortal(
                <div
                  style={{ position: 'fixed', left: `${companyMenuPos.left}px`, top: `${companyMenuPos.top}px` }}
                  className="z-[60] w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                  onMouseEnter={() => {
                    if (companyCloseTimer.current) {
                      window.clearTimeout(companyCloseTimer.current)
                      companyCloseTimer.current = null
                    }
                  }}
                  onMouseLeave={() => {
                    if (companyCloseTimer.current) window.clearTimeout(companyCloseTimer.current)
                    companyCloseTimer.current = window.setTimeout(() => setCompanyOpen(false), 220)
                  }}
                >
                  <NavLink
                    to="analytics"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`
                    }
                    onClick={() => setCompanyOpen(false)}
                  >
                    Analytics
                  </NavLink>
                  <NavLink
                    to="team"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`
                    }
                    onClick={() => setCompanyOpen(false)}
                  >
                    Team
                  </NavLink>
                  <NavLink
                    to="site-admin"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`
                    }
                    onClick={() => setCompanyOpen(false)}
                  >
                    Site Admin
                  </NavLink>
                </div>,
                document.body
              )}
            </div>
            <NavLink
              to="crm"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-800 hover:bg-brand-600 hover:text-white'
                }`
              }
            >
              CRM
            </NavLink>
            <NavLink
              to="social-media"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-800 hover:bg-brand-600 hover:text-white'
                }`
              }
            >
              Social Media
            </NavLink>
            <NavLink
              to="developer"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-800 hover:bg-brand-600 hover:text-white'
                }`
              }
            >
              Developer
            </NavLink>
          </div>
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {/* My Account dropdown */}
            <div
              ref={accountRef}
              className="relative"
              onMouseEnter={() => {
                if (accountCloseTimer.current) {
                  window.clearTimeout(accountCloseTimer.current)
                  accountCloseTimer.current = null
                }
                setAccountOpen(true)
              }}
              onMouseLeave={() => {
                if (accountCloseTimer.current) window.clearTimeout(accountCloseTimer.current)
                accountCloseTimer.current = window.setTimeout(() => setAccountOpen(false), 220)
              }}
            >
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 ${
                  accountActive || accountOpen
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                My Account
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 transition-transform ${
                    accountOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {accountOpen && (
                <div
                  className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                  onMouseEnter={() => {
                    if (accountCloseTimer.current) {
                      window.clearTimeout(accountCloseTimer.current)
                      accountCloseTimer.current = null
                    }
                  }}
                  onMouseLeave={() => {
                    if (accountCloseTimer.current) window.clearTimeout(accountCloseTimer.current)
                    accountCloseTimer.current = window.setTimeout(() => setAccountOpen(false), 220)
                  }}
                >
                  <NavLink
                    to="account"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`
                    }
                    onClick={() => setAccountOpen(false)}
                  >
                    Edit Account
                  </NavLink>
                  <NavLink
                    to="calendar"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`
                    }
                    onClick={() => setAccountOpen(false)}
                  >
                    Calendar
                  </NavLink>
                  <NavLink
                    to="document-vault"
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`
                    }
                    onClick={() => setAccountOpen(false)}
                  >
                    Document Vault
                  </NavLink>
                </div>
              )}
            </div>
            {isDemo && (
              <span className="hidden md:inline-flex items-center rounded-lg border border-amber-300/80 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                Demo mode · read-only
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
        </div>
      </div>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-50 mt-[56px] max-h-[calc(100vh-56px)] overflow-y-auto rounded-b-2xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="grid gap-2 text-base font-medium">
              <NavLink to="/admin" end onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Deal Room</NavLink>
              {/* Listings sub-links */}
              <div className="rounded-lg border border-slate-200">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-500">Listings</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="listings/new-projects" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>New Projects</NavLink>
                  <NavLink to="listings/for-sale" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>For Sale</NavLink>
                  <NavLink to="listings/for-rent" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>For Rent</NavLink>
                </div>
              </div>
              {/* Company sub-links */}
              <div className="rounded-lg border border-slate-200">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-500">Company</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="analytics" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Analytics</NavLink>
                  <NavLink to="team" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Team</NavLink>
                  <NavLink to="site-admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Site Admin</NavLink>
                </div>
              </div>
              <NavLink to="crm" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>CRM</NavLink>
              <NavLink to="social-media" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Social Media</NavLink>
              <NavLink to="developer" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-2 ${isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100'}`}>Developer</NavLink>
              {/* Account sub-links */}
              <div className="rounded-lg border border-slate-200">
                <div className="px-3 py-2 text-xs font-semibold uppercase text-slate-500">My Account</div>
                <div className="grid gap-1 p-2">
                  <NavLink to="account" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Edit Account</NavLink>
                  <NavLink to="calendar" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Calendar</NavLink>
                  <NavLink to="document-vault" onClick={() => setMobileOpen(false)} className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'}`}>Document Vault</NavLink>
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

  {/* Content */}
  <div className="container-padded pt-20 pb-8 text-slate-900">
        <Outlet />
      </div>
    </div>
  )
}
