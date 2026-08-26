-- ==============================================================================
-- ADEPT UNIFIED AI EMPLOYMENT PLATFORM — SUPABASE SCHEMA (PRD v2.0)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Linked 1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RECRUITER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CANDIDATES TABLE
CREATE TABLE IF NOT EXISTS public.candidates (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  initials TEXT NOT NULL,
  location TEXT NOT NULL,
  work_mode TEXT NOT NULL,
  availability TEXT NOT NULL,
  experience_summary TEXT,
  email TEXT,
  phone TEXT,
  verified BOOLEAN DEFAULT false,
  consent_share_passport BOOLEAN DEFAULT true,
  education JSONB NOT NULL DEFAULT '{}'::jsonb,
  preferences JSONB DEFAULT '[]'::jsonb,
  career_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CANDIDATE SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.candidate_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('working', 'strong', 'expert')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. CANDIDATE PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.candidate_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. CANDIDATE EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.candidate_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  org TEXT NOT NULL,
  duration TEXT NOT NULL,
  bullets TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CANDIDATE ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.candidate_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  score NUMERIC NOT NULL,
  verified BOOLEAN DEFAULT false,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SKILL EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS public.skill_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('assessment', 'project', 'experience', 'certification', 'github')),
  reference_title TEXT NOT NULL,
  url TEXT,
  score NUMERIC,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. HIRING REQUIREMENTS / JOBS TABLE
CREATE TABLE IF NOT EXISTS public.hiring_requirements (
  id TEXT PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  headcount INTEGER NOT NULL DEFAULT 1,
  location TEXT NOT NULL,
  work_mode TEXT NOT NULL,
  experience TEXT NOT NULL,
  salary TEXT NOT NULL,
  joining TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'filled')),
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  potential_matches INTEGER DEFAULT 0,
  verified_matches INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. PIPELINE ENTRIES TABLE (Recruiter Kanban)
CREATE TABLE IF NOT EXISTS public.pipeline_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id TEXT NOT NULL REFERENCES public.hiring_requirements(id) ON DELETE CASCADE,
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('shortlisted', 'interview', 'offer', 'hired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (requirement_id, candidate_id)
);

-- 12. CANDIDATE APPLICATIONS TABLE (Candidate-Initiated)
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  requirement_id TEXT NOT NULL REFERENCES public.hiring_requirements(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  match_score_at_application INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (candidate_id, requirement_id)
);

