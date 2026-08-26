'use client'

import { useState } from 'react'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import { submitBulkOrder } from '@/app/actions/bulkOrder'

export default function BulkOrderPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const result = await submitBulkOrder(formData)

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Information Side */}
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-6">
              Bulk Orders & Contact
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-12">
              Whether you're looking for wedding trousseaus or large boutique orders, our team is ready to deliver premium quality at scale.
            </p>

            <div className="space-y-8">
              {/* Phone */}
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
              </div>

              {/* Email */}
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
              </div>

              {/* Address */}
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
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6">Send an Inquiry</h2>
            
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 text-green-500">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3 className="font-bold text-lg mb-2">Inquiry Submitted</h3>
                <p className="text-green-700">
                  Your information has been received and you will be contacted within 1 business day.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === 'error' && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
                    {errorMessage}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/50 focus:border-[#C5A55A] transition-all"
                    placeholder="Your Full Name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/50 focus:border-[#C5A55A] transition-all"
                    placeholder="Your Phone Number"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/50 focus:border-[#C5A55A] transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="details" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Brief Details</label>
                  <textarea 
                    id="details" 
                    name="details" 
                    required
                    disabled={status === 'loading'}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A55A]/50 focus:border-[#C5A55A] transition-all resize-none"
                    placeholder="Tell us about your bulk order requirements..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#1a1a1a] text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-black/10"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Inquiry'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
