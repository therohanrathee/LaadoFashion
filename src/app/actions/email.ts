'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(data: {
  orderId: string,
  email: string,
  name: string,
  totalAmount: number
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set')
    return { error: 'RESEND_API_KEY is not set' }
  }

  if (!data.email) {
    return { error: 'No email provided' }
  }

  try {
    const trackingLink = `https://laadoboutique.in/track?id=${data.orderId}`
    
    await resend.emails.send({
      from: 'Laado Boutique <orders@laadoboutique.in>',
      to: [data.email],
      subject: `Order Received! Tracking ID: ${data.orderId.split('-')[0]}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #E91E63;">Thank you for your order, ${data.name}!</h2>
          <p>We have successfully received your stitching request.</p>
          
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #555;">Estimated Total: <strong>₹${data.totalAmount}</strong></p>
            <p style="margin: 8px 0 0; color: #555;">Payment: <strong>50% cash/UPI due at pickup</strong></p>
          </div>

          <p>Our runner has been assigned and will contact you shortly to arrange your measurement and fabric pickup.</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${trackingLink}" style="background-color: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Track Your Order Live
            </a>
          </div>
          
          <p style="margin-top: 32px; font-size: 12px; color: #999; text-align: center;">
            Order ID: ${data.orderId}
          </p>
        </div>
      `
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return { error: 'Failed to send email' }
  }
}
