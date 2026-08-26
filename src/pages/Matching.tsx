import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { useRecruiter } from '../state/RecruiterContext'

export function MatchingPage() {
  const { requirementId = '' } = useParams()
  const { requirements, candidates, shortlist, getStage, getMatchesForRequirement } = useRecruiter()
  const req = requirements.find((r) => r.id === requirementId)
  const [minScore, setMinScore] = useState(60)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [availableSoon, setAvailableSoon] = useState(false)

  const rows = useMemo(() => {
    if (!req) return []
    return getMatchesForRequirement(req.id)
      .map((match) => {
        const candidate = candidates.find((c) => c.id === match.candidateId)
        return candidate ? { match, candidate } : null
      })
      .filter((row): row is NonNullable<typeof row> => row != null)
      .filter((row) => row.match.score >= minScore)
      .filter((row) => (verifiedOnly ? row.candidate.verified : true))
      .filter((row) =>
        availableSoon
          ? /immediate|15/i.test(row.candidate.availability)
          : true,
      )
  }, [availableSoon, candidates, getMatchesForRequirement, minScore, req, verifiedOnly])

  if (!req) {
    return <p>Requirement not found.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">{req.role}</p>
        <h1 className="mt-1 font-serif text-4xl tracking-tight">Ranked matches</h1>
        <p className="mt-2 max-w-2xl text-mute">
          Ordered by explainable fit against weighted skills, evidence, and logistics — not keyword
          overlap.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4">
        <label className="text-sm">
          <span className="mr-2 text-mute">Min match</span>
          <input
            type="range"
            min={40}
            max={95}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
          <span className="ml-2 font-medium">{minScore}%</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
          Verified only
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={availableSoon} onChange={(e) => setAvailableSoon(e.target.checked)} />
          Available in 15 days
        </label>
        <p className="ml-auto text-sm text-mute">{rows.length} candidates</p>
      </div>

      <ul className="space-y-3">
        {rows.map(({ match, candidate }) => {
          const stage = getStage(candidate.id, req.id)
          return (
            <li
              key={candidate.id}
              className="rounded-2xl border border-line bg-white p-5 transition hover:border-ink/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-sm text-mist">
                    {candidate.initials}
                  </div>
                  <div>
                    <Link
                      to={`/recruiter/requirements/${req.id}/matches/${candidate.id}`}
                      className="font-serif text-2xl hover:text-teal"
                    >
                      {candidate.name}
                    </Link>
                    <p className="text-sm text-mute">
                      {candidate.role} · {candidate.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif text-4xl text-teal">{match.score}%</p>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-mute">Match</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill.name} tone={skill.verified ? 'teal' : 'neutral'}>
                    {skill.name}
                    {skill.verified ? ' · verified' : ''}
                  </Badge>
                ))}
              </div>

              <div className="mt-4 grid gap-3 text-sm text-mute md:grid-cols-3">
                <p>
                  <span className="text-ink">Evidence: </span>
                  {candidate.projects.length} project{candidate.projects.length === 1 ? '' : 's'} ·{' '}
                  {candidate.experienceSummary}
                </p>
                <p>
                  <span className="text-ink">Availability: </span>
                  {candidate.availability}
                </p>
                <p>
                  <span className="text-ink">Status: </span>
                  {candidate.verified ? 'Talent Passport verified' : 'Unverified profile'}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to={`/recruiter/requirements/${req.id}/matches/${candidate.id}`}
                  className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink"
                >
                  Why this score
                </Link>
                <Link
                  to={`/recruiter/candidates/${candidate.id}`}
                  className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink"
                >
                  Talent Passport
                </Link>
                {stage ? (
                  <span className="rounded-full bg-gold/15 px-4 py-2 text-sm text-gold">In pipeline · {stage}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => shortlist(candidate.id, req.id)}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-mist hover:bg-ink-2"
                  >
                    Shortlist
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
