'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        {/* Left Navigation */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="text-[#C5A55A] hover:text-[#E91E63] transition-colors" aria-label="Home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </Link>
          <Link href="/womens" className="text-sm font-semibold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase">
            Women&apos;s
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/mens" className="text-sm font-semibold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase">
            Men&apos;s
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/bulk-order" className="text-sm font-semibold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase">
            Bulk Order
          </Link>
        </div>

        {/* Right — Track Order + Book Now (splits) + Cart */}
        <div className="flex items-center gap-5">
          <Link 
            href="/track" 
            className="text-sm font-medium tracking-wide text-gray-600 hover:text-[#E91E63] transition-colors"
          >
            Track Order
          </Link>

          {/* Book Now — expands width on hover to push siblings apart */}
          <div 
            className={`relative h-10 transition-all duration-150 ease-out ${hovered ? 'w-[165px]' : 'w-[105px]'}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Layer 1: Default — Book Now */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
              <div className="bg-[#E91E63] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm whitespace-nowrap cursor-pointer">
                Book Now
              </div>
            </div>

            {/* Layer 2: Hover — Women's + Men's */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out ${hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex gap-2 items-center">
                <Link
                  href="/womens"
                  prefetch={true}
                  className={`bg-[#E91E63] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow-md whitespace-nowrap transition-transform duration-150 ease-out ${
                    hovered ? 'translate-x-0' : 'translate-x-4'
                  }`}
                >
                  Women&apos;s
                </Link>
                <Link
                  href="/mens"
                  prefetch={true}
                  className={`bg-[#1a1a1a] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm hover:shadow-md whitespace-nowrap transition-transform duration-150 ease-out ${
                    hovered ? 'translate-x-0' : '-translate-x-4'
                  }`}
                >
                  Men&apos;s
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Icon */}
          <Link href="#" className="relative text-gray-700 hover:text-[#E91E63] transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {/* Badge — will show count later */}
            <span className="absolute -top-1.5 -right-1.5 bg-[#E91E63] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
