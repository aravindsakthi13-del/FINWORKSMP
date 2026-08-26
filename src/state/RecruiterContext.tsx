import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { candidates as seedCandidates } from '../data/candidates'
import { requirements as seedRequirements } from '../data/requirements'
import type {
  Candidate,
  CandidateSkill,
  ExperienceItem,
  Match,
  PipelineStage,
  Project,
  Requirement,
} from '../data/types'
import {
  addCandidateExperience as apiAddExperience,
  addCandidateProject as apiAddProject,
  addCandidateSkill as apiAddSkill,
  fetchCandidates as apiFetchCandidates,
  removeCandidateExperience as apiRemoveExperience,
  removeCandidateProject as apiRemoveProject,
  removeCandidateSkill as apiRemoveSkill,
  updateCandidateProfile as apiUpdateCandidate,
  updateCandidateSkill as apiUpdateSkill,
} from '../services/candidateService'
import { computeMatch, computeMatchesForRequirement } from '../services/matchingEngine'
import {
  fetchPipeline as apiFetchPipeline,
  removeFromPipeline as apiRemovePipeline,
  setPipelineStage as apiSetStage,
  type PipelineEntry,
} from '../services/pipelineService'
import {
  createRequirement as apiCreateRequirement,
  fetchRequirements as apiFetchRequirements,
} from '../services/requirementService'
import { isSupabaseConfigured } from '../services/supabaseClient'

export type { PipelineEntry }

