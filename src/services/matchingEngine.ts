import type {
  Candidate,
  Match,
  Requirement,
  ScoreBreakdown,
  SkillMatch,
  SkillMatchStatus,
} from '../data/types'

/**
 * Normalizes skill names for case-insensitive matching and handles common industry aliases.
 */
export function normalizeSkillName(name: string): string {
  const clean = name.toLowerCase().trim()
  const aliases: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    reactjs: 'react',
    'react.js': 'react',
    nodejs: 'node',
    'node.js': 'node',
    postgres: 'sql',
    postgresql: 'sql',
    mysql: 'sql',
    powerbi: 'power bi',
    'power-bi': 'power bi',
    comms: 'communication',
    'soft skills': 'communication',
    'problem solving': 'problem-solving',
    'process mapping': 'process mapping',
  }
  return aliases[clean] || clean
}

/**
 * 1. Required Skill Match (Max: 40 Points)
 * Evaluates candidate skill levels (expert: 100%, strong: 80%, working: 50%, mentioned in projects/experience: 35%).
 */
export function calculateRequiredSkillScore(
  candidate: Candidate,
  requirement: Requirement,
): {
  score: number
  skillMatches: SkillMatch[]
  matchedCount: number
  missingSkills: string[]
} {
  const totalWeight = requirement.skills.reduce((sum, s) => sum + s.weight, 0) || 100
  let totalEarnedScore = 0
  let matchedCount = 0
  const skillMatches: SkillMatch[] = []
  const missingSkills: string[] = []

  const projectSkills = new Set(
    candidate.projects.flatMap((p) => p.skills.map(normalizeSkillName)),
  )
  const experienceText = [
    candidate.experienceSummary,
    ...candidate.experience.flatMap((e) => [e.title, ...e.bullets]),
  ]
    .join(' ')
    .toLowerCase()

  for (const reqSkill of requirement.skills) {
    const normReq = normalizeSkillName(reqSkill.name)
    const candSkill = candidate.skills.find(
      (s) => normalizeSkillName(s.name) === normReq,
    )
    const assessment = candidate.assessments.find(
      (a) => normalizeSkillName(a.skill) === normReq,
    )

    let coverageRatio = 0
    let status: SkillMatchStatus = 'missing'
    let evidence = ''

    if (candSkill) {
      if (candSkill.level === 'expert') {
        coverageRatio = 1.0
        status = 'matched'
      } else if (candSkill.level === 'strong') {
        coverageRatio = 0.8
        status = 'matched'
      } else {
        coverageRatio = 0.5
        status = 'partial'
      }

      if (assessment && assessment.verified) {
        evidence = `Verified assessment ${assessment.score} · ${candSkill.level} level`
      } else if (candSkill.verified) {
        evidence = `Verified ${candSkill.level} level`
      } else {
        evidence = `Self-declared ${candSkill.level} level`
      }
    } else if (projectSkills.has(normReq)) {
      coverageRatio = 0.35
      status = 'partial'
      const matchedProject = candidate.projects.find((p) =>
        p.skills.map(normalizeSkillName).includes(normReq),
      )
      evidence = `Demonstrated in project: "${matchedProject?.title}"`
    } else if (experienceText.includes(normReq)) {
      coverageRatio = 0.25
      status = 'partial'
      evidence = `Referenced in prior work experience`
    } else {
      coverageRatio = 0
      status = 'missing'
      evidence = `No verified assessment or project evidence found`
      missingSkills.push(`${reqSkill.name} is missing or not evidenced`)
    }

    if (status === 'matched') {
      matchedCount++
    } else if (status === 'partial') {
      missingSkills.push(`${reqSkill.name} is at working/partial level only`)
    }

    // Weight proportion of the 40-point factor
    const skillMaxPoints = (reqSkill.weight / totalWeight) * 40
    totalEarnedScore += skillMaxPoints * coverageRatio

    skillMatches.push({
      skill: reqSkill.name,
      weight: reqSkill.weight,
      status,
      evidence,
    })
  }

  return {
    score: Math.min(40, Math.max(0, totalEarnedScore)),
    skillMatches,
    matchedCount,
    missingSkills,
  }
}

/**
 * 2. Skill Verification / Assessment (Max: 20 Points)
 * Evaluates whether required skills have verified on-platform assessments or verified badges.
 */
