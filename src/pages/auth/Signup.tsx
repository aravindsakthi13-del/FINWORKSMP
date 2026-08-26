import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { UserRole } from '../../services/authService'
import { useAuth } from '../../state/AuthContext'

export function SignupPage() {
  const { signUp, isConfigured } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('candidate')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signUp({ name, email, password, role })
    setLoading(false)

    if (!result.success) {
      setError(result.error || 'Failed to create account. Please check your details.')
      return
    }

    if (role === 'candidate') {
      navigate('/candidate', { replace: true })
    } else {
      navigate('/recruiter', { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-paper px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="block text-center font-serif text-3xl tracking-tight text-ink">
          Adept
        </Link>
        <h1 className="mt-4 text-center font-serif text-2xl tracking-tight text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-center text-xs text-mute">
          Choose whether you are looking for opportunities or hiring verified talent.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-line bg-white px-8 py-10 shadow-sm sm:px-10">
          {!isConfigured && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
              <strong>Note:</strong> Supabase environment variables are not yet configured in <code className="font-mono">.env</code>.
              Configure <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to enable persistent database authentication.
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 animate-fade-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-mute mb-2">I am joining as a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('candidate')}
                  className={`rounded-xl border p-3 text-center transition ${
                    role === 'candidate'
                      ? 'border-teal bg-teal/10 text-teal font-medium'
                      : 'border-line bg-paper text-mute hover:border-ink/30'
                  }`}
                >
                  <p className="text-sm">👤 Candidate</p>
                  <p className="mt-0.5 text-[11px] text-mute">Build Talent Passport</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('recruiter')}
                  className={`rounded-xl border p-3 text-center transition ${
                    role === 'recruiter'
                      ? 'border-teal bg-teal/10 text-teal font-medium'
                      : 'border-line bg-paper text-mute hover:border-ink/30'
                  }`}
                >
                  <p className="text-sm">🏢 Recruiter</p>
                  <p className="mt-0.5 text-[11px] text-mute">Post Reqs & Match</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-mute">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ananya Krishnan"
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal"
              />
            </div>

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
              <label className="block text-xs font-medium text-mute">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-teal"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-teal px-4 py-3 text-sm font-medium text-white transition hover:bg-teal/90 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : `Create ${role === 'candidate' ? 'Candidate' : 'Recruiter'} Account`}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-line pt-6 text-center text-xs text-mute">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
