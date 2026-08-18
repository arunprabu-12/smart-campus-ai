import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function Students() {
  const { api } = useAdminAuth()
  const [students, setStudents] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterSem, setFilterSem] = useState('')
  const [resetModal, setResetModal] = useState(null) // { id, name }
  const [newPassword, setNewPassword] = useState('')
  const [resetMsg, setResetMsg] = useState('')

  const [editModal, setEditModal] = useState(null) // student object
  const [editForm, setEditForm] = useState({ current_semester: 1, cgpa: 0, section: '', admission_year: 2023 })
  const [editMsg, setEditMsg] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterDept) params.set('department_id', filterDept)
      if (filterSem) params.set('semester', filterSem)
      if (search) params.set('search', search)
      const [studRes, deptRes] = await Promise.all([
        api.get(`/admin/students?${params}`),
        api.get('/admin/departments'),
      ])
      setStudents(studRes.data)
      setDepartments(deptRes.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filterDept, filterSem])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !resetModal) return
    try {
      await api.put(`/admin/students/${resetModal.id}/reset-password`, { new_password: newPassword })
      setResetMsg(`Password reset for ${resetModal.name}!`)
      setNewPassword('')
      setTimeout(() => { setResetModal(null); setResetMsg('') }, 1500)
    } catch (e) {
      setResetMsg('Failed: ' + (e.response?.data?.detail || e.message))
    }
  }

  const openEdit = (s) => {
    setEditModal(s)
    setEditForm({
      current_semester: s.current_semester,
      cgpa: s.cgpa || 0,
      section: s.section || '',
      admission_year: s.admission_year || 2023
    })
    setEditMsg('')
  }

  const handleEditStudent = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/admin/students/${editModal.id}`, {
        current_semester: parseInt(editForm.current_semester),
        cgpa: parseFloat(editForm.cgpa),
        section: editForm.section,
        admission_year: parseInt(editForm.admission_year)
      })
      setEditMsg(`Updated ${editModal.full_name} successfully!`)
      setTimeout(() => { setEditModal(null); setEditMsg(''); load(); }, 1500)
    } catch (e) {
      setEditMsg('Failed: ' + (e.response?.data?.detail || e.message))
    }
  }

  const semBadge = (s) => {
    const colors = ['bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700', 'bg-cyan-100 text-cyan-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-violet-100 text-violet-700', 'bg-pink-100 text-pink-700', 'bg-slate-100 text-slate-700']
    return colors[(s - 1) % 8] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Student Management"
        description={`${students.length} students found · All departments`}
      />

      {/* Filters */}
      <Card p="p-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Search</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Name, email, reg. no…"
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 w-56"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Department</label>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Semester</label>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
              <option value="">All Semesters</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
            Search
          </button>
          <button type="button" onClick={() => { setSearch(''); setFilterDept(''); setFilterSem(''); setTimeout(load, 0) }} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            Clear
          </button>
        </form>
      </Card>

      {/* Table */}
      <Card p="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Name', 'Reg. No', 'Email', 'Department', 'Sem', 'CGPA', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-sm">Loading students…</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-sm">No students found. Try clearing filters.</td></tr>
              ) : students.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.full_name}</td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{s.register_number}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{s.college_email}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{s.department_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${semBadge(s.current_semester)}`}>Sem {s.current_semester}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-600">{s.cgpa?.toFixed(2) || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => openEdit(s)}
                        className="px-2.5 py-1 text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setResetModal({ id: s.id, name: s.full_name })}
                        className="px-2.5 py-1 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100 transition"
                      >
                        🔑 Pwd
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Password Reset Modal */}
      {resetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm mx-4">
            <h3 className="font-bold text-slate-900 text-base mb-1">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-4">Setting new password for <strong>{resetModal.name}</strong></p>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 mb-3"
            />
            {resetMsg && <p className={`text-xs mb-3 ${resetMsg.startsWith('Failed') ? 'text-red-600' : 'text-emerald-600'}`}>{resetMsg}</p>}
            <div className="flex gap-2">
              <button onClick={handleResetPassword} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-bold">
                Reset Password
              </button>
              <button onClick={() => { setResetModal(null); setNewPassword(''); setResetMsg('') }} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm mx-4">
            <h3 className="font-bold text-slate-900 text-base mb-1">Edit Student Details</h3>
            <p className="text-sm text-slate-500 mb-4">Editing <strong>{editModal.full_name}</strong></p>
            <form onSubmit={handleEditStudent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Semester</label>
                <select value={editForm.current_semester} onChange={e => setEditForm({ ...editForm, current_semester: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">CGPA</label>
                <input type="number" step="0.01" value={editForm.cgpa} onChange={e => setEditForm({ ...editForm, cgpa: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Section</label>
                <input type="text" value={editForm.section} onChange={e => setEditForm({ ...editForm, section: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" placeholder="e.g. A" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Admission Year</label>
                <input type="number" value={editForm.admission_year} onChange={e => setEditForm({ ...editForm, admission_year: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              
              {editMsg && <p className={`text-xs mt-2 ${editMsg.startsWith('Failed') ? 'text-red-600' : 'text-emerald-600'}`}>{editMsg}</p>}
              
              <div className="flex gap-2 mt-4">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-bold">
                  Save Changes
                </button>
                <button type="button" onClick={() => { setEditModal(null); setEditMsg('') }} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
