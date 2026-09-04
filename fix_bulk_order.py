import re

with open('src/app/bulk-order/page.tsx', 'r') as f:
    content = f.read()

# Reduce margin bottom on heading/paragraph
content = content.replace('mb-12', 'mb-6 md:mb-12')
content = content.replace('mb-6', 'mb-3 md:mb-6')

# Change the wrapper of the contact info to be a compact grid on mobile
content = content.replace(
    '<div className="space-y-8">',
    '<div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-8">'
)

# Make phone items side-by-side or more compact
# Remove the large icon backgrounds and simplify
phone_block_old = """              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-[#C5A55A]/10 p-3 rounded-full text-[#C5A55A]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Phone Numbers</h3>
                  <a href="tel:+917011917290" className="block text-gray-600 dark:text-gray-300 hover:text-[#E91E63]">+91 7011917290</a>
                  <a href="tel:+919716299990" className="block text-gray-600 dark:text-gray-300 hover:text-[#E91E63]">+91 9716299990</a>
                </div>
              </div>"""

phone_block_new = """              {/* Phone */}
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                <div className="hidden md:flex bg-[#C5A55A]/10 p-3 rounded-full text-[#C5A55A]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-0.5 md:mb-1">Phone</h3>
                  <a href="tel:+917011917290" className="block text-xs md:text-base text-gray-600 dark:text-gray-300 hover:text-[#E91E63]">+91 7011917290</a>
                  <a href="tel:+919716299990" className="block text-xs md:text-base text-gray-600 dark:text-gray-300 hover:text-[#E91E63]">+91 9716299990</a>
                </div>
              </div>"""

email_block_old = """              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-[#E91E63]/10 p-3 rounded-full text-[#E91E63]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Email</h3>
                  <a href="mailto:contact@laadoboutique.in" className="text-gray-600 dark:text-gray-300 hover:text-[#E91E63]">contact@laadoboutique.in</a>
                </div>
              </div>"""

email_block_new = """              {/* Email */}
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4">
                <div className="hidden md:flex bg-[#E91E63]/10 p-3 rounded-full text-[#E91E63]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-0.5 md:mb-1">Email</h3>
                  <a href="mailto:contact@laadoboutique.in" className="block text-xs md:text-base text-gray-600 dark:text-gray-300 hover:text-[#E91E63] break-all">contact@laadoboutique.in</a>
                </div>
              </div>"""

address_block_old = """              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-[#1a1a1a]/5 p-3 rounded-full text-gray-700 dark:text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Laado Boutique, Ashok Vihar, Gurugram, India</p>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#C5A55A] hover:text-[#E91E63]">
                    Get Directions &rarr;
                  </a>
                </div>
              </div>"""

address_block_new = """              {/* Address */}
              <div className="flex flex-col gap-1 md:flex-row md:items-start md:gap-4 col-span-2 md:col-span-1">
                <div className="hidden md:flex bg-[#1a1a1a]/5 p-3 rounded-full text-gray-700 dark:text-gray-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white mb-0.5 md:mb-1">Visit Us</h3>
                  <p className="text-xs md:text-base text-gray-600 dark:text-gray-300 mb-1 md:mb-2">Laado Boutique, Ashok Vihar, Gurugram, India</p>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm font-semibold text-[#C5A55A] hover:text-[#E91E63]">
                    Get Directions &rarr;
                  </a>
                </div>
              </div>"""

content = content.replace(phone_block_old, phone_block_new)
content = content.replace(email_block_old, email_block_new)
content = content.replace(address_block_old, address_block_new)

with open('src/app/bulk-order/page.tsx', 'w') as f:
    f.write(content)

