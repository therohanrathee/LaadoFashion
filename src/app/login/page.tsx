'use client'

import { useState } from 'react'
import { checkEmailFlow, verifyOtp, loginWithPassword, setPassword } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'password_login' | 'set_password'>('email')
  
  const [otp, setOtp] = useState('')
  const [password, setPasswordInput] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await checkEmailFlow(email)
    
    if (res.error) {
      setError(res.error)
    } else if (res.action === 'OTP_SENT_CUSTOMER') {
      setMessage('OTP sent to your email!')
      setStep('otp')
    } else if (res.action === 'REQUEST_PASSWORD') {
      setStep('password_login')
    }
    
    setLoading(false)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await verifyOtp(email, otp)
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const res = await setPassword(password)
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Laado Fashion & Boutique</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{message}</div>}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white rounded py-2 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP sent to {email}</label>
              <input
                type="text"
                required
                className="w-full border rounded px-3 py-2"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white rounded py-2 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 'password_login' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white rounded py-2 hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

      </div>
    </div>
  )
}
