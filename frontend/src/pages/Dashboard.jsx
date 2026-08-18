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

      {/* Hero Welcome Card – light theme */}
      <Card p="p-5" className="bg-blue-50 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full mb-2">
              Current Academic Status
            </span>
            <h2 className="text-xl font-bold text-slate-900">Overall Progress: {dashboard?.overall_progress_pct}%</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Department · Regulation {dashboard?.regulation_id}
            </p>
          </div>
          <div className="w-full sm:w-56">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Completion</span>
              <span className="text-sm font-bold text-blue-600">{dashboard?.overall_progress_pct || 0}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester Progress Donut */}
        {currentProgress.overall_pct !== undefined && (
          <Card p="p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
              Sem {dashboard?.current_semester} Completion
            </h3>
            <div className="flex flex-col items-center">
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={progressPieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} dataKey="value" stroke="none">
                      {progressPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {[
                  { label: 'Topics', value: currentProgress.topics_completed },
                  { label: 'Tasks', value: currentProgress.assignments_completed },
                  { label: 'Tests', value: currentProgress.tests_attempted },
                  { label: 'Courses', value: currentProgress.courses_completed },
                ].map((item) => (
                  <div key={item.label} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                    <p className="text-base font-bold text-blue-600 dark:text-blue-400">{item.value ?? '0'}</p>
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
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">SGPA Performance Trend</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sgpaData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="sgpa" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Attendance Donut – new chart */}
        <Card p="p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Attendance Overview</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Present', value: Math.round((currentProgress.overall_pct || 87)) },
                    { name: 'Absent', value: 100 - Math.round((currentProgress.overall_pct || 87)) }
                  ]}
                  cx="50%" cy="50%" innerRadius={40} outerRadius={58} dataKey="value" stroke="none"
                >
                  <Cell fill="#16a34a" />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <p className="text-base font-bold text-emerald-600">{Math.round((currentProgress.overall_pct || 87))}%</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Present</p>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-center">
              <p className="text-base font-bold text-red-500">{100 - Math.round((currentProgress.overall_pct || 87))}%</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Absent</p>
            </div>
          </div>
        </Card>
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
