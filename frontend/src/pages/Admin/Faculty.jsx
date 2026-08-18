import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function Faculty() {
  const { api } = useAdminAuth()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [resetModal, setResetModal] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'staff', department: '' })
  const [addMsg, setAddMsg] = useState('')
  const [editingStaff, setEditingStaff] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin-auth/staff')
      setStaff(res.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAddOrEdit = async (e) => {
    e.preventDefault()
    setAddMsg('')
    try {
      if (editingStaff) {
        // Edit mode (exclude password if empty)
        const payload = { full_name: form.full_name, email: form.email, role: form.role, department: form.department }
        await api.put(`/admin-auth/staff/${editingStaff.id}`, payload)
        setAddMsg('Staff member updated successfully!')
      } else {
        // Add mode
        await api.post('/admin-auth/staff', form)
        setAddMsg('Staff member added successfully!')
      }
      setForm({ full_name: '', email: '', password: '', role: 'staff', department: '' })
      setEditingStaff(null)
      setShowAdd(false)
      load()
    } catch (e) {
      setAddMsg('Error: ' + (e.response?.data?.detail || e.message))
    }
  }

  const openEdit = (s) => {
    setEditingStaff(s)
    setForm({ full_name: s.full_name, email: s.email, password: '', role: s.role.toLowerCase(), department: s.department || '' })
    setShowAdd(true)
    setAddMsg('')
  }

  const handleToggle = async (s) => {
    try {
      await api.put(`/admin-auth/staff/${s.id}`, { is_active: !s.is_active })
      load()
    } catch (e) { alert('Failed: ' + (e.response?.data?.detail || e.message)) }
  }

  const handleDelete = async (s) => {
    if (!confirm(`Delete ${s.full_name}? This cannot be undone.`)) return
    try {
      await api.delete(`/admin-auth/staff/${s.id}`)
      load()
    } catch (e) { alert('Failed: ' + (e.response?.data?.detail || e.message)) }
  }

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !resetModal) return
    try {
      await api.put(`/admin/staff/${resetModal.id}/reset-password`, { new_password: newPassword })
      setResetMsg(`Password reset for ${resetModal.name}!`)
      setNewPassword('')
      setTimeout(() => { setResetModal(null); setResetMsg('') }, 1500)
    } catch (e) {
      setResetMsg('Failed: ' + (e.response?.data?.detail || e.message))
    }
  }

  const roleBadge = (role) => {
    const map = { admin: 'bg-purple-100 text-purple-700', hod: 'bg-indigo-100 text-indigo-700', professor: 'bg-blue-100 text-blue-700', 'assistant professor': 'bg-cyan-100 text-cyan-700', 'lab assistant': 'bg-emerald-100 text-emerald-700', staff: 'bg-slate-100 text-slate-600' }
    return map[role?.toLowerCase()] || 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <PageHeader title="Faculty & Staff Management" description={`${staff.length} staff members`} />
        <button onClick={() => { setEditingStaff(null); setForm({ full_name: '', email: '', password: '', role: 'staff', department: '' }); setShowAdd(!showAdd); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
          + Add Staff
        </button>
      </div>

      {showAdd && (
        <Card p="p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4">{editingStaff ? 'Edit Staff / Faculty' : 'Add New Staff / Faculty'}</h3>
          <form onSubmit={handleAddOrEdit} className="grid grid-cols-2 gap-3">
            {[['Full Name *', 'full_name', 'text', 'Dr. Kapil Sharma'], ['Email *', 'email', 'email', 'kapil@college.edu'], [editingStaff ? 'Password (leave blank to keep)' : 'Password *', 'password', 'password', 'Min 6 chars'], ['Department', 'department', 'text', 'AIDS']].map(([label, name, type, ph]) => (
              <div key={name}>
                <label className="text-xs font-semibold text-slate-500 block mb-1">{label}</label>
                <input type={type} required={label.includes('*')} placeholder={ph} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Role *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100">
                <option value="staff">Staff</option>
                <option value="assistant professor">Assistant Professor</option>
                <option value="professor">Professor</option>
                <option value="hod">HOD</option>
                <option value="lab assistant">Lab Assistant</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {addMsg && <div className={`col-span-2 text-xs px-3 py-2 rounded-lg ${addMsg.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{addMsg}</div>}
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold">{editingStaff ? 'Update Staff' : 'Add Staff'}</button>
              <button type="button" onClick={() => { setShowAdd(false); setEditingStaff(null); }} className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </Card>
      )}

      {/* Table */}
      <Card p="p-0" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['#', 'Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">Loading staff…</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">No staff found.</td></tr>
              ) : staff.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{s.full_name}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold capitalize ${roleBadge(s.role)}`}>{s.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{s.department || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(s)} className={`px-2.5 py-0.5 rounded-md text-xs font-bold cursor-pointer transition ${s.is_active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
                      {s.is_active ? '● Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => openEdit(s)} className="px-2 py-1 text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-100">✏️ Edit</button>
                      <button onClick={() => setResetModal({ id: s.id, name: s.full_name })} className="px-2 py-1 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-100">🔑 Pwd</button>
                      <button onClick={() => handleDelete(s)} className="px-2 py-1 text-xs font-semibold bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
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
            <h3 className="font-bold text-slate-900 text-base mb-1">Reset Staff Password</h3>
            <p className="text-sm text-slate-500 mb-4">Setting new password for <strong>{resetModal.name}</strong></p>
            <input type="password" placeholder="New password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 mb-3" />
            {resetMsg && <p className={`text-xs mb-3 ${resetMsg.startsWith('Failed') ? 'text-red-600' : 'text-emerald-600'}`}>{resetMsg}</p>}
            <div className="flex gap-2">
              <button onClick={handleResetPassword} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-bold">Reset</button>
              <button onClick={() => { setResetModal(null); setNewPassword(''); setResetMsg('') }} className="flex-1 border border-slate-300 rounded-lg py-2.5 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
