import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AssignmentsAdmin({ isGeneratorMode }) {
  const { api, admin } = useAdminAuth()
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCourse, setFilterCourse] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(isGeneratorMode || false)
  const [createMode, setCreateMode] = useState(isGeneratorMode ? 'ai' : 'manual')
  const [form, setForm] = useState({ title: '', course_id: '', questions: '' })
  const [aiForm, setAiForm] = useState({ topic: '', course_id: '', unit: '', start_date: '', end_date: '' })
  const [addMsg, setAddMsg] = useState('')


  const loadAssignments = async () => {
    setLoading(true)
    try {
      const params = filterCourse ? `?course_id=${filterCourse}` : ''
      const [aRes, cRes] = await Promise.all([
        api.get(`/admin/assignments-overview${params}`),
        api.get('/admin/courses'),
      ])
      let fetchedCourses = cRes.data
      
      if (admin?.role === 'staff') {
        const staffDept = admin.department || ''
        const staffName = admin.full_name || ''
        const assignedCourses = staffDept.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
        
        fetchedCourses = fetchedCourses.filter(c => {
          const courseName = c.course_name || ''
          const courseCode = c.course_code || ''
          
          const matchesAssigned = assignedCourses.some(assigned => 
            courseName.toLowerCase().includes(assigned) || 
            assigned.includes(courseName.toLowerCase()) ||
            courseCode.toLowerCase().includes(assigned)
          )
          return matchesAssigned
        })
      }
      
      setCourses(fetchedCourses)
      
      // Filter assignments to only those in the staff's courses
      const validCourseIds = fetchedCourses.map(c => c.id)
      if (admin?.role === 'staff') {
        setAssignments(aRes.data.filter(a => validCourseIds.includes(a.course_id)))
      } else {
        setAssignments(aRes.data)
      }
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

  const handleAIGenerate = async (e) => {
    e.preventDefault()
    setAddMsg('')
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

      setAddMsg('AI Assignment generated and scheduled!')
      setAiForm({ topic: '', course_id: '', unit: '', start_date: '', end_date: '' })
      loadAssignments()
    } catch (e) { setAddMsg('AI Generation failed: ' + (e.response?.data?.detail || e.message)) }
  }

  const handleGrade = async (subId, score) => {
    try {
      await api.put(`/admin/submissions/${subId}/grade?grade=${score}`)
      if (selected) loadSubmissions(selected.id)
    } catch (e) { alert('Grade failed') }
  }

  const handleAIEval = async (subId) => {
    try {
      const res = await api.post(`/admin/submissions/${subId}/ai-evaluate`)
      alert('AI Evaluation: ' + res.data.ai_evaluation)
      if (selected) loadSubmissions(selected.id)
    } catch (e) { alert('AI Eval failed') }
  }

  const statusColor = (s) => {
    if (s === 'Evaluated') return 'bg-emerald-100 text-emerald-700'
    if (s === 'Submitted') return 'bg-blue-100 text-blue-700'
    return 'bg-slate-100 text-slate-500'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title={isGeneratorMode ? "AI Assignment Generator" : "Assignments Management"} description={isGeneratorMode ? "Generate assignments automatically with AI" : "View, create, and grade assignments"} />
        <div className="flex gap-2">
          {!isGeneratorMode && (
            <button onClick={() => { setShowAdd(true); setCreateMode('manual'); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
              + Manual Assignment
            </button>
          )}
          <button onClick={() => { setShowAdd(true); setCreateMode('ai'); }} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-sm">
            ✨ AI Agent Assignment
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">
            {createMode === 'ai' ? 'Generate Assignment via Manager AI' : 'New Assignment'}
          </h3>
          {createMode === 'manual' ? (
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
              {addMsg && <p className={`col-span-2 text-xs ${addMsg.startsWith('Error') || addMsg.startsWith('AI') ? 'text-red-600' : 'text-emerald-600'}`}>{addMsg}</p>}
              <div className="col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold">Create</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAIGenerate} className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">Topic to generate for *</label>
                <input required value={aiForm.topic} onChange={e => setAiForm({ ...aiForm, topic: e.target.value })} placeholder="e.g., Deep Learning Architecture"
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
                <input required value={aiForm.unit} onChange={e => setAiForm({ ...aiForm, unit: e.target.value })} placeholder="e.g., Unit 3"
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

      {/* Assignments Grouped by Course */}
      <div className="space-y-6">
        {loading ? (
          <Card p="p-10"><p className="text-center text-slate-400 text-sm">Loading…</p></Card>
        ) : assignments.length === 0 ? (
          <Card p="p-10"><p className="text-center text-slate-400 text-sm">No assignments found.</p></Card>
        ) : (
          Object.entries(assignments.reduce((acc, a) => {
            acc[a.course_name] = acc[a.course_name] || [];
            acc[a.course_name].push(a);
            return acc;
          }, {})).map(([courseName, courseAssignments]) => (
            <Card key={courseName} p="p-0" className="overflow-hidden mb-5">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h4 className="font-bold text-slate-800">{courseName}</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['#', 'Title', 'Submissions', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {courseAssignments.map((a, i) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{a.title}</td>
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
          ))
        )}
      </div>

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
                    {['Student', 'Reg. No', 'Answers', 'Score', 'Status', 'Grade & Eval'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium text-slate-900">{sub.student}</td>
                      <td className="px-3 py-2.5 text-slate-500 font-mono text-xs">{sub.register_number}</td>
                      <td className="px-3 py-2.5 text-slate-600 text-xs max-w-xs truncate" title={sub.answers || 'No answers provided'}>
                        {sub.answers ? (sub.answers.length > 50 ? sub.answers.substring(0, 50) + '...' : sub.answers) : '—'}
                      </td>
                      <td className="px-3 py-2.5 font-bold text-blue-600">{sub.score ?? '—'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${statusColor(sub.status)}`}>{sub.status || 'Pending'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col gap-1">
                          {sub.status !== 'Evaluated' && (
                            <div className="flex gap-1">
                              {[50, 75, 90, 100].map(score => (
                                <button key={score} onClick={() => handleGrade(sub.id, score)}
                                  className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100">
                                  {score}
                                </button>
                              ))}
                            </div>
                          )}
                          <button onClick={() => handleAIEval(sub.id)} className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-50 border border-purple-200 text-purple-700 rounded hover:bg-purple-100 self-start">
                            ✨ AI Eval
                          </button>
                        </div>
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
