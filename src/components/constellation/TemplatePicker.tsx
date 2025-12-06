import React, { useState } from 'react'
import { Check, Sparkles, Building2, Zap, Crown, X } from 'lucide-react'

export interface Template {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  features: string[]
  featuresEn: string[]
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
  previewGradient: string
  icon: React.ReactNode
  badge?: string
  popular?: boolean
}

export const TEMPLATES: Template[] = [
  {
    id: 'stella',
    name: 'Stella Clássico',
    nameEn: 'Stella Classic',
    description: 'Layout elegante inspirado na Stella Mary Real Estate. Perfeito para corretores que buscam sofisticação e credibilidade.',
    descriptionEn: 'Elegant layout inspired by Stella Mary Real Estate. Perfect for realtors seeking sophistication and credibility.',
    features: ['Design premium', 'Seção de destaques', 'Galeria moderna', 'Formulário de contato'],
    featuresEn: ['Premium design', 'Featured section', 'Modern gallery', 'Contact form'],
    colorScheme: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4'
    },
    previewGradient: 'from-indigo-600 via-purple-600 to-indigo-700',
    icon: <Sparkles className="w-6 h-6" />,
    badge: 'Recomendado',
    popular: true
  },
  {
    id: 'luxe',
    name: 'Luxe',
    nameEn: 'Luxe',
    description: 'Design ultra-premium para imóveis de alto padrão. Visual sofisticado com animações suaves e tipografia luxuosa.',
    descriptionEn: 'Ultra-premium design for high-end properties. Sophisticated look with smooth animations and luxurious typography.',
    features: ['Visual luxuoso', 'Animações suaves', 'Galeria fullscreen', 'Dark mode elegante'],
    featuresEn: ['Luxurious look', 'Smooth animations', 'Fullscreen gallery', 'Elegant dark mode'],
    colorScheme: {
      primary: '#b8860b',
      secondary: '#1f2937',
      accent: '#d4af37'
    },
    previewGradient: 'from-amber-700 via-slate-900 to-amber-800',
    icon: <Crown className="w-6 h-6" />
  },
  {
    id: 'minimal',
    name: 'Minimal',
    nameEn: 'Minimal',
    description: 'Clean e moderno com foco no conteúdo. Layout minimalista que destaca seus imóveis sem distrações.',
    descriptionEn: 'Clean and modern with focus on content. Minimalist layout that highlights your properties without distractions.',
    features: ['Design limpo', 'Carregamento rápido', 'Foco no conteúdo', 'Acessível'],
    featuresEn: ['Clean design', 'Fast loading', 'Content focused', 'Accessible'],
    colorScheme: {
      primary: '#18181b',
      secondary: '#71717a',
      accent: '#22c55e'
    },
    previewGradient: 'from-zinc-800 via-zinc-900 to-black',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'bold',
    name: 'Bold',
    nameEn: 'Bold',
    description: 'Visual impactante com cores vibrantes e layout ousado. Ideal para se destacar no mercado imobiliário.',
    descriptionEn: 'Striking visual with vibrant colors and bold layout. Ideal to stand out in the real estate market.',
    features: ['Visual marcante', 'Cores vibrantes', 'Layout ousado', 'Alta conversão'],
    featuresEn: ['Striking visual', 'Vibrant colors', 'Bold layout', 'High conversion'],
    colorScheme: {
      primary: '#dc2626',
      secondary: '#0f172a',
      accent: '#f97316'
    },
    previewGradient: 'from-red-600 via-orange-600 to-red-700',
    icon: <Building2 className="w-6 h-6" />
  }
]

interface TemplatePickerProps {
  selectedTemplate: string
  onSelect: (templateId: string) => void
  isPt?: boolean
  isOpen: boolean
  onClose: () => void
}

export default function TemplatePicker({ 
  selectedTemplate, 
  onSelect, 
  isPt = true,
  isOpen,
  onClose
}: TemplatePickerProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-auto m-4 bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isPt ? 'Escolha seu Template' : 'Choose Your Template'}
            </h2>
            <p className="text-slate-400 mt-1">
              {isPt 
                ? 'Selecione o visual perfeito para seu site imobiliário'
                : 'Select the perfect look for your real estate website'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEMPLATES.map((template) => {
              const isSelected = selectedTemplate === template.id
              const isHovered = hoveredTemplate === template.id
              
              return (
                <button
                  key={template.id}
                  onClick={() => onSelect(template.id)}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  className={`relative group text-left rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30' 
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {/* Preview Area */}
                  <div className={`relative h-48 bg-gradient-to-br ${template.previewGradient} overflow-hidden`}>
                    {/* Template visualization */}
                    <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                      {/* Mock header */}
                      <div className="h-8 border-b border-white/10 flex items-center px-3 gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/40" />
                        <div className="w-16 h-2 rounded bg-white/30" />
                        <div className="flex-1" />
                        <div className="flex gap-2">
                          <div className="w-8 h-2 rounded bg-white/20" />
                          <div className="w-8 h-2 rounded bg-white/20" />
                        </div>
                      </div>
                      {/* Mock content */}
                      <div className="p-3 space-y-2">
                        <div className="w-3/4 h-4 rounded bg-white/30" />
                        <div className="w-1/2 h-3 rounded bg-white/20" />
                        <div className="flex gap-2 mt-4">
                          <div className="w-1/3 h-16 rounded bg-white/20" />
                          <div className="w-1/3 h-16 rounded bg-white/20" />
                          <div className="w-1/3 h-16 rounded bg-white/20" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Badge */}
                    {template.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full shadow-lg">
                        {isPt ? template.badge : 'Recommended'}
                      </div>
                    )}
                    
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-3 left-3 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}>
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">
                          {isPt ? template.name : template.nameEn}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">
                      {isPt ? template.description : template.descriptionEn}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(isPt ? template.features : template.featuresEn).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Color scheme preview */}
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/50">
                      <span className="text-xs text-slate-500">{isPt ? 'Cores:' : 'Colors:'}</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: template.colorScheme.primary }}
                          title="Primary"
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: template.colorScheme.secondary }}
                          title="Secondary"
                        />
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20" 
                          style={{ backgroundColor: template.colorScheme.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 p-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {isPt 
              ? 'Você pode mudar o template a qualquer momento'
              : 'You can change the template at any time'}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
          >
            {isPt ? 'Confirmar' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
