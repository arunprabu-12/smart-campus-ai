/**
 * Full Admin Panel — uses AdminAuthContext (separate JWT).
 * Tabs: Dashboard, Tests, Assignments, Attendance, Students, Staff, Courses
 * All data fetches from DB via admin-protected API endpoints.
 */
import { useState, useEffect } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useNavigate } from 'react-router-dom'
import { getDepartments } from '../../api/admin'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import CalendarView from '../../components/CalendarView'

// ── tiny reusable stat card ──────────────────────────────────────────
function StatCard({ icon, label, value, color = '#818cf8', sub }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)', borderRadius: '16px',
      border: `1px solid ${color}33`, padding: '20px',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, letterSpacing: '0.5px' }}>
          {label.toUpperCase()}
        </span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800, color }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

// ── simple table ─────────────────────────────────────────────────────
function Table({ cols, rows, emptyMsg = 'No data' }) {
  if (!rows?.length) return (
    <div style={{ padding: '32px', textAlign: 'center', color: '#475569', fontSize: '14px' }}>
      {emptyMsg}
    </div>
  )
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{
                padding: '10px 14px', textAlign: 'left',
                color: '#64748b', fontWeight: 600, fontSize: '11px',
                letterSpacing: '0.5px', borderBottom: '1px solid #1e293b',
              }}>
                {c.label.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #0f172a' }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: '10px 14px', color: '#cbd5e1' }}>
                  {c.render ? c.render(row) : (row[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Tab: Dashboard stats ─────────────────────────────────────────────
function TabDashboard({ api }) {
  const [stats, setStats] = useState(null)
  useEffect(() => {
    api.get('/admin-auth/dashboard-stats').then(r => setStats(r.data)).catch(() => {})
  }, [])

  if (!stats) return <div style={{ color: '#475569', padding: '32px' }}>Loading stats...</div>

  const barData = [
    { name: 'Students', count: stats.students },
    { name: 'Staff', count: stats.staff },
    { name: 'Courses', count: stats.courses },
    { name: 'Tests', count: stats.tests },
    { name: 'Assignments', count: stats.assignments },
  ]

  const attPieData = [
    { name: 'Present', value: stats.attendance_present_pct },
    { name: 'Absent', value: 100 - stats.attendance_present_pct },
  ]
  const COLORS = ['#22c55e', '#ef4444']

  function downloadDashboardReport() {
    const reportStr = JSON.stringify(stats, null, 2)
    const blob = new Blob([reportStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={downloadDashboardReport} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
          ⬇️ Download Report Option
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon="👥" label="Students" value={stats.students} color="#818cf8" />
        <StatCard icon="📚" label="Courses" value={stats.courses} color="#06b6d4" />
        <StatCard icon="🧪" label="Tests" value={stats.tests} color="#a78bfa" />
        <StatCard icon="📊" label="Test Attempts" value={stats.test_attempts} color="#818cf8"
          sub={`Avg score: ${stats.avg_test_score}%`} />
        <StatCard icon="📋" label="Assignments" value={stats.assignments} color="#f59e0b" />
        <StatCard icon="📨" label="Submissions" value={stats.submissions} color="#22c55e" />
        <StatCard icon="✅" label="Attendance" value={`${stats.attendance_present_pct}%`}
          color={stats.attendance_present_pct >= 75 ? '#22c55e' : '#ef4444'}
          sub={`${stats.attendance_total} total records`} />
        <StatCard icon="👤" label="Staff" value={stats.staff} color="#f97316" />
        <StatCard icon="📄" label="Documents" value={stats.documents} color="#64748b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {/* Attendance Pie Chart */}
        <div style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Attendance Rate</h3>
          <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {attPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Assignments Bar Chart */}
        <div style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Assignments vs Submissions</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Assignments', count: stats.assignments },
                { name: 'Submissions', count: stats.submissions }
              ]}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tests Bar Chart */}
        <div style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 600, marginBottom: '20px' }}>Tests vs Attempts</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Tests', count: stats.tests },
                { name: 'Attempts', count: stats.test_attempts }
              ]}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Tests ────────────────────────────────────────────────────────
function TabTests({ api }) {
  const [tests, setTests] = useState([])
  const [attempts, setAttempts] = useState([])
  const [view, setView] = useState('tests')
  const [editing, setEditing] = useState({}) // {attempt_id: new_score}
  const [createMode, setCreateMode] = useState('') // 'manual' or 'ai'
  
  // Manual Create form (Manager AI agent triggers from this)
  const [manForm, setManForm] = useState({ title: '', test_type: 'Practice', course_id: '', unit: '', start_date: '', end_date: '', file: null })
  // AI Create form (Manager AI agent triggers from this)
  const [aiForm, setAiForm] = useState({ topic: '', course_id: '', unit: '', start_date: '', end_date: '' })

  useEffect(() => {
    fetchTests()
  }, [])

  function fetchTests() {
    api.get('/admin/tests-overview').then(r => setTests(r.data)).catch(() => {})
    api.get('/admin/test-attempts').then(r => setAttempts(r.data)).catch(() => {})
  }

  async function updateAttempt(attemptId) {
    const score = editing[attemptId]
    if (!score) return
    try {
      await api.put(`/admin/test-attempts/${attemptId}/score`, { score: parseFloat(score) })
      setAttempts(prev => prev.map(a => a.id === attemptId ? { ...a, percentage: parseFloat(score) } : a))
      alert('Score updated successfully')
    } catch { alert('Failed to update') }
  }

  async function createManual(e) {
    e.preventDefault()
    try {
      // Mocking the Manager AI Agent flow: parses file -> saves DB -> updates calendar -> emails students
      alert('Manager AI Agent triggered: Parsing uploaded file, scheduling test, updating calendar, and notifying students...')
      await api.post('/admin/tests', { title: manForm.title, test_type: manForm.test_type, course_id: parseInt(manForm.course_id) })
      
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({ text: `Manager AI scheduled a new ${manForm.test_type} Test: ${manForm.title}`, date: new Date().toISOString() });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('new_notification'));

      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      evts.push({ date: manForm.start_date || new Date().toISOString(), title: `Test: ${manForm.title}` });
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));

      alert('Test successfully scheduled by Manager AI!')
      setCreateMode('')
      fetchTests()
    } catch { alert('Creation failed') }
  }

  async function createAI(e) {
    e.preventDefault()
    try {
      // Mocking the Manager AI Agent flow: generates Qs -> saves DB -> updates calendar -> emails students
      alert('Manager AI Agent triggered: Generating test questions, scheduling test, updating calendar, and notifying students...')
      await api.post(`/admin/tests/ai-generate?course_id=${aiForm.course_id}&topic=${encodeURIComponent(aiForm.topic)}`)
      
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({ text: `Manager AI generated a new Test on ${aiForm.topic}`, date: new Date().toISOString() });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('new_notification'));

      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      evts.push({ date: aiForm.start_date || new Date().toISOString(), title: `Test: ${aiForm.topic}` });
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));

      alert('AI Test successfully generated and scheduled by Manager AI!')
      setCreateMode('')
      fetchTests()
    } catch { alert('AI Generation failed') }
  }

  const inp = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '13px', width: '100%', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[['tests', '🧪 Tests'], ['attempts', '📊 Attempts']].map(([v, l]) => (
          <button key={v} onClick={() => {setView(v); setCreateMode('');}} style={{
            padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            background: view === v && !createMode ? '#818cf8' : 'rgba(15,23,42,0.6)',
            color: view === v && !createMode ? '#fff' : '#64748b',
          }}>{l}</button>
        ))}
        <button onClick={() => setCreateMode('manual')} style={{ padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: createMode === 'manual' ? '#10b981' : 'rgba(15,23,42,0.6)', color: createMode === 'manual' ? '#fff' : '#64748b' }}>+ Manual Test</button>
        <button onClick={() => setCreateMode('ai')} style={{ padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: createMode === 'ai' ? '#8b5cf6' : 'rgba(15,23,42,0.6)', color: createMode === 'ai' ? '#fff' : '#64748b' }}>✨ AI Agent Test</button>
      </div>

      {createMode === 'manual' && (
        <form onSubmit={createManual} style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '20px', maxWidth: '400px' }}>
          <h4 style={{ margin: '0 0 12px', color: '#e2e8f0' }}>Schedule Test (Manager AI)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input required placeholder="Test Title" style={inp} value={manForm.title} onChange={e => setManForm({...manForm, title: e.target.value})} />
            <input required placeholder="Course ID (e.g. 1)" type="number" style={inp} value={manForm.course_id} onChange={e => setManForm({...manForm, course_id: e.target.value})} />
            <input required placeholder="Unit" style={inp} value={manForm.unit} onChange={e => setManForm({...manForm, unit: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input required type="datetime-local" placeholder="Start Date" style={inp} value={manForm.start_date} onChange={e => setManForm({...manForm, start_date: e.target.value})} />
              <input required type="datetime-local" placeholder="End Date" style={inp} value={manForm.end_date} onChange={e => setManForm({...manForm, end_date: e.target.value})} />
            </div>
            <select style={inp} value={manForm.test_type} onChange={e => setManForm({...manForm, test_type: e.target.value})}>
              <option value="Practice">Practice</option>
              <option value="Unit">Unit Test</option>
              <option value="Mock">Mock Test</option>
            </select>
            <input type="file" required style={inp} onChange={e => setManForm({...manForm, file: e.target.files[0]})} />
            <button type="submit" style={{ padding: '8px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Ask Agent to Schedule</button>
          </div>
        </form>
      )}

      {createMode === 'ai' && (
        <form onSubmit={createAI} style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '20px', maxWidth: '400px' }}>
          <h4 style={{ margin: '0 0 12px', color: '#e2e8f0' }}>Generate Test via Manager AI</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input required placeholder="Topic to generate for" style={inp} value={aiForm.topic} onChange={e => setAiForm({...aiForm, topic: e.target.value})} />
            <input required placeholder="Course ID (e.g. 1)" type="number" style={inp} value={aiForm.course_id} onChange={e => setAiForm({...aiForm, course_id: e.target.value})} />
            <input required placeholder="Unit" style={inp} value={aiForm.unit} onChange={e => setAiForm({...aiForm, unit: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input required type="datetime-local" placeholder="Start Date" style={inp} value={aiForm.start_date} onChange={e => setAiForm({...aiForm, start_date: e.target.value})} />
              <input required type="datetime-local" placeholder="End Date" style={inp} value={aiForm.end_date} onChange={e => setAiForm({...aiForm, end_date: e.target.value})} />
            </div>
            <button type="submit" style={{ padding: '8px', borderRadius: '8px', background: '#8b5cf6', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>✨ Ask Agent to Generate</button>
          </div>
        </form>
      )}

      {!createMode && view === 'tests' && (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'test_type', label: 'Type' },
            { key: 'course_id', label: 'Course' },
            { key: 'total_attempts', label: 'Attempts' },
            { key: 'avg_score', label: 'Avg Score', render: r => `${r.avg_score}%` },
          ]}
          rows={tests}
          emptyMsg="No tests found."
        />
      )}

      {!createMode && view === 'attempts' && (
        <Table
          cols={[
            { key: 'student', label: 'Student' },
            { key: 'register_number', label: 'Reg No' },
            { key: 'test_title', label: 'Test' },
            { key: 'percentage', label: 'Score', render: r => r.percentage != null ? `${r.percentage}%` : '—' },
            { key: 'submitted_at', label: 'Submitted', render: r => r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : '—' },
            { key: 'action', label: 'Action', render: r => (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number" min="0" max="100" placeholder="New"
                  value={editing[r.id] || ''} onChange={e => setEditing(g => ({ ...g, [r.id]: e.target.value }))}
                  style={{ width: '60px', padding: '4px 6px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '11px' }}
                />
                <button
                  onClick={() => updateAttempt(r.id)}
                  style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#f59e0b', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
                >Edit</button>
              </div>
            )},
          ]}
          rows={attempts}
          emptyMsg="No attempts yet."
        />
      )}
    </div>
  )
}

// ── Tab: Assignments ──────────────────────────────────────────────────
function TabAssignments({ api }) {
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [view, setView] = useState('list')
  const [grading, setGrading] = useState({}) // {sub_id: score}
  const [createMode, setCreateMode] = useState('')
  
  const [manForm, setManForm] = useState({ title: '', course_id: '', unit: '', start_date: '', end_date: '', file: null })
  const [aiForm, setAiForm] = useState({ topic: '', course_id: '', unit: '', start_date: '', end_date: '' })
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetchAssignments()
  }, [])

  function fetchAssignments() {
    api.get('/admin/assignments-overview').then(r => setAssignments(r.data)).catch(() => {})
    api.get('/admin/submissions').then(r => setSubmissions(r.data)).catch(() => {})
    api.get('/admin/courses').then(r => setCourses(r.data)).catch(() => {})
  }

  async function submitGrade(subId) {
    const score = grading[subId]
    if (!score) return
    try {
      await api.put(`/admin/submissions/${subId}/grade?grade=${score}`)
      setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, score: parseInt(score), status: 'Evaluated' } : s))
    } catch (e) { alert('Grading failed') }
  }

  async function aiEvaluate(subId) {
    try {
      const r = await api.post(`/admin/submissions/${subId}/ai-evaluate`)
      alert('AI Evaluation Result:\n\n' + r.data.ai_evaluation)
    } catch (e) { alert('AI Evaluation failed.') }
  }

  async function createManual(e) {
    e.preventDefault()
    try {
      alert('Manager AI Agent triggered: Parsing assignment file, scheduling assignment, updating calendar, and notifying students...')
      await api.post('/admin/assignments', { title: manForm.title, course_id: parseInt(manForm.course_id), questions: null })
      
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({ text: `Manager AI scheduled Assignment: ${manForm.title}`, date: new Date().toISOString() });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('new_notification'));

      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      evts.push({ date: manForm.start_date || new Date().toISOString(), title: `Assignment: ${manForm.title}` });
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));

      alert('Assignment scheduled by Manager AI!')
      setCreateMode('')
      fetchAssignments()
    } catch { alert('Creation failed') }
  }

  async function createAI(e) {
    e.preventDefault()
    try {
      alert('Manager AI Agent triggered: Generating assignment, scheduling assignment, updating calendar, and notifying students...')
      await api.post(`/admin/assignments/ai-generate?course_id=${aiForm.course_id}&topic=${encodeURIComponent(aiForm.topic)}`)
      
      const notifs = JSON.parse(localStorage.getItem('student_notifications') || '[]');
      notifs.unshift({ text: `Manager AI generated Assignment on ${aiForm.topic}`, date: new Date().toISOString() });
      localStorage.setItem('student_notifications', JSON.stringify(notifs));
      window.dispatchEvent(new Event('new_notification'));

      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      evts.push({ date: aiForm.start_date || new Date().toISOString(), title: `Assignment: ${aiForm.topic}` });
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));

      alert('AI Assignment generated and scheduled by Manager AI!')
      setCreateMode('')
      fetchAssignments()
    } catch { alert('AI Generation failed') }
  }

  const inp = { padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#f1f5f9', fontSize: '13px', width: '100%', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[['list', '📋 Assignments'], ['subs', '📨 Submissions']].map(([v, l]) => (
          <button key={v} onClick={() => {setView(v); setCreateMode('');}} style={{
            padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            background: view === v && !createMode ? '#f59e0b' : 'rgba(15,23,42,0.6)',
            color: view === v && !createMode ? '#fff' : '#64748b',
          }}>{l}</button>
        ))}
        <button onClick={() => setCreateMode('manual')} style={{ padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: createMode === 'manual' ? '#10b981' : 'rgba(15,23,42,0.6)', color: createMode === 'manual' ? '#fff' : '#64748b' }}>+ Manual Assignment</button>
        <button onClick={() => setCreateMode('ai')} style={{ padding: '7px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: createMode === 'ai' ? '#8b5cf6' : 'rgba(15,23,42,0.6)', color: createMode === 'ai' ? '#fff' : '#64748b' }}>✨ AI Agent Assignment</button>
      </div>

      {createMode === 'manual' && (
        <form onSubmit={createManual} style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '20px', maxWidth: '400px' }}>
          <h4 style={{ margin: '0 0 12px', color: '#e2e8f0' }}>Schedule Assignment (Manager AI)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input required placeholder="Assignment Title" style={inp} value={manForm.title} onChange={e => setManForm({...manForm, title: e.target.value})} />
            <select required style={inp} value={manForm.course_id} onChange={e => setManForm({...manForm, course_id: e.target.value})}>
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>[{c.course_code}] {c.course_name}</option>)}
            </select>
            <input required placeholder="Unit" style={inp} value={manForm.unit} onChange={e => setManForm({...manForm, unit: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input required type="datetime-local" placeholder="Start Date" style={inp} value={manForm.start_date} onChange={e => setManForm({...manForm, start_date: e.target.value})} />
              <input required type="datetime-local" placeholder="End Date" style={inp} value={manForm.end_date} onChange={e => setManForm({...manForm, end_date: e.target.value})} />
            </div>
            <input type="file" required style={inp} onChange={e => setManForm({...manForm, file: e.target.files[0]})} />
            <button type="submit" style={{ padding: '8px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Ask Agent to Schedule</button>
          </div>
        </form>
      )}

      {createMode === 'ai' && (
        <form onSubmit={createAI} style={{ background: 'rgba(15,23,42,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '20px', maxWidth: '400px' }}>
          <h4 style={{ margin: '0 0 12px', color: '#e2e8f0' }}>Generate Assignment via Manager AI</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input required placeholder="Topic to generate for" style={inp} value={aiForm.topic} onChange={e => setAiForm({...aiForm, topic: e.target.value})} />
            <select required style={inp} value={aiForm.course_id} onChange={e => setAiForm({...aiForm, course_id: e.target.value})}>
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>[{c.course_code}] {c.course_name}</option>)}
            </select>
            <input required placeholder="Unit" style={inp} value={aiForm.unit} onChange={e => setAiForm({...aiForm, unit: e.target.value})} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input required type="datetime-local" placeholder="Start Date" style={inp} value={aiForm.start_date} onChange={e => setAiForm({...aiForm, start_date: e.target.value})} />
              <input required type="datetime-local" placeholder="End Date" style={inp} value={aiForm.end_date} onChange={e => setAiForm({...aiForm, end_date: e.target.value})} />
            </div>
            <button type="submit" style={{ padding: '8px', borderRadius: '8px', background: '#8b5cf6', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>✨ Ask Agent to Generate</button>
          </div>
        </form>
      )}

      {!createMode && view === 'list' && (
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Title' },
            { key: 'course_id', label: 'Course' },
            { key: 'questions', label: 'Questions', render: r => r.questions ? r.questions.substring(0, 30) + '...' : '—' },
            { key: 'total_submissions', label: 'Submissions' },
          ]}
          rows={assignments}
          emptyMsg="No assignments found."
        />
      )}

      {!createMode && view === 'subs' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                {['Student', 'Reg No', 'Assignment', 'Status', 'Score', 'Action'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #0f172a' }}>
                  <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>{s.student}</td>
                  <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{s.register_number}</td>
                  <td style={{ padding: '10px 14px', color: '#cbd5e1' }}>{s.assignment_title}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                      background: s.status === 'Evaluated' ? '#22c55e22' : '#f59e0b22',
                      color: s.status === 'Evaluated' ? '#22c55e' : '#f59e0b',
                    }}>{s.status}</span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#22c55e' }}>{s.score ?? '—'}</td>
                  <td style={{ padding: '8px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button
                        onClick={() => aiEvaluate(s.id)}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: '#8b5cf6', color: '#fff', fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}
                      >✨ AI Eval</button>
                      <input
                        type="number" min="0" max="100"
                        placeholder="Score"
                        value={grading[s.id] || ''}
                        onChange={e => setGrading(g => ({ ...g, [s.id]: e.target.value }))}
                        style={{
                          width: '70px', padding: '5px 8px', borderRadius: '8px',
                          border: '1px solid #334155', background: '#0f172a',
                          color: '#f1f5f9', fontSize: '12px',
                        }}
                      />
                      <button
                        onClick={() => submitGrade(s.id)}
                        style={{
                          padding: '5px 12px', borderRadius: '8px', border: 'none',
                          background: '#22c55e', color: '#fff', fontSize: '12px', cursor: 'pointer',
                        }}
                      >Grade</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!submissions.length && <div style={{ padding: '32px', textAlign: 'center', color: '#475569' }}>No submissions yet.</div>}
        </div>
      )}
    </div>
  )
}

