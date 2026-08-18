import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import SemesterTimeline from '../components/SemesterTimeline'
import CourseCard from '../components/CourseCard'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts'

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
      <Card p="p-6" className="bg-red-50 dark:bg-red-950/20 border-red-200 text-red-700 dark:text-red-400">
        {error}
      </Card>
    )
  }

  const currentProgress = dashboard?.current_semester_progress || {}
  const semesters = dashboard?.semester_statuses || []
  
  const sgpaData = semesters.filter(s => s.sgpa != null).map(s => ({
    name: `Sem ${s.number}`,
    sgpa: s.sgpa
  }))

  const progressPieData = [
    { name: 'Completed', value: currentProgress.overall_pct || 0 },
    { name: 'Remaining', value: 100 - (currentProgress.overall_pct || 0) }
  ]
  const COLORS = ['#2563eb', '#cbd5e1']

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${dashboard?.name?.split(' ')[0] || 'Student'}! 👋`}
        description={`Semester ${dashboard?.current_semester} · CGPA ${dashboard?.cgpa?.toFixed(2)}`}
      />

      {/* Hero Welcome Card */}
      <Card p="p-6" className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-0 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-100 bg-white/20 px-3 py-1 rounded-full">
              Current Academic Status
            </span>
            <h2 className="text-2xl font-bold mt-2">Overall Progress: {dashboard?.overall_progress_pct}%</h2>
            <p className="text-xs text-blue-100 mt-1">
              Department ID: {dashboard?.department_id} · Regulation ID: {dashboard?.regulation_id}
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <div className="w-full bg-black/20 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all shadow-sm"
                style={{ width: `${dashboard?.overall_progress_pct || 0}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CGPA" value={dashboard?.cgpa?.toFixed(2) || '0.00'} icon="🎓" accentColor="text-blue-600" />
        <StatCard label="Current Semester" value={`Sem ${dashboard?.current_semester || 1}`} icon="📅" accentColor="text-indigo-600" />
        <StatCard label="Active Courses" value={courses.length} icon="📚" accentColor="text-emerald-600" />
        <StatCard label="Progress" value={`${currentProgress.overall_pct || 0}%`} icon="⚡" accentColor="text-amber-600" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Progress */}
        {currentProgress.overall_pct !== undefined && (
          <Card p="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">
              Semester {dashboard?.current_semester} Completion Breakdown
            </h3>
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
                  <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{item.value ?? '0'}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* SGPA Trend */}
        {sgpaData.length > 0 && (
          <Card p="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">SGPA Performance Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sgpaData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                  <Line type="monotone" dataKey="sgpa" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Course Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboard?.course_assignment_stats && dashboard.course_assignment_stats.length > 0 && (
          <Card p="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">Assignment Submissions by Course</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.course_assignment_stats} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="course_name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="submitted" name="Submitted" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="total" name="Total Assigned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {dashboard?.course_test_stats && dashboard.course_test_stats.length > 0 && (
          <Card p="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">Average Test Performance (%)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.course_test_stats} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="course_name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#f1f5f9' }} />
                  <Bar dataKey="avg_score" name="Average Score" fill="#16a34a" radius={[4, 4, 0, 0]}>
                    {dashboard.course_test_stats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.avg_score >= 75 ? '#16a34a' : '#d97706'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Courses Grid */}
      {courses.length > 0 && (
        <Card p="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">
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
        </Card>
      )}

      {/* Semester timeline */}
      <Card p="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-4">Academic Progression Timeline</h3>
        <SemesterTimeline semesters={semesters} />
      </Card>
    </div>
  )
}
