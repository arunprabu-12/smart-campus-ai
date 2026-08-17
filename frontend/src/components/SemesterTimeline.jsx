/** Spec section 2, 15 — semester lock/progress indicators. */
const STATUS_CONFIG = {
  completed: {
    icon: '✓',
    label: 'Completed',
    dotClass: 'bg-green-500',
    textClass: 'text-green-700 dark:text-green-400',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  in_progress: {
    icon: '●',
    label: 'In Progress',
    dotClass: 'bg-blue-500 animate-pulse',
    textClass: 'text-blue-700 dark:text-blue-400',
    badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  locked: {
    icon: '🔒',
    label: 'Locked',
    dotClass: 'bg-gray-300 dark:bg-gray-600',
    textClass: 'text-gray-400 dark:text-gray-500',
    badgeClass: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  },
}

export default function SemesterTimeline({ semesters = [] }) {
  return (
    <div className="space-y-2">
      {semesters.map((s) => {
        const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.locked
        return (
          <div key={s.number} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center gap-3">
              <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dotClass}`} />
              <span className={`text-sm font-medium ${cfg.textClass}`}>Semester {s.number}</span>
            </div>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg.badgeClass}`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
