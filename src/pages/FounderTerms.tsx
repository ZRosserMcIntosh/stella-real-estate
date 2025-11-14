import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'

export default function FounderTerms() {
  const siteUrl = window.location.origin
  const pageUrl = `${siteUrl}/founder-terms`

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Helmet>
        <title>Termos do Programa Founding 100 - Stella</title>
        <meta name="description" content="Termos e condições do programa Founding 100 da Plataforma Stella." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Termos do Programa Founding 100 - Stella" />
        <meta property="og:description" content="Termos e condições do programa Founding 100 da Plataforma Stella." />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <Link
          to="/precos"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Preços
        </Link>

        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-2xl border border-slate-700 p-8 md:p-12">
          <h1 className="text-4xl font-light mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Termos e Condições do Programa Founding 100
          </h1>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Natureza do Programa</h2>
              <p>
                O programa Founding 100 é uma oportunidade exclusiva de apoiar o desenvolvimento da
                Plataforma Stella em fase inicial. Ao participar, você reconhece e aceita que:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>A Plataforma Stella é um <strong>trabalho em progresso</strong> e está em desenvolvimento ativo</li>
                <li>Recursos, funcionalidades e cronogramas estão sujeitos a alterações</li>
                <li>Datas de lançamento antecipadas são <strong>estimativas e não garantias</strong></li>
                <li>Novos recursos podem ser adiados, modificados ou cancelados a critério da Stella</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Política de Reembolso</h2>
              <p>
                Todos os pagamentos do programa Founding 100 são <strong>finais e não reembolsáveis</strong>.
                Ao efetuar o pagamento, você concorda que:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Não serão concedidos reembolsos em nenhuma circunstância</li>
                <li>Esta é uma compra definitiva de benefícios de longo prazo</li>
                <li>Você compreende os riscos associados ao apoio de uma plataforma em desenvolvimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Benefícios Incluídos</h2>
              <p>Como membro Founding 100, você receberá:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li><strong>24 meses de acesso gratuito</strong> ao Plano Team (valor de R$ 11.880)</li>
                <li><strong>Desconto vitalício de 75%</strong> em todas as assinaturas futuras</li>
                <li>Reconhecimento permanente como <strong>Founding Partner</strong></li>
                <li>Mapas 3D extras por apenas <strong>R$ 10</strong> (vs. R$ 40 no plano regular)</li>
                <li>Acesso prioritário a novos recursos e beta testing</li>
                <li>Insignia especial de "Founding 100" no seu perfil</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Condições dos Benefícios</h2>
              <p>
                Os benefícios do programa Founding 100 estão sujeitos às seguintes condições:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Benefícios são <strong>vinculados ao CPF/CNPJ</strong> registrado e não são transferíveis</li>
                <li>
                  Benefícios são <strong>perdidos após 6+ meses consecutivos de inatividade</strong> na plataforma
                </li>
                <li>Acesso ao Plano Team começa após o lançamento oficial da plataforma</li>
                <li>O desconto vitalício de 75% aplica-se apenas enquanto você mantiver uma conta ativa</li>
                <li>A Stella reserva-se o direito de modificar os termos dos benefícios com aviso prévio de 30 dias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Privacidade e Dados</h2>
              <p>
                Ao se cadastrar, você concorda com a coleta e uso dos seus dados conforme nossa{' '}
                <Link to="/privacy-policy" className="text-emerald-400 hover:text-emerald-300 underline">
                  Política de Privacidade
                </Link>
                . Seus dados serão utilizados para:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Processar seu pagamento e criar sua conta</li>
                <li>Comunicar atualizações sobre o desenvolvimento da plataforma</li>
                <li>Validar sua elegibilidade para benefícios do Founding 100</li>
                <li>Verificar seu registro CRECI junto aos órgãos competentes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Elegibilidade</h2>
              <p>Para participar do programa Founding 100, você deve:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Possuir um <strong>registro CRECI válido e ativo</strong></li>
                <li>Ser maior de 18 anos</li>
                <li>Fornecer informações verdadeiras e precisas no cadastro</li>
                <li>Concordar com estes termos e com os Termos de Serviço da Stella</li>
              </ul>
              <p className="mt-4">
                A Stella reserva-se o direito de verificar sua elegibilidade e revogar benefícios caso
                sejam detectadas informações falsas ou violações dos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Limitação de Responsabilidade</h2>
              <p>
                A Stella não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                <li>Atrasos no lançamento da plataforma ou de recursos específicos</li>
                <li>Mudanças na estrutura de preços ou planos após o lançamento</li>
                <li>Indisponibilidade temporária da plataforma para manutenção</li>
                <li>Perda de dados ou conteúdo devido a falhas técnicas</li>
                <li>Danos indiretos, consequenciais ou lucros cessantes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Modificações dos Termos</h2>
              <p>
                A Stella reserva-se o direito de modificar estes termos a qualquer momento.
                Alterações significativas serão comunicadas por e-mail com pelo menos 30 dias de antecedência.
                O uso continuado da plataforma após modificações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas
                nos tribunais competentes do foro da cidade de São Paulo, SP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contato</h2>
              <p>
                Para dúvidas sobre estes termos ou sobre o programa Founding 100, entre em contato:
              </p>
              <ul className="list-none ml-4 mt-2 space-y-2">
                <li>📧 Email: <a href="mailto:founding@stella.com.br" className="text-emerald-400 hover:text-emerald-300">founding@stella.com.br</a></li>
                <li>🌐 Site: <a href="https://stella.com.br" className="text-emerald-400 hover:text-emerald-300">stella.com.br</a></li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                <strong>Última atualização:</strong> 14 de novembro de 2025
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Ao prosseguir com o pagamento do programa Founding 100, você confirma que leu,
                compreendeu e concorda com todos os termos e condições acima.
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/precos"
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              Voltar para Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