export function calculateVerificationScore(
  candidate: Candidate,
  requirement: Requirement,
): { score: number; verifiedAssessments: { skill: string; score: number }[] } {
  const totalWeight = requirement.skills.reduce((sum, s) => sum + s.weight, 0) || 100
  let verificationPoints = 0
  const verifiedAssessments: { skill: string; score: number }[] = []

  for (const reqSkill of requirement.skills) {
    const normReq = normalizeSkillName(reqSkill.name)
    const assessment = candidate.assessments.find(
      (a) => normalizeSkillName(a.skill) === normReq,
    )
    const candSkill = candidate.skills.find(
      (s) => normalizeSkillName(s.name) === normReq,
    )

    const skillMaxPoints = (reqSkill.weight / totalWeight) * 20
    let skillVerifRatio = 0

    if (assessment) {
      if (assessment.verified) {
        skillVerifRatio = Math.max(0.6, assessment.score / 100)
        verifiedAssessments.push({ skill: assessment.skill, score: assessment.score })
      } else {
        // Practice attempt
        skillVerifRatio = Math.max(0.2, (assessment.score / 100) * 0.5)
      }
    } else if (candSkill && candSkill.verified) {
      skillVerifRatio = 0.85
    }

    verificationPoints += skillMaxPoints * skillVerifRatio
  }

  // Talent passport baseline verification credit
  if (candidate.verified && verificationPoints < 4) {
    verificationPoints = 4
  }

  return {
    score: Math.min(20, Math.max(0, verificationPoints)),
    verifiedAssessments,
  }
}

/**
 * 3. Relevant Experience (Max: 15 Points)
 * Evaluates candidate tenure, role alignment, and experience description against requirement.
 */
export function calculateExperienceScore(
  candidate: Candidate,
  requirement: Requirement,
): { score: number; experienceHighlights: string[] } {
  const expHighlights: string[] = []

  // Parse required experience range e.g. "0–2 years", "1–3 years", "0–1 year"
  const reqMatch = requirement.experience.match(/(\d+)(?:[–-](\d+))?/)
  const reqMin = reqMatch ? parseInt(reqMatch[1], 10) : 0

  // Estimate candidate experience years
  let candYears = 0
  const summaryLower = candidate.experienceSummary.toLowerCase()
  if (summaryLower.includes('2 year') || summaryLower.includes('2+ year')) candYears = 2.0
  else if (summaryLower.includes('14 month') || summaryLower.includes('1 year')) candYears = 1.2
  else if (summaryLower.includes('6 month') || summaryLower.includes('intern')) candYears = 0.5
  else if (summaryLower.includes('3 month')) candYears = 0.25
  else candYears = candidate.experience.length * 0.8

  // Role keyword alignment
  const reqRoleTokens = requirement.role.toLowerCase().split(/\s+/)
  const candRoleText = (
    candidate.role +
    ' ' +
    candidate.experience.map((e) => e.title).join(' ')
  ).toLowerCase()

  let roleOverlap = 0
  for (const token of reqRoleTokens) {
    if (token.length > 2 && candRoleText.includes(token)) {
      roleOverlap++
    }
  }
  const roleFactor = reqRoleTokens.length > 0 ? Math.min(1.0, 0.6 + (roleOverlap / reqRoleTokens.length) * 0.4) : 0.8

  let tenureFactor = 0.8
  if (candYears >= reqMin) {
    tenureFactor = 1.0
  } else if (reqMin === 0) {
    tenureFactor = 0.95
  } else {
    tenureFactor = Math.max(0.5, candYears / reqMin)
  }

  const score = Math.min(15, Math.max(0, 15 * roleFactor * tenureFactor))

  if (candidate.experience.length > 0) {
    expHighlights.push(candidate.experienceSummary || `${candidate.experience[0].title} at ${candidate.experience[0].org}`)
  }

  return { score, experienceHighlights: expHighlights }
}

/**
 * 4. Projects / Practical Evidence (Max: 10 Points)
 * Evaluates candidate practical projects and their skill overlap with requirement.
 */
export function calculateProjectsScore(
  candidate: Candidate,
  requirement: Requirement,
): { score: number; relevantProjectCount: number } {
  if (!candidate.projects || candidate.projects.length === 0) {
    return { score: 0, relevantProjectCount: 0 }
  }

  const reqSkills = new Set(requirement.skills.map((s) => normalizeSkillName(s.name)))
  let relevantProjects = 0

  for (const proj of candidate.projects) {
    const hasOverlap = proj.skills.some((s) => reqSkills.has(normalizeSkillName(s)))
    if (hasOverlap) {
      relevantProjects++
    }
  }

  let score = 0
  if (relevantProjects >= 2) {
    score = 10
  } else if (relevantProjects === 1) {
    score = 8
  } else if (candidate.projects.length >= 1) {
    score = 5 // Has practical projects, but different tech stack
  }

  return { score, relevantProjectCount: relevantProjects }
}

