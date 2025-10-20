import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Contact() {
  const { t } = useTranslation()
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [status, setStatus] = React.useState<'idle'|'sending'|'sent'|'error'>('idle')
  const [note, setNote] = React.useState('')
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending'); setNote('')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to send')
      setStatus('sent'); setNote('Message sent. We will get back to you soon.')
      setName(''); setEmail(''); setMessage('')
    } catch (err: any) {
      setStatus('error'); setNote(err.message)
    }
  }
  return (
    <section className="container-padded py-16">
      <h1 className="text-2xl font-bold">{t('pages.contact.title')}</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-lg">
        <label className="grid gap-1 text-sm">
          <span className="font-medium">Name</span>
          <input value={name} onChange={e=>setName(e.target.value)} type="text" className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">{t('home.contact.email')}</span>
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium">{t('home.contact.message')}</span>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} className="rounded-xl border border-slate-300 px-3 py-2"></textarea>
        </label>
        {note && (
          <p className={`text-sm ${status==='error' ? 'text-red-600' : 'text-green-700'}`}>{note}</p>
        )}
        <button disabled={status==='sending'} className="inline-flex items-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white">
          {status==='sending' ? 'Sending…' : t('home.contact.send')}
        </button>
      </form>
    </section>
  )
}
