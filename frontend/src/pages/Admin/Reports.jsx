import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { AIInsightCard } from '../../components/ui/AIInsightCard'

export default function Reports() {
  const [reportType, setReportType] = useState('Student Performance Report')
  const [department, setDepartment] = useState('AIDS')
  const [semester, setSemester] = useState('5')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState(null)
  const [aiSummary, setAiSummary] = useState(null)

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setReportData(null)
    setAiSummary(null)

    setTimeout(() => {
      setReportData({
        title: `${reportType} — ${department} (Sem ${semester})`,
        generatedAt: new Date().toLocaleString(),
        summaryStats: [
          { label: 'Total Students Evaluated', value: '64' },
          { label: 'Average SGPA / Score', value: '8.45' },
          { label: 'Pass Rate', value: '92.1%' },
          { label: 'Attendance Average', value: '87.4%' },
        ],
        details: [
          { code: 'AI3501', course: 'Deep Learning Architectures', faculty: 'Kapil Dev', passPct: '94%', avgScore: '84.2' },
          { code: 'AI3502', course: 'Generative AI & LLMs', faculty: 'Jayasree M', passPct: '90%', avgScore: '81.5' },
          { code: 'AI3503', course: 'Agentic AI Frameworks', faculty: 'Madhubala K', passPct: '95%', avgScore: '88.0' },
          { code: 'AI3504', course: 'Manufacturing AI Systems', faculty: 'Selvarani R', passPct: '88%', avgScore: '79.4' },
          { code: 'AI3505', course: 'Cloud & Vector Databases', faculty: 'Divya S', passPct: '93%', avgScore: '83.1' },
        ]
      })
      setIsGenerating(false)
    }, 800)
  }

  const handleGenerateAISummary = () => {
    setAiSummary(
      `Executive Summary for ${department} Semester ${semester}: The overall cohort performance remains strong at an average SGPA of 8.45 and a 92.1% pass rate. Deep Learning and Agentic AI lead with highest scores (>84). Recommendation: Conduct focused tutorial sessions for Manufacturing AI Systems to bridge the 88% pass gap.`
    )
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${department}_sem${semester}.json`
    a.click()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Reports Generator"
        description="Generate official institutional reports, export data, and produce executive AI summaries."
      />

      {/* Report Configuration */}
      <Card p="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Report Type</label>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="Student Performance Report">Student Performance Report</option>
              <option value="Semester Report">Semester Report</option>
              <option value="Department Report">Department Report</option>
              <option value="Attendance Report">Attendance Report</option>
              <option value="Faculty Workload Report">Faculty Workload Report</option>
              <option value="Assignment Report">Assignment Report</option>
              <option value="Test Performance Report">Test Performance Report</option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Department</label>
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="AIDS">AIDS</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Semester</label>
            <Select value={semester} onChange={(e) => setSemester(e.target.value)}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </Select>
          </div>
        </div>

        <Button variant="primary" onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? 'Generating Academic Report...' : '📊 Generate Report Preview'}
        </Button>
      </Card>

      {/* Report Preview */}
      {reportData && (
        <Card p="p-6" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{reportData.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Generated on: {reportData.generatedAt}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                ⬇️ Download (JSON)
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                🖨️ Print Report
              </Button>
              <Button variant="primary" size="sm" onClick={handleGenerateAISummary}>
                ✨ Generate AI Executive Summary
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {reportData.summaryStats.map((st, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400">{st.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{st.value}</p>
              </div>
            ))}
          </div>

          {/* AI Executive Summary Card */}
          {aiSummary && (
            <AIInsightCard
              title="AI Executive Summary"
              text={aiSummary}
            />
          )}

          {/* Detailed breakdown table */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Course Breakdown</h4>
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Course Title</th>
                    <th className="px-4 py-3">Faculty</th>
                    <th className="px-4 py-3">Pass %</th>
                    <th className="px-4 py-3">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {reportData.details.map((d, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{d.code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{d.course}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{d.faculty}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{d.passPct}</td>
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">{d.avgScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
