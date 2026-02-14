const API_BASE = '/api/user'

export async function getProfile() {
  const res = await fetch(`${API_BASE}/me`)
  return res.json()
}

export async function updateProfile(data: { name?: string; phone?: string; image?: string }) {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function getPointsHistory(page = 1, pageSize = 20) {
  const res = await fetch(`${API_BASE}/points?page=${page}&pageSize=${pageSize}`)
  return res.json()
}

export async function getUserRewards() {
  const res = await fetch(`${API_BASE}/rewards`)
  return res.json()
}

export async function getUserBookings(page = 1, pageSize = 10) {
  const res = await fetch(`${API_BASE}/bookings?page=${page}&pageSize=${pageSize}`)
  return res.json()
}

// Admin
export async function getAdminUsers(search = '', page = 1, pageSize = 20) {
  const params = new URLSearchParams({ search, page: page.toString(), pageSize: pageSize.toString() })
  const res = await fetch(`/api/admin/users?${params}`)
  return res.json()
}

export async function getAdminUser(id: string) {
  const res = await fetch(`/api/admin/users/${id}`)
  return res.json()
}

export async function updateAdminUser(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}
