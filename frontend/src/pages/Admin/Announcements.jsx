import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'All students',
    priority: 'Normal',
    scheduledDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('admin_announcements') || '[]')
    if (stored.length > 0) {
      setAnnouncements(stored)
    } else {
      const initial = [
        { id: 1, title: 'Semester 5 Mid-Term Examination Schedule', message: 'The official schedule for Sem 5 Mid-Terms has been released. Check your student portal calendar.', target: 'All students', priority: 'High', date: '2026-08-18' },
        { id: 2, title: 'Department Faculty Meeting for Curriculum Review', message: 'All AIDS faculty are requested to attend the curriculum alignment meeting at 3:00 PM in Conference Room A.', target: 'Faculty', priority: 'Normal', date: '2026-08-19' },
      ]
      setAnnouncements(initial)
      localStorage.setItem('admin_announcements', JSON.stringify(initial))
    }
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    const newAnn = { id: Date.now(), ...formData, date: formData.scheduledDate }
    const updated = [newAnn, ...announcements]
    setAnnouncements(updated)
    localStorage.setItem('admin_announcements', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    setShowAddModal(false)
    alert('Announcement published successfully across the platform!')
  }

  const handleDelete = () => {
    if (!announcementToDelete) return
    const updated = announcements.filter(a => a.id !== announcementToDelete.id)
    setAnnouncements(updated)
    localStorage.setItem('admin_announcements', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
    setAnnouncementToDelete(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements & Notices"
        description="Broadcast official announcements to students, faculty, or specific academic cohorts."
        action={
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            + Create Announcement
          </Button>
        }
      />

      <div className="space-y-4">
        {announcements.map(ann => (
          <Card key={ann.id} p="p-5" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{ann.title}</h4>
                <Badge variant={ann.priority === 'High' ? 'danger' : 'info'}>{ann.priority}</Badge>
                <Badge variant="neutral">Target: {ann.target}</Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{ann.message}</p>
              <p className="text-xs text-slate-400 font-mono pt-1">Date: {ann.date}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="danger"
                size="sm"
                onClick={() => { setAnnouncementToDelete(ann); setShowDeleteConfirm(true); }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal isOpen={true} onClose={() => setShowAddModal(false)} title="Create Announcement">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Title</label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. End Semester Exam Registration" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Announcement Message</label>
              <textarea
                required
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write message contents..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Target Audience</label>
                <Select value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })}>
                  <option value="All students">All students</option>
                  <option value="AIDS Department">AIDS Department</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Priority</label>
                <Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Publish Announcement</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${announcementToDelete?.title}"?`}
        confirmLabel="Delete"
        isDanger={true}
      />
    </div>
  )
}
