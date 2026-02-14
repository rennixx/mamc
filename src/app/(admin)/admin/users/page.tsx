'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Users, Search, Star, Calendar, Gift, Shield,
  ChevronRight, X, Plus, Minus
} from 'lucide-react'

interface AdminUser {
  id: string
  name?: string
  email: string
  phone?: string
  role: string
  points: number
  referralCode?: string
  createdAt: string
  _count: { bookings: number; referrals: number; rewards: number }
}

export default function AdminUsersPage() {
  const { t } = useTranslation('admin')
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [adjustUserId, setAdjustUserId] = useState<string | null>(null)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [adjustReason, setAdjustReason] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        pageSize: '20',
      })
      const res = await fetch(`/api/admin/users?${params}`)
      const data = await res.json()
      if (data.data) {
        setUsers(data.data)
        setTotal(data.total)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    fetchUsers()
  }

  const handlePointAdjust = async () => {
    if (!adjustUserId || adjustAmount === 0) return
    await fetch(`/api/admin/users/${adjustUserId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pointAdjustment: adjustAmount,
        adjustmentReason: adjustReason,
      }),
    })
    setShowAdjustModal(false)
    setAdjustAmount(0)
    setAdjustReason('')
    fetchUsers()
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-500/20 text-red-400',
    STAFF: 'bg-blue-500/20 text-blue-400',
    USER: 'bg-green-500/20 text-green-400',
  }

  const totalPages = Math.ceil(total / 20)

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
      <div>
        <h1 className="text-2xl font-bold text-cream-100 flex items-center gap-3">
          <Users className="w-7 h-7 text-gold-400" />
          Users Management
        </h1>
        <p className="text-cream-400 text-sm mt-1">{total} total users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by name, email, or phone..."
          className="form-input w-full ps-10"
        />
      </div>

      {/* Users Table */}
      <div className="admin-glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-100/10">
                <th className="text-start p-4 text-cream-400 text-sm font-medium">User</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">Role</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">Points</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">Bookings</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">Referrals</th>
                <th className="text-start p-4 text-cream-400 text-sm font-medium">Joined</th>
                <th className="text-end p-4 text-cream-400 text-sm font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-cream-100/5 hover:bg-white/5">
                  <td className="p-4">
                    <div>
                      <p className="text-cream-100 font-medium">{user.name || 'Unnamed'}</p>
                      <p className="text-cream-400 text-xs">{user.email}</p>
                      {user.phone && <p className="text-cream-400 text-xs">{user.phone}</p>}
                    </div>
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${roleColors[user.role] || ''}`}
                    >
                      <option value="USER">USER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-gold-400" />
                      <span className="text-gold-400 font-medium">{user.points}</span>
                      <button
                        onClick={() => { setAdjustUserId(user.id); setShowAdjustModal(true) }}
                        className="p-1 rounded bg-white/5 text-cream-400 hover:bg-white/10"
                        title="Adjust points"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-cream-300">
                      <Calendar className="w-3 h-3" />
                      {user._count.bookings}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-cream-300">
                      <Gift className="w-3 h-3" />
                      {user._count.referrals}
                    </div>
                  </td>
                  <td className="p-4 text-cream-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-end">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 rounded-lg bg-white/5 text-cream-400 hover:bg-white/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-cream-100/10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  p === page ? 'bg-gold-500 text-forest-900 font-bold' : 'bg-white/5 text-cream-400 hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Point Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-cream-100">Adjust Points</h3>
              <button onClick={() => setShowAdjustModal(false)} className="p-2 rounded-lg bg-white/5 text-cream-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Amount (positive to add, negative to deduct)</label>
                <div className="flex gap-2">
                  <button onClick={() => setAdjustAmount(prev => prev - 50)} className="p-2 rounded-lg bg-red-500/20 text-red-400">
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                    className="form-input flex-1 text-center"
                  />
                  <button onClick={() => setAdjustAmount(prev => prev + 50)} className="p-2 rounded-lg bg-green-500/20 text-green-400">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Reason</label>
                <input
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="form-input w-full"
                  placeholder="Reason for adjustment"
                />
              </div>
              <button
                onClick={handlePointAdjust}
                disabled={adjustAmount === 0}
                className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-cream-100">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 rounded-lg bg-white/5 text-cream-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-cream-100 font-bold text-lg">{selectedUser.name || 'Unnamed'}</p>
                  <p className="text-cream-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-cream-400 text-xs">Role</p>
                  <p className={`text-sm font-medium ${roleColors[selectedUser.role]?.split(' ')[1] || 'text-cream-100'}`}>{selectedUser.role}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-cream-400 text-xs">Points</p>
                  <p className="text-gold-400 font-bold">{selectedUser.points}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-cream-400 text-xs">Phone</p>
                  <p className="text-cream-100 text-sm">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-cream-400 text-xs">Referral Code</p>
                  <p className="text-cream-100 text-sm font-mono">{selectedUser.referralCode || 'N/A'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-cream-400 text-xs">Bookings</p>
                  <p className="text-cream-100 font-medium">{selectedUser._count.bookings}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-cream-400 text-xs">Referrals</p>
                  <p className="text-cream-100 font-medium">{selectedUser._count.referrals}</p>
                </div>
              </div>
              <p className="text-cream-400 text-xs">
                Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
