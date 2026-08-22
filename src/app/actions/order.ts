'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

  // 4. Send Order Confirmation Email via Resend
  try {
    const trackingLink = `https://laadoboutique.in/track?id=${order.id}`
    await resend.emails.send({
      from: 'Laado Boutique <orders@laadoboutique.in>',
      to: [data.email],
      subject: `Order Received! Tracking ID: ${order.id.split('-')[0]}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #E91E63;">Thank you for your order, ${data.name}!</h2>
          <p>We have successfully received your stitching request.</p>
          
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #555;">Estimated Total: <strong>₹${calculatedTotal}</strong></p>
            <p style="margin: 8px 0 0; color: #555;">Payment: <strong>50% cash/UPI due at pickup</strong></p>
          </div>

          <p>Our runner has been assigned and will contact you shortly to arrange your measurement and fabric pickup.</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${trackingLink}" style="background-color: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Track Your Order Live
            </a>
          </div>
          
          <p style="margin-top: 32px; font-size: 12px; color: #999; text-align: center;">
            Order ID: ${order.id}
          </p>
        </div>
      `
    })
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError)
    // We don't fail the order if the email fails, just log it.
  }

  return { success: true, orderId: order.id }
}
