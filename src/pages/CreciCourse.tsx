import React from 'react'
import { Link } from 'react-router-dom'

export default function CreciCourse() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Curso interno</span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Como tirar seu CRECI</h1>
          <p className="mt-3 text-sm text-slate-600">
            Estamos estruturando um programa completo com aulas, simulados e plantões de dúvidas para acelerar sua preparação
            para o exame do CRECI. Deixe seu contato e avise se deseja participar da primeira turma piloto.
          </p>

          <form className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Nome
              <input
                type="text"
                placeholder="Seu nome completo"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              E-mail
              <input
                type="email"
                placeholder="voce@exemplo.com"
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Como podemos ajudar?
              <textarea
                rows={4}
                placeholder="Conte um pouco sobre seu momento profissional."
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700"
            >
              Quero ser avisado(a)
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            Enviaremos novidades por e-mail assim que a grade estiver definida. Você pode cancelar a inscrição a qualquer momento.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-900 px-4 py-4 text-sm text-white/90">
            <p>
              Já possui CRECI ativo?{' '}
              <Link to="/criar-site" className="font-semibold text-white underline underline-offset-4">
                Crie seu site com a Stella
              </Link>
              {' '}e acelere seu posicionamento digital.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
