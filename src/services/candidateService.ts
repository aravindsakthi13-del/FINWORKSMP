import type {
  Assessment,
  Candidate,
  CandidateSkill,
  ExperienceItem,
  Project,
} from '../data/types'
import { isSupabaseConfigured, supabase } from './supabaseClient'

interface DbCandidateRow {
  id: string
  user_id?: string
  name: string
  role: string
  initials: string
  location: string
  work_mode: string
  availability: string
  experience_summary?: string
  email?: string
  phone?: string
  verified: boolean
  education: Candidate['education']
  preferences: string[]
  career_preferences?: Candidate['careerPreferences']
  candidate_skills?: CandidateSkill[]
  candidate_projects?: Project[]
  candidate_experience?: ExperienceItem[]
  candidate_assessments?: Assessment[]
}

function mapDbRowToCandidate(row: DbCandidateRow): Candidate {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    initials: row.initials,
    location: row.location,
    workMode: row.work_mode,
    availability: row.availability,
    experienceSummary: row.experience_summary || '',
    email: row.email,
    phone: row.phone,
    verified: row.verified,
    education: row.education || {
      degree: 'Degree',
      school: 'University',
      year: '2026',
      relevance: '',
    },
    preferences: row.preferences || [],
    careerPreferences: row.career_preferences,
    skills: (row.candidate_skills || []).map((s) => ({
      name: s.name,
      level: s.level,
      verified: Boolean(s.verified),
    })),
    projects: (row.candidate_projects || []).map((p) => ({
      title: p.title,
      description: p.description,
      skills: p.skills || [],
      link: p.link,
    })),
    experience: (row.candidate_experience || []).map((e) => ({
      title: e.title,
      org: e.org,
      duration: e.duration,
      bullets: e.bullets || [],
    })),
    assessments: (row.candidate_assessments || []).map((a) => ({
      skill: a.skill,
      score: Number(a.score),
      verified: Boolean(a.verified),
      date: a.date,
    })),
  }
}

export async function fetchCandidates(): Promise<{
  data: Candidate[] | null
  error: Error | null
}> {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
      ),
    }
  }

  const { data, error } = await supabase
    .from('candidates')
    .select(`
      *,
      candidate_skills (*),
      candidate_projects (*),
      candidate_experience (*),
      candidate_assessments (*)
    `)
    .order('name', { ascending: true })

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const candidates: Candidate[] = (data as unknown as DbCandidateRow[]).map(mapDbRowToCandidate)
  return { data: candidates, error: null }
}

export async function fetchCandidateById(
  id: string,
): Promise<{ data: Candidate | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error('Supabase is not configured.'),
    }
  }

  const { data, error } = await supabase
    .from('candidates')
    .select(`
      *,
      candidate_skills (*),
      candidate_projects (*),
      candidate_experience (*),
      candidate_assessments (*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return { data: null, error: error ? new Error(error.message) : new Error('Candidate not found') }
  }

  return { data: mapDbRowToCandidate(data as unknown as DbCandidateRow), error: null }
}

export async function updateCandidateProfile(
  candidateId: string,
  updates: Partial<Candidate>,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase is not configured.') }
  }

  const dbUpdates: Record<string, unknown> = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.role !== undefined) dbUpdates.role = updates.role
  if (updates.initials !== undefined) dbUpdates.initials = updates.initials
  if (updates.location !== undefined) dbUpdates.location = updates.location
  if (updates.workMode !== undefined) dbUpdates.work_mode = updates.workMode
  if (updates.availability !== undefined) dbUpdates.availability = updates.availability
  if (updates.experienceSummary !== undefined) dbUpdates.experience_summary = updates.experienceSummary
  if (updates.email !== undefined) dbUpdates.email = updates.email
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone
  if (updates.education !== undefined) dbUpdates.education = updates.education
  if (updates.preferences !== undefined) dbUpdates.preferences = updates.preferences
  if (updates.careerPreferences !== undefined) dbUpdates.career_preferences = updates.careerPreferences
  if (updates.verified !== undefined) dbUpdates.verified = updates.verified
  dbUpdates.updated_at = new Date().toISOString()

  const { error } = await supabase
    .from('candidates')
    .update(dbUpdates)
    .eq('id', candidateId)

  return { error: error ? new Error(error.message) : null }
}

export async function addCandidateSkill(
  candidateId: string,
  skill: CandidateSkill,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase.from('candidate_skills').insert({
    candidate_id: candidateId,
    name: skill.name,
    level: skill.level,
    verified: skill.verified,
  })

  return { error: error ? new Error(error.message) : null }
}

export async function removeCandidateSkill(
  candidateId: string,
  skillName: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase
    .from('candidate_skills')
    .delete()
    .eq('candidate_id', candidateId)
    .ilike('name', skillName)

  return { error: error ? new Error(error.message) : null }
}

export async function updateCandidateSkill(
  candidateId: string,
  skillName: string,
  updates: Partial<CandidateSkill>,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase
    .from('candidate_skills')
    .update(updates)
    .eq('candidate_id', candidateId)
    .ilike('name', skillName)

  return { error: error ? new Error(error.message) : null }
}

export async function addCandidateProject(
  candidateId: string,
  project: Project,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase.from('candidate_projects').insert({
    candidate_id: candidateId,
    title: project.title,
    description: project.description,
    skills: project.skills,
    link: project.link,
  })

  return { error: error ? new Error(error.message) : null }
}

export async function removeCandidateProject(
  candidateId: string,
  projectTitle: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase
    .from('candidate_projects')
    .delete()
    .eq('candidate_id', candidateId)
    .ilike('title', projectTitle)

  return { error: error ? new Error(error.message) : null }
}

export async function addCandidateExperience(
  candidateId: string,
  exp: ExperienceItem,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase.from('candidate_experience').insert({
    candidate_id: candidateId,
    title: exp.title,
    org: exp.org,
    duration: exp.duration,
    bullets: exp.bullets,
  })

  return { error: error ? new Error(error.message) : null }
}

export async function removeCandidateExperience(
  candidateId: string,
  org: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: new Error('Supabase is not configured.') }

  const { error } = await supabase
    .from('candidate_experience')
    .delete()
    .eq('candidate_id', candidateId)
    .ilike('org', org)

  return { error: error ? new Error(error.message) : null }
}
