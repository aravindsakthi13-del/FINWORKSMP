import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../state/AuthContext'

export function LoginPage() {
  const { signIn, isConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn({ email, password })
    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Failed to sign in. Please check your credentials.')
      return
    }

    // Redirect based on target or default
    if (from !== '/') {
      navigate(from, { replace: true })
    } else {
      navigate('/candidate', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-paper px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl tracking-tight text-ink">
          Adept
        </Link>
        <h1 className="mt-4 text-center font-serif text-2xl tracking-tight text-ink">
          Sign in to your workspace
        </h1>
        <p className="mt-2 text-center text-xs text-mute">
          Employment intelligence based on what people can actually do.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-line bg-white px-8 py-10 shadow-sm sm:px-10">
          {!isConfigured && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
              <strong>Note:</strong> Supabase environment variables are not yet configured in <code className="font-mono">.env</code>.
              To connect your real backend, copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env</code> and add your Supabase project credentials.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 animate-fade-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-mute">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.com"
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-mute">Password</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-ink px-4 py-3 text-sm font-medium text-mist transition hover:bg-ink-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-line pt-6 text-center text-xs text-mute">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-medium text-teal hover:underline">
              Create an account
            </Link>
          </div>
        </div>

        {/* Demo Fast Login Helpers */}
        <div className="mt-6 rounded-2xl border border-line/60 bg-mist/50 p-4 text-center text-xs text-mute">
          <p className="font-medium text-ink">Demo Accounts (from seed migration):</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('ananya@example.com')
                setPassword('password123')
              }}
              className="rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] hover:border-ink"
            >
              Fill: Candidate (Ananya)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('recruiter@harbor.com')
                setPassword('password123')
              }}
              className="rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] hover:border-ink"
            >
              Fill: Recruiter (Harbor)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
