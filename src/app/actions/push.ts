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
  const p256dh = subscription.keys.p256dh
  const auth = subscription.keys.auth

  // Check if it already exists
  const { data: existing } = await supabase
    .from('push_subscriptions')
    .select('id')
    .eq('endpoint', endpoint)
    .single()

  if (!existing) {
    await supabase.from('push_subscriptions').insert({
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

  const supabase = await createClient()
  const { data: subscriptions } = await supabase
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
      // If subscription is invalid/expired, remove it
      if (error.statusCode === 404 || error.statusCode === 410) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id)
      }
    }
  })

  await Promise.all(promises)
  return { success: true }
}
