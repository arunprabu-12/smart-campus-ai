import { useState, useEffect } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([])
  const [replyTextMap, setReplyTextMap] = useState({})
  const [filterTo, setFilterTo] = useState('')

  const { api } = useAdminAuth()

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const loadFeedbacks = async () => {
    try {
      const res = await api.get('/admin/feedbacks')
      setFeedbacks(res.data)
    } catch (e) { console.error(e) }
  }

  const handleSendReply = async (idx) => {
    const fb = feedbacks[idx]
    const reply = replyTextMap[idx]
    if (!reply || !reply.trim()) return

    try {
      await api.put(`/admin/feedbacks/${fb.id}/reply`, { reply })
      alert('Official reply sent to student successfully!')
      setReplyTextMap(prev => ({ ...prev, [idx]: '' }))
      loadFeedbacks()
    } catch (e) {
      alert('Failed to send reply')
    }
  }

  const filtered = feedbacks.filter(f => !filterTo || f.to === filterTo)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department & Admin Feedback Center"
        description="Review formal feedback, grievances, and requests submitted by students or staff, and issue official replies."
      />

      <Card p="p-4" className="w-full sm:w-64">
        <Select value={filterTo} onChange={(e) => setFilterTo(e.target.value)}>
          <option value="">All Addressees</option>
          <option value="Admin">Admin</option>
          <option value="HOD">HOD (Head of Department)</option>
          <option value="Department Staff">Department Staff</option>
        </Select>
      </Card>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card p="p-8" className="text-center text-slate-500">
            No feedback entries found.
          </Card>
        ) : (
          filtered.map((item, idx) => (
            <Card key={idx} p="p-5" className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">{item.studentName}</span>
                  <Badge variant="info">To: {item.to || 'Admin'}</Badge>
                </div>
                <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700 font-medium">
                "{item.text}"
              </p>

              {item.reply ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-bold">Official Response: </span>
                  {item.reply}
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type official reply to student..."
                    value={replyTextMap[idx] || ''}
                    onChange={(e) => setReplyTextMap({ ...replyTextMap, [idx]: e.target.value })}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button variant="primary" size="sm" onClick={() => handleSendReply(idx)}>
                    Send Reply
                  </Button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
