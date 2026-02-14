'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { Mail, Lock, Phone, KeyRound } from 'lucide-react'

type LoginMode = 'email' | 'phone'

function LoginForm() {
  const { t } = useTranslation('auth')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/profile'

  const [mode, setMode] = useState<LoginMode>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError(t('login.invalidCredentials'))
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  const handleSendOtp = async () => {
    if (!phone) return
    setSendingOtp(true)
    setError('')

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      if (res.ok) {
        setOtpSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send OTP')
      }
    } catch {
      setError('Failed to send OTP')
    }
    setSendingOtp(false)
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // First verify OTP
    const verifyRes = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code: otp }),
    })

    if (!verifyRes.ok) {
      setError(t('login.invalidOtp'))
      setLoading(false)
      return
    }

    // Then sign in
    const result = await signIn('credentials', {
      phone,
      otp,
      redirect: false,
    })

    if (result?.error) {
      setError(t('login.invalidOtp'))
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cream-100 font-display">
              Mam Center
            </h1>
            <p className="text-cream-300 mt-2">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={() => signIn('google', { callbackUrl })}
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

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => { setMode('email'); setError('') }}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                mode === 'email'
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-white/5 text-cream-400 hover:bg-white/10'
              }`}
            >
              <Mail className="w-4 h-4" />
              {t('login.signInWithEmail')}
            </button>
            <button
              type="button"
              onClick={() => { setMode('phone'); setError('') }}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                mode === 'phone'
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-white/5 text-cream-400 hover:bg-white/10'
              }`}
            >
              <Phone className="w-4 h-4" />
              {t('login.signInWithPhone')}
            </button>
          </div>

          {/* Email Form */}
          {mode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="form-label">
                  {t('login.email')}
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

              <div>
                <label htmlFor="password" className="form-label">
                  {t('login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input w-full ps-10"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? t('login.loading') : t('login.signIn')}
              </button>
            </form>
          )}

          {/* Phone Form */}
          {mode === 'phone' && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="phone" className="form-label">
                  {t('login.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input w-full ps-10"
                    required
                    disabled={otpSent}
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp || !phone}
                  className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {sendingOtp ? '...' : t('login.sendOtp')}
                </button>
              ) : (
                <>
                  <div className="bg-green-500/10 text-green-400 p-3 rounded-xl text-sm text-center">
                    {t('login.otpSent')}
                  </div>
                  <div>
                    <label htmlFor="otp" className="form-label">
                      {t('login.otp')}
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-400" />
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="form-input w-full ps-10 tracking-widest text-center text-lg"
                        maxLength={6}
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? t('login.loading') : t('login.signIn')}
                  </button>
                </>
              )}
            </form>
          )}

          {/* Register link */}
          <p className="text-center text-cream-400 text-sm mt-6">
            {t('login.noAccount')}{' '}
            <Link href="/register" className="text-gold-400 hover:text-gold-300 font-medium">
              {t('login.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-cream-300">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
