import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    if (!form.name || !form.username || !form.email || !form.password) return 'All fields are required.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email format.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError(''); setLoading(true)
    try {
      await register(form)
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card" style={{ width: 440 }}>
        <div className="text-center mb-4">
          <div className="login-logo"><i className="bi bi-person-plus" /></div>
          <h4 style={{ fontWeight: 700, color: '#1a1a2e' }}>Create Account</h4>
          <p style={{ color: '#6c757d', fontSize: '0.88rem' }}>Register to get started</p>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && (
          <div style={{ background:'#d1e7dd',color:'#0a3622',borderRadius:8,padding:'10px 14px',fontSize:'0.87rem',marginBottom:12 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { name:'name',     label:'Full Name',  type:'text',     placeholder:'Enter your full name' },
            { name:'username', label:'Username',   type:'text',     placeholder:'Choose a username' },
            { name:'email',    label:'Email',      type:'email',    placeholder:'Enter your email' },
            { name:'password', label:'Password',   type:'password', placeholder:'Min. 6 characters' },
          ].map(f => (
            <div className="mb-3" key={f.name}>
              <label className="form-label fw-semibold" style={{ fontSize:'0.87rem' }}>{f.label}</label>
              <input
                type={f.type} name={f.name} className="form-control"
                placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
              />
            </div>
          ))}

          <button
            type="submit" className="btn-primary-custom w-100 mt-2"
            style={{ padding:'11px', fontSize:'0.95rem' }} disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-3" style={{ fontSize:'0.85rem', color:'#6c757d' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'#667eea', fontWeight:600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
