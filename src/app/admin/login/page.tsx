'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock } from 'lucide-react'

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get CSRF token first
      const csrfRes = await fetch('/api/admin-auth/csrf')
      const { csrfToken } = await csrfRes.json()

      // Call admin auth callback directly
      const res = await fetch('/api/admin-auth/callback/admin-credentials', {
        method: 'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          redirect: 'false',
          callbackUrl,
        }),
      })

      const data = await res.json()

      if (data.error || !res.ok) {
        setError('Invalid email or password')
        setLoading(false)
      } else {
        // Login successful - redirect to admin dashboard
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-forest-900 to-forest-950">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-cream-100 font-display">
              Admin Portal
            </h1>
            <p className="text-cream-300 mt-2">
              Sign in to access the admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="form-label">
                Email
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
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
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
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Back to site link */}
          <p className="text-center text-cream-400 text-sm mt-6">
            <Link href="/" className="text-gold-400 hover:text-gold-300 font-medium">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-cream-300">Loading...</div></div>}>
      <AdminLoginForm />
    </Suspense>
  )
}
