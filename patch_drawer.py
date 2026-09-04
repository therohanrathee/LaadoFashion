import re

with open('src/components/ui/EnquiryDrawer.tsx', 'r') as f:
    content = f.read()

# Increase timeout to 6000ms
content = content.replace('3000)', '8000)')

# Remove rate list link from bottom of form
link_code = """                  <div className="pt-6 border-t border-gray-100 dark:border-white/10 text-center">
                    <p className="text-sm text-gray-500 mb-3">Just looking for prices?</p>
                    <Link 
                      href="/rate-list" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="text-[#E91E63] font-semibold hover:underline"
                    >
                      View our Rate List →
                    </Link>
                  </div>"""

content = content.replace(link_code, "")

# Add it to the success screen
success_code_old = """                  <p className="text-gray-600 dark:text-gray-400">Our master tailor will contact you shortly to discuss your requirements.</p>
                </div>"""

success_code_new = """                  <p className="text-gray-600 dark:text-gray-400">Our master tailor will contact you shortly to discuss your requirements.</p>
                  
                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 w-full text-center">
                    <p className="text-sm text-gray-500 mb-3">While you wait, explore our pricing:</p>
                    <Link 
                      href="/rate-list" 
                      onClick={() => setIsDrawerOpen(false)}
                      className="text-[#E91E63] font-semibold hover:underline"
                    >
                      View our Rate List →
                    </Link>
                  </div>
                </div>"""

content = content.replace(success_code_old, success_code_new)

with open('src/components/ui/EnquiryDrawer.tsx', 'w') as f:
    f.write(content)

