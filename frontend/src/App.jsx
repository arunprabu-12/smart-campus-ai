/**
 * Route table for the whole app.
 * - Public landing page at /welcome (default for unauthenticated users).
 * - Protected routes redirect to /welcome if not authenticated.
 * - Admin at /admin-login — secret access only.
 * - Profile only accessible via TopNav avatar icon → /profile.
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar.jsx'
import TopNav from './components/TopNav.jsx'

import Welcome from './pages/Welcome.jsx'
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

// Admin imports
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import Students from './pages/Admin/Students.jsx'
import Faculty from './pages/Admin/Faculty.jsx'
import StaffAllocation from './pages/Admin/StaffAllocation.jsx'
import Courses from './pages/Admin/Courses.jsx'
import AssignmentsAdmin from './pages/Admin/AssignmentsAdmin.jsx'
import TestsAdmin from './pages/Admin/TestsAdmin.jsx'
import AttendanceAdmin from './pages/Admin/AttendanceAdmin.jsx'
import Analytics from './pages/Admin/Analytics.jsx'
import Reports from './pages/Admin/Reports.jsx'
import AdminAIAssistant from './pages/Admin/AdminAIAssistant.jsx'
import Announcements from './pages/Admin/Announcements.jsx'
import FeedbackAdmin from './pages/Admin/FeedbackAdmin.jsx'
import AdminSettings from './pages/Admin/AdminSettings.jsx'

import AgentsHub from './pages/AgentsHub.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import { useAdminAuth } from './context/AdminAuthContext'

function RequireAuth({ children }) {
  const { token, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-400 text-sm">
        Loading...
      </div>
    )
  }
  return token ? children : <Navigate to="/welcome" replace />
}

function RequireAdminAuth({ children }) {
  const { token, loading } = useAdminAuth()
  if (loading) return <div className="min-h-screen bg-slate-900" />
  return token ? children : <Navigate to="/admin-login" replace />
}

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { token } = useAuth()

  return (
    <Routes>
      {/* Public Landing / Welcome Route */}
      <Route path="/welcome" element={<Welcome />} />

      {/* Student public auth routes */}
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

      {/* Admin public route */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin protected layout & sub-routes */}
      <Route path="/admin" element={<RequireAdminAuth><AdminLayout /></RequireAdminAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="courses" element={<Courses />} />
        <Route path="assignments" element={<AssignmentsAdmin />} />
        <Route path="tests" element={<TestsAdmin />} />
        <Route path="attendance" element={<AttendanceAdmin />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="ai" element={<AdminAIAssistant />} />
        <Route path="ai/faculty-allocation" element={<StaffAllocation />} />
        <Route path="ai/assignment-generator" element={<AssignmentsAdmin isGeneratorMode={true} />} />
        <Route path="ai/test-generator" element={<TestsAdmin isGeneratorMode={true} />} />
        <Route path="ai/academic-analyzer" element={<Analytics />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="feedback" element={<FeedbackAdmin />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Backwards compatibility for /admin-panel */}
      <Route path="/admin-panel/*" element={<Navigate to="/admin" replace />} />

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
      <Route path="*" element={<Navigate to={token ? "/" : "/welcome"} replace />} />
    </Routes>
  )
}