/**
 * 5. Education Relevance (Max: 5 Points)
 * Evaluates educational degree and coursework alignment to role.
 */
export function calculateEducationScore(
  candidate: Candidate,
  requirement: Requirement,
): { score: number; educationFit: string } {
  const degree = candidate.education.degree.toLowerCase()
  const role = requirement.role.toLowerCase()

  let score = 3.0
  let educationFit = candidate.education.relevance || `${candidate.education.degree} from ${candidate.education.school}`

  if (role.includes('data') || role.includes('analyst') || role.includes('insight')) {
    if (degree.includes('stat') || degree.includes('math') || degree.includes('data')) {
      score = 5.0
      educationFit = `${candidate.education.degree} maps directly to analytical modeling and statistical inference.`
    } else if (degree.includes('computer') || degree.includes('tech') || degree.includes('it') || degree.includes('engineer')) {
      score = 4.5
      educationFit = `${candidate.education.degree} provides strong technical and quantitative foundation.`
    } else if (degree.includes('com') || degree.includes('bba') || degree.includes('finance') || degree.includes('econ')) {
      score = 3.8
      educationFit = `${candidate.education.degree} provides strong business context, with operational MIS electives.`
    }
  } else if (role.includes('engineer') || role.includes('frontend') || role.includes('developer')) {
    if (degree.includes('computer') || degree.includes('tech') || degree.includes('software') || degree.includes('engineer')) {
      score = 5.0
      educationFit = `${candidate.education.degree} directly aligns with software engineering requirements.`
    } else if (degree.includes('science') || degree.includes('stat') || degree.includes('math')) {
      score = 4.0
      educationFit = `${candidate.education.degree} offers strong algorithmic foundation.`
    }
  } else if (role.includes('operat') || role.includes('business')) {
    if (degree.includes('bba') || degree.includes('com') || degree.includes('econ') || degree.includes('manage')) {
      score = 5.0
      educationFit = `${candidate.education.degree} directly prepares candidate for business operations.`
    }
  }

  return { score: Math.min(5, Math.max(0, score)), educationFit }
}

/**
 * 6. Location & Work Mode Fit (Max: 5 Points)
 * Evaluates candidate location and work mode alignment to company requirement.
 */
export function calculateLocationScore(
  candidate: Candidate,
  requirement: Requirement,
): { score: number; locationFit: string } {
  const reqLoc = requirement.location.toLowerCase()
  const candLoc = candidate.location.toLowerCase()
  const reqMode = requirement.workMode.toLowerCase()
  const candMode = candidate.workMode.toLowerCase()
  const pref = candidate.preferences.join(' ').toLowerCase()

  let score = 3.0
  let locationFit = ''

  if (reqMode.includes('remote') || candLoc.includes(reqLoc) || reqLoc.includes(candLoc)) {
    score = 5.0
    locationFit = `Based in ${candidate.location} (${candidate.workMode}) — exact fit for ${requirement.location} ${requirement.workMode}.`
  } else if (candMode.includes('relocate') || pref.includes('relocate') || pref.includes(reqLoc)) {
    score = 4.0
    locationFit = `Currently in ${candidate.location}; actively open to relocating to ${requirement.location}.`
  } else {
    score = 2.5
    locationFit = `Located in ${candidate.location}; requirement is ${requirement.location} (${requirement.workMode}).`
  }

  return { score: Math.min(5, Math.max(0, score)), locationFit }
}

/**
 * 7. Availability Fit (Max: 5 Points)
 * Evaluates notice period against requirement joining urgency.
 */
export function calculateAvailabilityScore(
  candidate: Candidate,
  requirement: Requirement,
): { score: number; availabilityFit: string } {
  const avail = candidate.availability.toLowerCase()
  const joining = requirement.joining.toLowerCase()

  let score = 4.0
  let availabilityFit = candidate.availability

  if (avail.includes('immediate') || avail.includes('15')) {
    score = 5.0
    availabilityFit = `Can join immediately or within 15 days (${requirement.joining}).`
  } else if (avail.includes('30')) {
    if (joining.includes('immediate')) {
      score = 4.0
      availabilityFit = `30-day notice period (requirement prefers immediate joiners).`
    } else {
      score = 5.0
      availabilityFit = `30-day notice matches requirement timeline (${requirement.joining}).`
    }
  } else if (avail.includes('45')) {
    if (joining.includes('immediate') || joining.includes('30')) {
      score = 3.0
      availabilityFit = `45-day notice is longer than preferred (${requirement.joining}).`
    } else {
      score = 4.5
      availabilityFit = `45-day notice fits requirement joining window.`
    }
  } else if (avail.includes('campus')) {
    if (joining.includes('campus')) {
      score = 5.0
      availabilityFit = `Campus joining window aligns with company campus batch.`
    } else {
      score = 3.2
      availabilityFit = `Campus cohort availability — later than standard 30-day window.`
    }
  }

  return { score: Math.min(5, Math.max(0, score)), availabilityFit }
}

