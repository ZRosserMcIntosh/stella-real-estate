// Animated Background Component - Mesmerizing gradient blobs
import React, { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'ballet' | 'admin' | 'subtle'
  interactive?: boolean
}

export function AnimatedBackground({ variant = 'ballet', interactive = true }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    if (!interactive || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [interactive])

  // Color schemes for different variants
  const getColors = () => {
    switch (variant) {
      case 'ballet':
        return {
          blob1: 'from-pink-600/20 via-pink-500/10 to-transparent',
          blob2: 'from-purple-600/20 via-purple-500/10 to-transparent',
          blob3: 'from-blue-600/15 via-blue-500/8 to-transparent',
          blob4: 'from-pink-500/15 via-fuchsia-500/8 to-transparent',
        }
      case 'admin':
        return {
          blob1: 'from-indigo-600/20 via-indigo-500/10 to-transparent',
          blob2: 'from-blue-600/20 via-blue-500/10 to-transparent',
          blob3: 'from-purple-600/15 via-purple-500/8 to-transparent',
          blob4: 'from-cyan-500/15 via-cyan-400/8 to-transparent',
        }
      case 'subtle':
        return {
          blob1: 'from-slate-700/30 via-slate-600/15 to-transparent',
          blob2: 'from-slate-600/30 via-slate-500/15 to-transparent',
          blob3: 'from-slate-700/20 via-slate-600/10 to-transparent',
          blob4: 'from-slate-600/20 via-slate-500/10 to-transparent',
        }
    }
  }

  const colors = getColors()

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ isolation: 'isolate' }}
    >
      {/* Blob 1 - Top Left - Slow floating */}
      <div
        className={`absolute -top-48 -left-48 w-96 h-96 bg-gradient-radial ${colors.blob1} rounded-full blur-3xl opacity-60`}
        style={{
          animation: 'float1 20s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Blob 2 - Top Right - Medium floating */}
      <div
        className={`absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-radial ${colors.blob2} rounded-full blur-3xl opacity-50`}
        style={{
          animation: 'float2 25s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Blob 3 - Bottom Left - Fast floating */}
      <div
        className={`absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-radial ${colors.blob3} rounded-full blur-3xl opacity-40`}
        style={{
          animation: 'float3 18s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Blob 4 - Bottom Right - Slow floating */}
      <div
        className={`absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-gradient-radial ${colors.blob4} rounded-full blur-3xl opacity-50`}
        style={{
          animation: 'float4 22s ease-in-out infinite',
          mixBlendMode: 'screen',
        }}
      />

      {/* Center accent blob - follows mouse on interactive mode */}
      {interactive && (
        <div
          className={`absolute w-[300px] h-[300px] bg-gradient-radial ${colors.blob1} rounded-full blur-3xl opacity-30 transition-all duration-1000 ease-out`}
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${mouseX.current * 0.02}px), calc(-50% + ${mouseY.current * 0.02}px))`,
            animation: 'pulse 8s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Add keyframe animations via style tag */}
      <style>{`
        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, 100px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 50px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-80px, 60px) scale(1.15);
          }
          66% {
            transform: translate(40px, -40px) scale(0.95);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(70px, -80px) scale(1.2) rotate(10deg);
          }
          66% {
            transform: translate(-50px, -30px) scale(0.9) rotate(-10deg);
          }
        }

        @keyframes float4 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-60px, -70px) scale(0.85);
          }
          66% {
            transform: translate(80px, 50px) scale(1.1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            scale: 1;
          }
          50% {
            opacity: 0.5;
            scale: 1.1;
          }
        }

        @supports (background: radial-gradient(circle, white, black)) {
          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }
        }
      `}</style>
    </div>
  )
}

// Variant for cards/containers with localized animated gradient
export function AnimatedCardBackground({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none">
        <div
          className="absolute -inset-1/2 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5 blur-2xl"
          style={{
            animation: 'cardShimmer 10s ease-in-out infinite',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes cardShimmer {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            transform: translate(10%, 10%) rotate(5deg);
            opacity: 0.5;
          }
          50% {
            transform: translate(-5%, 5%) rotate(-3deg);
            opacity: 0.4;
          }
          75% {
            transform: translate(5%, -5%) rotate(3deg);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
