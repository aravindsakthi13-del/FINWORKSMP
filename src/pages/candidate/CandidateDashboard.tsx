import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { ScoreRing } from '../../components/ui/ScoreRing'
import { STAGE_LABEL } from '../../data/pipeline'
import { computeMatch } from '../../services/matchingEngine'
import { useRecruiter } from '../../state/RecruiterContext'

export function CandidateDashboardPage() {
  const { activeCandidate, requirements, pipeline } = useRecruiter()

  const candidate = activeCandidate

  // Calculate profile completeness %
  const completeness = useMemo(() => {
    if (!candidate) return 0
    let points = 0
    if (candidate.name && candidate.role && candidate.location) points += 25
    if (candidate.skills && candidate.skills.length >= 3) points += 25
    if (candidate.projects && candidate.projects.length >= 1) points += 20
    if (candidate.education && candidate.education.degree) points += 15
    if (candidate.experience && candidate.experience.length >= 1) points += 15
    return Math.min(100, points)
  }, [candidate])

  // Calculate employment readiness score
  const readiness = useMemo(() => {
    if (!candidate) return 0
    let score = 50 // baseline
    const verifiedSkills = candidate.skills.filter((s) => s.verified).length
    score += verifiedSkills * 10
    if (candidate.verified) score += 10
    if (candidate.projects.length >= 2) score += 10
    return Math.min(100, score)
  }, [candidate])

  // Dynamically compute match scores for active requirements
  const recommendations = useMemo(() => {
    if (!candidate) return []
    return requirements
      .filter((r) => r.status === 'active')
      .map((req) => {
        const match = computeMatch(candidate, req)
        return { req, match }
      })
      .sort((a, b) => b.match.score - a.match.score)
  }, [candidate, requirements])

  // Current pipeline / interview tracker for this candidate
  const activeApplications = useMemo(() => {
    if (!candidate) return []
    return pipeline
      .filter((p) => p.candidateId === candidate.id)
      .map((entry) => {
        const req = requirements.find((r) => r.id === entry.requirementId)
        return { entry, req }
      })
  }, [candidate, pipeline, requirements])

  if (!candidate) {
    return <p>Candidate not found.</p>
  }

  const verifiedAssessments = candidate.assessments.filter((a) => a.verified)
  const expertSkills = candidate.skills.filter((s) => s.level === 'expert')
  const strongSkills = candidate.skills.filter((s) => s.level === 'strong')
  const workingSkills = candidate.skills.filter((s) => s.level === 'working')

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-3xl border border-line bg-white p-6 shadow-sm lg:p-8">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-mute">Candidate Intelligence</p>
            {candidate.verified ? (
              <Badge tone="teal">Verified Passport</Badge>
            ) : (
              <Badge tone="neutral">Self-Declared Profile</Badge>
            )}
          </div>
          <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink sm:text-4xl">{candidate.name}</h1>
          <p className="mt-1 text-base text-mute">
            {candidate.role} · {candidate.location} ({candidate.workMode}) · {candidate.availability}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/candidate/profile"
              className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-mist transition hover:bg-ink-2"
            >
              Edit Talent Profile
            </Link>
            <Link
              to="/candidate/passport"
              className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink transition hover:border-ink"
            >
              View Talent Passport
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <ScoreRing score={readiness} size={110} label="Readiness" />
          </div>
        </div>
      </div>

      {/* Profile Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-mute">Profile Completeness</p>
          <p className="mt-2 font-serif text-3xl text-ink">{completeness}%</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-teal" style={{ width: `${completeness}%` }} />
          </div>
          <p className="mt-2 text-xs text-mute">
            {completeness === 100 ? 'All sections fully populated' : 'Add more projects or assessments'}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-mute">Verified Assessments</p>
          <p className="mt-2 font-serif text-3xl text-ink">{verifiedAssessments.length}</p>
          <p className="mt-3 text-xs text-mute">
            {verifiedAssessments.length > 0
              ? `Top: ${verifiedAssessments[0].skill} (${verifiedAssessments[0].score}%)`
              : 'Take an assessment to verify skills'}
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-mute">Demonstrated Projects</p>
          <p className="mt-2 font-serif text-3xl text-ink">{candidate.projects.length}</p>
          <p className="mt-3 text-xs text-mute">Practical evidence mapped to matching engine</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-mute">Active Shortlists / Stages</p>
          <p className="mt-2 font-serif text-3xl text-ink">{activeApplications.length}</p>
          <p className="mt-3 text-xs text-mute">Hiring teams reviewing your passport</p>
        </div>
      </div>

      {/* Applications & Pipeline Status */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl">Employer Interest & Interview Pipeline</h2>
        <p className="mt-1 text-sm text-mute">
          When recruiters shortlist your profile, your active conversations appear here.
        </p>

        {activeApplications.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-line bg-paper p-6 text-center text-sm text-mute">
            No active shortlists right now. Keep your skills verified and your passport updated to appear at the top of employer searches.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {activeApplications.map(({ entry, req }) => (
              <div
                key={`${entry.candidateId}-${entry.requirementId}`}
                className="flex items-center justify-between rounded-xl border border-line p-4"
              >
                <div>
                  <p className="font-medium text-ink">{req?.role || 'Hiring Requirement'}</p>
                  <p className="text-xs text-mute">{req?.department} · {req?.location}</p>
                </div>
                <Badge tone="gold">{STAGE_LABEL[entry.stage]}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Skill Strengths & Verified Assessments */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Top Verified Skills & Evidence</h2>
            <Link to="/candidate/profile" className="text-xs font-medium text-teal hover:underline">
              Manage skills
            </Link>
          </div>
          <p className="mt-1 text-xs text-mute">
            Backed by on-platform assessments and verified work history.
          </p>

          <ul className="mt-4 divide-y divide-line">
            {candidate.assessments.map((a) => (
              <li key={a.skill} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="font-medium text-ink">{a.skill}</span>
                  <p className="text-xs text-mute">{a.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg text-ink">{a.score}%</span>
                  <Badge tone={a.verified ? 'teal' : 'warn'}>{a.verified ? 'Verified' : 'Practice'}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Current Skill Proficiency</h2>
            <Link to="/candidate/profile" className="text-xs font-medium text-teal hover:underline">
              + Add skill
            </Link>
          </div>
          <p className="mt-1 text-xs text-mute">
            Organized by candidate self-declared and demonstrated mastery level.
          </p>

          <div className="mt-4 space-y-3">
            {expertSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-teal">Expert</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {expertSkills.map((s) => (
                    <Badge key={s.name} tone={s.verified ? 'teal' : 'neutral'}>
                      {s.name} {s.verified ? '· verified' : ''}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {strongSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">Strong</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {strongSkills.map((s) => (
                    <Badge key={s.name} tone={s.verified ? 'teal' : 'neutral'}>
                      {s.name} {s.verified ? '· verified' : ''}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {workingSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">Working Knowledge</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {workingSkills.map((s) => (
                    <Badge key={s.name} tone="neutral">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recommended Opportunities based on Dynamic Engine */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl">Recommended Company Opportunities</h2>
            <p className="mt-1 text-sm text-mute">
              Real-time compatibility calculated against active employer hiring requirements.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(({ req, match }) => (
            <div
              key={req.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-5 transition hover:-translate-y-0.5 hover:border-ink/20"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl text-ink">{req.role}</h3>
                    <p className="text-xs text-mute">{req.department} · {req.location} ({req.workMode})</p>
                  </div>
                  <span className="font-serif text-2xl text-teal">{match.score}%</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {req.skills.map((s) => (
                    <span key={s.name} className="rounded-md bg-mist px-2 py-0.5 text-[11px] text-ink/75">
                      {s.name} {s.weight}%
                    </span>
                  ))}
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-mute">
                  <p>
                    <span className="font-medium text-ink">Salary:</span> {req.salary}
                  </p>
                  <p>
                    <span className="font-medium text-ink">Joining:</span> {req.joining}
                  </p>
                  <p>
                    <span className="font-medium text-ink">Fit Summary:</span> {match.why[0] || 'Good alignment'}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-line/60 pt-3">
                <Link
                  to="/candidate/passport"
                  className="inline-block text-xs font-medium text-teal hover:underline"
                >
                  View in Talent Passport →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
