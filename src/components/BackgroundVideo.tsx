import React, { useEffect, useState } from 'react'

type BackgroundVideoProps = {
  videoId?: string
  /** Extra blur pixels on top of base */
  blur?: number
  /** Dark overlay opacity (0–1) */
  overlayOpacity?: number
}

/**
 * Fixed, full-viewport background video with a dark overlay + blur.
 * Keeps aspect ratio cover behavior similar to background-size: cover.
 */
export default function BackgroundVideo({ videoId = 'bv2x5gn_Tc0', blur = 20, overlayOpacity = 0.5 }: BackgroundVideoProps) {
  const [vw, setVw] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280)
  const [vh, setVh] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 720)

  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const aspect = 16 / 9
  const requiredHeightForWidth = Math.ceil(vw / aspect)
  const minHeight = Math.max(vh, requiredHeightForWidth)
  const minWidth = Math.ceil(minHeight * aspect)

  return (
    <div aria-hidden className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <iframe
        title="Background video"
        style={{
          position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(1.06)',
            minWidth: `${minWidth}px`,
            minHeight: `${minHeight}px`,
            width: 'auto',
            height: 'auto',
            border: 0,
            background: 'transparent',
            filter: `blur(${blur}px)`,
        }}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${overlayOpacity})` }} />
    </div>
  )
}
