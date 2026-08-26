import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { SkillBar } from '../components/ui/SkillBar'
import { useRecruiter } from '../state/RecruiterContext'

const emptyForm = {
  role: '',
  department: '',
  headcount: 1,
  location: '',
  workMode: 'Hybrid',
  experience: '0–2 years',
  salary: '',
  joining: 'Within 30 days',
  skillsText: 'SQL 30, Power BI 25, Excel 20, Python 15, Communication 10',
}

function parseSkills(text: string) {
  return text
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const parts = chunk.split(/\s+/)
      const weight = Number(parts.pop()?.replace('%', ''))
      const name = parts.join(' ')
      return { name: name || chunk, weight: Number.isFinite(weight) ? weight : 0 }
    })
}

export function RequirementsPage() {
  const { requirements, addRequirement } = useRecruiter()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const created = await addRequirement({
      role: form.role,
      department: form.department || 'General',
      headcount: Number(form.headcount) || 1,
      location: form.location,
      workMode: form.workMode,
      experience: form.experience,
      salary: form.salary,
      joining: form.joining,
      skills: parseSkills(form.skillsText),
    })
    setForm(emptyForm)
    setOpen(false)
    navigate(`/recruiter/requirements/${created.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Hiring requirements</h1>
          <p className="mt-2 text-mute">Structured demand — skills and weights, not a job-board posting.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-mist transition hover:bg-ink-2"
        >
          {open ? 'Close form' : 'New requirement'}
        </button>
      </div>

      {open ? (
        <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-2">
          {(
            [
              ['role', 'Role', 'Data Analyst'],
              ['department', 'Department', 'Insights'],
              ['location', 'Location', 'Chennai'],
              ['salary', 'Salary', '₹4–7 LPA'],
            ] as const
          ).map(([key, label, placeholder]) => (
            <label key={key} className="text-sm">
              <span className="text-mute">{label}</span>
              <input
                required={key === 'role'}
                value={form[key]}
                placeholder={placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-teal"
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="text-mute">Headcount</span>
            <input
              type="number"
              min={1}
              value={form.headcount}
              onChange={(e) => setForm((f) => ({ ...f, headcount: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-teal"
            />
          </label>
          <label className="text-sm">
            <span className="text-mute">Work mode</span>
            <select
              value={form.workMode}
              onChange={(e) => setForm((f) => ({ ...f, workMode: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-teal"
            >
              <option>Hybrid</option>
              <option>On-site</option>
              <option>Remote</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-mute">Experience</span>
            <input
              value={form.experience}
              onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-teal"
            />
          </label>
          <label className="text-sm">
            <span className="text-mute">Joining requirement</span>
            <input
              value={form.joining}
              onChange={(e) => setForm((f) => ({ ...f, joining: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-teal"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="text-mute">Weighted skills (name + weight, comma-separated)</span>
            <textarea
              value={form.skillsText}
              onChange={(e) => setForm((f) => ({ ...f, skillsText: e.target.value }))}
              rows={2}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 outline-none focus:border-teal"
            />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-full bg-teal px-5 py-2 text-sm font-medium text-white hover:bg-teal/90">
              Save requirement
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid gap-4">
        {requirements.map((req) => (
          <Link
            key={req.id}
            to={`/recruiter/requirements/${req.id}`}
            className="rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-ink/20"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl">{req.role}</h2>
                <p className="mt-1 text-sm text-mute">
                  {req.headcount} seats · {req.location} / {req.workMode} · {req.experience} · {req.salary}
                </p>
              </div>
              <Badge tone={req.status === 'active' ? 'teal' : 'neutral'}>{req.status}</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {req.skills.map((skill) => (
                <SkillBar key={skill.name} name={skill.name} weight={skill.weight} value={skill.weight} />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
