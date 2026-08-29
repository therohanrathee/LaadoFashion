'use server'

import { createClient } from '@/lib/supabase/server'
import { sendPushNotification } from './push'

export async function notifyAdminsNewOrder(orderId: string) {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: admins } = await supabaseAdmin.from('profiles').select('id').eq('role', 'admin')
  
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

export async function notifyAdminsNewLead(customerName: string) {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: admins } = await supabaseAdmin.from('profiles').select('id').eq('role', 'admin')
  
  if (admins && admins.length > 0) {
    const adminIds = admins.map(a => a.id)
    await sendPushNotification(
      adminIds, 
      'New Enquiry Received! 📝', 
      `You just got a new lead from ${customerName}.`,
      '/dashboard'
    )
  }
}
