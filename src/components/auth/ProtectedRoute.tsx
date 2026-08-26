import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { UserRole } from '../../services/authService'
import { useAuth } from '../../state/AuthContext'

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: UserRole[] }) {
  const { user, role, loading, isConfigured } = useAuth()
  const location = useLocation()

  // If Supabase is not configured yet (e.g. initial setup before .env keys are populated),
  // we let the user access the screens with a banner prompting them to configure Supabase.
  if (!isConfigured) {
    return <Outlet />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
          <p className="mt-3 font-serif text-lg text-ink">Verifying credentials...</p>
          <p className="text-xs text-mute">Adept Employment Intelligence</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Role mismatch: redirect to user's authorized home
    if (role === 'candidate') {
      return <Navigate to="/candidate" replace />
    }
    if (role === 'recruiter') {
      return <Navigate to="/recruiter" replace />
    }
  }

  return <Outlet />
}
