import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="container-padded py-8 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <p>&copy; <span id="year">{new Date().getFullYear()}</span> Stella Real Estate. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">{t('home.footer.privacy')}</Link>
          <Link to="/list-your-property" className="hover:text-brand-600 dark:hover:text-brand-400">{t('home.footer.listProperty')}</Link>
          <Link to="/legal" className="hover:text-brand-600 dark:hover:text-brand-400">{t('home.footer.legal')}</Link>
          <Link to="/institutional" className="hover:text-brand-600 dark:hover:text-brand-400">{t('home.footer.institutional')}</Link>
          <Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400">{t('home.footer.admin')}</Link>
        </div>
      </div>
    </footer>
  )
}
