/** Spec section 2 — main student dashboard with real API data. */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import ProgressBar from '../components/ProgressBar'
import SemesterTimeline from '../components/SemesterTimeline'
import CourseCard from '../components/CourseCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDashboard()
        setDashboard(res.data)
        // Fetch courses for the current semester
        const semesterStatus = res.data.semester_statuses?.find(
          (s) => s.status === 'in_progress'
        )
        if (semesterStatus?.semester_id) {
          const courseRes = await getCoursesForSemester(semesterStatus.semester_id)
          setCourses(courseRes.data)
        }
      } catch (err) {
        setError('Failed to load dashboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-400 text-sm">
        {error}
      </div>
    )
  }

  const currentProgress = dashboard?.current_semester_progress || {}
  const semesters = dashboard?.semester_statuses || []
  
  // Data for SGPA trend line chart
  const sgpaData = semesters.filter(s => s.sgpa != null).map(s => ({
    name: `Sem ${s.number}`,
    sgpa: s.sgpa
  }))

  // Data for current progress pie chart
  const progressPieData = [
    { name: 'Completed', value: currentProgress.overall_pct || 0 },
    { name: 'Remaining', value: 100 - (currentProgress.overall_pct || 0) }
  ]
  const COLORS = ['#3b82f6', '#1e293b']

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="text-2xl font-bold">Welcome back, {dashboard?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-blue-100 text-sm mt-1">
          Department ID: {dashboard?.department_id} · Regulation ID: {dashboard?.regulation_id} · Semester: {dashboard?.current_semester}
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div>
            <p className="text-blue-200 text-xs">CGPA</p>
            <p className="text-3xl font-bold">{dashboard?.cgpa?.toFixed(2)}</p>
          </div>
          <div className="flex-1">
            <p className="text-blue-200 text-xs mb-1">Overall Progress ({dashboard?.overall_progress_pct}%)</p>
            <div className="w-full bg-blue-500/40 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${dashboard?.overall_progress_pct || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Progress Donut */}
        {currentProgress.overall_pct !== undefined && (
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Semester {dashboard?.current_semester} Completion</h3>
            <div className="flex items-center justify-between">
              <div className="w-1/2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={progressPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                      {progressPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 grid grid-cols-2 gap-3 text-center">
                {[
                  { label: 'Topics', value: currentProgress.topics_completed, total: currentProgress.total_topics },
                  { label: 'Tasks', value: currentProgress.assignments_completed, total: currentProgress.total_assignments },
                  { label: 'Tests', value: currentProgress.tests_attempted, total: currentProgress.total_tests },
                  { label: 'Courses', value: currentProgress.courses_completed, total: currentProgress.total_courses },
                ].map((item) => (
                  <div key={item.label} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700">
                    <p className="text-xl font-bold text-blue-600">{item.value ?? '0'}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SGPA Trend Line Chart */}
        {sgpaData.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">SGPA Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sgpaData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                  <Line type="monotone" dataKey="sgpa" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Current semester courses */}
      {courses.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Current Semester Courses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semester timeline */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Academic Progress</h3>
        <SemesterTimeline semesters={semesters} />
      </div>
    </div>
  )
}
