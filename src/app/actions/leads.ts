'use server'

import { createClient } from '@/lib/supabase/server'
import { notifyAdminsNewLead } from './notify'

export async function submitLead(formData: { name: string, phone: string, requirements: string, interested_in?: string }) {
  const supabase = await createClient()

  // --- SPAM & BOT BLOCKER VALIDATION ---
  const name = formData.name?.trim() || ''
  const phone = formData.phone?.trim().replace(/\D/g, '') || ''
  const reqs = formData.requirements?.trim() || ''

  // 1. Must be exactly 10 digits and start with valid Indian mobile prefix (6,7,8,9)
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { success: false, error: 'Invalid phone number format.' }
  }

  // 2. Block repeating digits (e.g. 5959598989, 2222222222)
  if (/(.)\1{6,}/.test(phone) || /^(.)\1+$/.test(phone)) {
    return { success: false, error: 'Invalid phone number.' }
  }
  if (phone === "5959598989" || phone === "1234567890") {
    return { success: false, error: 'Invalid phone number.' }
  }

  // 3. Name validation: block URLs, numbers, and gibberish
  if (name.length < 2 || name.length > 50) return { success: false, error: 'Invalid name length.' }
  if (/[0-9]{3,}/.test(name) || /http|www|.com/i.test(name)) {
    return { success: false, error: 'Invalid characters in name.' }
  }
  
  // 4. Requirements validation: block URLs
  if (/http:|https:|www\.|.com/i.test(reqs)) {
    return { success: false, error: 'Links are not allowed in requirements.' }
  }
  // --- END SPAM BLOCKER ---
  
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
  await notifyAdminsNewLead(formData.name).catch(console.error)

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
