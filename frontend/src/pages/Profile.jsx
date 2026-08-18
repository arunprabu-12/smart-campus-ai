import { useEffect, useState } from 'react'
import { getProfile, getDashboard } from '../api/students'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'

export default function Profile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sgpaInputs, setSgpaInputs] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [myFeedbacks, setMyFeedbacks] = useState([])

  useEffect(() => {
    Promise.all([getProfile(), getDashboard()])
      .then(([pRes, dRes]) => {
        setProfile(pRes.data)
        setDashboard(dRes.data)
        
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
      
    loadMyFeedbacks()
  }, [])

  const loadMyFeedbacks = async () => {
    try {
      const res = await api.get('/students/me/feedbacks')
      setMyFeedbacks(res.data)
    } catch (e) {}
  }

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
      const dRes = await getDashboard()
      setDashboard(dRes.data)
    } catch (e) {
      alert('Failed to update CGPA')
    }
    setIsUpdating(false)
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile & Settings"
        description="Manage your account, view academic progress, and send feedback."
      />

      {/* Avatar Header */}
      <Card p="p-6" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-0 shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
            <p className="text-blue-100 text-sm">{profile?.college_email}</p>
            <p className="text-blue-100 text-xs font-mono mt-0.5">Register No: {profile?.register_number}</p>
          </div>
        </div>
      </Card>

      {/* Academic Details */}
      <Card p="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">Academic Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Department ID', value: profile?.department_id },
            { label: 'Regulation ID', value: profile?.regulation_id },
            { label: 'Current Semester', value: `Sem ${profile?.current_semester}` },
            { label: 'Section', value: profile?.section || '—' },
            { label: 'Admission Year', value: profile?.admission_year || '—' },
            { label: 'Career Interest', value: profile?.career_interest || '—' },
          ].map((item) => (
            <div key={item.label} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* CGPA + Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard label="Cumulative CGPA" value={profile?.cgpa?.toFixed(2) || '0.00'} icon="⭐" accentColor="text-amber-500" />
        <Card p="p-5" className="flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Completion</span>
            <span className="text-sm font-bold text-blue-600">{dashboard?.overall_progress_pct}%</span>
          </div>
          <ProgressBar percent={dashboard?.overall_progress_pct || 0} />
        </Card>
      </div>

      {/* AI CGPA Calculator */}
      <Card p="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
          <span>✨</span> AI SGPA & CGPA Updater
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Input your SGPA for completed semesters to recalculate overall CGPA globally across your platform.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
            const isLocked = dashboard?.semester_statuses?.find(s => s.number === sem)?.status === 'locked'
            const isInProgress = dashboard?.semester_statuses?.find(s => s.number === sem)?.status === 'in_progress'
            
            return (
              <div key={sem} className={`p-3 rounded-xl border ${isLocked ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-50' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
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
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            )
          })}
        </div>

        <Button
          variant="primary"
          onClick={handleUpdateCGPA}
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? 'Updating Platform...' : 'Save & Update CGPA Globally'}
        </Button>
      </Card>

      {/* Official Department Feedback */}
      <Card p="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
          <span>💬</span> Official Department Feedback
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Submit formal feedback to your department Head (HOD), Staff, or Admin.
        </p>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.target);
          const msg = fd.get('message');
          const to = fd.get('to');
          if (!msg.trim()) return;
          try {
            await api.post('/students/me/feedbacks', { to, message: msg });
            alert('Official feedback submitted successfully!');
            e.target.reset();
            loadMyFeedbacks();
          } catch (err) {
            alert('Failed to submit feedback');
          }
        }} className="space-y-3">
          <Select name="to" required>
            <option value="Admin">Admin</option>
            <option value="HOD">HOD (Head of Department)</option>
            <option value="Department Staff">Department Staff</option>
          </Select>
          <textarea 
            name="message"
            rows="3"
            placeholder="Describe your issue, request, or suggestion..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
          <Button type="submit" variant="primary">
            Submit Formal Feedback
          </Button>
        </form>
        
        {/* Sent Feedbacks & Replies */}
        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">My Feedback History</h4>
          {myFeedbacks.length === 0 ? (
            <p className="text-xs text-slate-500">No feedback submitted yet.</p>
          ) : (
            myFeedbacks.map((f, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">To: {f.to || 'Admin'}</span>
                  <span className="text-xs text-slate-400">{new Date(f.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200">{f.text}</p>
                {f.reply && (
                  <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <strong>Official Reply: </strong> {f.reply}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Logout */}
      <Button variant="danger" onClick={handleLogout} className="w-full">
        Sign Out
      </Button>
    </div>
  )
}
