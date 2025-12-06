import { useParams } from 'react-router-dom'
import UserSite from './UserSite'

/**
 * Wrapper component to render a user's site based on URL path parameter
 * Allows accessing user sites via /site/:subdomain when subdomain DNS isn't available
 * 
 * Example: /site/rosser -> renders rosser's user site
 */
export default function UserSiteByPath() {
  const { subdomain } = useParams<{ subdomain: string }>()
  
  if (!subdomain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Site não encontrado</h1>
          <p className="text-slate-400">O site que você está procurando não existe.</p>
        </div>
      </div>
    )
  }
  
  return <UserSite subdomainOverride={subdomain} />
}