/**
 * Main Dynamic Matching Engine Entrypoint:
 * Computes a deterministic, explainable Match object using the PRD's 7-factor model.
 */
export function computeMatch(
  candidate: Candidate,
  requirement: Requirement,
): Match {
  // Factor 1: Required Skills (40 pts)
  const skillsRes = calculateRequiredSkillScore(candidate, requirement)

  // Factor 2: Verification (20 pts)
  const verifRes = calculateVerificationScore(candidate, requirement)

  // Factor 3: Relevant Experience (15 pts)
  const expRes = calculateExperienceScore(candidate, requirement)

  // Factor 4: Projects (10 pts)
  const projRes = calculateProjectsScore(candidate, requirement)

  // Factor 5: Education (5 pts)
  const eduRes = calculateEducationScore(candidate, requirement)

  // Factor 6: Location (5 pts)
  const locRes = calculateLocationScore(candidate, requirement)

  // Factor 7: Availability (5 pts)
  const availRes = calculateAvailabilityScore(candidate, requirement)

  // Composite raw score (0 - 100)
  const totalScoreRaw =
    skillsRes.score +
    verifRes.score +
    expRes.score +
    projRes.score +
    eduRes.score +
    locRes.score +
    availRes.score

  const finalScore = Math.min(100, Math.max(0, Math.round(totalScoreRaw)))

  // Synthesize explainable 'Why' bullet points
  const why: string[] = []
  why.push(
    `${skillsRes.matchedCount}/${requirement.skills.length} critical skills matched`,
  )

  if (verifRes.verifiedAssessments.length > 0) {
    const topAssmt = verifRes.verifiedAssessments[0]
    why.push(`${topAssmt.skill} assessment verified (${topAssmt.score})`)
  }

  if (projRes.relevantProjectCount > 0) {
    why.push(
      `${projRes.relevantProjectCount} relevant project${
        projRes.relevantProjectCount === 1 ? '' : 's'
      }`,
    )
  }

  if (candidate.experience.length > 0) {
    why.push(candidate.experienceSummary || `${candidate.experience[0].title} experience`)
  }

  if (locRes.score >= 4 && availRes.score >= 4) {
    why.push(`Strong location and availability fit`)
  }

  // Grouped score breakdowns preserving the 4 UI categories
  const breakdown: ScoreBreakdown[] = [
    {
      label: 'Weighted skill coverage',
      points: Math.round(skillsRes.score),
      max: 40,
      detail: `${skillsRes.matchedCount} of ${requirement.skills.length} required skills evidenced with proficiency`,
      positive: skillsRes.score >= 28,
    },
    {
      label: 'Verification & assessments',
      points: Math.round(verifRes.score),
      max: 20,
      detail:
        verifRes.verifiedAssessments.length > 0
          ? `${verifRes.verifiedAssessments.map((a) => a.skill).join(', ')} verified on-platform`
          : candidate.verified
            ? 'Talent passport verified'
            : 'No verified skill badges yet',
      positive: verifRes.score >= 12,
    },
    {
      label: 'Projects & experience',
      points: Math.round(expRes.score + projRes.score),
      max: 25,
      detail: `${projRes.relevantProjectCount} practical project(s) + ${candidate.experienceSummary || 'experience evidence'}`,
      positive: expRes.score + projRes.score >= 16,
    },
    {
      label: 'Location & availability',
      points: Math.round(eduRes.score + locRes.score + availRes.score),
      max: 15,
      detail: `${locRes.locationFit} ${availRes.availabilityFit}`,
      positive: eduRes.score + locRes.score + availRes.score >= 10,
    },
  ]

  return {
    candidateId: candidate.id,
    requirementId: requirement.id,
    score: finalScore,
    why,
    missing: skillsRes.missingSkills,
    skillMatches: skillsRes.skillMatches,
    breakdown,
    educationFit: eduRes.educationFit,
    locationFit: locRes.locationFit,
    availabilityFit: availRes.availabilityFit,
  }
}

/**
 * Computes and sorts matches for all candidates against a specific requirement.
 */
export function computeMatchesForRequirement(
  requirement: Requirement,
  candidates: Candidate[],
): Match[] {
  return candidates
    .map((candidate) => computeMatch(candidate, requirement))
    .sort((a, b) => b.score - a.score)
}
