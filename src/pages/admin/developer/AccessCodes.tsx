import React from 'react'
import { OnboardingError, useOnboarding } from '../../../context/OnboardingContext'
import type { MembershipRole, UserRole } from '../../../types/onboarding'

const employeeRoles: MembershipRole[] = ['owner', 'admin', 'editor', 'agent', 'listing_manager', 'employee']
const developerRoles: UserRole[] = ['realtor', 'brokerage', 'developer', 'employee']

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

const copyToClipboard = async (value: string, onSuccess: (message: string) => void, onError: (message: string) => void) => {
  try {
    await navigator.clipboard.writeText(value)
    onSuccess('Copiado para a área de transferência.')
  } catch {
    onError('Não foi possível copiar automaticamente. Copie manualmente.')
  }
}

export default function AccessCodes() {
  const { inviteDirectory, createEmployeeInvite, createDeveloperCode } = useOnboarding()
  const employeeInvites = React.useMemo(
    () => inviteDirectory.filter((invite) => invite.category === 'employee'),
    [inviteDirectory],
  )
  const developerCodes = React.useMemo(
    () => inviteDirectory.filter((invite) => invite.category === 'developer'),
    [inviteDirectory],
  )

  const [employeeEmail, setEmployeeEmail] = React.useState('')
  const [employeeOrg, setEmployeeOrg] = React.useState('Sandbox Brokers')
  const [employeeRole, setEmployeeRole] = React.useState<MembershipRole>('employee')
  const [employeeNote, setEmployeeNote] = React.useState('')
  const [employeeStatus, setEmployeeStatus] = React.useState<string | null>(null)

  const [devEmail, setDevEmail] = React.useState('')
  const [devRole, setDevRole] = React.useState<UserRole>('realtor')
  const [devLabel, setDevLabel] = React.useState('Developer Sandbox')
  const [devNote, setDevNote] = React.useState('')
  const [devStatus, setDevStatus] = React.useState<string | null>(null)

  const [copyMessage, setCopyMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!copyMessage) return undefined
    const timer = window.setTimeout(() => setCopyMessage(null), 3200)
    return () => window.clearTimeout(timer)
  }, [copyMessage])

  const handleCreateEmployee = (event: React.FormEvent) => {
    event.preventDefault()
    setEmployeeStatus(null)
    try {
      const invite = createEmployeeInvite({
        email: employeeEmail,
        orgName: employeeOrg,
        role: employeeRole,
        note: employeeNote || null,
      })
      setEmployeeStatus(`Código gerado: ${invite.code}`)
      setEmployeeEmail('')
      setEmployeeNote('')
    } catch (error) {
      if (error instanceof OnboardingError) {
        setEmployeeStatus(error.message)
      } else {
        console.error(error)
        setEmployeeStatus('Não foi possível gerar o código agora.')
      }
    }
  }

  const handleCreateDeveloper = (event: React.FormEvent) => {
    event.preventDefault()
    setDevStatus(null)
    try {
      const invite = createDeveloperCode({
        email: devEmail,
        role: devRole,
        label: devLabel,
        note: devNote || null,
      })
      setDevStatus(`Código sandbox gerado: ${invite.code}`)
      setDevNote('')
      setDevEmail('')
    } catch (error) {
      if (error instanceof OnboardingError) {
        setDevStatus(error.message)
      } else {
        console.error(error)
        setDevStatus('Não foi possível gerar o código agora.')
      }
    }
  }

  const handleCopy = (value: string) => {
    copyToClipboard(
      value,
      (message) => setCopyMessage(message),
      (message) => setCopyMessage(message),
    )
  }

  return (
    <div className="space-y-10 text-slate-200">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
          <h2 className="text-xl font-semibold text-white">Convites para funcionários</h2>
          <p className="mt-1 text-sm text-slate-400">
            Gere códigos vinculados a um e-mail específico. Após o uso, o colaborador entra diretamente na imobiliária informada.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleCreateEmployee}>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              E-mail do colaborador
              <input
                value={employeeEmail}
                onChange={(event) => setEmployeeEmail(event.target.value)}
                type="email"
                placeholder="colaborador@empresa.com"
                required
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Nome da imobiliária
              <input
                value={employeeOrg}
                onChange={(event) => setEmployeeOrg(event.target.value)}
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Função ao entrar
              <select
                value={employeeRole}
                onChange={(event) => setEmployeeRole(event.target.value as MembershipRole)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                {employeeRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Observação (opcional)
              <input
                value={employeeNote}
                onChange={(event) => setEmployeeNote(event.target.value)}
                type="text"
                placeholder="Ex.: onboarding de 7 dias"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
            >
              Gerar convite
            </button>
            {employeeStatus && <p className="text-xs text-slate-300">{employeeStatus}</p>}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
          <h2 className="text-xl font-semibold text-white">Códigos de desenvolvedor</h2>
          <p className="mt-1 text-sm text-slate-400">
            Crie acessos temporários para testar o fluxo completo sem validações de licença. Cada código é vinculado a um e-mail.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleCreateDeveloper}>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              E-mail autorizado
              <input
                value={devEmail}
                onChange={(event) => setDevEmail(event.target.value)}
                type="email"
                placeholder="teste@stella.dev"
                required
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Fluxo liberado
              <select
                value={devRole}
                onChange={(event) => setDevRole(event.target.value as UserRole)}
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                {developerRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Alias do sandbox
              <input
                value={devLabel}
                onChange={(event) => setDevLabel(event.target.value)}
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Observação (opcional)
              <input
                value={devNote}
                onChange={(event) => setDevNote(event.target.value)}
                type="text"
                placeholder="Ex.: expira junto com sprint 5"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600"
            >
              Gerar código sandbox
            </button>
            {devStatus && <p className="text-xs text-slate-300">{devStatus}</p>}
          </form>
        </div>
      </section>

      {copyMessage && (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-800/80 px-4 py-3 text-sm text-slate-200">
          {copyMessage}
        </div>
      )}

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
          <h3 className="text-lg font-semibold text-white">Histórico de convites de funcionário</h3>
          {employeeInvites.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">Nenhum convite gerado ainda.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700/60 text-sm">
                <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">E-mail</th>
                    <th className="px-4 py-3 text-left">Org</th>
                    <th className="px-4 py-3 text-left">Função</th>
                    <th className="px-4 py-3 text-left">Usos</th>
                    <th className="px-4 py-3 text-left">Expira</th>
                    <th className="px-4 py-3 text-left">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {employeeInvites.map((invite) => (
                    <tr key={invite.code}>
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-[0.3em] text-slate-200">{invite.code}</td>
                      <td className="px-4 py-3 text-slate-300">{invite.boundEmail}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {invite.orgName}
                        {invite.note && <div className="text-xs text-slate-500">{invite.note}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{invite.role}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {invite.uses}/{invite.maxUses}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{formatDate(invite.expiresAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleCopy(invite.code)}
                          className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-700/60"
                        >
                          Copiar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-lg shadow-slate-950/30">
          <h3 className="text-lg font-semibold text-white">Códigos de desenvolvedor emitidos</h3>
          {developerCodes.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">Nenhum código sandbox gerado ainda.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-700/60 text-sm">
                <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">E-mail</th>
                    <th className="px-4 py-3 text-left">Fluxo</th>
                    <th className="px-4 py-3 text-left">Alias</th>
                    <th className="px-4 py-3 text-left">Usos</th>
                    <th className="px-4 py-3 text-left">Expira</th>
                    <th className="px-4 py-3 text-left">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {developerCodes.map((invite) => (
                    <tr key={invite.code}>
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-[0.3em] text-slate-200">{invite.code}</td>
                      <td className="px-4 py-3 text-slate-300">{invite.boundEmail}</td>
                      <td className="px-4 py-3 text-slate-300">{invite.developerRole}</td>
                      <td className="px-4 py-3 text-slate-300">
                        {invite.orgName}
                        {invite.note && <div className="text-xs text-slate-500">{invite.note}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {invite.uses}/{invite.maxUses}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{formatDate(invite.expiresAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleCopy(invite.code)}
                          className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-slate-700/60"
                        >
                          Copiar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
