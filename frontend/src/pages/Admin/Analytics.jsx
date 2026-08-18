import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Select'
import { Badge } from '../../components/ui/Badge'
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts'

export default function Analytics() {
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [department, setDepartment] = useState('AIDS')
  const [semester, setSemester] = useState('')
  const [course, setCourse] = useState('')

  // Chart Data Sets
  const sgpaData = [
    { sem: 'Sem 1', sgpa: 8.4 }, { sem: 'Sem 2', sgpa: 8.1 }, { sem: 'Sem 3', sgpa: 8.6 },
    { sem: 'Sem 4', sgpa: 7.9 }, { sem: 'Sem 5', sgpa: 8.5 }, { sem: 'Sem 6', sgpa: 8.3 },
  ]

  const deptPerfData = [
    { dept: 'AIDS', avgCgpa: 8.5, passPct: 91 },
    { dept: 'CSE', avgCgpa: 8.2, passPct: 88 },
    { dept: 'ECE', avgCgpa: 8.0, passPct: 85 },
    { dept: 'MECH', avgCgpa: 7.8, passPct: 82 },
  ]

  const attendanceTrendData = [
    { month: 'Jan', attendance: 92 }, { month: 'Feb', attendance: 88 },
    { month: 'Mar', attendance: 85 }, { month: 'Apr', attendance: 87 },
    { month: 'May', attendance: 89 },
  ]

  const assignmentCompletionData = [
    { course: 'Deep Learning', completed: 94, pending: 6 },
    { course: 'Gen AI', completed: 88, pending: 12 },
    { course: 'Agentic AI', completed: 92, pending: 8 },
    { course: 'Manufacturing AI', completed: 82, pending: 18 },
  ]

  const testPerfData = [
    { test: 'Unit Test 1', avgScore: 78 }, { test: 'Unit Test 2', avgScore: 82 },
    { test: 'Mid-Sem Exam', avgScore: 76 }, { test: 'Unit Test 3', avgScore: 85 },
  ]

  const passPctData = [
    { name: 'Passed', value: 89 },
    { name: 'Arrear / Re-test', value: 11 },
  ]
  const COLORS = ['#16a34a', '#dc2626']

  const courseWiseData = [
    { name: 'Deep Learning', score: 84 },
    { name: 'Gen AI', score: 88 },
    { name: 'Agentic AI', score: 91 },
    { name: 'Cloud DB', score: 79 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Analytics & Intelligence"
        description="Comprehensive visualization across grades, pass percentages, completion rates, and attendance trends."
      />

      {/* Global Analytics Filters */}
      <Card p="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
            <option value="2025-2026">Year: 2025-2026</option>
            <option value="2024-2025">Year: 2024-2025</option>
          </Select>
          <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="AIDS">Department: AIDS</option>
            <option value="CSE">Department: CSE</option>
            <option value="ECE">Department: ECE</option>
          </Select>
          <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
          </Select>
          <Select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">All Courses</option>
            <option value="Deep Learning">Deep Learning</option>
            <option value="Gen AI">Gen AI</option>
          </Select>
        </div>
      </Card>

      {/* 7 Dashboard Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Semester-wise SGPA */}
        <Card p="p-5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">1. Semester-wise Average SGPA</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="sem" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="sgpa" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. Department Performance */}
        <Card p="p-5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">2. Department-wise Pass Percentage</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="dept" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="passPct" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 3. Attendance Trends */}
        <Card p="p-5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">3. Monthly Attendance Trends (%)</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis domain={[60, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="attendance" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Assignment Completion */}
        <Card p="p-5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">4. Course Assignment Completion Rate</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assignmentCompletionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <YAxis type="category" dataKey="course" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="completed" fill="#16a34a" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 5. Test Performance */}
        <Card p="p-5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">5. Assessment Average Score</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testPerfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="test" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="avgScore" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 6. Overall Pass Percentage */}
        <Card p="p-5">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">6. Overall Pass vs Arrear Ratio</h4>
          <div className="h-60 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={passPctData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {passPctData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 7. Course-wise Performance */}
        <Card p="p-5" className="md:col-span-2">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">7. Course-wise Composite Evaluation Index</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseWiseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="score" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