-- 13. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  requirement_id TEXT NOT NULL REFERENCES public.hiring_requirements(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (candidate_id, requirement_id)
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('match_alert', 'application_update', 'shortlist_alert', 'system')),
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hiring_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Allow users to insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow read on companies" ON public.companies FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow read on candidates" ON public.candidates FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow candidates to update own" ON public.candidates FOR UPDATE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow read on skills" ON public.candidate_skills FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow candidates to insert skills" ON public.candidate_skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow candidates to update skills" ON public.candidate_skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow candidates to delete skills" ON public.candidate_skills FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow read on projects" ON public.candidate_projects FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow candidates to insert projects" ON public.candidate_projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow candidates to update projects" ON public.candidate_projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow candidates to delete projects" ON public.candidate_projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow read on experience" ON public.candidate_experience FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow read on assessments" ON public.candidate_assessments FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow read on skill_evidence" ON public.skill_evidence FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow read on hiring_requirements" ON public.hiring_requirements FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated to insert requirements" ON public.hiring_requirements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated to update requirements" ON public.hiring_requirements FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow read on pipeline_entries" ON public.pipeline_entries FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow authenticated to insert pipeline" ON public.pipeline_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated to update pipeline" ON public.pipeline_entries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated to delete pipeline" ON public.pipeline_entries FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow read on applications" ON public.applications FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow candidate to insert application" ON public.applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow candidate to update application" ON public.applications FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow read on saved_jobs" ON public.saved_jobs FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow candidate to insert saved_jobs" ON public.saved_jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow candidate to delete saved_jobs" ON public.saved_jobs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow read on notifications" ON public.notifications FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Allow update on notifications" ON public.notifications FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow insert audit_logs" ON public.audit_logs FOR INSERT TO authenticated, anon WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'candidate');
  user_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, user_name, user_role)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, role = EXCLUDED.role;

  IF user_role = 'candidate' THEN
    INSERT INTO public.candidates (
      id, user_id, name, role, initials, location, work_mode, availability, experience_summary, verified, consent_share_passport, education, preferences, career_preferences
    )
    VALUES (
      'c-' || substr(new.id::text, 1, 8),
      new.id,
      user_name,
      'Aspiring Professional',
      UPPER(substr(user_name, 1, 2)),
      'Bengaluru',
      'Hybrid',
      'Immediate',
      'Motivated candidate ready for skills-first employment.',
      false,
      true,
      '{"degree": "Bachelor Degree", "school": "University", "year": "2026", "relevance": "Core coursework"}'::jsonb,
      '["Hybrid", "Full-time"]'::jsonb,
      '{"targetRoles": ["Junior Analyst", "Associate"], "industries": ["Tech"], "workMode": "Hybrid", "salaryExpectation": "Competitive", "availability": "Immediate"}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SEED DATA MIGRATION
-- ==============================================================================

-- 1. Seed Company
INSERT INTO public.companies (id, name, description, location, verified)
VALUES ('00000000-0000-0000-0000-000000000001', 'Harbor Collective', 'Insights and employment intelligence group', 'Chennai', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Candidates
INSERT INTO public.candidates (id, name, role, initials, location, work_mode, availability, experience_summary, verified, consent_share_passport, education, preferences, career_preferences)
VALUES
(
  'c-ananya',
  'Ananya Krishnan',
  'Data Analyst',
  'AK',
  'Chennai',
  'Hybrid',
  'Immediate · 15-day notice',
  '6-month analytics internship + freelance dashboards',
  true,
  true,
  '{"degree": "B.Sc. Statistics", "school": "University of Madras", "year": "2025", "relevance": "Coursework in inference, SQL labs, and applied statistics maps directly to analyst work."}'::jsonb,
  '["Chennai or hybrid", "Analyst / BI path", "₹4.8–6.5 LPA"]'::jsonb,
  '{"targetRoles": ["Data Analyst", "BI Specialist"], "industries": ["Retail", "Fintech"], "workMode": "Hybrid", "salaryExpectation": "₹4.8–6.5 LPA", "availability": "Immediate · 15-day notice"}'::jsonb
),
(
  'c-rohan',
  'Rohan Mehta',
  'Business Analyst',
  'RM',
  'Chennai',
  'Hybrid',
  '30-day notice',
  '14 months as junior BA; heavy Excel and stakeholder reporting',
  true,
  true,
  '{"degree": "B.Com (Hons)", "school": "Loyola College", "year": "2024", "relevance": "Finance and MIS electives; less statistical depth than a stats degree."}'::jsonb,
  '["Hybrid Chennai", "Business-facing analytics", "₹5.5–7 LPA"]'::jsonb,
  '{"targetRoles": ["Business Analyst", "Operations Analyst"], "industries": ["Finance", "Consulting"], "workMode": "Hybrid", "salaryExpectation": "₹5.5–7 LPA", "availability": "30-day notice"}'::jsonb
),
(
  'c-priya',
  'Priya Venkatesh',
  'Data Analyst (campus)',
  'PV',
  'Coimbatore',
  'Hybrid / relocate to Chennai',
  'Campus · June joining window',
  'Academic projects and a 3-month research assistantship',
  true,
  true,
  '{"degree": "B.Tech Information Technology", "school": "PSG College of Technology", "year": "2026", "relevance": "Strong Python and databases; limited business-domain exposure."}'::jsonb,
  '["Willing to relocate to Chennai", "Learning-heavy first role", "₹4–5.5 LPA"]'::jsonb,
  '{"targetRoles": ["Data Analyst", "Data Engineer"], "industries": ["Technology", "Transit"], "workMode": "Hybrid / relocate to Chennai", "salaryExpectation": "₹4–5.5 LPA", "availability": "Campus · June joining window"}'::jsonb
),
(
  'c-karthik',
  'Karthik Iyer',
  'Reporting analyst',
  'KI',
  'Chennai',
  'On-site preferred',
  '45-day notice',
  '2 years in MIS reporting; Excel-first, light SQL',
  false,
  true,
  '{"degree": "BBA", "school": "SRM University", "year": "2023", "relevance": "Business fundamentals; no formal statistics or CS core."}'::jsonb,
  '["Chennai on-site", "Reporting to analytics path", "₹4–6 LPA"]'::jsonb,
  '{"targetRoles": ["Reporting Analyst", "MIS Specialist"], "industries": ["Logistics", "Operations"], "workMode": "On-site preferred", "salaryExpectation": "₹4–6 LPA", "availability": "45-day notice"}'::jsonb
),
(
  'c-meera',
  'Meera Nair',
  'Frontend Engineer',
  'MN',
  'Bengaluru',
  'Hybrid',
  'Immediate',
  '2 years shipping React product UI',
  true,
  true,
  '{"degree": "B.E. Computer Science", "school": "RV College of Engineering", "year": "2024", "relevance": "CS core plus internships in product engineering."}'::jsonb,
  '["Bengaluru hybrid", "Product frontend", "₹12–15 LPA"]'::jsonb,
  '{"targetRoles": ["Frontend Engineer", "UI Engineer"], "industries": ["HealthTech", "SaaS"], "workMode": "Hybrid", "salaryExpectation": "₹12–15 LPA", "availability": "Immediate"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Candidate Skills
INSERT INTO public.candidate_skills (candidate_id, name, level, verified) VALUES
('c-ananya', 'SQL', 'expert', true),
('c-ananya', 'Excel', 'strong', true),
('c-ananya', 'Power BI', 'strong', false),
('c-ananya', 'Python', 'working', true),
('c-ananya', 'Communication', 'strong', false),
('c-rohan', 'Excel', 'expert', true),
('c-rohan', 'SQL', 'strong', true),
('c-rohan', 'Power BI', 'working', false),
('c-rohan', 'Python', 'working', false),
('c-rohan', 'Communication', 'expert', true),
('c-priya', 'Python', 'strong', true),
('c-priya', 'SQL', 'strong', true),
('c-priya', 'Excel', 'working', false),
('c-priya', 'Power BI', 'working', false),
('c-priya', 'Communication', 'working', false),
('c-karthik', 'Excel', 'expert', false),
('c-karthik', 'Communication', 'strong', false),
('c-karthik', 'SQL', 'working', false),
('c-karthik', 'Power BI', 'working', false),
('c-karthik', 'Python', 'working', false),
('c-meera', 'React', 'expert', true),
('c-meera', 'TypeScript', 'strong', true),
('c-meera', 'CSS', 'strong', true),
('c-meera', 'Accessibility', 'working', false),
('c-meera', 'Testing', 'working', true);

-- 4. Seed Candidate Projects
INSERT INTO public.candidate_projects (candidate_id, title, description, skills, link) VALUES
('c-ananya', 'Retail demand dashboard', 'Built a Power BI + SQL model for weekly SKU demand across 12 stores. Cut reporting time from 2 days to under 2 hours.', ARRAY['SQL', 'Power BI', 'Excel'], 'https://github.com/ananya/retail-demand'),
('c-ananya', 'Internship: campaign lift analysis', 'Analyzed 8 digital campaigns with Python and SQL. Presented lift, CAC, and cohort retention to marketing leads.', ARRAY['Python', 'SQL', 'Communication'], 'https://github.com/ananya/campaign-lift'),
('c-rohan', 'Collections MIS overhaul', 'Rebuilt a 40-tab Excel model into a governed Power BI report with SQL extracts for a NBFC ops team.', ARRAY['Excel', 'Power BI', 'SQL'], 'https://github.com/rohan/mis-overhaul'),
('c-priya', 'Public transit delay model', 'Python pipeline on GTFS-like data to flag delay clusters; SQL warehouse of 2.1M trip records.', ARRAY['Python', 'SQL'], 'https://github.com/priya/transit-delays'),
('c-priya', 'Student placement dashboard', 'Prototype Power BI report for placement cell KPIs.', ARRAY['Power BI', 'Excel'], 'https://github.com/priya/placement-kpi'),
('c-karthik', 'Daily sales tracker', 'Maintained a shared Excel tracker for a 20-person inside-sales team.', ARRAY['Excel', 'Communication'], NULL),
('c-meera', 'Design-system migration', 'Moved a B2B dashboard from CSS modules to a tokenized component library.', ARRAY['React', 'TypeScript', 'CSS'], 'https://github.com/meera/ds-migration');

-- 5. Seed Candidate Experience
INSERT INTO public.candidate_experience (candidate_id, title, org, duration, bullets) VALUES
('c-ananya', 'Analytics intern', 'Coastal Retail Labs', 'Jan 2026 – Jun 2026 (6 months)', ARRAY['Owned weekly business review pack for category managers.', 'Wrote parameterized SQL for inventory and sell-through.']),
('c-rohan', 'Junior business analyst', 'Harbor Finance', 'Jul 2024 – present', ARRAY['Weekly decks for regional heads; reduced ad-hoc data requests by 30%.', 'Trained 8 ops associates on Excel hygiene and pivot standards.']),
('c-priya', 'Research assistant', 'PSG Data Lab', 'Mar 2026 – May 2026', ARRAY['Cleaned survey data and produced descriptive stats for a faculty paper.']),
('c-karthik', 'MIS executive', 'Peninsula Logistics', 'Sep 2023 – present', ARRAY['Daily/weekly operational reports for warehouse throughput.', 'Began self-study SQL; no production queries yet.']),
('c-meera', 'Software engineer', 'Northwind Health', 'Aug 2024 – present', ARRAY['Owns claims-status UI; added Playwright coverage for critical flows.']);

-- 6. Seed Candidate Assessments
INSERT INTO public.candidate_assessments (candidate_id, skill, score, verified, date) VALUES
('c-ananya', 'SQL', 91, true, '12 Aug 2026'),
('c-ananya', 'Excel', 88, true, '12 Aug 2026'),
('c-ananya', 'Python', 76, true, '18 Aug 2026'),
('c-rohan', 'Excel', 94, true, '4 Aug 2026'),
('c-rohan', 'SQL', 82, true, '4 Aug 2026'),
('c-rohan', 'Communication', 90, true, '9 Aug 2026'),
('c-priya', 'Python', 86, true, '20 Aug 2026'),
('c-priya', 'SQL', 80, true, '20 Aug 2026'),
('c-karthik', 'Excel', 71, false, 'Practice attempt · Jul 2026'),
('c-meera', 'React', 89, true, '10 Aug 2026'),
('c-meera', 'TypeScript', 84, true, '10 Aug 2026');

-- 7. Seed Hiring Requirements
INSERT INTO public.hiring_requirements (id, company_id, role, department, headcount, location, work_mode, experience, salary, joining, status, skills, potential_matches, verified_matches) VALUES
(
  'req-data-analyst',
  '00000000-0000-0000-0000-000000000001',
  'Data Analyst',
  'Insights',
  10,
  'Chennai',
  'Hybrid',
  '0–2 years',
  '₹4–7 LPA',
  'Within 30 days',
  'active',
  '[{"name": "SQL", "weight": 30}, {"name": "Power BI", "weight": 25}, {"name": "Excel", "weight": 20}, {"name": "Python", "weight": 15}, {"name": "Communication", "weight": 10}]'::jsonb,
  18,
  7
),
(
  'req-frontend',
  '00000000-0000-0000-0000-000000000001',
  'Frontend Engineer',
  'Product',
  4,
  'Bengaluru',
  'Hybrid',
  '1–3 years',
  '₹10–16 LPA',
  'Immediate joiners preferred',
  'active',
  '[{"name": "React", "weight": 35}, {"name": "TypeScript", "weight": 25}, {"name": "CSS", "weight": 20}, {"name": "Accessibility", "weight": 10}, {"name": "Testing", "weight": 10}]'::jsonb,
  11,
  5
),
(
  'req-ops-analyst',
  '00000000-0000-0000-0000-000000000001',
  'Operations Analyst',
  'Operations',
  6,
  'Hyderabad',
  'On-site',
  '0–1 year',
  '₹3.5–5.5 LPA',
  'Campus / 45 days',
  'draft',
  '[{"name": "Excel", "weight": 30}, {"name": "SQL", "weight": 25}, {"name": "Process mapping", "weight": 20}, {"name": "Communication", "weight": 15}, {"name": "Python", "weight": 10}]'::jsonb,
  9,
  2
)
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Candidate Applications
INSERT INTO public.applications (id, candidate_id, requirement_id, status, match_score_at_application, created_at) VALUES
('app-ananya-01', 'c-ananya', 'req-data-analyst', 'interviewing', 84, now() - INTERVAL '2 days'),
('app-rohan-01', 'c-rohan', 'req-data-analyst', 'reviewing', 74, now() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;
