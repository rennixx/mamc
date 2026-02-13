import type { Booking, BookingStats, ApiResponse, PaginatedResponse } from '@/types'

const API_BASE = '/api/bookings'

export async function getAllBookings(): Promise<Booking[]> {
  const res = await fetch(API_BASE)
  const json: ApiResponse<Booking[]> = await res.json()
  return json.data ?? []
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) return null
  const json: ApiResponse<Booking> = await res.json()
  return json.data ?? null
}

export async function getBookingsByStatus(status: string): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}?status=${status}`)
  const json: ApiResponse<Booking[]> = await res.json()
  return json.data ?? []
}

export async function getBookingsByDateRange(start: string, end: string): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}?startDate=${start}&endDate=${end}`)
  const json: ApiResponse<Booking[]> = await res.json()
  return json.data ?? []
}

export async function getBookingStats(): Promise<BookingStats> {
  const res = await fetch(`${API_BASE}/stats`)
  const json: ApiResponse<BookingStats> = await res.json()
  return json.data ?? { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0 }
}

export async function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'horses' | 'location'> & {
  horseIds?: string[]
  location?: {
    ip: string; city?: string; region?: string; country?: string
    countryCode?: string; latitude?: number; longitude?: number; org?: string
  }
}): Promise<Booking> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Booking> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to create booking')
  return json.data!
}

export async function updateBooking(id: string, data: Partial<Booking>): Promise<Booking> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Booking> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to update booking')
  return json.data!
}

export async function deleteBooking(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json: ApiResponse<null> = await res.json()
    throw new Error(json.error ?? 'Failed to delete booking')
  }
}
