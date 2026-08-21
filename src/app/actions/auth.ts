'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// We need a service role client to check if a user exists and fetch their profile safely
// without them being logged in.
function getServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function checkEmailFlow(email: string) {
  const supabase = getServiceRoleClient()
  
  // Use admin api to find user by email
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    return { error: 'Failed to check user' }
  }
  
  const user = users.find(u => u.email === email)
  
  if (!user) {
    // New user -> Send OTP (defaults to customer via trigger)
    const client = await createClient()
    const { error: otpError } = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    })
    
    if (otpError) return { error: otpError.message }
    return { action: 'OTP_SENT_CUSTOMER' }
  }
  
  // User exists, check their role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  if (profile?.role === 'customer') {
    // Send OTP
    const client = await createClient()
    const { error: otpError } = await client.auth.signInWithOtp({
      email,
    })
    
    if (otpError) return { error: otpError.message }
    return { action: 'OTP_SENT_CUSTOMER' }
  } else {
    // Admin, Runner, Tailor use password
    return { action: 'REQUEST_PASSWORD' }
  }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })
  
  if (error) return { error: error.message }
  
  return { success: true }
}

export async function loginWithPassword(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) return { error: error.message }
  
  return { success: true }
}

export async function setPassword(password: string) {
  const supabase = await createClient()
  
  // Update auth password
  const { error } = await supabase.auth.updateUser({
    password: password
  })
  
  if (error) return { error: error.message }
  
  // Get current user id
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Mark profile as has_password = true
    await supabase.from('profiles').update({ has_password: true }).eq('id', user.id)
  }
  
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
