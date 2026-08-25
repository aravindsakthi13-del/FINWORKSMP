import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { candidates as seedCandidates } from '../data/candidates'
import { requirements as seedRequirements } from '../data/requirements'
import type { Candidate, PipelineStage, Requirement } from '../data/types'

export interface PipelineEntry {
  candidateId: string
  requirementId: string
  stage: PipelineStage
}

interface RecruiterContextValue {
  requirements: Requirement[]
  candidates: Candidate[]
  pipeline: PipelineEntry[]
  addRequirement: (requirement: Omit<Requirement, 'id' | 'createdAt' | 'potentialMatches' | 'verifiedMatches' | 'status'>) => Requirement
  shortlist: (candidateId: string, requirementId: string) => void
  setStage: (candidateId: string, requirementId: string, stage: PipelineStage) => void
  removeFromPipeline: (candidateId: string, requirementId: string) => void
  getStage: (candidateId: string, requirementId: string) => PipelineStage | undefined
}

const RecruiterContext = createContext<RecruiterContextValue | null>(null)

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function RecruiterProvider({ children }: { children: ReactNode }) {
  const [requirements, setRequirements] = useState<Requirement[]>(seedRequirements)
  const [pipeline, setPipeline] = useState<PipelineEntry[]>([])

  const value = useMemo<RecruiterContextValue>(() => {
    const getStage = (candidateId: string, requirementId: string) =>
      pipeline.find((p) => p.candidateId === candidateId && p.requirementId === requirementId)?.stage

    return {
      requirements,
      candidates: seedCandidates,
      pipeline,
      addRequirement: (input) => {
        const created: Requirement = {
          ...input,
          id: `req-${crypto.randomUUID().slice(0, 8)}`,
          status: 'active',
          createdAt: todayIso(),
          potentialMatches: 0,
          verifiedMatches: 0,
        }
        setRequirements((prev) => [created, ...prev])
        return created
      },
      shortlist: (candidateId, requirementId) => {
        setPipeline((prev) => {
          const exists = prev.some((p) => p.candidateId === candidateId && p.requirementId === requirementId)
          if (exists) return prev
          return [...prev, { candidateId, requirementId, stage: 'shortlisted' }]
        })
      },
      setStage: (candidateId, requirementId, stage) => {
        setPipeline((prev) =>
          prev.map((p) =>
            p.candidateId === candidateId && p.requirementId === requirementId ? { ...p, stage } : p,
          ),
        )
      },
      removeFromPipeline: (candidateId, requirementId) => {
        setPipeline((prev) =>
          prev.filter((p) => !(p.candidateId === candidateId && p.requirementId === requirementId)),
        )
      },
      getStage,
    }
  }, [pipeline, requirements])

  return <RecruiterContext.Provider value={value}>{children}</RecruiterContext.Provider>
}

export function useRecruiter() {
  const ctx = useContext(RecruiterContext)
  if (!ctx) throw new Error('useRecruiter must be used within RecruiterProvider')
  return ctx
}
