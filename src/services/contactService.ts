import type { ContactMessage, ApiResponse } from '@/types'

const API_BASE = '/api/contact'

export async function submitContactMessage(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}): Promise<ContactMessage> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json: ApiResponse<ContactMessage> = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Failed to send message')
  return json.data!
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const res = await fetch(API_BASE)
  const json: ApiResponse<ContactMessage[]> = await res.json()
  return json.data ?? []
}

export async function markMessageRead(id: string): Promise<void> {
  await fetch(`${API_BASE}/${id}/read`, { method: 'PATCH' })
}