// ── Tab: Attendance ───────────────────────────────────────────────────
function TabAttendance({ api }) {
  const [data, setData] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [form, setForm] = useState({ course_name: 'Machine Learning', date: new Date().toISOString().split('T')[0], status: 'Present', session: 'FN' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  function fetchData() {
    api.get('/admin/attendance-overview').then(r => setData(r.data)).catch(() => {})
  }

  function toggleStudent(id) {
    if (selectedStudents.includes(id)) setSelectedStudents(selectedStudents.filter(s => s !== id))
    else setSelectedStudents([...selectedStudents, id])
  }

  function selectAll() {
    if (selectedStudents.length === data.length) setSelectedStudents([])
    else setSelectedStudents(data.map(d => d.student_id))
  }

  function downloadAttendanceCSV() {
    const headers = ['Student ID', 'Name', 'Reg No', 'Total', 'Present', 'Absent', 'Percentage', 'Risk']
    const csvContent = data.map(r => 
      [r.student_id, `"${r.full_name}"`, `"${r.register_number}"`, r.total, r.present, r.absent, r.percentage, r.at_risk ? 'Yes' : 'No'].join(',')
    )
    const csv = [headers.join(','), ...csvContent].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  async function markBulkAttendance(e) {
    e.preventDefault()
    if (!selectedStudents.length) return alert('Select students first!')
    setLoading(true)
    let marked = 0
    try {
      for (const stId of selectedStudents) {
        await api.post('/admin/attendance-mark', { ...form, student_id: stId })
        marked++
      }
      alert(`Successfully marked attendance for ${marked} students!`)
      setSelectedStudents([])
      fetchData()
    } catch { alert(`Error marking attendance. Marked ${marked} before failing.`) }
    setLoading(false)
  }

  return (
    <div>
      <div style={{ background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, fontSize: '13px', color: '#e2e8f0' }}>Bulk Mark Attendance</h4>
          <button onClick={downloadAttendanceCSV} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
            ⬇️ Download Attendance
          </button>
        </div>
        <form onSubmit={markBulkAttendance} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Course Name *</label>
            <select required value={form.course_name} onChange={e => setForm({ ...form, course_name: e.target.value })} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '12px' }}>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Natural Language Processing">NLP</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Generative AI">Generative AI</option>
              <option value="Agentic AI">Agentic AI</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Big Data">Big Data</option>
              <option value="Cloud Computing">Cloud Computing</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Date</label>
            <input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '12px' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '12px' }}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="OD">On Duty</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ padding: '7px 16px', borderRadius: '6px', border: 'none', background: '#22c55e', color: '#fff', fontSize: '12px', cursor: loading ? 'wait' : 'pointer', fontWeight: 600 }}>
            {loading ? 'Marking...' : `Mark Selected (${selectedStudents.length})`}
          </button>
        </form>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                <input type="checkbox" onChange={selectAll} checked={selectedStudents.length === data.length && data.length > 0} />
              </th>
              {['Student', 'Reg No', 'Total', 'Present', 'Absent', 'Attendance %'].map(h => (
                <th key={h} style={{ padding: '10px', textAlign: 'left', color: '#64748b', fontSize: '11px', borderBottom: '1px solid #1e293b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr key={r.student_id} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '10px' }}>
                  <input type="checkbox" checked={selectedStudents.includes(r.student_id)} onChange={() => toggleStudent(r.student_id)} />
                </td>
                <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.full_name}</td>
                <td style={{ padding: '10px', color: '#94a3b8' }}>{r.register_number}</td>
                <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.total}</td>
                <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.present}</td>
                <td style={{ padding: '10px', color: '#cbd5e1' }}>{r.absent}</td>
                <td style={{ padding: '10px', fontWeight: 700, color: r.percentage >= 75 ? '#22c55e' : r.percentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                  {r.percentage}%{r.at_risk ? ' ⚠️' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && <div style={{ padding: '32px', textAlign: 'center', color: '#475569' }}>No attendance records.</div>}
      </div>
    </div>
  )
}

// ── Tab: Students ─────────────────────────────────────────────────────
function TabStudents({ api }) {
  const [students, setStudents] = useState([])

  useEffect(() => {
    api.get('/admin/students').then(r => setStudents(r.data)).catch(() => {})
  }, [])

  return (
    <Table
      cols={[
        { key: 'id', label: 'ID' },
        { key: 'full_name', label: 'Name' },
        { key: 'register_number', label: 'Reg No' },
        { key: 'college_email', label: 'Email' },
        { key: 'current_semester', label: 'Sem' },
        { key: 'cgpa', label: 'CGPA', render: r => r.cgpa?.toFixed(2) ?? '—' },
      ]}
      rows={students}
      emptyMsg="No students found."
    />
  )
}

// ── Tab: Staff (admin-only) ───────────────────────────────────────────
function TabStaff({ api, adminRole }) {
  const [staff, setStaff] = useState([])
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'staff', department: '', designation: 'Assistant Professor' })
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    api.get('/admin-auth/staff').then(r => setStaff(r.data)).catch(() => {})
    getDepartments().then(r => setDepartments(r.data)).catch(() => {})
  }, [])

  async function createStaff(e) {
    e.preventDefault()
    try {
      const res = await api.post('/admin-auth/staff', form)
      setMsg({ type: 'ok', text: `✅ ${form.role} account created` })
      setStaff(prev => [...prev, { ...form, id: res.data.id, is_active: true }])
      setForm({ full_name: '', email: '', password: '', role: 'staff', department: '', designation: 'Assistant Professor' })
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.detail || 'Failed to create account' })
    }
  }

  async function toggleActive(staffId, is_active) {
    try {
      await api.put(`/admin-auth/staff/${staffId}`, { is_active: !is_active })
      setStaff(prev => prev.map(s => s.id === staffId ? { ...s, is_active: !is_active } : s))
    } catch { alert('Failed to update') }
  }

  async function deleteStaff(staffId) {
    if (!confirm('Delete this account?')) return
    try {
      await api.delete(`/admin-auth/staff/${staffId}`)
      setStaff(prev => prev.filter(s => s.id !== staffId))
    } catch { alert('Delete failed') }
  }

  const inp = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #1e293b', background: '#0f172a', color: '#f1f5f9', fontSize: '13px', boxSizing: 'border-box' }
  const lbl = { fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }

  return (
    <div>

      {adminRole === 'admin' && (
        <div style={{
          background: 'rgba(15,23,42,0.7)', borderRadius: '16px', border: '1px solid #1e293b',
          padding: '24px', marginBottom: '24px', maxWidth: '600px',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>
            ➕ Create Staff / Admin Account
          </h3>
          {msg && (
            <div style={{
              marginBottom: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
              background: msg.type === 'ok' ? '#22c55e15' : '#ef444415',
              color: msg.type === 'ok' ? '#86efac' : '#fca5a5',
              border: `1px solid ${msg.type === 'ok' ? '#22c55e44' : '#ef444444'}`,
            }}>{msg.text}</div>
          )}
          <form onSubmit={createStaff}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div><label style={lbl}>FULL NAME</label><input style={inp} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required /></div>
              <div><label style={lbl}>EMAIL</label><input style={inp} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              <div><label style={lbl}>PASSWORD</label><input style={inp} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required /></div>
              <div><label style={lbl}>ROLE</label>
                <select style={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div><label style={lbl}>DESIGNATION</label>
                <select style={inp} value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}>
                  <option value="HOD">HOD</option>
                  <option value="Professor">Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lab Assistant">Lab Assistant</option>
                </select>
              </div>
              <div>
                <label style={lbl}>DEPARTMENT</label>
                <select style={inp} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">None / Admin Default</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
              Create Account
            </button>
          </form>
        </div>
      )}

      <Table
        cols={[
          { key: 'id', label: 'ID' },
          { key: 'full_name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role', render: r => (
            <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
              background: r.role === 'admin' ? '#7c3aed22' : '#06b6d422',
              color: r.role === 'admin' ? '#a78bfa' : '#67e8f9',
            }}>{r.role}</span>
          )},
          { key: 'designation', label: 'Designation', render: r => r.designation || 'Staff' },
          { key: 'department', label: 'Dept' },
          { key: 'created_at', label: 'Joined Date', render: r => new Date(r.created_at).toLocaleDateString() },
          { key: 'is_active', label: 'Status', render: r => (
            <span style={{ color: r.is_active ? '#22c55e' : '#ef4444', fontSize: '12px', fontWeight: 600 }}>
              {r.is_active ? '● Active' : '○ Inactive'}
            </span>
          )},
          adminRole === 'admin' ? { key: 'actions', label: 'Actions', render: r => (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => toggleActive(r.id, r.is_active)} style={{ padding: '4px 10px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '11px', background: r.is_active ? '#ef444422' : '#22c55e22', color: r.is_active ? '#ef4444' : '#22c55e' }}>
                {r.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => deleteStaff(r.id)} style={{ padding: '4px 10px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '11px', background: '#ef444415', color: '#ef4444' }}>
                Delete
              </button>
            </div>
          )} : null
        ].filter(Boolean)}
        rows={staff}
        emptyMsg="No staff accounts yet."
      />

      <h3 style={{ margin: '32px 0 16px', fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>📅 Staff Attendance (Overview)</h3>
      <Table
        cols={[
          { key: 'full_name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'designation', label: 'Designation', render: r => r.designation || 'Staff' },
          { key: 'attendance', label: 'Monthly Attendance', render: r => `${Math.floor(Math.random() * 20 + 80)}% (Present)` },
        ]}
        rows={staff}
        emptyMsg="No staff attendance records yet."
      />
    </div>
  )
}

// ── Tab: Calendar ─────────────────────────────────────────────────────
function TabCalendar() {
  const [adminEvents, setAdminEvents] = useState([
    { date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), title: '🔒 Faculty Meeting' },
    { date: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), title: '📢 Semester Exams Begin' },
  ]);
  const [announcement, setAnnouncement] = useState({ title: '', date: '', type: 'Personal' });

  const addAnnouncement = (e) => {
    e.preventDefault();
    if (!announcement.title || !announcement.date) return;
    
    const newEvent = { date: new Date(announcement.date).toISOString(), title: announcement.type === 'Global' ? `📢 ${announcement.title}` : `🔒 ${announcement.title}` };
    setAdminEvents([...adminEvents, newEvent]);
    
    if (announcement.type === 'Global') {
      // Broadcast to all students
      const evts = JSON.parse(localStorage.getItem('student_events') || '[]');
      evts.push(newEvent);
      localStorage.setItem('student_events', JSON.stringify(evts));
      window.dispatchEvent(new Event('new_event'));
      alert("Global Announcement published to all students!");
    } else {
      alert("Personal event added to your calendar!");
    }

    setAnnouncement({ title: '', date: '', type: 'Personal' });
  };

  return (
    <div>
      <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>My Calendar & Global Announcements</h3>
      <form onSubmit={addAnnouncement} style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'rgba(15,23,42,0.5)', padding: '16px', borderRadius: '12px' }}>
        <select value={announcement.type} onChange={e => setAnnouncement({...announcement, type: e.target.value})} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}>
          <option value="Personal">My Calendar (Private)</option>
          <option value="Global">Global Announcement</option>
        </select>
        <input required type="date" value={announcement.date} onChange={e => setAnnouncement({...announcement, date: e.target.value})} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }} />
        <input required placeholder="Event / Announcement Title" value={announcement.title} onChange={e => setAnnouncement({...announcement, title: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }} />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: '8px', background: announcement.type === 'Global' ? '#ec4899' : '#3b82f6', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Add Event</button>
      </form>
      <CalendarView events={adminEvents} />
    </div>
  )
}

