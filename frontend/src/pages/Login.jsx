import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/api'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      const res = await login(form)
      loginUser(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="login-logo"><i className="bi bi-shop-window" /></div>
          <h4 style={{ fontWeight: 700, color: '#1a1a2e' }}>Retail Billing System</h4>
          <p style={{ color: '#6c757d', fontSize: '0.88rem' }}>Sign in to your account</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '0.87rem' }}>Username</label>
            <input
              type="text" name="username" className="form-control"
              placeholder="Enter username" value={form.username} onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '0.87rem' }}>Password</label>
            <input
              type="password" name="password" className="form-control"
              placeholder="Enter password" value={form.password} onChange={handleChange}
            />
          </div>
          <button
            type="submit" className="btn-primary-custom w-100"
            style={{ padding: '11px', fontSize: '0.95rem' }}
            disabled={loading}
          >
            {loading ? <><i className="bi bi-arrow-repeat me-2" />Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#667eea', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
