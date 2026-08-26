'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function HeroSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FAF8F5]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f3ece2] via-[#FAF8F5] to-[#FAF8F5]" />

      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `radial-gradient(circle, #E91E63 0.8px, transparent 0.8px)`, backgroundSize: '32px 32px' }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[#E91E63]/[0.03] blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#C5A55A]/[0.04] blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-rose-200/20 blur-[100px]" />
      </div>

      <div className="relative z-5 text-center px-6 max-w-4xl mx-auto pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 bg-[#E91E63]/5 border border-[#E91E63]/10 rounded-full px-5 py-2 mb-10">
          <span className="w-2 h-2 rounded-full bg-[#C5A55A] animate-pulse" />
          <span className="text-[#E91E63]/70 text-sm tracking-wide font-medium">Bespoke Tailoring at Your Doorstep</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold leading-[1.08] mb-4 text-[#1a1a1a]">
          Laado Fashion<br /><span className="text-[#C5A55A]">&amp;</span> <span className="italic font-medium text-[#E91E63]">Boutique</span>
        </motion.h1>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-xl md:text-2xl font-serif font-semibold text-gray-800 mb-6">
          Premium Doorstep Tailoring • 7-Day Delivery
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg md:text-xl text-gray-500 font-light max-w-xl mx-auto mb-14 leading-relaxed">
          Get expert bespoke stitching without leaving your home. We offer free measurement pickup, premium craftsmanship, and guaranteed doorstep delivery in just 7 days.
        </motion.p>

        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="relative flex items-center justify-center h-14 mt-4"
        >
          {/* Book button — ALWAYS in the dead center of the page */}
          <div 
            className="relative inline-grid place-items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setHovered(!hovered)}
          >
            {/* Layer 1: Default state */}
            <div className={`col-start-1 row-start-1 bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-opacity duration-150 ease-out ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
              Book a Measurement
            </div>

            {/* Layer 2: Hover state */}
            <div className={`col-start-1 row-start-1 flex gap-4 items-center transition-opacity duration-150 ease-out ${hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <Link
                href="/womens"
                prefetch={true}
                className={`bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg shadow-sm hover:shadow-lg hover:shadow-[#E91E63]/20 whitespace-nowrap transition-transform duration-150 ease-out ${
                  hovered ? 'translate-x-0' : 'translate-x-8'
                }`}
              >
                Women&apos;s Tailoring
              </Link>
              <Link
                href="/mens"
                prefetch={true}
                className={`bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-800 whitespace-nowrap transition-transform duration-150 ease-out ${
                  hovered ? 'translate-x-0' : '-translate-x-8'
                }`}
              >
                Men&apos;s Tailoring
              </Link>
            </div>
          </div>

        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.3 }} className="mt-24 flex justify-center gap-12 md:gap-20">
          {[ { number: '500+', label: 'Orders Delivered' }, { number: '4.9★', label: 'Customer Rating' }, { number: '100%', label: 'Custom Stitched' } ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-serif font-bold text-[#E91E63]">{stat.number}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
