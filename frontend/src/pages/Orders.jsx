import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders, updateOrderStatus, deleteOrder } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Orders() {
  const [orders, setOrders]   = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]   = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const { isAdmin } = useAuth()

  useEffect(() => { fetchOrders() }, [])
  useEffect(() => {
    let data = orders
    if (statusFilter !== 'ALL') data = data.filter(o => o.status === statusFilter)
    if (search) data = data.filter(o =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search)
    )
    setFiltered(data)
  }, [orders, search, statusFilter])

  const fetchOrders = async () => {
    try { const r = await getOrders(); setOrders(r.data.reverse()) }
    finally { setLoading(false) }
  }

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status)
    fetchOrders()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return
    await deleteOrder(id); fetchOrders()
  }

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" style={{ color:'#667eea' }}/></div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight:800, color:'#1a1a2e', marginBottom:2 }}>Orders</h4>
          <p style={{ color:'#6c757d', fontSize:'0.88rem', margin:0 }}>{orders.length} total orders</p>
        </div>
        <Link to="/orders/new" className="btn-primary-custom">
          <i className="bi bi-plus-lg me-1" /> New Bill
        </Link>
      </div>

      <div className="card-box">
        <div className="d-flex gap-3 mb-3 flex-wrap">
          <input className="form-control" style={{ maxWidth:260 }}
            placeholder="🔍  Search by customer or order #…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select className="form-select" style={{ maxWidth:180 }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {['ALL','PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Discount</th><th>Final</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-4 text-muted">No orders found.</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} style={{ cursor:'pointer' }} onClick={() => setSelected(o === selected ? null : o)}>
                  <td><strong>#{o.id}</strong></td>
                  <td>{o.customerName}</td>
                  <td>{o.orderItems?.length}</td>
                  <td>₹{o.totalAmount?.toFixed(2)}</td>
                  <td>{o.discountAmount > 0 ? `-₹${o.discountAmount?.toFixed(2)}` : '—'}</td>
                  <td><strong>₹{o.finalAmount?.toFixed(2)}</strong></td>
                  <td><span className={`badge-status badge-${o.status}`}>{o.status}</span></td>
                  <td style={{ fontSize:'0.8rem', color:'#6c757d' }}>
                    {new Date(o.orderDate).toLocaleDateString('en-IN')}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    {isAdmin() && (
                      <select className="form-select form-select-sm me-2"
                        style={{ display:'inline-block', width:'auto', fontSize:'0.78rem' }}
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value)}>
                        {['PENDING','CONFIRMED','COMPLETED','CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o.id)}>
                      <i className="bi bi-trash"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expanded order items */}
        {selected && (
          <div style={{ background:'#f8f9fa', borderRadius:10, padding:'16px 20px', marginTop:8 }}>
            <h6 className="fw-bold mb-2">Order #{selected.id} — Items</h6>
            <table className="table table-sm mb-0">
              <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
              <tbody>
                {selected.orderItems?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.unitPrice?.toFixed(2)}</td>
                    <td><strong>₹{item.subtotal?.toFixed(2)}</strong></td>
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
