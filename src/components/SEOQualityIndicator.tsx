import React from 'react'
import {
  validateListingSEO,
  getQualityEmoji,
  getQualityColor,
  getQualityBgColor,
  getQualityLabel,
  type ListingSEOData,
  type SEOValidationResult
} from '../utils/seoValidator'

interface SEOQualityIndicatorProps {
  data: ListingSEOData
  showDetails?: boolean
}

/**
 * Real-time SEO quality indicator for listing forms
 * Shows score, issues, and recommendations as user fills out the form
 */
export function SEOQualityIndicator({ data, showDetails = true }: SEOQualityIndicatorProps) {
  const result = validateListingSEO(data)
  
  return (
    <div className={`rounded-lg border-2 p-4 ${getQualityBgColor(result.level)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getQualityEmoji(result.level)}</span>
          <div>
            <h3 className={`font-bold text-lg ${getQualityColor(result.level)}`}>
              {getQualityLabel(result.level)}
            </h3>
            <p className="text-sm text-gray-600">Score: {result.score}/100</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-32">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                result.score >= 90 ? 'bg-purple-600' :
                result.score >= 75 ? 'bg-yellow-500' :
                result.score >= 60 ? 'bg-gray-400' :
                result.score >= 40 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Publish status */}
      {!result.passed && (
        <div className="bg-red-100 border border-red-300 rounded-md p-3 mb-3">
          <p className="text-red-800 text-sm font-semibold">
            ⚠️ Este anúncio não está pronto para publicação
          </p>
          <p className="text-red-700 text-xs mt-1">
            Corrija os problemas críticos abaixo antes de publicar
          </p>
        </div>
      )}

      {result.passed && result.level === 'silver' && (
        <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 mb-3">
          <p className="text-yellow-800 text-sm font-semibold">
            ✓ Pronto para publicar, mas pode melhorar
          </p>
          <p className="text-yellow-700 text-xs mt-1">
            Tente alcançar nível Gold (75+) para melhor visibilidade
          </p>
        </div>
      )}

      {result.passed && (result.level === 'gold' || result.level === 'platinum') && (
        <div className="bg-green-100 border border-green-300 rounded-md p-3 mb-3">
          <p className="text-green-800 text-sm font-semibold">
            ✓ Excelente! Pronto para publicar
          </p>
          <p className="text-green-700 text-xs mt-1">
            Este anúncio está otimizado para máxima visibilidade no Google
          </p>
        </div>
      )}

      {/* Details */}
      {showDetails && (
        <>
          {/* Critical Issues */}
          {result.issues.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-red-700 text-sm mb-2">
                ❌ Problemas Críticos ({result.issues.length})
              </h4>
              <div className="space-y-2">
                {result.issues.map((issue, idx) => (
                  <div key={idx} className="bg-white rounded p-2 border border-red-200">
                    <p className="text-sm font-medium text-red-900">
                      {issue.field}: {issue.message}
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      → {issue.fix}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="mb-3">
              <h4 className="font-semibold text-yellow-700 text-sm mb-2">
                ⚠️ Avisos ({result.warnings.length})
              </h4>
              <div className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <div key={idx} className="bg-white rounded p-2 border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900">
                      {warning.field}: {warning.message}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      → {warning.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold text-blue-700 text-sm mb-2">
                💡 Recomendações
              </h4>
              <ul className="space-y-1">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-blue-800">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Quick stats */}
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-300">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-bold text-gray-700">{result.issues.length}</div>
              <div className="text-gray-500">Críticos</div>
            </div>
            <div>
              <div className="font-bold text-gray-700">{result.warnings.length}</div>
              <div className="text-gray-500">Avisos</div>
            </div>
            <div>
              <div className="font-bold text-gray-700">{result.recommendations.length}</div>
              <div className="text-gray-500">Dicas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Compact version for list views
 */
export function SEOQualityBadge({ data }: { data: ListingSEOData }) {
  const result = validateListingSEO(data)
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getQualityBgColor(result.level)} ${getQualityColor(result.level)}`}>
      <span>{getQualityEmoji(result.level)}</span>
      <span>{getQualityLabel(result.level)}</span>
      <span className="ml-1 opacity-75">({result.score})</span>
    </div>
  )
}

/**
 * Simple score display
 */
export function SEOScore({ data }: { data: ListingSEOData }) {
  const result = validateListingSEO(data)
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            result.score >= 90 ? 'bg-purple-600' :
            result.score >= 75 ? 'bg-yellow-500' :
            result.score >= 60 ? 'bg-gray-400' :
            result.score >= 40 ? 'bg-orange-500' :
            'bg-red-500'
          }`}
          style={{ width: `${result.score}%` }}
        />
      </div>
      <span className={`text-sm font-semibold ${getQualityColor(result.level)}`}>
        {result.score}/100
      </span>
    </div>
  )
}
