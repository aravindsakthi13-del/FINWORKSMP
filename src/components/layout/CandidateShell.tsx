import { Link, NavLink, Outlet } from 'react-router-dom'
import { useRecruiter } from '../../state/RecruiterContext'

const candidateNav = [
  { to: '/candidate', label: 'Dashboard', end: true },
  { to: '/candidate/profile', label: 'Edit Profile' },
  { to: '/candidate/passport', label: 'Talent Passport' },
]

export function CandidateShell() {
  const { candidates, activeCandidateId, setActiveCandidateId, activeCandidate } = useRecruiter()

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-line bg-ink text-mist lg:border-b-0 lg:border-r lg:border-ink-3">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-6">
          <div>
            <Link to="/" className="font-serif text-2xl tracking-tight text-mist">
              Adept
            </Link>
            <span className="ml-2 rounded-full bg-teal/20 px-2 py-0.5 text-[11px] font-medium text-teal-bright">
              Candidate
            </span>
          </div>
          <p className="hidden text-xs text-mist/55 lg:mt-1 lg:block">Employment intelligence</p>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-0.5 lg:px-3">
          {candidateNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm whitespace-nowrap transition ${
                  isActive ? 'bg-ink-3 text-teal-bright font-medium' : 'text-mist/75 hover:bg-ink-2 hover:text-mist'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Candidate Persona Selector & Switcher */}
        <div className="hidden border-t border-white/10 px-5 py-6 lg:block">
          <label className="text-[11px] uppercase tracking-[0.16em] text-mist/45">Active Persona</label>
          <select
            value={activeCandidateId}
            onChange={(e) => setActiveCandidateId(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-ink-2 px-2.5 py-1.5 text-xs text-mist outline-none focus:border-teal-bright"
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.id} className="bg-ink text-mist">
                {c.name} ({c.role})
              </option>
            ))}
          </select>

          <div className="mt-6 rounded-xl border border-white/10 bg-ink-2/60 p-3">
            <p className="text-xs text-mist/60">Switch to employer view</p>
            <Link
              to="/recruiter"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-mist/10 px-3 py-1.5 text-xs font-medium text-mist transition hover:bg-mist/20"
            >
              <span>🏢</span> Recruiter Workspace
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-line bg-white/50 px-5 py-3.5 backdrop-blur-sm lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-medium text-mist">
              {activeCandidate?.initials || 'C'}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{activeCandidate?.name}</p>
              <p className="text-xs text-mute">{activeCandidate?.role || 'Candidate Profile'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/recruiter"
              className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-mute transition hover:border-ink hover:text-ink"
            >
              Switch to Recruiter
            </Link>
            <Link
              to="/candidate/passport"
              className="rounded-full bg-teal px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-teal/90"
            >
              View Talent Passport
            </Link>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
