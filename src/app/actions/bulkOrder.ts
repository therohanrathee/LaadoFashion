'use server'

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize Supabase admin client (server-side only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitBulkOrder(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const details = formData.get('details') as string
    const token = formData.get('cf-turnstile-response') as string

    if (!token) return { success: false, error: 'Please verify that you are human.' }
    
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token
      })
    })
    const verifyData = await verifyRes.json()
    if (!verifyData.success) {
      return { success: false, error: 'CAPTCHA verification failed.' }
    }

    if (!name || !phone || !details) {
      return { success: false, error: 'Name, Phone, and Details are required.' }
    }

    const contactInfo = `Phone: ${phone}${email ? ` | Email: ${email}` : ''}`

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('bulk_orders')
      .insert([
        {
          name,
          contact_info: contactInfo,
          details,
          status: 'pending'
        }
      ])

    if (dbError) {
      console.error('Supabase Error:', dbError)
      return { success: false, error: 'Failed to save order to database.' }
    }

    // 2. Send email notification via Resend
    try {
      const emailPayload: any = {
        from: 'Laado Boutique <orders@laadoboutique.in>',
        to: 'contact@laadoboutique.in',
        subject: `New Inquiry from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #C5A55A; padding-bottom: 10px;">New Bulk Order Inquiry</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong>Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong>Phone:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  ${phone} 
                  <a href="tel:${phone}" style="margin-left: 10px; background-color: #25D366; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold;">Call Now</a>
                </td>
              </tr>
              ${email ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}" style="color: #E91E63;">${email}</a></td>
              </tr>
              ` : ''}
            </table>
            
            <div style="margin-top: 25px; background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
              <h4 style="margin-top: 0; color: #555;">Message Details:</h4>
              <p style="white-space: pre-wrap; color: #333; line-height: 1.5;">${details}</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
              This inquiry has been saved to the Admin Portal database.
              ${email ? '<br/>You can reply directly to this email to contact the customer.' : '<br/>No email provided. Please call the customer.'}
            </p>
          </div>
        `
      }

      if (email) {
        emailPayload.reply_to = email
      }

      await resend.emails.send(emailPayload)
    } catch (emailError) {
      console.error('Resend Email Error:', emailError)
      // We don't fail the whole request if email fails, as it's saved in DB
    }

    return { success: true }
  } catch (err) {
    console.error('Action Error:', err)
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
