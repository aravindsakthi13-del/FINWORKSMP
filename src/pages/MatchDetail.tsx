import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { ScoreRing } from '../components/ui/ScoreRing'
import { matchFor } from '../data/matches'
import { useRecruiter } from '../state/RecruiterContext'

const statusTone = {
  matched: 'teal' as const,
  partial: 'gold' as const,
  missing: 'warn' as const,
}

export function MatchDetailPage() {
  const { requirementId = '', candidateId = '' } = useParams()
  const { requirements, candidates, shortlist, getStage } = useRecruiter()
  const req = requirements.find((r) => r.id === requirementId)
  const candidate = candidates.find((c) => c.id === candidateId)
  const match = matchFor(requirementId, candidateId)
  const stage = getStage(candidateId, requirementId)

  if (!req || !candidate || !match) {
    return (
      <div>
        <h1 className="font-serif text-3xl">Match not available</h1>
        <p className="mt-2 text-mute">This demo only has scored matches for seeded requirements.</p>
        <Link to="/recruiter/requirements" className="mt-4 inline-block text-teal hover:underline">
          Back
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-mute">
            {req.role} · {req.location} / {req.workMode}
          </p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight">{candidate.name}</h1>
          <p className="mt-2 text-mute">{candidate.role}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.verified ? <Badge tone="teal">Verified Talent Passport</Badge> : <Badge>Unverified</Badge>}
            {candidate.assessments
              .filter((a) => a.verified)
              .map((a) => (
                <Badge key={a.skill} tone="ink">
                  {a.skill} {a.score}
                </Badge>
              ))}
          </div>
        </div>
        <ScoreRing score={match.score} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-2xl">Why this candidate?</h2>
          <p className="mt-2 text-sm text-mute">
            The {match.score}% is a weighted sum of skill coverage, verification, practical evidence,
            and logistics — not a black-box rank.
          </p>
          <ul className="mt-5 space-y-2">
            {match.why.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                {item}
              </li>
            ))}
          </ul>
          {match.missing.length > 0 ? (
            <div className="mt-6 rounded-xl bg-mist p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">Missing skills or evidence</p>
              <ul className="mt-2 space-y-1 text-sm">
                {match.missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Score composition</h2>
          <ul className="mt-4 space-y-4">
            {match.breakdown.map((row) => (
              <li key={row.label}>
                <div className="flex justify-between text-sm">
                  <span>{row.label}</span>
                  <span className="text-mute">
                    {row.points}/{row.max}
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full ${row.positive ? 'bg-teal' : 'bg-gold'}`}
                    style={{ width: `${Math.min(100, (row.points / row.max) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-mute">{row.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">Required skill match</h2>
        <div className="mt-4 grid gap-3">
          {match.skillMatches.map((skill) => (
            <div key={skill.skill} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{skill.skill}</p>
                  <Badge tone={statusTone[skill.status]}>{skill.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-mute">{skill.evidence}</p>
              </div>
              <p className="text-sm text-mute">{skill.weight}% weight</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Verification & assessment</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {candidate.assessments.map((a) => (
              <li key={a.skill} className="flex justify-between gap-3">
                <span>
                  {a.skill} · {a.score}
                </span>
                <Badge tone={a.verified ? 'teal' : 'warn'}>{a.verified ? 'Verified' : 'Unverified'}</Badge>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Experience & education</h2>
          <p className="mt-3 text-sm">{candidate.experienceSummary}</p>
          <p className="mt-3 text-sm text-mute">{match.educationFit}</p>
          <p className="mt-2 text-sm">
            {candidate.education.degree}, {candidate.education.school} ({candidate.education.year})
          </p>
        </section>
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Projects / practical evidence</h2>
          <ul className="mt-4 space-y-4">
            {candidate.projects.map((project) => (
              <li key={project.title}>
                <p className="font-medium">{project.title}</p>
                <p className="mt-1 text-sm text-mute">{project.description}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Location, work mode, availability</h2>
          <p className="mt-3 text-sm">{match.locationFit}</p>
          <p className="mt-2 text-sm">{match.availabilityFit}</p>
          <p className="mt-2 text-sm text-mute">
            {candidate.location} · {candidate.workMode} · {candidate.availability}
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        {stage ? (
          <Link to="/recruiter/pipeline" className="rounded-full bg-gold/20 px-5 py-2.5 text-sm font-medium text-gold">
            In pipeline · {stage}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => shortlist(candidate.id, req.id)}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-mist hover:bg-ink-2"
          >
            Shortlist candidate
          </button>
        )}
        <Link
          to={`/recruiter/candidates/${candidate.id}`}
          className="rounded-full border border-line px-5 py-2.5 text-sm hover:border-ink"
        >
          Open Talent Passport
        </Link>
      </div>
    </div>
  )
}
