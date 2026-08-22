'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function submitOrder(data: {
  cartItems: { catalogItemId: string; quantity: number; addonIds: string[] }[],
  name: string,
  phone: string,
  email: string,
  address: string,
  latitude: number,
  longitude: number,
}) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (!data.cartItems || data.cartItems.length === 0) {
    return { error: 'Cart is empty' }
  }

  // 1. User Management (Shadow Account)
  let userId: string | undefined = undefined;
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const existingUser = users?.find(u => u.email === data.email)
  
  if (existingUser) {
    userId = existingUser.id
    await supabase.from('profiles').update({
      full_name: data.name,
      phone: data.phone
    }).eq('id', userId)
  } else {
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: { full_name: data.name }
    })
    if (createError) return { error: createError.message }
    userId = newUser.user.id
    
    await supabase.from('profiles').update({
      full_name: data.name,
      phone: data.phone
    }).eq('id', userId)
  }

  // 2. Server-side Pricing Validation & Construction
  const { CATALOG, ADDONS } = await import('@/app/order/catalogData')
  
  let calculatedTotal = 0
  const processedCart = []

  for (const cartItem of data.cartItems) {
    const catalogData = CATALOG.find(c => c.id === cartItem.catalogItemId)
    if (!catalogData) return { error: `Invalid item: ${cartItem.catalogItemId}` }

    const itemTotalBase = catalogData.basePrice * cartItem.quantity
    let addonsTotal = 0
    
    const processedAddons = cartItem.addonIds.map(addonId => {
      const addonData = ADDONS.find(a => a.id === addonId)
      if (addonData) {
        addonsTotal += addonData.price * cartItem.quantity // Swiggy style: per quantity
        return { id: addonData.id, name: addonData.name, price: addonData.price }
      }
      return null
    }).filter(Boolean)

    calculatedTotal += itemTotalBase + addonsTotal

    processedCart.push({
      catalogItemId: catalogData.id,
      name: catalogData.name,
      basePrice: catalogData.basePrice,
      quantity: cartItem.quantity,
      addons: processedAddons,
      itemTotal: itemTotalBase + addonsTotal
    })
  }

  // 3. Insert Order with JSONB cart_items
  const { data: order, error: orderError } = await supabase.from('orders').insert({
    customer_id: userId,
    cart_items: processedCart,
    address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    total_estimated_cost: calculatedTotal,
    status: 'pending_measurement'
  }).select().single()

  if (orderError) return { error: orderError.message }

  return { success: true, orderId: order.id }
}