interface RecruiterContextValue {
  requirements: Requirement[]
  candidates: Candidate[]
  activeCandidateId: string
  activeCandidate: Candidate | undefined
  setActiveCandidateId: (id: string) => void
  pipeline: PipelineEntry[]
  loading: boolean
  error: string | null
  refetchData: () => Promise<void>
  addRequirement: (
    requirement: Omit<
      Requirement,
      'id' | 'createdAt' | 'potentialMatches' | 'verifiedMatches' | 'status'
    >,
  ) => Promise<Requirement>
  shortlist: (candidateId: string, requirementId: string) => Promise<void>
  setStage: (candidateId: string, requirementId: string, stage: PipelineStage) => Promise<void>
  removeFromPipeline: (candidateId: string, requirementId: string) => Promise<void>
  getStage: (candidateId: string, requirementId: string) => PipelineStage | undefined
  getMatchesForRequirement: (requirementId: string) => Match[]
  getMatch: (requirementId: string, candidateId: string) => Match | undefined
  updateCandidate: (candidateId: string, updates: Partial<Candidate>) => Promise<void>
  addCandidateSkill: (candidateId: string, skill: CandidateSkill) => Promise<void>
  removeCandidateSkill: (candidateId: string, skillName: string) => Promise<void>
  updateCandidateSkill: (candidateId: string, skillName: string, updates: Partial<CandidateSkill>) => Promise<void>
  addCandidateProject: (candidateId: string, project: Project) => Promise<void>
  removeCandidateProject: (candidateId: string, projectTitle: string) => Promise<void>
  addCandidateExperience: (candidateId: string, exp: ExperienceItem) => Promise<void>
  removeCandidateExperience: (candidateId: string, org: string) => Promise<void>
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

export function RecruiterProvider({ children }: { children: ReactNode }) {
  const [requirements, setRequirements] = useState<Requirement[]>(seedRequirements)
  const [candidates, setCandidates] = useState<Candidate[]>(seedCandidates)
  const [activeCandidateId, setActiveCandidateId] = useState<string>('c-ananya')
  const [pipeline, setPipeline] = useState<PipelineEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [candRes, reqRes, pipeRes] = await Promise.all([
        apiFetchCandidates(),
        apiFetchRequirements(),
        apiFetchPipeline(),
      ])

      if (candRes.data && candRes.data.length > 0) {
        setCandidates(candRes.data)
      }
      if (reqRes.data && reqRes.data.length > 0) {
        setRequirements(reqRes.data)
      }
      if (pipeRes.data) {
        setPipeline(pipeRes.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch backend data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

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

    const addRequirement = async (
      input: Omit<
        Requirement,
        'id' | 'createdAt' | 'potentialMatches' | 'verifiedMatches' | 'status'
      >,
    ) => {
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

      if (isSupabaseConfigured) {
        await apiCreateRequirement(created)
      }

      return created
    }

    const shortlist = async (candidateId: string, requirementId: string) => {
      setPipeline((prev) => {
        const exists = prev.some(
          (p) => p.candidateId === candidateId && p.requirementId === requirementId,
        )
        if (exists) return prev
        return [...prev, { candidateId, requirementId, stage: 'shortlisted' }]
      })

      if (isSupabaseConfigured) {
        await apiSetStage(candidateId, requirementId, 'shortlisted')
      }
    }

    const setStage = async (
      candidateId: string,
      requirementId: string,
      stage: PipelineStage,
    ) => {
      setPipeline((prev) =>
        prev.map((p) =>
          p.candidateId === candidateId && p.requirementId === requirementId
            ? { ...p, stage }
            : p,
        ),
      )

      if (isSupabaseConfigured) {
        await apiSetStage(candidateId, requirementId, stage)
      }
    }

    const removeFromPipeline = async (candidateId: string, requirementId: string) => {
      setPipeline((prev) =>
        prev.filter(
          (p) => !(p.candidateId === candidateId && p.requirementId === requirementId),
        ),
      )

      if (isSupabaseConfigured) {
        await apiRemovePipeline(candidateId, requirementId)
      }
    }

    const updateCandidate = async (candidateId: string, updates: Partial<Candidate>) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const updated = { ...c, ...updates }
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

      if (isSupabaseConfigured) {
        await apiUpdateCandidate(candidateId, updates)
      }
    }

    const addCandidateSkill = async (candidateId: string, skill: CandidateSkill) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const existing = c.skills.filter(
            (s) => s.name.toLowerCase() !== skill.name.toLowerCase(),
          )
          return { ...c, skills: [...existing, skill] }
        }),
      )

      if (isSupabaseConfigured) {
        await apiAddSkill(candidateId, skill)
      }
    }

    const removeCandidateSkill = async (candidateId: string, skillName: string) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            skills: c.skills.filter(
              (s) => s.name.toLowerCase() !== skillName.toLowerCase(),
            ),
          }
        }),
      )

      if (isSupabaseConfigured) {
        await apiRemoveSkill(candidateId, skillName)
      }
    }

    const updateCandidateSkill = async (
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
              s.name.toLowerCase() === skillName.toLowerCase()
                ? { ...s, ...updates }
                : s,
            ),
          }
        }),
      )

      if (isSupabaseConfigured) {
        await apiUpdateSkill(candidateId, skillName, updates)
      }
    }

    const addCandidateProject = async (candidateId: string, project: Project) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          const filtered = c.projects.filter(
            (p) => p.title.toLowerCase() !== project.title.toLowerCase(),
          )
          return { ...c, projects: [project, ...filtered] }
        }),
      )

      if (isSupabaseConfigured) {
        await apiAddProject(candidateId, project)
      }
    }

    const removeCandidateProject = async (
      candidateId: string,
      projectTitle: string,
    ) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            projects: c.projects.filter(
              (p) => p.title.toLowerCase() !== projectTitle.toLowerCase(),
            ),
          }
        }),
      )

      if (isSupabaseConfigured) {
        await apiRemoveProject(candidateId, projectTitle)
      }
    }

    const addCandidateExperience = async (
      candidateId: string,
      exp: ExperienceItem,
    ) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return { ...c, experience: [exp, ...c.experience] }
        }),
      )

      if (isSupabaseConfigured) {
        await apiAddExperience(candidateId, exp)
      }
    }

    const removeCandidateExperience = async (candidateId: string, org: string) => {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c
          return {
            ...c,
            experience: c.experience.filter(
              (e) => e.org.toLowerCase() !== org.toLowerCase(),
            ),
          }
        }),
      )

      if (isSupabaseConfigured) {
        await apiRemoveExperience(candidateId, org)
      }
    }

    return {
      requirements,
      candidates,
      activeCandidateId,
      activeCandidate,
      setActiveCandidateId,
      pipeline,
      loading,
      error,
      refetchData: loadData,
      addRequirement,
      shortlist,
      setStage,
      removeFromPipeline,
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
  }, [activeCandidateId, candidates, error, loadData, loading, pipeline, requirements])

  return (
    <RecruiterContext.Provider value={value}>{children}</RecruiterContext.Provider>
  )
}

export function useRecruiter() {
  const ctx = useContext(RecruiterContext)
  if (!ctx) throw new Error('useRecruiter must be used within RecruiterProvider')
  return ctx
}
