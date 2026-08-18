import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAssignments, submitAssignment } from '../api/assignments'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import apiClient from '../api/client'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { EmptyState } from '../components/ui/EmptyState'

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
  const badgeVariant = submitted ? 'success' : 'warning'

  return (
    <Card p="p-5" className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug">{assignment.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {questions.length} question{questions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Badge variant={badgeVariant}>{status}</Badge>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Questions ▲' : 'View Questions ▼'}
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {idx + 1}. {q.text || q}
              </p>
              <textarea
                rows={3}
                disabled={submitted}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-50 dark:disabled:bg-slate-800/50"
                placeholder="Write your answer here..."
                value={answers[idx] || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
              />
            </div>
          ))}
          {!submitted ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          ) : (
            <div className="text-center py-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              ✓ Assignment submitted successfully!
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default function Assignments() {
  const [searchParams] = useSearchParams()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || '')
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCount = assignments.length
  const pendingCount = assignments.length // Default active state

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Manage and submit your course assignments."
      >
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('db')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'db'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Database
          </button>
          <button
            onClick={() => setViewMode('doc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'doc'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Document Bank
          </button>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Assigned" value={totalCount} icon="📋" accentColor="text-blue-600" />
        <StatCard label="Pending" value={pendingCount} icon="⏳" accentColor="text-amber-600" />
        <StatCard label="Completed" value={0} icon="✅" accentColor="text-emerald-600" />
        <StatCard label="Evaluated" value={0} icon="⭐" accentColor="text-indigo-600" />
      </div>

      {/* Search & Filter Bar */}
      <Card p="p-4" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Select Course...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Content Section */}
      {viewMode === 'doc' ? (
        loadingDoc ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : docBank.length === 0 ? (
          <EmptyState title="No Question Bank Questions Found" description="Could not extract questions from the document bank." />
        ) : (
          <div className="space-y-6">
            <Card p="p-4" className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-sm">
              ℹ️ Questions parsed dynamically from the academic Question Bank DOCX repository.
            </Card>
            {docBank.map((course, idx) => (
              <Card key={idx} p="p-0" className="overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.course_name}</h3>
                </div>
                <div className="p-6 space-y-6">
                  {course.units.map((unit, uIdx) => (
                    <div key={uIdx} className="space-y-4">
                      <h4 className="font-semibold text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                        {unit.unit_name}
                      </h4>
                      <div className="space-y-3">
                        {unit.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <p className="font-medium text-slate-800 dark:text-slate-200 mb-2">{qIdx + 1}. {q.text}</p>
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className={`p-2 rounded-lg text-sm border ${q.answer && opt.startsWith(q.answer) ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 font-medium' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            {q.type === 'Descriptive' && (
                              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 text-xs rounded-lg border border-blue-100 dark:border-blue-800">
                                <span className="font-semibold">Expected Answer: </span>{q.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <EmptyState title="No Assignments Found" description="There are no active assignments for the selected course." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a} onSubmit={load} />
          ))}
        </div>
      )}
    </div>
  )
}
