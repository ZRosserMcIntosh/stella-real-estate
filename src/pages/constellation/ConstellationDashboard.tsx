import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { ConstellationUrls } from '../../utils/constellationUrl'
import ConstellationHeader from '../../components/ConstellationHeader'

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export default function ConstellationDashboard() {
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | null>(null)
  const [memberData, setMemberData] = useState<any>(null)
  const [conversionTracked, setConversionTracked] = useState(false)
  const navigate = useNavigate()
  const { session } = useAuth()

  useEffect(() => {
    if (!session) {
      navigate(ConstellationUrls.login())
      return
    }

    checkPaymentStatus()
  }, [session, navigate])

  // Fire Google Ads conversion event when payment is confirmed
  useEffect(() => {
    if (paymentStatus === 'paid' && !conversionTracked && typeof window !== 'undefined' && window.gtag) {
      console.log('🎉 Firing Google Ads purchase conversion event')
      
      // Fire Google Ads conversion event
      window.gtag('event', 'purchase', {
        transaction_id: memberData?.stripe_payment_intent_id || memberData?.id || 'unknown',
        value: 99.00, // Constellation membership price in BRL
        currency: 'BRL',
        items: [{
          item_id: 'constellation_membership',
          item_name: 'Constellation Founding Member',
          price: 99.00,
          quantity: 1
        }]
      })
      
      setConversionTracked(true)
    }
  }, [paymentStatus, conversionTracked, memberData])

  const checkPaymentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('founding_members')
        .select('*')
        .eq('user_id', session?.user?.id)
        .single()

      if (error) {
        console.error('Error fetching member data:', error)
        setLoading(false)
        return
      }

      setMemberData(data)
      setPaymentStatus(data.payment_status)
      setLoading(false)
    } catch (err) {
      console.error('Error:', err)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate(ConstellationUrls.login())
  }

  if (loading) {
    return (
      <>
        <ConstellationHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center pt-20">
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </>
    )
  }

  // User has pending payment
  if (paymentStatus === 'pending') {
    return (
      <>
        <ConstellationHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 pt-24">
          <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Pagamento Pendente
          </h1>
          
          <p className="text-lg text-slate-300 mb-6">
            Obrigado pelo seu interesse na Constellation, {memberData?.full_name}!
          </p>

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
            <p className="text-slate-300 mb-4">
              Você ainda precisa completar seu pagamento para ter acesso à plataforma Constellation.
            </p>
            <p className="text-sm text-slate-400">
              Se você acabou de completar o pagamento, aguarde alguns segundos e clique em "Atualizar Status" abaixo.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setLoading(true)
                checkPaymentStatus()
              }}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Atualizar Status
            </button>
            <button
              onClick={() => navigate(ConstellationUrls.signup())}
              className="py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all"
            >
              Completar Pagamento
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
      </>
    )
  }

  // User has paid
  if (paymentStatus === 'paid') {
    return (
      <>
        <ConstellationHeader />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 pt-24">
        <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Bem-vindo à Constellation!
          </h1>
          
          <p className="text-lg text-slate-300 mb-2">
            Obrigado, {memberData?.full_name}!
          </p>
          
          {memberData?.member_number && (
            <p className="text-sm text-indigo-400 mb-6">
              Membro Fundador
            </p>
          )}

          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
            <p className="text-slate-300 mb-4">
              Seu pagamento foi confirmado. Você agora é um <span className="text-indigo-400 font-semibold">Membro Fundador</span> da Constellation!
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Email: <span className="text-white">{memberData?.email}</span><br/>
              CRECI: <span className="text-white">{memberData?.creci_number}/{memberData?.creci_uf}</span><br/>
              Status: <span className="text-green-400">Pago</span><br/>
              {memberData?.payment_completed_at && (
                <>Membro desde: <span className="text-white">{new Date(memberData.payment_completed_at).toLocaleDateString('pt-BR')}</span></>
              )}
            </p>
            <p className="text-slate-300">
              Notificaremos você via email em <span className="text-indigo-400">{memberData?.email}</span> quando seu painel Constellation estiver pronto.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(ConstellationUrls.siteBuilder())}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Construtor de Sites
            </button>
            <button
              onClick={() => navigate(ConstellationUrls.home())}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
            >
              Voltar ao Portal
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
            >
              Sair
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-8">
            Painel em breve • Estamos construindo sua plataforma personalizada
          </p>
        </div>
      </div>
      </>
    )
  }

  // Fallback - no payment record found
  return (
    <>
      <ConstellationHeader />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 pt-24">
        <div className="max-w-2xl w-full bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 text-center">
          <p className="text-white">Nenhum registro de pagamento encontrado. Entre em contato com o suporte.</p>
          <button
            onClick={handleSignOut}
            className="mt-4 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg font-medium transition-all"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  )
}
