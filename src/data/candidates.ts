import type { Candidate } from './types'

export const candidates: Candidate[] = [
  {
    id: 'c-ananya',
    name: 'Ananya Krishnan',
    role: 'Data Analyst',
    initials: 'AK',
    location: 'Chennai',
    workMode: 'Hybrid',
    availability: 'Immediate · 15-day notice',
    experienceSummary: '6-month analytics internship + freelance dashboards',
    verified: true,
    education: {
      degree: 'B.Sc. Statistics',
      school: 'University of Madras',
      year: '2025',
      relevance: 'Coursework in inference, SQL labs, and applied statistics maps directly to analyst work.',
    },
    skills: [
      { name: 'SQL', level: 'expert', verified: true },
      { name: 'Excel', level: 'strong', verified: true },
      { name: 'Power BI', level: 'strong', verified: false },
      { name: 'Python', level: 'working', verified: true },
      { name: 'Communication', level: 'strong', verified: false },
    ],
    projects: [
      {
        title: 'Retail demand dashboard',
        description:
          'Built a Power BI + SQL model for weekly SKU demand across 12 stores. Cut reporting time from 2 days to under 2 hours.',
        skills: ['SQL', 'Power BI', 'Excel'],
      },
      {
        title: 'Internship: campaign lift analysis',
        description:
          'Analyzed 8 digital campaigns with Python and SQL. Presented lift, CAC, and cohort retention to marketing leads.',
        skills: ['Python', 'SQL', 'Communication'],
      },
    ],
    experience: [
      {
        title: 'Analytics intern',
        org: 'Coastal Retail Labs',
        duration: 'Jan 2026 – Jun 2026 (6 months)',
        bullets: [
          'Owned weekly business review pack for category managers.',
          'Wrote parameterized SQL for inventory and sell-through.',
        ],
      },
    ],
    assessments: [
      { skill: 'SQL', score: 91, verified: true, date: '12 Aug 2026' },
      { skill: 'Excel', score: 88, verified: true, date: '12 Aug 2026' },
      { skill: 'Python', score: 76, verified: true, date: '18 Aug 2026' },
    ],
    preferences: ['Chennai or hybrid', 'Analyst / BI path', '₹4.8–6.5 LPA'],
  },
  {
    id: 'c-rohan',
    name: 'Rohan Mehta',
    role: 'Business Analyst',
    initials: 'RM',
    location: 'Chennai',
    workMode: 'Hybrid',
    availability: '30-day notice',
    experienceSummary: '14 months as junior BA; heavy Excel and stakeholder reporting',
    verified: true,
    education: {
      degree: 'B.Com (Hons)',
      school: 'Loyola College',
      year: '2024',
      relevance: 'Finance and MIS electives; less statistical depth than a stats degree.',
    },
    skills: [
      { name: 'Excel', level: 'expert', verified: true },
      { name: 'SQL', level: 'strong', verified: true },
      { name: 'Power BI', level: 'working', verified: false },
      { name: 'Python', level: 'working', verified: false },
      { name: 'Communication', level: 'expert', verified: true },
    ],
    projects: [
      {
        title: 'Collections MIS overhaul',
        description:
          'Rebuilt a 40-tab Excel model into a governed Power BI report with SQL extracts for a NBFC ops team.',
        skills: ['Excel', 'Power BI', 'SQL'],
      },
    ],
    experience: [
      {
        title: 'Junior business analyst',
        org: 'Harbor Finance',
        duration: 'Jul 2024 – present',
        bullets: [
          'Weekly decks for regional heads; reduced ad-hoc data requests by 30%.',
          'Trained 8 ops associates on Excel hygiene and pivot standards.',
        ],
      },
    ],
    assessments: [
      { skill: 'Excel', score: 94, verified: true, date: '4 Aug 2026' },
      { skill: 'SQL', score: 82, verified: true, date: '4 Aug 2026' },
      { skill: 'Communication', score: 90, verified: true, date: '9 Aug 2026' },
    ],
    preferences: ['Hybrid Chennai', 'Business-facing analytics', '₹5.5–7 LPA'],
  },
  {
    id: 'c-priya',
    name: 'Priya Venkatesh',
    role: 'Data Analyst (campus)',
    initials: 'PV',
    location: 'Coimbatore',
    workMode: 'Hybrid / relocate to Chennai',
    availability: 'Campus · June joining window',
    experienceSummary: 'Academic projects and a 3-month research assistantship',
    verified: true,
    education: {
      degree: 'B.Tech Information Technology',
      school: 'PSG College of Technology',
      year: '2026',
      relevance: 'Strong Python and databases; limited business-domain exposure.',
    },
    skills: [
      { name: 'Python', level: 'strong', verified: true },
      { name: 'SQL', level: 'strong', verified: true },
      { name: 'Excel', level: 'working', verified: false },
      { name: 'Power BI', level: 'working', verified: false },
      { name: 'Communication', level: 'working', verified: false },
    ],
    projects: [
      {
        title: 'Public transit delay model',
        description:
          'Python pipeline on GTFS-like data to flag delay clusters; SQL warehouse of 2.1M trip records.',
        skills: ['Python', 'SQL'],
      },
      {
        title: 'Student placement dashboard',
        description: 'Prototype Power BI report for placement cell KPIs.',
        skills: ['Power BI', 'Excel'],
      },
    ],
    experience: [
      {
        title: 'Research assistant',
        org: 'PSG Data Lab',
        duration: 'Mar 2026 – May 2026',
        bullets: ['Cleaned survey data and produced descriptive stats for a faculty paper.'],
      },
    ],
    assessments: [
      { skill: 'Python', score: 86, verified: true, date: '20 Aug 2026' },
      { skill: 'SQL', score: 80, verified: true, date: '20 Aug 2026' },
    ],
    preferences: ['Willing to relocate to Chennai', 'Learning-heavy first role', '₹4–5.5 LPA'],
  },
  {
    id: 'c-karthik',
    name: 'Karthik Iyer',
    role: 'Reporting analyst',
    initials: 'KI',
    location: 'Chennai',
    workMode: 'On-site preferred',
    availability: '45-day notice',
    experienceSummary: '2 years in MIS reporting; Excel-first, light SQL',
    verified: false,
    education: {
      degree: 'BBA',
      school: 'SRM University',
      year: '2023',
      relevance: 'Business fundamentals; no formal statistics or CS core.',
    },
    skills: [
      { name: 'Excel', level: 'expert', verified: false },
      { name: 'Communication', level: 'strong', verified: false },
      { name: 'SQL', level: 'working', verified: false },
      { name: 'Power BI', level: 'working', verified: false },
      { name: 'Python', level: 'working', verified: false },
    ],
    projects: [
      {
        title: 'Daily sales tracker',
        description: 'Maintained a shared Excel tracker for a 20-person inside-sales team.',
        skills: ['Excel', 'Communication'],
      },
    ],
    experience: [
      {
        title: 'MIS executive',
        org: 'Peninsula Logistics',
        duration: 'Sep 2023 – present',
        bullets: [
          'Daily/weekly operational reports for warehouse throughput.',
          'Began self-study SQL; no production queries yet.',
        ],
      },
    ],
    assessments: [{ skill: 'Excel', score: 71, verified: false, date: 'Practice attempt · Jul 2026' }],
    preferences: ['Chennai on-site', 'Reporting to analytics path', '₹4–6 LPA'],
  },
  {
    id: 'c-meera',
    name: 'Meera Nair',
    role: 'Frontend Engineer',
    initials: 'MN',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    availability: 'Immediate',
    experienceSummary: '2 years shipping React product UI',
    verified: true,
    education: {
      degree: 'B.E. Computer Science',
      school: 'RV College of Engineering',
      year: '2024',
      relevance: 'CS core plus internships in product engineering.',
    },
    skills: [
      { name: 'React', level: 'expert', verified: true },
      { name: 'TypeScript', level: 'strong', verified: true },
      { name: 'CSS', level: 'strong', verified: true },
      { name: 'Accessibility', level: 'working', verified: false },
      { name: 'Testing', level: 'working', verified: true },
    ],
    projects: [
      {
        title: 'Design-system migration',
        description: 'Moved a B2B dashboard from CSS modules to a tokenized component library.',
        skills: ['React', 'TypeScript', 'CSS'],
      },
    ],
    experience: [
      {
        title: 'Software engineer',
        org: 'Northwind Health',
        duration: 'Aug 2024 – present',
        bullets: ['Owns claims-status UI; added Playwright coverage for critical flows.'],
      },
    ],
    assessments: [
      { skill: 'React', score: 89, verified: true, date: '10 Aug 2026' },
      { skill: 'TypeScript', score: 84, verified: true, date: '10 Aug 2026' },
    ],
    preferences: ['Bengaluru hybrid', 'Product frontend', '₹12–15 LPA'],
  },
]
