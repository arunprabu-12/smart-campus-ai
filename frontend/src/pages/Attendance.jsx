import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { StatCard } from '../components/ui/StatCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

const STATUS_VARIANTS = {
  Present: 'success',
  Absent: 'danger',
  Late: 'warning',
  OD: 'info',
}

function AttendancePieChart({ percentage }) {
  const r = 36
  const circumference = 2 * Math.PI * r
  const filled = (percentage / 100) * circumference
  const color = percentage >= 75 ? '#16a34a' : percentage >= 60 ? '#d97706' : '#dc2626'

  return (
    <svg width="90" height="90" viewBox="0 0 90 90" className="shrink-0">
      <circle cx="45" cy="45" r={r} fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="8" />
      <circle
        cx="45" cy="45" r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="45" y="45" textAnchor="middle" dominantBaseline="middle"
        className="font-bold text-xs" fill={color}>
        {percentage.toFixed(0)}%
      </text>
    </svg>
  )
}

function CourseAttendanceCard({ course, onClick, selected }) {
  const risk = course.at_risk
  return (
    <Card
      onClick={() => onClick(course)}
      p="p-5"
      className={`cursor-pointer transition-all flex items-center gap-4 ${
        selected ? 'ring-2 ring-blue-600 dark:ring-blue-400 bg-blue-50/20 dark:bg-blue-950/20' : 'hover:shadow-md'
      }`}
    >
      <AttendancePieChart percentage={course.percentage} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-slate-900 dark:text-white text-base truncate">
          {course.course_name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
          {course.course_code}
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✅ {course.present} Present</span>
          <span className="text-red-600 dark:text-red-400 font-semibold">❌ {course.absent} Absent</span>
          <span className="text-slate-500 dark:text-slate-400">📊 {course.total} Total</span>
        </div>
        {risk && (
          <div className="mt-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-2 text-xs text-red-700 dark:text-red-300 font-medium">
            ⚠️ At Risk — Need {course.required_classes_to_clear} more classes to clear 75%
          </div>
        )}
      </div>
    </Card>
  )
}

export default function Attendance() {
  const { student } = useAuth()
  const [report, setReport] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseDetail, setCourseDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [aiAlert, setAiAlert] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [])

  async function fetchReport() {
    try {
      setLoading(true)
      const res = await api.get('/attendance/report')
      setReport(res.data)
      if (res.data.overall_at_risk) {
        setAiAlert('⚠️ Attendance below 75% in one or more courses. Please attend all remaining classes.')
      }
    } catch (e) {
      setError('Could not load attendance data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCourseClick(course) {
    setSelectedCourse(course)
    try {
      const res = await api.get(`/attendance/course/${course.course_id}`)
      setCourseDetail(res.data)
    } catch (e) {
      setCourseDetail(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Tracker"
        description="Real-time attendance monitoring, course breakdown, and compliance alerts."
      />

      {/* AI Alert Banner */}
      {aiAlert && (
        <Card p="p-4" className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span>{aiAlert}</span>
          </div>
          <button onClick={() => setAiAlert(null)} className="text-red-500 hover:text-red-700 font-bold text-lg">
            ×
          </button>
        </Card>
      )}

      {error && (
        <Card p="p-4" className="bg-red-50 dark:bg-red-950/20 border-red-200 text-red-700 dark:text-red-400">
          {error}
        </Card>
      )}

      {report && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total Courses" value={report.courses.length} icon="📚" accentColor="text-blue-600" />
            <StatCard label="At Risk Courses" value={report.courses.filter(c => c.at_risk).length} icon="⚠️" accentColor="text-red-600" />
            <StatCard label="Min. Requirement" value={`${report.minimum_threshold}%`} icon="🎯" accentColor="text-emerald-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">Course-wise Attendance</h3>
              {report.courses.length === 0 ? (
                <EmptyState title="No Attendance Records" description="No attendance records available for this semester." />
              ) : (
                report.courses.map(course => (
                  <CourseAttendanceCard
                    key={course.course_id}
                    course={course}
                    onClick={handleCourseClick}
                    selected={selectedCourse?.course_id === course.course_id}
                  />
                ))
              )}
            </div>

            {/* Course Detail Panel */}
            {selectedCourse && courseDetail ? (
              <Card p="p-6" className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedCourse.course_name}</h3>
                  <button
                    onClick={() => { setSelectedCourse(null); setCourseDetail(null) }}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Total', value: courseDetail.stats.total, color: 'text-blue-600' },
                    { label: 'Present', value: courseDetail.stats.present, color: 'text-emerald-600' },
                    { label: 'Absent', value: courseDetail.stats.absent, color: 'text-red-600' },
                    { label: '%', value: `${courseDetail.stats.percentage}%`, color: courseDetail.stats.percentage >= 75 ? 'text-emerald-600' : 'text-red-600' },
                  ].map(s => (
                    <div key={s.label} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Recent Session Records</h4>
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                    {courseDetail.records.length === 0 ? (
                      <p className="text-xs text-slate-500">No records found.</p>
                    ) : (
                      courseDetail.records.slice(0, 30).map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{r.date}</p>
                            <p className="text-[11px] text-slate-500">{r.session} session</p>
                          </div>
                          <Badge variant={STATUS_VARIANTS[r.status] || 'neutral'}>
                            {r.status}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <EmptyState icon="👆" title="Select a Course" description="Click on any course on the left to view detailed attendance session logs." />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
