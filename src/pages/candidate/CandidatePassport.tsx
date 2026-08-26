import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { useRecruiter } from '../../state/RecruiterContext'

export function CandidatePassportPage() {
  const { activeCandidate } = useRecruiter()
  const candidate = activeCandidate

  const [copiedToast, setCopiedToast] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  if (!candidate) {
    return <p>Candidate not found.</p>
  }

  const shareUrl = `${window.location.origin}/recruiter/candidates/${candidate.id}`

  function handleCopyLink() {
    navigator.clipboard?.writeText(shareUrl)
    setCopiedToast(true)
    setTimeout(() => setCopiedToast(false), 2500)
  }

  const verifiedSkills = candidate.skills.filter((s) => s.verified)
  const selfDeclaredSkills = candidate.skills.filter((s) => !s.verified)

  return (
    <div className="space-y-8 pb-12">
      {/* Copied Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-teal bg-ink px-5 py-3 text-sm text-mist shadow-lg animate-fade-up">
          ✓ Passport link copied to clipboard: <span className="font-mono text-teal-bright text-xs">{shareUrl}</span>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-line bg-white p-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-ink">Share Talent Passport</h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-full p-1 text-mute hover:bg-mist"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-mute">
              Your portable Talent Passport verifies your real ability and projects without exposing private contact info until consent is granted.
            </p>

            <div className="mt-4 rounded-xl border border-line bg-paper p-3">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-mute">Public Recruiter Link</p>
              <p className="mt-1 font-mono text-xs text-ink truncate">{shareUrl}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  handleCopyLink()
                  setShowShareModal(false)
                }}
                className="rounded-full bg-teal px-5 py-2 text-xs font-medium text-white transition hover:bg-teal/90"
              >
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-full border border-line px-5 py-2 text-xs font-medium text-ink transition hover:border-ink"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Identity Card */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-mute">Adept Verified Credential</p>
              {candidate.verified ? (
                <Badge tone="teal">Verified Talent Passport</Badge>
              ) : (
                <Badge tone="warn">Unverified Profile</Badge>
              )}
            </div>
            <h1 className="mt-2 font-serif text-4xl tracking-tight text-ink">{candidate.name}</h1>
            <p className="mt-1 text-base text-mute">
              {candidate.role} · {candidate.location} ({candidate.workMode})
            </p>
            <p className="mt-1 text-xs text-mute">
              Availability: <span className="font-medium text-ink">{candidate.availability}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="rounded-full bg-ink px-4 py-2 text-xs font-medium text-mist transition hover:bg-ink-2"
            >
              Share Passport
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full border border-line px-4 py-2 text-xs font-medium text-ink transition hover:border-ink"
            >
              Copy Link
            </button>
            <Link
              to="/candidate/profile"
              className="rounded-full border border-line px-4 py-2 text-xs font-medium text-mute transition hover:border-ink hover:text-ink"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Verified vs Self-Declared Skills */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verified Skills */}
        <section className="rounded-2xl border border-teal/30 bg-teal/5 p-6">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl text-teal">Verified Skills & Assessments</h2>
            <Badge tone="teal">Verified Evidence</Badge>
          </div>
          <p className="mt-1 text-xs text-mute">
            Backed by verified on-platform assessment scores and verified badges.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {verifiedSkills.map((skill) => (
              <Badge key={skill.name} tone="teal">
                {skill.name} · {skill.level} (Verified)
              </Badge>
            ))}
          </div>

          <ul className="mt-5 divide-y divide-line/60">
            {candidate.assessments
              .filter((a) => a.verified)
              .map((a) => (
                <li key={a.skill} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{a.skill} assessment</span>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg text-teal">{a.score}%</span>
                    <Badge tone="ink">{a.date}</Badge>
                  </div>
                </li>
              ))}
          </ul>
        </section>

        {/* Self-Declared Skills */}
        <section className="rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl text-ink">Self-Declared Skills</h2>
            <Badge tone="neutral">Declared</Badge>
          </div>
          <p className="mt-1 text-xs text-mute">
            Skills declared on candidate profile without formal on-platform assessment.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {selfDeclaredSkills.length > 0 ? (
              selfDeclaredSkills.map((skill) => (
                <Badge key={skill.name} tone="neutral">
                  {skill.name} · {skill.level}
                </Badge>
              ))
            ) : (
              <p className="text-xs text-mute">All current skills are verified!</p>
            )}
          </div>

          <div className="mt-6 rounded-xl bg-mist/60 p-4">
            <p className="text-xs font-medium text-ink">Want to boost your match scores?</p>
            <p className="mt-1 text-xs text-mute">
              Complete on-platform assessments for your self-declared skills to elevate them to verified badges.
            </p>
          </div>
        </section>
      </div>

      {/* Practical Projects Evidence */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl text-ink">Demonstrated Projects & Practical Evidence</h2>
        <p className="mt-1 text-sm text-mute">
          Real models, applications, and pipelines built by candidate.
        </p>

        <div className="mt-5 space-y-4">
          {candidate.projects.map((project) => (
            <article key={project.title} className="rounded-xl border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-base text-ink">{project.title}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal hover:underline"
                  >
                    View Project Repo / Demo ↗
                  </a>
                )}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-mute">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.skills.map((s) => (
                  <span key={s} className="rounded-md bg-mist px-2 py-0.5 text-[11px] text-ink/80">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Work Experience */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl text-ink">Work Experience & Internships</h2>
        <div className="mt-4 divide-y divide-line">
          {candidate.experience.map((job) => (
            <div key={job.org} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between">
                <p className="font-medium text-ink">{job.title}</p>
                <span className="text-xs text-mute">{job.duration}</span>
              </div>
              <p className="text-xs text-teal">{job.org}</p>
              <ul className="mt-2.5 list-disc space-y-1 pl-4 text-xs leading-relaxed text-mute">
                {job.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Academic Credentials */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl text-ink">Education & Academic Foundation</h2>
        <div className="mt-3">
          <p className="font-medium text-base text-ink">
            {candidate.education.degree}, {candidate.education.school}
          </p>
          <p className="text-xs text-mute">
            Graduated {candidate.education.year}
            {candidate.education.fieldOfStudy ? ` · Field: ${candidate.education.fieldOfStudy}` : ''}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-mute">{candidate.education.relevance}</p>
        </div>
      </section>

      {/* Career Preferences */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-2xl text-ink">Employment & Target Preferences</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-xl border border-line p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-mute">Work Mode</p>
            <p className="mt-1 text-sm font-medium text-ink">{candidate.workMode}</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-mute">Availability</p>
            <p className="mt-1 text-sm font-medium text-ink">{candidate.availability}</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-xs uppercase tracking-[0.14em] text-mute">Target Roles</p>
            <p className="mt-1 text-sm font-medium text-ink">
              {candidate.careerPreferences?.targetRoles?.join(', ') || candidate.role}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
