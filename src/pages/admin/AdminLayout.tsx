import React from 'react'
import { createPortal } from 'react-dom'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { supabase } from '../../lib/supabaseClient'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
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
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      navigate('/login')
    }
  }
  return (
    <div className="min-h-screen bg-white">
  {/* Clean admin header */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container-padded flex flex-nowrap items-center gap-4 py-3 md:gap-6">
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
          <div className="flex shrink-0 items-center gap-3">
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
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Sign out
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

  {/* Content */}
  <div className="container-padded pt-20 pb-8 text-slate-900">
        <Outlet />
      </div>
    </div>
  )
}
