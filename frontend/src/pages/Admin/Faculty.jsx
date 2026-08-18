import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { DataTable } from '../../components/ui/DataTable'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

export default function Faculty() {
  const { api } = useAdminAuth()
  const navigate = useNavigate()
  const [facultyList, setFacultyList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deptFilter, setDeptFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [facultyToToggle, setFacultyToToggle] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Assistant Professor',
    department: 'AIDS',
    subjects: 'Deep Learning, ML',
    workload: '14 hrs/week',
    status: 'Active'
  })

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin-auth/staff-assignments')
      setFacultyList(res.data || [])
    } catch {
      setFacultyList([
        { id: 1, name: 'Kapil Dev', role: 'Professor & HOD', email: 'kapil@college.edu', department: 'AIDS', subjects: 'Deep Learning, Machine Learning, NLP', workload: '16 hrs/week', status: 'Active' },
        { id: 2, name: 'Jayasree M', role: 'Associate Professor', email: 'jayasree@college.edu', department: 'AIDS', subjects: 'Mathematics, GenAI', workload: '14 hrs/week', status: 'Active' },
        { id: 3, name: 'Madhubala K', role: 'Assistant Professor', email: 'madhubala@college.edu', department: 'AIDS', subjects: 'Agentic AI Systems', workload: '12 hrs/week', status: 'Active' },
        { id: 4, name: 'Selvarani R', role: 'Assistant Professor', email: 'selvarani@college.edu', department: 'AIDS', subjects: 'Manufacturing Systems, Big Data', workload: '15 hrs/week', status: 'Active' },
        { id: 5, name: 'Divya S', role: 'Assistant Professor', email: 'divyas@college.edu', department: 'AIDS', subjects: 'Cloud Computing Infrastructure', workload: '13 hrs/week', status: 'Active' },
      ])
    }
    setLoading(false)
  }

  const handleSaveFaculty = (e) => {
    e.preventDefault()
    const newFac = { id: Date.now(), ...formData }
    setFacultyList(prev => [newFac, ...prev])
    setShowAddModal(false)
    alert('Faculty profile added successfully!')
  }

  const handleToggleStatus = () => {
    if (!facultyToToggle) return
    setFacultyList(prev => prev.map(f => f.id === facultyToToggle.id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f))
    setFacultyToToggle(null)
  }

  const filtered = facultyList.filter(f => !deptFilter || f.department === deptFilter)

  const columns = [
    {
      key: 'name',
      label: 'Faculty',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-slate-500">{row.role} · {row.email}</div>
        </div>
      )
    },
    { key: 'department', label: 'Department' },
    { key: 'subjects', label: 'Assigned Subjects' },
    { key: 'workload', label: 'Workload', render: (row) => <span className="font-semibold text-indigo-600 dark:text-indigo-400">{row.workload}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>{row.status}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button
          variant={row.status === 'Active' ? 'danger' : 'secondary'}
          size="sm"
          onClick={() => { setFacultyToToggle(row); setShowDeactivateConfirm(true); }}
        >
          {row.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty & Staff Management"
        description="Manage faculty profiles, roles, course allocations, and workload balancing."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/ai/faculty-allocation')}>
              🤖 AI Faculty Allocation
            </Button>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              + Add Faculty
            </Button>
          </div>
        }
      />

      {/* Filter */}
      <Card p="p-4" className="w-full sm:w-64">
        <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          <option value="AIDS">AIDS</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </Select>
      </Card>

      {/* Table */}
      <DataTable
        cols={columns}
        data={filtered}
        searchKey="name"
        placeholder="Search faculty name or subject..."
      />

      {/* Add Modal */}
      {showAddModal && (
        <Modal isOpen={true} onClose={() => setShowAddModal(false)} title="Add Faculty Member">
          <form onSubmit={handleSaveFaculty} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name</label>
              <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Dr. Kumar" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Email</label>
              <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. kumar@college.edu" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Role / Designation</label>
                <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="Professor & HOD">Professor & HOD</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Department</label>
                <Select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Assigned Subjects</label>
              <Input required value={formData.subjects} onChange={(e) => setFormData({ ...formData, subjects: e.target.value })} placeholder="e.g. Machine Learning, NLP" />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Add Faculty Member</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeactivateConfirm}
        onClose={() => setShowDeactivateConfirm(false)}
        onConfirm={handleToggleStatus}
        title="Toggle Status"
        message={`Are you sure you want to ${facultyToToggle?.status === 'Active' ? 'deactivate' : 'activate'} ${facultyToToggle?.name}?`}
        confirmLabel={facultyToToggle?.status === 'Active' ? 'Deactivate' : 'Activate'}
        isDanger={facultyToToggle?.status === 'Active'}
      />
    </div>
  )
}
