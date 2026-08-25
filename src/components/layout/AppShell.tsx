import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const nav = [
  { to: '/recruiter', label: 'Overview', end: true },
  { to: '/recruiter/requirements', label: 'Requirements' },
  { to: '/recruiter/requirements/req-data-analyst/matches', label: 'Matches' },
  { to: '/recruiter/pipeline', label: 'Pipeline' },
]

export function AppShell() {
  const location = useLocation()
  const isRecruiter = location.pathname.startsWith('/recruiter')

  if (!isRecruiter) return <Outlet />

  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-ink text-mist lg:border-b-0 lg:border-r lg:border-ink-3">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-7">
          <Link to="/" className="font-serif text-2xl tracking-tight text-mist">
            Adept
          </Link>
          <p className="hidden text-xs text-mist/55 lg:mt-1 lg:block">Employment intelligence</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-0.5 lg:px-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm whitespace-nowrap transition ${
                  isActive ? 'bg-ink-3 text-teal-bright' : 'text-mist/75 hover:bg-ink-2 hover:text-mist'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-6 py-8 lg:block">
          <p className="text-xs uppercase tracking-[0.16em] text-mist/40">Workspace</p>
          <p className="mt-2 text-sm text-mist/80">Harbor Collective</p>
          <p className="text-xs text-mist/45">Recruiter · Insights hiring</p>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-line px-5 py-4 lg:px-8">
          <p className="text-sm text-mute">Recruiter workspace</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-medium text-mist">
            HK
          </div>
        </header>
        <main className="px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
