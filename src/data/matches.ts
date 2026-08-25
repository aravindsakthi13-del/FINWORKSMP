import type { Match } from './types'

export const matches: Match[] = [
  {
    candidateId: 'c-ananya',
    requirementId: 'req-data-analyst',
    score: 92,
    why: [
      '5/5 critical skills matched',
      'SQL assessment verified',
      'Two relevant projects',
      'Six-month internship',
      'Strong location and availability fit',
    ],
    missing: ['Power BI certification not present'],
    educationFit: 'Statistics degree with applied labs — high relevance to analyst work.',
    locationFit: 'Already in Chennai and open to hybrid.',
    availabilityFit: 'Can join within 15 days.',
    skillMatches: [
      { skill: 'SQL', weight: 30, status: 'matched', evidence: 'Verified assessment 91 · production queries in internship' },
      { skill: 'Power BI', weight: 25, status: 'matched', evidence: 'Retail demand dashboard; no vendor certification' },
      { skill: 'Excel', weight: 20, status: 'matched', evidence: 'Verified assessment 88 · reporting packs owned' },
      { skill: 'Python', weight: 15, status: 'matched', evidence: 'Campaign lift analysis · verified 76' },
      { skill: 'Communication', weight: 10, status: 'matched', evidence: 'Presented to marketing leads; no formal assessment' },
    ],
    breakdown: [
      { label: 'Weighted skill coverage', points: 48, max: 50, detail: 'All five required skills evidenced', positive: true },
      { label: 'Verification & assessments', points: 18, max: 20, detail: 'SQL, Excel, and Python verified', positive: true },
      { label: 'Projects & internship', points: 16, max: 18, detail: 'Two role-relevant projects + 6-month internship', positive: true },
      { label: 'Location & availability', points: 10, max: 12, detail: 'Chennai hybrid, near-immediate join. −2 for missing Power BI certification.', positive: true },
    ],
  },
  {
    candidateId: 'c-rohan',
    requirementId: 'req-data-analyst',
    score: 87,
    why: [
      'Excel and stakeholder communication are standout',
      'SQL verified with live MIS work',
      'One substantial reporting project',
      'Chennai hybrid fit',
    ],
    missing: ['Python evidence is thin', 'Power BI still at working level'],
    educationFit: 'Commerce degree with MIS electives — good business context, lighter stats.',
    locationFit: 'Based in Chennai, hybrid.',
    availabilityFit: '30-day notice from current BA role.',
    skillMatches: [
      { skill: 'SQL', weight: 30, status: 'matched', evidence: 'Verified 82 · SQL extracts in production MIS' },
      { skill: 'Power BI', weight: 25, status: 'partial', evidence: 'One migration project; limited independent modeling' },
      { skill: 'Excel', weight: 20, status: 'matched', evidence: 'Verified 94 · expert-level models' },
      { skill: 'Python', weight: 15, status: 'partial', evidence: 'Self-study only; no verified assessment' },
      { skill: 'Communication', weight: 10, status: 'matched', evidence: 'Verified 90 · weekly exec decks' },
    ],
    breakdown: [
      { label: 'Weighted skill coverage', points: 42, max: 50, detail: 'SQL/Excel/comms strong; Power BI and Python partial', positive: true },
      { label: 'Verification & assessments', points: 16, max: 20, detail: 'Excel, SQL, communication verified', positive: true },
      { label: 'Projects & experience', points: 17, max: 18, detail: '14 months BA experience outweighs single project', positive: true },
      { label: 'Location & availability', points: 12, max: 12, detail: 'Local hybrid; 30-day notice is acceptable', positive: true },
    ],
  },
  {
    candidateId: 'c-priya',
    requirementId: 'req-data-analyst',
    score: 81,
    why: [
      'Verified Python and SQL',
      'Two academic/practical projects',
      'Willing to relocate to Chennai',
    ],
    missing: ['Limited business-domain experience', 'Excel and Power BI not verified', 'Campus joining timeline'],
    educationFit: 'IT degree with strong technical labs; business storytelling still developing.',
    locationFit: 'Coimbatore now; open to Chennai hybrid.',
    availabilityFit: 'Campus window — later than the 30-day joining preference.',
    skillMatches: [
      { skill: 'SQL', weight: 30, status: 'matched', evidence: 'Verified 80 · 2.1M-row warehouse project' },
      { skill: 'Power BI', weight: 25, status: 'partial', evidence: 'Student placement prototype only' },
      { skill: 'Excel', weight: 20, status: 'partial', evidence: 'Used in prototype; no assessment' },
      { skill: 'Python', weight: 15, status: 'matched', evidence: 'Verified 86 · transit delay pipeline' },
      { skill: 'Communication', weight: 10, status: 'partial', evidence: 'Academic presentations only' },
    ],
    breakdown: [
      { label: 'Weighted skill coverage', points: 38, max: 50, detail: 'SQL/Python strong; BI stack still forming', positive: true },
      { label: 'Verification & assessments', points: 14, max: 20, detail: 'Python and SQL verified', positive: true },
      { label: 'Projects & experience', points: 17, max: 18, detail: 'Projects are real; internship is short', positive: true },
      { label: 'Location & availability', points: 12, max: 12, detail: 'Will relocate; campus joining is later than preferred', positive: true },
    ],
  },
  {
    candidateId: 'c-karthik',
    requirementId: 'req-data-analyst',
    score: 76,
    why: [
      'Deep Excel reporting experience',
      'Already in Chennai',
      'Business operations context',
    ],
    missing: [
      'Skills not verified on-platform',
      'SQL still working-level',
      'No Python evidence of substance',
      'Power BI is early',
    ],
    educationFit: 'BBA supports ops reporting more than statistical analysis.',
    locationFit: 'Chennai; prefers on-site which still works for hybrid req.',
    availabilityFit: '45-day notice is slower than preferred.',
    skillMatches: [
      { skill: 'SQL', weight: 30, status: 'partial', evidence: 'Self-study; no production queries' },
      { skill: 'Power BI', weight: 25, status: 'partial', evidence: 'Exploratory use only' },
      { skill: 'Excel', weight: 20, status: 'matched', evidence: 'Two years MIS; assessment not verified' },
      { skill: 'Python', weight: 15, status: 'missing', evidence: 'No project or assessment' },
      { skill: 'Communication', weight: 10, status: 'matched', evidence: 'Daily stakeholder reporting' },
    ],
    breakdown: [
      { label: 'Weighted skill coverage', points: 32, max: 50, detail: 'Excel/comms carry the score; SQL/Python lag', positive: true },
      { label: 'Verification & assessments', points: 6, max: 20, detail: 'No verified badges yet', positive: false },
      { label: 'Projects & experience', points: 26, max: 30, detail: 'Tenure is real; evidence is spreadsheet-heavy', positive: true },
      { label: 'Location & availability', points: 12, max: 15, detail: 'Local, 45-day notice', positive: true },
    ],
  },
  {
    candidateId: 'c-meera',
    requirementId: 'req-frontend',
    score: 90,
    why: [
      'React and TypeScript verified',
      'Shipped product UI for two years',
      'Bengaluru hybrid fit',
    ],
    missing: ['Accessibility practice is still developing'],
    educationFit: 'CS degree aligned to engineering hiring bar.',
    locationFit: 'Bengaluru hybrid.',
    availabilityFit: 'Immediate.',
    skillMatches: [
      { skill: 'React', weight: 35, status: 'matched', evidence: 'Verified 89 · current product owner for claims UI' },
      { skill: 'TypeScript', weight: 25, status: 'matched', evidence: 'Verified 84' },
      { skill: 'CSS', weight: 20, status: 'matched', evidence: 'Design-system migration' },
      { skill: 'Accessibility', weight: 10, status: 'partial', evidence: 'Awareness, limited audits' },
      { skill: 'Testing', weight: 10, status: 'matched', evidence: 'Playwright on critical flows' },
    ],
    breakdown: [
      { label: 'Weighted skill coverage', points: 46, max: 50, detail: 'Core frontend stack is production-grade', positive: true },
      { label: 'Verification & assessments', points: 18, max: 20, detail: 'React and TypeScript verified', positive: true },
      { label: 'Projects & experience', points: 16, max: 18, detail: 'Two years product engineering', positive: true },
      { label: 'Location & availability', points: 10, max: 12, detail: 'Immediate Bengaluru hybrid', positive: true },
    ],
  },
]

export function matchFor(requirementId: string, candidateId: string) {
  return matches.find((m) => m.requirementId === requirementId && m.candidateId === candidateId)
}

export function matchesForRequirement(requirementId: string) {
  return matches
    .filter((m) => m.requirementId === requirementId)
    .slice()
    .sort((a, b) => b.score - a.score)
}
