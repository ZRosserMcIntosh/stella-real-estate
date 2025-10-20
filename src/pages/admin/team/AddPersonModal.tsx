import React, { useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import type { Person, EmploymentType, Department, PersonStatus } from './types'

type Step = 1|2|3|4

const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/
const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/

export function AddPersonModal({ open, onClose, onCreated, existingPeople }: { open: boolean; onClose: ()=>void; onCreated: (p: Person | null)=>void; existingPeople: Person[] }) {
  const [step, setStep] = useState<Step>(1)
  const [type, setType] = useState<EmploymentType>('employee')
  const [fullName, setFullName] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [email, setEmail] = useState('')
  const [phones, setPhones] = useState<string>('')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [department, setDepartment] = useState<Department>('Sales')
  const [managerId, setManagerId] = useState<string>('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<PersonStatus>('active')

  const canNext1 = fullName.trim() && email.trim() ? true : false
  const cpfValid = !cpf || cpfRegex.test(cpf)
  const cnpjValid = !cnpj || cnpjRegex.test(cnpj)
  const canCreate = canNext1 && roleTitle.trim() && department && (type !== 'third_party' || cnpjValid) && cpfValid

  const managers = useMemo(()=> existingPeople, [existingPeople])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 top-8 mx-auto w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="text-lg font-semibold">Add Person</h3>
          <button onClick={onClose} className="rounded border border-slate-300 bg-white px-2 py-1 text-sm">Close</button>
        </div>
        <div className="px-4 py-3">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <label className="text-slate-700">Type</label>
            <select value={type} onChange={e=>setType(e.target.value as EmploymentType)} className="rounded border border-slate-300 bg-white px-2 py-1 text-sm">
              <option value="employee">Employee</option>
              <option value="executive">Executive</option>
              <option value="third_party">Third-Party Contractor</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Full Name ★</label>
                <input value={fullName} onChange={e=>setFullName(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1" placeholder="Maria Silva" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Preferred Name</label>
                <input value={preferredName} onChange={e=>setPreferredName(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1" placeholder="Maria" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Email ★</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1" placeholder="maria@stella.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Phones</label>
                <input value={phones} onChange={e=>setPhones(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1" placeholder="+55 11 9.... (comma-separated)" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">CPF</label>
                <input value={cpf} onChange={e=>setCpf(e.target.value)} className={'mt-1 w-full rounded border px-2 py-1 ' + (cpfValid? 'border-slate-300':'border-red-500')} placeholder="000.000.000-00" />
                {!cpfValid && <p className="mt-1 text-xs text-red-600">Invalid CPF format</p>}
              </div>
              {type === 'third_party' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700">CNPJ (Vendor)</label>
                  <input value={cnpj} onChange={e=>setCnpj(e.target.value)} className={'mt-1 w-full rounded border px-2 py-1 ' + (cnpjValid? 'border-slate-300':'border-red-500')} placeholder="00.000.000/0000-00" />
                  {!cnpjValid && <p className="mt-1 text-xs text-red-600">Invalid CNPJ format</p>}
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700">Position/Title ★</label>
                <input value={roleTitle} onChange={e=>setRoleTitle(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1" placeholder="Senior Agent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Department ★</label>
                <select value={department} onChange={e=>setDepartment(e.target.value as Department)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1">
                  <option>Sales</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Legal</option>
                  <option>Accounting</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Manager</label>
                <select value={managerId} onChange={e=>setManagerId(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1">
                  <option value="">(none)</option>
                  {managers.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} — {m.roleTitle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">City</label>
                <input value={city} onChange={e=>setCity(e.target.value)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1" placeholder="São Paulo" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Status</label>
                <select value={status} onChange={e=>setStatus(e.target.value as PersonStatus)} className="mt-1 w-full rounded border border-slate-300 px-2 py-1">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="offboarding">Offboarding</option>
                </select>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-2 text-sm text-slate-700">
              <div className="font-medium">Review</div>
              <ul className="list-inside list-disc">
                <li>{fullName} ({preferredName || '—'}) • {email}</li>
                <li>{roleTitle} — {department} • {city || '—'}</li>
                <li>Type: {type} • Status: {status}</li>
                <li>CPF: {cpf || '—'} • CNPJ: {cnpj || '—'}</li>
              </ul>
              <p className="text-xs text-slate-500">Note: advanced sections (Access & Security, Finance, Equipment, Compliance) can be completed after creation.</p>
            </div>
          )}
          {step === 4 && (
            <div className="text-green-700">Person created.</div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-3">
          <div className="text-xs text-slate-500">Steps: Identity → Role → Review</div>
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && <button onClick={()=>setStep((s)=> (s-1) as Step)} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm">Back</button>}
            {step < 3 && <button onClick={()=> setStep((s)=> (s+1) as Step)} disabled={(step===1 && !canNext1) || (step===2 && !roleTitle.trim())} className="rounded bg-slate-900 px-3 py-1.5 text-sm text-white disabled:opacity-50">Next</button>}
            {step === 3 && <button onClick={async ()=>{
              if (!canCreate) return
              // Try Supabase RPC first (admin-only); fallback to local state if not configured or fails
              let createdLocal = false
              try {
                if ((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) {
                  const { data, error } = await supabase.rpc('add_team_member', {
                    p_email: email,
                    p_full_name: fullName,
                    p_role: 'admin',
                    p_department: department,
                    p_city: city || null,
                    p_status: status,
                  })
                  if (error) throw error
                  onCreated(null)
                } else {
                  createdLocal = true
                }
              } catch (_e) {
                createdLocal = true
              }

              if (createdLocal) {
                const p: Person = {
                  id: 'u-' + Math.random().toString(36).slice(2,9),
                  fullName,
                  preferredName: preferredName || undefined,
                  email,
                  phones: phones ? phones.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
                  roleTitle,
                  department,
                  city: city || '—',
                  status,
                  managerId: managerId || undefined,
                  type,
                }
                onCreated(p)
              }
              setStep(4)
            }} disabled={!canCreate} className="rounded bg-sky-600 px-3 py-1.5 text-sm text-white disabled:opacity-50">Create</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
