import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Legal() {
  const { t } = useTranslation()
  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">{t('pages.legal.title')}</h1>
      <p className="mt-3 text-slate-700">Legal information placeholder content.</p>
    </section>
  )
}
