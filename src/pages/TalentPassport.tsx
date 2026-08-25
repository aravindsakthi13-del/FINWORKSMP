import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { useRecruiter } from '../state/RecruiterContext'

export function TalentPassportPage() {
  const { candidateId = '' } = useParams()
  const { candidates } = useRecruiter()
  const candidate = candidates.find((c) => c.id === candidateId)

  if (!candidate) {
    return <p>Candidate not found.</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-mute">Talent Passport</p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight">{candidate.name}</h1>
          <p className="mt-2 text-mute">
            {candidate.role} · {candidate.location} · {candidate.workMode}
          </p>
        </div>
        {candidate.verified ? <Badge tone="teal">Verified</Badge> : <Badge tone="warn">Unverified</Badge>}
      </div>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <Badge key={skill.name} tone={skill.verified ? 'teal' : 'neutral'}>
              {skill.name} · {skill.level}
              {skill.verified ? ' · verified' : ''}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl">Verified skills & assessments</h2>
        <ul className="mt-4 divide-y divide-line">
          {candidate.assessments.map((a) => (
            <li key={a.skill} className="flex items-center justify-between py-3 text-sm">
              <span>
                {a.skill} · {a.date}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-serif text-xl">{a.score}</span>
                <Badge tone={a.verified ? 'teal' : 'warn'}>{a.verified ? 'Verified' : 'Practice'}</Badge>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl">Projects</h2>
        <ul className="mt-4 space-y-5">
          {candidate.projects.map((project) => (
            <li key={project.title}>
              <p className="font-medium">{project.title}</p>
              <p className="mt-1 text-sm text-mute">{project.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl">Experience</h2>
        <ul className="mt-4 space-y-5">
          {candidate.experience.map((job) => (
            <li key={job.org}>
              <p className="font-medium">
                {job.title} · {job.org}
              </p>
              <p className="text-xs text-mute">{job.duration}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-mute">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl">Education</h2>
        <p className="mt-3 font-medium">
          {candidate.education.degree}, {candidate.education.school}
        </p>
        <p className="text-sm text-mute">{candidate.education.year}</p>
        <p className="mt-2 text-sm text-mute">{candidate.education.relevance}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Preferences</h2>
          <ul className="mt-3 space-y-2 text-sm text-mute">
            {candidate.preferences.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl">Availability</h2>
          <p className="mt-3 text-sm">{candidate.availability}</p>
          <Link
            to="/recruiter/requirements/req-data-analyst/matches"
            className="mt-4 inline-block text-sm text-teal hover:underline"
          >
            Compare against Data Analyst req
          </Link>
        </div>
      </section>
    </div>
  )
}
