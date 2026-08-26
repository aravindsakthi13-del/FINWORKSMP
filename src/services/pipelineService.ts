import type { PipelineStage } from '../data/types'
import { isSupabaseConfigured, supabase } from './supabaseClient'

export interface PipelineEntry {
  candidateId: string
  requirementId: string
  stage: PipelineStage
}

interface DbPipelineRow {
  candidate_id: string
  requirement_id: string
  stage: PipelineStage
}

export async function fetchPipeline(): Promise<{
  data: PipelineEntry[] | null
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
    .from('pipeline_entries')
    .select('candidate_id, requirement_id, stage')

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const entries: PipelineEntry[] = (data as DbPipelineRow[]).map((r) => ({
    candidateId: r.candidate_id,
    requirementId: r.requirement_id,
    stage: r.stage,
  }))

  return { data: entries, error: null }
}

export async function setPipelineStage(
  candidateId: string,
  requirementId: string,
  stage: PipelineStage,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase is not configured.') }
  }

  const { error } = await supabase.from('pipeline_entries').upsert(
    {
      candidate_id: candidateId,
      requirement_id: requirementId,
      stage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'requirement_id,candidate_id' },
  )

  return { error: error ? new Error(error.message) : null }
}

export async function removeFromPipeline(
  candidateId: string,
  requirementId: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase is not configured.') }
  }

  const { error } = await supabase
    .from('pipeline_entries')
    .delete()
    .eq('candidate_id', candidateId)
    .eq('requirement_id', requirementId)

  return { error: error ? new Error(error.message) : null }
}
