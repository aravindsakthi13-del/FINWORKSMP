import type {
  CandidateEducation,
  CandidateSkill,
  ExperienceItem,
  Project,
  SkillWeight,
} from '../data/types'

// Known skill lexicon for deterministic parsing & AI extraction
const KNOWN_SKILLS = [
  'SQL',
  'Python',
  'Excel',
  'Power BI',
  'Tableau',
  'React',
  'TypeScript',
  'JavaScript',
  'CSS',
  'HTML',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'Communication',
  'Project Management',
  'Data Analysis',
  'Data Modeling',
  'Git',
  'AWS',
  'Azure',
  'Docker',
  'Machine Learning',
  'Pandas',
  'NumPy',
  'Testing',
  'Accessibility',
  'Process Mapping',
  'MIS Reporting',
  'Financial Modeling',
]

// Adjacent/Transferable Skills Matrix (PRD v2.0 §6, §10 Hidden Talent Engine)
export const TRANSFERABLE_SKILL_MAP: Record<string, string[]> = {
  'python': ['pandas', 'numpy', 'data analysis', 'sql'],
  'power bi': ['tableau', 'excel', 'data modeling', 'sql'],
  'tableau': ['power bi', 'excel', 'data analysis'],
  'react': ['typescript', 'javascript', 'vue', 'frontend engineering'],
  'sql': ['postgresql', 'mysql', 'database', 'data analysis'],
  'excel': ['mis reporting', 'financial modeling', 'data analysis', 'spreadsheets'],
  'communication': ['stakeholder management', 'client presentations', 'documentation'],
}

export interface ParsedJobRequirement {
  role: string
  department: string
  headcount: number
  location: string
  workMode: string
  experience: string
  salary: string
  joining: string
  skills: SkillWeight[]
}

export interface ParsedCandidateResume {
  name?: string
  role?: string
  email?: string
  phone?: string
  location?: string
  education?: Partial<CandidateEducation>
  skills: CandidateSkill[]
  projects: Project[]
  experience: ExperienceItem[]
}

/**
 * Lightweight MVP AI Assistant: Natural-Language Hiring Request -> Structured Requirement
 */
export function extractRequirementFromJD(jdText: string): ParsedJobRequirement {
  const text = jdText.toLowerCase()

  // 1. Role extraction
  let role = 'Software / Data Specialist'
  if (text.includes('data analyst') || text.includes('analytics')) role = 'Data Analyst'
  else if (text.includes('business analyst') || text.includes('ba')) role = 'Business Analyst'
  else if (text.includes('frontend') || text.includes('react') || text.includes('ui')) role = 'Frontend Engineer'
  else if (text.includes('operations') || text.includes('ops')) role = 'Operations Analyst'
  else if (text.includes('cloud') || text.includes('devops')) role = 'Cloud Data Engineer'
  else if (text.includes('product manager')) role = 'Product Manager'

  // 2. Department
  let department = 'Technology'
  if (text.includes('insights') || text.includes('analytics')) department = 'Insights'
  else if (text.includes('product') || text.includes('engineering')) department = 'Product'
  else if (text.includes('operations') || text.includes('supply')) department = 'Operations'
  else if (text.includes('finance') || text.includes('risk')) department = 'Finance'

  // 3. Location & Work Mode
  let location = 'Chennai'
  if (text.includes('bengaluru') || text.includes('bangalore')) location = 'Bengaluru'
  else if (text.includes('hyderabad')) location = 'Hyderabad'
  else if (text.includes('mumbai')) location = 'Mumbai'
  else if (text.includes('remote')) location = 'Remote'

  let workMode = 'Hybrid'
  if (text.includes('on-site') || text.includes('onsite') || text.includes('in-office')) workMode = 'On-site'
  else if (text.includes('remote') || text.includes('wfh')) workMode = 'Remote'

  // 4. Experience & Headcount
  let experience = '0–2 years'
  if (text.includes('3-5') || text.includes('3–5') || text.includes('senior')) experience = '3–5 years'
  else if (text.includes('1-3') || text.includes('1–3')) experience = '1–3 years'
  else if (text.includes('fresher') || text.includes('campus') || text.includes('0-1')) experience = '0–1 year'

  const headcountMatch = jdText.match(/(\d+)\s*(openings|positions|roles|headcount|people)/i)
  const headcount = headcountMatch ? parseInt(headcountMatch[1], 10) : 3

  // 5. Salary & Joining
  let salary = '₹5–8 LPA'
  const salMatch = jdText.match(/₹?(\d+(\.\d+)?)\s*[-–to]\s*(\d+(\.\d+)?)\s*(lpa|lakhs?)/i)
  if (salMatch) {
    salary = `₹${salMatch[1]}–${salMatch[3]} LPA`
  }

  let joining = 'Within 30 days'
  if (text.includes('immediate')) joining = 'Immediate'
  else if (text.includes('15 days') || text.includes('15-day')) joining = 'Within 15 days'
  else if (text.includes('45 days') || text.includes('campus')) joining = 'Campus / 45 days'

  // 6. Skill extraction & dynamic weights
  const detectedSkills: string[] = []
  for (const skill of KNOWN_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(jdText)) {
      detectedSkills.push(skill)
    }
  }

  if (detectedSkills.length === 0) {
    detectedSkills.push('SQL', 'Excel', 'Communication')
  }

  // Assign weighted proportions summing to 100%
  const baseWeights = [35, 25, 20, 10, 10, 10, 10]
  const skills: SkillWeight[] = detectedSkills.slice(0, 5).map((name, i) => ({
    name,
    weight: baseWeights[i] || 10,
  }))

  const sum = skills.reduce((acc, s) => acc + s.weight, 0)
  if (sum !== 100 && skills.length > 0) {
    skills[0].weight += 100 - sum
  }

  return {
    role,
    department,
    headcount,
    location,
    workMode,
    experience,
    salary,
    joining,
    skills,
  }
}

