import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { StatCard } from '../../components/ui/StatCard'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { AIInsightCard } from '../../components/ui/AIInsightCard'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'

export default function AdminDashboard() {
  const { api } = useAdminAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin-auth/dashboard-stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Academic Performance Chart Data
  const performanceData = [
    { semester: 'Sem 1', sgpa: 8.4, passPct: 92, attendancePct: 89.2 },
    { semester: 'Sem 2', sgpa: 8.1, passPct: 88, attendancePct: 86.5 },
    { semester: 'Sem 3', sgpa: 8.6, passPct: 94, attendancePct: 90.1 },
    { semester: 'Sem 4', sgpa: 7.9, passPct: 82, attendancePct: 78.6 },
    { semester: 'Sem 5', sgpa: 8.3, passPct: 89, attendancePct: 87.4 },
    { semester: 'Sem 6', sgpa: 8.5, passPct: 91, attendancePct: 88.0 },
  ]

  const attentionList = [
    { student: 'Arun Kumar', register: '312221205001', semester: 'Sem 5', attendance: '68%', issue: 'Low Attendance (<75%)', status: 'Needs Attention', variant: 'danger' },
    { student: 'Divya S', register: '312221205014', semester: 'Sem 4', attendance: '71%', issue: 'Declining Performance', status: 'Warning', variant: 'warning' },
    { course: 'Deep Learning (CS801)', semester: 'Sem 6', passPct: '64%', issue: 'Low Pass Percentage', status: 'Academic Intervention', variant: 'danger' },
    { course: 'Operating Systems (CS402)', semester: 'Sem 4', passPct: '72%', issue: 'Attendance Drop', status: 'Review Needed', variant: 'warning' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Academic overview and intelligent insights"
        action={
          <Button variant="primary" onClick={() => navigate('/admin/ai/faculty-allocation')}>
            + Quick Action
          </Button>
        }
      />

      {/* 5 Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Students" value={stats?.students ?? 1240} icon="👨‍🎓" accentColor="text-blue-600" />
        <StatCard label="Faculty" value={stats?.staff ?? 86} icon="👨‍🏫" accentColor="text-indigo-600" />
        <StatCard label="Courses" value={stats?.courses ?? 48} icon="📚" accentColor="text-emerald-600" />
        <StatCard label="Attendance" value={`${stats?.attendance_present_pct ?? 87.4}%`} icon="📊" accentColor="text-amber-600" />
        <StatCard label="Active AI Agents" value={5} icon="🤖" accentColor="text-purple-600" />
      </div>

      {/* AI Insights Card */}
      <AIInsightCard
        title="Smart Academia AI Insights"
        items={[
          "Semester 4 has the lowest average attendance at 78.6%.",
          "17 students currently fall below the 75% configured attendance threshold.",
          "Deep Learning course has shown a 12% decline in average test performance this term."
        ]}
        onViewDetails={() => navigate('/admin/analytics')}
        onGenerateReport={() => navigate('/admin/reports')}
      />

      {/* Academic Performance Chart Section */}
      <Card p="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Academic Performance Trends</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Semester-wise SGPA, Pass Percentage, and Attendance Trends</p>
          </div>
          <Badge variant="info">Live Analytics</Badge>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" vertical={false} />
              <XAxis dataKey="semester" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" domain={[0, 10]} stroke="#2563eb" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} stroke="#16a34a" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="sgpa" name="Avg SGPA (Out of 10)" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="passPct" name="Pass %" stroke="#16a34a" strokeWidth={2} strokeDasharray="4 4" />
              <Line yAxisId="right" type="monotone" dataKey="attendancePct" name="Attendance %" stroke="#d97706" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Attention Required Section */}
      <Card p="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚠️</span> Attention Required
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Students and courses needing immediate academic intervention</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/students')}>
            View All Students
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attentionList.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {item.student || item.course}
                  </h4>
                  <Badge variant={item.variant}>{item.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {item.semester} {item.attendance ? `· Attendance: ${item.attendance}` : ''} {item.passPct ? `· Pass: ${item.passPct}` : ''}
                </p>
                <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-0.5">
                  Issue: {item.issue}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/students')}>
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
