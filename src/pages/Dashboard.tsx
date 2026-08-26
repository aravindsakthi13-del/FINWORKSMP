import { Link } from 'react-router-dom'
import { StatCard } from '../components/dashboard/StatCard'
import { Badge } from '../components/ui/Badge'
import { STAGE_LABEL } from '../data/pipeline'
import { useRecruiter } from '../state/RecruiterContext'

export function DashboardPage() {
  const { requirements, pipeline, candidates, getMatchesForRequirement } = useRecruiter()
  const active = requirements.filter((r) => r.status === 'active')
  const headcount = active.reduce((sum, r) => sum + r.headcount, 0)
  const potential = active.reduce((sum, r) => sum + r.potentialMatches, 0)
  const verified = active.reduce((sum, r) => sum + r.verifiedMatches, 0)
  const shortlisted = pipeline.filter((p) => p.stage === 'shortlisted').length
  const interviews = pipeline.filter((p) => p.stage === 'interview' || p.stage === 'offer' || p.stage === 'hired').length

  const topDataAnalystMatches = getMatchesForRequirement('req-data-analyst').slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-mute">Harbor Collective</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight">Hiring intelligence</h1>
        <p className="mt-2 max-w-2xl text-mute">
          Active requirements, evidence-backed matches, and a pipeline that stays explainable from
          shortlist to hire.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active requirements" value={active.length} hint="Open roles being matched" to="/recruiter/requirements" />
        <StatCard label="Headcount" value={headcount} hint="Seats across active reqs" />
        <StatCard
          label="Potential matches"
          value={potential}
          hint="Ranked against current skill weights"
          to="/recruiter/requirements/req-data-analyst/matches"
        />
        <StatCard label="Verified candidates" value={verified} hint="At least one on-platform assessment" />
        <StatCard label="Shortlisted" value={shortlisted} hint="Moved from ranked matches" to="/recruiter/pipeline" />
        <StatCard label="Interview pipeline" value={interviews} hint="Interview, offer, or hired" to="/recruiter/pipeline" />
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl">Active hiring requirements</h2>
          <Link to="/recruiter/requirements" className="text-sm font-medium text-teal hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist/60 text-xs uppercase tracking-[0.14em] text-mute">
              <tr>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Headcount</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Location</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Matches</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {active.map((req) => (
                <tr key={req.id} className="border-t border-line hover:bg-mist/40">
                  <td className="px-4 py-3">
                    <Link to={`/recruiter/requirements/${req.id}`} className="font-medium text-ink hover:text-teal">
                      {req.role}
                    </Link>
                    <p className="text-xs text-mute">{req.department}</p>
                  </td>
                  <td className="px-4 py-3">{req.headcount}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {req.location} / {req.workMode}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {req.potentialMatches} · {req.verifiedMatches} verified
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="teal">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-xl">Top evidence matches</h2>
          <p className="mt-1 text-sm text-mute">Highest scores on the Data Analyst requirement.</p>
          <ul className="mt-4 space-y-3">
            {topDataAnalystMatches.map((m) => {
              const person = candidates.find((c) => c.id === m.candidateId)
              if (!person) return null
              return (
                <li key={m.candidateId}>
                  <Link
                    to={`/recruiter/requirements/req-data-analyst/matches/${person.id}`}
                    className="flex items-center justify-between rounded-xl border border-transparent px-2 py-2 transition hover:border-line hover:bg-mist/50"
                  >
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-xs text-mute">{person.role}</p>
                    </div>
                    <span className="font-serif text-2xl text-teal">{m.score}%</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-serif text-xl">Pipeline pulse</h2>
          <p className="mt-1 text-sm text-mute">Shortlist a match and it will appear here instantly.</p>
          {pipeline.length === 0 ? (
            <p className="mt-8 text-sm text-mute">
              No candidates in motion yet.{' '}
              <Link to="/recruiter/requirements/req-data-analyst/matches" className="text-teal hover:underline">
                Open ranked matches
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {pipeline.map((entry) => {
                const person = candidates.find((c) => c.id === entry.candidateId)
                return (
                  <li key={`${entry.candidateId}-${entry.requirementId}`} className="flex items-center justify-between">
                    <span>{person?.name}</span>
                    <Badge tone="gold">{STAGE_LABEL[entry.stage]}</Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
