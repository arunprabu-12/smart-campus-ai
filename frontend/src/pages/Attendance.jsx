/**
 * Attendance page — shows calendar view, per-course stats, AI alerts.
 * Connects to /attendance/report and /attendance/course/:id
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

const STATUS_COLORS = {
  Present: '#22c55e',
  Absent: '#ef4444',
  Late: '#f59e0b',
  OD: '#8b5cf6',
}

const STATUS_LABELS = {
  Present: '✅ Present',
  Absent: '❌ Absent',
  Late: '⏰ Late',
  OD: '🏅 OD',
}

function AttendancePieChart({ percentage }) {
  const r = 42
  const circumference = 2 * Math.PI * r
  const filled = (percentage / 100) * circumference
  const color = percentage >= 75 ? '#22c55e' : percentage >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="55" y="55" textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize="14" fontWeight="bold">
        {percentage.toFixed(0)}%
      </text>
    </svg>
  )
}

function CourseAttendanceCard({ course, onClick, selected }) {
  const risk = course.at_risk
  return (
    <div
      onClick={() => onClick(course)}
      style={{
        background: selected
          ? 'linear-gradient(135deg, #1e40af22 0%, #7c3aed22 100%)'
          : 'rgba(15,23,42,0.6)',
        border: `1.5px solid ${selected ? '#6366f1' : risk ? '#ef444444' : '#1e293b'}`,
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <AttendancePieChart percentage={course.percentage} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#f1f5f9' }}>
          {course.course_name}
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
          {course.course_code}
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '12px' }}>
          <span style={{ color: '#22c55e' }}>✅ {course.present} Present</span>
          <span style={{ color: '#ef4444' }}>❌ {course.absent} Absent</span>
          <span style={{ color: '#94a3b8' }}>📊 {course.total} Total</span>
        </div>
        {risk && (
          <div style={{
            marginTop: '8px',
            background: '#ef44441a',
            border: '1px solid #ef444444',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12px',
            color: '#fca5a5',
          }}>
            ⚠️ At Risk — Need {course.required_classes_to_clear} more classes to clear 75%
          </div>
        )}
      </div>
    </div>
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
      // Show AI alert if overall at risk
      if (res.data.overall_at_risk) {
        setAiAlert('⚠️ Your attendance is below 75% in one or more courses. ' +
          'Please attend all remaining classes to avoid being barred from exams.')
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

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    padding: '32px',
    fontFamily: "'Inter', sans-serif",
    color: '#f1f5f9',
  }

  if (loading) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px', height: '50px', borderRadius: '50%',
            border: '3px solid #6366f1', borderTopColor: 'transparent',
            animation: 'spin 1s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#94a3b8' }}>Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'fadeIn 0.5s ease' }}>
        <h1 style={{
          fontSize: '28px', fontWeight: 800,
          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>
          📅 Attendance Tracker
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Powered by Qwen3-8B AI — Real-time attendance monitoring & alerts
        </p>
      </div>

      {/* AI Alert Banner */}
      {aiAlert && (
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d44, #991b1b44)',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          padding: '16px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.5s ease',
        }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div>
            <div style={{ fontWeight: 600, color: '#fca5a5', marginBottom: '4px' }}>
              AI Attendance Alert
            </div>
            <div style={{ color: '#fca5a5', fontSize: '14px' }}>{aiAlert}</div>
          </div>
          <button
            onClick={() => setAiAlert(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
          >×</button>
        </div>
      )}

      {error && (
        <div style={{
          background: '#ef44441a', border: '1px solid #ef4444',
          borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#fca5a5'
        }}>
          {error}
        </div>
      )}

      {report && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedCourse ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* Course List */}
          <div>
            {/* Summary stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px'
            }}>
              {[
                { label: 'Total Courses', value: report.courses.length, color: '#818cf8' },
                { label: 'At Risk', value: report.courses.filter(c => c.at_risk).length, color: '#ef4444' },
                { label: 'Threshold', value: `${report.minimum_threshold}%`, color: '#22c55e' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'rgba(15,23,42,0.6)',
                  border: '1px solid #1e293b',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {report.courses.length === 0 ? (
                <div style={{
                  background: 'rgba(15,23,42,0.6)', border: '1px solid #1e293b',
                  borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748b',
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
                  <p>No attendance records yet. Attendance will appear once your college syncs data.</p>
                </div>
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
          </div>

          {/* Course Detail Panel */}
          {selectedCourse && courseDetail && (
            <div style={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(12px)',
              animation: 'fadeIn 0.3s ease',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, color: '#f1f5f9' }}>{selectedCourse.course_name}</h3>
                <button
                  onClick={() => { setSelectedCourse(null); setCourseDetail(null) }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}
                >×</button>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Total', value: courseDetail.stats.total, color: '#818cf8' },
                  { label: 'Present', value: courseDetail.stats.present, color: '#22c55e' },
                  { label: 'Absent', value: courseDetail.stats.absent, color: '#ef4444' },
                  { label: '%', value: `${courseDetail.stats.percentage}%`, color: courseDetail.stats.percentage >= 75 ? '#22c55e' : '#ef4444' },
                ].map(s => (
                  <div key={s.label} style={{
                    background: '#0f172a', borderRadius: '10px', padding: '10px 16px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
                Session Records
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {courseDetail.records.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '13px' }}>No records found.</p>
                ) : (
                  courseDetail.records.slice(0, 30).map(r => (
                    <div key={r.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: '#0f172a', borderRadius: '10px', padding: '10px 16px',
                      border: `1px solid ${STATUS_COLORS[r.status] || '#1e293b'}22`,
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', color: '#f1f5f9' }}>{r.date}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{r.session} session</div>
                      </div>
                      <span style={{
                        fontSize: '12px', fontWeight: 600,
                        color: STATUS_COLORS[r.status] || '#94a3b8',
                        background: `${STATUS_COLORS[r.status]}22` || '#1e293b',
                        padding: '4px 10px', borderRadius: '20px',
                      }}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
