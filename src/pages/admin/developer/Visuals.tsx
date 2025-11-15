import React, { useState, useRef } from 'react'

type ImageType = 'og-image' | 'property-placeholder' | 'team-avatar' | 'logo-variant' | 'social-media-post' | 'stella-branded'

interface ImageGeneratorOption {
  id: ImageType
  label: string
  description: string
  icon: string
}

const imageGenerators: ImageGeneratorOption[] = [
  {
    id: 'stella-branded',
    label: 'Stella Branded Image',
    description: 'Generate branded image with Stella Mary, Constellation, and Ballet logos',
    icon: '⭐',
  },
  {
    id: 'og-image',
    label: 'OG Image / Meta Card',
    description: 'Generate Open Graph images for social media previews',
    icon: '🖼️',
  },
  {
    id: 'property-placeholder',
    label: 'Property Placeholder',
    description: 'Create placeholder images for listings without photos',
    icon: '🏠',
  },
  {
    id: 'team-avatar',
    label: 'Team Avatar',
    description: 'Generate professional avatars with initials and brand colors',
    icon: '👤',
  },
  {
    id: 'logo-variant',
    label: 'Logo Variant',
    description: 'Create logo variations for different backgrounds and sizes',
    icon: '✨',
  },
  {
    id: 'social-media-post',
    label: 'Social Media Post',
    description: 'Design branded social media graphics',
    icon: '📱',
  },
]

interface ResolutionPreset {
  name: string
  width: number
  height: number
  description: string
}

const resolutionPresets: ResolutionPreset[] = [
  { name: 'Instagram Post', width: 1080, height: 1080, description: 'Square (1:1)' },
  { name: 'Instagram Story', width: 1080, height: 1920, description: 'Vertical (9:16)' },
  { name: 'Instagram Landscape', width: 1080, height: 608, description: 'Landscape (16:9)' },
  { name: 'Facebook Post', width: 1200, height: 630, description: 'Landscape (1.91:1)' },
  { name: 'Twitter/X Post', width: 1200, height: 675, description: 'Landscape (16:9)' },
  { name: 'LinkedIn Post', width: 1200, height: 627, description: 'Landscape' },
  { name: 'Pinterest Pin', width: 1000, height: 1500, description: 'Vertical (2:3)' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, description: 'Landscape (16:9)' },
  { name: 'TikTok Video', width: 1080, height: 1920, description: 'Vertical (9:16)' },
  { name: 'Custom', width: 1200, height: 1600, description: 'Custom size' },
]

