'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEnquiry } from '@/context/EnquiryContext'
import Link from 'next/link'
import { submitLead } from '@/app/actions/leads'
import Image from 'next/image'
import { Turnstile } from '@marsidev/react-turnstile'

export default function EnquiryDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, interestedItem, setInterestedItem } = useEnquiry()
  
  const [formData, setFormData] = useState({ name: '', phone: '', requirements: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { alert('Please verify you are human'); return; }
    setIsSubmitting(true)
    
    const res = await submitLead({
      ...formData,
      interested_in: interestedItem ? interestedItem.name : undefined
    })

    setIsSubmitting(false)
    if (res.success) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsDrawerOpen(false)
        setIsSuccess(false)
        setFormData({ name: '', phone: '', requirements: '' })
        setInterestedItem(null)
        setToken(null)
      }, 8000)
    } else {
      alert("Failed to submit enquiry. Please try again or contact us directly.")
    }
  }

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-[#0a0a0a] shadow-2xl z-50 flex flex-col overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Request an Enquiry</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <div className="p-6 flex-grow">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-green-600">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Enquiry Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Our master tailor will contact you shortly to discuss your requirements.</p>
                  
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
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fill out this simple form and we will reach out to you with pricing, fabric options, and styling advice.
                  </p>

                  {interestedItem && (
                    <div className="flex gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10 items-center">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white dark:bg-black">
                        <Image src={interestedItem.image} alt={interestedItem.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Interested In</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{interestedItem.name}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setInterestedItem(null)
        setToken(null)}
                        className="ml-auto text-gray-400 hover:text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name *</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number *</label>
                      <input 
                        required 
                        type="tel" 
                        pattern="[0-9]{10}"
                        minLength={10}
                        maxLength={10}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none"
                        placeholder="10-digit mobile number"
                        title="Please enter a valid 10-digit mobile number"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Requirements / Remarks (Optional)</label>
                      <textarea 
                        rows={3}
                        value={formData.requirements}
                        onChange={e => setFormData({...formData, requirements: e.target.value})}
                        className="w-full px-4 py-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none resize-none"
                        placeholder="e.g., Need a 2-piece suit for a wedding next month..."
                      />
                    </div>

                    <div className="mb-4 flex justify-center">
                      <Turnstile
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                        onSuccess={(t) => setToken(t)}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#C2185B] transition-colors shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"/>
                      ) : (
                        'Submit Enquiry'
                      )}
                    </button>
                  </form>
                  

                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
