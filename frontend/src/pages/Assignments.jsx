/** Spec section 6 — assignments with status tracking and submission. */
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAssignments, submitAssignment } from '../api/assignments'
import { useAuth } from '../context/AuthContext'

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
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || 5)

  const load = async () => {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assignments</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Course ID:</label>
          <input
            type="number"
            min={1}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {loading ? (
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
      )}
      </div>
    </div>
  )
}
