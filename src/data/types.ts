export type PipelineStage = 'shortlisted' | 'interview' | 'offer' | 'hired'

export type RequirementStatus = 'active' | 'draft' | 'filled'

export type SkillLevel = 'expert' | 'strong' | 'working'

export type SkillMatchStatus = 'matched' | 'partial' | 'missing'

export type ApplicationStatus =
  | 'applied'
  | 'reviewing'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn'

export type NotificationType =
  | 'match_alert'
  | 'application_update'
  | 'shortlist_alert'
  | 'system'

export interface SkillWeight {
  name: string
  weight: number
}

export interface Requirement {
  id: string
  role: string
  department: string
  headcount: number
  location: string
  workMode: string
  experience: string
  salary: string
  joining: string
  status: RequirementStatus
  skills: SkillWeight[]
  createdAt: string
  potentialMatches: number
  verifiedMatches: number
  companyName?: string
  companyVerified?: boolean
}

export interface Project {
  title: string
  description: string
  skills: string[]
  link?: string
}

export interface ExperienceItem {
  title: string
  org: string
  duration: string
  bullets: string[]
}

export interface Assessment {
  skill: string
  score: number
  verified: boolean
  date: string
}

export interface CandidateSkill {
  name: string
  level: SkillLevel
  verified: boolean
}

export interface CandidateEducation {
  degree: string
  school: string
  fieldOfStudy?: string
  year: string
  relevance: string
}

export interface CandidateCareerPreferences {
  targetRoles: string[]
  industries: string[]
  workMode: string
  salaryExpectation: string
  availability: string
}

export interface Candidate {
  id: string
  name: string
  email?: string
  phone?: string
  role: string
  initials: string
  location: string
  workMode: string
  availability: string
  experienceSummary: string
  education: CandidateEducation
  skills: CandidateSkill[]
  projects: Project[]
  experience: ExperienceItem[]
  assessments: Assessment[]
  preferences: string[]
  careerPreferences?: CandidateCareerPreferences
  verified: boolean
  consentSharePassport?: boolean
}

export interface ScoreBreakdown {
  label: string
  points: number
  max: number
  detail: string
  positive: boolean
}

export interface SkillMatch {
  skill: string
  weight: number
  status: SkillMatchStatus
  evidence: string
  transferableFrom?: string
}

export interface Match {
  candidateId: string
  requirementId: string
  score: number
  why: string[]
  skillMatches: SkillMatch[]
  missing: string[]
  breakdown: ScoreBreakdown[]
  educationFit: string
  locationFit: string
  availabilityFit: string
}

export interface Application {
  id: string
  requirementId: string
  candidateId: string
  status: ApplicationStatus
  matchScoreAtApplication: number
  appliedAt: string
  notes?: string
}

export interface SavedJob {
  candidateId: string
  requirementId: string
  savedAt: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: NotificationType
  link?: string
  read: boolean
  createdAt: string
}

export interface SkillEvidence {
  id: string
  candidateId: string
  skillName: string
  evidenceType: 'assessment' | 'project' | 'experience' | 'certification' | 'github'
  referenceTitle: string
  url?: string
  score?: number
  verified: boolean
}

export interface AuditLog {
  id: string
  userId?: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown>
  createdAt: string
}
