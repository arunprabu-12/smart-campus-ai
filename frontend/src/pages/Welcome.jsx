import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Footer from '../components/Footer'

// Navigation Bar Component
function Navbar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Logo + Subtitle */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-500/20">
              🎓
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Smart Academia
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                AI-Powered College Academic Platform
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('ai-agents')} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              AI Agents
            </button>
          </div>

          {/* Right Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-all shadow-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:opacity-95 text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <button onClick={() => scrollToSection('home')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">Home</button>
          <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">Features</button>
          <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">About</button>
          <button onClick={() => scrollToSection('ai-agents')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">AI Agents</button>
          <div className="pt-4 flex flex-col gap-2">
            <button onClick={() => navigate('/login')} className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-center">Login</button>
            <button onClick={() => navigate('/register')} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-center">Register</button>
          </div>
        </div>
      )}
    </nav>
  )
}

// Reusable Feature Card Component
function FeatureCard({ icon, title, description, accentColor }) {
  return (
    <div className="group p-8 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl ${accentColor} flex items-center justify-center text-2xl mb-6 shadow-md transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// Reusable Agent Card Component
function AgentCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all hover:border-indigo-300 dark:hover:border-indigo-500/50">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{icon}</span>
        <h4 className="font-bold text-slate-900 dark:text-white text-base">{title}</h4>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </div>
  )
}

// Reusable Role Experience Card
function UserRoleCard({ role, subtitle, icon, items, gradient, badge }) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center text-3xl text-white shadow-lg`}>
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {badge}
          </span>
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{role}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{subtitle}</p>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Main Welcome Page Component
export default function Welcome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section id="home" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase shadow-sm">
                <span>✨ Next-Gen College Academic OS</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Your College. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Smarter with AI.
                </span>
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                An intelligent academic platform connecting students, faculty, and administration through personalized learning, AI-powered assistance, academic analytics, and smart automation.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  Get Started <span>→</span>
                </button>
                <button
                  onClick={() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  Explore Features
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center lg:justify-start gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold text-sm">✓</span> 8 Semesters Integrated
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold text-sm">✓</span> RAG & Agentic AI
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold text-sm">✓</span> Role-Based Governance
                </div>
              </div>
            </div>

            {/* Hero Right Mock Dashboard Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow Backdrop */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl animate-pulse"></div>

                <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Good Morning 👋</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Arjun Kumar · AIDS Sem 6</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Active Session
                    </div>
                  </div>

                  {/* Academic Progress Widget */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-blue-100 uppercase tracking-wider">Academic Progress</span>
                      <span className="text-2xl font-black">82%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-3">
                      <div className="bg-white h-3 rounded-full shadow-sm transition-all duration-1000" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  {/* AI Assistant Alert Box */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide">AI Study Assistant</h4>
                      <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mt-0.5">
                        “You have 2 topics to revise today.”
                      </p>
                    </div>
                  </div>

                  {/* Today's Study Plan List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Today’s Study Plan</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">DBMS</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">✓ Completed</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Machine Learning</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold">✓ Completed</span>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-sm">
                        <span className="font-bold text-blue-900 dark:text-blue-200">Deep Learning</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold">○ Up Next</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AI FEATURES SECTION */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Intelligence Across Your Academic Journey
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Smart tools designed for students, faculty, and academic administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              accentColor="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
              title="AI Academic Advisor"
              description="Personalized academic guidance based on courses, performance, and progress."
            />
            <FeatureCard
              icon="📅"
              accentColor="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300"
              title="Smart Study Planner"
              description="Generate personalized study schedules based on subjects, exams, and available time."
            />
            <FeatureCard
              icon="📚"
              accentColor="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300"
              title="RAG Study Assistant"
              description="Ask questions and get answers grounded in your college academic documents."
            />
            <FeatureCard
              icon="📝"
              accentColor="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300"
              title="AI Quiz Generator"
              description="Generate quizzes from subjects, units, and topics with configurable difficulty."
            />
            <FeatureCard
              icon="📊"
              accentColor="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300"
              title="Academic Analytics"
              description="Track marks, attendance, SGPA, progress, and academic performance."
            />
            <FeatureCard
              icon="👨‍🏫"
              accentColor="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300"
              title="Faculty AI Assistant"
              description="Assist faculty with assignments, reports, attendance analysis, and academic planning."
            />
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How Smart Academia Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Three seamless steps to elevate institutional academic standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/30">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">CONNECT</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Access courses, assignments, tests, attendance, and academic information from one platform.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-500/30">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">LEARN WITH AI</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                AI agents understand the academic context and provide personalized assistance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-6 shadow-md shadow-purple-500/30">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">IMPROVE</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Receive study plans, recommendations, insights, quizzes, and performance feedback.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* USER EXPERIENCE SECTION */}
      <section id="about" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              One Platform. Three Experiences.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Tailored workspaces engineered specifically for each stakeholder in higher education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <UserRoleCard
              role="STUDENT"
              badge="Learner Portal"
              subtitle="Empowering student self-learning & mastery"
              icon="🎓"
              gradient="bg-gradient-to-tr from-blue-600 to-cyan-500"
              items={[
                'Courses & Syllabus',
                'Smart Study Plans',
                'Unit Assignments',
                'AI Practice Tests',
                'Personal AI Advisor',
                'SGPA & Performance Tracking'
              ]}
            />
            <UserRoleCard
              role="FACULTY"
              badge="Educator Portal"
              subtitle="Streamlining teaching & class evaluation"
              icon="👨‍🏫"
              gradient="bg-gradient-to-tr from-indigo-600 to-purple-600"
              items={[
                'Course Management',
                'Assignment Evaluation',
                'Daily Attendance Tracking',
                'Class Performance Insights',
                'Faculty AI Assistant',
                'Academic Reports'
              ]}
            />
            <UserRoleCard
              role="ADMINISTRATION"
              badge="Governance Portal"
              subtitle="Comprehensive institutional oversight & allocation"
              icon="🏛️"
              gradient="bg-gradient-to-tr from-purple-600 to-pink-600"
              items={[
                'Academic Management',
                'Faculty Workload Allocation',
                'Attendance Analytics',
                'Institutional Reports',
                'Global Announcements',
                'Role & System Governance'
              ]}
            />
          </div>

        </div>
      </section>

      {/* AI AGENTS SECTION */}
      <section id="ai-agents" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
              <span>⚡ Powered by Agentic AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Meet Your AI Academic Agents
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Autonomous micro-agents working in synchronization to assist learning and administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard
              icon="📅"
              title="Study Plan Agent"
              description="Creates personalized weekly study plans based on student progress and deadlines."
            />
            <AgentCard
              icon="📚"
              title="RAG Study Agent"
              description="Answers academic questions using verified college documents and question banks."
            />
            <AgentCard
              icon="📝"
              title="Quiz Agent"
              description="Creates personalized quizzes and unit assessments with varying difficulty."
            />
            <AgentCard
              icon="📊"
              title="Academic Advisor Agent"
              description="Analyzes academic performance, identifies weak topics, and recommends improvements."
            />
            <AgentCard
              icon="👨‍🏫"
              title="Faculty Allocation Agent"
              description="Helps distribute faculty workloads intelligently across 8 semesters."
            />
            <AgentCard
              icon="📑"
              title="Academic Report Agent"
              description="Generates meaningful academic reports and performance insights for decision makers."
            />
          </div>

        </div>
      </section>

      {/* SEMESTER JOURNEY SECTION */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Entire Academic Journey — One Platform
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              From your first semester to graduation, Smart Academia keeps your academic journey organized, measurable, and intelligent.
            </p>
          </div>

          {/* Interactive Horizontal Timeline */}
          <div className="py-8 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center min-w-max space-x-3 px-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem, idx) => (
                <div key={sem} className="flex items-center">
                  <div className="group relative cursor-pointer">
                    <div className="px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-100">Year {Math.ceil(sem / 2)}</p>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-white mt-0.5">Semester {sem}</h4>
                    </div>
                  </div>
                  {idx < 7 && (
                    <span className="text-slate-300 dark:text-slate-700 text-xl font-bold px-2">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to make your academic journey smarter?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-normal">
            Experience a new way of learning, planning, analyzing, and managing academics.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-2xl bg-white text-blue-600 font-extrabold text-lg shadow-2xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER - ONLY FOR WELCOME PAGE */}
      <Footer />
    </div>
  )
}
