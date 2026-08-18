import { useState, useEffect } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { DataTable } from '../../components/ui/DataTable'

export default function AttendanceAdmin() {
  const { api } = useAdminAuth()
  const [department, setDepartment] = useState('AIDS')
  const [semester, setSemester] = useState('5')

  const records = [
    { id: 1, student: 'Arun Kumar', register: '312221205001', course: 'Deep Learning', percentage: '68%', status: 'At Risk', present: 22, total: 32 },
    { id: 2, student: 'Divya S', register: '312221205014', course: 'Generative AI', percentage: '71%', status: 'At Risk', present: 24, total: 34 },
    { id: 3, student: 'Kapil Dev', register: '312221205022', course: 'Agentic AI', percentage: '92%', status: 'Satisfactory', present: 30, total: 32 },
    { id: 4, student: 'Jayasree M', register: '312221205035', course: 'Manufacturing AI', percentage: '88%', status: 'Satisfactory', present: 28, total: 32 },
  ]

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{row.student}</div>
          <div className="text-xs text-slate-500 font-mono">{row.register}</div>
        </div>
      )
    },
    { key: 'course', label: 'Course' },
    { key: 'attendance', label: 'Classes (Present/Total)', render: (row) => `${row.present} / ${row.total}` },
    { key: 'percentage', label: 'Attendance %', render: (row) => <span className={`font-bold ${Number(row.percentage.replace('%','')) < 75 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{row.percentage}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'At Risk' ? 'danger' : 'success'}>{row.status}</Badge>
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Attendance Oversight"
        description="Monitor student attendance percentages, class sessions, and threshold compliance across departments."
      />

      <Card p="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
          <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="AIDS">AIDS</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </Select>
          <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </Select>
        </div>
      </Card>

      <DataTable
        cols={columns}
        data={records}
        searchKey="student"
        placeholder="Search student or register no..."
      />
    </div>
  )
}
