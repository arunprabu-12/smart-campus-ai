/** Spec section 16 — Admin: student management table. */
import { useState, useEffect } from 'react'
import { adminGetStudents } from '../../api/admin'

export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminGetStudents()
      .then((r) => setStudents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.register_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.college_email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, register number, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} students</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/></div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {['ID', 'Name', 'Register No.', 'Email', 'Dept', 'Semester', 'CGPA'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((s) => (
                <tr key={s.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{s.full_name}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-300">{s.register_number}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.college_email}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.department_id}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-xs font-medium">
                      Sem {s.current_semester}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{s.cgpa?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No students found.</div>
          )}
        </div>
      )}
    </div>
  )
}
