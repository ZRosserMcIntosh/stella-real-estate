import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Star, Award, Gift, Sparkles, Lock } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Members() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [member, setMember] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate('/admin/login?redirect=/members')
        return
      }

      setUser(user)

      // Check if user is a founding member
      const { data: memberData } = await supabase
        .from('founding_members')
        .select('*')
        .eq('email', user.email)
        .eq('payment_status', 'paid')
        .single()

      if (!memberData) {
        navigate('/precos')
        return
      }

      setMember(memberData)
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/admin/login?redirect=/members')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!member) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Helmet>
        <title>Área de Membros - Founding 100 - Stella</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/50 rounded-full px-6 py-2 mb-6">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Founding Member #{member.member_number}</span>
          </div>
          <h1 className="text-5xl font-light mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Bem-vindo, {member.full_name?.split(' ')[0] || 'Membro'}!
          </h1>
          <p className="text-xl text-slate-300">
            Você faz parte dos primeiros 100 membros da Plataforma Stella
          </p>
        </div>

        {/* Member Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold">Seu Número</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-400">#{member.member_number}</p>
            <p className="text-sm text-slate-400 mt-2">De 100 membros fundadores</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold">Desconto</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">{member.discount_percentage}%</p>
            <p className="text-sm text-slate-400 mt-2">Desconto vitalício</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Status</h3>
            </div>
            <p className="text-3xl font-bold text-emerald-400">Ativo</p>
            <p className="text-sm text-slate-400 mt-2">Benefícios ativos</p>
          </div>
        </div>

        {/* Benefits Overview */}
        <div className="bg-slate-800/50 border border-emerald-500/50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-light mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Seus Benefícios Founding 100
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/10 rounded-lg p-3">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">24 Meses Team Plan</h3>
                <p className="text-slate-400">Acesso completo ao plano Team por 2 anos após o lançamento</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-500/10 rounded-lg p-3">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Desconto Vitalício 75%</h3>
                <p className="text-slate-400">Desconto permanente em todas as futuras assinaturas</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 rounded-lg p-3">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Mapas 3D Extras R$ 10</h3>
                <p className="text-slate-400">Preço especial vs. R$ 40 no plano regular</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-yellow-500/10 rounded-lg p-3">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Badge Founding Partner</h3>
                <p className="text-slate-400">Reconhecimento especial no seu perfil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 border border-slate-700 rounded-2xl p-12 text-center">
          <Lock className="w-16 h-16 text-slate-500 mx-auto mb-6" />
          <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Mais Recursos em Breve
          </h2>
          <p className="text-slate-400 text-lg mb-6 max-w-2xl mx-auto">
            Estamos trabalhando duro para trazer a plataforma completa para você. 
            Como membro fundador, você será o primeiro a ter acesso a todos os novos recursos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-slate-800/50 rounded-lg px-6 py-3 border border-slate-700">
              <p className="text-sm text-slate-400">Dashboard Completo</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-6 py-3 border border-slate-700">
              <p className="text-sm text-slate-400">Gestão de Imóveis</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg px-6 py-3 border border-slate-700">
              <p className="text-sm text-slate-400">CRM Constellation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
