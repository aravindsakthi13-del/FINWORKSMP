import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { candidates as seedCandidates } from '../data/candidates'
import { requirements as seedRequirements } from '../data/requirements'
import type { Candidate, Match, PipelineStage, Requirement } from '../data/types'
import { computeMatch, computeMatchesForRequirement } from '../services/matchingEngine'

export interface PipelineEntry {
  candidateId: string
  requirementId: string
  stage: PipelineStage
}

interface RecruiterContextValue {
  requirements: Requirement[]
  candidates: Candidate[]
  pipeline: PipelineEntry[]
  addRequirement: (
    requirement: Omit<
      Requirement,
      'id' | 'createdAt' | 'potentialMatches' | 'verifiedMatches' | 'status'
    >,
  ) => Requirement
  shortlist: (candidateId: string, requirementId: string) => void
  setStage: (candidateId: string, requirementId: string, stage: PipelineStage) => void
  removeFromPipeline: (candidateId: string, requirementId: string) => void
  getStage: (candidateId: string, requirementId: string) => PipelineStage | undefined
  getMatchesForRequirement: (requirementId: string) => Match[]
  getMatch: (requirementId: string, candidateId: string) => Match | undefined
}

const RecruiterContext = createContext<RecruiterContextValue | null>(null)

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function calculateRequirementMatchCounts(
  req: Requirement,
  candList: Candidate[],
): { potentialMatches: number; verifiedMatches: number } {
  const matches = computeMatchesForRequirement(req, candList)
  const potentialMatches = matches.filter((m) => m.score >= 50).length
  const verifiedMatches = matches.filter((m) => {
    const c = candList.find((cand) => cand.id === m.candidateId)
    return c?.verified && m.score >= 50
  }).length
  return { potentialMatches, verifiedMatches }
}

const initialRequirements: Requirement[] = seedRequirements.map((req) => {
  const counts = calculateRequirementMatchCounts(req, seedCandidates)
  return {
    ...req,
    potentialMatches: counts.potentialMatches || req.potentialMatches,
    verifiedMatches: counts.verifiedMatches || req.verifiedMatches,
  }
})

export function RecruiterProvider({ children }: { children: ReactNode }) {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements)
  const [candidates] = useState<Candidate[]>(seedCandidates)
  const [pipeline, setPipeline] = useState<PipelineEntry[]>([])

  const value = useMemo<RecruiterContextValue>(() => {
    const getStage = (candidateId: string, requirementId: string) =>
      pipeline.find(
        (p) => p.candidateId === candidateId && p.requirementId === requirementId,
      )?.stage

    const getMatchesForRequirement = (requirementId: string): Match[] => {
      const req = requirements.find((r) => r.id === requirementId)
      if (!req) return []
      return computeMatchesForRequirement(req, candidates)
    }

    const getMatch = (requirementId: string, candidateId: string): Match | undefined => {
      const req = requirements.find((r) => r.id === requirementId)
      const cand = candidates.find((c) => c.id === candidateId)
      if (!req || !cand) return undefined
      return computeMatch(cand, req)
    }

    return {
      requirements,
      candidates,
      pipeline,
      addRequirement: (input) => {
        const temp: Requirement = {
          ...input,
          id: `req-${crypto.randomUUID().slice(0, 8)}`,
          status: 'active',
          createdAt: todayIso(),
          potentialMatches: 0,
          verifiedMatches: 0,
        }
        const counts = calculateRequirementMatchCounts(temp, candidates)
        const created: Requirement = {
          ...temp,
          potentialMatches: counts.potentialMatches,
          verifiedMatches: counts.verifiedMatches,
        }
        setRequirements((prev) => [created, ...prev])
        return created
      },
      shortlist: (candidateId, requirementId) => {
        setPipeline((prev) => {
          const exists = prev.some(
            (p) => p.candidateId === candidateId && p.requirementId === requirementId,
          )
          if (exists) return prev
          return [...prev, { candidateId, requirementId, stage: 'shortlisted' }]
        })
      },
      setStage: (candidateId, requirementId, stage) => {
        setPipeline((prev) =>
          prev.map((p) =>
            p.candidateId === candidateId && p.requirementId === requirementId
              ? { ...p, stage }
              : p,
          ),
        )
      },
      removeFromPipeline: (candidateId, requirementId) => {
        setPipeline((prev) =>
          prev.filter(
            (p) => !(p.candidateId === candidateId && p.requirementId === requirementId),
          ),
        )
      },
      getStage,
      getMatchesForRequirement,
      getMatch,
    }
  }, [candidates, pipeline, requirements])

  return <RecruiterContext.Provider value={value}>{children}</RecruiterContext.Provider>
}

export function useRecruiter() {
  const ctx = useContext(RecruiterContext)
  if (!ctx) throw new Error('useRecruiter must be used within RecruiterProvider')
  return ctx
}
