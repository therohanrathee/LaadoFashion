'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import { createClient } from '@/lib/supabase/client'

const trackingSteps = [
  { id: 'pending_measurement', title: 'Pending Measurement', description: 'Runner will visit for measurements.' },
  { id: 'fabric_received', title: 'Fabric Received', description: 'Fabric is at our boutique.' },
  { id: 'in_stitching', title: 'Stitching', description: 'Master tailors are crafting your order.' },
  { id: 'out_for_delivery', title: 'Out for Delivery', description: 'Runner is bringing it to your door.' }
]

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

  const handleTrack = async (id: string = orderId) => {
    if (!id.trim()) return
    
    setLoading(true)
    setError('')
    setStatus(null)

    const supabase = createClient()
    const { data, error } = await supabase.from('orders').select('status').eq('id', id).single()

    if (error || !data) {
      setError('Invalid Order ID. Please check the ID from your email.')
    } else {
      setStatus(data.status)
    }
    setLoading(false)
  }

  let currentStepIndex = 0;
  if (status === 'measurement_in_progress') currentStepIndex = 0;
  if (status === 'fabric_received') currentStepIndex = 1;
  if (status === 'in_stitching' || status === 'stitching_complete') currentStepIndex = 2;
  if (status === 'out_for_delivery') currentStepIndex = 3;
  if (status === 'delivered') currentStepIndex = 4;

  return (
    <div className="max-w-xl w-full bg-white dark:bg-[#141414] p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 mx-auto">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-2 text-center">Track Order</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8 text-sm">
        Enter the tracking ID from your confirmation email.
      </p>
      
      <div className="space-y-4 mb-8">
        <div>
          <input
            type="text"
            placeholder="e.g. 123e4567-e89b-12d3..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-200 dark:border-white/10 dark:bg-black/20 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] font-mono text-sm"
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
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-[#E91E63] dark:text-red-400 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {status === 'returned' && (
        <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl">
          <h3 className="font-bold text-red-600 dark:text-red-400 text-lg mb-2">Order Returned</h3>
          <p className="text-red-500 dark:text-red-300 text-sm">
            This order has been marked as returned. Please contact support for more details.
          </p>
        </div>
      )}

      {status && status !== 'returned' && (
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-6">Delivery Progress</h3>
          
          <div className="pl-2">
            {trackingSteps.map((step, idx) => {
              const isCompleted = currentStepIndex > idx || status === 'delivered';
              const isActive = currentStepIndex === idx && status !== 'delivered';
              const isLast = idx === trackingSteps.length - 1;

              return (
                <div key={step.id} className="flex gap-5 relative">
                  {/* Vertical Line */}
                  {!isLast && (
                    <div className={`absolute left-[11px] top-6 bottom-[-10px] w-[2px] ${isCompleted ? 'bg-[#E91E63]' : 'bg-gray-200 dark:bg-gray-800'}`} />
                  )}
                  
                  {/* Dot */}
                  <div className="relative z-10 w-6 h-6 shrink-0 flex items-center justify-center bg-white dark:bg-[#141414]">
                    {isCompleted ? (
                      <div className="w-6 h-6 rounded-full bg-[#E91E63] flex items-center justify-center text-white shadow-sm ring-4 ring-white dark:ring-[#141414]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    ) : isActive ? (
                      <div className="w-6 h-6 rounded-full border-2 border-[#E91E63] bg-white dark:bg-[#141414] flex items-center justify-center ring-4 ring-white dark:ring-[#141414]">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E91E63]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141414] ring-4 ring-white dark:ring-[#141414]" />
                    )}
                  </div>

                  {/* Text */}
                  <div className={`pb-8 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                    <h4 className={`font-bold ${isActive ? 'text-[#E91E63]' : 'text-gray-900 dark:text-white'}`}>{step.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
                    
                    {/* Delivered State Subtext */}
                    {isLast && isCompleted && (
                      <p className="text-xs font-bold text-green-600 dark:text-green-500 mt-2 bg-green-50 dark:bg-green-900/20 inline-block px-2 py-1 rounded">
                        ✓ Package Delivered Successfully
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
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
      
      <main className="flex-grow flex items-center justify-center pt-24 lg:pt-32 pb-12 px-4">
        <Suspense fallback={<div className="p-8 text-center pt-32 text-white">Loading tracker...</div>}>
          <TrackContent />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
}
