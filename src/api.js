// Thin client for the ticket-system Go API.
// Base URL can be overridden with VITE_API_URL (see .env.example).
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ticket-system-backend-sn4y.onrender.com'

const TOKEN_KEY = 'deskline_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError(
      `Could not reach the API at ${BASE_URL}. Is the server running and is CORS enabled?`,
      0
    )
  }

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed with status ${res.status}`, res.status)
  }

  return data
}

export const api = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', body: { name, email, password } }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  listTickets: () => request('/tickets', { auth: true }),

  getTicket: (id) => request(`/tickets/${id}`, { auth: true }),

  createTicket: (title, description) =>
    request('/tickets', { method: 'POST', body: { title, description }, auth: true }),

  updateTicketStatus: (id, status) =>
    request(`/tickets/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
}

export { ApiError, BASE_URL }
