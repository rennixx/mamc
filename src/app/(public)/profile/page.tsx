'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import {
  User, Star, Gift, Calendar, Copy, Check, LogOut,
  TrendingUp, TrendingDown, Clock, Award, ChevronRight,
  Edit3, Save, X
} from 'lucide-react'

interface UserProfile {
  id: string
  name?: string
  email: string
  phone?: string
  points: number
  referralCode?: string
  role: string
  createdAt: string
  _count: { bookings: number; referrals: number; rewards: number }
}

interface PointTx {
  id: string
  amount: number
  type: string
  description?: string
  createdAt: string
}

interface UserBooking {
  id: string
  service: string
  date: string
  time: string
  status: string
  name: string
}

interface UserRewardItem {
  id: string
  redeemedAt: string
  used: boolean
  reward: {
    title: string
    type: string
    pointCost: number
    discountPercent?: number
    freeService?: string
  }
}

export default function ProfilePage() {
  const { t } = useTranslation('auth')
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [points, setPoints] = useState<PointTx[]>([])
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [rewards, setRewards] = useState<UserRewardItem[]>([])
  const [activeTab, setActiveTab] = useState<'bookings' | 'points' | 'rewards'>('bookings')
  const [copied, setCopied] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (activeTab === 'bookings') fetchBookings()
    else if (activeTab === 'points') fetchPoints()
    else if (activeTab === 'rewards') fetchRewards()
  }, [activeTab])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/me')
      const data = await res.json()
      if (data.data) {
        setProfile(data.data)
        setEditName(data.data.name || '')
        setEditPhone(data.data.phone || '')
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    const res = await fetch('/api/user/bookings')
    const data = await res.json()
    if (data.data) setBookings(data.data)
  }

  const fetchPoints = async () => {
    const res = await fetch('/api/user/points')
    const data = await res.json()
    if (data.data) setPoints(data.data)
  }

  const fetchRewards = async () => {
    const res = await fetch('/api/user/rewards')
    const data = await res.json()
    if (data.data) setRewards(data.data)
  }

  const handleCopyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveProfile = async () => {
    const res = await fetch('/api/user/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, phone: editPhone || null }),
    })
    const data = await res.json()
    if (data.data) {
      setProfile(prev => prev ? { ...prev, ...data.data } : null)
      setEditing(false)
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    CONFIRMED: 'bg-blue-500/20 text-blue-400',
    COMPLETED: 'bg-green-500/20 text-green-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
  }

  const pointTypeIcons: Record<string, React.ReactNode> = {
    SIGNUP_BONUS: <Star className="w-4 h-4 text-gold-400" />,
    BOOKING_COMPLETED: <Calendar className="w-4 h-4 text-green-400" />,
    REFERRAL_BONUS: <Gift className="w-4 h-4 text-purple-400" />,
    REWARD_REDEEMED: <Award className="w-4 h-4 text-red-400" />,
    ADMIN_ADJUSTMENT: <Edit3 className="w-4 h-4 text-blue-400" />,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cream-300">Loading...</div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center">
                <User className="w-8 h-8 text-gold-400" />
              </div>
              <div>
                {editing ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="form-input text-lg font-bold"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-cream-100">
                    {profile.name || session?.user?.name || 'User'}
                  </h1>
                )}
                <p className="text-cream-400 text-sm">{profile.email}</p>
                {editing ? (
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="form-input text-sm mt-1"
                    placeholder="Phone"
                  />
                ) : (
                  profile.phone && <p className="text-cream-400 text-sm">{profile.phone}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={handleSaveProfile} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    <Save className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditing(false)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="p-2 rounded-lg bg-white/5 text-cream-400 hover:bg-white/10">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gold-400">{profile.points}</div>
              <div className="text-cream-400 text-xs mt-1">{t('profile.points')}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cream-100">{profile._count.bookings}</div>
              <div className="text-cream-400 text-xs mt-1">{t('profile.bookings')}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cream-100">{profile._count.referrals}</div>
              <div className="text-cream-400 text-xs mt-1">Referrals</div>
            </div>
          </div>

          {/* Referral Code */}
          {profile.referralCode && (
            <div className="bg-gold-500/5 border border-gold-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream-200 text-xs mb-1">{t('profile.referralCode')}</p>
                  <p className="text-gold-400 font-mono text-lg font-bold">{profile.referralCode}</p>
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 transition-colors text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? t('profile.copied') : t('profile.copyCode')}
                </button>
              </div>
              <p className="text-cream-200/60 text-xs mt-2">
                {t('profile.shareReferral')}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['bookings', 'points', 'rewards'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'glass-card text-cream-400 hover:text-cream-200'
              }`}
            >
              {tab === 'bookings' && <Calendar className="w-4 h-4" />}
              {tab === 'points' && <Star className="w-4 h-4" />}
              {tab === 'rewards' && <Gift className="w-4 h-4" />}
              {t(`profile.${tab === 'bookings' ? 'bookings' : tab === 'points' ? 'pointsHistory' : 'myRewards'}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-2xl p-6">
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-cream-400/30 mx-auto mb-3" />
                  <p className="text-cream-400">{t('profile.noBookings')}</p>
                  <Link href="/booking" className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:text-gold-300 text-sm font-medium">
                    {t('profile.bookNow')} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-cream-100 font-medium">{b.service}</p>
                      <p className="text-cream-400 text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {new Date(b.date).toLocaleDateString()} {b.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || ''}`}>
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Points Tab */}
          {activeTab === 'points' && (
            <div className="space-y-3">
              {points.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-cream-400/30 mx-auto mb-3" />
                  <p className="text-cream-400">{t('profile.noPoints')}</p>
                </div>
              ) : (
                points.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      {pointTypeIcons[p.type] || <Star className="w-4 h-4 text-cream-400" />}
                      <div>
                        <p className="text-cream-100 text-sm">{p.description || p.type.replace(/_/g, ' ')}</p>
                        <p className="text-cream-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm flex items-center gap-1 ${p.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {p.amount > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {p.amount > 0 ? '+' : ''}{p.amount}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <div className="space-y-3">
              {rewards.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-cream-400/30 mx-auto mb-3" />
                  <p className="text-cream-400">{t('profile.noRewards')}</p>
                  <Link href="/rewards" className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:text-gold-300 text-sm font-medium">
                    {t('profile.viewRewards')} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                rewards.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-cream-100 font-medium">{r.reward.title}</p>
                      <p className="text-cream-400 text-xs">
                        {r.reward.type === 'DISCOUNT' ? `${r.reward.discountPercent}% Discount` : `Free ${r.reward.freeService}`}
                      </p>
                      <p className="text-cream-400 text-xs mt-1">
                        Redeemed: {new Date(r.redeemedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.used ? 'bg-green-500/20 text-green-400' : 'bg-gold-500/20 text-gold-400'}`}>
                      {r.used ? 'Used' : 'Available'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
