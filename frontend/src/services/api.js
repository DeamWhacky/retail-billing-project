import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data)
export const register = (data) => API.post('/auth/register', data)

// ── Products ──────────────────────────────────────────────────
export const getProducts = () => API.get('/products')
export const getProductById = (id) => API.get(`/products/${id}`)
export const getProductsByCategory = (cat) => API.get(`/products/category/${cat}`)
export const searchProducts = (name) => API.get(`/products/search?name=${name}`)
export const createProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// ── Customers ─────────────────────────────────────────────────
export const getCustomers = () => API.get('/customers')
export const getCustomerById = (id) => API.get(`/customers/${id}`)
export const searchCustomers = (name) => API.get(`/customers/search?name=${name}`)
export const createCustomer = (data) => API.post('/customers', data)
export const updateCustomer = (id, data) => API.put(`/customers/${id}`, data)
export const deleteCustomer = (id) => API.delete(`/customers/${id}`)

// ── Orders ────────────────────────────────────────────────────
export const getOrders = () => API.get('/orders')
export const getOrderById = (id) => API.get(`/orders/${id}`)
export const getOrdersByCustomer = (cid) => API.get(`/orders/customer/${cid}`)
export const createOrder = (data) => API.post('/orders', data)
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status })
export const deleteOrder = (id) => API.delete(`/orders/${id}`)
export const getOrderStats = () => API.get('/orders/stats/revenue')
