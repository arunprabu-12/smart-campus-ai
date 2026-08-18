/** Light-theme Register — matches Login two-column layout */
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDepartments, getRegulations } from '../api/admin'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    full_name: '', register_number: '', college_email: '', password: '',
    department_id: '', regulation_id: '', admission_year: new Date().getFullYear(),
    current_semester: 1, section: '', career_interest: '',
  })
  const [previousGpas, setPreviousGpas] = useState({})
  const [departments, setDepartments] = useState([])
  const [regulations, setRegulations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDepartments().then(r => setDepartments(r.data)).catch(() => {})
    getRegulations().then(r => setRegulations(r.data)).catch(() => {})
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.department_id || !form.regulation_id) {
      setError('Please select both Department and Regulation.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        ...form,
        department_id: parseInt(form.department_id, 10),
        regulation_id: parseInt(form.regulation_id, 10),
        admission_year: parseInt(form.admission_year, 10),
        current_semester: parseInt(form.current_semester, 10),
      }
      if (payload.current_semester > 1 && Object.keys(previousGpas).length > 0) {
        payload.previous_gpas = previousGpas
      }
      await register(payload)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition'
  const labelCls = 'text-xs font-semibold text-slate-600 block mb-1'

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── LEFT brand panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-blue-50 border-r border-blue-100 flex-col items-center justify-center px-12 py-16 gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl shadow-md">🎓</div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">Smart Academia</h1>
            <p className="text-sm text-slate-500 mt-0.5">AI-Powered College Academic Platform</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm text-center max-w-xs leading-relaxed font-medium">
          "Start your smarter academic journey today."
        </p>

        <div className="w-full max-w-xs space-y-3">
          {[['📊', 'Academic Analytics', 'Track SGPA, attendance, and progress.'],
            ['📝', 'AI Assignments & Tests', 'Unit-wise AI-generated assessments.'],
            ['🗓️', 'Smart Calendar', 'AI study plans auto-synced to calendar.']
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-start gap-3">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg">🎓</div>
          <span className="text-lg font-extrabold text-blue-600">Smart Academia</span>
        </div>

        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Create Your Account</h2>
            <p className="text-sm text-slate-600 mt-1">Join the Smart Academia platform and start your smarter academic journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Full Name *</label>
                <input id="reg-name" name="full_name" required className={inputCls} placeholder="Arjun Kumar" value={form.full_name} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}>Register Number *</label>
                <input id="reg-regno" name="register_number" required className={inputCls} placeholder="2023AIDS001" value={form.register_number} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}>Section</label>
                <input id="reg-section" name="section" className={inputCls} placeholder="A" value={form.section} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>College Email *</label>
                <input id="reg-email" name="college_email" type="email" required className={inputCls} placeholder="arjun@college.edu" value={form.college_email} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Password *</label>
                <input id="reg-password" name="password" type="password" required minLength={6} className={inputCls} placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}>Department *</label>
                <select id="reg-dept" name="department_id" required className={inputCls} value={form.department_id} onChange={handleChange}>
                  <option value="">Select…</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Regulation *</label>
                <select id="reg-regulation" name="regulation_id" required className={inputCls} value={form.regulation_id} onChange={handleChange}>
                  <option value="">Select…</option>
                  {regulations.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Admission Year *</label>
                <input id="reg-year" name="admission_year" type="number" min="2015" max="2030" required className={inputCls} value={form.admission_year} onChange={handleChange} />
              </div>
              <div>
                <label className={labelCls}>Current Semester</label>
                <select id="reg-semester" name="current_semester" className={inputCls} value={form.current_semester} onChange={handleChange}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Career Interest</label>
                <input id="reg-career" name="career_interest" className={inputCls} placeholder="e.g. Machine Learning Engineer" value={form.career_interest} onChange={handleChange} />
              </div>
            </div>

            {parseInt(form.current_semester) > 1 && (
              <div className="space-y-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-slate-800">Previous Semester GPAs</h3>
                <p className="text-xs text-slate-500">Please enter your SGPA for completed semesters to accurately calculate your CGPA.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: parseInt(form.current_semester) - 1 }, (_, i) => i + 1).map(sem => (
                    <div key={sem}>
                      <label className={labelCls}>Semester {sem} SGPA</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        max="10" 
                        required 
                        className={inputCls} 
                        placeholder="e.g. 8.5"
                        value={previousGpas[sem] || ''} 
                        onChange={e => setPreviousGpas(prev => ({ ...prev, [sem]: parseFloat(e.target.value) || 0 }))} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl py-3 text-sm font-bold transition-all shadow-sm"
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-semibold">Login</Link>
          </p>
        </div>

        <Link to="/welcome" className="mt-6 text-xs text-slate-400 hover:text-blue-600 transition-colors">
          ← Back to Welcome
        </Link>
      </div>
    </div>
  )
}
