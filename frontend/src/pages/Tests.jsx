/** Spec section 7 — Tests page: lists tests and launches TestRunner. */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { getTests } from '../api/tests'
import TestRunner from '../components/TestRunner'

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
  const [courseId, setCourseId] = useState(searchParams.get('courseId') || 5)
  const navigate = useNavigate()

  const load = async () => {
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tests</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Course ID:</label>
          <input
            type="number" min={1} value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
          />
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

      {loading ? (
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
      )}
      </div>
    </div>
  )
}
