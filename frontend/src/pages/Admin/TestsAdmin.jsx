import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function TestsAdmin() {
  const { api } = useAdminAuth()
  const [tests, setTests] = useState([])
  const [courses, setCourses] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCourse, setFilterCourse] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', course_id: '', test_type: 'Unit' })
  const [addMsg, setAddMsg] = useState('')

  const loadTests = async () => {
    setLoading(true)
    try {
      const params = filterCourse ? `?course_id=${filterCourse}` : ''
      const [tRes, cRes] = await Promise.all([
        api.get(`/admin/tests-overview${params}`),
        api.get('/admin/courses'),
      ])
      setTests(tRes.data)
      setCourses(cRes.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const loadAttempts = async () => {
    try {
      const res = await api.get('/admin/test-attempts?limit=200')
      setAttempts(res.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadTests() }, [filterCourse])
  useEffect(() => { if (selected) loadAttempts() }, [selected])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAddMsg('')
    try {
      await api.post('/admin/tests', { title: form.title, course_id: parseInt(form.course_id), test_type: form.test_type })
      setAddMsg('Test created successfully!')
      setForm({ title: '', course_id: '', test_type: 'Unit' })
      loadTests()
    } catch (e) { setAddMsg('Error: ' + (e.response?.data?.detail || e.message)) }
  }

  const typeBadge = (type) => {
    const map = { Unit: 'bg-blue-100 text-blue-700', Practice: 'bg-indigo-100 text-indigo-700', 'Pre-CAT': 'bg-amber-100 text-amber-700', Mock: 'bg-violet-100 text-violet-700', Revision: 'bg-cyan-100 text-cyan-700', Final: 'bg-emerald-100 text-emerald-700' }
    return map[type] || 'bg-slate-100 text-slate-600'
  }

  const filteredAttempts = selected
    ? attempts.filter(a => a.test_title === selected.title)
    : []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Tests Management" description="View tests, attempts, and performance data" />
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
          + Create Test
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">New Test</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-xs font-semibold text-slate-500 block mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Unit 2 Practice Test"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Course *</label>
              <select required value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
                <option value="">Select…</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Type *</label>
              <select value={form.test_type} onChange={e => setForm({ ...form, test_type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
                {['Unit', 'Practice', 'Pre-CAT', 'Mock', 'Revision', 'Final'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {addMsg && <p className={`col-span-3 text-xs ${addMsg.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>{addMsg}</p>}
            <div className="col-span-3 flex gap-2">
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

      {/* Tests Table */}
      <Card p="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Title', 'Course', 'Type', 'Attempts', 'Avg Score', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : tests.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-slate-400 text-sm">No tests found.</td></tr>
              ) : tests.map((t, i) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{t.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">{t.course_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${typeBadge(t.test_type)}`}>{t.test_type}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">{t.total_attempts}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-sm ${t.avg_score >= 75 ? 'text-emerald-600' : t.avg_score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {t.avg_score > 0 ? `${t.avg_score}%` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(selected?.id === t.id ? null : t)}
                      className="px-3 py-1 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100"
                    >
                      {selected?.id === t.id ? 'Hide' : 'View Attempts'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Attempts Panel */}
      {selected && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">
            Attempts for: <span className="text-blue-600">{selected.title}</span>
          </h3>
          {filteredAttempts.length === 0 ? (
            <p className="text-sm text-slate-400">No attempts yet for this test.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Student', 'Reg. No', 'Submitted', 'Score', 'Percentage'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map(a => (
                    <tr key={a.attempt_id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium text-slate-900">{a.student}</td>
                      <td className="px-3 py-2.5 text-slate-500 font-mono text-xs">{a.register_number}</td>
                      <td className="px-3 py-2.5 text-slate-500 text-xs">{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : '—'}</td>
                      <td className="px-3 py-2.5 font-bold text-blue-600">{a.score ?? '—'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${a.percentage >= 75 ? 'bg-emerald-100 text-emerald-700' : a.percentage >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                          {a.percentage != null ? `${a.percentage}%` : '—'}
                        </span>
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
