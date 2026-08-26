import { useState, type FormEvent } from 'react'
import { Badge } from '../../components/ui/Badge'
import type { SkillLevel } from '../../data/types'
import { useRecruiter } from '../../state/RecruiterContext'

export function CandidateProfilePage() {
  const {
    activeCandidate,
    updateCandidate,
    addCandidateSkill,
    removeCandidateSkill,
    updateCandidateSkill,
    addCandidateProject,
    removeCandidateProject,
    addCandidateExperience,
    removeCandidateExperience,
  } = useRecruiter()

  const candidate = activeCandidate

  // Saved notification state
  const [savedToast, setSavedToast] = useState(false)

  // Local state for modal/forms
  const [skillForm, setSkillForm] = useState<{ name: string; level: SkillLevel; verified: boolean }>({
    name: '',
    level: 'strong',
    verified: false,
  })
  const [showSkillModal, setShowSkillModal] = useState(false)

  const [projectForm, setProjectForm] = useState<{ title: string; description: string; skills: string; link: string }>({
    title: '',
    description: '',
    skills: '',
    link: '',
  })
  const [showProjectModal, setShowProjectModal] = useState(false)

  const [expForm, setExpForm] = useState<{ title: string; org: string; duration: string; bullets: string }>({
    title: '',
    org: '',
    duration: '',
    bullets: '',
  })
  const [showExpModal, setShowExpModal] = useState(false)

  if (!candidate) {
    return <p>Candidate not found.</p>
  }

  function showToast() {
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 2500)
  }

  function handleIdentitySave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!candidate) return
    const form = new FormData(e.currentTarget)
    updateCandidate(candidate.id, {
      name: String(form.get('name') || ''),
      role: String(form.get('role') || ''),
      location: String(form.get('location') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
    })
    showToast()
  }

  function handleCareerSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!candidate) return
    const form = new FormData(e.currentTarget)
    const workMode = String(form.get('workMode') || 'Hybrid')
    const availability = String(form.get('availability') || '')
    const salaryExpectation = String(form.get('salaryExpectation') || '')
    const targetRoles = String(form.get('targetRoles') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const industries = String(form.get('industries') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    updateCandidate(candidate.id, {
      workMode,
      availability,
      preferences: [
        `${candidate.location} ${workMode}`,
        targetRoles[0] || candidate.role,
        salaryExpectation || 'Competitive',
      ],
      careerPreferences: {
        targetRoles,
        industries,
        workMode,
        salaryExpectation,
        availability,
      },
    })
    showToast()
  }

  function handleEducationSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!candidate) return
    const form = new FormData(e.currentTarget)
    updateCandidate(candidate.id, {
      education: {
        degree: String(form.get('degree') || ''),
        school: String(form.get('school') || ''),
        fieldOfStudy: String(form.get('fieldOfStudy') || ''),
        year: String(form.get('year') || ''),
        relevance: String(form.get('relevance') || ''),
      },
    })
    showToast()
  }

  function handleAddSkill(e: FormEvent) {
    e.preventDefault()
    if (!candidate || !skillForm.name.trim()) return
    addCandidateSkill(candidate.id, {
      name: skillForm.name.trim(),
      level: skillForm.level,
      verified: skillForm.verified,
    })
    setSkillForm({ name: '', level: 'strong', verified: false })
    setShowSkillModal(false)
    showToast()
  }

  function handleAddProject(e: FormEvent) {
    e.preventDefault()
    if (!candidate || !projectForm.title.trim()) return
    const skills = projectForm.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    addCandidateProject(candidate.id, {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      skills,
      link: projectForm.link.trim() || undefined,
    })
    setProjectForm({ title: '', description: '', skills: '', link: '' })
    setShowProjectModal(false)
    showToast()
  }

  function handleAddExperience(e: FormEvent) {
    e.preventDefault()
    if (!candidate || !expForm.title.trim() || !expForm.org.trim()) return
    const bullets = expForm.bullets
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    addCandidateExperience(candidate.id, {
      title: expForm.title.trim(),
      org: expForm.org.trim(),
      duration: expForm.duration.trim(),
      bullets: bullets.length > 0 ? bullets : ['Key contributor in role operations.'],
    })
    setExpForm({ title: '', org: '', duration: '', bullets: '' })
    setShowExpModal(false)
    showToast()
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-teal bg-ink px-5 py-3 text-sm text-mist shadow-lg animate-fade-up">
          ✓ Profile updated and synchronized with Talent Passport
        </div>
      )}

      <div>
        <h1 className="font-serif text-4xl tracking-tight text-ink">Edit Talent Profile</h1>
        <p className="mt-2 max-w-2xl text-mute">
          Manage your verified credentials, practical projects, career goals, and skills. Changes
          automatically update your matching scores in real-time.
        </p>
      </div>

      {/* 1. Identity & Basics */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl text-ink">1. Identity & Contact Information</h2>
        <p className="mt-1 text-xs text-mute">Basic candidate details used across your passport.</p>

        <form onSubmit={handleIdentitySave} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="text-mute">Full Name</span>
            <input
              name="name"
              defaultValue={candidate.name}
              required
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Professional Headline / Role</span>
            <input
              name="role"
              defaultValue={candidate.role}
              required
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Location (City)</span>
            <input
              name="location"
              defaultValue={candidate.location}
              required
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Email Address</span>
            <input
              name="email"
              type="email"
              defaultValue={candidate.email || `${candidate.initials.toLowerCase()}@example.com`}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="text-mute">Phone Number</span>
            <input
              name="phone"
              defaultValue={candidate.phone || '+91 98765 43210'}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-mist transition hover:bg-ink-2"
            >
              Save Identity Details
            </button>
          </div>
        </form>
      </section>

      {/* 2. Career Preferences */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl text-ink">2. Career & Employment Preferences</h2>
        <p className="mt-1 text-xs text-mute">Tell the matching engine what types of roles and conditions you prefer.</p>

        <form onSubmit={handleCareerSave} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="text-mute">Work Mode Preference</span>
            <select
              name="workMode"
              defaultValue={candidate.workMode}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            >
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid / relocate to Chennai">Hybrid / Open to Relocation</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="text-mute">Availability / Notice Period</span>
            <input
              name="availability"
              defaultValue={candidate.availability}
              required
              placeholder="e.g. Immediate · 15-day notice"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Target Salary Range</span>
            <input
              name="salaryExpectation"
              defaultValue={candidate.careerPreferences?.salaryExpectation || '₹5–7 LPA'}
              placeholder="e.g. ₹5–7 LPA"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Target Roles (comma-separated)</span>
            <input
              name="targetRoles"
              defaultValue={candidate.careerPreferences?.targetRoles?.join(', ') || candidate.role}
              placeholder="e.g. Data Analyst, Business Analyst, BI Specialist"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="text-mute">Target Industries</span>
            <input
              name="industries"
              defaultValue={candidate.careerPreferences?.industries?.join(', ') || 'Technology, Retail Analytics, Finance'}
              placeholder="e.g. Technology, Retail Analytics, Finance"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-mist transition hover:bg-ink-2"
            >
              Save Career Preferences
            </button>
          </div>
        </form>
      </section>

      {/* 3. Skills Management */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-ink">3. Skills & Proficiency Matrix</h2>
            <p className="mt-1 text-xs text-mute">Add technical or functional skills and set proficiency levels.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSkillModal(true)}
            className="rounded-full bg-teal px-4 py-1.5 text-xs font-medium text-white transition hover:bg-teal/90"
          >
            + Add New Skill
          </button>
        </div>

        {/* Add Skill Modal/Inline Form */}
        {showSkillModal && (
          <form onSubmit={handleAddSkill} className="mt-4 rounded-xl border border-line bg-paper p-4">
            <h3 className="text-sm font-medium text-ink">Add Skill to Profile</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="text-xs">
                <span className="text-mute">Skill Name</span>
                <input
                  value={skillForm.name}
                  onChange={(e) => setSkillForm((s) => ({ ...s, name: e.target.value }))}
                  required
                  placeholder="e.g. Python, SQL, Tableau"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs">
                <span className="text-mute">Proficiency Level</span>
                <select
                  value={skillForm.level}
                  onChange={(e) => setSkillForm((s) => ({ ...s, level: e.target.value as SkillLevel }))}
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                >
                  <option value="working">Working Knowledge (50%)</option>
                  <option value="strong">Strong (80%)</option>
                  <option value="expert">Expert (100%)</option>
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={skillForm.verified}
                  onChange={(e) => setSkillForm((s) => ({ ...s, verified: e.target.checked }))}
                />
                Verified Skill Badge
              </label>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-mist hover:bg-ink-2"
              >
                Save Skill
              </button>
              <button
                type="button"
                onClick={() => setShowSkillModal(false)}
                className="rounded-full border border-line px-4 py-1.5 text-xs text-mute hover:border-ink hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {candidate.skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between rounded-xl border border-line p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-ink">{skill.name}</p>
                  <Badge tone={skill.verified ? 'teal' : 'neutral'}>
                    {skill.verified ? 'Verified' : 'Self-Declared'}
                  </Badge>
                </div>
                <select
                  value={skill.level}
                  onChange={(e) =>
                    updateCandidateSkill(candidate.id, skill.name, {
                      level: e.target.value as SkillLevel,
                    })
                  }
                  className="mt-1.5 rounded-md border border-line bg-paper px-2 py-0.5 text-xs text-mute outline-none focus:border-teal"
                >
                  <option value="working">Working</option>
                  <option value="strong">Strong</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => removeCandidateSkill(candidate.id, skill.name)}
                className="rounded-full p-1 text-xs text-mute transition hover:bg-red-50 hover:text-red-600"
                title="Remove skill"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Projects Management */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-ink">4. Practical Projects & Portfolio</h2>
            <p className="mt-1 text-xs text-mute">Evidence that boosts your practical match rating.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowProjectModal(true)}
            className="rounded-full bg-teal px-4 py-1.5 text-xs font-medium text-white transition hover:bg-teal/90"
          >
            + Add Project
          </button>
        </div>

        {showProjectModal && (
          <form onSubmit={handleAddProject} className="mt-4 rounded-xl border border-line bg-paper p-4">
            <h3 className="text-sm font-medium text-ink">Add Project Evidence</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs">
                <span className="text-mute">Project Title</span>
                <input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="e.g. Retail Demand Forecasting Model"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs">
                <span className="text-mute">Portfolio / GitHub Link</span>
                <input
                  value={projectForm.link}
                  onChange={(e) => setProjectForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs sm:col-span-2">
                <span className="text-mute">Demonstrated Skills (comma-separated)</span>
                <input
                  value={projectForm.skills}
                  onChange={(e) => setProjectForm((p) => ({ ...p, skills: e.target.value }))}
                  placeholder="e.g. SQL, Python, Power BI"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs sm:col-span-2">
                <span className="text-mute">Description & Business Impact</span>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
                  required
                  rows={2}
                  placeholder="Describe the problem, technology stack, and outcome..."
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-mist hover:bg-ink-2"
              >
                Save Project
              </button>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="rounded-full border border-line px-4 py-1.5 text-xs text-mute hover:border-ink hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 space-y-3">
          {candidate.projects.map((proj) => (
            <div
              key={proj.title}
              className="flex items-start justify-between rounded-xl border border-line p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{proj.title}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal hover:underline"
                    >
                      🔗 Link
                    </a>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-mute">{proj.description}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {proj.skills.map((s) => (
                    <span key={s} className="rounded-md bg-mist px-2 py-0.5 text-[11px] text-ink/75">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeCandidateProject(candidate.id, proj.title)}
                className="rounded-full p-1 text-xs text-mute transition hover:bg-red-50 hover:text-red-600"
                title="Remove project"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Experience Management */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-ink">5. Work Experience & Internships</h2>
            <p className="mt-1 text-xs text-mute">Add professional roles, internships, or freelance tenures.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowExpModal(true)}
            className="rounded-full bg-teal px-4 py-1.5 text-xs font-medium text-white transition hover:bg-teal/90"
          >
            + Add Experience
          </button>
        </div>

        {showExpModal && (
          <form onSubmit={handleAddExperience} className="mt-4 rounded-xl border border-line bg-paper p-4">
            <h3 className="text-sm font-medium text-ink">Add Work Experience</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="text-xs">
                <span className="text-mute">Job Title / Role</span>
                <input
                  value={expForm.title}
                  onChange={(e) => setExpForm((x) => ({ ...x, title: e.target.value }))}
                  required
                  placeholder="e.g. Analytics Intern"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs">
                <span className="text-mute">Company / Organization</span>
                <input
                  value={expForm.org}
                  onChange={(e) => setExpForm((x) => ({ ...x, org: e.target.value }))}
                  required
                  placeholder="e.g. Coastal Retail Labs"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs">
                <span className="text-mute">Duration</span>
                <input
                  value={expForm.duration}
                  onChange={(e) => setExpForm((x) => ({ ...x, duration: e.target.value }))}
                  required
                  placeholder="e.g. Jan 2026 – Jun 2026 (6 months)"
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>

              <label className="text-xs sm:col-span-3">
                <span className="text-mute">Key Contributions / Bullets (one per line)</span>
                <textarea
                  value={expForm.bullets}
                  onChange={(e) => setExpForm((x) => ({ ...x, bullets: e.target.value }))}
                  rows={3}
                  placeholder="Owned weekly reporting pack for category managers&#10;Wrote parameterized SQL queries..."
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-teal"
                />
              </label>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-mist hover:bg-ink-2"
              >
                Save Experience
              </button>
              <button
                type="button"
                onClick={() => setShowExpModal(false)}
                className="rounded-full border border-line px-4 py-1.5 text-xs text-mute hover:border-ink hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 space-y-3">
          {candidate.experience.map((job) => (
            <div
              key={job.org}
              className="flex items-start justify-between rounded-xl border border-line p-4"
            >
              <div>
                <p className="font-medium text-ink">
                  {job.title} · <span className="text-mute">{job.org}</span>
                </p>
                <p className="text-xs text-mute">{job.duration}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-mute">
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => removeCandidateExperience(candidate.id, job.org)}
                className="rounded-full p-1 text-xs text-mute transition hover:bg-red-50 hover:text-red-600"
                title="Remove experience"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Education */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-serif text-xl text-ink">6. Education & Academic Background</h2>
        <p className="mt-1 text-xs text-mute">Degree credentials and coursework relevance.</p>

        <form onSubmit={handleEducationSave} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-mute">Degree / Qualification</span>
            <input
              name="degree"
              defaultValue={candidate.education.degree}
              required
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Institution / University</span>
            <input
              name="school"
              defaultValue={candidate.education.school}
              required
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Field of Study</span>
            <input
              name="fieldOfStudy"
              defaultValue={candidate.education.fieldOfStudy || 'Applied Statistics & Data Labs'}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm">
            <span className="text-mute">Graduation Year</span>
            <input
              name="year"
              defaultValue={candidate.education.year}
              required
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <label className="text-sm sm:col-span-2">
            <span className="text-mute">Coursework Relevance Description</span>
            <textarea
              name="relevance"
              defaultValue={candidate.education.relevance}
              rows={2}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-ink px-5 py-2 text-xs font-medium text-mist transition hover:bg-ink-2"
            >
              Save Education
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
