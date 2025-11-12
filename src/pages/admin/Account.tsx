import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { User, Mail, Phone, MapPin, Building2, Save, X, Edit2, Check, AlertCircle, Camera } from 'lucide-react'

interface UserProfile {
  id: string
  fullName: string
  socialName?: string
  email: string
  phoneMobile?: string
  phoneMobileCountry?: string
  phoneAlt?: string
  phoneAltCountry?: string
  whatsapp: boolean
  preferredLocale: 'pt' | 'en' | 'es'
  addressLine1?: string
  addressLine2?: string
  city?: string
  stateCode?: string
  postalCode?: string
  countryCode: string
  positionTitle?: string
  department?: string
  bioPt?: string
  bioEn?: string
  bioEs?: string
  headshotUrl?: string
}

interface CountryCode {
  code: string
  country: string
  flag: string
}

const COUNTRY_CODES: CountryCode[] = [
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
]

interface AuthUser {
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: any
}

// Format phone number for Brazil
const formatBrazilianPhone = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  // Format based on length
  if (digits.length <= 2) {
    return digits
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  } else {
    // Mobile format with 9 digits
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }
}

// Format phone number for USA/Canada
const formatUSPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '')
  
  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

// Generic phone formatter
const formatPhoneNumber = (value: string, countryCode: string): string => {
  if (!value) return ''
  
  switch (countryCode) {
    case '+55': // Brazil
      return formatBrazilianPhone(value)
    case '+1': // USA/Canada
      return formatUSPhone(value)
    default:
      // For other countries, just remove non-digits and format simply
      const digits = value.replace(/\D/g, '')
      if (digits.length <= 10) return digits
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }
}

