import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { useTheme } from '../context/ThemeContext'

export default function AdminSidebar({ isOpen, onClose }) {
  const { admin, logout } = useAdminAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [aiExpanded, setAiExpanded] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const basePath = admin?.role === 'admin' ? '/admin' : '/staff'
  const isHOD = admin?.role === 'admin' || admin?.role === 'HOD'
  const isAdmin = admin?.role === 'admin'

  const mainLinks = [
    { to: `${basePath}`, label: 'Dashboard', icon: '🏠', end: true },
    { to: `${basePath}/students`, label: 'Students', icon: '👨‍🎓' },
    ...(isAdmin ? [{ to: `${basePath}/faculty`, label: 'Faculty', icon: '👨‍🏫' }] : []),
    { to: `${basePath}/courses`, label: 'Courses', icon: '📚' },
    { to: `${basePath}/assignments`, label: 'Assignments', icon: '📝' },
    { to: `${basePath}/tests`, label: 'Tests', icon: '🧪' },
    { to: `${basePath}/attendance`, label: 'Attendance', icon: '📊' },
    ...(isAdmin ? [{ to: `${basePath}/analytics`, label: 'Analytics', icon: '📈' }] : []),
    { to: `${basePath}/reports`, label: 'Reports', icon: '📑' },
  ]

  const aiSubLinks = [
    ...(isHOD ? [{ to: `${basePath}/ai/faculty-allocation`, label: 'Faculty Allocation' }] : []),
    { to: `${basePath}/ai/assignment-generator`, label: 'Assignment Generator' },
    { to: `${basePath}/ai/test-generator`, label: 'Test Generator' },
    ...(isHOD ? [{ to: `${basePath}/ai/academic-analyzer`, label: 'Academic Analyzer' }] : []),
  ]

  const bottomLinks = [
    { to: `${basePath}/announcements`, label: 'Announcements', icon: '📢' },
    { to: `${basePath}/feedback`, label: 'Feedback', icon: '💬' },
    { to: `${basePath}/profile`, label: 'Profile', icon: '👤' },
    ...(isAdmin ? [{ to: `${basePath}/settings`, label: 'Settings', icon: '⚙️' }] : []),
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                SMART ACADEMIA
              </h1>
              <span className="inline-block mt-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                {isAdmin ? 'ADMIN PORTAL' : 'STAFF PORTAL'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Admin Info */}
        {admin && (
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                {admin.full_name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{admin.full_name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{admin.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <span className="text-sm">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          {/* AI Assistant Sub-menu */}
          <div>
            <div className="flex items-center justify-between">
              <NavLink
                to={`${basePath}/ai`}
                end
                onClick={onClose}
                className={({ isActive }) =>
                  `flex-1 flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <span className="text-sm">🤖</span>
                AI Assistant
              </NavLink>
              <button
                onClick={() => setAiExpanded(!aiExpanded)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                {aiExpanded ? '▲' : '▼'}
              </button>
            </div>

            {aiExpanded && (
              <div className="ml-7 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 pl-2">
                {aiSubLinks.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                        isActive
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {bottomLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <span className="text-sm">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Theme Toggle / Logout */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>Theme Mode</span>
            <span>{dark ? '🌙 Dark' : '☀️ Light'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
