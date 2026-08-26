import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { ScoreRing } from '../../components/ui/ScoreRing'
import type { ApplicationStatus } from '../../data/types'
import { useRecruiter } from '../../state/RecruiterContext'

const STAGE_LABELS: Record<ApplicationStatus, { label: string; tone: 'teal' | 'gold' | 'neutral' }> = {
  applied: { label: 'Application Submitted', tone: 'neutral' },
  reviewing: { label: 'Recruiter Reviewing', tone: 'teal' },
  interviewing: { label: 'Interview Scheduled', tone: 'gold' },
  offered: { label: 'Offer Received', tone: 'teal' },
  rejected: { label: 'Archived / Not Selected', tone: 'neutral' },
  withdrawn: { label: 'Withdrawn', tone: 'neutral' },
}

export function CandidateApplicationsPage() {
  const { applications, requirements, activeCandidate, savedJobs } = useRecruiter()
  const [filterTab, setFilterTab] = useState<'all' | 'saved' | ApplicationStatus>('all')

  if (!activeCandidate) {
    return <p className="text-sm text-mute">Candidate profile not loaded.</p>
  }

  const candidateApps = applications.filter((a) => a.candidateId === activeCandidate.id)
  const candidateSaved = savedJobs.filter((s) => s.candidateId === activeCandidate.id)

  const filteredApps = candidateApps.filter((a) => {
    if (filterTab === 'all') return true
    if (filterTab === 'saved') return false
    return a.status === filterTab
  })

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="font-serif text-4xl tracking-tight text-ink">Application Tracker</h1>
        <p className="mt-2 text-sm text-mute">
          Track the status of your applications, recruiter reviews, interview invitations, and saved opportunities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-3 text-xs">
        <button
          type="button"
          onClick={() => setFilterTab('all')}
          className={`rounded-full px-4 py-1.5 font-medium transition ${
            filterTab === 'all'
              ? 'bg-ink text-mist'
              : 'border border-line bg-white text-mute hover:border-ink hover:text-ink'
          }`}
        >
          All Applications ({candidateApps.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('saved')}
          className={`rounded-full px-4 py-1.5 font-medium transition ${
            filterTab === 'saved'
              ? 'bg-ink text-mist'
              : 'border border-line bg-white text-mute hover:border-ink hover:text-ink'
          }`}
        >
          ★ Saved Jobs ({candidateSaved.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('applied')}
          className={`rounded-full px-4 py-1.5 font-medium transition ${
            filterTab === 'applied'
              ? 'bg-ink text-mist'
              : 'border border-line bg-white text-mute hover:border-ink hover:text-ink'
          }`}
        >
          Submitted ({candidateApps.filter((a) => a.status === 'applied').length})
        </button>

        <button
          type="button"
          onClick={() => setFilterTab('interviewing')}
          className={`rounded-full px-4 py-1.5 font-medium transition ${
            filterTab === 'interviewing'
              ? 'bg-ink text-mist'
              : 'border border-line bg-white text-mute hover:border-ink hover:text-ink'
          }`}
        >
          Interviews ({candidateApps.filter((a) => a.status === 'interviewing').length})
        </button>
      </div>

      {/* Content */}
      {filterTab === 'saved' ? (
        <div className="space-y-4">
          {candidateSaved.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-12 text-center">
              <p className="font-serif text-lg text-ink">No saved jobs yet</p>
              <p className="mt-1 text-xs text-mute">
                Bookmark requirements from the{' '}
                <Link to="/candidate/jobs" className="text-teal underline">
                  Discover Opportunities
                </Link>{' '}
                page.
              </p>
            </div>
          ) : (
            candidateSaved.map((s) => {
              const req = requirements.find((r) => r.id === s.requirementId)
              if (!req) return null
              return (
                <article
                  key={s.requirementId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm"
                >
                  <div>
                    <span className="text-xs text-mute">Saved on {s.savedAt}</span>
                    <h3 className="font-serif text-xl text-ink">{req.role}</h3>
                    <p className="text-xs text-mute">
                      Harbor Collective · {req.location} ({req.workMode}) · {req.salary}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/candidate/jobs"
                      className="rounded-full bg-teal px-4 py-1.5 text-xs font-medium text-white hover:bg-teal/90"
                    >
                      View & Apply
                    </Link>
                  </div>
                </article>
              )
            })
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-12 text-center">
              <p className="font-serif text-lg text-ink">No active applications in this tab</p>
              <p className="mt-1 text-xs text-mute">
                Browse open requirements and submit with your Talent Passport in{' '}
                <Link to="/candidate/jobs" className="text-teal underline">
                  Discover Opportunities
                </Link>
                .
              </p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const req = requirements.find((r) => r.id === app.requirementId)
              const stageConfig = STAGE_LABELS[app.status] || { label: app.status, tone: 'neutral' }

              return (
                <article
                  key={app.id}
                  className="rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:border-line/90"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-mute">Harbor Collective</span>
                        <Badge tone={stageConfig.tone}>{stageConfig.label}</Badge>
                      </div>

                      <h2 className="mt-1 font-serif text-2xl tracking-tight text-ink">
                        {req?.role || 'Hiring Requirement'}
                      </h2>
                      <p className="text-xs text-mute">
                        Applied on {app.appliedAt} · {req?.location} ({req?.workMode})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <ScoreRing score={app.matchScoreAtApplication} size={54} strokeWidth={5} />
                      <div className="text-right">
                        <p className="text-xs font-medium text-ink">Submitted Match</p>
                        <p className="text-[11px] text-mute">{app.matchScoreAtApplication}% Verified Fit</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-4 text-xs text-mute">
                    <span>
                      Talent Passport submitted to hiring committee · Feedback tracked in real-time
                    </span>
                    <Link
                      to="/candidate/passport"
                      className="font-medium text-teal hover:underline"
                    >
                      View Submitted Passport →
                    </Link>
                  </div>
                </article>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
