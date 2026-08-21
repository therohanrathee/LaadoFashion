'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Choose Your Style',
    description: 'Browse our catalog of ladies suits, nightwear, and casual styles. Pick your garment and customise with add-ons like lace borders, zigzag sleeves, and embroidery.',
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
    title: 'We Come to You',
    description: 'Our runner visits your home at a convenient time. They take precise measurements, collect the fabric, and understand your exact design preferences.',
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
    title: 'Master Craftsmanship',
    description: 'Our skilled tailors meticulously stitch your garment to exact specifications. Every seam, every fold, every detail is perfected with years of expertise.',
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
    title: 'Delivered to Your Door',
    description: 'Your perfectly stitched garment is delivered back home. Try it on — if anything needs adjustment, our runner takes it back for alterations at no extra hassle.',
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
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">The Process</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark mt-4 mb-6">How It Works</h2>
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
              {/* Connector line (hidden on last item and mobile) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-t border-dashed border-gold/30" />
              )}
              
              <div className="relative bg-cream rounded-2xl p-8 border border-gray-100 hover:border-gold/30 transition-all duration-500 hover:shadow-lg hover:shadow-gold/5">
                {/* Step number */}
                <div className="absolute -top-4 -right-2 text-6xl font-serif font-bold text-gold/10 group-hover:text-gold/20 transition-colors select-none">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="text-maroon mb-6">
                  {step.icon}
                </div>

                <h3 className="text-xl font-serif font-bold text-dark mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
