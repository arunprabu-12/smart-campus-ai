/** Course card for the dashboard grid. */
export default function CourseCard({ course }) {
  return (
    <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mb-1">{course.course_code}</p>
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-2">{course.course_name}</h4>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">{course.credits} Credits</span>
        <span className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">Study →</span>
      </div>
    </div>
  )
}