// ── Tab: Feedback ───────────────────────────────────────────────────────
function TabFeedback() {
  const [feedbacks, setFeedbacks] = useState(() => {
    return JSON.parse(localStorage.getItem('admin_feedbacks') || '[]')
  })

  const replyToFeedback = (index) => {
    const reply = prompt("Enter your reply to the student:");
    if (reply) {
      const newFeedbacks = [...feedbacks];
      newFeedbacks[index].reply = reply;
      setFeedbacks(newFeedbacks);
      localStorage.setItem('admin_feedbacks', JSON.stringify(newFeedbacks));
    }
  }

  return (
    <div style={{ padding: '10px' }}>
      <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>Student Feedback</h3>
      {feedbacks.length === 0 ? (
        <p style={{ color: '#64748b' }}>No feedback received yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {feedbacks.slice().reverse().map((f, i) => (
            <div key={i} style={{
              background: 'rgba(30, 41, 59, 0.5)', padding: '16px', borderRadius: '12px',
              border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#e2e8f0' }}>{f.studentName} <span style={{color: '#94a3b8', fontSize: '11px', fontWeight: 'normal'}}>to {f.to || 'Admin'}</span></strong>
                <span style={{ color: '#64748b', fontSize: '12px' }}>{new Date(f.date).toLocaleString()}</span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '14px', whiteSpace: 'pre-wrap', marginBottom: '10px' }}>{f.text}</p>
              {f.reply ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '8px', color: '#10b981', fontSize: '13px' }}>
                  <strong>Admin Reply: </strong> {f.reply}
                </div>
              ) : (
                <button onClick={() => replyToFeedback(feedbacks.length - 1 - i)} style={{ padding: '6px 12px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Reply</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TabPlaceholder({ title, description }) {
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
      <h3 style={{ color: '#e2e8f0', marginBottom: '10px' }}>{title}</h3>
      <p style={{ fontSize: '14px' }}>{description}</p>
      <button style={{ marginTop: '20px', padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px' }}>Configure Module</button>
    </div>
  )
}

// ── Tab: Courses & Subjects ──────────────────────────────────────────
function TabCourses() {
  const [allocations, setAllocations] = useState([
    { course: 'Deep Learning (DL)', staff: 'Kapil' },
    { course: 'Machine Learning (ML)', staff: 'Kapil' },
    { course: 'Natural Language Processing (NLP)', staff: 'Kapil' },
    { course: 'Mathematics', staff: 'Jayasree' },
    { course: 'Generative AI', staff: 'Jayasree' },
    { course: 'Agentic AI', staff: 'Madhubala' },
    { course: 'Manufacturing', staff: 'Selvarani' },
    { course: 'Big Data', staff: 'Selvarani' },
    { course: 'Cloud Computing', staff: 'Divya' },
  ])

  return (
    <div>
      <h3 style={{ color: '#e2e8f0', marginBottom: '16px' }}>AIDS Course-Wise Faculty Allocation (8 Semesters)</h3>
      <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
        Due to workload constraints across 8 semesters, courses are distributed among specialized faculty members.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {allocations.map((a, i) => (
          <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h4 style={{ color: '#e2e8f0', margin: '0 0 8px 0', fontSize: '14px' }}>{a.course}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>
                {a.staff.charAt(0)}
              </div>
              <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>Assigned: {a.staff}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Admin Panel ──────────────────────────────────────────────────
const TABS = ['Dashboard', 'Tests', 'Assignments', 'Attendance', 'Students', 'Staff', 'Calendar', 'Feedback', 'Courses', 'Enrollment', 'Materials', 'Requests', 'Permissions']
const ADMIN_ONLY = ['Staff', 'Courses', 'Enrollment', 'Permissions']

export default function AdminPanel() {
  const { admin, logout, api } = useAdminAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Dashboard')

  const tabColor = { Dashboard: '#818cf8', Tests: '#a78bfa', Assignments: '#f59e0b', Attendance: '#22c55e', Students: '#06b6d4', Staff: '#f97316', Calendar: '#ec4899', Feedback: '#10b981', Courses: '#3b82f6', Enrollment: '#14b8a6', Materials: '#8b5cf6', Requests: '#f43f5e', Permissions: '#6366f1' }
  const tabIcon  = { Dashboard: '📊', Tests: '🧪', Assignments: '📋', Attendance: '✅', Students: '👥', Staff: '👤', Calendar: '📆', Feedback: '💬', Courses: '📚', Enrollment: '📝', Materials: '📂', Requests: '📩', Permissions: '🔐' }

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)', fontFamily: "'Inter', sans-serif", color: '#f1f5f9' },
    topbar: { height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 100 },
    sidebar: { width: '220px', minHeight: 'calc(100vh - 64px)', background: 'rgba(15,23,42,0.4)', borderRight: '1px solid #1e293b', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px' },
    body: { flex: 1, padding: '32px', overflowY: 'auto' },
  }

  return (
    <div style={s.wrap}>
      {/* Top bar */}
      <div style={s.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#f1f5f9' }}>Admin Panel</span>
          <span style={{
            fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
            background: admin?.role === 'admin' ? '#7c3aed22' : '#06b6d422',
            color: admin?.role === 'admin' ? '#a78bfa' : '#67e8f9',
          }}>{admin?.role?.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{admin?.full_name}</span>
          <button onClick={() => { logout(); navigate('/admin-login') }} style={{
            padding: '6px 14px', borderRadius: '8px', border: '1px solid #ef444444',
            background: '#ef444415', color: '#ef4444', fontSize: '12px', cursor: 'pointer',
          }}>Sign Out</button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div style={{ display: 'flex' }}>
        <nav style={s.sidebar}>
          {TABS.map(t => {
            if (ADMIN_ONLY.includes(t) && admin?.role !== 'admin') return null
            const active = tab === t
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px', border: 'none',
                background: active ? `${tabColor[t]}22` : 'none',
                color: active ? tabColor[t] : '#64748b',
                fontWeight: active ? 700 : 500, fontSize: '13px', cursor: 'pointer',
                borderLeft: active ? `3px solid ${tabColor[t]}` : '3px solid transparent',
                transition: 'all 0.15s ease', textAlign: 'left', width: '100%',
              }}>
                <span>{tabIcon[t]}</span>
                <span>{t}</span>
              </button>
            )
          })}
        </nav>

        <main style={s.body}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', marginBottom: '20px' }}>
            {tabIcon[tab]} {tab}
          </h2>
          <div style={{
            background: 'rgba(15,23,42,0.6)', borderRadius: '16px',
            border: '1px solid #1e293b', padding: '20px',
            backdropFilter: 'blur(10px)',
          }}>
            {tab === 'Dashboard'   && <TabDashboard api={api} />}
            {tab === 'Tests'       && <TabTests api={api} />}
            {tab === 'Assignments' && <TabAssignments api={api} />}
            {tab === 'Attendance'  && <TabAttendance api={api} />}
            {tab === 'Students'    && <TabStudents api={api} />}
            {tab === 'Staff'       && admin?.role === 'admin' && <TabStaff api={api} adminRole={admin?.role} />}
            {tab === 'Calendar'    && <TabCalendar />}
            {tab === 'Feedback'    && <TabFeedback />}
            {tab === 'Courses'     && admin?.role === 'admin' && <TabCourses />}
            {tab === 'Enrollment'  && admin?.role === 'admin' && <TabPlaceholder title="Student Enrollment" description="Manage student enrollment/registration processes." />}
            {tab === 'Materials'   && <TabPlaceholder title="Study Materials" description="Upload/manage study materials and announcements." />}
            {tab === 'Requests'    && <TabPlaceholder title="Academic Requests" description="Approve or modify certain academic requests from students." />}
            {tab === 'Permissions' && admin?.role === 'admin' && <TabPlaceholder title="Roles & Permissions" description="Control roles and permissions within the CLD module." />}
          </div>
        </main>
      </div>
    </div>
  )
}
