'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { kMeansClustering } from '@/lib/clustering'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Use Service Role for backend logic (overrides RLS for assignment)
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function reclusterOrders() {
  const supabase = getAdminClient()

  // 1. Get all active runners
  const { data: runners } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'runner')
    .eq('active', true)

  if (!runners || runners.length === 0) return { error: 'No active runners available' }

  // 2. Get all open orders that need a runner
  // pending_measurement, stitching_complete, returned
  const { data: orders } = await supabase
    .from('orders')
    .select('id, latitude, longitude, status')
    .in('status', ['pending_measurement', 'stitching_complete', 'returned'])

  if (!orders || orders.length === 0) return { success: true, message: 'No orders to assign' }

  const ordersToCluster = orders.map(o => ({
    id: o.id,
    lat: Number(o.latitude),
    lng: Number(o.longitude)
  }))

  // 3. Cluster
  const k = runners.length
  const clusters = kMeansClustering(ordersToCluster, k)

  // 4. Assign clusters to runners
  for (let i = 0; i < k; i++) {
    const runnerId = runners[i].id
    const cluster = clusters[i]

    if (cluster && cluster.length > 0) {
      const orderIds = cluster.map(c => c.id)
      
      // Update orders in DB
      await supabase
        .from('orders')
        .update({ runner_id: runnerId })
        .in('id', orderIds)
    }
  }
  
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/admin')

  return { success: true }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient() // Uses current authenticated user (runner)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Unauthorized' }
  
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    
  if (error) return { error: error.message }
  
  // Log task
  await supabase.from('task_logs').insert({
    employee_id: user.id,
    order_id: orderId,
    action: `updated_status_to_${newStatus}`
  })
  
  revalidatePath('/dashboard')
  return { success: true }
}
