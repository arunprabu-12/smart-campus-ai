import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function StaffProfile() {
  const { admin, api } = useAdminAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestLoading, setRequestLoading] = useState(false)

  useEffect(() => {
    // Fetch courses to simulate "Accessible courses" and for the dropdown
    api.get('/admin/courses')
      .then(res => setCourses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRequestCourse = (e) => {
    e.preventDefault()
    setRequestLoading(true)
    setTimeout(() => {
      alert("Course allocation request submitted to Admin successfully!")
      setRequestLoading(false)
      e.target.reset()
    }, 600)
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        description="View your staff details, accessible courses, and request course allocations." 
      />

      {/* Staff Details */}
      <Card p="p-6" className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white border-0 shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
            {admin?.full_name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{admin?.full_name}</h2>
            <p className="text-blue-100 text-sm">{admin?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Role: {admin?.role}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-white/20 px-2 py-0.5 rounded-full">
                Dept: {admin?.department || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accessible Courses */}
        <Card p="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
            <span>📚</span> Accessible Courses
          </h3>
          {loading ? (
            <p className="text-sm text-slate-500">Loading courses...</p>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map(c => (
                <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{c.course_name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{c.course_code} · {c.credits} Credits</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Accessible</span>
                </div>
              ))}
              {courses.length === 0 && (
                <p className="text-sm text-slate-500">No courses available.</p>
              )}
            </div>
          )}
        </Card>

        {/* Request Course Allocation */}
        <Card p="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-2 flex items-center gap-2">
            <span>📝</span> Request Course Allocation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Submit a request to the Head of Department or Admin to be allocated to a specific course for the upcoming semester.
          </p>
          <form onSubmit={handleRequestCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Select Course to Request</label>
              <Select name="courseId" required>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.course_code} - {c.course_name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Reason for Request</label>
              <textarea 
                name="reason"
                rows="3"
                placeholder="Mention your expertise or preference..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={requestLoading}>
              {requestLoading ? 'Submitting Request...' : 'Send Allocation Request'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