export default function Visuals() {
  const [selectedType, setSelectedType] = useState<ImageType | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedResolution, setSelectedResolution] = useState<ResolutionPreset>(resolutionPresets[0])
  const [customWidth, setCustomWidth] = useState(1200)
  const [customHeight, setCustomHeight] = useState(1600)

  const generateStellaBrandedImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get dimensions from selected resolution or custom values
    const width = selectedResolution.name === 'Custom' ? customWidth : selectedResolution.width
    const height = selectedResolution.name === 'Custom' ? customHeight : selectedResolution.height
    
    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Dark background matching Pricing page (slate-950)
    ctx.fillStyle = '#020617' // slate-950
    ctx.fillRect(0, 0, width, height)

    let imagesLoaded = 0
    const totalImages = 3

    const checkAllLoaded = () => {
      imagesLoaded++
      if (imagesLoaded === totalImages) {
        // Convert to data URL and add to generated images
        const dataUrl = canvas.toDataURL('image/png')
        setGeneratedImages([...generatedImages, dataUrl])
      }
    }

    // Calculate responsive sizing based on canvas dimensions
    const scale = Math.min(width / 1200, height / 1600)
    const logoScale = Math.max(0.5, scale) // Don't scale too small

    // Load and draw Stella Mary logo at the top
    const stellaLogo = new Image()
    stellaLogo.crossOrigin = 'anonymous'
    stellaLogo.onload = () => {
      const logoHeight = 200 * logoScale
      const logoWidth = stellaLogo.width * (logoHeight / stellaLogo.height)
      const yPosition = height * 0.15 // 15% from top
      ctx.drawImage(stellaLogo, (width - logoWidth) / 2, yPosition, logoWidth, logoHeight)
      checkAllLoaded()
    }
    stellaLogo.onerror = () => {
      console.error('Failed to load Stella logo')
      checkAllLoaded()
    }
    stellaLogo.src = '/stella-logo.png'

    // Load and draw Constellation logo
    const constellationLogo = new Image()
    constellationLogo.crossOrigin = 'anonymous'
    constellationLogo.onload = () => {
      const logoHeight = 120 * logoScale
      const logoWidth = constellationLogo.width * (logoHeight / constellationLogo.height)
      const yPosition = height * 0.45 // 45% from top (closer to center)
      ctx.drawImage(constellationLogo, (width - logoWidth) / 2, yPosition, logoWidth, logoHeight)
      
      // Add CONSTELLATION text below logo
      const fontSize = Math.max(16, 32 * logoScale)
      ctx.font = `${fontSize}px Outfit, sans-serif`
      ctx.fillStyle = '#c7d2fe' // indigo-200
      ctx.textAlign = 'center'
      ctx.letterSpacing = '0.4em'
      ctx.fillText('CONSTELLATION', width / 2, yPosition + logoHeight + (50 * logoScale))
      
      checkAllLoaded()
    }
    constellationLogo.onerror = () => {
      console.error('Failed to load Constellation logo')
      checkAllLoaded()
    }
    constellationLogo.src = '/contellation-logo.png'

    // Load and draw Ballet logo
    const balletLogo = new Image()
    balletLogo.crossOrigin = 'anonymous'
    balletLogo.onload = () => {
      const logoHeight = 120 * logoScale
      const logoWidth = balletLogo.width * (logoHeight / balletLogo.height)
      const yPosition = height * 0.65 // 65% from top (closer to constellation)
      ctx.drawImage(balletLogo, (width - logoWidth) / 2, yPosition, logoWidth, logoHeight)
      
      // Add BALLET text below logo
      const fontSize = Math.max(16, 32 * logoScale)
      ctx.font = `${fontSize}px Outfit, sans-serif`
      ctx.fillStyle = '#f9a8d4' // pink-300
      ctx.textAlign = 'center'
      ctx.letterSpacing = '0.4em'
      ctx.fillText('BALLET', width / 2, yPosition + logoHeight + (50 * logoScale))
      
      checkAllLoaded()
    }
    balletLogo.onerror = () => {
      console.error('Failed to load Ballet logo')
      checkAllLoaded()
    }
    balletLogo.src = '/ballet-new-logo.png'
  }

  const handleGenerate = (type: ImageType) => {
    if (type === 'stella-branded') {
      generateStellaBrandedImage()
    } else {
      // Placeholder for other image generation logic
      console.log('Generating image of type:', type)
      setGeneratedImages([...generatedImages, `Generated ${type} at ${new Date().toLocaleTimeString()}`])
    }
  }

  const renderGenerator = () => {
    if (!selectedType) {
      return (
        <div className="flex h-96 items-center justify-center text-slate-400">
          <div className="text-center">
            <div className="text-6xl">🎨</div>
            <p className="mt-4 text-lg">Select an image type above to get started</p>
          </div>
        </div>
      )
    }

    const generator = imageGenerators.find(g => g.id === selectedType)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{generator?.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-slate-200">{generator?.label}</h3>
            <p className="text-sm text-slate-400">{generator?.description}</p>
          </div>
        </div>

        {/* Stella Branded Image Generator */}
        {selectedType === 'stella-branded' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-900/20 p-4">
              <p className="text-sm text-indigo-200">
                This will generate a branded image featuring:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-indigo-300/80">
                <li>• Stella Mary logo at the top</li>
                <li>• Constellation logo with "CONSTELLATION" text</li>
                <li>• Ballet logo with "BALLET" text</li>
                <li>• Dark slate background (matches Pricing page)</li>
              </ul>
            </div>
            
            {/* Resolution Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Resolution Preset</label>
              <select 
                value={resolutionPresets.findIndex(r => r.name === selectedResolution.name)}
                onChange={(e) => setSelectedResolution(resolutionPresets[parseInt(e.target.value)])}
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {resolutionPresets.map((preset, index) => (
                  <option key={preset.name} value={index}>
                    {preset.name} - {preset.width}×{preset.height} ({preset.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom dimensions (only shown when Custom is selected) */}
            {selectedResolution.name === 'Custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Width (px)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1200)}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Height (px)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1600)}
                    className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            )}

            {/* Current selection info */}
            <div className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-3">
              <p className="text-xs text-slate-400">
                Current size: <span className="font-semibold text-slate-300">
                  {selectedResolution.name === 'Custom' ? customWidth : selectedResolution.width} × 
                  {selectedResolution.name === 'Custom' ? customHeight : selectedResolution.height}px
                </span>
              </p>
            </div>
          </div>
        )}

        {/* OG Image Generator */}
        {selectedType === 'og-image' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Page Title</label>
              <input
                type="text"
                placeholder="Stella Real Estate Platform"
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Description</label>
              <textarea
                rows={3}
                placeholder="Modern real estate management platform"
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Background Color</label>
                <input
                  type="color"
                  defaultValue="#1e293b"
                  className="h-10 w-full rounded-lg border border-slate-600 bg-slate-800/50"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Text Color</label>
                <input
                  type="color"
                  defaultValue="#f1f5f9"
                  className="h-10 w-full rounded-lg border border-slate-600 bg-slate-800/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Property Placeholder Generator */}
        {selectedType === 'property-placeholder' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Property Type</label>
              <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Apartment</option>
                <option>House</option>
                <option>Commercial</option>
                <option>Land</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Property Name</label>
              <input
                type="text"
                placeholder="Luxury Apartment São Paulo"
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Width (px)</label>
                <input
                  type="number"
                  defaultValue={1200}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Height (px)</label>
                <input
                  type="number"
                  defaultValue={800}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Format</label>
                <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>PNG</option>
                  <option>JPEG</option>
                  <option>WebP</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Team Avatar Generator */}
        {selectedType === 'team-avatar' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                placeholder="Rosser McIntosh"
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Avatar Size</label>
                <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>128x128</option>
                  <option>256x256</option>
                  <option>512x512</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Background</label>
                <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Gradient</option>
                  <option>Solid</option>
                  <option>Pattern</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Logo Variant Generator */}
        {selectedType === 'logo-variant' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Logo Style</label>
              <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Full Logo</option>
                <option>Icon Only</option>
                <option>Wordmark</option>
                <option>Monochrome</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Background</label>
                <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>Transparent</option>
                  <option>White</option>
                  <option>Dark</option>
                  <option>Brand Color</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Export Size</label>
                <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option>SVG</option>
                  <option>512x512</option>
                  <option>1024x1024</option>
                  <option>2048x2048</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Post Generator */}
        {selectedType === 'social-media-post' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Platform</label>
              <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Instagram Post (1080x1080)</option>
                <option>Instagram Story (1080x1920)</option>
                <option>Facebook Post (1200x630)</option>
                <option>Twitter Card (1200x675)</option>
                <option>LinkedIn Post (1200x627)</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Headline</label>
              <input
                type="text"
                placeholder="Welcome to Stella Platform"
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Subheadline</label>
              <input
                type="text"
                placeholder="Modern Real Estate Management"
                className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Template Style</label>
              <select className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Modern Gradient</option>
                <option>Minimalist</option>
                <option>Bold Typography</option>
                <option>Image Overlay</option>
              </select>
            </div>
          </div>
        )}

        <button
          onClick={() => handleGenerate(selectedType)}
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Generate {generator?.label}
        </button>

        {generatedImages.length > 0 && (
          <div className="mt-6 space-y-2 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
            <h4 className="text-sm font-semibold text-slate-300">Generated Images</h4>
            <div className="space-y-3">
              {generatedImages.map((img, idx) => (
                <div key={idx} className="space-y-2">
                  {img.startsWith('data:image') ? (
                    <>
                      <img src={img} alt={`Generated ${idx + 1}`} className="w-full rounded-lg border border-slate-700" />
                      <div className="flex gap-2">
                        <a
                          href={img}
                          download={`stella-branded-${Date.now()}.png`}
                          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                          Download PNG
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(img)
                            alert('Image data URL copied to clipboard!')
                          }}
                          className="rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                        >
                          Copy Data URL
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{img}</span>
                      <button className="text-indigo-400 hover:text-indigo-300">Download</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-200">Visual Asset Generator</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create branded images, placeholders, and graphics for the Stella platform.
        </p>
      </div>

      {/* Image Type Selector */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {imageGenerators.map((generator) => (
          <button
            key={generator.id}
            onClick={() => setSelectedType(generator.id)}
            className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
              selectedType === generator.id
                ? 'border-indigo-500/60 bg-indigo-600/20 shadow-lg shadow-indigo-500/10'
                : 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            <span className="text-3xl">{generator.icon}</span>
            <div>
              <h3 className="font-semibold text-slate-200">{generator.label}</h3>
              <p className="mt-1 text-xs text-slate-400">{generator.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Generator Form */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/30 p-6">
        {renderGenerator()}
      </div>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
