import { Link, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { SkillBar } from '../components/ui/SkillBar'
import { useRecruiter } from '../state/RecruiterContext'

export function RequirementDetailPage() {
  const { requirementId = '' } = useParams()
  const { requirements, getMatchesForRequirement } = useRecruiter()
  const req = requirements.find((r) => r.id === requirementId)

  if (!req) {
    return (
      <div>
        <h1 className="font-serif text-3xl">Requirement not found</h1>
        <Link to="/recruiter/requirements" className="mt-4 inline-block text-teal hover:underline">
          Back to requirements
        </Link>
      </div>
    )
  }

  const ranked = getMatchesForRequirement(req.id)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-mute">{req.department}</p>
          <h1 className="mt-1 font-serif text-4xl tracking-tight">{req.role}</h1>
          <p className="mt-2 text-mute">
            {req.headcount} headcount · {req.location} / {req.workMode} · {req.experience}
          </p>
        </div>
        <Link
          to={`/recruiter/requirements/${req.id}/matches`}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-mist transition hover:bg-ink-2"
        >
          View ranked matches
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Salary', req.salary],
          ['Joining', req.joining],
          ['Potential matches', String(ranked.length || req.potentialMatches)],
          ['Verified matches', String(req.verifiedMatches)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-mute">{label}</p>
            <p className="mt-2 font-serif text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="font-serif text-2xl">Weighted skill priorities</h2>
          <Badge tone="ink">Explainable matching input</Badge>
        </div>
        <p className="mb-6 max-w-2xl text-sm text-mute">
          These weights are the contract with hiring managers. Match scores allocate more of the
          total to higher-priority skills, then layer verification, projects, and logistics.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {req.skills.map((skill) => (
            <SkillBar key={skill.name} name={skill.name} weight={skill.weight} value={skill.weight} />
          ))}
        </div>
      </section>
    </div>
  )
}
