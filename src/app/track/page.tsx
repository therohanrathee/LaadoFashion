'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

function TrackContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get('id') || ''
  
  const [orderId, setOrderId] = useState(initialId)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId)
    }
  }, [initialId])

  const handleTrack = (id: string = orderId) => {
    if (!id) return
    
    setLoading(true)
    setError('')
    setStatus(null)

    // Mock network request to fetch order status
    setTimeout(() => {
      // Very basic validation - if it's a UUID, let's say it's pending measurement
      // In reality, this would hit `supabase.from('orders').select('status').eq('id', id)`
      if (id.length > 20) {
        setStatus('pending_measurement')
      } else {
        setError('Invalid Order ID. Please check the ID from your email.')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-md w-full bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
      <h1 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-2 text-center">Track Order</h1>
      <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center mb-8 text-sm">
        Enter the tracking ID from your confirmation email.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Order ID</label>
          <input
            type="text"
            placeholder="e.g. 123e4567-e89b-12d3..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] font-mono text-sm"
          />
        </div>
        
        <button
          onClick={() => handleTrack()}
          disabled={loading || !orderId}
          className="w-full bg-[#E91E63] text-white font-bold py-3 rounded-lg hover:bg-[#C2185B] transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-[#E91E63] rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {status && (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Current Status:</h3>
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E91E63] flex items-center justify-center text-white shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h4 className="font-bold text-[#E91E63] text-lg">
                {status === 'pending_measurement' ? 'Pending Measurement' : 
                 status === 'in_stitching' ? 'In Stitching' : 
                 status === 'ready_for_delivery' ? 'Ready for Delivery' : 
                 status === 'delivered' ? 'Delivered' : status}
              </h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm pl-11">
              {status === 'pending_measurement' ? 'Our runner will contact you soon to visit your home, collect fabric, and take measurements.' :
               'Your order is progressing smoothly.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-12 px-4">
        <Suspense fallback={<div className="p-8 text-center pt-32">Loading tracker...</div>}>
          <TrackContent />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}
