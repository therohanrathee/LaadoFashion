'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEnquiry } from '@/context/EnquiryContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { setIsDrawerOpen } = useEnquiry()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-white/10 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-12">
        {/* Logo */}
        <div className="flex-none">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0 cursor-pointer z-50 relative" aria-label="Home">
            <span className="font-serif font-bold text-[#1a1a1a] dark:text-white text-[12px] sm:text-[14px] md:text-xl tracking-tight whitespace-nowrap">
              Laado Fashion <span className="text-[#C5A55A] font-sans px-0.5 text-[10px] md:text-sm">&amp;</span> <span className="italic font-medium text-[#E91E63]">Boutique</span>
            </span>
          </Link>
        </div>

        {/* Mobile Center Links (Hidden on Desktop) */}
        <div className="md:hidden flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap flex-grow mx-1 shrink min-w-0">
          <Link href="/rate-list" className="text-[9px] sm:text-[11px] font-bold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase truncate">
            Rate List
          </Link>
          <span className="text-gray-300 dark:text-gray-600 text-[10px] shrink-0">|</span>
          <Link href="/womens" className="text-[9px] sm:text-[11px] font-bold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase truncate">
            Women&apos;s
          </Link>
          <span className="text-gray-300 dark:text-gray-600 text-[10px] shrink-0">|</span>
          <Link href="/mens" className="text-[9px] sm:text-[11px] font-bold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase truncate">
            Men&apos;s
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 flex-none justify-end">
          <div className="hidden md:flex items-center gap-5">
            {/* Desktop Navigation Links */}
            <div className="flex items-center gap-4 whitespace-nowrap mr-2">
              <Link href="/rate-list" className="text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase">
                Rate List
              </Link>
              <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
              <Link href="/womens" className="text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase">
                Women&apos;s
              </Link>
              <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
              <Link href="/mens" className="text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase">
                Men&apos;s
              </Link>
              <span className="text-gray-300 dark:text-gray-600 text-sm">|</span>
              <Link href="/bulk-order" className="text-sm font-semibold tracking-wider text-gray-800 dark:text-gray-200 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors uppercase">
                Bulk Order
              </Link>
            </div>

            <Link 
              href="/track" 
              className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-300 hover:text-[#E91E63] dark:hover:text-[#E91E63] transition-colors"
            >
              Track Order
            </Link>

            {/* Enquire (Desktop) */}
            <div className={`relative h-10 transition-all duration-150 ease-out w-[105px]`}>
              <button onClick={() => setIsDrawerOpen(true)} className="absolute inset-0 flex items-center justify-center bg-[#E91E63] hover:bg-[#C2185B] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-colors">
                Enquire
              </button>
            </div>
          </div>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-900 dark:text-white focus:outline-none p-1 ml-1"
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/10 shadow-lg px-6 py-4 flex flex-col gap-4">
          <div className="flex gap-3 mb-2">
            <Link 
              href="/track" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-center text-sm font-semibold py-3 rounded-lg"
            >
              Track Order
            </Link>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); setIsDrawerOpen(true); }}
              className="flex-1 bg-[#E91E63] text-white text-center text-sm font-semibold py-3 rounded-lg"
            >
              Enquire Now
            </button>
          </div>
          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full mb-2"></div>
          <Link href="/rate-list" onClick={() => setIsMobileMenuOpen(false)} className="text-[#E91E63] font-bold py-2 uppercase text-sm tracking-wider">Rate List</Link>
          <Link href="/womens" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200 font-medium py-2 uppercase text-sm tracking-wider">Women&apos;s Tailoring</Link>
          <Link href="/mens" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200 font-medium py-2 uppercase text-sm tracking-wider">Men&apos;s Tailoring</Link>
          <Link href="/bulk-order" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 dark:text-gray-200 font-medium py-2 uppercase text-sm tracking-wider">Bulk Order</Link>
        </div>
      )}
    </motion.nav>
  )
}
