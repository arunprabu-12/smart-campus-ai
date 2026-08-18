import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSidebar'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/ui/Button'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin } = useAdminAuth()
  const { dark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Admin Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ☰
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Academic Administration Center
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            >
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(admin?.role === 'admin' ? '/admin/ai/faculty-allocation' : '/staff/ai/assignment-generator')}
            >
              + Quick Action
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}
