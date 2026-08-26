import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { candidates as seedCandidates } from '../data/candidates'
import { requirements as seedRequirements } from '../data/requirements'
import type { Candidate, CandidateSkill, ExperienceItem, Match, PipelineStage, Project, Requirement } from '../data/types'
import { computeMatch, computeMatchesForRequirement } from '../services/matchingEngine'

export interface PipelineEntry {
  candidateId: string
  requirementId: string
  stage: PipelineStage
}

interface RecruiterContextValue {
  requirements: Requirement[]
  candidates: Candidate[]
  activeCandidateId: string
  activeCandidate: Candidate | undefined
  setActiveCandidateId: (id: string) => void
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
  updateCandidate: (candidateId: string, updates: Partial<Candidate>) => void
  addCandidateSkill: (candidateId: string, skill: CandidateSkill) => void
  removeCandidateSkill: (candidateId: string, skillName: string) => void
  updateCandidateSkill: (candidateId: string, skillName: string, updates: Partial<CandidateSkill>) => void
  addCandidateProject: (candidateId: string, project: Project) => void
  removeCandidateProject: (candidateId: string, projectTitle: string) => void
  addCandidateExperience: (candidateId: string, exp: ExperienceItem) => void
  removeCandidateExperience: (candidateId: string, org: string) => void
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
  const [candidates, setCandidates] = useState<Candidate[]>(seedCandidates)
  const [activeCandidateId, setActiveCandidateId] = useState<string>('c-ananya')
  const [pipeline, setPipeline] = useState<PipelineEntry[]>([])

  const value = useMemo<RecruiterContextValue>(() => {
    const activeCandidate = candidates.find((c) => c.id === activeCandidateId) || candidates[0]

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

    const updateCandidate = (candidateId: string, updates: Partial<Candidate>) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const updated = { ...c, ...updates }
          // Recompute initials if name changes
          if (updates.name) {
            updated.initials = updates.name
              .split(/\s+/)
              .map((w) => w[0]?.toUpperCase() || '')
              .join('')
              .slice(0, 2)
          }
          return updated
        }),
      )
    }

    const addCandidateSkill = (candidateId: string, skill: CandidateSkill) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const existing = c.skills.filter((s) => s.name.toLowerCase() !== skill.name.toLowerCase())
          return { ...c, skills: [...existing, skill] }
        }),
      )
    }

    const removeCandidateSkill = (candidateId: string, skillName: string) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            skills: c.skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()),
          }
        }),
      )
    }

    const updateCandidateSkill = (
      candidateId: string,
      skillName: string,
      updates: Partial<CandidateSkill>,
    ) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            skills: c.skills.map((s) =>
              s.name.toLowerCase() === skillName.toLowerCase() ? { ...s, ...updates } : s,
            ),
          }
        }),
      )
    }

    const addCandidateProject = (candidateId: string, project: Project) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const filtered = c.projects.filter((p) => p.title.toLowerCase() !== project.title.toLowerCase())
          return { ...c, projects: [project, ...filtered] }
        }),
      )
    }

    const removeCandidateProject = (candidateId: string, projectTitle: string) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            projects: c.projects.filter((p) => p.title.toLowerCase() !== projectTitle.toLowerCase()),
          }
        }),
      )
    }

    const addCandidateExperience = (candidateId: string, exp: ExperienceItem) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return { ...c, experience: [exp, ...c.experience] }
        }),
      )
    }

    const removeCandidateExperience = (candidateId: string, org: string) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            experience: c.experience.filter((e) => e.org.toLowerCase() !== org.toLowerCase()),
          }
        }),
      )
    }

    return {
      requirements,
      candidates,
      activeCandidateId,
      activeCandidate,
      setActiveCandidateId,
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
      updateCandidate,
      addCandidateSkill,
      removeCandidateSkill,
      updateCandidateSkill,
      addCandidateProject,
      removeCandidateProject,
      addCandidateExperience,
      removeCandidateExperience,
    }
  }, [activeCandidateId, candidates, pipeline, requirements])

  return <RecruiterContext.Provider value={value}>{children}</RecruiterContext.Provider>
}

export function useRecruiter() {
  const ctx = useContext(RecruiterContext)
  if (!ctx) throw new Error('useRecruiter must be used within RecruiterProvider')
  return ctx
}
