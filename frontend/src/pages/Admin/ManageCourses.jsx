/** Spec section 16 — Admin: CRUD for courses, units, topics, tests, questions. */
import { useState, useEffect } from 'react'
import {
  adminGetCourses, adminCreateCourse, adminDeleteCourse,
  createUnit, createTopic, createTest, createQuestion,
  getSemesters, getRegulations,
} from '../../api/admin'

export default function ManageCourses() {
  const [tab, setTab] = useState('courses')
  const [courses, setCourses] = useState([])
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(false)

  // Course form
  const [courseForm, setCourseForm] = useState({ course_code: '', course_name: '', credits: 4, description: '', semester_id: '' })

  // Unit form
  const [unitForm, setUnitForm] = useState({ course_id: '', title: '', order_index: 1 })

  // Topic form
  const [topicForm, setTopicForm] = useState({ unit_id: '', title: '', notes: '', youtube_video_id: '' })

  // Test form
  const [testForm, setTestForm] = useState({ course_id: '', title: '', test_type: 'Practice' })

  // Question form
  const [qForm, setQForm] = useState({ test_id: '', question_text: '', question_type: 'MCQ', options: '', correct_answer: '', topic_id: '' })

  const [message, setMessage] = useState('')

  useEffect(() => {
    getRegulations().then((r) => {
      if (r.data.length > 0) {
        getSemesters(r.data[0].id).then((s) => setSemesters(s.data)).catch(() => {})
      }
    }).catch(() => {})
    loadCourses()
  }, [])

  const loadCourses = () => {
    adminGetCourses().then((r) => setCourses(r.data)).catch(() => {})
  }

  const showMessage = (msg) => { setMessage(msg); setTimeout(() => setMessage(''), 3000) }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminCreateCourse({ ...courseForm, credits: parseInt(courseForm.credits), semester_id: parseInt(courseForm.semester_id) })
      showMessage('✓ Course created!')
      loadCourses()
      setCourseForm({ course_code: '', course_name: '', credits: 4, description: '', semester_id: '' })
    } catch (err) { showMessage('Error: ' + (err.response?.data?.detail || 'Failed')) }
    setLoading(false)
  }

  const handleDeleteCourse = async (id) => {
    if (!confirm('Delete this course and all its content?')) return
    try { await adminDeleteCourse(id); loadCourses(); showMessage('Deleted.') } catch {}
  }

  const handleCreateUnit = async (e) => {
    e.preventDefault()
    try {
      await createUnit({ ...unitForm, course_id: parseInt(unitForm.course_id), order_index: parseInt(unitForm.order_index) })
      showMessage('✓ Unit created!')
    } catch (err) { showMessage('Error: ' + (err.response?.data?.detail || 'Failed')) }
  }

  const handleCreateTopic = async (e) => {
    e.preventDefault()
    try {
      await createTopic({ ...topicForm, unit_id: parseInt(topicForm.unit_id) })
      showMessage('✓ Topic created!')
    } catch (err) { showMessage('Error: ' + (err.response?.data?.detail || 'Failed')) }
  }

  const handleCreateTest = async (e) => {
    e.preventDefault()
    try {
      await createTest({ ...testForm, course_id: parseInt(testForm.course_id) })
      showMessage('✓ Test created!')
    } catch (err) { showMessage('Error: ' + (err.response?.data?.detail || 'Failed')) }
  }

  const handleCreateQuestion = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...qForm,
        test_id: parseInt(qForm.test_id),
        topic_id: qForm.topic_id ? parseInt(qForm.topic_id) : null,
        options: qForm.question_type === 'MCQ' ? qForm.options : null,
      }
      await createQuestion(payload)
      showMessage('✓ Question added!')
    } catch (err) { showMessage('Error: ' + (err.response?.data?.detail || 'Failed')) }
  }

  const input = 'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
  const label = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'
  const btn = 'px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:bg-gray-400'

  const TABS = ['courses', 'units', 'topics', 'tests', 'questions']

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            {t}
          </button>
        ))}
      </div>

      {message && <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">{message}</div>}

      {/* ── Courses ── */}
      {tab === 'courses' && (
        <div className="space-y-5">
          <form onSubmit={handleCreateCourse} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Add Course</h4>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={label}>Course Code *</label><input className={input} required value={courseForm.course_code} onChange={(e) => setCourseForm(p => ({...p, course_code: e.target.value}))} /></div>
              <div><label className={label}>Course Name *</label><input className={input} required value={courseForm.course_name} onChange={(e) => setCourseForm(p => ({...p, course_name: e.target.value}))} /></div>
              <div><label className={label}>Credits</label><input type="number" min={1} max={5} className={input} value={courseForm.credits} onChange={(e) => setCourseForm(p => ({...p, credits: e.target.value}))} /></div>
              <div><label className={label}>Semester *</label>
                <select className={input} required value={courseForm.semester_id} onChange={(e) => setCourseForm(p => ({...p, semester_id: e.target.value}))}>
                  <option value="">Select…</option>
                  {semesters.map((s) => <option key={s.id} value={s.id}>Semester {s.number}</option>)}
                </select>
              </div>
              <div className="col-span-2"><label className={label}>Description</label><input className={input} value={courseForm.description} onChange={(e) => setCourseForm(p => ({...p, description: e.target.value}))} /></div>
            </div>
            <button type="submit" disabled={loading} className={btn}>Add Course</button>
          </form>

          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>{['ID','Code','Name','Credits','Semester ID','Actions'].map(h => <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {courses.map((c) => (
                  <tr key={c.id} className="bg-white dark:bg-gray-900">
                    <td className="px-4 py-2 text-gray-400 text-xs">{c.id}</td>
                    <td className="px-4 py-2 font-mono">{c.course_code}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-white">{c.course_name}</td>
                    <td className="px-4 py-2">{c.credits}</td>
                    <td className="px-4 py-2">{c.semester_id}</td>
                    <td className="px-4 py-2"><button onClick={() => handleDeleteCourse(c.id)} className="text-xs text-red-600 hover:underline">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Units ── */}
      {tab === 'units' && (
        <form onSubmit={handleCreateUnit} className="p-4 rounded-xl bg-white dark:bg-gray-800 border space-y-3 max-w-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white">Add Unit</h4>
          <div><label className={label}>Course *</label>
            <select className={input} required value={unitForm.course_id} onChange={(e) => setUnitForm(p => ({...p, course_id: e.target.value}))}>
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>[{c.course_code}] {c.course_name}</option>)}
            </select>
          </div>
          <div><label className={label}>Unit Title *</label><input className={input} required value={unitForm.title} onChange={(e) => setUnitForm(p => ({...p, title: e.target.value}))} /></div>
          <div><label className={label}>Order</label><input type="number" min={1} className={input} value={unitForm.order_index} onChange={(e) => setUnitForm(p => ({...p, order_index: e.target.value}))} /></div>
          <button type="submit" className={btn}>Add Unit</button>
        </form>
      )}

      {/* ── Topics ── */}
      {tab === 'topics' && (
        <form onSubmit={handleCreateTopic} className="p-4 rounded-xl bg-white dark:bg-gray-800 border space-y-3 max-w-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white">Add Topic</h4>
          <div><label className={label}>Unit ID *</label><input type="number" className={input} required value={topicForm.unit_id} onChange={(e) => setTopicForm(p => ({...p, unit_id: e.target.value}))} /></div>
          <div><label className={label}>Topic Title *</label><input className={input} required value={topicForm.title} onChange={(e) => setTopicForm(p => ({...p, title: e.target.value}))} /></div>
          <div><label className={label}>Notes (optional)</label><textarea rows={3} className={input} value={topicForm.notes} onChange={(e) => setTopicForm(p => ({...p, notes: e.target.value}))} /></div>
          <div><label className={label}>YouTube Video ID (optional)</label><input className={input} value={topicForm.youtube_video_id} onChange={(e) => setTopicForm(p => ({...p, youtube_video_id: e.target.value}))} placeholder="e.g. dQw4w9WgXcQ" /></div>
          <button type="submit" className={btn}>Add Topic</button>
        </form>
      )}

      {/* ── Tests ── */}
      {tab === 'tests' && (
        <form onSubmit={handleCreateTest} className="p-4 rounded-xl bg-white dark:bg-gray-800 border space-y-3 max-w-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white">Add Test</h4>
          <div><label className={label}>Course *</label>
            <select className={input} required value={testForm.course_id} onChange={(e) => setTestForm(p => ({...p, course_id: e.target.value}))}>
              <option value="">Select Course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>[{c.course_code}] {c.course_name}</option>)}
            </select>
          </div>
          <div><label className={label}>Test Title *</label><input className={input} required value={testForm.title} onChange={(e) => setTestForm(p => ({...p, title: e.target.value}))} /></div>
          <div><label className={label}>Test Type</label>
            <select className={input} value={testForm.test_type} onChange={(e) => setTestForm(p => ({...p, test_type: e.target.value}))}>
              {['Unit', 'Practice', 'Pre-CAT', 'Mock', 'Revision', 'Final'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button type="submit" className={btn}>Add Test</button>
        </form>
      )}

      {/* ── Questions ── */}
      {tab === 'questions' && (
        <form onSubmit={handleCreateQuestion} className="p-4 rounded-xl bg-white dark:bg-gray-800 border space-y-3 max-w-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white">Add Question</h4>
          <div><label className={label}>Test ID *</label><input type="number" className={input} required value={qForm.test_id} onChange={(e) => setQForm(p => ({...p, test_id: e.target.value}))} /></div>
          <div><label className={label}>Question Type</label>
            <select className={input} value={qForm.question_type} onChange={(e) => setQForm(p => ({...p, question_type: e.target.value}))}>
              {['MCQ', 'TrueFalse', 'ShortAnswer'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div><label className={label}>Question Text *</label><textarea rows={3} className={input} required value={qForm.question_text} onChange={(e) => setQForm(p => ({...p, question_text: e.target.value}))} /></div>
          {qForm.question_type === 'MCQ' && (
            <div><label className={label}>Options (JSON array, e.g. ["A","B","C","D"])</label><input className={input} value={qForm.options} onChange={(e) => setQForm(p => ({...p, options: e.target.value}))} /></div>
          )}
          <div><label className={label}>Correct Answer *</label><input className={input} required value={qForm.correct_answer} onChange={(e) => setQForm(p => ({...p, correct_answer: e.target.value}))} /></div>
          <div><label className={label}>Topic ID (optional)</label><input type="number" className={input} value={qForm.topic_id} onChange={(e) => setQForm(p => ({...p, topic_id: e.target.value}))} /></div>
          <button type="submit" className={btn}>Add Question</button>
        </form>
      )}
    </div>
  )
}
