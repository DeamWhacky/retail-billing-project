import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCustomers, getOrders, getOrderStats } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [products, customers, orders, revenue] = await Promise.all([
          getProducts(), getCustomers(), getOrders(), getOrderStats()
        ])
        setStats({
          products: products.data.length,
          customers: customers.data.length,
          orders: orders.data.length,
          revenue: revenue.data.totalRevenue || 0,
        })
        setRecentOrders(orders.data.slice(-5).reverse())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
      <div className="spinner-border" style={{ color: '#667eea' }} />
    </div>
  )

  const statCards = [
    { label: 'Total Products',  value: stats.products,  icon: 'bi-box-seam',    color: 'blue' },
    { label: 'Total Customers', value: stats.customers, icon: 'bi-people',      color: 'green' },
    { label: 'Total Orders',    value: stats.orders,    icon: 'bi-receipt',     color: 'orange' },
    { label: 'Total Revenue',   value: `₹${stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, icon: 'bi-currency-rupee', color: 'red' },
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 2 }}>Dashboard</h4>
          <p style={{ color: '#6c757d', fontSize: '0.88rem', margin: 0 }}>Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/orders/new" className="btn-primary-custom">
          <i className="bi bi-plus-lg me-1" /> New Bill
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(s => (
          <div className="col-md-3 col-sm-6" key={s.label}>
            <div className="stat-card">
              <div className={`stat-icon ${s.color}`}><i className={`bi ${s.icon}`} /></div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 style={{ margin: 0 }}>Recent Orders</h5>
          <Link to="/orders" style={{ fontSize: '0.85rem', color: '#667eea' }}>View All →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p style={{ color: '#6c757d', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
            No orders yet. <Link to="/orders/new">Create your first bill →</Link>
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Items</th>
                  <th>Total</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>{o.customerName}</td>
                    <td>{o.orderItems?.length} item(s)</td>
                    <td><strong>₹{o.finalAmount?.toFixed(2)}</strong></td>
                    <td><span className={`badge-status badge-${o.status}`}>{o.status}</span></td>
                    <td style={{ fontSize: '0.82rem', color: '#6c757d' }}>
                      {new Date(o.orderDate).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
