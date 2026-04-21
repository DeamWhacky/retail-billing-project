import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/products',  icon: 'bi-box-seam',      label: 'Products' },
  { to: '/customers', icon: 'bi-people',         label: 'Customers' },
  { to: '/orders',    icon: 'bi-receipt',        label: 'Orders' },
  { to: '/orders/new',icon: 'bi-plus-circle',    label: 'New Bill' },
]

export default function Layout() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <div>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <i className="bi bi-shop-window" />
          <span>RetailBilling</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: 6 }}>
            Logged in as
          </div>
          <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
            {user?.username}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginBottom: 10 }}>
            {user?.roles?.[0]?.replace('ROLE_', '')}
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(233,69,96,0.2)', border: '1px solid rgba(233,69,96,0.4)',
              color: '#e94560', borderRadius: 8, padding: '6px 14px',
              fontSize: '0.82rem', cursor: 'pointer', width: '100%'
            }}
          >
            <i className="bi bi-box-arrow-right me-1" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <div className="topbar">
          <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1.05rem' }}>
            Retail Billing System
          </span>
          <span style={{ fontSize: '0.82rem', color: '#6c757d' }}>
            <i className="bi bi-calendar3 me-1" />
            {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </span>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
