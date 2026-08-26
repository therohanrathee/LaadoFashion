'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Order Overrides
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function assignOrderStaff(orderId: string, staffId: string, type: 'runner' | 'tailor') {
  const supabase = await createClient()
  const column = type === 'runner' ? 'runner_id' : 'tailor_id'
  const { error } = await supabase.from('orders').update({ [column]: staffId || null }).eq('id', orderId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

// Catalog Management
export async function updateCatalogItem(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('catalog_items').update(data).eq('id', id)
  if (error) return { error: error.message }
  
  // Revalidate frontend pages so updates are live instantly
  revalidatePath('/')
  revalidatePath('/mens')
  revalidatePath('/womens')
  revalidatePath('/cart')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function createCatalogItem(data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('catalog_items').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/mens')
  revalidatePath('/womens')
  revalidatePath('/dashboard')
  return { success: true }
}

// Promo Code Management
export async function updatePromoCode(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('promo_codes').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function createPromoCode(data: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('promo_codes').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

// Check Promo Validity during checkout
export async function validatePromoCode(code: string, customerId: string, cartTotal: number) {
  const supabase = await createClient()
  
  // 1. Fetch promo code
  const { data: promo, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()
    
  if (error || !promo) {
    return { error: 'Invalid or inactive promo code.' }
  }
  
  // 2. Check Expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return { error: 'This promo code has expired.' }
  }
  
  // 3. Check Minimum Order Amount
  if (promo.min_order_amount && cartTotal < promo.min_order_amount) {
    return { error: `This code requires a minimum order of ₹${promo.min_order_amount}.` }
  }
  
  // 4. Check Global Usage Limit
  if (promo.usage_limit) {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('promo_code_id', promo.id)
      
    if (count !== null && count >= promo.usage_limit) {
      return { error: 'This promo code has reached its usage limit.' }
    }
  }
  
  // 5. Check One-Time-Per-User Limit
  if (promo.one_time_per_user && customerId) {
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('promo_code_id', promo.id)
      .eq('customer_id', customerId)
      
    if (count !== null && count > 0) {
      return { error: 'You have already used this promo code.' }
    }
  }
  
  return { success: true, promo }
}
