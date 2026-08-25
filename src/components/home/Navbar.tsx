'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { items, setIsCartOpen } = useCart()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4 flex justify-between items-center">
        {/* Left Navigation: Logo */}
        <div className="flex items-center flex-none">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0" aria-label="Home">
            <span className="font-serif font-bold text-[#1a1a1a] text-[12px] sm:text-[14px] md:text-xl tracking-tight whitespace-nowrap">
              Laado Fashion <span className="text-[#C5A55A] font-sans px-0.5 text-[10px] md:text-sm">&amp;</span> <span className="italic font-medium text-[#E91E63]">Boutique</span>
            </span>
          </Link>
        </div>

        {/* Mobile Center Links (Hidden on Desktop) */}
        <div className="md:hidden flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap flex-grow mx-1 shrink min-w-0">
          <Link href="/womens" className="text-[9px] sm:text-[11px] font-bold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase truncate">
            Women&apos;s
          </Link>
          <span className="text-gray-300 text-[10px] shrink-0">|</span>
          <Link href="/mens" className="text-[9px] sm:text-[11px] font-bold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase truncate">
            Men&apos;s
          </Link>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 flex-none justify-end">
          <div className="hidden md:flex items-center gap-5">
            {/* Desktop Navigation Links */}
            <div className="flex items-center gap-4 whitespace-nowrap mr-2">
              <Link href="/womens" className="text-sm font-semibold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase">
                Women&apos;s
              </Link>
              <span className="text-gray-300 text-sm">|</span>
              <Link href="/mens" className="text-sm font-semibold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase">
                Men&apos;s
              </Link>
              <span className="text-gray-300 text-sm">|</span>
              <Link href="/bulk-order" className="text-sm font-semibold tracking-wider text-gray-800 hover:text-[#E91E63] transition-colors uppercase">
                Bulk Order
              </Link>
            </div>

            <Link 
              href="/track" 
              className="text-sm font-medium tracking-wide text-gray-600 hover:text-[#E91E63] transition-colors"
            >
              Track Order
            </Link>

            {/* Book Now (Desktop) */}
            <div 
              className={`relative h-10 transition-all duration-150 ease-out ${hovered ? 'w-[165px]' : 'w-[105px]'}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out ${hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                <div className="bg-[#E91E63] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm whitespace-nowrap cursor-pointer">
                  Book Now
                </div>
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ease-out ${hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex gap-2 items-center">
                  <Link href="/womens" className={`bg-[#E91E63] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-transform duration-150 ease-out ${hovered ? 'translate-x-0' : 'translate-x-4'}`}>
                    Women&apos;s
                  </Link>
                  <Link href="/mens" className={`bg-[#1a1a1a] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-transform duration-150 ease-out ${hovered ? 'translate-x-0' : '-translate-x-4'}`}>
                    Men&apos;s
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Icon */}
          <button 
            id="cart-icon-target"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-gray-900 hover:text-[#E91E63] transition-colors bg-gray-50 hover:bg-rose-50 rounded-full border border-gray-100 hover:border-rose-100 shrink-0"
            aria-label="Open cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E91E63] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {items.length}
              </span>
            )}
          </button>

          {/* Hamburger Menu Icon (Now on the extreme right) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-900 focus:outline-none p-1 ml-1"
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg px-6 py-4 flex flex-col gap-4">
          <div className="flex gap-3 mb-2">
            <Link 
              href="/track" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 bg-gray-100 text-gray-800 text-center text-sm font-semibold py-3 rounded-lg"
            >
              Track Order
            </Link>
          </div>
          <div className="flex gap-3 mb-4">
            <Link href="/womens" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-[#E91E63] text-white text-center text-sm font-semibold py-3 rounded-lg">Book Women&apos;s</Link>
            <Link href="/mens" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 bg-[#1a1a1a] text-white text-center text-sm font-semibold py-3 rounded-lg">Book Men&apos;s</Link>
          </div>
          <div className="h-px bg-gray-100 w-full mb-2"></div>
          <Link href="/womens" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2 uppercase text-sm tracking-wider">Women&apos;s Collection</Link>
          <Link href="/mens" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2 uppercase text-sm tracking-wider">Men&apos;s Collection</Link>
          <Link href="/bulk-order" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 font-medium py-2 uppercase text-sm tracking-wider">Bulk Order</Link>
        </div>
      )}
    </motion.nav>
  )
}
