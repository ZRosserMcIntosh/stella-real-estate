import React from 'react'
import Header from './components/Header'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-padded pt-16 pb-24">
            <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight text-slate-900 dark:text-slate-900">
              Find your dream property with Stella's Real Estate
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-900 dark:text-slate-900">
              Built with React, Vite, Tailwind, and the Inter font. Clean defaults, elegant spacing, and
              a sticky header — all set up and ready for your real estate business.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#listings" className="inline-flex items-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors">Browse Listings</a>
              <a href="https://tailwindcss.com/docs" target="_blank" className="inline-flex items-center rounded-2xl px-4 py-2 font-semibold border border-slate-700/50 dark:border-slate-700/70 hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors">Docs</a>
            </div>
          </div>
        </section>
        <section id="listings" className="bg-white/70 dark:bg-slate-900/30 border-y border-slate-200/70 dark:border-slate-800/70">
          <div className="container-padded py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Beachfront Apartment', 'Wake up to ocean views in this 3BR modern apartment.'],
              ['Downtown Loft', 'Stylish open-concept loft close to everything.'],
              ['Family Home', 'Spacious 4BR home in a quiet, safe neighborhood.'],
            ].map(([title, desc], i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/50 shadow-soft">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="about" className="container-padded py-16">
          <h2 className="text-2xl font-bold">About</h2>
          <p className="mt-3 text-slate-900 dark:text-black-900 max-w-2xl">
            Stella Real Estate helps you discover properties that fit your lifestyle. This starter is
            intentionally minimal so you can move fast without fighting design tokens or complex scaffolding.
          </p>
        </section>
        <section id="contact" className="container-padded py-16">
          <h2 className="text-2xl font-normal text-black dark:text-black">Contact</h2>
          <form className="mt-6 grid gap-4 max-w-lg">
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Email</span>
              <input type="email" placeholder="voce@example.com" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"/>
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium">Message</span>
              <textarea placeholder="How can we help?" rows={5} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500/40"></textarea>
            </label>
            <button className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-semibold bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-soft transition-colors w-fit">
              Send
            </button>
          </form>
        </section>
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="container-padded py-8 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <p>&copy; <span id="year">{new Date().getFullYear()}</span> Stella Real Estate. All rights reserved.</p>
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Privacy</a>
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">List Your Property</a>
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400">Legal Department</a>
        </div>
      </footer>

      <a
        href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch on YouTube"
        className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186c-.273-.975-1.086-1.686-2.086-1.686-1.25 0-2.5.5-3.5 1.5l-4.5 4.5-4.5-4.5c-1-1-2.25-1.5-3.5-1.5-1 0-1.813.711-2.086 1.686C.711 7.5 0 8.5 0 9.5c0 1 1.5 2.5 2.5 3.5l4.5 4.5-4.5 4.5C1.5 20.5 0 21 0 22c0 1 1 2 2 2 1 0 2.5-.5 3.5-1.5l4.5-4.5 4.5 4.5c1 1 2.25 1.5 3.5 1.5 1 0 1.813-.711 2.086-1.686.273-.975.086-2.086-.5-2.5l-4.5-4.5 4.5-4.5c.586-.414.773-1.525.5-2.5z"/>
        </svg>
      </a>
    </div>
  )
}