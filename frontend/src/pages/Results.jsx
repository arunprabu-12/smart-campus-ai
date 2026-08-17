/** Spec section 9 — Results page with recharts charts. */
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { getResultSummary } from '../api/results'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const PIE_COLORS_GOOD = ['#10b981', '#ef4444'] // strong / weak

export default function Results() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResultSummary()
      .then((r) => setSummary(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  const topicWise = summary?.topic_wise || []
  const testWise = summary?.test_wise || []
  const strongTopics = summary?.strong_topics || []
  const weakTopics = summary?.weak_topics || []
  const latest = summary?.latest_test || {}

  const pieData = [
    { name: 'Strong', value: strongTopics.length || 1 },
    { name: 'Weak', value: weakTopics.length || 0 },
  ]

  return (
    <div className="flex justify-center w-full">
      <div className="space-y-8 w-full max-w-5xl px-4 md:px-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results & Analysis</h2>

      {/* Latest test summary */}
      {latest.score !== undefined && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-4">Latest Test Result</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Score', value: `${latest.score}/${latest.total_questions || '-'}` },
              { label: 'Percentage', value: `${latest.percentage}%` },
              { label: 'Performance', value: latest.label },
              { label: 'Test', value: latest.test_title || '-' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-blue-200 text-xs">{item.label}</p>
                <p className="text-xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts row */}
      {testWise.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Test-Wise Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={testWise}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="test_title" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {topicWise.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Topic-Wise Accuracy</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topicWise} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="topic_name" type="category" tick={{ fontSize: 11 }} width={140} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="accuracy_pct" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {topicWise.map((entry, idx) => (
                  <Cell key={idx} fill={entry.accuracy_pct >= 70 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Strong / Weak topics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3">✓ Strong Topics</h3>
          {strongTopics.length === 0 ? (
            <p className="text-sm text-gray-400">No data yet — take a test!</p>
          ) : (
            <ul className="space-y-1">
              {strongTopics.map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-green-500">✓</span> {t.topic_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">⚠ Weak Topics</h3>
          {weakTopics.length === 0 ? (
            <p className="text-sm text-gray-400">No weak topics identified yet.</p>
          ) : (
            <ul className="space-y-1">
              {weakTopics.map((t, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-red-500">⚠</span> {t.topic_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* No data state */}
      {topicWise.length === 0 && testWise.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-lg font-medium">No results yet</p>
          <p className="text-sm mt-1">Take a test to see your performance analysis here.</p>
        </div>
      )}
      </div>
    </div>
  )
}
