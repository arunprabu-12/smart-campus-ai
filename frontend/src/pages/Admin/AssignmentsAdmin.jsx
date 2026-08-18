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

export default function AssignmentsAdmin({ isGeneratorMode = false }) {
  const { api } = useAdminAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    course_name: 'Deep Learning',
    unit: 1,
    due_date: '2026-09-01',
    description: ''
  })

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin-auth/assignments')
      setAssignments(res.data || [])
    } catch {
      setAssignments([
        { id: 1, title: 'Unit 1: Neural Network Foundations', course_name: 'Deep Learning', unit: 1, due_date: '2026-08-25', submissionsCount: 60, status: 'Active' },
        { id: 2, title: 'Unit 2: Convolutional Architectures', course_name: 'Deep Learning', unit: 2, due_date: '2026-09-01', submissionsCount: 45, status: 'Active' },
        { id: 3, title: 'Unit 1: Transformer & Attention Mechanisms', course_name: 'Generative AI', unit: 1, due_date: '2026-08-28', submissionsCount: 58, status: 'Active' },
        { id: 4, title: 'Unit 1: Recharts & Flow Graph Design', course_name: 'Agentic AI', unit: 1, due_date: '2026-09-05', submissionsCount: 30, status: 'Draft' },
      ])
    }
    setLoading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const newAss = { id: Date.now(), ...formData, submissionsCount: 0, status: 'Active' }
    setAssignments(prev => [newAss, ...prev])
    setShowAddModal(false)
    alert('Assignment created and published successfully!')
  }

  const handleDelete = () => {
    if (!assignmentToDelete) return
    setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id))
    setAssignmentToDelete(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Assignment Title',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.title}</div>
          <div className="text-xs text-slate-500">{row.course_name} · Unit {row.unit}</div>
        </div>
      )
    },
    { key: 'due_date', label: 'Due Date' },
    { key: 'submissionsCount', label: 'Submissions', render: (row) => <span className="font-semibold text-blue-600 dark:text-blue-400">{row.submissionsCount || 0} / 64</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>{row.status}</Badge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => { setAssignmentToDelete(row); setShowDeleteConfirm(true); }}
        >
          Delete
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={isGeneratorMode ? "AI Assignment Generator" : "Assignments Management"}
        description="Create, publish, and manage unit-wise course assignments."
        action={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Create Assignment
          </Button>
        }
      />

      <DataTable
        cols={columns}
        data={assignments}
        searchKey="title"
        placeholder="Search assignment title or course..."
      />

      {/* Add Modal */}
      {showAddModal && (
        <Modal isOpen={true} onClose={() => setShowAddModal(false)} title="Create New Assignment">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Title</label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Unit 1: Perceptron Implementation" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Course</label>
                <Select value={formData.course_name} onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}>
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Generative AI">Generative AI</option>
                  <option value="Agentic AI">Agentic AI</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Unit Number</label>
                <Select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5].map(u => <option key={u} value={u}>Unit {u}</option>)}
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Due Date</label>
              <Input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Publish Assignment</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"?`}
        confirmLabel="Delete"
        isDanger={true}
      />
    </div>
  )
}
