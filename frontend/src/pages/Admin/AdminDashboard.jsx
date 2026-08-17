/**
 * Admin Panel — secret access only (no link in sidebar).
 * Navigate directly to /admin after logging in as an admin user.
 * Admin login: POST /auth/admin-login with X-Admin-Secret header.
 */
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ManageStudents from './ManageStudents.jsx'
import ManageCourses from './ManageCourses.jsx'
import UploadDocuments from './UploadDocuments.jsx'
import ManageAttendance from './ManageAttendance.jsx'

export default function AdminDashboard() {
  const { student } = useAuth()
  const navigate = useNavigate()

  const tabStyle = ({ isActive }) =>
    [
      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
    ].join(' ')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)',
      padding: '32px',
      fontFamily: "'Inter', sans-serif",
      color: '#f1f5f9',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
          }}>⚙️</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
              Admin Control Panel
            </h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              🔐 Restricted Access — Manage academic content, students & AI data
            </p>
          </div>
        </div>

        {/* Admin badge */}
        {student?.is_admin && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'linear-gradient(135deg, #7c3aed22, #6366f122)',
            border: '1px solid #6366f144',
            borderRadius: '20px', padding: '4px 14px',
            fontSize: '12px', color: '#a78bfa', fontWeight: 600,
          }}>
            🛡️ Admin: {student.full_name}
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', gap: '8px', flexWrap: 'wrap',
        borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '24px',
      }}>
        {[
          { to: 'students', label: '👥 Students' },
          { to: 'courses', label: '📚 Courses & Curriculum' },
          { to: 'documents', label: '📄 Upload Docs (RAG)' },
          { to: 'attendance', label: '📅 Attendance' },
        ].map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            style={({ isActive }) => ({
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive
                ? 'linear-gradient(135deg, #6366f1, #a78bfa)'
                : 'rgba(15,23,42,0.6)',
              color: isActive ? '#fff' : '#94a3b8',
              border: `1px solid ${isActive ? '#6366f1' : '#1e293b'}`,
              boxShadow: isActive ? '0 4px 12px #6366f144' : 'none',
            })}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Sub-routes */}
      <Routes>
        <Route path="students" element={<ManageStudents />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="documents" element={<UploadDocuments />} />
        <Route path="attendance" element={<ManageAttendance />} />
        <Route index element={<ManageStudents />} />
      </Routes>
    </div>
  )
}
