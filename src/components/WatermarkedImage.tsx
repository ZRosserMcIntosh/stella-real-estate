import React, { useEffect, useState } from 'react'
import { getSiteSettings } from '../lib/siteSettings'

interface WatermarkedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  // Option to disable watermark for specific images (e.g., logos, team photos)
  disableWatermark?: boolean
}

export default function WatermarkedImage({ 
  src, 
  alt, 
  className = '', 
  disableWatermark = false,
  ...rest 
}: WatermarkedImageProps) {
  const [watermarkConfig, setWatermarkConfig] = useState<{
    enabled: boolean
    text: string
    opacity: number
    position: string
    type: string
    imageUrl: string
    size: string
  }>({
    enabled: false,
    text: 'STELLA',
    opacity: 0.15,
    position: 'center',
    type: 'text',
    imageUrl: '',
    size: 'medium'
  })
  
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadWatermarkSettings = async () => {
      try {
        const settings = await getSiteSettings([
          'watermark_enabled',
          'watermark_text',
          'watermark_opacity',
          'watermark_position',
          'watermark_type',
          'watermark_image_url',
          'watermark_size'
        ])
        
        const config = {
          enabled: settings.watermark_enabled === 'true',
          text: settings.watermark_text || 'STELLA',
          opacity: parseFloat(settings.watermark_opacity || '0.15'),
          position: settings.watermark_position || 'center',
          type: settings.watermark_type || 'text',
          imageUrl: settings.watermark_image_url || '',
          size: settings.watermark_size || 'medium'
        }
        
        setWatermarkConfig(config)
        
        // Debug logging
        console.log('Watermark config loaded:', config)
      } catch (error) {
        console.error('Failed to load watermark settings:', error)
      }
    }

    loadWatermarkSettings()
  }, [])

  // If watermark is disabled globally or for this specific image, render plain image
  if (!watermarkConfig.enabled || disableWatermark) {
    return <img src={src} alt={alt} className={className} {...rest} />
  }

  // Position classes mapping
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'center-left': 'top-1/2 left-4 transform -translate-y-1/2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'center-right': 'top-1/2 right-4 transform -translate-y-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  }

  const positionClass = positionClasses[watermarkConfig.position as keyof typeof positionClasses] || positionClasses['center']

  // Size mappings using percentages to scale proportionally with image size
  // This ensures watermarks look consistent whether on thumbnails or large images
  const sizeClasses = {
    image: {
      small: 'max-w-[15%] max-h-[15%]',
      medium: 'max-w-[25%] max-h-[25%]',
      large: 'max-w-[35%] max-h-[35%]'
    },
    text: {
      // Using vw for text to scale with viewport width, with min constraints
      small: 'text-[clamp(0.75rem,2vw,1rem)]',
      medium: 'text-[clamp(1rem,3vw,1.5rem)]',
      large: 'text-[clamp(1.25rem,4vw,2rem)]'
    }
  }

  const imageSizeClass = sizeClasses.image[watermarkConfig.size as keyof typeof sizeClasses.image] || sizeClasses.image.medium
  const textSizeClass = sizeClasses.text[watermarkConfig.size as keyof typeof sizeClasses.text] || sizeClasses.text.medium

  return (
    <div className="relative inline-block w-full">
      <img src={src} alt={alt} className={className} {...rest} />
      
      {/* Watermark overlay */}
      {watermarkConfig.type === 'image' && watermarkConfig.imageUrl ? (
        <>
          <img 
            src={watermarkConfig.imageUrl} 
            alt="Watermark"
            className={`absolute ${positionClass} ${imageSizeClass} object-contain drop-shadow-lg pointer-events-none select-none`}
            style={{ 
              opacity: watermarkConfig.opacity,
              mixBlendMode: 'normal',
              display: imageError ? 'none' : 'block'
            }}
            onLoad={() => {
              setImageLoaded(true)
              console.log('Watermark image loaded successfully:', watermarkConfig.imageUrl)
            }}
            onError={(e) => {
              setImageError(true)
              console.error('Watermark image failed to load:', watermarkConfig.imageUrl, e)
            }}
          />
          {imageError && (
            <div 
              className={`absolute ${positionClass} text-white font-bold ${textSizeClass} tracking-widest drop-shadow-lg whitespace-nowrap pointer-events-none select-none`}
              style={{ 
                opacity: watermarkConfig.opacity,
                mixBlendMode: 'normal'
              }}
            >
              {watermarkConfig.text || 'STELLA'}
            </div>
          )}
        </>
      ) : (
        <div 
          className={`absolute ${positionClass} text-white font-bold ${textSizeClass} tracking-widest drop-shadow-lg whitespace-nowrap pointer-events-none select-none`}
          style={{ 
            opacity: watermarkConfig.opacity,
            mixBlendMode: 'normal'
          }}
        >
          {watermarkConfig.text}
        </div>
      )}
    </div>
  )
}
