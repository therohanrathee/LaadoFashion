'use server'

import { createClient } from '@/lib/supabase/server'
import { notifyAdminsNewLead } from './notify'

export async function submitLead(formData: { name: string, phone: string, requirements: string, interested_in?: string }) {
  const supabase = await createClient()
  
  // RLS allows anonymous inserts, but does NOT allow anonymous selects.
  // Therefore, we must omit .select() to prevent an RLS violation on the return payload.
  const { error } = await supabase.from('leads').insert([{
    name: formData.name,
    phone: formData.phone,
    requirements: formData.requirements,
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
