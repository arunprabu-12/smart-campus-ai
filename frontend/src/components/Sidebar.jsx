/** Spec section 19 — sidebar navigation with auth-aware links + logout. */
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/assignments', label: 'Assignments', icon: '📋' },
  { to: '/tests', label: 'Tests', icon: '🧪' },
  { to: '/results', label: 'Results', icon: '📊' },
  { to: '/calendar', label: 'Calendar', icon: '📆' },
  { to: '/study-plan', label: 'Study Plan', icon: '📅' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
  { to: '/advisor', label: 'AI Advisor', icon: '🤖' },
  { to: '/agents', label: 'AI Agents Hub', icon: '✨' },
  { to: '/simulator', label: 'Simulator', icon: '⚙️' },
  { to: '/journey', label: 'Academic Journey', icon: '🎓' },
  // Profile is NOT here — access only via TopNav avatar icon
]

export default function Sidebar() {
  const { student, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">AI Academic</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Platform</p>
          </div>
        </div>
      </div>

      {/* Student mini-profile */}
      {student && (
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {student.full_name?.charAt(0) || '?'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{student.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sem {student.current_semester} · CGPA {student.cgpa?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}

        {/* Admin link — only shown to admin users, not in general nav */}
        {/* Admin access: navigate to /admin directly — secret */}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
