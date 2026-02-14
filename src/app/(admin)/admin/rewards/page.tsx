'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Gift, Plus, Edit3, Trash2, X, Tag, Sparkles, Search
} from 'lucide-react'
import type { Reward } from '@/types'

type RewardForm = {
  title: string; titleKu: string; titleAr: string
  description: string; descriptionKu: string; descriptionAr: string
  type: 'DISCOUNT' | 'FREE_SERVICE'
  pointCost: number; discountPercent: number
  freeService: string; active: boolean
  stock: string; image: string
}

const emptyForm: RewardForm = {
  title: '', titleKu: '', titleAr: '',
  description: '', descriptionKu: '', descriptionAr: '',
  type: 'DISCOUNT', pointCost: 100, discountPercent: 10,
  freeService: 'SAFARI', active: true, stock: '', image: '',
}

export default function AdminRewardsPage() {
  const { t } = useTranslation('rewards')
  const [rewards, setRewards] = useState<(Reward & { _count?: { redemptions: number } })[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<RewardForm>(emptyForm)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const res = await fetch('/api/rewards?all=true')
      const data = await res.json()
      if (data.data) setRewards(data.data)
    } catch (err) {
      console.error('Failed to fetch rewards:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      ...form,
      stock: form.stock ? parseInt(form.stock) : null,
      discountPercent: form.type === 'DISCOUNT' ? form.discountPercent : null,
      freeService: form.type === 'FREE_SERVICE' ? form.freeService : null,
    }

    const url = editingId ? `/api/rewards/${editingId}` : '/api/rewards'
    const method = editingId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setShowModal(false)
      setEditingId(null)
      setForm(emptyForm)
      fetchRewards()
    }
  }

  const handleEdit = (reward: Reward) => {
    setEditingId(reward.id)
    setForm({
      title: reward.title,
      titleKu: reward.titleKu || '',
      titleAr: reward.titleAr || '',
      description: reward.description || '',
      descriptionKu: reward.descriptionKu || '',
      descriptionAr: reward.descriptionAr || '',
      type: reward.type,
      pointCost: reward.pointCost,
      discountPercent: reward.discountPercent || 10,
      freeService: reward.freeService || 'SAFARI',
      active: reward.active,
      stock: reward.stock?.toString() || '',
      image: reward.image || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return
    await fetch(`/api/rewards/${id}`, { method: 'DELETE' })
    fetchRewards()
  }

  const filtered = rewards.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.titleKu && r.titleKu.includes(search)) ||
    (r.titleAr && r.titleAr.includes(search))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-cream-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream-100 flex items-center gap-3">
            <Gift className="w-7 h-7 text-gold-400" />
            {t('admin.title')}
          </h1>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('admin.addReward')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rewards..."
          className="form-input w-full ps-10"
        />
      </div>

      {/* Rewards Table */}
      <div className="admin-glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100/10">
                <th className="text-start p-4 text-cream-400 text-sm font-medium">{t('admin.rewardTitle')}</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">{t('admin.type')}</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">{t('admin.pointCost')}</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">{t('admin.stock')}</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">{t('admin.redemptions')}</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">{t('admin.active')}</th>
                <th className="text-end p-4 text-cream-400 text-sm font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reward) => (
                <tr key={reward.id} className="border-b border-cream-100/5 hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        reward.type === 'DISCOUNT' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      }`}>
                        {reward.type === 'DISCOUNT' ? <Tag className="w-4 h-4 text-blue-400" /> : <Sparkles className="w-4 h-4 text-purple-400" />}
                      </div>
                      <span className="text-cream-100 font-medium">{reward.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      reward.type === 'DISCOUNT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {reward.type === 'DISCOUNT' ? `${reward.discountPercent}%` : reward.freeService}
                    </span>
                  </td>
                  <td className="p-4 text-gold-400 font-medium">{reward.pointCost}</td>
                  <td className="p-4 text-cream-300">{reward.stock ?? '∞'}</td>
                  <td className="p-4 text-cream-300">{reward._count?.redemptions ?? 0}</td>
                  <td className="p-4">
                    <span className={`w-3 h-3 rounded-full inline-block ${reward.active ? 'bg-green-400' : 'bg-red-400'}`} />
                  </td>
                  <td className="p-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(reward)} className="p-2 rounded-lg bg-white/5 text-cream-400 hover:bg-white/10">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(reward.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-cream-100">
                {editingId ? t('admin.editReward') : t('admin.addReward')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg bg-white/5 text-cream-400 hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">{t('admin.rewardTitle')}</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input w-full" required />
                </div>
                <div>
                  <label className="form-label">{t('admin.rewardTitleKu')}</label>
                  <input value={form.titleKu} onChange={e => setForm({...form, titleKu: e.target.value})} className="form-input w-full" />
                </div>
                <div>
                  <label className="form-label">{t('admin.rewardTitleAr')}</label>
                  <input value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} className="form-input w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">{t('admin.description')}</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input w-full" rows={3} />
                </div>
                <div>
                  <label className="form-label">{t('admin.descriptionKu')}</label>
                  <textarea value={form.descriptionKu} onChange={e => setForm({...form, descriptionKu: e.target.value})} className="form-input w-full" rows={3} />
                </div>
                <div>
                  <label className="form-label">{t('admin.descriptionAr')}</label>
                  <textarea value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} className="form-input w-full" rows={3} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="form-label">{t('admin.type')}</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'DISCOUNT' | 'FREE_SERVICE'})} className="form-input w-full">
                    <option value="DISCOUNT">Discount</option>
                    <option value="FREE_SERVICE">Free Service</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('admin.pointCost')}</label>
                  <input type="number" value={form.pointCost} onChange={e => setForm({...form, pointCost: parseInt(e.target.value)})} className="form-input w-full" required min={1} />
                </div>
                {form.type === 'DISCOUNT' && (
                  <div>
                    <label className="form-label">{t('admin.discountPercent')}</label>
                    <input type="number" value={form.discountPercent} onChange={e => setForm({...form, discountPercent: parseInt(e.target.value)})} className="form-input w-full" min={1} max={100} />
                  </div>
                )}
                {form.type === 'FREE_SERVICE' && (
                  <div>
                    <label className="form-label">{t('admin.freeService')}</label>
                    <select value={form.freeService} onChange={e => setForm({...form, freeService: e.target.value})} className="form-input w-full">
                      <option value="SAFARI">Safari</option>
                      <option value="ACADEMY">Academy</option>
                      <option value="PRIVATE">Private</option>
                      <option value="EVENT">Event</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="form-label">{t('admin.stock')}</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="form-input w-full" min={0} placeholder="∞" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">{t('admin.image')}</label>
                  <input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="form-input w-full" placeholder="https://..." />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-4 h-4 rounded" />
                    <span className="text-cream-200 text-sm">{t('admin.active')}</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 py-3 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors">
                  {t('admin.saveReward')}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-white/5 text-cream-400 hover:bg-white/10 rounded-xl transition-colors">
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
