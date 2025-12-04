import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

export default function ConstellationVisuals() {
  // Static background stars - memoized to prevent regeneration on re-renders
  const staticStars = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 10, // Random delay up to 10s for staggered twinkling
      animationDuration: Math.random() * 3 + 2, // 2-5 seconds per twinkle
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

  // Fast shooting stars - smaller and 40% slower than before (originally twice as fast as normal)
  const fastShootingStars = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      delay: Math.random() * 6, // 3x longer delay (was 2, now 6)
      duration: (Math.random() * 1 + 1.5) * 0.7, // 40% slower (0.5 * 1.4 = 0.7)
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: 50 * (0.5 + Math.random() * 0.5), // Smaller width
      opacity: 0.8 + Math.random() * 0.2,
    }));
  }, []); // Empty deps - only generate once

  return (
    <>
      <Helmet>
        <title>Mídias Sociais - Constellation</title>
        <meta name="description" content="Estúdio de criação de conteúdo visual para mídias sociais - Plataforma Constellation." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <style>{`
        html, body {
          background: #020617 !important;
          background-attachment: fixed;
          min-height: 100vh;
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(-300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle linear infinite;
        }

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shootingStar linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden">
        {/* Nearly black gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-950" />
        
        {/* Static stars */}
        {staticStars.map((star) => (
          <div
            key={`static-${star.id}`}
            className="star"
            style={{
              width: `${star.width}px`,
              height: `${star.height}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              opacity: star.opacity,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <div
            key={`shooting-${star.id}`}
            className="shooting-star"
            style={{
              width: `${star.width}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: star.opacity,
            }}
          />
        ))}

        {/* Fast shooting stars */}
        {fastShootingStars.map((star) => (
          <div
            key={`fast-shooting-${star.id}`}
            className="shooting-star"
            style={{
              width: `${star.width}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>
    </>
  )
}
