/** Spec section 15 — visual academic journey from Semester 1 → Graduation. */
import { useState, useEffect } from 'react'
import { getDashboard } from '../api/students'

const STATUS_CONFIG = {
  completed: { icon: '✓', label: 'Completed', color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-400', borderColor: 'border-green-500', lineColor: 'bg-green-500' },
  in_progress: { icon: '●', label: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-400', borderColor: 'border-blue-500', lineColor: 'bg-blue-500' },
  locked: { icon: '🔒', label: 'Locked', color: 'bg-gray-300 dark:bg-gray-600', textColor: 'text-gray-400 dark:text-gray-500', borderColor: 'border-gray-300 dark:border-gray-600', lineColor: 'bg-gray-300 dark:bg-gray-600' },
}

export default function AcademicJourney() {
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((r) => setSemesters(r.data.semester_statuses || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/></div>

  const allCompleted = semesters.length > 0 && semesters.every((s) => s.status === 'completed')

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Academic Journey</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Your path from Semester 1 to Graduation</p>

      <div className="relative">
        {semesters.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            No curriculum mapping found for your regulation.
          </div>
        ) : (
          semesters.map((sem, idx) => {
          const cfg = STATUS_CONFIG[sem.status] || STATUS_CONFIG.locked
          const isLast = idx === semesters.length - 1

          return (
            <div key={sem.number} className="flex gap-4">
              {/* Timeline spine */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 ${cfg.borderColor} flex items-center justify-center text-sm font-bold bg-white dark:bg-gray-900 ${cfg.textColor} flex-shrink-0 shadow-md`}>
                  {sem.status === 'locked' ? '🔒' : sem.status === 'completed' ? '✓' : `S${sem.number}`}
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-12 mt-1 ${cfg.lineColor}`} />
                )}
              </div>

              {/* Card */}
              <div className={`mb-4 flex-1 p-4 rounded-xl border ${sem.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : sem.status === 'in_progress' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${cfg.textColor}`}>Semester {sem.number}</p>
                    {sem.status === 'completed' && sem.sgpa != null && (
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-medium">SGPA: {sem.sgpa.toFixed(2)}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sem.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : sem.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            </div>
          )
        }))}

        {/* Graduation node */}
        {semesters.length > 0 && (
          <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg ${allCompleted ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              🎓
            </div>
          </div>
          <div className={`flex-1 p-4 rounded-xl border ${allCompleted ? 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
            <p className={`font-bold text-lg ${allCompleted ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`}>
              Graduation
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {allCompleted ? '🎉 Congratulations! All semesters completed.' : 'Complete all semesters to graduate'}
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
