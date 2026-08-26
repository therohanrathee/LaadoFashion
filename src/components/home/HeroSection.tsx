'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Scissors, Ruler, Truck } from 'lucide-react'

export default function HeroSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#FAF8F5]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3ece2]/50 via-[#FAF8F5] to-[#FAF8F5]" />
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `radial-gradient(circle, #E91E63 0.8px, transparent 0.8px)`, backgroundSize: '32px 32px' }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[#E91E63]/[0.03] blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[0%] right-[10%] w-[40%] h-[60%] rounded-full bg-[#C5A55A]/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20 pb-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="text-left pt-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 bg-[#E91E63]/5 border border-[#E91E63]/10 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#E91E63] animate-pulse" />
              <span className="text-[#E91E63] text-sm tracking-wide font-semibold uppercase">Doorstep Tailoring Service</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-6 text-[#1a1a1a]">
              Laado Fashion<br /><span className="text-[#C5A55A]">&amp;</span> <span className="italic font-medium text-[#E91E63]">Boutique</span>
            </motion.h1>

            {/* Trust Indicators / Infographic Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap gap-4 mb-8">
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <Ruler className="w-4 h-4 text-[#C5A55A]" />
                  <span className="text-sm font-semibold text-gray-700">Home Measurement</span>
               </div>
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <Scissors className="w-4 h-4 text-[#E91E63]" />
                  <span className="text-sm font-semibold text-gray-700">Custom Stitched</span>
               </div>
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                  <Truck className="w-4 h-4 text-[#C5A55A]" />
                  <span className="text-sm font-semibold text-gray-700">7-Day Delivery</span>
               </div>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-lg text-gray-600 font-light max-w-lg mb-10 leading-relaxed">
              We bring the master tailor to your living room. Skip the boutique visits and get perfectly fitted bespoke clothing crafted exclusively for you.
            </motion.p>

            {/* CTA Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="relative flex items-center h-14 mt-4"
            >
              <div 
                className="relative inline-grid place-items-start"
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
                      hovered ? 'translate-x-0' : '-translate-x-8'
                    }`}
                  >
                    Women&apos;s Tailoring
                  </Link>
                  <Link
                    href="/mens"
                    prefetch={true}
                    className={`bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-800 whitespace-nowrap transition-transform duration-150 ease-out ${
                      hovered ? 'translate-x-0' : 'translate-x-8'
                    }`}
                  >
                    Men&apos;s Tailoring
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-16 flex gap-10">
              {[ { number: '650+', label: 'Happy Clients' }, { number: '4.9★', label: 'Google Rating' } ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-serif font-bold text-[#1a1a1a]">{stat.number}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, delay: 0.5 }} 
            className="relative hidden lg:block h-[700px] w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image 
              src="/images/home/hero_sewing_machine.jpg" 
              alt="Master tailor operating a sewing machine" 
              fill 
              className="object-cover"
              priority
              sizes="50vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Tag */}
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-5 text-white transform hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-[#C5A55A] w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-serif text-xl font-medium mb-1">Master Craftsmanship</div>
                  <div className="text-sm text-white/80 font-light">Over a decade of bringing bespoke elegance to life.</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
