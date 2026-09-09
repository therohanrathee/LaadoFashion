import re

with open('src/app/actions/leads.ts', 'r') as f:
    content = f.read()

verify_code = """
  if (!formData.token) return { success: false, error: 'Please verify that you are human.' }
  
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: formData.token
    })
  })
  const verifyData = await verifyRes.json()
  if (!verifyData.success) {
    return { success: false, error: 'CAPTCHA verification failed.' }
  }
"""

if "formData.token" not in content:
    content = content.replace(
        "export async function submitLead(formData: { name: string, phone: string, requirements: string, interested_in?: string",
        "export async function submitLead(formData: { name: string, phone: string, requirements: string, token: string, interested_in?: string"
    )
    content = content.replace(
        "const supabase = await createClient()",
        "const supabase = await createClient()\n" + verify_code
    )

with open('src/app/actions/leads.ts', 'w') as f:
    f.write(content)