export default function Account() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    loadUserData()
  }, [session])

  const loadUserData = async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get auth user data
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError
      setAuthUser(user)

      // Try to get team member profile (the correct table is team_members, not employees)
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (memberData) {
        // Extract country code and phone number from phones array
        const parseMobilePhone = (phones: string[] | null) => {
          if (!phones || phones.length === 0) return { country: '+55', number: '' }
          const phone = phones[0] // First phone is mobile
          const match = phone.match(/^(\+\d+)\s*(.*)/)
          if (match) return { country: match[1], number: match[2] }
          return { country: '+55', number: phone }
        }
        
        const parseAltPhone = (phones: string[] | null) => {
          if (!phones || phones.length < 2) return { country: '+55', number: '' }
          const phone = phones[1] // Second phone is alternative
          const match = phone.match(/^(\+\d+)\s*(.*)/)
          if (match) return { country: match[1], number: match[2] }
          return { country: '+55', number: phone }
        }
        
        const mobile = parseMobilePhone(memberData.phones)
        const alt = parseAltPhone(memberData.phones)
        
        setProfile({
          id: memberData.id,
          fullName: memberData.full_name,
          socialName: memberData.social_name,
          email: memberData.email,
          phoneMobile: mobile.number,
          phoneMobileCountry: mobile.country,
          phoneAlt: alt.number,
          phoneAltCountry: alt.country,
          whatsapp: memberData.whatsapp ?? true,
          preferredLocale: memberData.preferred_locale || 'pt',
          addressLine1: memberData.address_line1,
          addressLine2: memberData.address_line2,
          city: memberData.city,
          stateCode: memberData.state_code,
          postalCode: memberData.postal_code,
          countryCode: memberData.country_code || 'BR',
          positionTitle: memberData.role,
          department: memberData.department,
          bioPt: memberData.bio_pt,
          bioEn: memberData.bio_en,
          bioEs: memberData.bio_es,
          headshotUrl: memberData.headshot_url,
        })
      } else {
        // Create basic profile from auth user
        setProfile({
          id: '',
          fullName: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          email: user?.email || '',
          phoneMobileCountry: '+55',
          phoneAltCountry: '+55',
          whatsapp: true,
          preferredLocale: 'pt',
          countryCode: 'BR',
        })
      }
    } catch (err: any) {
      console.error('Error loading user data:', err)
      setError(err.message || 'Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setEditedProfile({ ...profile })
    setError(null)
    setSuccess(false)
  }

  const handleCancel = () => {
    setEditing(false)
    setEditedProfile({})
    setError(null)
  }

  const handleSave = async () => {
    if (!session?.user || !editedProfile) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // Update team member profile if exists
      if (profile?.id) {
        // Build phones array with country codes
        const phones: string[] = []
        if (editedProfile.phoneMobile) {
          phones.push(`${editedProfile.phoneMobileCountry || '+55'} ${editedProfile.phoneMobile}`)
        }
        if (editedProfile.phoneAlt) {
          phones.push(`${editedProfile.phoneAltCountry || '+55'} ${editedProfile.phoneAlt}`)
        }
        
        const updateData = {
          full_name: editedProfile.fullName,
          social_name: editedProfile.socialName || null,
          phones: phones,
          whatsapp: editedProfile.whatsapp,
          preferred_locale: editedProfile.preferredLocale,
          address_line1: editedProfile.addressLine1 || null,
          address_line2: editedProfile.addressLine2 || null,
          city: editedProfile.city || null,
          state_code: editedProfile.stateCode || null,
          postal_code: editedProfile.postalCode || null,
          country_code: editedProfile.countryCode,
          department: editedProfile.department || null,
          bio_pt: editedProfile.bioPt || null,
          bio_en: editedProfile.bioEn || null,
          bio_es: editedProfile.bioEs || null,
          updated_at: new Date().toISOString(),
        }

        const { error: updateError } = await supabase
          .from('team_members')
          .update(updateData)
          .eq('id', profile.id)

        if (updateError) throw updateError
      }

      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: editedProfile.fullName,
        }
      })

      if (authError) throw authError

      setProfile(editedProfile as UserProfile)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setError(err.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const displayProfile = editing ? editedProfile : profile

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">My Account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your profile information and preferences
          </p>
        </div>
        {!editing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
          <Check className="h-5 w-5" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold">
              {displayProfile?.headshotUrl ? (
                <img 
                  src={displayProfile.headshotUrl} 
                  alt={displayProfile.fullName} 
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                displayProfile?.fullName?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
                <Camera className="h-4 w-4 text-slate-300" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">
              {displayProfile?.socialName || displayProfile?.fullName || 'User'}
            </h2>
            {displayProfile?.socialName && displayProfile?.fullName && (
              <p className="text-xs text-slate-500">{displayProfile.fullName}</p>
            )}
            <p className="text-sm text-slate-400">{displayProfile?.email}</p>
            {displayProfile?.positionTitle && (
              <p className="text-sm text-indigo-400 mt-1">{displayProfile.positionTitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            {editing ? (
              <input
                type="text"
                value={displayProfile?.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full legal name"
              />
            ) : (
              <p className="text-slate-100">{displayProfile?.fullName || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Social Name
            </label>
            {editing ? (
              <input
                type="text"
                value={displayProfile?.socialName || ''}
                onChange={(e) => handleInputChange('socialName', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Preferred name (optional)"
              />
            ) : (
              <p className="text-slate-100">{displayProfile?.socialName || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <p className="text-slate-100">{displayProfile?.email || '—'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Preferred Language
            </label>
            {editing ? (
              <select
                value={displayProfile?.preferredLocale || 'pt'}
                onChange={(e) => handleInputChange('preferredLocale', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            ) : (
              <p className="text-slate-100">
                {displayProfile?.preferredLocale === 'pt' ? 'Português' : 
                 displayProfile?.preferredLocale === 'en' ? 'English' : 
                 displayProfile?.preferredLocale === 'es' ? 'Español' : '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Mobile Phone
            </label>
            {editing ? (
              <div className="flex gap-2">
                <select
                  value={displayProfile?.phoneMobileCountry || '+55'}
                  onChange={(e) => handleInputChange('phoneMobileCountry', e.target.value)}
                  className="w-32 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COUNTRY_CODES.map(({ code, country, flag }) => (
                    <option key={code} value={code}>
                      {flag} {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={displayProfile?.phoneMobile || ''}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value, displayProfile?.phoneMobileCountry || '+55')
                    handleInputChange('phoneMobile', formatted)
                  }}
                  className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="(11) 98765-4321"
                />
              </div>
            ) : (
              <p className="text-slate-100">
                {displayProfile?.phoneMobile 
                  ? `${displayProfile.phoneMobileCountry || '+55'} ${displayProfile.phoneMobile}` 
                  : '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Alternative Phone
            </label>
            {editing ? (
              <div className="flex gap-2">
                <select
                  value={displayProfile?.phoneAltCountry || '+55'}
                  onChange={(e) => handleInputChange('phoneAltCountry', e.target.value)}
                  className="w-32 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {COUNTRY_CODES.map(({ code, country, flag }) => (
                    <option key={code} value={code}>
                      {flag} {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={displayProfile?.phoneAlt || ''}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value, displayProfile?.phoneAltCountry || '+55')
                    handleInputChange('phoneAlt', formatted)
                  }}
                  className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="(11) 3456-7890"
                />
              </div>
            ) : (
              <p className="text-slate-100">
                {displayProfile?.phoneAlt 
                  ? `${displayProfile.phoneAltCountry || '+55'} ${displayProfile.phoneAlt}` 
                  : '—'}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            {editing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={displayProfile?.whatsapp || false}
                  onChange={(e) => handleInputChange('whatsapp', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900/50 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-300">WhatsApp enabled on mobile number</span>
              </label>
            ) : (
              <p className="text-slate-100">
                WhatsApp: {displayProfile?.whatsapp ? '✓ Enabled' : '✗ Disabled'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Work Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Position Title
            </label>
            {editing ? (
              <input
                type="text"
                value={displayProfile?.positionTitle || ''}
                onChange={(e) => handleInputChange('positionTitle', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100">{displayProfile?.positionTitle || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Department
            </label>
            {editing ? (
              <input
                type="text"
                value={displayProfile?.department || ''}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100">{displayProfile?.department || '—'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address Line 1
            </label>
            {editing ? (
              <input
                type="text"
                value={displayProfile?.addressLine1 || ''}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100">{displayProfile?.addressLine1 || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address Line 2
            </label>
            {editing ? (
              <input
                type="text"
                value={displayProfile?.addressLine2 || ''}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100">{displayProfile?.addressLine2 || '—'}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                City
              </label>
              {editing ? (
                <input
                  type="text"
                  value={displayProfile?.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-100">{displayProfile?.city || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                State
              </label>
              {editing ? (
                <input
                  type="text"
                  value={displayProfile?.stateCode || ''}
                  onChange={(e) => handleInputChange('stateCode', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-100">{displayProfile?.stateCode || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Postal Code
              </label>
              {editing ? (
                <input
                  type="text"
                  value={displayProfile?.postalCode || ''}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-slate-100">{displayProfile?.postalCode || '—'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <h3 className="text-lg font-semibold text-slate-100">Biography</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio (Português)
            </label>
            {editing ? (
              <textarea
                value={displayProfile?.bioPt || ''}
                onChange={(e) => handleInputChange('bioPt', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100 whitespace-pre-wrap">{displayProfile?.bioPt || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio (English)
            </label>
            {editing ? (
              <textarea
                value={displayProfile?.bioEn || ''}
                onChange={(e) => handleInputChange('bioEn', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100 whitespace-pre-wrap">{displayProfile?.bioEn || '—'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio (Español)
            </label>
            {editing ? (
              <textarea
                value={displayProfile?.bioEs || ''}
                onChange={(e) => handleInputChange('bioEs', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-slate-100 whitespace-pre-wrap">{displayProfile?.bioEs || '—'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
