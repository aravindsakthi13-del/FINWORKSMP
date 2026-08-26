import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { CandidateShell } from './components/layout/CandidateShell'
import { LoginPage } from './pages/auth/Login'
import { SignupPage } from './pages/auth/Signup'
import { CandidateDashboardPage } from './pages/candidate/CandidateDashboard'
import { CandidatePassportPage } from './pages/candidate/CandidatePassport'
import { CandidateProfilePage } from './pages/candidate/CandidateProfile'
import { DashboardPage } from './pages/Dashboard'
import { LandingPage } from './pages/Landing'
import { MatchDetailPage } from './pages/MatchDetail'
import { MatchingPage } from './pages/Matching'
import { PipelinePage } from './pages/Pipeline'
import { RequirementDetailPage } from './pages/RequirementDetail'
import { RequirementsPage } from './pages/Requirements'
import { TalentPassportPage } from './pages/TalentPassport'
import { AuthProvider } from './state/AuthContext'
import { RecruiterProvider } from './state/RecruiterContext'

export default function App() {
  return (
    <AuthProvider>
      <RecruiterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Recruiter Workspace - Protected for recruiters and admins */}
            <Route element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
              <Route element={<AppShell />}>
                <Route path="/recruiter" element={<DashboardPage />} />
                <Route path="/recruiter/requirements" element={<RequirementsPage />} />
                <Route path="/recruiter/requirements/:requirementId" element={<RequirementDetailPage />} />
                <Route path="/recruiter/requirements/:requirementId/matches" element={<MatchingPage />} />
                <Route
                  path="/recruiter/requirements/:requirementId/matches/:candidateId"
                  element={<MatchDetailPage />}
                />
                <Route path="/recruiter/pipeline" element={<PipelinePage />} />
                <Route path="/recruiter/candidates/:candidateId" element={<TalentPassportPage />} />
              </Route>
            </Route>

            {/* Candidate Experience Portal - Protected for candidates and admins */}
            <Route element={<ProtectedRoute allowedRoles={['candidate', 'admin']} />}>
              <Route element={<CandidateShell />}>
                <Route path="/candidate" element={<CandidateDashboardPage />} />
                <Route path="/candidate/profile" element={<CandidateProfilePage />} />
                <Route path="/candidate/passport" element={<CandidatePassportPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RecruiterProvider>
    </AuthProvider>
  )
}
