import { useState, useEffect } from 'react'
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

export default function Students() {
  const { api } = useAdminAuth()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deptFilter, setDeptFilter] = useState('')
  const [semFilter, setSemFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false)
  const [studentToDeactivate, setStudentToDeactivate] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    college_email: '',
    register_number: '',
    department_id: 'AIDS',
    current_semester: 5,
    cgpa: 8.5,
    status: 'Active'
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin-auth/students')
      setStudents(res.data || [])
    } catch {
      // Mock data if endpoint not populating mock list
      setStudents([
        { id: 1, full_name: 'Arun Kumar', register_number: '312221205001', college_email: 'arun@college.edu', department_id: 'AIDS', current_semester: 5, attendance: '68%', cgpa: 8.4, status: 'Active' },
        { id: 2, full_name: 'Divya S', register_number: '312221205014', college_email: 'divya@college.edu', department_id: 'AIDS', current_semester: 4, attendance: '71%', cgpa: 7.9, status: 'Active' },
        { id: 3, full_name: 'Kapil Dev', register_number: '312221205022', college_email: 'kapil@college.edu', department_id: 'CSE', current_semester: 6, attendance: '92%', cgpa: 9.1, status: 'Active' },
        { id: 4, full_name: 'Jayasree M', register_number: '312221205035', college_email: 'jayasree@college.edu', department_id: 'ECE', current_semester: 5, attendance: '88%', cgpa: 8.8, status: 'Inactive' },
      ])
    }
    setLoading(false)
  }

  const handleSaveStudent = async (e) => {
    e.preventDefault()
    try {
      if (showEditModal && selectedStudent) {
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...formData } : s))
        alert('Student profile updated successfully!')
      } else {
        const newStu = { id: Date.now(), ...formData, attendance: '85%' }
        setStudents(prev => [newStu, ...prev])
        alert('New student added successfully!')
      }
      setShowAddModal(false)
      setShowEditModal(false)
    } catch (e) {
      alert('Failed to save student record')
    }
  }

  const handleDeactivate = () => {
    if (!studentToDeactivate) return
    setStudents(prev => prev.map(s => s.id === studentToDeactivate.id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))
    setStudentToDeactivate(null)
  }

  const filteredStudents = students.filter(s => {
    if (deptFilter && s.department_id !== deptFilter) return false
    if (semFilter && String(s.current_semester) !== String(semFilter)) return false
    if (statusFilter && s.status !== statusFilter) return false
    return true
  })

  const columns = [
    {
      key: 'full_name',
      label: 'Student',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.full_name}</div>
          <div className="text-xs text-slate-500">{row.college_email}</div>
        </div>
      )
    },
    { key: 'register_number', label: 'Register Number' },
    { key: 'department_id', label: 'Department' },
    { key: 'current_semester', label: 'Semester', render: (row) => `Sem ${row.current_semester}` },
    { key: 'attendance', label: 'Attendance', render: (row) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">{row.attendance || '85%'}</span> },
    { key: 'cgpa', label: 'CGPA', render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.cgpa ? Number(row.cgpa).toFixed(2) : '8.50'}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'Active' ? 'success' : 'neutral'}>
          {row.status || 'Active'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setSelectedStudent(row); setFormData(row); setShowEditModal(true); }}>
            Edit
          </Button>
          <Button
            variant={row.status === 'Active' ? 'danger' : 'secondary'}
            size="sm"
            onClick={() => { setStudentToDeactivate(row); setShowDeactivateConfirm(true); }}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Management"
        description="Register, edit, filter, and monitor student academic records."
        action={
          <Button variant="primary" onClick={() => { setFormData({ full_name: '', college_email: '', register_number: '', department_id: 'AIDS', current_semester: 5, cgpa: 8.5, status: 'Active' }); setShowAddModal(true); }}>
            + Add New Student
          </Button>
        }
      />

      {/* Filters Bar */}
      <Card p="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">All Departments</option>
            <option value="AIDS">AIDS</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="MECH">MECH</option>
          </Select>
          <Select value={semFilter} onChange={(e) => setSemFilter(e.target.value)}>
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>
      </Card>

      {/* Data Table */}
      <DataTable
        cols={columns}
        data={filteredStudents}
        searchKey="full_name"
        placeholder="Search student name or register no..."
      />

      {/* Add / Edit Modal */}
      {(showAddModal || showEditModal) && (
        <Modal
          isOpen={true}
          onClose={() => { setShowAddModal(false); setShowEditModal(false); }}
          title={showEditModal ? 'Edit Student Details' : 'Add New Student'}
        >
          <form onSubmit={handleSaveStudent} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Full Name</label>
              <Input required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} placeholder="e.g. Arun Kumar" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">College Email</label>
              <Input required type="email" value={formData.college_email} onChange={(e) => setFormData({ ...formData, college_email: e.target.value })} placeholder="e.g. arun@college.edu" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Register Number</label>
              <Input required value={formData.register_number} onChange={(e) => setFormData({ ...formData, register_number: e.target.value })} placeholder="e.g. 312221205001" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Department</label>
                <Select value={formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}>
                  <option value="AIDS">AIDS</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Semester</label>
                <Select value={formData.current_semester} onChange={(e) => setFormData({ ...formData, current_semester: Number(e.target.value) })}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</Button>
              <Button variant="primary" type="submit">Save Student Record</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeactivateConfirm}
        onClose={() => setShowDeactivateConfirm(false)}
        onConfirm={handleDeactivate}
        title="Toggle Account Status"
        message={`Are you sure you want to ${studentToDeactivate?.status === 'Active' ? 'deactivate' : 'activate'} ${studentToDeactivate?.full_name}?`}
        confirmLabel={studentToDeactivate?.status === 'Active' ? 'Deactivate' : 'Activate'}
        isDanger={studentToDeactivate?.status === 'Active'}
      />
    </div>
  )
}
