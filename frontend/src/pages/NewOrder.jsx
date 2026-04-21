import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCustomers, getProducts, createOrder, createCustomer } from '../services/api'

export default function NewOrder() {
  const [customers, setCustomers] = useState([])
  const [products, setProducts]   = useState([])
  const [customerId, setCustomerId] = useState('')
  const [items, setItems]         = useState([{ productId: '', quantity: 1 }])
  const [discount, setDiscount]   = useState(0)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
  const [loading, setLoading]     = useState(false)

  // Quick-add customer inline
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [newCust, setNewCust] = useState({ name:'', email:'', phone:'' })
  const [custError, setCustError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getCustomers(), getProducts()]).then(([c, p]) => {
      setCustomers(c.data)
      setProducts(p.data.filter(p => p.stockQuantity > 0))
    })
  }, [])

  const addItem = () => setItems([...items, { productId:'', quantity:1 }])
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i, field, value) => {
    const updated = [...items]
    updated[i][field] = value
    setItems(updated)
  }

  const getProduct = (id) => products.find(p => String(p.id) === String(id))

  const total = items.reduce((sum, item) => {
    const p = getProduct(item.productId)
    return sum + (p ? p.price * item.quantity : 0)
  }, 0)
  const finalAmount = Math.max(0, total - parseFloat(discount || 0))

  const handleAddCustomer = async () => {
    setCustError('')
    if (!newCust.name || !newCust.email || !newCust.phone) { setCustError('All fields required'); return }
    try {
      const res = await createCustomer(newCust)
      setCustomers(prev => [...prev, res.data])
      setCustomerId(String(res.data.id))
      setShowNewCustomer(false)
      setNewCust({ name:'', email:'', phone:'' })
    } catch (e) {
      setCustError(e.response?.data?.message || 'Failed to add customer')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!customerId) { setError('Please select a customer.'); return }
    if (items.some(i => !i.productId || i.quantity < 1)) { setError('All items must have a product and quantity.'); return }

    setLoading(true)
    try {
      await createOrder({
        customerId: parseInt(customerId),
        items: items.map(i => ({ productId: parseInt(i.productId), quantity: parseInt(i.quantity) })),
        discountAmount: parseFloat(discount || 0),
      })
      setSuccess('Bill created successfully!')
      setTimeout(() => navigate('/orders'), 1200)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create order.')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="mb-4">
        <h4 style={{ fontWeight:800, color:'#1a1a2e', marginBottom:2 }}>New Bill</h4>
        <p style={{ color:'#6c757d', fontSize:'0.88rem', margin:0 }}>Create a new billing order</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-box">
            {error   && <div className="alert-error mb-3">{error}</div>}
            {success && <div style={{ background:'#d1e7dd',color:'#0a3622',borderRadius:8,padding:'10px 14px',fontSize:'0.87rem',marginBottom:12 }}>{success}</div>}

            <form onSubmit={handleSubmit}>
              {/* Customer */}
              <div className="mb-4">
                <label className="form-label fw-bold">Customer</label>
                <div className="d-flex gap-2">
                  <select className="form-select" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                    <option value="">— Select Customer —</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
                  <button type="button" className="btn btn-outline-secondary text-nowrap"
                    onClick={() => setShowNewCustomer(!showNewCustomer)}>
                    <i className="bi bi-person-plus" />
                  </button>
                </div>

                {showNewCustomer && (
                  <div style={{ background:'#f8f9fa', borderRadius:10, padding:16, marginTop:12 }}>
                    <h6 className="fw-bold mb-3">Quick Add Customer</h6>
                    {custError && <div className="alert-error mb-2">{custError}</div>}
                    <div className="row g-2">
                      {[{n:'name',p:'Full Name'},{n:'email',p:'Email'},{n:'phone',p:'Phone'}].map(f => (
                        <div className="col-md-4" key={f.n}>
                          <input className="form-control form-control-sm" placeholder={f.p}
                            value={newCust[f.n]} onChange={e => setNewCust({...newCust,[f.n]:e.target.value})}/>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 d-flex gap-2">
                      <button type="button" className="btn btn-sm btn-success" onClick={handleAddCustomer}>Add</button>
                      <button type="button" className="btn btn-sm btn-light" onClick={() => setShowNewCustomer(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0">Items</label>
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={addItem}>
                    <i className="bi bi-plus me-1"/>Add Item
                  </button>
                </div>

                {items.map((item, i) => {
                  const prod = getProduct(item.productId)
                  return (
                    <div key={i} className="d-flex gap-2 mb-2 align-items-center">
                      <select className="form-select" value={item.productId}
                        onChange={e => updateItem(i, 'productId', e.target.value)}>
                        <option value="">— Select Product —</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} — ₹{p.price} (stock: {p.stockQuantity})
                          </option>
                        ))}
                      </select>
                      <input type="number" className="form-control" style={{ width:90 }}
                        min={1} max={prod?.stockQuantity || 999}
                        value={item.quantity}
                        onChange={e => updateItem(i, 'quantity', e.target.value)}
                      />
                      <span style={{ minWidth:90, fontSize:'0.88rem', color:'#1a1a2e', fontWeight:600 }}>
                        {prod ? `₹${(prod.price * item.quantity).toFixed(2)}` : ''}
                      </span>
                      {items.length > 1 && (
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeItem(i)}>
                          <i className="bi bi-x"/>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Discount */}
              <div className="mb-4" style={{ maxWidth:220 }}>
                <label className="form-label fw-bold">Discount (₹)</label>
                <input type="number" className="form-control" min={0}
                  value={discount} onChange={e => setDiscount(e.target.value)}/>
              </div>

              <button type="submit" className="btn-primary-custom" disabled={loading}
                style={{ padding:'11px 28px', fontSize:'0.95rem' }}>
                {loading ? 'Processing…' : <><i className="bi bi-check-lg me-1"/>Generate Bill</>}
              </button>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="card-box">
            <h5>Bill Summary</h5>
            <div style={{ borderTop:'2px dashed #e9ecef', paddingTop:16 }}>
              {items.filter(i => i.productId).map((item, i) => {
                const p = getProduct(item.productId)
                return p ? (
                  <div key={i} className="d-flex justify-content-between mb-2" style={{ fontSize:'0.88rem' }}>
                    <span>{p.name} × {item.quantity}</span>
                    <span>₹{(p.price * item.quantity).toFixed(2)}</span>
                  </div>
                ) : null
              })}
              {items.filter(i=>i.productId).length === 0 && (
                <p style={{ color:'#adb5bd', fontSize:'0.85rem', textAlign:'center' }}>No items added yet</p>
              )}
            </div>
            <div style={{ borderTop:'1px solid #e9ecef', marginTop:12, paddingTop:12 }}>
              <div className="d-flex justify-content-between mb-1" style={{ fontSize:'0.88rem' }}>
                <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
              </div>
              {parseFloat(discount) > 0 && (
                <div className="d-flex justify-content-between mb-1" style={{ fontSize:'0.88rem', color:'#198754' }}>
                  <span>Discount</span><span>-₹{parseFloat(discount).toFixed(2)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mt-2" style={{ fontWeight:800, fontSize:'1.1rem', color:'#1a1a2e' }}>
                <span>Total</span><span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
