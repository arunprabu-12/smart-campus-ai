import { Link } from 'react-router-dom'

export default function Footer() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-1">
              <span className="text-2xl">🎓</span> Smart Academia
            </div>
            <p className="text-sm text-slate-400">AI-Powered College Academic Platform</p>
            <p className="text-xs text-indigo-400 font-medium mt-1">Students | Faculty | Administration</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
              About
            </button>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
              Login
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Academia. All rights reserved.</p>
          <p>Connecting students, faculty, and administration through AI intelligence.</p>
        </div>
      </div>
    </footer>
  )
}
