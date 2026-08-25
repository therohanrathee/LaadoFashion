'use client'

import { useCart } from '@/context/CartContext'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal } = useCart()

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500 mb-6 text-lg">Your cart is currently empty.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/womens" className="bg-[#E91E63] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#C2185B] transition-colors">
                  Shop Women's
                </Link>
                <Link href="/mens" className="bg-[#1a1a1a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Shop Men's
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                    <button 
                      onClick={() => removeItem(item.cartItemId)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                    
                    <img src={item.image} alt={item.name} className="w-32 h-40 object-cover rounded-xl bg-gray-50" />
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-serif font-bold text-gray-900">{item.name}</h3>
                      <p className="text-gray-500 mt-1">₹{item.basePrice} (Base Price)</p>
                      
                      {item.addons.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selected Add-ons</p>
                          <ul className="space-y-2">
                            {item.addons.map(addon => (
                              <li key={addon.id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                <svg className="text-[#E91E63]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                <span className="flex-1">{addon.name}</span>
                                <span className="font-semibold">+₹{addon.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between items-end ml-4">
                      <div className="text-xl font-bold text-[#E91E63]">
                        ₹{(item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity}
                      </div>
                      
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">-</button>
                        <span className="px-4 py-1.5 font-semibold text-gray-900 bg-white min-w-[3rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-32">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 text-sm text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="font-medium text-gray-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-medium text-gray-900">Calculated at next step</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">Total</span>
                    <span className="font-bold text-[#E91E63] text-2xl">₹{cartTotal}</span>
                  </div>
                </div>

                <button className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold tracking-wide hover:bg-[#C2185B] transition-colors shadow-md">
                  Continue to Payment
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  Secure checkout powered by Stripe.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
