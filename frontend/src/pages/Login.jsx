/** Light-theme Login — two-column layout (branding left, form right) */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function Login() {
  const { login: studentLogin } = useAuth()
  const { login: adminLogin } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (role === 'student') {
        await studentLogin(email, password)
        navigate('/')
      } else {
        const returnedRole = await adminLogin(email, password)
        if (returnedRole === 'admin') {
          navigate('/admin')
        } else {
          navigate('/staff')
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition'

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── LEFT brand panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-blue-50 border-r border-blue-100 flex-col items-center justify-center px-12 py-16 gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl shadow-md">🎓</div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight">Smart Academia</h1>
            <p className="text-sm text-slate-500 mt-0.5">AI-Powered College Academic Platform</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm text-center max-w-xs leading-relaxed font-medium">
          "Empowering smarter academic journeys with AI."
        </p>

        {/* Floating feature cards */}
        <div className="w-full max-w-xs space-y-3">
          {[['🤖', 'AI Academic Advisor', 'Personalized guidance for every student.'],
            ['📅', 'Smart Study Planner', 'AI-generated weekly study schedules.'],
            ['📚', 'RAG Study Assistant', 'Answer any syllabus question instantly.']
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

      {/* ── RIGHT form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg">🎓</div>
          <span className="text-lg font-extrabold text-blue-600">Smart Academia</span>
        </div>

        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-8">
          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back 👋</h2>
            <p className="text-sm text-slate-600 mt-1">Continue your academic journey with Smart Academia.</p>
          </div>

          {/* Role Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 gap-1">
            {['student', 'staff', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                type="button"
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${role === r ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r === 'student' ? '🎓 Student' : r === 'staff' ? '👨‍🏫 Staff' : '⚙️ Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">College Email</label>
              <input id="login-email" type="email" required className={inputCls} placeholder="student@college.edu" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Password</label>
              <input id="login-password" type="password" required className={inputCls} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl py-3 text-sm font-bold transition-all shadow-sm mt-1"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-semibold">Register</Link>
          </p>

          <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            <strong>Demo:</strong> arjun.kumar@college.edu / Student@123
          </div>
        </div>

        <Link to="/welcome" className="mt-6 text-xs text-slate-400 hover:text-blue-600 transition-colors">
          ← Back to Welcome
        </Link>
      </div>
    </div>
  )
}
