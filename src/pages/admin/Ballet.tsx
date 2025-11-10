import React from 'react'
import BalletMain from './ballet/BalletMain'
import { useOnboarding } from '../../context/OnboardingContext'

export default function Ballet() {
  const { state, builderGate } = useOnboarding()
  const tenant = state.tenant
  const role = state.role

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-4 text-sm text-indigo-100">
        <p className="font-semibold text-white">Ambiente isolado para o seu time</p>
        <p className="mt-1 text-indigo-100/80">
          Cada tenant recebe um quadro Ballet independente. As ações aqui não impactam o ambiente principal da Stella.
          {builderGate.mode === 'locked'
            ? ' Complete o onboarding para liberar automações e sincronizar com o marketplace.'
            : ' Você pode personalizar templates de tarefas e SLAs sem afetar outros clientes.'}
        </p>
        {!tenant && role !== 'employee' && (
          <p className="mt-2 text-xs text-indigo-100/70">
            Crie seu site no onboarding para gerar automaticamente o seu board de produção e campanhas.
          </p>
        )}
      </div>
      <BalletMain />
    </div>
  )
}
