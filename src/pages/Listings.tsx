import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Listings() {
  const { t } = useTranslation()
  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">{t('pages.listings.title')}</h1>
      <p className="mt-3 text-slate-700">Static listings placeholder. We will connect to Supabase later.</p>
    </section>
  )
}
