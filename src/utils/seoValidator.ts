/**
 * SEO Quality Validator for Property Listings
 * 
 * Validates listing data against SEO best practices and returns quality score
 * Use this before publishing listings to ensure maximum search visibility
 */

export type SEOQualityLevel = 'platinum' | 'gold' | 'silver' | 'bronze' | 'poor'

export interface SEOValidationResult {
  score: number // 0-100
  level: SEOQualityLevel
  passed: boolean // true if publishable (score >= 60)
  issues: SEOIssue[]
  warnings: SEOWarning[]
  recommendations: string[]
}

export interface SEOIssue {
  field: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  fix: string
}

export interface SEOWarning {
  field: string
  message: string
  recommendation: string
}

export interface ListingSEOData {
  title: string | null
  description: string | null
  city: string | null
  state_code: string | null
  neighborhood: string | null
  address_line1: string | null
  postal_code: string | null
  bedrooms: number | null
  bathrooms: number | null
  area_m2: number | null
  parking_spaces: number | null
  price: number | null
  media: Array<{ kind: string; url: string }> | null
  features?: {
    expected_delivery_month?: string
    expected_delivery_year?: number
    units_available?: number
    floorplans?: any[]
    amenities?: string[]
    [key: string]: any
  } | null
  listing_type?: 'for_sale' | 'for_rent' | 'new_project'
}

/**
 * Main validation function - call this before publishing
 */
