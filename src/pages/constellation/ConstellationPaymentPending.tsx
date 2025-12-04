import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { ConstellationUrls } from '../../utils/constellationUrl'
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

export default function ConstellationPaymentPending() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed' | null>(null)
  const [loading, setLoading] = useState(true)
  const [memberData, setMemberData] = useState<any>(null)

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session)
      if (!session) {
        navigate(ConstellationUrls.login())
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
      setSession(session)
      if (!session) {
        navigate(ConstellationUrls.login())
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  useEffect(() => {
    if (!session?.user?.id) return

    const checkPaymentStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('founding_members')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching payment status:', error)
          return
        }

        if (data) {
          setMemberData(data)
          setPaymentStatus(data.payment_status)

          // If payment is complete, redirect to dashboard
          if (data.payment_status === 'paid') {
            setTimeout(() => {
              navigate(ConstellationUrls.dashboard())
            }, 2000)
          }
        }
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkPaymentStatus()

    // Poll every 5 seconds to check if payment completed
    const interval = setInterval(checkPaymentStatus, 5000)

    return () => clearInterval(interval)
  }, [session, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate(ConstellationUrls.login())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/constellation-logo.png" 
            alt="Constellation" 
            className="h-16 mx-auto mb-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Cadastro Quase Completo!
          </h1>
        </div>

        {/* Status Card */}
        {paymentStatus === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-yellow-300 mb-2">
                  Aguardando Pagamento
                </h2>
                <p className="text-slate-300 mb-4">
                  Seu cadastro foi criado com sucesso, mas ainda estamos aguardando a confirmação do seu pagamento PIX de <strong>R$ 99,00</strong>.
                </p>
                <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-slate-400 mb-2">
                    <strong>O que fazer agora:</strong>
                  </p>
                  <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
                    <li>Complete o pagamento PIX usando o código que você recebeu</li>
                    <li>Aguarde alguns minutos para o pagamento ser processado</li>
                    <li>Esta página atualizará automaticamente quando o pagamento for confirmado</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'paid' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-emerald-300 mb-2">
                  Pagamento Confirmado! 🎉
                </h2>
                <p className="text-slate-300">
                  Seu pagamento foi confirmado. Redirecionando para o dashboard...
                </p>
              </div>
            </div>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <XCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-red-300 mb-2">
                  Pagamento Não Confirmado
                </h2>
                <p className="text-slate-300 mb-4">
                  Houve um problema com seu pagamento. Por favor, entre em contato conosco.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-2">
                ⚠️ Importante: Complete seu Pagamento
              </h3>
              <p className="text-slate-300 text-sm mb-3">
                Seu cadastro será <strong>cancelado automaticamente</strong> se o pagamento não for confirmado em até <strong>24 horas</strong>.
              </p>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Você perderá sua vaga no programa Founding 100</li>
                <li>• Não terá acesso ao preço promocional de R$ 99</li>
                <li>• Precisará se cadastrar novamente pagando o preço regular</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Member Info */}
        {memberData && (
          <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Seus Dados</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Nome:</p>
                <p className="text-white font-medium">{memberData.full_name}</p>
              </div>
              <div>
                <p className="text-slate-400">Email:</p>
                <p className="text-white font-medium">{memberData.email}</p>
              </div>
              <div>
                <p className="text-slate-400">Telefone:</p>
                <p className="text-white font-medium">{memberData.phone}</p>
              </div>
              <div>
                <p className="text-slate-400">Valor:</p>
                <p className="text-white font-medium">R$ 99,00</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(ConstellationUrls.signup())}
            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
          >
            Refazer Pagamento
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Auto-refresh indicator */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Verificando status do pagamento automaticamente...
        </p>
      </div>
    </div>
  )
}
