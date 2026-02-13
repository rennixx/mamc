import type { CalendarDay, BookedSlot, ApiResponse } from '@/types'

const API_BASE = '/api/calendar'

export async function getDayConfig(date: string): Promise<CalendarDay | null> {
  const res = await fetch(`${API_BASE}/${date}`)
  if (!res.ok) return null
  const json: ApiResponse<CalendarDay> = await res.json()
  return json.data ?? null
}

export async function isDateAvailable(date: string): Promise<boolean> {
  const config = await getDayConfig(date)
  if (!config) return true // No config = available
  return !config.blocked
}

export async function getAvailableSlots(date: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/${date}/slots`)
  const json: ApiResponse<string[]> = await res.json()
  return json.data ?? []
}

export async function blockDate(date: string, reason?: string): Promise<CalendarDay> {
  const res = await fetch(`${API_BASE}/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, reason }),
  })
  const json: ApiResponse<CalendarDay> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to block date')
  return json.data!
}

export async function unblockDate(date: string): Promise<void> {
  const res = await fetch(`${API_BASE}/unblock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date }),
  })
  if (!res.ok) throw new Error('Failed to unblock date')
}

export async function setDateConfig(
  date: string,
  config: { availableSlots?: string[]; capacity?: number }
): Promise<CalendarDay> {
  const res = await fetch(`${API_BASE}/${date}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })
  const json: ApiResponse<CalendarDay> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to update date config')
  return json.data!
}

export async function bookTimeSlot(date: string, time: string, bookingId: string): Promise<BookedSlot> {
  const res = await fetch(`${API_BASE}/book-slot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time, bookingId }),
  })
  const json: ApiResponse<BookedSlot> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to book slot')
  return json.data!
}

export async function releaseSlot(date: string, time: string, bookingId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/release-slot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, time, bookingId }),
  })
  if (!res.ok) throw new Error('Failed to release slot')
}
