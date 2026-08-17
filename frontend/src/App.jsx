/**
 * Route table for the whole app.
 * - Protected routes redirect to /login if not authenticated.
 * - Admin at /admin — no link in nav, secret access only.
 * - Profile only accessible via TopNav avatar icon → /profile.
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar.jsx'
import TopNav from './components/TopNav.jsx'

import Dashboard from './pages/Dashboard.jsx'
import CoursePage from './pages/CoursePage.jsx'
import Assignments from './pages/Assignments.jsx'
import Tests from './pages/Tests.jsx'
import Results from './pages/Results.jsx'
import StudyPlan from './pages/StudyPlan.jsx'
import Advisor from './pages/Advisor.jsx'
import AcademicJourney from './pages/AcademicJourney.jsx'
import Profile from './pages/Profile.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Attendance from './pages/Attendance.jsx'
import TestReport from './pages/TestReport.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import AdminPanel from './pages/Admin/AdminPanel.jsx'
import AgentsHub from './pages/AgentsHub.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import { useAdminAuth } from './context/AdminAuthContext'

function RequireAuth({ children }) {
  const { token, loading } = useAuth()
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63)',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid #6366f1', borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    )
  }
  return token ? children : <Navigate to="/login" replace />
}

function RequireAdminAuth({ children }) {
  const { token, loading } = useAdminAuth()
  if (loading) return <div style={{ minHeight: '100vh', background: '#0f0c29' }} />
  return token ? children : <Navigate to="/admin-login" replace />
}

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopNav />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { token } = useAuth()

  return (
    <Routes>
      {/* Student public routes */}
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

      {/* Admin public route */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin protected — completely separate from student layout */}
      <Route path="/admin-panel/*" element={<RequireAdminAuth><AdminPanel /></RequireAdminAuth>} />

      {/* Student protected routes */}
      <Route path="/" element={<RequireAuth><AppLayout><Dashboard /></AppLayout></RequireAuth>} />
      <Route path="/courses/:courseId" element={<RequireAuth><AppLayout><CoursePage /></AppLayout></RequireAuth>} />
      <Route path="/assignments" element={<RequireAuth><AppLayout><Assignments /></AppLayout></RequireAuth>} />
      <Route path="/tests" element={<RequireAuth><AppLayout><Tests /></AppLayout></RequireAuth>} />
      <Route path="/tests/report/:attemptId" element={<RequireAuth><AppLayout><TestReport /></AppLayout></RequireAuth>} />
      <Route path="/results" element={<RequireAuth><AppLayout><Results /></AppLayout></RequireAuth>} />
      <Route path="/calendar" element={<RequireAuth><AppLayout><CalendarPage /></AppLayout></RequireAuth>} />
      <Route path="/study-plan" element={<RequireAuth><AppLayout><StudyPlan /></AppLayout></RequireAuth>} />
      <Route path="/advisor" element={<RequireAuth><AppLayout><Advisor /></AppLayout></RequireAuth>} />
      <Route path="/journey" element={<RequireAuth><AppLayout><AcademicJourney /></AppLayout></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><AppLayout><Profile /></AppLayout></RequireAuth>} />
      <Route path="/attendance" element={<RequireAuth><AppLayout><Attendance /></AppLayout></RequireAuth>} />
      <Route path="/agents" element={<RequireAuth><AppLayout><AgentsHub /></AppLayout></RequireAuth>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
