'use server'

import { createClient } from '@/lib/supabase/server'
import { notifyAdminsNewLead } from './notify'

export async function submitLead(formData: { name: string, phone: string, requirements: string, interested_in?: string }) {
  const supabase = await createClient()
  
  // Create an admin client to bypass RLS for inserts if needed, 
  // but public insert is enabled via RLS anyway.
  const { error, data } = await supabase.from('leads').insert([{
    name: formData.name,
    phone: formData.phone,
    requirements: formData.requirements,
    interested_in: formData.interested_in || null
  }]).select()

  if (error) {
    console.error("Lead submission error:", error)
    return { success: false, error: error.message }
  }

  // Notify admins in the background
  if (data && data.length > 0) {
    notifyAdminsNewLead(formData.name).catch(console.error)
  }

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
