import type { Horse, ApiResponse } from '@/types'

const API_BASE = '/api/horses'

export async function getAllHorses(): Promise<Horse[]> {
  const res = await fetch(API_BASE)
  const json: ApiResponse<Horse[]> = await res.json()
  return json.data ?? []
}

export async function getAvailableHorses(): Promise<Horse[]> {
  const res = await fetch(`${API_BASE}?available=true`)
  const json: ApiResponse<Horse[]> = await res.json()
  return json.data ?? []
}

export async function getHorseById(id: string): Promise<Horse | null> {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) return null
  const json: ApiResponse<Horse> = await res.json()
  return json.data ?? null
}

export async function getHorsesByExperienceLevel(level: string): Promise<Horse[]> {
  const res = await fetch(`${API_BASE}?experienceLevel=${level}`)
  const json: ApiResponse<Horse[]> = await res.json()
  return json.data ?? []
}

export async function createHorse(data: Omit<Horse, 'id' | 'createdAt' | 'updatedAt'>): Promise<Horse> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Horse> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to create horse')
  return json.data!
}

export async function updateHorse(id: string, data: Partial<Horse>): Promise<Horse> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<Horse> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to update horse')
  return json.data!
}

export async function deleteHorse(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const json: ApiResponse<null> = await res.json()
    throw new Error(json.error ?? 'Failed to delete horse')
  }
}

export async function toggleHorseAvailability(id: string): Promise<Horse> {
  const res = await fetch(`${API_BASE}/${id}/toggle`, { method: 'PATCH' })
  const json: ApiResponse<Horse> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to toggle availability')
  return json.data!
}
