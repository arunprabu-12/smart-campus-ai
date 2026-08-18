import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import { getTests } from '../api/tests'
import TestRunner from '../components/TestRunner'
import apiClient from '../api/client'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { EmptyState } from '../components/ui/EmptyState'

export default function Tests() {
  const [searchParams] = useSearchParams()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [lastAttemptId, setLastAttemptId] = useState(null)
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || '')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState('db')
  const [docBank, setDocBank] = useState([])
  const [loadingDoc, setLoadingDoc] = useState(false)

  const loadDocBank = async () => {
    if (docBank.length > 0) return;
    setLoadingDoc(true)
    try {
      const res = await apiClient.get('/question-bank/tests')
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
      const res = await getTests(courseId)
      setTests(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [courseId])

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedTest) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Test: ${selectedTest.title}`}
          description="Complete your evaluation test."
          action={
            <Button
              variant="outline"
              onClick={() => { setSelectedTest(null); setLastResult(null) }}
            >
              ← Back to Tests
            </Button>
          }
        />
        <Card p="p-6">
          <TestRunner
            test={selectedTest}
            onComplete={(result, attemptId) => {
              setLastResult(result)
              setLastAttemptId(attemptId)
              setSelectedTest(null)
            }}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tests & Assessments"
        description="Practice and evaluate your academic knowledge."
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

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Available" value={tests.length} icon="🧪" accentColor="text-emerald-600" />
        <StatCard label="Completed" value={lastResult ? 1 : 0} icon="✅" accentColor="text-blue-600" />
        <StatCard label="Upcoming" value={0} icon="📅" accentColor="text-purple-600" />
        <StatCard label="Average Score" value={lastResult ? `${lastResult.percentage}%` : 'N/A'} icon="📊" accentColor="text-amber-600" />
      </div>

      {/* Search & Filter Bar */}
      <Card p="p-4" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Select Subject...</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.course_name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Last Result Banner */}
      {lastResult && (
        <Card p="p-5" className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-base mb-3">Recent Test Result</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{lastResult.score}/{lastResult.total_questions}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Percentage</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{lastResult.percentage}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Performance</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">{lastResult.performance_label}</p>
            </div>
          </div>
          {lastResult.weak_topics?.length > 0 && (
            <div className="mt-3 text-xs text-amber-700 dark:text-amber-400 font-medium">
              ⚠ Recommended for revision: {lastResult.weak_topics.join(', ')}
            </div>
          )}
          {lastAttemptId && (
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={() => navigate(`/tests/report/${lastAttemptId}`)}
              >
                📊 View Detailed Evaluation Report
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Test List Section */}
      {viewMode === 'doc' ? (
        loadingDoc ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : docBank.length === 0 ? (
          <EmptyState title="No Test Bank Found" description="Could not extract tests from document bank." />
        ) : (
          <div className="space-y-6">
            <Card p="p-4" className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300 text-sm">
              ℹ️ Document Bank tests parsed dynamically from test repositories.
            </Card>
            {docBank.map((course, idx) => (
              <Card key={idx} p="p-0" className="overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.course_name} Test Bank</h3>
                </div>
                <div className="p-6 space-y-6">
                  {course.units.map((unit, uIdx) => (
                    <div key={uIdx} className="space-y-4">
                      <h4 className="font-semibold text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-700/60 pb-2">
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
                              <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300 text-xs rounded-lg border border-purple-100 dark:border-purple-800">
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
      ) : filteredTests.length === 0 ? (
        <EmptyState title="No Tests Found" description="There are no tests available for this course." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} p="p-5" className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base">{test.title}</h3>
                  <Badge variant="success">{test.test_type || 'Practice'}</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {test.questions?.length || 0} questions · 30 mins
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Status: Available</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedTest(test)}
                >
                  Start Test
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
