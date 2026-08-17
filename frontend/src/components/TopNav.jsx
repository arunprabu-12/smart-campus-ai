/**
 * TopNav — profile accessible ONLY by clicking the avatar icon.
 * No separate profile link in sidebar. Avatar opens /profile directly.
 * Admin access is secret — no link exposed.
 */
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const PAGE_TITLES = {
  '/': '🏠 Dashboard',
  '/courses': '📚 Courses',
  '/assignments': '📝 Assignments',
  '/tests': '🧪 Tests',
  '/results': '📊 Results',
  '/study-plan': '📅 Study Plan',
  '/advisor': '🤖 AI Advisor',
  '/journey': '🗺️ Academic Journey',
  '/attendance': '📅 Attendance',
  '/profile': '👤 Profile',
  '/admin': '⚙️ Admin Panel',
}

export default function TopNav() {
  const { dark, toggleTheme } = useTheme()
  const { student, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem('student_notifications') || '[]')
  })
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
  )?.[1] || '📄 Page'

  // Close menu on outside click
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handler)
    
    // Listen for new notifications
    const handleStorage = () => setNotifications(JSON.parse(localStorage.getItem('student_notifications') || '[]'))
    window.addEventListener('storage', handleStorage)
    window.addEventListener('new_notification', handleStorage)

    return () => {
      document.removeEventListener('mousedown', handler)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('new_notification', handleStorage)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = student?.full_name
    ? student.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: dark
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Page Title */}
      <h2 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: dark ? '#e2e8f0' : '#1e293b',
        margin: 0,
        fontFamily: "'Inter', sans-serif",
      }}>
        {pageTitle}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* AI Model Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #6366f122, #a78bfa22)',
          border: '1px solid #6366f144',
          fontSize: '11px',
          color: '#a78bfa',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}>
          🤗 Qwen3-8B
        </div>

        {/* Theme toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            background: dark ? '#1e293b' : '#f1f5f9',
            color: dark ? '#94a3b8' : '#475569',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>

        {/* Notification Bell */}
        {student && (
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotif(v => !v); setShowMenu(false); }}
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: dark ? '#1e293b' : '#f1f5f9', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', transition: 'all 0.2s'
              }}
            >
              🔔
              {notifications.length > 0 && (
                <div style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  background: '#ef4444', color: '#fff', fontSize: '10px',
                  fontWeight: 'bold', width: '16px', height: '16px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {notifications.length}
                </div>
              )}
            </button>
            {showNotif && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                width: '280px', background: dark ? '#0f172a' : '#fff',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                borderRadius: '16px', padding: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                zIndex: 1000, animation: 'fadeDown 0.2s ease', maxHeight: '350px', overflowY: 'auto'
              }}>
                <h4 style={{ margin: '0 0 10px', color: dark ? '#f1f5f9' : '#1e293b', fontSize: '14px', fontWeight: 700 }}>Notifications</h4>
                {notifications.length === 0 ? (
                  <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', margin: '20px 0' }}>No new notifications.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.map((n, i) => {
                      const lowerText = n.text.toLowerCase();
                      const path = lowerText.includes('test') ? '/tests' 
                                 : lowerText.includes('assignment') ? '/assignments' 
                                 : lowerText.includes('study plan') ? '/study-plan' 
                                 : null;
                      return (
                        <button 
                          key={i} 
                          onClick={() => { if (path) { navigate(path); setShowNotif(false); } }}
                          style={{ 
                            padding: '8px 10px', 
                            background: dark ? '#1e293b' : '#f8fafc', 
                            borderRadius: '8px', 
                            border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                            cursor: path ? 'pointer' : 'default',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          <div style={{ fontSize: '12px', color: dark ? '#e2e8f0' : '#334155', fontWeight: 500 }}>{n.text}</div>
                          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{new Date(n.date).toLocaleString()}</div>
                        </button>
                      )
                    })}
                    <button 
                      onClick={() => { localStorage.removeItem('student_notifications'); setNotifications([]); }}
                      style={{ padding: '6px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', marginTop: '4px' }}>
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile avatar — ONLY way to access profile */}
        {student && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              id="profile-avatar-btn"
              onClick={() => { setShowMenu(v => !v); setShowNotif(false); }}
              title={`${student.full_name} — Click to view profile`}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px #6366f144',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.boxShadow = '0 0 0 3px #6366f166'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 0 0 2px #6366f144'
              }}
            >
              {initials}
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                minWidth: '220px',
                background: dark ? '#0f172a' : '#fff',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                borderRadius: '16px',
                padding: '8px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                zIndex: 1000,
                animation: 'fadeDown 0.2s ease',
              }}>
                <style>{`
                  @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>

                {/* Student info */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}`,
                  marginBottom: '8px',
                }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: dark ? '#f1f5f9' : '#1e293b' }}>
                    {student.full_name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {student.college_email}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '4px' }}>
                    Reg: {student.register_number}
                  </div>
                </div>

                {/* Menu items */}
                {[
                  { icon: '👤', label: 'My Profile', action: () => { navigate('/profile'); setShowMenu(false) } },
                  { icon: '📅', label: 'Attendance', action: () => { navigate('/attendance'); setShowMenu(false) } },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 16px', borderRadius: '10px', border: 'none',
                      background: 'none', cursor: 'pointer', textAlign: 'left',
                      color: dark ? '#e2e8f0' : '#374151', fontSize: '13px',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? '#1e293b' : '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}

                <div style={{ height: '1px', background: dark ? '#1e293b' : '#f1f5f9', margin: '8px 0' }} />

                <button
                  onClick={handleLogout}
                  id="logout-btn"
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 16px', borderRadius: '10px', border: 'none',
                    background: 'none', cursor: 'pointer', textAlign: 'left',
                    color: '#ef4444', fontSize: '13px',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ef444415'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
