import { computeMatch, computeMatchesForRequirement } from '../services/matchingEngine'
import { candidates as seedCandidates } from './candidates'
import { requirements as seedRequirements } from './requirements'
import type { Candidate, Match, Requirement } from './types'

export { computeMatch, computeMatchesForRequirement }

/**
 * Precomputes matches across all seed candidates and seed requirements dynamically.
 */
export const matches: Match[] = seedRequirements.flatMap((req) =>
  seedCandidates.map((cand) => computeMatch(cand, req)),
)

/**
 * Retrieves a dynamically computed Match for a candidate and requirement.
 * If optional candidate or requirement lists are provided (from context), it evaluates them dynamically.
 */
export function matchFor(
  requirementId: string,
  candidateId: string,
  customCandidates: Candidate[] = seedCandidates,
  customRequirements: Requirement[] = seedRequirements,
): Match | undefined {
  const req = customRequirements.find((r) => r.id === requirementId)
  const cand = customCandidates.find((c) => c.id === candidateId)
  if (!req || !cand) return undefined
  return computeMatch(cand, req)
}

/**
 * Computes and ranks all candidates for a given requirement dynamically.
 */
export function matchesForRequirement(
  requirementId: string,
  customCandidates: Candidate[] = seedCandidates,
  customRequirements: Requirement[] = seedRequirements,
): Match[] {
  const req = customRequirements.find((r) => r.id === requirementId)
  if (!req) return []
  return computeMatchesForRequirement(req, customCandidates)
}
