import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { ConstellationUrls } from '../utils/constellationUrl'

export default function ConstellationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="container-padded">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={ConstellationUrls.home()} className="flex items-center gap-3 group">
            <img 
              src="/tech-icons/contellation-logo.png" 
              alt="Constellation" 
              className="h-16 sm:h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              style={{
                filter: 'brightness(1.3) drop-shadow(0 0 6px rgba(129, 140, 248, 0.3)) drop-shadow(0 0 12px rgba(129, 140, 248, 0.15))'
              }}
            />
            <span 
              className="text-sm sm:text-xl font-light uppercase tracking-[0.2em] sm:tracking-[0.3em] text-indigo-200/90" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                textShadow: '0 0 15px rgba(129, 140, 248, 0.4)'
              }}
            >
              CONSTELLATION
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link 
                to="/constellation" 
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {t('constellation.nav.features')}
              </Link>
              <Link 
                to="/precos" 
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {t('constellation.nav.pricing')}
              </Link>
              <Link 
                to="/sobre" 
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {t('constellation.nav.about')}
              </Link>
              <Link 
                to="/contato" 
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {t('constellation.nav.contact')}
              </Link>
              <a
                href={ConstellationUrls.login()}
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {t('constellation.nav.sign_in')}
              </a>
            </nav>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <LanguageSwitcher />
              <Link 
                to="/precos" 
                className="px-6 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm"
              >
                {t('constellation.nav.get_started')}
              </Link>
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-white/10">
          <nav className="container-padded py-6 flex flex-col gap-4">
            <Link 
              to="/constellation" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors py-2 font-medium"
            >
              {t('constellation.nav.features')}
            </Link>
            <Link 
              to="/precos" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors py-2 font-medium"
            >
              {t('constellation.nav.pricing')}
            </Link>
            <Link 
              to="/sobre" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors py-2 font-medium"
            >
              {t('constellation.nav.about')}
            </Link>
            <Link 
              to="/contato" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white transition-colors py-2 font-medium"
            >
              {t('constellation.nav.contact')}
            </Link>
            <div className="border-t border-white/10 pt-4 mt-2 flex flex-col gap-3">
              <a
                href={ConstellationUrls.login()}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white transition-colors py-2 font-medium"
              >
                {t('constellation.nav.sign_in')}
              </a>
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <Link 
                to="/precos" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-lg text-center"
              >
                {t('constellation.nav.get_started')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
