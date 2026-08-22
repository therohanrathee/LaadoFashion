'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Book Your Order',
    description: 'Select your garment and custom add-ons through our easy booking portal. Share your location and details to initiate the process effortlessly.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="6" width="32" height="36" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 18H32M16 26H28M16 34H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="8" fill="#C5A55A" fillOpacity="0.15" stroke="#C5A55A" strokeWidth="2"/>
        <path d="M34 36L36 38L39 34" stroke="#C5A55A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Measurement & Pickup',
    description: 'Our assigned runner visits your home at a convenient time. They take your precise measurements and collect your unstitched cloth.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 4C14 4 6 12 6 22C6 34 24 44 24 44C24 44 42 34 42 22C42 12 34 4 24 4Z" stroke="currentColor" strokeWidth="2"/>
        <circle cx="24" cy="22" r="6" stroke="#C5A55A" strokeWidth="2"/>
        <circle cx="24" cy="22" r="2" fill="#C5A55A"/>
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Boutique Tailoring',
    description: 'We bring your fabric back to our boutique where our master tailors meticulously stitch your garment to your exact specifications.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M12 8L24 20M24 20L36 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M24 20V40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="3" stroke="#C5A55A" strokeWidth="2"/>
        <path d="M14 32C14 32 18 28 24 28C30 28 34 32 34 32" stroke="#C5A55A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Delivered in 7 Days',
    description: 'Your perfectly stitched garment is securely packed and delivered right to your doorstep within 7 days, ready for you to wear.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect x="4" y="14" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M32 20H38L44 28V34H32V20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="14" cy="38" r="4" stroke="#C5A55A" strokeWidth="2"/>
        <circle cx="38" cy="38" r="4" stroke="#C5A55A" strokeWidth="2"/>
      </svg>
    ),
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="relative py-28 md:py-36 px-6 bg-white thread-texture">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">The Process</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-6">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            From selection to doorstep delivery — your custom garment in four seamless steps.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative"
            >
              <div className="relative bg-[#FAF8F5] rounded-2xl p-8 border border-gray-100 hover:border-[#C5A55A]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#C5A55A]/10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  {/* Icon */}
                  <div className="text-[#E91E63]">
                    {step.icon}
                  </div>
                  
                  {/* Step number */}
                  <div className="text-5xl font-serif font-bold text-[#C5A55A]/40 group-hover:text-[#C5A55A]/80 transition-colors select-none">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm flex-grow">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
