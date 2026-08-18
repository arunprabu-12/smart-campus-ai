import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AssignmentsAdmin() {
  const { api } = useAdminAuth()
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCourse, setFilterCourse] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', course_id: '', questions: '' })
  const [addMsg, setAddMsg] = useState('')

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const params = filterCourse ? `?course_id=${filterCourse}` : ''
      const [aRes, cRes] = await Promise.all([
        api.get(`/admin/assignments-overview${params}`),
        api.get('/admin/courses'),
      ])
      setAssignments(aRes.data)
      setCourses(cRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const loadSubmissions = async (asgId) => {
    try {
      const res = await api.get(`/admin/submissions?assignment_id=${asgId}`)
      setSubmissions(res.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadAssignments() }, [filterCourse])
  useEffect(() => { if (selected) loadSubmissions(selected.id) }, [selected])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAddMsg('')
    try {
      await api.post('/admin/assignments', { title: form.title, course_id: parseInt(form.course_id), questions: form.questions || null })
      setAddMsg('Assignment created!')
      setForm({ title: '', course_id: '', questions: '' })
      loadAssignments()
    } catch (e) { setAddMsg('Error: ' + (e.response?.data?.detail || e.message)) }
  }

  const handleGrade = async (subId, score) => {
    try {
      await api.put(`/admin/submissions/${subId}/grade?grade=${score}`)
      if (selected) loadSubmissions(selected.id)
    } catch (e) { alert('Grade failed') }
  }

  const statusColor = (s) => {
    if (s === 'Evaluated') return 'bg-emerald-100 text-emerald-700'
    if (s === 'Submitted') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-500'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Assignments Management" description="View, create, and grade assignments" />
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
          + Create Assignment
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">New Assignment</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-500 block mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Unit 3 – Deep Learning Basics"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Course *</label>
              <select required value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
                <option value="">Select course…</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Questions (JSON or text)</label>
              <input value={form.questions} onChange={e => setForm({ ...form, questions: e.target.value })} placeholder='[{"text":"Q1","type":"short"}]'
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            {addMsg && <p className={`col-span-2 text-xs ${addMsg.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>{addMsg}</p>}
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold">Create</button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter */}
      <Card p="p-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500">Filter by Course:</label>
          <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option value="">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
          </select>
        </div>
      </Card>

      {/* Assignments Table */}
      <Card p="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Title', 'Course', 'Submissions', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : assignments.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400 text-sm">No assignments found.</td></tr>
              ) : assignments.map((a, i) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{a.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">{a.course_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${a.total_submissions > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {a.total_submissions} submitted
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(selected?.id === a.id ? null : a)}
                      className="px-3 py-1 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100"
                    >
                      {selected?.id === a.id ? 'Hide' : 'View Submissions'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Submissions Panel */}
      {selected && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">
            Submissions for: <span className="text-blue-600">{selected.title}</span>
          </h3>
          {submissions.length === 0 ? (
            <p className="text-sm text-slate-400">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Student', 'Reg. No', 'Submitted', 'Score', 'Status', 'Grade'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium text-slate-900">{sub.student}</td>
                      <td className="px-3 py-2.5 text-slate-500 font-mono text-xs">{sub.register_number}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs">{sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '—'}</td>
                      <td className="px-3 py-2.5 font-bold text-blue-600">{sub.score ?? '—'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${statusColor(sub.status)}`}>{sub.status || 'Pending'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        {sub.status !== 'Evaluated' && (
                          <div className="flex gap-1">
                            {[50, 60, 70, 80, 90, 100].map(score => (
                              <button key={score} onClick={() => handleGrade(sub.id, score)}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100">
                                {score}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
