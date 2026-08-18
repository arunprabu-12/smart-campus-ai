import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AttendanceAdmin() {
  const { api } = useAdminAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/admin/attendance-overview')
        setRecords(res.data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const filtered = records.filter(r =>
    !search || r.full_name.toLowerCase().includes(search.toLowerCase()) || r.register_number.toLowerCase().includes(search.toLowerCase())
  )

  const atRisk = filtered.filter(r => r.at_risk)
  const safe = filtered.filter(r => !r.at_risk)

  const pctColor = (p) => {
    if (p >= 90) return 'text-emerald-600'
    if (p >= 75) return 'text-blue-600'
    if (p >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Attendance Monitoring" description="Real-time attendance overview across all students" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: records.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'At Risk (<75%)', value: records.filter(r => r.at_risk).length, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'Good (≥75%)', value: records.filter(r => !r.at_risk && r.total > 0).length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'No Records', value: records.filter(r => r.total === 0).length, color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
        ].map(({ label, value, color, bg }) => (
          <Card key={label} p="p-4" className={`border ${bg}`}>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card p="p-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or register number…"
          className="w-full sm:w-72 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </Card>

      {/* At-Risk Alert */}
      {atRisk.length > 0 && (
        <Card p="p-4" className="bg-red-50 border border-red-200">
          <p className="text-sm font-bold text-red-700 mb-3">⚠️ {atRisk.length} students below 75% attendance</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {atRisk.slice(0, 9).map(r => (
              <div key={r.student_id} className="bg-white rounded-lg px-3 py-2 border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.full_name}</p>
                  <p className="text-xs text-slate-500">{r.register_number} · {r.department_name}</p>
                </div>
                <span className="text-sm font-black text-red-600">{r.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Full Table */}
      <Card p="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Student', 'Reg. No', 'Department', 'Sem', 'Present', 'Absent', 'Total', 'Attendance %'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400 text-sm">Loading attendance data…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400 text-sm">No records found.</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r.student_id} className={`hover:bg-slate-50 transition-colors ${r.at_risk ? 'bg-red-50/40' : ''}`}>
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.full_name}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{r.register_number}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{r.department_name}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-600">Sem {r.current_semester}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">{r.present}</td>
                  <td className="px-4 py-3 font-bold text-red-500">{r.absent}</td>
                  <td className="px-4 py-3 text-slate-600">{r.total}</td>
                  <td className="px-4 py-3">
                    {r.total === 0 ? (
                      <span className="text-slate-400 text-xs">No data</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${r.percentage >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${r.percentage}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${pctColor(r.percentage)}`}>{r.percentage}%</span>
                        {r.at_risk && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">At Risk</span>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
