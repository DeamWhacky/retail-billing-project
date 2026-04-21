import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

const EMPTY = { name: '', category: '', price: '', stockQuantity: '', description: '' }

export default function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    setFiltered(
      products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [search, products])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } finally { setLoading(false) }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())           e.name = 'Product name is required'
    if (!form.category.trim())       e.category = 'Category is required'
    if (!form.price || form.price <= 0) e.price = 'Valid price required'
    if (form.stockQuantity === '' || form.stockQuantity < 0) e.stockQuantity = 'Stock quantity required'
    return e
  }

  const openAdd = () => { setEditing(null); setForm(EMPTY); setErrors({}); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({ name: p.name, category: p.category, price: p.price, stockQuantity: p.stockQuantity, description: p.description || '' })
    setErrors({})
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      const payload = { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity) }
      if (editing) await updateProduct(editing, payload)
      else await createProduct(payload)
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Operation failed' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id)
    fetchProducts()
  }

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" style={{ color:'#667eea' }}/></div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight:800, color:'#1a1a2e', marginBottom:2 }}>Products</h4>
          <p style={{ color:'#6c757d', fontSize:'0.88rem', margin:0 }}>{products.length} products in inventory</p>
        </div>
        {isAdmin() && (
          <button className="btn-primary-custom" onClick={openAdd}>
            <i className="bi bi-plus-lg me-1" /> Add Product
          </button>
        )}
      </div>

      <div className="card-box">
        <div className="mb-3">
          <input
            className="form-control" style={{ maxWidth:320 }}
            placeholder="🔍  Search by name or category…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th>{isAdmin() && <th>Actions</th>}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-muted">No products found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td><strong>{p.name}</strong><div style={{ fontSize:'0.78rem', color:'#6c757d' }}>{p.description}</div></td>
                  <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                  <td><strong>₹{p.price.toFixed(2)}</strong></td>
                  <td>
                    <span style={{ color: p.stockQuantity < 5 ? '#dc3545' : '#198754', fontWeight:600 }}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  {isAdmin() && (
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(p)}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ background:'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius:12 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editing ? 'Edit Product' : 'Add Product'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {errors.api && <div className="alert-error mb-3">{errors.api}</div>}
                  {[
                    { name:'name', label:'Product Name', type:'text' },
                    { name:'category', label:'Category', type:'text' },
                    { name:'price', label:'Price (₹)', type:'number' },
                    { name:'stockQuantity', label:'Stock Quantity', type:'number' },
                    { name:'description', label:'Description (optional)', type:'text' },
                  ].map(f => (
                    <div className="mb-3" key={f.name}>
                      <label className="form-label fw-semibold" style={{ fontSize:'0.87rem' }}>{f.label}</label>
                      <input
                        type={f.type} className={`form-control ${errors[f.name] ? 'is-invalid' : ''}`}
                        value={form[f.name]}
                        onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                      />
                      {errors[f.name] && <div className="invalid-feedback">{errors[f.name]}</div>}
                    </div>
                  ))}
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary-custom">{editing ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
