import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1); // Step 1: email + code, Step 2: password
  const [email, setEmail] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [validatedInvitation, setValidatedInvitation] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Static background stars - memoized to prevent regeneration on re-renders
  const staticStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []); // Empty deps - only generate once

  // Shooting stars - memoized to prevent regeneration on re-renders
  const shootingStars = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: 0,
      duration: (Math.random() * 2 + 3) * (0.7 + Math.random() * 0.6),
      left: i < 4 ? Math.random() * 33 : i < 6 ? Math.random() * 60 + 20 : Math.random() * 20 + 80,
      top: i < 4 ? Math.random() * 30 : i < 6 ? Math.random() * 40 + 10 : i < 8 ? Math.random() * 50 : Math.random() * 50 + 50,
      width: 100 * (0.7 + Math.random() * 0.6),
      opacity: 0.7 + Math.random() * 0.6,
    }));
  }, []); // Empty deps - only generate once

  // Format invitation code as user types (XXXX-XXXX-XXXX-XXXX) - numeric only
  const formatInvitationCode = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = cleaned.slice(0, 16);
    // Add dashes every 4 characters
    const formatted = limited.match(/.{1,4}/g)?.join('-') || limited;
    return formatted;
  };

  const handleInvitationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInvitationCode(e.target.value);
    setInvitationCode(formatted);
  };

  const handleInvitationCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formatted = formatInvitationCode(pastedText);
    setInvitationCode(formatted);
  };

  const validateInvitationCode = async () => {
    if (invitationCode.replace(/-/g, '').length !== 16) {
      setError('Código de convite deve ter 16 dígitos');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔍 Validating invitation code:', invitationCode);
      console.log('� For email:', email.toLowerCase());

      // Validate against Supabase database
      const { data, error: validateError } = await supabase.rpc('validate_invitation_code', {
        p_code: invitationCode,
        p_email: email.toLowerCase(),
      });

      console.log('📦 Supabase response:', { data, error: validateError });

      if (validateError) {
        console.error('❌ Supabase validation error:', validateError);
        setError('Código de convite inválido ou expirado');
        setLoading(false);
        return false;
      }

      if (data && data.valid) {
        console.log('✅ Valid invitation found!');
        setValidatedInvitation({ 
          ...data, 
          source: 'supabase',
          org_name: 'Stella Real Estate',
        });
        setLoading(false);
        return true;
      } else {
        console.log('❌ Invalid invitation:', data?.error);
        setError(data?.error || 'Código de convite inválido ou expirado');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error('❌ Validation error:', err);
      setError('Erro ao validar código. Tente novamente.');
      setLoading(false);
      return false;
    }
  };

  const handleSignUpStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateInvitationCode();
    if (isValid) {
      setSignUpStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // This should only be called from step 2
      if (signUpStep !== 2 || !validatedInvitation) {
        setError('Processo de cadastro inválido');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError(t('auth.password_mismatch'));
        setLoading(false);
        return;
      }
      
      // Sign up logic
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: validatedInvitation.full_name,
            role: validatedInvitation.role,
            department: validatedInvitation.department,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Mark invitation code as used based on source
        if (validatedInvitation.source === 'localStorage') {
          // Update localStorage invitation
          const INVITE_KEY = 'stella:onboarding:invites';
          try {
            const stored = localStorage.getItem(INVITE_KEY);
            if (stored) {
              const invites = JSON.parse(stored);
              const updatedInvites = invites.map((inv: any) => 
                inv.code === validatedInvitation.code 
                  ? { ...inv, uses: inv.uses + 1 }
                  : inv
              );
              localStorage.setItem(INVITE_KEY, JSON.stringify(updatedInvites));
            }
          } catch (err) {
            console.error('Failed to update localStorage invitation:', err);
          }
        } else {
          // Mark invitation code as used in Supabase
          try {
            await supabase.rpc('use_invitation_code', {
              p_code: invitationCode,
              p_user_id: data.user.id,
            });
          } catch (err) {
            console.error('Failed to mark invitation as used in Supabase:', err);
          }
        }

        // Try to create team member record (optional, might not have table)
        try {
          await supabase.from('team_members').insert({
            user_id: data.user.id,
            full_name: validatedInvitation.full_name || email.split('@')[0],
            email: email.toLowerCase(),
            role: validatedInvitation.role,
            department: validatedInvitation.department,
            status: 'active',
          });
        } catch (err) {
          console.error('Team member record creation failed (table may not exist):', err);
        }

        // Check if user is a founding member
        const { data: foundingMember } = await supabase
          .from('founding_members')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (foundingMember) {
          navigate('/member/onboarding');
        } else {
          navigate('/admin');
        }
      }
    } catch (err: any) {
      setError(err.message || t('auth.error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        html, body {
          background: linear-gradient(to bottom, #050505, #080606, #050505) !important;
          background-attachment: fixed;
          min-height: 100vh;
        }
        /* Force inputs to respect case sensitivity */
        #email, #password, #confirmPassword {
          text-transform: none !important;
          font-variant: normal !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
        /* Force placeholder to be lowercase too */
        #email::placeholder, #password::placeholder, #confirmPassword::placeholder {
          text-transform: none !important;
        }
      `}</style>
      <div className="relative min-h-screen bg-gradient-to-b from-[#050505] via-[#080606] to-[#050505] flex items-center justify-center px-4 py-4 sm:py-8">
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#050505] via-[#080606] to-[#050505]">
        {staticStars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-amber-100/70 animate-pulse"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
              animationDelay: star.animationDelay + 's',
              animationDuration: star.animationDuration + 's',
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* Shooting stars effect */}
      <style>{`
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translateX(-500px) translateY(500px) rotate(-45deg);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, rgba(255, 250, 240, 0.9), rgba(251, 191, 36, 0.5), transparent);
          animation: shoot linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.width}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* SignUp Card */}
      <div className="relative z-10 w-full max-w-xs">
        <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-5 transition-all duration-500 ease-in-out">
          {/* Stella Logo/Title */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img 
                src="/stella-logo.png" 
                alt="Stella Logo" 
                className="h-16 sm:h-20 w-auto object-contain"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(251, 191, 36, 0.2))'
                }}
              />
            </div>
            <h1 
              className="text-sm sm:text-base font-light uppercase tracking-[0.4em] text-amber-200/80 mb-2" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 300,
                textShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
              }}
            >
              CADASTRAR
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={signUpStep === 1 ? handleSignUpStep1Submit : handleSubmit} className="space-y-3 sm:space-y-3.5">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-6 h-0.5 rounded-full transition-all ${signUpStep === 1 ? 'bg-amber-500' : 'bg-amber-500/30'}`} />
              <div className={`w-6 h-0.5 rounded-full transition-all ${signUpStep === 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
            </div>

            {/* Step 1: Email + Invitation Code */}
            {signUpStep === 1 && (
              <>
                <div className="animate-fadeIn">
                  <label htmlFor="email" className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mb-1 sm:mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-[10px] sm:text-xs"
                    placeholder="voce@email.com.br"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>

                <div className="animate-fadeIn">
                  <label htmlFor="invitationCode" className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mb-1 sm:mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Código de Convite
                  </label>
                  <input
                    id="invitationCode"
                    type="text"
                    value={invitationCode}
                    onChange={handleInvitationCodeChange}
                    onPaste={handleInvitationCodePaste}
                    className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-[10px] sm:text-xs font-mono tracking-widest"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    required
                    maxLength={19}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <p className="mt-1 text-[9px] sm:text-[10px] text-white/40">
                    Entre com o código de 16 caracteres fornecido pelo administrador
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Password + Confirm */}
            {signUpStep === 2 && (
              <>
                <div className="animate-fadeIn p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200/80 text-[10px]">
                  Bem-vindo, <strong>{validatedInvitation?.full_name}</strong>! Crie sua senha para concluir o cadastro.
                </div>

                <div className="animate-fadeIn">
                  <label htmlFor="password" className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mb-1 sm:mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-[10px] sm:text-xs pr-9"
                      placeholder="senha"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <label htmlFor="confirmPassword" className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-white/80 mb-1 sm:mb-1.5" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-2.5 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-[10px] sm:text-xs pr-9"
                      placeholder="confirme a senha"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-200 text-[10px] sm:text-xs">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              {/* Back button for step 2 */}
              {signUpStep === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setSignUpStep(1);
                    setPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-lg sm:rounded-xl font-medium uppercase tracking-wider hover:bg-white/10 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-[10px] sm:text-xs"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                >
                  Voltar
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500/20 border border-amber-500/30 text-amber-200 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium uppercase tracking-wider hover:bg-amber-500/30 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/25 text-[10px] sm:text-xs"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                {loading ? t('constellation.loading') : (signUpStep === 1 ? 'Continuar' : 'Criar Conta')}
              </button>
            </div>
          </form>

          <div className="mt-3 sm:mt-4 animate-fadeIn">
            <div className="flex items-center justify-between text-[10px] sm:text-xs">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-amber-200/60 hover:text-amber-200 transition-colors font-medium"
              >
                ← Voltar
              </button>
              <Link
                to="/forgot-password"
                className="text-amber-200/60 hover:text-amber-200 transition-colors font-medium"
              >
                Esqueci Senha
              </Link>
              <Link
                to="/admin/login"
                className="text-amber-200/60 hover:text-amber-200 transition-colors font-medium"
              >
                ← Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
