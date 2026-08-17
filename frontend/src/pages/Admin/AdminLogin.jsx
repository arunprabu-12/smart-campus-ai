/**
 * Admin Login — separate page at /admin-login.
 * No link from student UI. Admin navigates here directly.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin-panel')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Check email/password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(15,23,42,0.9)',
        border: '1px solid #7c3aed44',
        borderRadius: '24px',
        padding: '48px 40px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 60px #7c3aed22',
      }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', boxShadow: '0 8px 24px #7c3aed44',
          }}>🛡️</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            Admin Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
            Restricted access — Staff & Administrators only
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#ef444415', border: '1px solid #ef444444',
              borderRadius: '10px', padding: '12px 16px',
              color: '#fca5a5', fontSize: '13px', marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {[
            { label: 'Admin Email', type: 'email', val: email, set: setEmail, id: 'admin-email' },
            { label: 'Password', type: 'password', val: password, set: setPassword, id: 'admin-password' },
          ].map(f => (
            <div key={f.id} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.5px' }}>
                {f.label.toUpperCase()}
              </label>
              <input
                id={f.id}
                type={f.type}
                value={f.val}
                onChange={e => f.set(e.target.value)}
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  background: '#0f172a',
                  color: '#f1f5f9', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#334155'}
              />
            </div>
          ))}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '12px', border: 'none',
              background: loading ? '#334155' : 'linear-gradient(135deg, #7c3aed, #6366f1)',
              color: '#fff', fontWeight: 700, fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              boxShadow: loading ? 'none' : '0 4px 16px #7c3aed44',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/login" style={{ fontSize: '12px', color: '#475569', textDecoration: 'none' }}>
            ← Back to Student Login
          </a>
        </div>

        <div style={{
          marginTop: '24px', padding: '14px',
          background: '#0f172a', borderRadius: '12px',
          border: '1px solid #1e293b', fontSize: '11px', color: '#475569',
        }}>
          <strong style={{ color: '#64748b' }}>First time setup?</strong> Create admin account via:
          <br />
          <code style={{ color: '#818cf8', fontSize: '11px' }}>
            POST /admin-auth/bootstrap?secret=ADMIN_SECRET_KEY
          </code>
        </div>
      </div>
    </div>
  )
}
