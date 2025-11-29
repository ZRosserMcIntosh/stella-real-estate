import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'

type InviteCode = {
  id: string
  code: string
  email: string
  full_name: string | null
  role: string
  department: string | null
  status: 'pending' | 'used' | 'expired' | 'cancelled'
  created_at: string
  expires_at: string
  used_at: string | null
}

const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'agent', label: 'Agent' },
  { value: 'ops', label: 'Operations' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'exec', label: 'Executive' },
  { value: 'owner', label: 'Owner' },
]

const departments = [
  'Sales',
  'Marketing',
  'Operations',
  'Finance',
  'Legal',
  'HR',
  'Development',
  'Customer Success',
]

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

const copyToClipboard = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}

// Generate 16-digit numeric code in XXXX-XXXX-XXXX-XXXX format
const generateCode = () => {
  const segments = []
  for (let i = 0; i < 4; i++) {
    segments.push(Math.floor(1000 + Math.random() * 9000).toString())
  }
  return segments.join('-')
}

export function InviteCodes() {
  const [invites, setInvites] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('agent')
  const [department, setDepartment] = useState('')
  
  // UI state
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [lastCode, setLastCode] = useState<string | null>(null)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  // Fetch invites from Supabase
  const fetchInvites = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching invites:', error)
        // If table doesn't exist or no permission, show empty
        setInvites([])
      } else {
        setInvites(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setInvites([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvites()
  }, [fetchInvites])

  useEffect(() => {
    if (!copyMessage) return
    const timer = setTimeout(() => setCopyMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [copyMessage])

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(null), 5000)
    return () => clearTimeout(timer)
  }, [status])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter an email address' })
      return
    }

    setCreating(true)
    setStatus(null)
    setLastCode(null)

    try {
      // Generate unique code
      const code = generateCode()
      
      // Set expiry to 30 days from now
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const { data: userData } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('invitation_codes')
        .insert({
          code,
          email: email.trim().toLowerCase(),
          full_name: fullName.trim() || null,
          role,
          department: department || null,
          status: 'pending',
          created_by: userData.user?.id,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating invite:', error)
        
        // Check for specific errors
        if (error.code === '23505') {
          setStatus({ type: 'error', message: 'This code already exists. Please try again.' })
        } else if (error.code === '42501') {
          setStatus({ type: 'error', message: 'Permission denied. You may not have admin access.' })
        } else {
          setStatus({ type: 'error', message: error.message || 'Failed to create invitation' })
        }
        return
      }

      // Success!
      setLastCode(code)
      setStatus({ type: 'success', message: `Invitation code created for ${email}!` })
      
      // Refresh the list
      fetchInvites()
      
      // Clear form (but keep email visible for reference)
      setFullName('')
      setDepartment('')
    } catch (err) {
      console.error('Error:', err)
      setStatus({ type: 'error', message: 'An unexpected error occurred' })
    } finally {
      setCreating(false)
    }
  }

  const handleCopy = async (code: string) => {
    const success = await copyToClipboard(code)
    setCopyMessage(success ? 'Code copied!' : 'Failed to copy')
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this invitation code?')) return
    
    try {
      const { error } = await supabase
        .from('invitation_codes')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) {
        console.error('Error cancelling:', error)
        setStatus({ type: 'error', message: 'Failed to cancel invitation' })
      } else {
        fetchInvites()
        setStatus({ type: 'success', message: 'Invitation cancelled' })
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
      case 'used':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      case 'expired':
        return 'bg-red-500/20 text-red-300 border-red-500/40'
      case 'cancelled':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40'
    }
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-indigo-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Team Invitation Codes</h3>
            <p className="mt-1 text-sm text-slate-300">
              Generate unique 16-digit invitation codes for new team members. 
              Each code is linked to an email address and expires after 30 days.
              Share the code with your new hire to let them sign up.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generate New Invitation */}
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create Invitation</h2>
              <p className="text-sm text-slate-400">Generate a code for a new team member</p>
            </div>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tricia@stellareal.com.br"
                required
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tricia Santos"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-white focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-white focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={creating}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Invitation Code'
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status && (
            <div className={`mt-4 rounded-xl border p-4 ${status.type === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-red-500/40 bg-red-500/10 text-red-300'}`}>
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          {/* Generated Code Display */}
          {lastCode && (
            <div className="mt-4 rounded-xl border-2 border-indigo-500/50 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-5">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
                  Invitation Code Generated
                </p>
                <div className="flex items-center justify-center gap-3">
                  <p className="font-mono text-2xl font-bold text-white tracking-wider">
                    {lastCode}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(lastCode)}
                    className="rounded-lg bg-indigo-600/80 p-2 text-white hover:bg-indigo-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Send this code to <span className="text-indigo-300 font-medium">{email}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Active Invitations List */}
        <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Invitation History</h2>
                <p className="text-sm text-slate-400">{invites.length} invitations</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fetchInvites}
              disabled={loading}
              className="rounded-lg bg-slate-700/60 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-slate-400">Loading invitations...</p>
              </div>
            ) : invites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V18.75z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-medium mb-1">No invitations yet</p>
                <p className="text-sm text-slate-500">Create your first invitation to get started</p>
              </div>
            ) : (
              invites.map((invite) => (
                <div
                  key={invite.id}
                  className={`rounded-xl border p-4 transition-all ${
                    invite.status === 'pending' 
                      ? 'border-slate-700/60 bg-slate-800/40 hover:border-slate-600/60 hover:bg-slate-800/60' 
                      : 'border-slate-700/40 bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-indigo-300">{invite.code}</span>
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadge(invite.status)}`}>
                          {invite.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-white truncate">{invite.email}</p>
                      
                      {invite.full_name && (
                        <p className="text-xs text-slate-400">{invite.full_name}</p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <span className="capitalize">{invite.role}</span>
                        {invite.department && (
                          <>
                            <span>•</span>
                            <span>{invite.department}</span>
                          </>
                        )}
                      </div>
                      
                      <p className="mt-1 text-xs text-slate-500">
                        {invite.status === 'used' && invite.used_at 
                          ? `Used: ${formatDate(invite.used_at)}`
                          : `Expires: ${formatDate(invite.expires_at)}`
                        }
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {invite.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCopy(invite.code)}
                            className="rounded-lg bg-slate-700/60 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                            title="Copy code"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancel(invite.id)}
                            className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition"
                            title="Cancel invitation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Copy Notification Toast */}
      {copyMessage && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/20 backdrop-blur-md px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p className="text-sm font-medium text-emerald-200">{copyMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
