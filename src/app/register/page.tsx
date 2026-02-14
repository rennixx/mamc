'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { User, Mail, Lock, Phone, Gift, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { t } = useTranslation('auth')
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError(t('register.passwordTooShort'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'))
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone: phone || undefined, referralCode: referralCode || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError(data.error?.includes('Phone') ? t('register.phoneExists') : t('register.emailExists'))
        } else {
          setError(data.error || 'Registration failed')
        }
        setLoading(false)
        return
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed, redirect to login
        router.push('/login')
      } else {
        router.push('/profile')
      }
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cream-100 font-display">
              {t('register.title')}
            </h1>
            <p className="text-cream-300 mt-2">
              {t('register.subtitle')}
            </p>
          </div>

          {/* Bonus info */}
          <div className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-3 mb-6 text-center">
            <p className="text-gold-400 text-sm font-medium">
              🎉 {t('register.signupBonus')}
            </p>
            <p className="text-gold-400/70 text-xs mt-1">
              {t('register.referralBonus')}
            </p>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/profile' })}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-cream-100 font-medium rounded-xl transition-colors flex items-center justify-center gap-3 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('login.signInWithGoogle')}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-cream-100/10" />
            <span className="text-cream-400 text-sm">{t('login.or')}</span>
            <div className="flex-1 h-px bg-cream-100/10" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">
                {t('register.name')}
              </label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input w-full ps-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">
                {t('register.email')}
              </label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full ps-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                {t('register.password')}
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input w-full ps-10 pe-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-cream-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                {t('register.confirmPassword')}
              </label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input w-full ps-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label htmlFor="phone" className="form-label">
                {t('register.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input w-full ps-10"
                />
              </div>
            </div>

            {/* Referral Code (optional) */}
            <div>
              <label htmlFor="referralCode" className="form-label">
                {t('register.referralCode')}
              </label>
              <div className="relative">
                <Gift className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                <input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="form-input w-full ps-10"
                  placeholder="MAM-XXXXXX"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? t('register.loading') : t('register.submit')}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-cream-400 text-sm mt-6">
            {t('register.haveAccount')}{' '}
            <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium">
              {t('register.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
