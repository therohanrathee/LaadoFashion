'use client'

import { useState } from 'react'
import { loginWithPassword } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await loginWithPassword(email, password)
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-serif font-bold text-[#E91E63]">Laado Boutique</span>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Employee Portal</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Sign in to access your dashboard.</p>
          </div>
          
          {error && <div className="bg-red-50 text-[#E91E63] p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

          <form onSubmit={handlePasswordLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                required
                className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                required
                className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#E91E63] text-white font-semibold rounded-lg py-3 hover:bg-[#C2185B] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-white/5 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Are you a customer?{' '}
              <Link href="/track" className="text-[#E91E63] font-medium hover:underline">
                Track your order here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
