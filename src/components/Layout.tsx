import React from 'react'
import Header from './Header'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isProjectDetail = location.pathname.startsWith('/projects/')
  return (
    <div className={`relative min-h-screen flex flex-col${(isHome || isProjectDetail) ? '' : ' bg-white'}`}>
      {/* Fixed header, overlays content; increase z-index above page panels */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="backdrop-blur-sm bg-white/5 dark:bg-black/20">
          <Header />
        </div>
      </div>
  {/* Offset main to account for fixed header height */}
  <main className="flex-1 pt-20">
        <Outlet />
      </main>
  <Footer />
    </div>
  )
}
