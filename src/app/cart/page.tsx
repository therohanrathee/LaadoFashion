'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { fetchCatalogItems, fetchAddons, CatalogAddon } from '@/app/actions/catalog'

export default function CartPage() {
  const { items, addItem, removeItem, updateQuantity, removeAddon, addAddon, clearCart, cartTotal } = useCart()
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [catalogItems, setCatalogItems] = useState<any[]>([])
  const [availableDbAddons, setAvailableDbAddons] = useState<CatalogAddon[]>([])
  
  useEffect(() => {
    fetchCatalogItems().then(data => setCatalogItems(data))
    fetchAddons().then(data => setAvailableDbAddons(data.filter(a => a.isActive)))
  }, [])
  
  const allJuttis = catalogItems.filter(item => item.category === 'Jutti' && item.isActive)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    remarks: '',
    email: ''
  })
  
  // Promo Code State
  const [discountCode, setDiscountCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')
  const [promoData, setPromoData] = useState<any>(null)
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }
    
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
        setFormData(prev => ({ ...prev, remarks: prev.remarks + ` [Location: ${position.coords.latitude}, ${position.coords.longitude}]` }))
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Could not get your location. Please enter your address manually.")
        setIsGettingLocation(false)
      }
    )
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const isFreeEligible = cartTotal >= 1000;
    
    let visitCharge = isFreeEligible ? 0 : 500;
    let deliveryCharge = isFreeEligible ? 0 : 100;
    let customDiscount = 0;

    if (promoData) {
      if (promoData.discount_type === 'free_visit') visitCharge = 0;
      if (promoData.discount_type === 'free_delivery') deliveryCharge = 0;
      if (promoData.discount_type === 'fixed_amount') customDiscount = promoData.discount_amount;
      if (promoData.discount_type === 'percentage') customDiscount = cartTotal * (promoData.discount_amount / 100);
    }
    
    const finalTotal = cartTotal + visitCharge + deliveryCharge - customDiscount;
    const discountApplied = (isFreeEligible ? 600 : 0) + customDiscount;

    const supabase = createClient()
    
    // 1. Check if user is a repeating customer based on phone number
    const { data: existingOrders } = await supabase
      .from('orders')
      .select('customer_id')
      .eq('customer_phone', formData.phone)
      .limit(1)

    let customerId;
    if (existingOrders && existingOrders.length > 0 && existingOrders[0].customer_id) {
      // Returning user
      customerId = existingOrders[0].customer_id;
    } else {
      // First time user
      customerId = crypto.randomUUID();
    }

    const { data, error } = await supabase.from('orders').insert([{
      customer_id: customerId,
      customer_name: formData.name,
      customer_phone: formData.phone,
      delivery_address: formData.address,
      customer_email: formData.email,
      additional_remarks: formData.remarks,
      location_lat: locationCoords?.lat,
      location_lng: locationCoords?.lng,
      cart_items: items,
      subtotal: cartTotal,
      visit_charge: visitCharge,
      delivery_charge: deliveryCharge,
      discount_applied: discountApplied,
      total_amount: finalTotal,
      status: 'pending_measurement',
      promo_code_id: promoData?.id || null,
      promo_code_code: promoData?.code || null
    }]).select()

    if (error) {
      alert("Failed to place order: " + error.message)
      setIsSubmitting(false)
      return
    }

    // Attempt to send email if provided (runs in background)
    if (formData.email) {
      import('@/app/actions/email').then(({ sendOrderConfirmationEmail }) => {
        sendOrderConfirmationEmail({
          orderId: data[0].id,
          email: formData.email,
          name: formData.name,
          totalAmount: finalTotal
        })
      });
    }

    // Redirect to tracking page with correct parameter name `id`
    router.push('/track?id=' + data[0].id)
    
    // Clear cart slightly later so the user doesn't see a flash of the empty cart state before redirect finishes
    setTimeout(() => {
      clearCart()
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            {step === 'checkout' && (
              <button onClick={() => setStep('cart')} className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            )}
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
              {step === 'cart' ? 'Shopping Cart' : 'Checkout Details'}
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#141414] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6 text-lg">Your cart is currently empty.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs sm:max-w-none mx-auto px-6 sm:px-0">
                <Link href="/womens" className="w-full sm:w-auto bg-[#E91E63] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#C2185B] transition-colors">
                  Shop Women's
                </Link>
                <Link href="/mens" className="w-full sm:w-auto bg-[#1a1a1a] text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Shop Men's
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <AnimatePresence mode="popLayout" initial={false}>
                
                {/* CHECKOUT MODE: Render Order Summary FIRST so it snaps to the left */}
                {step === 'checkout' && (
                  <motion.div 
                    layout
                    key="summary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    className="bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 h-fit sticky top-32 lg:col-span-1 w-full"
                  >
                    <OrderSummaryContent items={items} cartTotal={cartTotal} step={step} onProceed={() => setStep('checkout')} />
                  </motion.div>
                )}

                {/* CART ITEMS: Renders first in cart mode */}
                {step === 'cart' && (
                  <motion.div 
                    key="cart-items"
                    layout
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    className="lg:col-span-2 space-y-6 w-full"
                  >
                    {items.map((item) => {
                      const itemTotalPrice = (item.basePrice + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity;
                      
                      return (
                        <div key={item.cartItemId} className="flex gap-4 sm:gap-6 bg-white dark:bg-[#141414] p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 relative">
                          <img src={item.image} alt={item.name} className="w-24 h-32 sm:w-32 sm:h-40 shrink-0 object-cover rounded-xl bg-gray-50 dark:bg-[#0a0a0a]" />
                          
                          <div className="flex-1 flex flex-col min-w-0">
                            {/* Header Row: Title & Total Price */}
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 dark:text-white truncate">{item.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-sm">₹{item.basePrice} (Base Price)</p>
                              </div>
                              <div className="text-lg sm:text-2xl font-bold text-[#E91E63] shrink-0">
                                ₹{itemTotalPrice}
                              </div>
                            </div>
                            
                            {/* Add-ons List */}
                            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
                              {/* Selected Add-ons */}
                              {item.addons.length > 0 && (
                                <div>
                                  <p className="text-[10px] sm:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Selected Add-ons</p>
                                  <ul className="space-y-2">
                                    {item.addons.map(addon => (
                                      <li key={addon.id} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#0a0a0a] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-100 dark:border-white/5 w-full">
                                        <svg className="text-[#E91E63] shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        <span className="flex-1 leading-tight">{addon.name}</span>
                                        <span className="font-semibold shrink-0">+₹{addon.price}</span>
                                        <button 
                                          onClick={() => removeAddon(item.cartItemId, addon.id)}
                                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors p-1 shrink-0"
                                          title="Remove Add-on"
                                        >
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Available Add-ons */}
                              {(() => {
                                const isJutti = item.name.toLowerCase().includes('jutti');
                                const allAddons = isJutti ? [] : availableDbAddons.filter(a => !a.catalogItemId || a.catalogItemId === item.productId);
                                const availableAddons = allAddons.filter(a => !item.addons.some((selected: any) => selected.id === a.id));
                                
                                if (availableAddons.length === 0) return null;

                                return (
                                  <div>
                                    <p className="text-[10px] sm:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Available Add-ons</p>
                                    <ul className="space-y-2">
                                      {availableAddons.map(addon => (
                                        <li key={addon.id} className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#141414] px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-dashed border-gray-300 dark:border-white/20 w-full hover:border-[#E91E63] transition-colors cursor-pointer" onClick={() => addAddon(item.cartItemId, addon)}>
                                          <button 
                                            className="text-[#E91E63] hover:text-[#C2185B] transition-colors p-1 shrink-0 bg-rose-50 rounded-md"
                                            title="Add Add-on"
                                          >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                          </button>
                                          <span className="flex-1 leading-tight">{addon.name}</span>
                                          <span className="font-semibold shrink-0 text-gray-500 dark:text-gray-400 dark:text-gray-500">+₹{addon.price}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex-grow" />

                            {/* Footer Row: Quantity & Remove Item (Dustbin) */}
                            <div className="flex justify-between items-end mt-4 sm:mt-6">
                              <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-white dark:bg-[#141414]">
                                <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1.5 bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-white/5 transition-colors">-</button>
                                <span className="px-4 py-1.5 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1.5 bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:bg-white/5 transition-colors">+</button>
                              </div>
                              
                              <button 
                                onClick={() => removeItem(item.cartItemId)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove Item"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Blinkit-style Impulse Buy / Cross-sell */}
                    {(() => {
                      // Only show cross-sell if there is a Women's collection clothing item in the cart
                      const hasWomensItem = items.some(cartItem => {
                        const catalogItem = catalogItems.find(c => c.id === cartItem.productId);
                        return catalogItem?.category === 'Women';
                      });

                      if (!hasWomensItem) return null;

                      const crossSellJuttis = allJuttis;
                      return (
                        <div className="mt-12 mb-4 bg-white dark:bg-[#141414] p-6 rounded-2xl shadow-sm border border-[#C5A55A]/30 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A55A]/10 rounded-bl-full -z-10" />
                          <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-1">Complete Your Look ✨</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6">Add matching handcrafted Juttis to your outfit</p>
                          
                          <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide">
                            {crossSellJuttis.map(jutti => (
                              <div key={jutti.id} className="flex-none w-40 sm:w-64 border border-gray-100 dark:border-white/5 rounded-xl p-3 sm:p-4 flex flex-col gap-3 snap-start hover:border-[#C5A55A]/50 transition-colors bg-background/50">
                                <div className="h-28 sm:h-48 w-full relative rounded-lg overflow-hidden bg-white dark:bg-[#141414] border border-gray-50 flex-none">
                                  <img src={jutti.image} alt={jutti.name} className="object-contain w-full h-full mix-blend-multiply p-2" />
                                </div>
                                <div>
                                  <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{jutti.name}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold sm:text-lg text-[#E91E63]">₹{jutti.basePrice}</span>
                                    {jutti.originalPrice && (
                                      <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">₹{jutti.originalPrice}</span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => addItem({
                                    productId: jutti.id,
                                    name: jutti.name,
                                    basePrice: jutti.basePrice,
                                    image: jutti.image,
                                    addons: [],
                                    quantity: 1
                                  }, e)}
                                  className="mt-auto w-full py-2 sm:py-2.5 bg-white dark:bg-[#141414] border border-[#C5A55A] text-[#C5A55A] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg hover:bg-[#C5A55A] hover:text-white transition-colors"
                                >
                                  ADD
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                  </motion.div>
                )}

                {/* CART MODE: Render Order Summary SECOND so it snaps to the right */}
                {step === 'cart' && (
                  <motion.div 
                    layout
                    key="summary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    className="bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 h-fit sticky top-32 lg:col-span-1 w-full"
                  >
                    <OrderSummaryContent items={items} cartTotal={cartTotal} step={step} onProceed={() => setStep('checkout')} />
                  </motion.div>
                )}

                {/* CHECKOUT FORM */}
                {step === 'checkout' && (
                  <motion.div
                    key="checkout-form"
                    layout
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    className="lg:col-span-2 w-full"
                  >
                    <form onSubmit={handleConfirmOrder} className="bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</label>
                          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all" placeholder="Enter your full name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number *</label>
                          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all" placeholder="10-digit mobile number" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Delivery Address *</label>
                          <button 
                            type="button" 
                            onClick={handleGetLocation}
                            disabled={isGettingLocation || locationCoords !== null}
                            className="text-xs font-semibold flex items-center gap-1 text-[#E91E63] hover:text-[#C2185B] disabled:text-green-600 disabled:opacity-100 transition-colors"
                          >
                            {locationCoords ? (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                Location Captured
                              </>
                            ) : isGettingLocation ? (
                              'Locating...'
                            ) : (
                              <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                                Get Precise Location
                              </>
                            )}
                          </button>
                        </div>
                        <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all h-24 resize-none" placeholder="Enter complete house/flat no, street, landmark..." />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                          <span>Email Address <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span></span>
                        </label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all" placeholder="Enter email for tracking updates" />
                        <p className="text-xs text-[#C5A55A] font-medium mt-1">Providing your email ensures you receive live tracking numbers and updates!</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                          <span>Additional Remarks <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span></span>
                        </label>
                        <textarea value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none transition-all h-20 resize-none" placeholder="Any specific instructions for the tailor or delivery runner?" />
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold text-lg tracking-wide hover:bg-[#C2185B] disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-md mt-4">
                        {isSubmitting ? 'Confirming Order...' : 'Confirm Order'}
                      </button>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function OrderSummaryContent({ 
  items, 
  cartTotal, 
  step, 
  onProceed,
  discountCode,
  setDiscountCode,
  promoError,
  setPromoError,
  promoSuccess,
  setPromoSuccess,
  promoData,
  setPromoData,
  isApplyingPromo,
  setIsApplyingPromo
}: any) {
  const isFreeEligible = cartTotal >= 1000;
  
  let visitCharge = isFreeEligible ? 0 : 500;
  let deliveryCharge = isFreeEligible ? 0 : 100;
  let customDiscount = 0;

  if (promoData) {
    if (promoData.discount_type === 'free_visit') visitCharge = 0;
    if (promoData.discount_type === 'free_delivery') deliveryCharge = 0;
    if (promoData.discount_type === 'fixed_amount') customDiscount = promoData.discount_amount;
    if (promoData.discount_type === 'percentage') customDiscount = cartTotal * (promoData.discount_amount / 100);
  }
  
  const finalTotal = cartTotal + visitCharge + deliveryCharge - customDiscount;
  const totalSavings = (isFreeEligible ? 600 : 0) + customDiscount;
  
  const amountToFree = 1000 - cartTotal;

  const handleApplyPromo = async () => {
    if (!discountCode.trim()) return
    setIsApplyingPromo(true)
    setPromoError('')
    setPromoSuccess('')
    
    // Dynamically import validatePromoCode to keep client bundle clean
    const { validatePromoCode } = await import('@/app/actions/admin')
    
    const res = await validatePromoCode(discountCode, '', cartTotal)
    
    if (res.error) {
      setPromoError(res.error)
      setPromoData(null)
    } else {
      setPromoSuccess(`Promo code applied!`)
      setPromoData(res.promo)
    }
    setIsApplyingPromo(false)
  }

  return (
    <>
      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
      
      {/* Discount Code Input */}
      <div className="flex gap-2 mb-2">
        <input 
          type="text" 
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Discount code" 
          className="flex-1 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] outline-none text-sm uppercase transition-colors"
        />
        <button 
          onClick={handleApplyPromo}
          disabled={isApplyingPromo}
          className="px-5 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
        >
          {isApplyingPromo ? '...' : 'Apply'}
        </button>
      </div>
      {promoError && <p className="text-xs text-red-500 mb-4">{promoError}</p>}
      {promoSuccess && <p className="text-xs text-green-600 font-bold mb-4">{promoSuccess}</p>}

      {/* Progress to Free */}
      {!isFreeEligible && cartTotal > 0 && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-center">
          <p className="text-xs text-red-600 font-semibold mb-2">
            Add <span className="text-red-700 text-sm mx-0.5">₹{amountToFree}</span> more to unlock FREE Home Visit & Delivery!
          </p>
          <div className="w-full bg-red-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${(cartTotal / 1000) * 100}%` }} />
          </div>
        </div>
      )}
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-6">
        <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-white/5">
          {items.map((item: any) => (
            <div key={item.cartItemId} className="flex justify-between items-start text-xs">
              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-200">{item.name} {item.quantity > 1 && `(x${item.quantity})`}</span>
                {item.addons.map((addon: any) => (
                  <span key={addon.id} className="text-gray-400 dark:text-gray-500 text-[10px]">+ {addon.name}</span>
                ))}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{(item.basePrice + item.addons.reduce((s:number, a:any) => s+a.price, 0)) * item.quantity}
              </span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span>Tailor Home Visit</span>
          </div>
          {isFreeEligible ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-500 line-through text-xs">₹500</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
          ) : (
            <span className="font-medium text-gray-900 dark:text-white">₹500</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span>Delivery Charge</span>
          {isFreeEligible ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-500 line-through text-xs">₹100</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
          ) : (
            <span className="font-medium text-gray-900 dark:text-white">₹100</span>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-white/5 pt-6 mb-6">
        <div className="flex justify-between items-end mb-4">
          <span className="font-bold text-gray-900 dark:text-white text-lg">Total</span>
          <div className="text-right">
            {isFreeEligible && (
              <div className="text-xs text-gray-400 dark:text-gray-500 line-through mb-1 font-medium">₹{cartTotal + 600}</div>
            )}
            <span className="font-bold text-[#E91E63] text-3xl">₹{finalTotal}</span>
          </div>
        </div>
        
        {totalSavings > 0 && (
          <div className="flex justify-between items-center bg-green-50 px-4 py-3 rounded-lg border border-green-200">
            <span className="text-green-800 font-bold text-sm">Total Savings Today</span>
            <span className="text-green-700 font-black text-xl">-₹{totalSavings}</span>
          </div>
        )}
      </div>

      {step === 'cart' && (
        <button onClick={onProceed} className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold tracking-wide hover:bg-[#C2185B] transition-colors shadow-md">
          Add Address and Proceed
        </button>
      )}
      
    </>
  )
}
