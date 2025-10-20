import React from 'react'
import { useTranslation } from 'react-i18next'

export default function ListYourProperty() {
  const { t } = useTranslation()
  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">{t('pages.listYourProperty.title')}</h1>
      <p className="mt-3 text-slate-700">Tell us about your property. Placeholder form coming soon.</p>
    </section>
  )
}
