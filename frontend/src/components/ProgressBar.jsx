/** Reusable progress bar component. */
export default function ProgressBar({ percent = 0, className = '', height = 'h-2' }) {
  const clamped = Math.min(100, Math.max(0, percent))
  const color = clamped >= 80 ? 'bg-green-500' : clamped >= 50 ? 'bg-blue-500' : clamped >= 30 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height} ${className}`}>
      <div
        className={`${color} ${height} rounded-full transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
