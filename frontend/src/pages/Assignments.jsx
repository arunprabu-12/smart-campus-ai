/** Spec section 6 — assignments with status tracking and submission. */
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAssignments, submitAssignment } from '../api/assignments'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import apiClient from '../api/client'

const STATUS_COLORS = {
  Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Evaluated: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

function AssignmentCard({ assignment, onSubmit }) {
  const [expanded, setExpanded] = useState(false)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  let questions = []
  try { questions = JSON.parse(assignment.questions || '[]') } catch {}

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitAssignment({
        assignment_id: assignment.id,
        answers: JSON.stringify(answers),
      })
      setSubmitted(true)
      onSubmit()
    } catch (e) {
      alert('Submission failed: ' + (e.response?.data?.detail || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  const status = submitted ? 'Submitted' : 'Pending'

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[status]}`}>
            {status}
          </span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          {expanded ? '▲ Hide Questions' : '▼ View Questions'}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-4">
          {questions.map((q, idx) => (
            <div key={idx}>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                {idx + 1}. {q.text || q}
              </p>
              <textarea
                rows={3}
                disabled={submitted}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Write your answer here..."
                value={answers[idx] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
              />
            </div>
          ))}
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          )}
          {submitted && (
            <div className="text-center py-3 text-green-600 dark:text-green-400 text-sm font-medium">
              ✓ Assignment submitted successfully!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Assignments() {
  const { student } = useAuth()
  const [searchParams] = useSearchParams()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || '')

  const [viewMode, setViewMode] = useState('db')
  const [docBank, setDocBank] = useState([])
  const [loadingDoc, setLoadingDoc] = useState(false)

  const loadDocBank = async () => {
    if (docBank.length > 0) return;
    setLoadingDoc(true)
    try {
      const res = await apiClient.get('/question-bank/assignments')
      setDocBank(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingDoc(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'doc') loadDocBank()
  }, [viewMode])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const dashRes = await getDashboard()
        const semesterStatus = dashRes.data.semester_statuses?.find(
          (s) => s.status === 'in_progress'
        )
        if (semesterStatus?.semester_id) {
          const courseRes = await getCoursesForSemester(semesterStatus.semester_id)
          setCourses(courseRes.data)
          if (!searchParams.get('courseId') && courseRes.data.length > 0) {
            setCourseId(courseRes.data[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load courses', err)
      }
    }
    fetchCourses()
  }, [])

  const load = async () => {
    if (!courseId) return
    setLoading(true)
    try {
      const res = await getAssignments(courseId)
      setAssignments(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [courseId])

  return (
    <div className="flex justify-center w-full">
      <div className="space-y-6 w-full max-w-3xl px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h2>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('db')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'db' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Database
              </button>
              <button 
                onClick={() => setViewMode('doc')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'doc' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                Document Bank
              </button>
            </div>
          </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course:</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select a course...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name} ({c.course_code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'doc' ? (
        loadingDoc ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
        ) : docBank.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No questions extracted from document.</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-sm border border-blue-100 dark:border-blue-800">
              ℹ️ These questions are fetched directly and dynamically from the provided Question Bank DOCX file.
            </div>
            {docBank.map((course, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.course_name}</h3>
                </div>
                <div className="p-6 space-y-8">
                  {course.units.map((unit, uIdx) => (
                    <div key={uIdx} className="space-y-4">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 pb-2">{unit.unit_name}</h4>
                      <div className="space-y-4">
                        {unit.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                            <p className="font-medium text-gray-800 dark:text-gray-200 mb-3">{qIdx + 1}. {q.text}</p>
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className={`p-2 rounded-lg text-sm border ${q.answer && opt.startsWith(q.answer) ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            {q.type === 'Descriptive' && (
                              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm rounded-lg border border-blue-100 dark:border-blue-800">
                                <span className="font-semibold">Expected Answer: </span>{q.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p>No assignments found for this course.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} onSubmit={load} />
            ))}
          </div>
        )
      )}
      </div>
    </div>
  )
}
