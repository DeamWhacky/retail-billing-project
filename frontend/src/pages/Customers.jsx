import { useState, useEffect } from 'react'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/api'

const EMPTY = { name: '', email: '', phone: '', address: '', city: '', pincode: '' }

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [filtered, setFiltered]   = useState([])
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => { fetchCustomers() }, [])
  useEffect(() => {
    setFiltered(customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    ))
  }, [search, customers])

  const fetchCustomers = async () => {
    try { const r = await getCustomers(); setCustomers(r.data) }
    finally { setLoading(false) }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit Indian phone required'
    return e
  }

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setErrors({}); setShowModal(true) }
  const openEdit = (c) => {
    setEditing(c.id)
    setForm({ name:c.name, email:c.email, phone:c.phone, address:c.address||'', city:c.city||'', pincode:c.pincode||'' })
    setErrors({}); setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      if (editing) await updateCustomer(editing, form)
      else await createCustomer(form)
      setShowModal(false); fetchCustomers()
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Operation failed' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return
    await deleteCustomer(id); fetchCustomers()
  }

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" style={{ color:'#667eea' }}/></div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight:800, color:'#1a1a2e', marginBottom:2 }}>Customers</h4>
          <p style={{ color:'#6c757d', fontSize:'0.88rem', margin:0 }}>{customers.length} registered customers</p>
        </div>
        <button className="btn-primary-custom" onClick={openAdd}>
          <i className="bi bi-person-plus me-1" /> Add Customer
        </button>
      </div>

      <div className="card-box">
        <div className="mb-3">
          <input className="form-control" style={{ maxWidth:320 }}
            placeholder="🔍  Search by name, email or phone…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-muted">No customers found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.city || '—'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(c)}><i className="bi bi-pencil"/></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id)}><i className="bi bi-trash"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background:'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius:12 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">{editing ? 'Edit Customer' : 'Add Customer'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}/>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {errors.api && <div className="alert-error mb-3">{errors.api}</div>}
                  {[
                    { name:'name',    label:'Full Name',  type:'text' },
                    { name:'email',   label:'Email',      type:'email' },
                    { name:'phone',   label:'Phone',      type:'text' },
                    { name:'address', label:'Address (optional)', type:'text' },
                    { name:'city',    label:'City (optional)',    type:'text' },
                    { name:'pincode', label:'Pincode (optional)', type:'text' },
                  ].map(f => (
                    <div className="mb-3" key={f.name}>
                      <label className="form-label fw-semibold" style={{ fontSize:'0.87rem' }}>{f.label}</label>
                      <input
                        type={f.type} className={`form-control ${errors[f.name] ? 'is-invalid':''}`}
                        value={form[f.name]} onChange={e => setForm({...form,[f.name]:e.target.value})}
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