export function validateListingSEO(data: ListingSEOData): SEOValidationResult {
  const issues: SEOIssue[] = []
  const warnings: SEOWarning[] = []
  const recommendations: string[] = []
  let score = 0

  // CRITICAL FIELDS (40 points total)
  
  // Title validation (10 points)
  if (!data.title || data.title.trim().length === 0) {
    issues.push({
      field: 'title',
      severity: 'critical',
      message: 'Título ausente',
      fix: 'Adicione um título descritivo com localização e tipo do imóvel'
    })
  } else {
    const titleLength = data.title.length
    if (titleLength < 40) {
      warnings.push({
        field: 'title',
        message: 'Título muito curto (menos de 40 caracteres)',
        recommendation: 'Adicione mais detalhes: localização, número de quartos, ou características principais'
      })
      score += 5
    } else if (titleLength > 60) {
      warnings.push({
        field: 'title',
        message: 'Título muito longo (mais de 60 caracteres)',
        recommendation: 'Google pode truncar o título. Reduza para 40-60 caracteres.'
      })
      score += 7
    } else {
      score += 10 // Perfect length
    }
  }

  // Description validation (10 points)
  if (!data.description || data.description.trim().length === 0) {
    issues.push({
      field: 'description',
      severity: 'critical',
      message: 'Descrição ausente',
      fix: 'Adicione descrição com características principais do imóvel (150-300 caracteres)'
    })
  } else {
    const descLength = data.description.length
    if (descLength < 150) {
      warnings.push({
        field: 'description',
        message: 'Descrição muito curta (menos de 150 caracteres)',
        recommendation: 'Expanda para 150-300 caracteres mencionando quartos, área, banheiros e amenidades'
      })
      score += 5
    } else if (descLength > 300) {
      warnings.push({
        field: 'description',
        message: 'Descrição muito longa (mais de 300 caracteres)',
        recommendation: 'Google usa apenas ~160 caracteres na meta description. Resuma.'
      })
      score += 7
    } else {
      score += 10 // Perfect length
    }
  }

  // Location validation (20 points - CRITICAL for local SEO)
  let locationScore = 0
  
  if (!data.city || data.city.trim().length === 0) {
    issues.push({
      field: 'city',
      severity: 'critical',
      message: 'Cidade ausente',
      fix: 'Adicione a cidade (ex: "São Paulo", "Rio de Janeiro")'
    })
  } else {
    locationScore += 5
  }

  if (!data.state_code || data.state_code.trim().length === 0) {
    issues.push({
      field: 'state_code',
      severity: 'critical',
      message: 'Estado ausente',
      fix: 'Adicione o código do estado (ex: "SP", "RJ")'
    })
  } else {
    locationScore += 5
  }

  if (!data.neighborhood || data.neighborhood.trim().length === 0) {
    issues.push({
      field: 'neighborhood',
      severity: 'critical',
      message: 'Bairro ausente - CRÍTICO para SEO local',
      fix: 'Adicione o bairro (ex: "Pinheiros", "Leblon"). Este campo é essencial para buscas locais.'
    })
  } else {
    locationScore += 10 // Neighborhood is worth double
  }

  score += locationScore

  // HIGH PRIORITY FIELDS (30 points total)
  
  // Property features (15 points)
  let featuresScore = 0
  
  if (data.bedrooms === null || data.bedrooms === undefined) {
    issues.push({
      field: 'bedrooms',
      severity: 'high',
      message: 'Número de quartos ausente',
      fix: 'Adicione o número de quartos/dormitórios'
    })
  } else {
    featuresScore += 5
  }

  if (data.bathrooms === null || data.bathrooms === undefined) {
    issues.push({
      field: 'bathrooms',
      severity: 'high',
      message: 'Número de banheiros ausente',
      fix: 'Adicione o número de banheiros'
    })
  } else {
    featuresScore += 5
  }

  if (data.area_m2 === null || data.area_m2 === undefined) {
    issues.push({
      field: 'area_m2',
      severity: 'high',
      message: 'Área em m² ausente',
      fix: 'Adicione a área total em metros quadrados'
    })
  } else {
    featuresScore += 5
  }

  score += featuresScore

  // Price (10 points)
  if (data.price === null || data.price === undefined || data.price <= 0) {
    issues.push({
      field: 'price',
      severity: 'high',
      message: 'Preço ausente',
      fix: 'Adicione o preço ou preço inicial. Rich snippets do Google exigem preço.'
    })
  } else {
    score += 10
  }

  // Parking (5 points)
  if (data.parking_spaces === null || data.parking_spaces === undefined) {
    warnings.push({
      field: 'parking_spaces',
      message: 'Vagas de garagem não especificadas',
      recommendation: 'Adicione número de vagas (ou 0 se não houver)'
    })
    score += 2 // Partial credit
  } else {
    score += 5
  }

  // MEDIUM PRIORITY (20 points total)
  
  // Images (15 points)
  const imageCount = data.media?.filter(m => m.kind === 'image' || m.kind === 'thumbnail').length || 0
  
  if (imageCount === 0) {
    issues.push({
      field: 'media',
      severity: 'high',
      message: 'Nenhuma imagem adicionada',
      fix: 'Adicione no mínimo 5 imagens de alta qualidade'
    })
  } else if (imageCount < 5) {
    warnings.push({
      field: 'media',
      message: `Apenas ${imageCount} imagens (recomendado: 5-15)`,
      recommendation: 'Adicione mais imagens mostrando diferentes ambientes e ângulos'
    })
    score += 5
  } else if (imageCount < 10) {
    score += 10
    recommendations.push('Adicione mais 2-5 imagens para cobrir todos os ambientes')
  } else {
    score += 15 // 10+ images is excellent
  }

  // Address details (5 points)
  if (!data.address_line1 || data.address_line1.trim().length === 0) {
    warnings.push({
      field: 'address_line1',
      message: 'Endereço completo ausente',
      recommendation: 'Adicione endereço completo para melhor geolocalização'
    })
    score += 2
  } else {
    score += 5
  }

  // BONUS POINTS (10 points possible)
  
  // Floorplans for new projects
  if (data.listing_type === 'new_project') {
    const floorplans = data.features?.floorplans || []
    if (floorplans.length === 0) {
      warnings.push({
        field: 'features.floorplans',
        message: 'Lançamento sem plantas baixas',
        recommendation: 'Adicione plantas para mostrar opções de unidades'
      })
    } else if (floorplans.length >= 2) {
      score += 3
      recommendations.push('Ótimo! Múltiplas plantas ajudam compradores a escolher')
    }
  }

  // Expected delivery for new projects
  if (data.listing_type === 'new_project') {
    if (!data.features?.expected_delivery_year) {
      warnings.push({
        field: 'features.expected_delivery_year',
        message: 'Previsão de entrega ausente',
        recommendation: 'Adicione ano e mês de entrega prevista'
      })
    } else {
      score += 2
    }
  }

  // Video background
  const hasVideo = data.media?.some(m => m.kind === 'video_bg' || m.kind === 'video')
  if (hasVideo) {
    score += 3
    recommendations.push('Excelente! Vídeo aumenta engajamento e tempo na página')
  } else {
    recommendations.push('Considere adicionar vídeo do YouTube para aumentar engajamento')
  }

  // Amenities
  const amenitiesCount = data.features?.amenities?.length || 0
  if (amenitiesCount >= 5) {
    score += 2
  } else if (amenitiesCount === 0) {
    recommendations.push('Adicione amenidades no campo "features" para mais keywords')
  }

  // Determine quality level
  let level: SEOQualityLevel
  if (score >= 90) {
    level = 'platinum'
  } else if (score >= 75) {
    level = 'gold'
  } else if (score >= 60) {
    level = 'silver'
  } else if (score >= 40) {
    level = 'bronze'
  } else {
    level = 'poor'
  }

  // Critical issues prevent publishing
  const hasCriticalIssues = issues.some(i => i.severity === 'critical')
  const passed = score >= 60 && !hasCriticalIssues

  // Add general recommendations based on level
  if (level === 'bronze' || level === 'poor') {
    recommendations.unshift('⚠️ Este anúncio não está pronto para publicação. Corrija os problemas críticos.')
  } else if (level === 'silver') {
    recommendations.unshift('Este anúncio está OK, mas pode melhorar. Tente alcançar nível Gold (75+).')
  } else if (level === 'gold') {
    recommendations.unshift('Bom trabalho! Alguns ajustes podem levar ao nível Platinum (90+).')
  } else if (level === 'platinum') {
    recommendations.unshift('🏆 Excelente! Este anúncio está otimizado para máxima visibilidade.')
  }

  return {
    score,
    level,
    passed,
    issues,
    warnings,
    recommendations
  }
}

