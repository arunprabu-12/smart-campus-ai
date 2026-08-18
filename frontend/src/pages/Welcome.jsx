import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'

/* ─────────────────────────────────────────────────────────────────
   Navbar – white bg, slate border
───────────────────────────────────────────────────────────────── */
function Navbar() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const scroll = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shadow-sm">🎓</div>
            <div>
              <p className="text-base font-extrabold text-blue-600 tracking-tight leading-none">Smart Academia</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">AI-Powered College Academic Platform</p>
            </div>
          </div>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {[['Home', () => window.scrollTo({ top: 0, behavior: 'smooth' })], ['Features', () => scroll('features')], ['About', () => scroll('about')], ['AI Agents', () => scroll('ai-agents')]].map(([label, fn]) => (
              <button key={label} onClick={fn} className="hover:text-blue-600 transition-colors">{label}</button>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm">
              Register
            </button>
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-5 space-y-2">
          {['Home', 'Features', 'About', 'AI Agents'].map(l => (
            <button key={l} onClick={() => scroll(l.toLowerCase().replace(' ', '-'))} className="block w-full text-left py-2 text-sm font-medium text-slate-700">{l}</button>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm">Login</button>
            <button onClick={() => navigate('/register')} className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm">Register</button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Feature Card – white card, pastel icon background
───────────────────────────────────────────────────────────────── */
function FeatureCard({ icon, title, description, iconBg, iconText }) {
  return (
    <div className="group p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-xl mb-5 transition-transform group-hover:scale-110`}>
        <span className={iconText}>{icon}</span>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

/* Agent Card */
function AgentCard({ icon, title, description }) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}

/* Role Card */
function RoleCard({ role, subtitle, icon, items, badge, iconBg }) {
  return (
    <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-2xl shadow-sm`}>{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{badge}</span>
      </div>
      <h3 className="text-xl font-extrabold text-slate-900 mb-0.5">{role}</h3>
      <p className="text-xs text-slate-500 mb-5">{subtitle}</p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Main Welcome Page
───────────────────────────────────────────────────────────────── */
export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section id="home" className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Text */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wide">
                ✨ Next-Gen College Academic Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Your College.<br />
                <span className="text-blue-600">Smarter with AI.</span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                An intelligent academic platform connecting students, faculty, and administration through personalized learning, academic analytics, and AI-powered assistance.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Get Started →
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                >
                  Explore Features
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                {['8 Semesters Integrated', 'RAG & Agentic AI', 'Role-Based Governance'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right – Dashboard Preview */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 rounded-3xl bg-blue-100/60 blur-2xl"></div>
                <div className="relative rounded-2xl bg-white border border-blue-100 shadow-xl shadow-blue-100/50 p-6 space-y-5">

                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Good Morning 👋</h3>
                      <p className="text-xs text-slate-500">Arjun Kumar · AIDS Sem 6</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Active
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Academic Progress</span>
                      <span className="text-xl font-black text-blue-700">82%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  {/* AI Box */}
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                    <span className="text-xl">🤖</span>
                    <div>
                      <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">AI Study Assistant</p>
                      <p className="text-sm font-semibold text-indigo-900 mt-0.5">"You have 2 topics to revise today."</p>
                    </div>
                  </div>

                  {/* Today's Plan */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Today's Study Plan</p>
                    <div className="space-y-2">
                      {[['DBMS', 'Completed', 'bg-emerald-100 text-emerald-700'], ['Machine Learning', 'Completed', 'bg-emerald-100 text-emerald-700'], ['Deep Learning', 'Up Next', 'bg-blue-600 text-white']].map(([name, status, cls]) => (
                        <div key={name} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-800">{name}</span>
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${cls}`}>{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Intelligence Across Your Academic Journey</h2>
            <p className="text-slate-600 mt-3 text-base">Smart tools designed for students, faculty, and academic administrators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon="🤖" iconBg="bg-indigo-50" iconText="text-indigo-600" title="AI Academic Advisor" description="Personalized academic guidance based on courses, performance, and progress." />
            <FeatureCard icon="📅" iconBg="bg-blue-50" iconText="text-blue-600" title="Smart Study Planner" description="Generate personalized study schedules based on subjects, exams, and available time." />
            <FeatureCard icon="📚" iconBg="bg-cyan-50" iconText="text-cyan-600" title="RAG Study Assistant" description="Ask questions and get answers grounded in your college academic documents." />
            <FeatureCard icon="📝" iconBg="bg-violet-50" iconText="text-violet-600" title="AI Quiz Generator" description="Generate quizzes from subjects, units, and topics with configurable difficulty." />
            <FeatureCard icon="📊" iconBg="bg-emerald-50" iconText="text-emerald-600" title="Academic Analytics" description="Track marks, attendance, SGPA, progress, and academic performance visually." />
            <FeatureCard icon="👨‍🏫" iconBg="bg-amber-50" iconText="text-amber-600" title="Faculty AI Assistant" description="Assist faculty with assignments, reports, attendance analysis, and academic planning." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How Smart Academia Works</h2>
            <p className="text-slate-500 mt-2 text-sm">Three seamless steps to elevate institutional academic standards.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', color: 'bg-blue-600', title: 'CONNECT', desc: 'Access courses, assignments, tests, attendance, and academic information from one platform.' },
              { num: '02', color: 'bg-indigo-600', title: 'LEARN WITH AI', desc: 'AI agents understand the academic context and provide personalized assistance.' },
              { num: '03', color: 'bg-cyan-600', title: 'IMPROVE', desc: 'Receive study plans, recommendations, insights, quizzes, and performance feedback.' },
            ].map(({ num, color, title, desc }) => (
              <div key={num} className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
                <div className={`w-12 h-12 rounded-full ${color} text-white font-black text-sm flex items-center justify-center mx-auto mb-5 shadow-sm`}>{num}</div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLE CARDS ── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">One Platform. Three Experiences.</h2>
            <p className="text-slate-600 mt-3 text-base">Tailored workspaces engineered specifically for each stakeholder in higher education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RoleCard role="STUDENT" badge="Learner Portal" subtitle="Empowering student self-learning & mastery" icon="🎓" iconBg="bg-blue-100" items={['Courses & Syllabus', 'Smart Study Plans', 'Unit Assignments', 'AI Practice Tests', 'Personal AI Advisor', 'SGPA & Performance Tracking']} />
            <RoleCard role="FACULTY" badge="Educator Portal" subtitle="Streamlining teaching & class evaluation" icon="👨‍🏫" iconBg="bg-indigo-100" items={['Course Management', 'Assignment Evaluation', 'Daily Attendance Tracking', 'Class Performance Insights', 'Faculty AI Assistant', 'Academic Reports']} />
            <RoleCard role="ADMINISTRATION" badge="Governance Portal" subtitle="Comprehensive institutional oversight" icon="🏛️" iconBg="bg-cyan-100" items={['Academic Management', 'Faculty Workload Allocation', 'Attendance Analytics', 'Institutional Reports', 'Global Announcements', 'Role & System Governance']} />
          </div>
        </div>
      </section>

      {/* ── AI AGENTS ── */}
      <section id="ai-agents" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
              ⚡ Powered by Agentic AI
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Meet Your AI Academic Agents</h2>
            <p className="text-slate-600 mt-3 text-base">Autonomous micro-agents working in synchronization to assist learning and administration.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AgentCard icon="📅" title="Study Plan Agent" description="Creates personalized weekly study plans based on student progress and deadlines." />
            <AgentCard icon="📚" title="RAG Study Agent" description="Answers academic questions using verified college documents and question banks." />
            <AgentCard icon="📝" title="Quiz Agent" description="Creates personalized quizzes and unit assessments with varying difficulty." />
            <AgentCard icon="📊" title="Academic Advisor Agent" description="Analyzes academic performance, identifies weak topics, and recommends improvements." />
            <AgentCard icon="👨‍🏫" title="Faculty Allocation Agent" description="Helps distribute faculty workloads intelligently across 8 semesters." />
            <AgentCard icon="📑" title="Academic Report Agent" description="Generates meaningful academic reports and performance insights for decision makers." />
          </div>
        </div>
      </section>

      {/* ── SEMESTER JOURNEY ── */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Your Entire Academic Journey — One Platform</h2>
            <p className="text-slate-600 mt-3 text-base">From your first semester to graduation, Smart Academia keeps your academic journey organized, measurable, and intelligent.</p>
          </div>
          <div className="py-6 overflow-x-auto">
            <div className="inline-flex items-center min-w-max space-x-2 px-4">
              {[1,2,3,4,5,6,7,8].map((sem, idx) => (
                <div key={sem} className="flex items-center">
                  <div className="group cursor-pointer px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-100">Year {Math.ceil(sem / 2)}</p>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-white mt-0.5">Sem {sem}</h4>
                  </div>
                  {idx < 7 && <span className="text-slate-300 text-lg font-bold px-1.5">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Ready to make your academic journey smarter?</h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto">Experience a new way of learning, planning, analyzing, and managing academics.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 rounded-xl bg-white text-blue-600 font-extrabold text-base shadow-lg hover:bg-slate-50 hover:scale-105 transition-all"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
