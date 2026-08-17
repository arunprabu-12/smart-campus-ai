/** Spec section 1 — student profile page with all fields + progress. */
import { useEffect, useState } from 'react'
import { getProfile, getDashboard } from '../api/students'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'

export default function Profile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sgpaInputs, setSgpaInputs] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem('student_notifications') || '[]')
  })

  useEffect(() => {
    Promise.all([getProfile(), getDashboard()])
      .then(([pRes, dRes]) => {
        setProfile(pRes.data)
        setDashboard(dRes.data)
        
        // Populate existing SGPAs
        const initialSgpas = {}
        dRes.data.semester_statuses?.forEach(s => {
          if (s.status === 'completed' && s.sgpa) {
            initialSgpas[s.number] = s.sgpa
          }
        })
        setSgpaInputs(initialSgpas)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
      
    const handleStorage = () => setNotifications(JSON.parse(localStorage.getItem('student_notifications') || '[]'))
    window.addEventListener('storage', handleStorage)
    window.addEventListener('new_notification', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('new_notification', handleStorage)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSgpaChange = (sem, val) => {
    setSgpaInputs(prev => ({ ...prev, [sem]: parseFloat(val) || 0 }))
  }

  const handleUpdateCGPA = async () => {
    setIsUpdating(true)
    try {
      const res = await api.post('/students/me/update-cgpa', { sgpas: sgpaInputs })
      setProfile(prev => ({ ...prev, cgpa: res.data.new_cgpa }))
      alert('CGPA and Semester SGPAs successfully updated across the platform! 🎉')
      // Refresh dashboard to reflect in graphs
      const dRes = await getDashboard()
      setDashboard(dRes.data)
    } catch (e) {
      alert('Failed to update CGPA')
    }
    setIsUpdating(false)
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  return (
    <div className="flex justify-center w-full pb-8">
      <div className="w-full max-w-2xl space-y-6 px-4 md:px-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h2>

      {/* Avatar + name */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0">
          {profile?.full_name?.charAt(0) || '?'}
        </div>
        <div>
          <h3 className="text-xl font-bold">{profile?.full_name}</h3>
          <p className="text-blue-200 text-sm">{profile?.college_email}</p>
          <p className="text-blue-200 text-sm font-mono">{profile?.register_number}</p>
        </div>
      </div>

      {/* Details grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Academic Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Department ID', value: profile?.department_id },
            { label: 'Regulation ID', value: profile?.regulation_id },
            { label: 'Current Semester', value: profile?.current_semester },
            { label: 'Section', value: profile?.section || '—' },
            { label: 'Admission Year', value: profile?.admission_year || '—' },
            { label: 'Career Interest', value: profile?.career_interest || '—' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CGPA + Progress */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">CGPA</p>
            <p className="text-3xl font-bold text-blue-600">{profile?.cgpa?.toFixed(2)}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Overall Progress: <strong>{dashboard?.overall_progress_pct}%</strong>
            </p>
            <ProgressBar percent={dashboard?.overall_progress_pct || 0} />
          </div>
        </div>
      </div>

      {/* AI CGPA Calculator & Updater */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-purple-100 dark:border-purple-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>✨</span> AI CGPA Calculator & Updater
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Input your SGPA for completed semesters. The AI will recalculate your overall CGPA and reflect it globally across your Dashboard timeline and charts!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
            const isLocked = dashboard?.semester_statuses?.find(s => s.number === sem)?.status === 'locked'
            const isInProgress = dashboard?.semester_statuses?.find(s => s.number === sem)?.status === 'in_progress'
            
            return (
              <div key={sem} className={`p-3 rounded-xl border ${isLocked ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}`}>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                  Sem {sem} {isInProgress ? '(Current)' : ''}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  disabled={isLocked || isInProgress}
                  value={sgpaInputs[sem] || ''}
                  onChange={(e) => handleSgpaChange(sem, e.target.value)}
                  placeholder="e.g. 8.5"
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
            )
          })}
        </div>

        <button
          onClick={handleUpdateCGPA}
          disabled={isUpdating}
          className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
        >
          {isUpdating ? 'Updating Platform...' : 'Save & Update CGPA Globally'}
        </button>
      </div>

      {/* Notifications Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🔔</span> Recent Notifications
          </h3>
          {notifications.length > 0 && (
            <button 
              onClick={() => { localStorage.removeItem('student_notifications'); setNotifications([]); window.dispatchEvent(new Event('new_notification')); }}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent notifications.</p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {notifications.map((n, i) => {
              const lowerText = n.text.toLowerCase();
              const path = lowerText.includes('test') ? '/tests' 
                         : lowerText.includes('assignment') ? '/assignments' 
                         : lowerText.includes('study plan') ? '/study-plan' 
                         : null;
              return (
                <button 
                  key={i} 
                  onClick={() => path && navigate(path)}
                  className={`w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 transition ${path ? 'hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer' : 'cursor-default'}`}
                >
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{n.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>💬</span> Send Feedback to Staff
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Have a suggestion, found a bug, or need help? Send a message directly to the admin/staff team.
        </p>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const msg = fd.get('feedback');
          if (!msg.trim()) return;
          const stored = JSON.parse(localStorage.getItem('admin_feedbacks') || '[]');
          stored.push({ text: msg, date: new Date().toISOString(), studentName: profile?.full_name || 'Student' });
          localStorage.setItem('admin_feedbacks', JSON.stringify(stored));
          alert('Feedback sent successfully to staff!');
          e.target.reset();
        }}>
          <textarea 
            name="feedback"
            rows="3"
            placeholder="Type your feedback here..."
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 mb-3"
            required
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Send Feedback
          </button>
        </form>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        id="logout-btn"
        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
      >
        Sign Out
      </button>
      </div>
    </div>
  )
}
