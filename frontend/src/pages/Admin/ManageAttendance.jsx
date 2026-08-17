/**
 * ManageAttendance — Admin view of attendance across all students/courses.
 * Allows bulk marking and viewing attendance statistics.
 */
import { useState, useEffect } from 'react'
import api from '../../api/client'
import { adminGetCourses } from '../../api/admin'

export default function ManageAttendance() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [courseId, setCourseId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [session, setSession] = useState('FN')
  const [status, setStatus] = useState('Present')
  const [remarks, setRemarks] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const [courses, setCourses] = useState([])

  useEffect(() => {
    api.get('/admin/students').then(r => setStudents(r.data)).catch(() => {})
    adminGetCourses().then(r => setCourses(r.data)).catch(() => {})
  }, [])

  async function markAttendance() {
    if (!selectedStudent || !courseId || !date) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' })
      return
    }
    setLoading(true)
    try {
      await api.post(`/attendance/admin/mark-bulk?student_id=${selectedStudent.id}`, {
        records: [{ course_id: parseInt(courseId), date, status, session, remarks }]
      })
      setMessage({ type: 'success', text: `✅ Attendance marked as ${status} for ${selectedStudent.full_name}` })
    } catch (e) {
      setMessage({ type: 'error', text: e.response?.data?.detail || 'Failed to mark attendance.' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid #1e293b', background: '#0f172a',
    color: '#f1f5f9', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: '12px', color: '#64748b', fontWeight: 600,
    marginBottom: '6px', display: 'block', letterSpacing: '0.5px',
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', marginBottom: '24px' }}>
        📅 Manage Attendance
      </h2>

      {/* College App Integration Info */}
      <div style={{
        background: 'linear-gradient(135deg, #06b6d422, #0891b222)',
        border: '1px solid #06b6d444',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
      }}>
        <div style={{ fontWeight: 700, color: '#67e8f9', marginBottom: '8px', fontSize: '14px' }}>
          🔗 College App Auto-Sync Endpoint
        </div>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
          Your college ERP can automatically push attendance data to:
          <br />
          <code style={{
            background: '#0f172a', padding: '4px 10px', borderRadius: '6px',
            color: '#818cf8', fontSize: '12px', display: 'inline-block', marginTop: '6px',
          }}>
            POST /attendance/college-app/sync
          </code>
          <br />
          <span style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'block' }}>
            Requires header: <code style={{ color: '#a78bfa' }}>X-College-Secret: {'{'}COLLEGE_APP_SECRET{'}'}</code>
          </span>
        </p>
      </div>

      {/* Manual marking form */}
      <div style={{
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        maxWidth: '600px',
      }}>
        <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '20px', fontSize: '15px' }}>
          ✏️ Manual Attendance Entry
        </h3>

        {message && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
            background: message.type === 'success' ? '#22c55e15' : '#ef444415',
            border: `1px solid ${message.type === 'success' ? '#22c55e44' : '#ef444444'}`,
            color: message.type === 'success' ? '#86efac' : '#fca5a5',
            fontSize: '13px',
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>STUDENT *</label>
            <select
              style={inputStyle}
              value={selectedStudent?.id || ''}
              onChange={e => setSelectedStudent(students.find(s => s.id === parseInt(e.target.value)))}
            >
              <option value="">Select student...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.full_name} ({s.register_number})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>COURSE *</label>
            <select
              style={inputStyle}
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
            >
              <option value="">Select course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>[{c.course_code}] {c.course_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>DATE *</label>
            <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>SESSION</label>
            <select style={inputStyle} value={session} onChange={e => setSession(e.target.value)}>
              <option value="FN">FN (Forenoon)</option>
              <option value="AN">AN (Afternoon)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>STATUS</label>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
              {['Present', 'Absent', 'Late', 'OD'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>REMARKS (optional)</label>
            <input
              style={inputStyle}
              placeholder="e.g. Medical leave"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={markAttendance}
          disabled={loading}
          style={{
            marginTop: '20px',
            padding: '12px 28px',
            borderRadius: '12px',
            border: 'none',
            background: loading
              ? '#334155'
              : 'linear-gradient(135deg, #6366f1, #a78bfa)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? '⏳ Saving...' : '✅ Mark Attendance'}
        </button>
      </div>
    </div>
  )
}
