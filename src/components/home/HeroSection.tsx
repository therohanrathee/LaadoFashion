'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Scissors, Ruler, Truck } from 'lucide-react'
import SplitBookButton from '@/components/ui/SplitBookButton'

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black lg:bg-[#FAF8F5] pt-[80px] min-h-[calc(100vh-80px)] flex items-center">
      
      {/* Mobile Background Image (Full Bleed) */}
      <div className="absolute inset-0 z-0 lg:hidden block">
        <Image 
          src="/images/home/mobile_hero_tailor_v4.jpg" 
          alt="Master tailor" 
          fill 
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient to darken the left side for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Desktop Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f3ece2]/50 via-[#FAF8F5] to-[#FAF8F5] hidden lg:block z-0" />
      <div 
        className="absolute inset-0 opacity-[0.04] hidden lg:block"
        style={{ backgroundImage: `radial-gradient(circle, #E91E63 0.8px, transparent 0.8px)`, backgroundSize: '32px 32px' }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
        <motion.div animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[#E91E63]/[0.03] blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, -40, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[0%] right-[10%] w-[40%] h-[60%] rounded-full bg-[#C5A55A]/[0.04] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-10 lg:py-12 mt-4 lg:mt-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="text-left w-full mt-4 lg:mt-0 max-w-xl lg:max-w-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 bg-[#E91E63]/20 lg:bg-[#E91E63]/5 border border-[#E91E63]/30 lg:border-[#E91E63]/10 rounded-full px-4 py-2 mb-6 backdrop-blur-sm lg:backdrop-blur-none">
              <span className="w-2 h-2 rounded-full bg-[#E91E63] animate-pulse" />
              <span className="text-[#E91E63] text-xs md:text-sm tracking-wide font-semibold uppercase">Doorstep Tailoring Service</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-5xl sm:text-6xl lg:text-[4rem] font-serif font-bold leading-[1.08] mb-6 text-white lg:text-[#1a1a1a]">
              Laado Fashion<br className="hidden sm:block" /><span className="text-[#C5A55A]">&amp;</span> <span className="italic font-medium text-[#E91E63]">Boutique</span>
            </motion.h1>

            {/* Trust Indicators / Infographic Bar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
               <div className="flex items-center gap-2 bg-white/10 lg:bg-white backdrop-blur-md lg:backdrop-blur-none px-3 py-2 rounded-lg shadow-sm border border-white/20 lg:border-gray-100">
                  <Ruler className="w-4 h-4 text-white lg:text-[#C5A55A]" />
                  <span className="text-xs sm:text-sm font-semibold text-white lg:text-gray-700">Home Measurement</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 lg:bg-white backdrop-blur-md lg:backdrop-blur-none px-3 py-2 rounded-lg shadow-sm border border-white/20 lg:border-gray-100">
                  <Scissors className="w-4 h-4 text-[#E91E63]" />
                  <span className="text-xs sm:text-sm font-semibold text-white lg:text-gray-700">Custom Stitched</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 lg:bg-white backdrop-blur-md lg:backdrop-blur-none px-3 py-2 rounded-lg shadow-sm border border-white/20 lg:border-gray-100 hidden sm:flex">
                  <Truck className="w-4 h-4 text-white lg:text-[#C5A55A]" />
                  <span className="text-xs sm:text-sm font-semibold text-white lg:text-gray-700">7-Day Delivery</span>
               </div>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-base lg:text-lg text-gray-200 lg:text-gray-600 font-light max-w-sm sm:max-w-md lg:max-w-lg mb-8 leading-relaxed">
              We bring the master tailor to your living room. Skip the boutique visits and get perfectly fitted bespoke clothing crafted exclusively for you.
            </motion.p>

            {/* CTA Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="relative flex items-center h-14 mt-2"
            >
              <SplitBookButton 
                defaultText="Book a Measurement"
                className="bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-6 lg:px-8 py-4 rounded-lg shadow-sm hover:bg-[#C2185B] transition-colors whitespace-nowrap w-full sm:w-auto"
                splitClassName="px-6 py-4 text-sm"
              />
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-10 lg:mt-12 flex gap-8">
              {[ { number: '650+', label: 'Happy Clients' }, { number: '4.9★', label: 'Google Rating' } ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl lg:text-3xl font-serif font-bold text-white lg:text-[#1a1a1a]">{stat.number}</div>
                  <div className="text-[10px] lg:text-xs text-gray-400 lg:text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Hero Image (Desktop Only) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1, delay: 0.5 }} 
            className="relative hidden lg:block aspect-[4.2/5] w-full max-w-[460px] xl:max-w-[500px] lg:mx-auto rounded-2xl overflow-hidden shadow-2xl lg:-translate-y-2 xl:-translate-y-4"
          >
            <Image 
              src="/images/home/hero_sewing_machine.jpg" 
              alt="Master tailor operating a sewing machine" 
              fill 
              className="object-cover object-[center_65%]"
              priority
              sizes="(min-width: 1024px) 50vw, 0vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            
            {/* Floating Tag */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4 text-white transform hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-[#C5A55A] w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-serif text-lg font-medium mb-0.5 leading-tight">Master Craftsmanship</div>
                  <div className="text-xs text-white/90 font-light leading-tight">Over a decade of bringing bespoke elegance to life.</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