/**
 * Get emoji for quality level
 */
export function getQualityEmoji(level: SEOQualityLevel): string {
  switch (level) {
    case 'platinum': return '🏆'
    case 'gold': return '🥇'
    case 'silver': return '🥈'
    case 'bronze': return '🥉'
    case 'poor': return '⚠️'
  }
}

/**
 * Get color for quality level (Tailwind classes)
 */
export function getQualityColor(level: SEOQualityLevel): string {
  switch (level) {
    case 'platinum': return 'text-purple-600'
    case 'gold': return 'text-yellow-600'
    case 'silver': return 'text-gray-500'
    case 'bronze': return 'text-orange-600'
    case 'poor': return 'text-red-600'
  }
}

/**
 * Get background color for quality level (Tailwind classes)
 */
export function getQualityBgColor(level: SEOQualityLevel): string {
  switch (level) {
    case 'platinum': return 'bg-purple-50 border-purple-200'
    case 'gold': return 'bg-yellow-50 border-yellow-200'
    case 'silver': return 'bg-gray-50 border-gray-200'
    case 'bronze': return 'bg-orange-50 border-orange-200'
    case 'poor': return 'bg-red-50 border-red-200'
  }
}

/**
 * Get display name for quality level
 */
export function getQualityLabel(level: SEOQualityLevel): string {
  switch (level) {
    case 'platinum': return 'Platinum SEO'
    case 'gold': return 'Gold SEO'
    case 'silver': return 'Silver SEO'
    case 'bronze': return 'Bronze SEO'
    case 'poor': return 'Needs Work'
  }
}

/**
 * Generate SEO report summary
 */
export function generateSEOReport(result: SEOValidationResult): string {
  const lines: string[] = []
  
  lines.push(`SEO Quality Score: ${result.score}/100 - ${getQualityLabel(result.level)} ${getQualityEmoji(result.level)}`)
  lines.push('')
  
  if (result.issues.length > 0) {
    lines.push('PROBLEMAS CRÍTICOS:')
    result.issues.forEach(issue => {
      lines.push(`  ❌ ${issue.field}: ${issue.message}`)
      lines.push(`     → ${issue.fix}`)
    })
    lines.push('')
  }
  
  if (result.warnings.length > 0) {
    lines.push('AVISOS:')
    result.warnings.forEach(warning => {
      lines.push(`  ⚠️  ${warning.field}: ${warning.message}`)
      lines.push(`     → ${warning.recommendation}`)
    })
    lines.push('')
  }
  
  if (result.recommendations.length > 0) {
    lines.push('RECOMENDAÇÕES:')
    result.recommendations.forEach(rec => {
      lines.push(`  💡 ${rec}`)
    })
  }
  
  return lines.join('\n')
}

/**
 * Quick validation - returns true if publishable
 */
export function isPublishable(data: ListingSEOData): boolean {
  const result = validateListingSEO(data)
  return result.passed
}

/**
 * Get minimum required fields that must be filled
 */
export function getRequiredFields(): string[] {
  return [
    'title',
    'description',
    'city',
    'state_code',
    'neighborhood',
    'bedrooms',
    'bathrooms',
    'area_m2',
    'price'
  ]
}
