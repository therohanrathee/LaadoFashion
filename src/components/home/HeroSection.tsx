'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
      {/* Subtle radial accent behind the text */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3ece2] via-[#FAF8F5] to-[#FAF8F5]" />

      {/* Decorative dot pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #E91E63 0.8px, transparent 0.8px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating decorative ring — light maroon */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute top-24 right-16 md:right-32 w-56 md:w-72 h-56 md:h-72 rounded-full border border-[#E91E63]/10"
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-24 left-12 md:left-24 w-64 md:w-96 h-64 md:h-96 rounded-full border border-[#C5A55A]/10"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-[#E91E63]/5 border border-[#E91E63]/10 rounded-full px-5 py-2 mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-[#C5A55A] animate-pulse" />
          <span className="text-[#E91E63]/70 text-sm tracking-wide font-medium">Bespoke Tailoring at Your Doorstep</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold leading-[1.08] mb-6 text-[#1a1a1a]"
        >
          Laado Fashion
          <br />
          <span className="text-[#C5A55A]">&amp;</span>{' '}
          <span className="italic font-medium text-[#E91E63]">Boutique</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto mb-14 leading-relaxed"
        >
          Where tradition meets elegance. Custom ladies wear stitched to perfection, 
          measured at your home, delivered to your doorstep.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/order"
            className="group bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-[#E91E63]/20 hover:bg-[#C2185B]"
          >
            Book a Measurement
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-600 font-medium text-sm uppercase tracking-wider px-10 py-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            How It Works
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-24 flex justify-center gap-12 md:gap-20"
        >
          {[
            { number: '500+', label: 'Orders Delivered' },
            { number: '4.9★', label: 'Customer Rating' },
            { number: '100%', label: 'Custom Stitched' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-serif font-bold text-[#E91E63]">{stat.number}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#E91E63]/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#C5A55A]/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
