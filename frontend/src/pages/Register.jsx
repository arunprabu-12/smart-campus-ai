/** Spec section 1 — full registration form with all 10 fields. */
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDepartments, getRegulations } from '../api/admin'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    full_name: '',
    register_number: '',
    college_email: '',
    password: '',
    department_id: '',
    regulation_id: '',
    admission_year: new Date().getFullYear(),
    current_semester: 1,
    section: '',
    career_interest: '',
  })
  const [departments, setDepartments] = useState([])
  const [regulations, setRegulations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDepartments().then((r) => setDepartments(r.data)).catch(() => {})
    getRegulations().then((r) => setRegulations(r.data)).catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        department_id: parseInt(form.department_id),
        regulation_id: parseInt(form.regulation_id),
        admission_year: parseInt(form.admission_year),
        current_semester: parseInt(form.current_semester),
      }
      await register(payload)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">📚</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join AI Academic Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Full Name *</label>
              <input id="reg-name" name="full_name" required className={inputClass} placeholder="Arjun Kumar" value={form.full_name} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Register Number *</label>
              <input id="reg-regno" name="register_number" required className={inputClass} placeholder="2023AIDS001" value={form.register_number} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Section</label>
              <input id="reg-section" name="section" className={inputClass} placeholder="A" value={form.section} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>College Email *</label>
              <input id="reg-email" name="college_email" type="email" required className={inputClass} placeholder="arjun@college.edu" value={form.college_email} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Password *</label>
              <input id="reg-password" name="password" type="password" required minLength={6} className={inputClass} placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Department *</label>
              <select id="reg-dept" name="department_id" required className={inputClass} value={form.department_id} onChange={handleChange}>
                <option value="">Select…</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Regulation *</label>
              <select id="reg-regulation" name="regulation_id" required className={inputClass} value={form.regulation_id} onChange={handleChange}>
                <option value="">Select…</option>
                {regulations.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Admission Year *</label>
              <input id="reg-year" name="admission_year" type="number" min="2015" max="2030" required className={inputClass} value={form.admission_year} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Current Semester</label>
              <select id="reg-semester" name="current_semester" className={inputClass} value={form.current_semester} onChange={handleChange}>
                {[1,2,3,4,5,6,7,8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Career Interest</label>
              <input id="reg-career" name="career_interest" className={inputClass} placeholder="e.g. Machine Learning Engineer, Data Scientist" value={form.career_interest} onChange={handleChange} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            id="reg-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}
