/** Spec section 7 — Tests page: lists tests and launches TestRunner. */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { getDashboard } from '../api/students'
import { getCoursesForSemester } from '../api/courses'
import { getTests } from '../api/tests'
import TestRunner from '../components/TestRunner'
import apiClient from '../api/client'

const TYPE_COLORS = {
  'Practice': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Unit': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Mock': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Pre-CAT': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'Revision': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Final': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
}

export default function Tests() {
  const [searchParams] = useSearchParams()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTest, setSelectedTest] = useState(null)
  const [lastResult, setLastResult] = useState(null)
  const [lastAttemptId, setLastAttemptId] = useState(null)
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || '')
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

  if (selectedTest) {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => { setSelectedTest(null); setLastResult(null) }}
          className="mb-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1"
        >
          ← Back to Tests
        </button>
        <TestRunner
          test={selectedTest}
          onComplete={(result, attemptId) => {
            setLastResult(result)
            setLastAttemptId(attemptId)
            setSelectedTest(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex justify-center w-full">
      <div className="space-y-6 w-full max-w-3xl px-4 md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tests</h2>
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

      {/* Last result banner */}
      {lastResult && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Last Test Result</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><p className="text-gray-500 dark:text-gray-400">Score</p><p className="text-xl font-bold text-green-700 dark:text-green-300">{lastResult.score}/{lastResult.total_questions}</p></div>
            <div><p className="text-gray-500 dark:text-gray-400">Percentage</p><p className="text-xl font-bold text-green-700 dark:text-green-300">{lastResult.percentage}%</p></div>
            <div><p className="text-gray-500 dark:text-gray-400">Performance</p><p className="text-xl font-bold text-green-700 dark:text-green-300">{lastResult.performance_label}</p></div>
          </div>
          {lastResult.weak_topics?.length > 0 && (
            <div className="mt-2 text-xs text-orange-700 dark:text-orange-400">
              ⚠ Weak topics: {lastResult.weak_topics.join(', ')}
            </div>
          )}
          {lastAttemptId && (
            <button
              onClick={() => navigate(`/tests/report/${lastAttemptId}`)}
              id={`view-report-${lastAttemptId}`}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              📊 View Detailed Report
            </button>
          )}
        </div>
      )}

      {viewMode === 'doc' ? (
        loadingDoc ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
        ) : docBank.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No tests extracted from document.</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 p-4 rounded-xl text-sm border border-purple-100 dark:border-purple-800">
              ℹ️ These test questions are fetched directly from <b>AI_DS_Assignment_Question_Bank_Set_2-1.docx</b>
            </div>
            {docBank.map((course, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{course.course_name} Test Bank</h3>
                </div>
                <div className="p-6 space-y-8">
                  {course.units.map((unit, uIdx) => (
                    <div key={uIdx} className="space-y-4">
                      <h4 className="font-semibold text-purple-600 dark:text-purple-400 border-b border-gray-100 dark:border-gray-700 pb-2">{unit.unit_name}</h4>
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
                              <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-sm rounded-lg border border-purple-100 dark:border-purple-800">
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
        ) : tests.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-3">📝</p>
            <p>No tests found for this course.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {tests.map((test) => (
              <div key={test.id} className="p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{test.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[test.test_type] || 'bg-gray-100 text-gray-600'}`}>
                      {test.test_type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {test.questions?.length || 0} questions
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTest(test)}
                  id={`start-test-${test.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )
      )}
      </div>
    </div>
  )
}
