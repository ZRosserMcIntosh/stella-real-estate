import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="container-padded py-20 text-center">
      <h1 className="text-2xl font-bold">{t('pages.notFound.title')}</h1>
      <Link className="mt-4 inline-flex items-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white" to="/">{t('pages.notFound.backHome')}</Link>
    </section>
  )
}
