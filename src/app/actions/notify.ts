'use server'

import { createClient } from '@/lib/supabase/server'
import { sendPushNotification } from './push'

export async function notifyAdminsNewOrder(orderId: string) {
  const supabase = await createClient()
  const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin')
  
  if (admins && admins.length > 0) {
    const adminIds = admins.map(a => a.id)
    await sendPushNotification(
      adminIds, 
      'New Order Received! 🎉', 
      `Order #${orderId.split('-')[0]} has just been placed.`,
      '/dashboard'
    )
  }
}

export async function notifyRunnerAssignment(runnerId: string) {
  await sendPushNotification(
    [runnerId],
    'New Order Assigned 📍',
    'You have a new order in your queue. Please check your tasks.',
    '/dashboard'
  )
}
