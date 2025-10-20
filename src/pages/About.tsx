import React from 'react'
import { useTranslation } from 'react-i18next'

export default function About() {
  const { t } = useTranslation()
  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">{t('pages.about.title')}</h1>
      <p className="mt-3 text-slate-700">Placeholder content. We will add more details per the spec PDF.</p>
    </section>
  )
}
