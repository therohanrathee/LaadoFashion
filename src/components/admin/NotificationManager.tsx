'use client'

import { useEffect, useState } from 'react'
import { savePushSubscription } from '@/app/actions/push'

// Utility to convert Base64 string to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function NotificationManager({ userId, userRole }: { userId: string, userRole: string }) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!('Notification' in window)) return

    setPermission(Notification.permission)
    if (Notification.permission === 'default') {
      setShowBanner(true)
    }

    if (Notification.permission === 'granted') {
      subscribeUserToPush()
    }
  }, [userId])

  const subscribeUserToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    try {
      // 1. Register the Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      // 2. Wait until SW is active (or check existing)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
      })
      
      // 3. Send subscription to server
      await savePushSubscription(JSON.parse(JSON.stringify(subscription)))
    } catch (error) {
      console.error('Error subscribing to push notifications', error)
    }
  }

  const requestPermission = async () => {
    if (!('Notification' in window)) return
    
    const result = await Notification.requestPermission()
    setPermission(result)
    
    if (result === 'granted') {
      setShowBanner(false)
      await subscribeUserToPush()
      
      // Test Notification via Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Laado Fashion', {
            body: 'Background push notifications are now active!',
            icon: '/icon.png'
          })
        })
      }
    } else {
      setShowBanner(false)
    }
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
