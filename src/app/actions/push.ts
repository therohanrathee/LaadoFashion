'use server'

import { createClient } from '@/lib/supabase/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:contact@laadoboutique.in',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function savePushSubscription(subscription: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // Extract endpoints and keys
  const endpoint = subscription.endpoint
  const p256dh = subscription.keys?.p256dh
  const auth = subscription.keys?.auth

  if (!endpoint || !p256dh || !auth) {
    return { success: false, error: 'Invalid subscription object' }
  }

  // Create an admin client to bypass RLS for this internal operation
  const { createClient: createAdminClient } = await import('@supabase/supabase-js')
  const adminAuthClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check if it already exists
  const { data: existing } = await adminAuthClient
    .from('push_subscriptions')
    .select('id')
    .eq('endpoint', endpoint)
    .single()

  if (!existing) {
    await adminAuthClient.from('push_subscriptions').insert({
      user_id: user.id,
      endpoint,
      p256dh,
      auth
    })
  }

  return { success: true }
}

export async function sendPushNotification(userIds: string[], title: string, body: string, url: string = '/dashboard') {
  if (!userIds || userIds.length === 0) return { success: true }

  const { createClient: createAdminClient } = await import('@supabase/supabase-js')
  const adminAuthClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: subscriptions } = await adminAuthClient
    .from('push_subscriptions')
    .select('*')
    .in('user_id', userIds)

  if (!subscriptions || subscriptions.length === 0) return { success: true }

  const payload = JSON.stringify({ title, body, url })
  
  const promises = subscriptions.map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth
      }
    }
    
    try {
      await webpush.sendNotification(pushSubscription, payload)
    } catch (error: any) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await adminAuthClient.from('push_subscriptions').delete().eq('id', sub.id)
      }
    }
  })

  await Promise.all(promises)
  return { success: true }
}
