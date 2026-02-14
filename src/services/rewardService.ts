import type { Reward } from '@/types'

const API_BASE = '/api/rewards'

export async function getAllRewards(includeInactive = false) {
  const url = includeInactive ? `${API_BASE}?all=true` : API_BASE
  const res = await fetch(url)
  return res.json()
}

export async function getRewardById(id: string) {
  const res = await fetch(`${API_BASE}/${id}`)
  return res.json()
}

export async function createReward(data: Partial<Reward>) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateReward(id: string, data: Partial<Reward>) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteReward(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
  return res.json()
}

export async function redeemReward(rewardId: string) {
  const res = await fetch(`${API_BASE}/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rewardId }),
  })
  return res.json()
}
