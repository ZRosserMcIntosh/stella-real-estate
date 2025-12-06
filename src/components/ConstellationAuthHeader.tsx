import { Menu, X, Home, Building2, Layout, Users, FileText, Settings, Bell, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../utils/constellationUrl'
import { supabase } from '../lib/supabaseClient'

interface NavItem {
  label: string
  labelEn: string
  href: string
  icon: React.ReactNode
}

export default function ConstellationAuthHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const isPt = i18n.language?.startsWith('pt')

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate(ConstellationUrls.login())
  }

  const navItems: NavItem[] = [
    { label: 'Início', labelEn: 'Home', href: '/dashboard', icon: <Home className="w-4 h-4" /> },
    { label: 'Meus Imóveis', labelEn: 'My Listings', href: '/dashboard/listings', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Construtor de Sites', labelEn: 'Site Builder', href: '/site-builder', icon: <Layout className="w-4 h-4" /> },
    { label: 'CRM', labelEn: 'CRM', href: '/dashboard/crm', icon: <Users className="w-4 h-4" /> },
    { label: 'Documentos', labelEn: 'Documents', href: '/dashboard/documents', icon: <FileText className="w-4 h-4" /> },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-white/10">
      {/* Main Header Row */}
      <div className="container-padded">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <img 
              src="/tech-icons/contellation-logo.png" 
              alt="Constellation" 
              className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              style={{
                filter: 'brightness(1.3) drop-shadow(0 0 6px rgba(129, 140, 248, 0.3))'
              }}
            />
            <span 
              className="hidden sm:block text-base font-light uppercase tracking-[0.2em] text-indigo-200/90" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                textShadow: '0 0 15px rgba(129, 140, 248, 0.4)'
              }}
            >
              CONSTELLATION
            </span>
          </Link>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Ballet Button */}
            <Link 
              to="/ballet"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 rounded-lg transition-all group"
            >
              <img 
                src="/ballet-new-logo.png" 
                alt="Ballet" 
                className="h-5 w-auto object-contain"
              />
              <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                Ballet
              </span>
            </Link>
            
            <div className="border-l border-white/10 pl-4 flex items-center gap-4">
              <LanguageSwitcher />
              
              {/* Notification Bell */}
              <button 
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
                aria-label={isPt ? 'Notificações' : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge - uncomment when there are notifications */}
                {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
              </button>
              
              {/* My Account Button */}
              <Link 
                to="/dashboard/account"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm"
              >
                <Settings className="w-4 h-4" />
                {isPt ? 'Minha Conta' : 'My Account'}
              </Link>
              
              {/* Sign Out Link */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {isPt ? 'Sair' : 'Exit'}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Row - Shopify-style */}
      <div className="hidden md:block bg-slate-900/50 border-t border-white/5">
        <div className="container-padded">
          <nav className="flex items-center gap-1 h-12 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {isPt ? item.label : item.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <nav className="container-padded py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {isPt ? item.label : item.labelEn}
              </Link>
            ))}
            
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
              {/* Ballet Button - Mobile */}
              <Link 
                to="/ballet"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/60 border border-white/10 rounded-lg"
              >
                <img 
                  src="/ballet-new-logo.png" 
                  alt="Ballet" 
                  className="h-5 w-auto object-contain"
                />
                <span className="text-sm font-medium text-slate-200">
                  Ballet
                </span>
              </Link>
              
              <div className="py-2 px-4">
                <LanguageSwitcher />
              </div>
              
              <Link 
                to="/dashboard/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-full font-medium transition-all shadow-lg text-center"
              >
                <Settings className="w-4 h-4" />
                {isPt ? 'Minha Conta' : 'My Account'}
              </Link>
              
              {/* Sign Out - Mobile */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSignOut()
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {isPt ? 'Sair' : 'Exit'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
