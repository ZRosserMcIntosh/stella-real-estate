import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

type Listing = {
  id: string
  title: string
  description: string
  price: number | null
  created_at: string
}

export default function Admin() {
  const [sessionChecked, setSessionChecked] = useState(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  // Require auth to view
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/login')
      setSessionChecked(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate('/login')
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!sessionChecked) return
    refresh()
  }, [sessionChecked])

  const refresh = async () => {
    const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false })
    if (!error && data) setListings(data as Listing[])
  }

  const addListing = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('listings').insert({
      title, description, price: price === '' ? null : Number(price)
    })
    setSaving(false)
    if (!error) {
      setTitle(''); setDescription(''); setPrice('')
      refresh()
    }
  }
  const remove = async (id: string) => {
    await supabase.from('listings').delete().eq('id', id)
    refresh()
  }
  const logout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }
  if (!sessionChecked) return null

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg transition-shadow dark:border-slate-800/60 dark:bg-slate-900/60">
        <div className="container-padded py-6">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Stella Admin Console
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Listings Control Center</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Review inventory, publish new listings, and keep client-facing content accurate across every channel.
            </p>
          </div>
          <div className="mt-5 flex justify-center">
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-brand-500 hover:text-brand-600 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="container-padded py-8 grid gap-8">
        {/* TODO: Temporary note for DB wiring & PostgREST cache issue */}
        <div className="text-red-600 font-bold">
          Connect to database — Could not query the database for the schema cache. Retrying..
        </div>
        <form onSubmit={addListing} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/50">
          <h2 className="text-base font-semibold">Add Listing</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Title</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} required className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"/>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Price</span>
              <input value={price} onChange={e=>setPrice(e.target.value === '' ? '' : Number(e.target.value))} type="number" min="0" step="0.01" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"/>
            </label>
          </div>
          <label className="grid gap-1 text-sm mt-4">
            <span className="font-medium">Description</span>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"></textarea>
          </label>
          <button disabled={saving} className="mt-4 inline-flex items-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors">
            {saving ? 'Saving...' : 'Add Listing'}
          </button>
        </form>

        <section>
          <h2 className="text-base font-semibold mb-3">Existing Listings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(l => (
              <div key={l.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-white/70 dark:bg-slate-900/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{l.title}</h3>
                    {l.price != null && <p className="text-sm text-slate-500">${Number(l.price).toLocaleString()}</p>}
                  </div>
                  <button onClick={()=>remove(l.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{l.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
