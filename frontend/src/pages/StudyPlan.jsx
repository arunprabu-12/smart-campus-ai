/** Spec section 12 — personalized daily study plan. */
import { useState, useEffect } from 'react'
import { getTodayPlan, generateStudyPlan } from '../api/studyplan'

const TYPE_ICONS = {
  revision: '📖',
  assignment: '📋',
  test: '📝',
  general: '🎯',
}

const PRIORITY_COLORS = {
  high: 'border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10',
  medium: 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
  low: 'border-l-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
}

export default function StudyPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    getTodayPlan()
      .then((r) => setPlan(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateStudyPlan('student_current', 'All Courses');
      // Convert the agent output shape to the UI shape
      const generatedItems = res.data.details.plan.map(p => ({
        type: 'revision',
        task: p.topic,
        duration_minutes: p.duration_minutes,
        priority: p.priority
      }));
      setPlan({ items: generatedItems });
    } catch (e) {
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const totalMinutes = plan?.items?.reduce((s, i) => s + (i.duration_minutes || 0), 0) || 0
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  return (
    <div className="flex justify-center w-full">
      <div className="space-y-6 w-full max-w-2xl px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Study Plan</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={generating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
        >
          {generating ? <span className="animate-spin">⏳</span> : <span>✨</span>}
          {generating ? 'Agent is Working...' : 'Generate with AI'}
        </button>
      </div>

      {/* Summary bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between">
        <div>
          <p className="text-indigo-200 text-sm">Total Study Time</p>
          <p className="text-2xl font-bold">{hours > 0 ? `${hours}h ` : ''}{mins}m</p>
        </div>
        <div>
          <p className="text-indigo-200 text-sm">Tasks</p>
          <p className="text-2xl font-bold">{plan?.items?.length || 0}</p>
        </div>
        <div className="text-4xl">📅</div>
      </div>

      {/* Plan items */}
      {plan?.items?.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-4xl mb-3">✅</p>
          <p>You're all caught up! No tasks for today.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plan?.items?.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-4 shadow-sm ${PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.low}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{TYPE_ICONS[item.type] || '📌'}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{item.task}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">{item.type} · {item.priority} priority</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{item.duration_minutes} min</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
        Plan is personalized based on your weak topics and pending assignments.
      </p>
    </div>
  </div>
  )
}
