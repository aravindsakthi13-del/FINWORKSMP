import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-mist">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="font-serif text-2xl tracking-tight">Adept</p>
        <div className="flex items-center gap-3">
          <Link
            to="/candidate"
            className="rounded-full border border-mist/20 px-4 py-2 text-sm font-medium text-mist transition hover:border-mist/50 hover:text-white"
          >
            Candidate portal
          </Link>
          <Link
            to="/recruiter"
            className="rounded-full bg-mist px-4 py-2 text-sm font-medium text-ink transition hover:bg-white"
          >
            Recruiter workspace
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 lg:pt-20">
        <p className="animate-fade-up text-xs uppercase tracking-[0.22em] text-teal-bright">
          Employment intelligence
        </p>
        <h1
          className="animate-fade-up mt-5 max-w-3xl font-serif text-4xl leading-[1.15] tracking-tight text-mist sm:text-6xl"
          style={{ animationDelay: '80ms' }}
        >
          Connect people to opportunities based on what they can actually do.
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-mist/70"
          style={{ animationDelay: '140ms' }}
        >
          Adept is not a job board. Companies define structured hiring requirements. Candidates build
          verified Talent Passports. Our dynamic matching engine explains the score on both sides.
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: '200ms' }}>
          <Link
            to="/candidate"
            className="rounded-full bg-teal-bright px-6 py-3 text-sm font-semibold text-ink transition hover:bg-teal-bright/90"
          >
            Open Candidate Portal
          </Link>
          <Link
            to="/recruiter"
            className="rounded-full border border-mist/30 px-6 py-3 text-sm font-medium text-mist transition hover:border-mist/70 hover:bg-mist/5"
          >
            Enter Recruiter Dashboard
          </Link>
          <Link
            to="/recruiter/requirements/req-data-analyst/matches"
            className="rounded-full border border-mist/15 px-6 py-3 text-sm font-medium text-mist/75 transition hover:border-mist/40"
          >
            See explainable matching
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink-2">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-3">
          {[
            {
              title: 'Requirement, not a posting',
              body: 'Role, headcount, skill weights, and joining constraints — structured so matching can be fair and repeatable.',
            },
            {
              title: 'Evidence over keywords',
              body: 'Assessments, projects, internships, and education sit behind every score. Both candidates and recruiters see why.',
            },
            {
              title: 'Portable Talent Passport',
              body: 'A dynamic, verifiable profile that highlights demonstrated skills and real project outcomes without static resume noise.',
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/8 bg-ink-3/60 p-6">
              <h2 className="font-serif text-xl text-mist">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-mist/65">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
