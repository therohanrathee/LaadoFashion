'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NotificationManager({ userId, userRole }: { userId: string, userRole: string }) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showBanner, setShowBanner] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!('Notification' in window)) return

    setPermission(Notification.permission)
    if (Notification.permission === 'default') {
      setShowBanner(true)
    }

    if (Notification.permission === 'granted') {
      setupRealtimeSubscriptions()
    }

    return () => {
      supabase.removeAllChannels()
    }
  }, [userId, userRole])

  const requestPermission = async () => {
    if (!('Notification' in window)) return
    
    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === 'granted') {
      setShowBanner(false)
      new Notification('Laado Fashion', {
        body: 'Notifications are now enabled!',
        icon: '/icon.png'
      })
      setupRealtimeSubscriptions()
    } else {
      setShowBanner(false)
    }
  }

  const setupRealtimeSubscriptions = () => {
    const channel = supabase.channel('dashboard-notifications')

    if (userRole === 'admin') {
      // Listen for NEW normal orders
      channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        new Notification('New Order Received!', {
          body: `Order #${payload.new.id.split('-')[0]} has been placed.`,
          icon: '/icon.png'
        })
      })

      // Listen for NEW bulk orders
      channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bulk_orders' }, (payload) => {
        new Notification('New Bulk Order Request!', {
          body: `A new bulk order request has been submitted.`,
          icon: '/icon.png'
        })
      })
    }

    if (userRole === 'runner') {
      // Listen for ASSIGNMENTS
      channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const oldRecord = payload.old
        const newRecord = payload.new
        
        // If it was just assigned to THIS runner
        if (newRecord.runner_id === userId && oldRecord.runner_id !== userId) {
          new Notification('New Assignment!', {
            body: `You have been assigned a new order in your queue.`,
            icon: '/icon.png'
          })
        }
      })
    }

    channel.subscribe()
  }

  if (!showBanner) return null

  return (
    <div className="bg-blue-600 text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md z-50 sticky top-0">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <p className="text-sm font-medium">Enable notifications to receive live updates for new orders and assignments.</p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button onClick={requestPermission} className="flex-1 sm:flex-none bg-white text-blue-600 px-4 py-1.5 rounded text-sm font-bold shadow hover:bg-gray-100">
          Enable
        </button>
        <button onClick={() => setShowBanner(false)} className="flex-1 sm:flex-none bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-800 border border-blue-500">
          Dismiss
        </button>
      </div>
    </div>
  )
}
