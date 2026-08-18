import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    academicYear: '2025-2026',
    attendanceThreshold: 75,
    departments: 'AIDS, CSE, ECE, MECH',
    aiModel: 'CrewAI / Qwen3-8B Orchestrator',
    notificationsEnabled: true,
    securityLevel: 'Strict Role-Based JWT'
  })

  const handleSave = (e) => {
    e.preventDefault()
    alert('System settings saved successfully!')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Admin Settings & Configuration"
        description="Configure academic threshold parameters, departments, AI agents, and security settings."
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Academic Settings */}
        <Card p="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚙️</span> Academic Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Active Academic Year</label>
              <Select value={settings.academicYear} onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}>
                <option value="2025-2026">2025 - 2026</option>
                <option value="2026-2027">2026 - 2027</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Attendance Threshold (%)</label>
              <Input
                type="number"
                min="50"
                max="95"
                value={settings.attendanceThreshold}
                onChange={(e) => setSettings({ ...settings, attendanceThreshold: Number(e.target.value) })}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Students below this threshold trigger AI risk warnings.</span>
            </div>
          </div>
        </Card>

        {/* AI & Automation */}
        <Card p="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🤖</span> AI Agent Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Orchestration Model</label>
              <Input disabled value={settings.aiModel} className="bg-slate-100 dark:bg-slate-800" />
              <span className="text-[10px] text-slate-400 mt-1 block">Powered by CrewAI agentic workflow architecture.</span>
            </div>
          </div>
        </Card>

        {/* Security & Access */}
        <Card p="p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🔒</span> Profile & Security Policy
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Security Framework</label>
              <Input disabled value={settings.securityLevel} className="bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" type="submit">
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
