'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Gift, Star, Tag, Sparkles, LogIn } from 'lucide-react'
import type { Reward } from '@/types'

export default function RewardsPage() {
  const { t, i18n } = useTranslation('rewards')
  const { data: session } = useSession()
  const [rewards, setRewards] = useState<(Reward & { _count?: { redemptions: number } })[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)

  useEffect(() => {
    fetchRewards()
    if (session?.user?.id) fetchUserPoints()
  }, [session])

  const fetchRewards = async () => {
    try {
      const res = await fetch('/api/rewards')
      const data = await res.json()
      if (data.data) setRewards(data.data)
    } catch (err) {
      console.error('Failed to fetch rewards:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPoints = async () => {
    const res = await fetch('/api/user/me')
    const data = await res.json()
    if (data.data) setUserPoints(data.data.points)
  }

  const handleRedeem = async (rewardId: string, pointCost: number) => {
    if (!session?.user?.id) return
    if (userPoints < pointCost) return

    const confirmed = window.confirm(t('catalog.confirmRedeem', { cost: pointCost }))
    if (!confirmed) return

    setRedeeming(rewardId)
    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      })

      if (res.ok) {
        setUserPoints(prev => prev - pointCost)
        alert(t('catalog.redeemSuccess'))
        fetchRewards()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to redeem')
      }
    } catch {
      alert('Failed to redeem')
    }
    setRedeeming(null)
  }

  const getLocalizedTitle = (reward: Reward) => {
    if (i18n.language === 'ku' && reward.titleKu) return reward.titleKu
    if (i18n.language === 'ar' && reward.titleAr) return reward.titleAr
    return reward.title
  }

  const getLocalizedDescription = (reward: Reward) => {
    if (i18n.language === 'ku' && reward.descriptionKu) return reward.descriptionKu
    if (i18n.language === 'ar' && reward.descriptionAr) return reward.descriptionAr
    return reward.description
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cream-300">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cream-100 font-display mb-4">
            {t('catalog.title')}
          </h1>
          <p className="text-cream-300 text-lg max-w-2xl mx-auto">
            {t('catalog.subtitle')}
          </p>

          {/* User points badge */}
          {session?.user ? (
            <div className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold-500/10 border border-gold-500/20 rounded-full">
              <Star className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-bold text-lg">{userPoints}</span>
              <span className="text-cream-400 text-sm">{t('catalog.yourPoints')}</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold-500/10 border border-gold-500/20 rounded-full text-gold-400 hover:bg-gold-500/20 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              {t('catalog.loginToRedeem')}
            </Link>
          )}
        </div>

        {/* Rewards Grid */}
        {rewards.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 text-cream-400/30 mx-auto mb-4" />
            <p className="text-cream-400 text-lg">{t('catalog.noRewards')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const canAfford = session?.user && userPoints >= reward.pointCost
              const outOfStock = reward.stock !== null && reward.stock !== undefined && reward.stock <= 0

              return (
                <div key={reward.id} className="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-transform">
                  {/* Image / Icon */}
                  <div className="h-40 bg-gradient-to-br from-gold-500/10 to-forest-800/50 flex items-center justify-center relative">
                    {reward.image ? (
                      <img src={reward.image} alt={getLocalizedTitle(reward)} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {reward.type === 'DISCOUNT' ? (
                          <Tag className="w-12 h-12 text-gold-400" />
                        ) : (
                          <Sparkles className="w-12 h-12 text-gold-400" />
                        )}
                      </div>
                    )}

                    {/* Type badge */}
                    <span className={`absolute top-3 end-3 px-3 py-1 rounded-full text-xs font-medium ${
                      reward.type === 'DISCOUNT' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {reward.type === 'DISCOUNT'
                        ? t('catalog.discountPercent', { percent: reward.discountPercent })
                        : t('catalog.freeServiceType', { service: reward.freeService })}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-cream-100 mb-2">
                      {getLocalizedTitle(reward)}
                    </h3>
                    {getLocalizedDescription(reward) && (
                      <p className="text-cream-400 text-sm mb-4 line-clamp-2">
                        {getLocalizedDescription(reward)}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-gold-400" />
                        <span className="text-gold-400 font-bold">
                          {t('catalog.pointsCost', { cost: reward.pointCost })}
                        </span>
                      </div>
                      {reward.stock !== null && reward.stock !== undefined && (
                        <span className="text-cream-400 text-xs">
                          {reward.stock > 0 ? t('catalog.stockLeft', { count: reward.stock }) : t('catalog.outOfStock')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleRedeem(reward.id, reward.pointCost)}
                      disabled={!session?.user || !canAfford || outOfStock || redeeming === reward.id}
                      className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold transition-colors text-sm ${
                        canAfford && !outOfStock
                          ? 'bg-gold-500 hover:bg-gold-400 text-forest-900'
                          : 'bg-white/5 text-cream-400 cursor-not-allowed'
                      }`}
                    >
                      {redeeming === reward.id
                        ? '...'
                        : outOfStock
                          ? t('catalog.outOfStock')
                          : !session?.user
                            ? t('catalog.loginToRedeem')
                            : !canAfford
                              ? t('catalog.insufficientPoints')
                              : t('catalog.redeem')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
