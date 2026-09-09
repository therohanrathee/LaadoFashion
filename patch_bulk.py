with open('src/app/bulk-order/page.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { Turnstile }" not in content:
    content = content.replace(
        "import Navbar from '@/components/home/Navbar'",
        "import Navbar from '@/components/home/Navbar'\nimport { Turnstile } from '@marsidev/react-turnstile'"
    )

# Add token state
if "const [token, setToken] = useState<string | null>(null)" not in content:
    content = content.replace(
        "const [isSubmitting, setIsSubmitting] = useState(false)",
        "const [isSubmitting, setIsSubmitting] = useState(false)\n  const [token, setToken] = useState<string | null>(null)"
    )

# Add token requirement to handleSubmit
if "if (!token)" not in content:
    content = content.replace(
        "setIsSubmitting(true)",
        "if (!token) { alert('Please verify you are human'); return; }\n    setIsSubmitting(true)"
    )

# Add token to submitLead payload
if "token," not in content and "token:" not in content:
    content = content.replace(
        "...formData,",
        "...formData,\n        token,"
    )

# Reset token on success
if "setToken(null)" not in content:
    content = content.replace(
        "setStatus('success')",
        "setStatus('success')\n      setToken(null)"
    )

# Add Turnstile widget before the submit button
turnstile_widget = """
                <div className="mb-4 flex justify-center">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(t) => setToken(t)}
                  />
                </div>
"""
if "Turnstile" not in content.split("className=\"w-full bg-[#1a1a1a]")[0]:
    content = content.replace(
        "<button \n                  type=\"submit\"",
        turnstile_widget + "\n                <button \n                  type=\"submit\""
    )

with open('src/app/bulk-order/page.tsx', 'w') as f:
    f.write(content)