/**
 * Lightweight MVP AI Assistant: Resume text -> Extracted Profile Data
 */
export function extractProfileFromResume(resumeText: string): ParsedCandidateResume {
  const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean)

  // 1. Email & Phone
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
  const phoneMatch = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)

  // 2. Name candidate (first line if under 40 chars)
  const name = lines[0] && lines[0].length < 40 && !lines[0].includes('@') ? lines[0] : undefined

  // 3. Location
  let location: string | undefined
  if (/chennai/i.test(resumeText)) location = 'Chennai'
  else if (/bengaluru|bangalore/i.test(resumeText)) location = 'Bengaluru'
  else if (/hyderabad/i.test(resumeText)) location = 'Hyderabad'
  else if (/mumbai/i.test(resumeText)) location = 'Mumbai'

  // 4. Role
  let role: string | undefined
  if (/data analyst/i.test(resumeText)) role = 'Data Analyst'
  else if (/business analyst/i.test(resumeText)) role = 'Business Analyst'
  else if (/frontend|react/i.test(resumeText)) role = 'Frontend Engineer'
  else if (/operations/i.test(resumeText)) role = 'Operations Analyst'

  // 5. Skills extraction
  const extractedSkills: CandidateSkill[] = []
  for (const skill of KNOWN_SKILLS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(resumeText)) {
      // Determine proficiency heuristically
      const isExpert = new RegExp(`(expert|lead|advanced|proficient in)\\s+.*?${skill}`, 'i').test(resumeText)
      const level = isExpert ? 'expert' : 'strong'
      extractedSkills.push({
        name: skill,
        level,
        verified: false,
      })
    }
  }

  // 6. Education extraction
  let education: Partial<CandidateEducation> | undefined
  if (/b\.tech|bachelor|b\.sc|b\.e|bba|b\.com/i.test(resumeText)) {
    const degreeMatch = resumeText.match(/(B\.Tech|B\.Sc|B\.E|B\.Com|BBA|Master|M\.Tech|M\.Sc)[^\n,\.]*/i)
    education = {
      degree: degreeMatch ? degreeMatch[0].trim() : 'Bachelor Degree',
      school: 'University',
      year: '2025',
      relevance: 'Relevant coursework and lab projects identified in resume.',
    }
  }

  // 7. Projects & Experience extraction (heuristics)
  const projects: Project[] = []
  if (/project|portfolio|built|developed/i.test(resumeText)) {
    projects.push({
      title: 'Practical Project extracted from Resume',
      description: 'Extracted project demonstrating practical tool application and problem solving.',
      skills: extractedSkills.slice(0, 3).map((s) => s.name),
    })
  }

  const experience: ExperienceItem[] = []
  if (/intern|associate|analyst|engineer|work experience/i.test(resumeText)) {
    experience.push({
      title: role || 'Junior Specialist',
      org: 'Previous Organization',
      duration: '6+ months',
      bullets: ['Contributed to key data workflows and reporting packs.'],
    })
  }

  return {
    name,
    role,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    location,
    education,
    skills: extractedSkills,
    projects,
    experience,
  }
}
