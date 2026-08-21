'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-28 md:py-36 px-6 bg-[#f5f0ea] overflow-hidden">
      {/* Decorative ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-32 -top-32 w-96 h-96 rounded-full border border-[#C5A55A]/10"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full border border-[#7B1E3A]/10"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">Get Started Today</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#1a1a1a] mt-4 mb-6 leading-tight">
            Ready for the <span className="text-[#7B1E3A] italic">perfect fit</span>?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Book a home measurement today. Our runner will visit you, take your measurements, 
            and your custom-stitched garment will be delivered to your doorstep.
          </p>
          <Link
            href="/order"
            className="inline-block bg-[#7B1E3A] text-white font-bold text-sm uppercase tracking-wider px-12 py-5 rounded-lg hover:bg-[#6a1a32] transition-all shadow-md hover:shadow-lg hover:shadow-[#7B1E3A]/20"
          >
            Start Your Order
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
