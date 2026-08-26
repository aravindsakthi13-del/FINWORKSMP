import type { Requirement } from '../data/types'
import { isSupabaseConfigured, supabase } from './supabaseClient'

interface DbRequirementRow {
  id: string
  company_id?: string
  recruiter_id?: string
  role: string
  department: string
  headcount: number
  location: string
  work_mode: string
  experience: string
  salary: string
  joining: string
  status: Requirement['status']
  skills: Requirement['skills']
  potential_matches?: number
  verified_matches?: number
  created_at: string
}

function mapDbRowToRequirement(row: DbRequirementRow): Requirement {
  return {
    id: row.id,
    role: row.role,
    department: row.department,
    headcount: row.headcount,
    location: row.location,
    workMode: row.work_mode,
    experience: row.experience,
    salary: row.salary,
    joining: row.joining,
    status: row.status,
    skills: row.skills || [],
    createdAt: row.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    potentialMatches: row.potential_matches || 0,
    verifiedMatches: row.verified_matches || 0,
  }
}

export async function fetchRequirements(): Promise<{
  data: Requirement[] | null
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
    .from('hiring_requirements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const requirements: Requirement[] = (data as DbRequirementRow[]).map(mapDbRowToRequirement)
  return { data: requirements, error: null }
}

export async function createRequirement(
  req: Requirement,
): Promise<{ data: Requirement | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured.') }
  }

  const dbRow = {
    id: req.id,
    role: req.role,
    department: req.department,
    headcount: req.headcount,
    location: req.location,
    work_mode: req.workMode,
    experience: req.experience,
    salary: req.salary,
    joining: req.joining,
    status: req.status,
    skills: req.skills,
    potential_matches: req.potentialMatches,
    verified_matches: req.verifiedMatches,
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('hiring_requirements')
    .insert(dbRow)
    .select()
    .single()

  if (error || !data) {
    return { data: null, error: error ? new Error(error.message) : new Error('Creation failed') }
  }

  return { data: mapDbRowToRequirement(data as DbRequirementRow), error: null }
}

export async function updateRequirement(
  id: string,
  updates: Partial<Requirement>,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase is not configured.') }
  }

  const dbUpdates: Record<string, unknown> = {}
  if (updates.role !== undefined) dbUpdates.role = updates.role
  if (updates.department !== undefined) dbUpdates.department = updates.department
  if (updates.headcount !== undefined) dbUpdates.headcount = updates.headcount
  if (updates.location !== undefined) dbUpdates.location = updates.location
  if (updates.workMode !== undefined) dbUpdates.work_mode = updates.workMode
  if (updates.experience !== undefined) dbUpdates.experience = updates.experience
  if (updates.salary !== undefined) dbUpdates.salary = updates.salary
  if (updates.joining !== undefined) dbUpdates.joining = updates.joining
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.skills !== undefined) dbUpdates.skills = updates.skills
  if (updates.potentialMatches !== undefined) dbUpdates.potential_matches = updates.potentialMatches
  if (updates.verifiedMatches !== undefined) dbUpdates.verified_matches = updates.verifiedMatches

  const { error } = await supabase.from('hiring_requirements').update(dbUpdates).eq('id', id)
  return { error: error ? new Error(error.message) : null }
}
