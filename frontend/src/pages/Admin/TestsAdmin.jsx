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

export default function TestsAdmin({ isGeneratorMode = false }) {
  const { api } = useAdminAuth()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [testToDelete, setTestToDelete] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    test_type: 'Unit Test',
    course_name: 'Deep Learning',
    unit: 1,
    duration: 30
  })

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin-auth/tests')
      setTests(res.data || [])
    } catch {
      setTests([
        { id: 1, title: 'Deep Learning — Unit 1 Evaluation', test_type: 'Unit Test', course_name: 'Deep Learning', unit: 1, duration: 30, attemptsCount: 62, status: 'Active' },
        { id: 2, title: 'Generative AI — Unit 1 Assessment', test_type: 'Unit Test', course_name: 'Generative AI', unit: 1, duration: 30, attemptsCount: 58, status: 'Active' },
        { id: 3, title: 'Mid-Semester Comprehensive Exam', test_type: 'Mid-Sem', course_name: 'Agentic AI', unit: 3, duration: 60, attemptsCount: 64, status: 'Active' },
      ])
    }
    setLoading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    const newTest = { id: Date.now(), ...formData, attemptsCount: 0, status: 'Active' }
    setTests(prev => [newTest, ...prev])
    setShowAddModal(false)
    alert('Test published successfully!')
  }

  const handleDelete = () => {
    if (!testToDelete) return
    setTests(prev => prev.filter(t => t.id !== testToDelete.id))
    setTestToDelete(null)
  }

  const columns = [
    {
      key: 'title',
      label: 'Test Title',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.title}</div>
          <div className="text-xs text-slate-500">{row.course_name} · {row.test_type}</div>
        </div>
      )
    },
    { key: 'duration', label: 'Duration', render: (row) => `${row.duration} mins` },
    { key: 'attemptsCount', label: 'Attempts', render: (row) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">{row.attemptsCount || 0}</span> },
    { key: 'status', label: 'Status', render: (row) => <Badge variant="success">{row.status}</Badge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => { setTestToDelete(row); setShowDeleteConfirm(true); }}
        >
          Delete
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={isGeneratorMode ? "AI Test Generator" : "Tests & Question Banks"}
        description="Create, generate, and manage online tests and evaluation banks."
        action={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Create Test
          </Button>
        }
      />

      <DataTable
        cols={columns}
        data={tests}
        searchKey="title"
        placeholder="Search test title or course..."
      />

      {/* Add Modal */}
      {showAddModal && (
        <Modal isOpen={true} onClose={() => setShowAddModal(false)} title="Create New Test">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Title</label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Unit 2 Quiz" />
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
                <label className="text-xs font-semibold text-slate-500 block mb-1">Duration (Minutes)</label>
                <Input type="number" min="10" max="180" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Publish Test</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Test"
        message={`Are you sure you want to delete "${testToDelete?.title}"?`}
        confirmLabel="Delete"
        isDanger={true}
      />
    </div>
  )
}
