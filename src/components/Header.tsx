import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { supabase } from '../lib/supabaseClient'
import { trackEvent } from '../lib/telemetry'
import { getSiteSettings } from '../lib/siteSettings'
import { ConstellationUrls } from '../utils/constellationUrl'

type ProjectLite = {
  id: string
  title: string
  city: string | null
  state_code: string | null
  media: Array<{ kind: string; url: string }>
}

export default function Header() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const [hoverOpen, setHoverOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectLite[]>([])
  const [loading, setLoading] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [headerLogoUrl, setHeaderLogoUrl] = useState<string>('')
  const [headerLogoSize, setHeaderLogoSize] = useState<string>('medium')
  const [logoLoading, setLogoLoading] = useState(true)
  const [institutionalOpen, setInstitutionalOpen] = useState(false)
  const [institutionalClosing, setInstitutionalClosing] = useState(false)
  const [projectsClosing, setProjectsClosing] = useState(false)
  const [constellationOpen, setConstellationOpen] = useState(false)
  const [constellationClosing, setConstellationClosing] = useState(false)
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)
  const [loginDropdownClosing, setLoginDropdownClosing] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [institutionalButtonCenter, setInstitutionalButtonCenter] = React.useState<number>(0)
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null)
  const headerRef = React.useRef<HTMLHeadElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const institutionalButtonRef = React.useRef<HTMLButtonElement>(null)
  const constellationButtonRef = React.useRef<HTMLButtonElement>(null)
  const loginButtonRef = React.useRef<HTMLButtonElement>(null)
  const [buttonCenter, setButtonCenter] = React.useState<number>(0)
  const [constellationButtonCenter, setConstellationButtonCenter] = React.useState<number>(0)
  const [loginButtonCenter, setLoginButtonCenter] = React.useState<number>(0)
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const handleSignupClick = React.useCallback(() => {
    trackEvent('signup_cta_click', { position: 'header' })
  }, [])

  // Handle login button clicks - redirect to dashboard if already authenticated
  const handleConstellationLogin = React.useCallback((e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault()
      const dashboardUrl = ConstellationUrls.dashboard()
      // Check if cross-domain redirect is needed
      if (dashboardUrl.startsWith('http')) {
        window.location.href = dashboardUrl
      } else {
        navigate(dashboardUrl)
      }
    }
  }, [isAuthenticated, navigate])

  const handleAdminLogin = React.useCallback((e: React.MouseEvent) => {
    if (isAuthenticated) {
      e.preventDefault()
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  // Handle sign out
  const handleSignOut = React.useCallback(async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUserEmail(null)
    // Close dropdown
    setLoginDropdownClosing(true)
    setTimeout(() => {
      setLoginDropdownOpen(false)
      setLoginDropdownClosing(false)
    }, 350)
  }, [])

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight
        document.documentElement.style.setProperty('--header-height', `${height}px`)
      }
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setButtonCenter(rect.left + rect.width / 2)
      }
    }
    updateHeaderHeight()
    if (institutionalButtonRef.current) {
      const rect = institutionalButtonRef.current.getBoundingClientRect()
      setInstitutionalButtonCenter(rect.left + rect.width / 2)
    }
    if (constellationButtonRef.current) {
      const rect = constellationButtonRef.current.getBoundingClientRect()
      setConstellationButtonCenter(rect.left + rect.width / 2)
    }
    if (loginButtonRef.current) {
      const rect = loginButtonRef.current.getBoundingClientRect()
      setLoginButtonCenter(rect.left + rect.width / 2)
    }
    window.addEventListener('resize', updateHeaderHeight)
    window.addEventListener('scroll', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
      window.removeEventListener('scroll', updateHeaderHeight)
    }
  }, [])

  // Check authentication state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setUserEmail(session?.user?.email || null)
    }
    
    checkAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setUserEmail(session?.user?.email || null)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!(import.meta as any).env?.VITE_SUPABASE_URL) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id,title,city,state_code,media')
          .eq('listing_type', 'new_project')
          .neq('status', 'archived')
          .order('created_at', { ascending: false })
          .limit(4)
        if (error) throw error
        if (!cancelled) setProjects((data || []) as any)
      } catch {
        if (!cancelled) setProjects([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])
  
  // Load header logo from settings
  useEffect(() => {
    let cancelled = false
    const loadHeaderLogo = async () => {
      try {
        const settings = await getSiteSettings(['header_logo_url', 'header_logo_size'])
        if (cancelled) return
        console.log('Header logo settings loaded:', settings)
        if (settings.header_logo_url) {
          console.log('Using header logo from Supabase:', settings.header_logo_url)
          setHeaderLogoUrl(settings.header_logo_url)
        } else {
          console.log('No header logo in Supabase, using local fallback: /stella-logo.png')
          setHeaderLogoUrl('/stella-logo.png')
        }
        if (settings.header_logo_size) {
          setHeaderLogoSize(settings.header_logo_size)
          console.log('Header logo size set to:', settings.header_logo_size)
        }
      } catch (error) {
        console.error('Failed to load header logo, using local fallback:', error)
        if (!cancelled) {
          setHeaderLogoUrl('/stella-logo.png')
          setLogoFailed(false) // Don't mark as failed since we have fallback
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
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [location.pathname])

  // Dynamic sizing based on header_logo_size setting
  // Using more dramatic size differences and minimal padding
  const logoSizeConfig = {
    small: {
      height: 'h-10',           // 40px - compact
      padding: 'py-1.5'         // minimal padding
    },
    medium: {
      height: 'h-14',           // 56px - standard  
      padding: 'py-2'           // small padding
    },
    large: {
      height: 'h-16',           // 64px - prominent
      padding: 'py-2.5'         // moderate padding
    }
  }
  
  const currentLogoSize = logoSizeConfig[headerLogoSize as keyof typeof logoSizeConfig] || logoSizeConfig.medium
  
  // Debug: log what size is being applied
  console.log('Current headerLogoSize state:', headerLogoSize)
  console.log('Current logo height class:', currentLogoSize.height)

  return (
  <header ref={headerRef} className="z-50 bg-slate-900 border-b border-slate-800">
      {/* Use wider container on desktop for more breathing room */}
      <div className={`max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between ${currentLogoSize.padding}`}>
        {/* Logo with increased size on desktop */}
        <Link to="/" className="flex items-center gap-3 pr-6 xl:pr-10 2xl:pr-12">
          {!logoLoading && !logoFailed && headerLogoUrl ? (
            <img
              src={headerLogoUrl}
              className={`${currentLogoSize.height} xl:h-16 2xl:h-[4.5rem] w-auto object-contain drop-shadow-sm transition-all duration-300`}
              alt={t('header.brand') as string}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/stella-logo.png') {
                  console.log('Header logo failed to load, trying fallback: /stella-logo.png');
                  target.src = '/stella-logo.png';
                } else {
                  console.log('Fallback logo also failed, showing placeholder');
                  setLogoFailed(true);
                }
              }}
            />
          ) : logoLoading ? (
            <div className={`${currentLogoSize.height} xl:h-16 2xl:h-[4.5rem] aspect-square rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse`} />
          ) : (
            <div 
              className={`${currentLogoSize.height} xl:h-16 2xl:h-[4.5rem] aspect-square rounded-full bg-gradient-to-br from-brand-400 to-brand-700 shadow-soft grid place-items-center text-white transition-all duration-300`}
            >
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide leading-3 text-center">
                <div>STELLA</div>
                <div>LOGO</div>
              </div>
            </div>
          )}
        </Link>
        
        {/* Mobile Login Button - Only visible on mobile */}
        <div className="sm:hidden">
          <Link
            to="/mobile/logins"
            className="flex items-center gap-2 px-3 py-1.5 text-[#C9B382] hover:text-[#d4c295] border border-[#C9B382]/30 hover:border-[#C9B382]/50 rounded-lg transition-all duration-300 text-xs font-medium whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
            {isAuthenticated ? t('header.myAccount').toUpperCase() : t('header.signIn').toUpperCase()}
          </Link>
        </div>
  {/* Desktop nav with more spacing on larger screens */}
  <nav className="hidden sm:flex items-center gap-3 xl:gap-4 2xl:gap-5 text-sm font-medium">
        <style>{`
          
          @keyframes waveBlur {
            0% {
              filter: blur(0px);
            }
            50% {
              filter: blur(2px);
            }
            100% {
              filter: blur(2px);
            }
          }
          
          @keyframes dropdownRollout {
            from {
              opacity: 0;
              transform: translate(-50%, -8px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
          @keyframes dropdownSlideUp {
            from {
              opacity: 1;
              transform: translate(-50%, 0);
            }
            to {
              opacity: 0;
              transform: translate(-50%, -100%);
            }
          }
          @keyframes dropdownSlideUpFast {
            from {
              opacity: 1;
              transform: translate(-50%, 0);
            }
            to {
              opacity: 0;
              transform: translate(-50%, -100%);
            }
          }
          .dropdown-menu {
            animation: dropdownRollout 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin-top: 0;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }
          .dropdown-menu.closing {
            animation: dropdownSlideUp 0.35s ease-in forwards;
          }
          .dropdown-menu.closing-fast {
            animation: dropdownSlideUpFast 0.15s ease-in forwards;
          }
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            filter: blur(0px);
          }
          .mirage-button:hover {
            filter: blur(0px);
          }
          .mirage-button.blurred {
            filter: blur(1.5px);
          }
          .dropdown-menu {
            animation: dropdownRollout 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin-top: 0;
            border-radius: 0.75rem;
          }
          .nav-button {
            background: rgba(255, 255, 255, 0.08);
            border: none;
            cursor: pointer;
            padding: 0.4rem 0.8rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            font-size: 0.75rem;
            letter-spacing: 0.4px;
            font-weight: 300;
            text-transform: uppercase;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.375rem;
            color: #ffffff;
            height: 32px;
            min-width: fit-content;
          }
          .nav-button:hover {
            background: rgba(201, 179, 130, 0.18);
            box-shadow: 0 8px 32px 0 rgba(201, 179, 130, 0.25);
            color: #C9B382;
          }
          .nav-button:active {
            background: rgba(201, 179, 130, 0.25);
            color: #C9B382;
          }
          @media (prefers-color-scheme: dark) {
            .nav-button {
              background: rgba(255, 255, 255, 0.05);
            }
            .nav-button:hover {
              background: rgba(201, 179, 130, 0.12);
              box-shadow: 0 8px 32px 0 rgba(201, 179, 130, 0.18);
              color: #C9B382;
            }
            .nav-button:active {
              background: rgba(201, 179, 130, 0.18);
              color: #C9B382;
            }
          }
          .cta-button {
            background: rgba(255, 255, 255, 0.08);
            border: none;
            cursor: pointer;
            padding: 0.4rem 0.8rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            font-size: 0.75rem;
            letter-spacing: 0.4px;
            font-weight: 300;
            text-transform: uppercase;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #ffffff;
          }
          .cta-button:hover {
            background: rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          }
          .cta-button:active {
            background: rgba(255, 255, 255, 0.25);
          }
          @media (prefers-color-scheme: dark) {
            .cta-button {
              background: rgba(255, 255, 255, 0.05);
            }
            .cta-button:hover {
              background: rgba(255, 255, 255, 0.12);
              box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.08);
            }
            .cta-button:active {
              background: rgba(255, 255, 255, 0.18);
            }
          }
        `}</style>
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
              }
              if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect()
                setButtonCenter(rect.left + rect.width / 2)
              }
              setHoverOpen(true)
            }}
            onMouseLeave={() => {
              closeTimerRef.current = setTimeout(() => {
                setProjectsClosing(true)
                setTimeout(() => {
                  setHoverOpen(false)
                  setProjectsClosing(false)
                }, 350)
              }, 500)
            }}
          >
            <button 
              ref={buttonRef}
              className="nav-button"
              onClick={() => window.location.href = '/projetos'}
            >
              {t('header.nav.projects').toUpperCase?.() || 'NEW PROJECTS'}
            </button>
            {hoverOpen && (projects.length > 0 || loading) && (
                <div
                  className={`dropdown-menu fixed z-[60] backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.48)] p-2 rounded-xl w-fit min-w-[280px] max-w-[90vw] sm:max-w-[500px] overflow-hidden border border-slate-200/20 dark:border-slate-700/20 ${projectsClosing ? 'closing' : ''}`}
                  style={{ 
                    top: 'calc(var(--header-height, 60px) + 6px)', 
                    left: `${buttonCenter}px`, 
                    transform: 'translateX(-50%)',
                  }}
                  onMouseEnter={() => {
                  if (closeTimerRef.current) {
                    clearTimeout(closeTimerRef.current)
                    closeTimerRef.current = null
                  }
                }}
                onMouseLeave={() => {
                  closeTimerRef.current = setTimeout(() => {
                    setProjectsClosing(true)
                    setTimeout(() => {
                      setHoverOpen(false)
                      setProjectsClosing(false)
                    }, 350)
                  }, 500)
                }}
              >
                <div className="grid grid-cols-1 gap-2">
                  {projects.map((p, index) => {
                    const thumb = (p.media || []).find(m => m.kind === 'thumbnail')?.url || (p.media || [])[0]?.url
                    const slugBase = (p.title || 'project').toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
                    const slug = `${slugBase}-${p.id}`
                    const isHovered = hoveredProjectId === p.id
                    const hasHover = hoveredProjectId !== null
                    
                    // Calculate distance from hovered item for wave effect
                    let waveDistance = 0
                    if (hasHover) {
                      const hoveredIndex = projects.findIndex(proj => proj.id === hoveredProjectId)
                      waveDistance = Math.abs(index - hoveredIndex)
                    }
                    
                    // Determine if this item should show the wave animation
                    const shouldWave = hasHover && !isHovered && waveDistance <= 2
                    const animationDelay = shouldWave ? `${waveDistance * 80}ms` : '0ms'
                    
                    return (
                      <button
                        key={p.id}
                        onClick={() => window.open(`/projetos/${slug}`, '_blank')}
                        onMouseEnter={() => setHoveredProjectId(p.id)}
                        onMouseLeave={() => setHoveredProjectId(null)}
                        style={shouldWave ? { animation: `waveBlur 0.6s ease-in-out ${animationDelay} forwards` } : {}}
                        className={`mirage-button flex items-center gap-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 py-2 pl-2 pr-3 transition-all duration-300 w-full text-left`}
                      >
                        {thumb ? (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img src={thumb} className={`h-11 w-11 rounded-md object-cover flex-none pointer-events-none transition-all duration-300 ${hasHover && !isHovered ? 'blur-xs' : 'blur-none'}`} />
                        ) : (
                          <div className={`h-11 w-11 rounded-md bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-400 text-xs flex-none transition-all duration-300 ${hasHover && !isHovered ? 'blur-xs' : 'blur-none'}`}>No image</div>
                        )}
                        <div className="min-w-0 pr-3 max-w-[22rem] sm:max-w-[25rem]">
                          <div className={`text-sm font-medium truncate text-slate-900 dark:text-slate-100 transition-all duration-300 ${hasHover && !isHovered ? 'blur-xs' : 'blur-none'}`}>{p.title}</div>
                          <div className={`text-xs text-slate-600 dark:text-slate-400 truncate transition-all duration-300 ${hasHover && !isHovered ? 'blur-xs' : 'blur-none'}`}>{[p.city, p.state_code].filter(Boolean).join(', ')}</div>
                        </div>
                      </button>
                    )
                  })}
                  {!loading && projects.length === 0 && (
                    <div className="text-sm text-slate-600 px-2 py-3">No projects yet.</div>
                  )}
                </div>
                <div className="mt-2 border-t border-slate-200/40 dark:border-slate-800/40 pt-2 px-2 text-center">
                  <button
                    onClick={() => window.open('/projetos', '_blank')}
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium"
                  >
                    View all
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            className="nav-button"
            onClick={() => window.location.href = '/imoveis?type=buy'}
          >
            {t('header.nav.buy').toUpperCase?.() || 'BUY'}
          </button>
          <button
            className="nav-button"
            onClick={() => window.location.href = '/imoveis?type=rent'}
          >
            {t('header.nav.rent').toUpperCase?.() || 'RENT'}
          </button>
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
              }
              if (constellationButtonRef.current) {
                const rect = constellationButtonRef.current.getBoundingClientRect()
                setConstellationButtonCenter(rect.left + rect.width / 2)
              }
              setConstellationOpen(true)
            }}
            onMouseLeave={() => {
              closeTimerRef.current = setTimeout(() => {
                setConstellationClosing(true)
                setTimeout(() => {
                  setConstellationOpen(false)
                  setConstellationClosing(false)
                }, 350)
              }, 500)
            }}
          >
            <button
              ref={constellationButtonRef}
              className="nav-button"
              onClick={() => window.location.href = '/constellation'}
            >
              CONSTELLATION
            </button>
            {constellationOpen && (
              <div
                className={`dropdown-menu fixed z-[60] backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.48)] p-2 rounded-xl w-fit min-w-[200px] overflow-hidden border border-slate-200/20 dark:border-slate-700/20 ${constellationClosing ? 'closing' : ''}`}
                style={{ 
                  top: 'calc(var(--header-height, 60px) + 6px)', 
                  left: `${constellationButtonCenter}px`, 
                  transform: 'translateX(-50%)',
                }}
                onMouseEnter={() => {
                  if (closeTimerRef.current) {
                    clearTimeout(closeTimerRef.current)
                    closeTimerRef.current = null
                  }
                }}
                onMouseLeave={() => {
                  closeTimerRef.current = setTimeout(() => {
                    setConstellationClosing(true)
                    setTimeout(() => {
                      setConstellationOpen(false)
                      setConstellationClosing(false)
                    }, 350)
                  }, 500)
                }}
              >
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={() => window.location.href = '/constellation'}
                    className="mirage-button flex items-center gap-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 py-2 px-3 transition-all duration-300 w-full text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Plataforma</div>
                    </div>
                  </button>
                  <button
                    onClick={() => window.location.href = '/precos'}
                    className="mirage-button flex items-center gap-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 py-2 px-3 transition-all duration-300 w-full text-left"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Preços</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
        {/* Right side actions with improved desktop spacing */}
        <div className="flex items-center gap-2.5 xl:gap-3.5">
          <div className="hidden sm:block w-px h-5 bg-slate-300/30 dark:bg-slate-600/30"></div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden sm:block">
            <CurrencySwitcher />
          </div>
          <div className="hidden sm:block w-px h-5 bg-slate-300/30 dark:bg-slate-600/30"></div>
          
          {/* Login Dropdown */}
          <div 
            className="relative hidden sm:block"
            onMouseEnter={() => {
              if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current)
                closeTimerRef.current = null
              }
              if (loginButtonRef.current) {
                const rect = loginButtonRef.current.getBoundingClientRect()
                setLoginButtonCenter(rect.left + rect.width / 2)
              }
              setLoginDropdownOpen(true)
            }}
            onMouseLeave={() => {
              closeTimerRef.current = setTimeout(() => {
                setLoginDropdownClosing(true)
                setTimeout(() => {
                  setLoginDropdownOpen(false)
                  setLoginDropdownClosing(false)
                }, 350)
              }, 500)
            }}
          >
            <button
              ref={loginButtonRef}
              type="button"
              className="flex items-center gap-2 px-3.5 xl:px-4 py-2 text-[#C9B382] hover:text-[#d4c295] border border-[#C9B382]/30 hover:border-[#C9B382]/50 rounded-lg transition-all duration-300 text-sm font-medium whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              {isAuthenticated ? t('header.myAccount').toUpperCase() : t('header.signIn').toUpperCase()}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Login Dropdown Menu */}
            {loginDropdownOpen && (
              <div
                className={`dropdown-menu fixed z-[60] backdrop-blur-md bg-white/60 dark:bg-slate-900/60 shadow-[0_12px_28px_-12px_rgba(0,0,0,0.48)] p-2 rounded-xl w-fit min-w-[200px] overflow-hidden border border-slate-200/20 dark:border-slate-700/20 ${loginDropdownClosing ? 'closing' : ''}`}
                style={{ 
                  top: 'calc(var(--header-height, 60px) + 6px)', 
                  left: `${loginButtonCenter}px`, 
                  transform: 'translateX(-50%)',
                }}
                onMouseEnter={() => {
                  if (closeTimerRef.current) {
                    clearTimeout(closeTimerRef.current)
                    closeTimerRef.current = null
                  }
                }}
                onMouseLeave={() => {
                  closeTimerRef.current = setTimeout(() => {
                    setLoginDropdownClosing(true)
                    setTimeout(() => {
                      setLoginDropdownOpen(false)
                      setLoginDropdownClosing(false)
                    }, 350)
                  }, 500)
                }}
              >
                <div className="grid grid-cols-1 gap-1">
                  <Link
                    to="/sub/constellation/login"
                    onClick={handleConstellationLogin}
                    className="mirage-button flex items-center gap-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 py-2.5 pl-2 pr-3 transition-all duration-300 w-full text-left group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 relative">
                      <div 
                        className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.8) 0%, rgba(129, 140, 248, 0.4) 50%, rgba(129, 140, 248, 0) 70%)',
                          transform: 'scale(1.5)',
                        }}
                      />
                      <img 
                        src="/tech-icons/contellation-logo.png" 
                        alt="Constellation" 
                        className="w-full h-full object-contain transition-all duration-300 relative z-10"
                        style={{
                          filter: 'brightness(1.3) drop-shadow(0 0 8px rgba(129, 140, 248, 0.4)) drop-shadow(0 0 16px rgba(129, 140, 248, 0.2))',
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div 
                        className="text-sm font-light tracking-[0.25em] uppercase transition-all duration-300"
                        style={{
                          color: 'rgba(240, 245, 255, 0.95)',
                          textShadow: '0 0 20px rgba(129, 140, 248, 0.5), 0 0 40px rgba(129, 140, 248, 0.2)',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      >
                        {t('header.login.constellation').toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {isAuthenticated ? 'Ir para Dashboard' : t('header.login.constellationSubtitle')}
                      </div>
                    </div>
                  </Link>
                  
                  <Link
                    to="/admin/login"
                    onClick={handleAdminLogin}
                    className="mirage-button flex items-center gap-2.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 py-2.5 pl-2 pr-3 transition-all duration-300 w-full text-left group"
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      <img 
                        src="/stella-favicon.png" 
                        alt="Stella Real" 
                        className="w-full h-full object-contain transition-all duration-300"
                        style={{
                          filter: 'drop-shadow(0 0 6px rgba(201, 179, 130, 0.5)) drop-shadow(0 0 12px rgba(201, 179, 130, 0.3))',
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div 
                        className="text-sm font-medium tracking-wider uppercase transition-all duration-300"
                        style={{
                          color: '#C9B382',
                          textShadow: '0 0 8px rgba(201, 179, 130, 0.4)',
                          fontWeight: 500,
                        }}
                      >
                        {t('header.login.stellaTeam').toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {isAuthenticated ? 'Ir para Dashboard' : t('header.login.stellaTeamSubtitle')}
                      </div>
                    </div>
                  </Link>
                  
                  <button
                    type="button"
                    disabled
                    className="mirage-button flex items-center gap-2.5 rounded-lg py-2.5 pl-2 pr-3 w-full text-left opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div 
                        className="text-sm font-light tracking-[0.25em] uppercase"
                        style={{
                          color: 'rgba(156, 163, 175, 0.7)',
                          fontFamily: 'Outfit, sans-serif',
                        }}
                      >
                        {t('header.login.clientLogin').toUpperCase()}
                      </div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{t('header.login.clientLoginSubtitle')}</div>
                    </div>
                  </button>

                  {/* Sign Out Button - Only show when authenticated */}
                  {isAuthenticated && (
                    <>
                      <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="mirage-button flex items-center gap-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 py-2.5 pl-2 pr-3 transition-all duration-300 w-full text-left group"
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-red-600 dark:text-red-400">
                            Sair
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {userEmail}
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="hidden sm:block w-px h-5 bg-slate-300/30 dark:bg-slate-600/30"></div>
          <div className="hidden sm:flex flex-col items-center text-[#C9B382] px-2">
            <div className="text-[9px] font-mono font-bold tracking-[0.8px] leading-tight">CRECI</div>
            <div className="text-[11px] font-mono font-bold tracking-[0.5px] leading-tight">309568</div>
          </div>
          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:hidden"
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

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="sm:hidden">
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-50 mt-[60px] max-h-[calc(100vh-60px)] overflow-y-auto rounded-b-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-2 text-base font-medium">
              <Link to="/projetos" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.projects')}
              </Link>
              <Link to="/imoveis?type=buy" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.buy')}
              </Link>
              <Link to="/imoveis?type=rent" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('header.nav.rent')}
              </Link>
              <Link to="/constellation" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                Constellation
              </Link>
              
              {/* Login Section */}
              <div className="border-t border-slate-200 dark:border-slate-800 my-2"></div>
              <div className="px-3 py-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Login</span>
              </div>
              <Link 
                to="/sub/constellation/login" 
                onClick={(e) => {
                  handleConstellationLogin(e)
                  if (!isAuthenticated) setMobileOpen(false)
                }} 
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Constellation {isAuthenticated && '→ Dashboard'}
              </Link>
              <Link 
                to="/admin/login" 
                onClick={(e) => {
                  handleAdminLogin(e)
                  if (!isAuthenticated) setMobileOpen(false)
                }} 
                className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Stella Real Team {isAuthenticated && '→ Dashboard'}
              </Link>
              
              {/* Sign Out Button - Mobile */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut()
                    setMobileOpen(false)
                  }}
                  className="rounded-lg px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair ({userEmail})
                </button>
              )}
              
              <div className="border-t border-slate-200 dark:border-slate-800 my-2"></div>
              <div className="grid grid-cols-2 gap-2 px-3 py-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Idioma</span>
                  <LanguageSwitcher />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Moeda</span>
                  <CurrencySwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
