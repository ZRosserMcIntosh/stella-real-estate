import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
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
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleModeSwitch = (signUp: boolean) => {
    if (signUp !== isSignUp) {
      setIsTransitioning(true);
      setIsSignUp(signUp);
      setError('');
      setSignUpStep(1); // Reset to step 1 when switching
      setInvitationCode('');
      setValidatedInvitation(null);
      setPassword('');
      setConfirmPassword('');
      
      // Delay form expansion to create sequential animation effect
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1200); // Match the slider transition duration
    }
  };

  // Format invitation code as user types (XXXX-XXXX-XXXX-XXXX)
  const formatInvitationCode = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    // Add dashes every 4 digits
    const formatted = limited.match(/.{1,4}/g)?.join('-') || limited;
    return formatted;
  };

  const handleInvitationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInvitationCode(e.target.value);
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
      const { data, error: validateError } = await supabase.rpc('validate_invitation_code', {
        p_code: invitationCode,
        p_email: email.toLowerCase(),
      });

      if (validateError) throw validateError;

      if (data && data.valid) {
        setValidatedInvitation(data);
        return true;
      } else {
        setError(data?.error || 'Código de convite inválido ou expirado');
        return false;
      }
    } catch (err: any) {
      setError('Erro ao validar código de convite');
      return false;
    } finally {
      setLoading(false);
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

    // Demo mode check
    if (email.toLowerCase() === 'demo' && password === 'stella') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
      return;
    }

    try {
      if (isSignUp) {
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
          // Mark invitation code as used
          await supabase.rpc('use_invitation_code', {
            p_code: invitationCode,
            p_user_id: data.user.id,
          });

          // Create team member record
          await supabase.from('team_members').insert({
            user_id: data.user.id,
            full_name: validatedInvitation.full_name,
            email: email.toLowerCase(),
            role: validatedInvitation.role,
            department: validatedInvitation.department,
            status: 'active',
          });

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
      } else {
        // Sign in logic
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          // Check if user is a founding member
          const { data: foundingMember } = await supabase
            .from('founding_members')
            .select('*')
            .eq('email', email.toLowerCase())
            .single();

          if (foundingMember) {
            navigate('/member/dashboard');
          } else {
            navigate('/admin');
          }
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/[0.035] backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-500 ease-in-out">
          {/* Stella Logo/Title */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img 
                src="/stella-logo.png" 
                alt="Stella Logo" 
                className="h-24 sm:h-32 w-auto object-contain"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 4px rgba(251, 191, 36, 0.2))'
                }}
              />
            </div>
            <h1 
              className="text-xl sm:text-2xl font-light uppercase tracking-[0.4em] text-amber-200/80 mb-2" 
              style={{ 
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 300,
                textShadow: '0 0 12px rgba(251, 191, 36, 0.3)'
              }}
            >
              EXECUTIVE LOGIN
            </h1>
          </div>

          {/* Mode Toggle - Slider Switch */}
          <div className="relative flex mb-4 sm:mb-6 p-1 bg-white/5 rounded-xl border border-white/10">
            {/* Sliding indicator background */}
            <div 
              className="absolute top-1 bottom-1 rounded-lg bg-amber-500/20 border border-amber-500/30 shadow-lg transition-all ease-in-out"
              style={{
                width: 'calc(50% - 4px)',
                left: isSignUp ? 'calc(50% + 0px)' : '4px',
                transitionDuration: '1200ms',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
            <button
              type="button"
              onClick={() => handleModeSwitch(false)}
              className={`relative z-10 flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-colors duration-700 ${
                !isSignUp
                  ? 'text-amber-200'
                  : 'text-white/40'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              {t('constellation.signin')}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch(true)}
              className={`relative z-10 flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-xs sm:text-sm font-medium uppercase tracking-wider transition-colors duration-700 ${
                isSignUp
                  ? 'text-amber-200'
                  : 'text-white/40'
              }`}
              style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
            >
              {t('constellation.signup')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignUp && signUpStep === 1 ? handleSignUpStep1Submit : handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Step indicator for sign up */}
            {isSignUp && !isTransitioning && (
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`w-8 h-1 rounded-full transition-all ${signUpStep === 1 ? 'bg-amber-500' : 'bg-amber-500/30'}`} />
                <div className={`w-8 h-1 rounded-full transition-all ${signUpStep === 2 ? 'bg-amber-500' : 'bg-white/10'}`} />
              </div>
            )}

            {/* Sign Up Step 1: Email + Invitation Code */}
            {isSignUp && signUpStep === 1 && !isTransitioning && (
              <>
                <div className="animate-fadeIn">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm"
                    placeholder="voce@email.com.br"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>

                <div className="animate-fadeIn">
                  <label htmlFor="invitationCode" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Código de Convite
                  </label>
                  <input
                    id="invitationCode"
                    type="text"
                    value={invitationCode}
                    onChange={handleInvitationCodeChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm font-mono tracking-widest"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    required
                    maxLength={19}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                  <p className="mt-1.5 text-[10px] sm:text-xs text-white/40">
                    Entre com o código de 16 dígitos fornecido pelo administrador
                  </p>
                </div>
              </>
            )}

            {/* Sign Up Step 2: Password + Confirm */}
            {isSignUp && signUpStep === 2 && !isTransitioning && (
              <>
                <div className="animate-fadeIn p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200/80 text-xs">
                  Bem-vindo, <strong>{validatedInvitation?.full_name}</strong>! Crie sua senha para concluir o cadastro.
                </div>

                <div className="animate-fadeIn">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm pr-10"
                      placeholder="senha"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                <div className="animate-fadeIn">
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm pr-10"
                      placeholder="confirme a senha"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Sign In Form */}
            {!isSignUp && (
              <>
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    {t('constellation.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm"
                    placeholder="voce@email.com.br"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80 mb-1.5 sm:mb-2" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
                    {t('constellation.password')}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-xs sm:text-sm pr-10"
                      placeholder="senha"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg sm:rounded-xl text-red-200 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              {/* Back button for step 2 */}
              {isSignUp && signUpStep === 2 && !isTransitioning && (
                <button
                  type="button"
                  onClick={() => {
                    setSignUpStep(1);
                    setPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 text-white/60 rounded-lg sm:rounded-xl font-medium uppercase tracking-wider hover:bg-white/10 hover:text-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-xs sm:text-sm"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                >
                  Voltar
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500/20 border border-amber-500/30 text-amber-200 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-medium uppercase tracking-wider hover:bg-amber-500/30 hover:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/25 text-xs sm:text-sm"
                style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
              >
                {loading ? t('constellation.loading') : 
                  isSignUp ? (signUpStep === 1 ? 'Continuar' : 'Criar Conta') : 
                  t('constellation.signin_button')}
              </button>
            </div>
          </form>

          {!isSignUp && !isTransitioning && (
            <div className="mt-4 sm:mt-6 text-center animate-fadeIn">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-amber-200/60 hover:text-amber-200 transition-colors text-xs sm:text-sm"
              >
                {t('auth.back_to_home')}
              </button>
            </div>
          )}
        </div>

        {/* Demo mode hint */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-white/30 text-[10px] sm:text-xs">
            Demo: email: demo, password: stella
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
