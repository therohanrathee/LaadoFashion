'use server'

import { createClient } from '@/lib/supabase/server'
import { notifyAdminsNewLead } from './notify'

export async function submitLead(formData: { name: string, phone: string, requirements: string, token: string, interested_in?: string }) {
  const supabase = await createClient()

  if (!formData.token) return { success: false, error: 'Please verify that you are human.' }
  
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: formData.token
    })
  })
  const verifyData = await verifyRes.json()
  if (!verifyData.success) {
    return { success: false, error: 'CAPTCHA verification failed.' }
  }

  const name = formData.name?.trim() || ''
  const phone = formData.phone?.trim() || ''
  const reqs = formData.requirements?.trim() || ''
  
  // RLS allows anonymous inserts, but does NOT allow anonymous selects.
  // Therefore, we must omit .select() to prevent an RLS violation on the return payload.
  const { error } = await supabase.from('leads').insert([{
    name: name,
    phone: phone,
    requirements: reqs,
    interested_in: formData.interested_in || null
  }])

  if (error) {
    console.error("Lead submission error:", error)
    return { success: false, error: error.message }
  }

  // Await the notification to ensure Vercel serverless functions don't kill the process before it sends
  await notifyAdminsNewLead(name).catch(console.error)

  return { success: true }
}

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('leads').update({ status }).eq('id', leadId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}
