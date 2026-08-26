import type { Application, ApplicationStatus, SavedJob } from '../data/types'
import { isSupabaseConfigured, supabase } from './supabaseClient'

export async function fetchCandidateApplications(
  candidateId: string,
): Promise<{ data: Application[] | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const mapped: Application[] = (data || []).map((row) => ({
    id: row.id,
    requirementId: row.requirement_id,
    candidateId: row.candidate_id,
    status: row.status as ApplicationStatus,
    matchScoreAtApplication: row.match_score_at_application || 0,
    appliedAt: row.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    notes: row.notes,
  }))

  return { data: mapped, error: null }
}

export async function applyToRequirement(
  candidateId: string,
  requirementId: string,
  matchScore: number,
): Promise<{ data: Application | null; error: Error | null }> {
  const newApp: Application = {
    id: `app-${crypto.randomUUID().slice(0, 8)}`,
    candidateId,
    requirementId,
    status: 'applied',
    matchScoreAtApplication: matchScore,
    appliedAt: new Date().toISOString().slice(0, 10),
  }

  if (!isSupabaseConfigured) {
    return { data: newApp, error: null }
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      id: newApp.id,
      candidate_id: candidateId,
      requirement_id: requirementId,
      status: 'applied',
      match_score_at_application: matchScore,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return {
    data: {
      id: data.id,
      candidateId: data.candidate_id,
      requirementId: data.requirement_id,
      status: data.status,
      matchScoreAtApplication: data.match_score_at_application,
      appliedAt: data.created_at.slice(0, 10),
    },
    error: null,
  }
}

export async function fetchSavedJobs(
  candidateId: string,
): Promise<{ data: SavedJob[] | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('saved_jobs')
    .select('*')
    .eq('candidate_id', candidateId)

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const mapped: SavedJob[] = (data || []).map((row) => ({
    candidateId: row.candidate_id,
    requirementId: row.requirement_id,
    savedAt: row.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  }))

  return { data: mapped, error: null }
}

export async function saveJob(
  candidateId: string,
  requirementId: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: null }

  const { error } = await supabase.from('saved_jobs').upsert(
    {
      candidate_id: candidateId,
      requirement_id: requirementId,
      created_at: new Date().toISOString(),
    },
    { onConflict: 'candidate_id,requirement_id' },
  )

  return { error: error ? new Error(error.message) : null }
}

export async function unsaveJob(
  candidateId: string,
  requirementId: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: null }

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('candidate_id', candidateId)
    .eq('requirement_id', requirementId)

  return { error: error ? new Error(error.message) : null }
}
