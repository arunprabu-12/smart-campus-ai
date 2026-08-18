import { useState } from 'react'
import { Input } from './Input'
import { Button } from './Button'

export function DataTable({ cols, data, searchKey, placeholder = "Search...", pageSize = 8, emptyMsg = "No data found." }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = data ? data.filter(row => {
    if (!query) return true
    if (searchKey) {
      const val = row[searchKey]
      return String(val || '').toLowerCase().includes(query.toLowerCase())
    }
    return JSON.stringify(row).toLowerCase().includes(query.toLowerCase())
  }) : []

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="w-full sm:w-72">
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                {cols.map((c) => (
                  <th key={c.key} className="px-5 py-3.5 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={cols.length} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                    {emptyMsg}
                  </td>
                </tr>
              ) : (
                paginated.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                    {cols.map((c) => (
                      <td key={c.key} className="px-5 py-4 whitespace-nowrap text-slate-700 dark:text-slate-200">
                        {c.render ? c.render(row) : (row[c.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
