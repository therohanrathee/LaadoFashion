'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-[#E91E63]">
            <path d="M8 4L24 20M24 20L28 16M24 20L20 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M6 26C6 26 10 22 14 22C18 22 22 26 22 26" stroke="#C5A55A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
          </svg>
          <div>
            <span className="text-xl font-serif font-bold tracking-wide text-[#E91E63]">
              Laado
            </span>
            <span className="hidden sm:inline text-xs ml-2 uppercase tracking-[0.25em] text-gray-400">
              Fashion & Boutique
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-3 md:gap-6">
          <Link 
            href="/track" 
            className="text-sm font-medium tracking-wide text-gray-600 hover:text-[#E91E63] transition-colors"
          >
            Track Order
          </Link>
          <Link 
            href="/order" 
            className="bg-[#E91E63] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#E91E63]/90 transition-all shadow-sm hover:shadow-md"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
