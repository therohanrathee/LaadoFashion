'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, cartTotal } = useCart()

  const [isMobile, setIsMobile] = useState(true)

  // Close on escape key and track window size
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false)
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    
    checkMobile()
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('resize', checkMobile)
    }
  }, [setIsCartOpen])

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 z-[100]"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Slide-over panel */}
          <motion.div 
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed z-[101] w-full max-w-md bg-white/80 backdrop-blur-3xl shadow-2xl flex flex-col border-white/50 overflow-hidden bottom-0 inset-x-0 h-[85vh] rounded-t-3xl md:bottom-auto md:inset-y-0 md:right-0 md:left-auto md:h-full md:rounded-none md:border-l"
          >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200/50 flex items-center justify-between bg-transparent">
          <h2 className="text-xl font-serif font-bold text-gray-900">Your Cart</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-black/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-transparent">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-[#E91E63] font-semibold hover:underline text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                <button 
                  onClick={() => removeItem(item.cartItemId)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
                
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg shadow-sm bg-gray-200" />
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">₹{item.basePrice}</p>
                  </div>
                  
                  {item.addons.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {item.addons.map(addon => (
                        <div key={addon.id} className="flex justify-between items-center text-[11px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                          <span>{addon.name}</span>
                          <span className="font-medium">+₹{addon.price}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-2 py-0.5 text-gray-500 hover:text-[#E91E63] transition-colors">-</button>
                      <span className="text-xs font-semibold px-2 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-2 py-0.5 text-gray-500 hover:text-[#E91E63] transition-colors">+</button>
                    </div>
                    
                    <span className="font-bold text-[#E91E63] text-sm">
                      ₹{(item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-transparent border-t border-gray-200/50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">₹{cartTotal}</span>
            </div>
            
            <Link 
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="w-full flex items-center justify-center bg-[#E91E63] hover:bg-[#C2185B] text-white py-4 rounded-xl font-bold tracking-wide transition-colors shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
