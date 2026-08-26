import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { ScoreRing } from '../../components/ui/ScoreRing'
import { computeMatch } from '../../services/matchingEngine'
import { useRecruiter } from '../../state/RecruiterContext'

export function CandidateJobsPage() {
  const { requirements, activeCandidate, applications, savedJobs, applyToJob, toggleSaveJob } =
    useRecruiter()

  const [search, setSearch] = useState('')
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all')
  const [minMatchScore, setMinMatchScore] = useState<number>(0)
  const [appliedToast, setAppliedToast] = useState<string | null>(null)

  if (!activeCandidate) {
    return <p className="text-sm text-mute">Candidate profile not loaded.</p>
  }

  // Filter active jobs
  const jobsWithMatches = requirements
    .filter((req) => req.status === 'active')
    .map((req) => {
      const match = computeMatch(activeCandidate, req)
      const isApplied = applications.some(
        (a) => a.candidateId === activeCandidate.id && a.requirementId === req.id,
      )
      const isSaved = savedJobs.some(
        (s) => s.candidateId === activeCandidate.id && s.requirementId === req.id,
      )
      return { req, match, isApplied, isSaved }
    })
    .filter(({ req, match }) => {
      const matchesSearch =
        req.role.toLowerCase().includes(search.toLowerCase()) ||
        req.department.toLowerCase().includes(search.toLowerCase()) ||
        req.location.toLowerCase().includes(search.toLowerCase()) ||
        req.skills.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))

      const matchesMode =
        selectedWorkMode === 'all' || req.workMode.toLowerCase() === selectedWorkMode.toLowerCase()

      const matchesScore = match.score >= minMatchScore

      return matchesSearch && matchesMode && matchesScore
    })
    .sort((a, b) => b.match.score - a.match.score)

  async function handleApply(requirementId: string, roleName: string, matchScore: number) {
    if (!activeCandidate) return
    await applyToJob(activeCandidate.id, requirementId, matchScore)
    setAppliedToast(`Applied to ${roleName} with your Talent Passport!`)
    setTimeout(() => setAppliedToast(null), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {appliedToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-teal bg-ink px-5 py-3 text-sm text-mist shadow-lg animate-fade-up">
          ✓ {appliedToast}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-ink">Discover Opportunities</h1>
          <p className="mt-2 text-sm text-mute">
            Explore verified employer requirements. Every opportunity is scored dynamically against your
            Talent Passport.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs text-mute">
          <span>Targeting:</span>
          <span className="font-medium text-ink">{activeCandidate.role}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-mute">Search role, skills, or city</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Data Analyst, SQL, Chennai"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-teal"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-mute">Work Mode</label>
          <select
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-teal"
          >
            <option value="all">All Work Modes</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-mute font-medium">
            <span>Minimum Match</span>
            <span className="text-ink font-semibold">{minMatchScore}%+</span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="10"
            value={minMatchScore}
            onChange={(e) => setMinMatchScore(Number(e.target.value))}
            className="mt-2 w-full accent-teal"
          />
        </div>
      </div>

      {/* Job Cards List */}
      <div className="space-y-4">
        {jobsWithMatches.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-12 text-center">
            <p className="font-serif text-lg text-ink">No requirements found</p>
            <p className="mt-1 text-xs text-mute">Try adjusting your search terms or lowering the match filter.</p>
          </div>
        ) : (
          jobsWithMatches.map(({ req, match, isApplied, isSaved }) => (
            <article
              key={req.id}
              className="rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:border-teal/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-mute">Harbor Collective</span>
                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] font-medium text-teal">
                      Verified Employer ✓
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl tracking-tight text-ink">{req.role}</h2>
                  <p className="text-xs text-mute">
                    {req.department} · {req.location} ({req.workMode}) · {req.headcount} open positions
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ScoreRing score={match.score} size={64} strokeWidth={6} />
                  <div className="text-right">
                    <p className="text-xs font-medium text-ink">Explainable Fit</p>
                    <p className="text-[11px] text-mute">{match.why[0] || 'Good alignment'}</p>
                  </div>
                </div>
              </div>

              {/* Badges and Attributes */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Badge tone="neutral">{req.experience}</Badge>
                <Badge tone="neutral">{req.salary}</Badge>
                <Badge tone="teal">Joining: {req.joining}</Badge>
              </div>

              {/* Required Skills Match Preview */}
              <div className="mt-4 border-t border-line/60 pt-4">
                <p className="text-xs font-medium text-mute mb-2">Required Skills & Fit:</p>
                <div className="flex flex-wrap gap-1.5">
                  {match.skillMatches.map((sm) => (
                    <span
                      key={sm.skill}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                        sm.status === 'matched'
                          ? 'bg-teal/15 text-teal'
                          : sm.status === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-mist text-mute'
                      }`}
                    >
                      <span>{sm.status === 'matched' ? '✓' : sm.status === 'partial' ? '⚡' : '○'}</span>
                      {sm.skill} ({sm.weight}%)
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <div className="text-xs text-mute">
                  {isApplied ? (
                    <span className="font-medium text-teal">✓ Applied with Talent Passport</span>
                  ) : (
                    <span>Ready to submit with 1-click Passport</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaveJob(activeCandidate.id, req.id)}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      isSaved
                        ? 'border-ink bg-ink text-mist'
                        : 'border-line bg-paper text-mute hover:border-ink hover:text-ink'
                    }`}
                  >
                    {isSaved ? '★ Saved' : '☆ Save'}
                  </button>

                  <button
                    type="button"
                    disabled={isApplied}
                    onClick={() => handleApply(req.id, req.role, match.score)}
                    className={`rounded-full px-5 py-2 text-xs font-medium transition ${
                      isApplied
                        ? 'bg-mist text-mute cursor-not-allowed'
                        : 'bg-teal text-white hover:bg-teal/90'
                    }`}
                  >
                    {isApplied ? 'Application Submitted' : 'Apply with Talent Passport'}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
