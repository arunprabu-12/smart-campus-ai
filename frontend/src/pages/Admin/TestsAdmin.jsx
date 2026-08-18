import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function TestsAdmin({ isGeneratorMode }) {
  const { api } = useAdminAuth()
  const [tests, setTests] = useState([])
  const [courses, setCourses] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCourse, setFilterCourse] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(isGeneratorMode || false)
  const [createMode, setCreateMode] = useState(isGeneratorMode ? 'ai' : 'manual')
  const [form, setForm] = useState({ title: '', course_id: '', test_type: 'Unit' })
  const [aiForm, setAiForm] = useState({ topic: '', course_id: '', unit: '', start_date: '', end_date: '' })
  const [addMsg, setAddMsg] = useState('')


  const loadTests = async () => {
    setLoading(true)
    try {
      const params = filterCourse ? `?course_id=${filterCourse}` : ''
      const [tRes, cRes] = await Promise.all([
        api.get(`/admin/tests-overview${params}`),
        api.get('/admin/courses'),
      ])
      let fetchedCourses = cRes.data
      
      if (admin?.role === 'staff') {
        const staffDept = admin.department || ''
        const staffName = admin.full_name || ''
        const assignedCourses = staffDept.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        
        fetchedCourses = fetchedCourses.filter(c => {
          const matchesFaculty = c.faculty?.toLowerCase().includes(staffName.toLowerCase()) || staffName.toLowerCase().includes(c.faculty?.toLowerCase())
          const matchesAssigned = assignedCourses.some(assigned => 
            c.name.toLowerCase().includes(assigned) || 
            assigned.includes(c.name.toLowerCase()) ||
            c.code.toLowerCase().includes(assigned)
          )
          return matchesFaculty || matchesAssigned
        })
      }
      
      setCourses(fetchedCourses)
      
      const validCourseIds = fetchedCourses.map(c => c.id)
      if (admin?.role === 'staff') {
        setTests(tRes.data.filter(t => validCourseIds.includes(t.course_id)))
      } else {
        setTests(tRes.data)
      }
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

  const handleAIGenerate = async (e) => {
    e.preventDefault()
    setAddMsg('')
    try {
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

      setAddMsg('AI Test successfully generated and scheduled by Manager AI!')
      setAiForm({ topic: '', course_id: '', unit: '', start_date: '', end_date: '' })
      loadTests()
    } catch (e) { setAddMsg('AI Generation failed: ' + (e.response?.data?.detail || e.message)) }
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
        <PageHeader title={isGeneratorMode ? "AI Test Generator" : "Tests Management"} description={isGeneratorMode ? "Generate tests automatically with AI" : "View tests, attempts, and performance data"} />
        <div className="flex gap-2">
          {!isGeneratorMode && (
            <button onClick={() => { setShowAdd(true); setCreateMode('manual'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
              + Manual Test
            </button>
          )}
          <button onClick={() => { setShowAdd(true); setCreateMode('ai'); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-sm">
            ✨ AI Agent Test
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">
            {createMode === 'ai' ? 'Generate Test via Manager AI' : 'New Test'}
          </h3>
          {createMode === 'manual' ? (
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
          ) : (
            <form onSubmit={handleAIGenerate} className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Topic to generate for *</label>
                <input required value={aiForm.topic} onChange={e => setAiForm({ ...aiForm, topic: e.target.value })} placeholder="e.g., Support Vector Machines"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Course *</label>
                <select required value={aiForm.course_id} onChange={e => setAiForm({ ...aiForm, course_id: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option value="">Select course…</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Unit *</label>
                <input required value={aiForm.unit} onChange={e => setAiForm({ ...aiForm, unit: e.target.value })} placeholder="e.g., Unit 4"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Start Date</label>
                <input required type="datetime-local" value={aiForm.start_date} onChange={e => setAiForm({ ...aiForm, start_date: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">End Date</label>
                <input required type="datetime-local" value={aiForm.end_date} onChange={e => setAiForm({ ...aiForm, end_date: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              {addMsg && <p className={`col-span-2 text-xs ${addMsg.startsWith('Error') || addMsg.includes('failed') ? 'text-red-600' : 'text-emerald-600'}`}>{addMsg}</p>}
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-sm">✨ Ask Agent to Generate</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              </div>
            </form>
          )}
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
