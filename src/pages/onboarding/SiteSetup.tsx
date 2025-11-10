import React from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingError, useOnboarding } from '../../context/OnboardingContext'
import { slugify } from '../../utils/slug'

const slugPattern = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function SiteSetup() {
  const navigate = useNavigate()
  const { state, createTenant, existingSlugs, builderGate } = useOnboarding()
  const tenant = state.tenant

  const [siteName, setSiteName] = React.useState(tenant?.name ?? '')
  const [slug, setSlug] = React.useState(tenant?.slug ?? '')
  const [manualSlug, setManualSlug] = React.useState(Boolean(tenant?.slug))
  const [logoData, setLogoData] = React.useState<string | null>(tenant?.logoUrl ?? null)
  const [faviconData, setFaviconData] = React.useState<string | null>(tenant?.faviconUrl ?? null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (!state.account) {
      navigate('/criar-site', { replace: true })
      return
    }
    if (!state.role || state.role === 'employee') {
      navigate('/onboarding/choose-role', { replace: true })
    }
  }, [state.account, state.role, navigate])

  if (!state.account || !state.role || state.role === 'employee') return null

  const domainPreview = slug ? `https://${slug}.stella-real-estate.vercel.app/` : 'https://{slug}.stella-real-estate.vercel.app/'
  const pathFallback = slug ? `/t/${slug}` : '/t/{slug}'

  const handleNameChange = (value: string) => {
    setSiteName(value)
    if (!manualSlug) {
      const generated = slugify(value)
      setSlug(generated)
    }
  }

  const handleSlugChange = (value: string) => {
    setManualSlug(true)
    setSlug(value.toLowerCase())
  }

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await toDataUrl(file)
      setLogoData(dataUrl)
    } catch {
      setError('Não foi possível processar o arquivo do logo.')
    } finally {
      event.target.value = ''
    }
  }

  const handleFaviconChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await toDataUrl(file)
      setFaviconData(dataUrl)
    } catch {
      setError('Não foi possível processar o favicon.')
    } finally {
      event.target.value = ''
    }
  }

  const clearLogo = () => setLogoData(null)
  const clearFavicon = () => setFaviconData(null)

  const slugInvalid = slug.length > 0 && (!slugPattern.test(slug) || slug.includes('--'))
  const slugTaken = slug.length > 0 && existingSlugs.includes(slug) && tenant?.slug !== slug

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!siteName.trim()) {
      setError('Informe o nome do site.')
      return
    }
    if (!slug || slugInvalid) {
      setError('Selecione um slug válido para o site.')
      return
    }
    if (slugTaken) {
      setError('Este slug já está em uso. Escolha outro.')
      return
    }

    setLoading(true)
    try {
      await createTenant({
        name: siteName.trim(),
        slug,
        logoUrl: logoData ?? undefined,
        faviconUrl: faviconData ?? undefined,
      })
      navigate('/admin/website-builder')
    } catch (err) {
      if (err instanceof OnboardingError) {
        setError(err.message)
      } else {
        setError('Não foi possível criar o site agora. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Passo 4 de 4</span>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Configure os detalhes do seu site</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            O nome aparece na vitrine e no cabeçalho. O slug é usado para o endereço temporário (subdomínio) e pode ser alterado depois.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <form className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Nome do site
            <input
              type="text"
              value={siteName}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Ex.: Imóveis da Ana"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Slug (endereço temporário)
            <input
              type="text"
              value={slug}
              onChange={(event) => handleSlugChange(event.target.value.replace(/[^a-z0-9-]/g, ''))}
              placeholder="imoveis-da-ana"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm lowercase shadow-inner focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <p className="mt-2 text-xs text-slate-500">
              {domainPreview}
              <span className="ml-2 text-slate-400">(fallback: {pathFallback})</span>
            </p>
            {slugInvalid && (
              <p className="mt-1 text-xs text-amber-600">
                Use apenas letras minúsculas, números e hífens. Não use hífens duplos nem inicie/termine com hífen.
              </p>
            )}
            {slugTaken && (
              <p className="mt-1 text-xs text-red-600">Este slug já está reservado em outro site.</p>
            )}
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Logo (opcional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </label>
              {logoData && (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <img src={logoData} alt="Pré-visualização do logo" className="h-10 w-auto object-contain" />
                  <button type="button" onClick={clearLogo} className="text-xs font-semibold text-brand-600 hover:underline">
                    Remover
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Favicon (opcional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconChange}
                  className="mt-2 block w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                />
              </label>
              {faviconData && (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <img src={faviconData} alt="Pré-visualização do favicon" className="h-8 w-8 rounded-lg object-cover" />
                  <button type="button" onClick={clearFavicon} className="text-xs font-semibold text-brand-600 hover:underline">
                    Remover
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-2xl bg-slate-900 px-4 py-4 text-sm text-white">
            <p>
              {builderGate.mode === 'full'
                ? 'Tudo certo! Ao concluir, você será levado ao Website Builder para personalizar seu site.'
                : builderGate.mode === 'limited'
                  ? 'Seu construtor estará em modo rascunho até concluirmos a verificação do corretor responsável.'
                  : 'Finalize sua licença ou convite para liberar o construtor completo.'}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-slate-500">
              Você poderá conectar um domínio próprio mais tarde ou apontar o DNS para usar o endereço definitivo.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Criando site...' : 'Criar site e abrir o builder'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
