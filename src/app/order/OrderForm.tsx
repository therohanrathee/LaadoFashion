'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { submitOrder } from '@/app/actions/order'
import { CATALOG, ADDONS, CatalogCategory, CatalogItem } from './catalogData'

interface CartItem {
  cartItemId: string
  catalogItemId: string
  quantity: number
  addonIds: string[]
}

export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Catalog Tab State
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>('Women')

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([])

  // Modal State
  const [modalItem, setModalItem] = useState<CatalogItem | null>(null)
  const [modalQty, setModalQty] = useState(1)
  const [modalAddons, setModalAddons] = useState<string[]>([])

  // Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [orderId, setOrderId] = useState('')

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setError('')
        },
        (error) => {
          console.error("Error obtaining location", error)
          setError("Failed to get location. Please allow location access or type address manually.")
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  const openModal = (item: CatalogItem) => {
    setModalItem(item)
    setModalQty(1)
    setModalAddons([])
  }

  const addToCart = () => {
    if (!modalItem) return
    const newItem: CartItem = {
      cartItemId: Math.random().toString(36).substring(7),
      catalogItemId: modalItem.id,
      quantity: modalQty,
      addonIds: modalAddons
    }
    setCart([...cart, newItem])
    setModalItem(null)
  }

  const removeFromCart = (cartItemId: string) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId))
  }

  const calculateTotal = () => {
    return cart.reduce((total, cartItem) => {
      const catalogData = CATALOG.find(c => c.id === cartItem.catalogItemId)
      if (!catalogData) return total
      const itemTotal = catalogData.basePrice * cartItem.quantity
      
      const addonsTotal = cartItem.addonIds.reduce((sum, addonId) => {
        const addon = ADDONS.find(a => a.id === addonId)
        return sum + (addon ? addon.price * cartItem.quantity : 0)
      }, 0)

      return total + itemTotal + addonsTotal
    }, 0)
  }

  const totalCost = calculateTotal()

  const handleSubmit = async () => {
    if (!location) {
      setError("Please provide your location before submitting.")
      setStep(4)
      return
    }
    if (cart.length === 0) {
      setError("Your cart is empty.")
      setStep(1)
      return
    }

    setLoading(true)
    setError('')

    const res = await submitOrder({
      cartItems: cart,
      name,
      phone,
      email,
      address,
      latitude: location.lat,
      longitude: location.lng,
    })

    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else if (res.success) {
      setOrderId(res.orderId || '')
      setStep(6)
    }
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* STEP 1: Select Garment (Catalog) */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 relative">
          <h2 className="text-xl font-semibold mb-4">1. Build Your Order</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setSelectedCategory('Women')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === 'Women' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Women's Wear
            </button>
            <button
              onClick={() => setSelectedCategory('Men')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === 'Men' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Men's Wear
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1 pb-24">
            {CATALOG.filter(item => item.category === selectedCategory).map(item => (
              <button
                key={item.id}
                onClick={() => openModal(item)}
                className="p-4 border border-gray-200 rounded-lg flex flex-col items-center gap-2 transition-all hover:border-[#E91E63] hover:shadow-sm bg-white"
              >
                <div className="relative w-20 h-20 mb-2">
                  <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply" />
                </div>
                <span className="font-medium text-center text-sm">{item.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">₹{item.basePrice}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Floating Cart Bar */}
          {cart.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center rounded-b-lg">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Cost</p>
                <p className="text-xl font-bold text-[#E91E63]">₹{totalCost}</p>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="bg-[#E91E63] text-white px-6 py-2 rounded font-medium hover:bg-[#C2185B] transition-colors"
              >
                View Cart ({cart.length} items) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ITEM CUSTOMIZATION MODAL */}
      {modalItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-4">
              <div className="text-5xl">{modalItem.image}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{modalItem.name}</h3>
                <p className="text-[#E91E63] font-medium">₹{modalItem.basePrice} per item</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Quantity</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50"
                  >-</button>
                  <span className="text-lg font-medium w-4 text-center">{modalQty}</span>
                  <button 
                    onClick={() => setModalQty(modalQty + 1)}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-50"
                  >+</button>
                </div>
              </div>

              {/* Addons */}
              {ADDONS.filter(a => a.appliesTo.includes(modalItem.id)).length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Optional Add-ons</label>
                  <div className="space-y-2">
                    {ADDONS.filter(a => a.appliesTo.includes(modalItem.id)).map(addon => (
                      <label key={addon.id} className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-[#E91E63]"
                            checked={modalAddons.includes(addon.id)}
                            onChange={(e) => {
                              if (e.target.checked) setModalAddons([...modalAddons, addon.id])
                              else setModalAddons(modalAddons.filter(id => id !== addon.id))
                            }}
                          />
                          <span className="text-sm font-medium text-gray-800">{addon.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {addon.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{addon.originalPrice}</span>
                          )}
                          <span className="text-xs font-semibold text-gray-500">+₹{addon.price}/ea</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setModalItem(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button 
                onClick={addToCart}
                className="bg-[#E91E63] text-white px-6 py-2 rounded text-sm font-medium hover:bg-[#C2185B]"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Cart Summary */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">2. Cart Summary</h2>
          
          <div className="space-y-3">
            {cart.map(cartItem => {
              const catalogData = CATALOG.find(c => c.id === cartItem.catalogItemId)
              if (!catalogData) return null
              const baseCost = catalogData.basePrice * cartItem.quantity
              const addonsCost = cartItem.addonIds.reduce((sum, id) => {
                const a = ADDONS.find(x => x.id === id)
                return sum + (a ? a.price * cartItem.quantity : 0)
              }, 0)

              return (
                <div key={cartItem.cartItemId} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {cartItem.quantity}x {catalogData.name}
                    </p>
                    {cartItem.addonIds.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        + {cartItem.addonIds.map(id => ADDONS.find(a => a.id === id)?.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#E91E63]">₹{baseCost + addonsCost}</p>
                    <button 
                      onClick={() => removeFromCart(cartItem.cartItemId)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-6 flex justify-between items-center border-t mt-6">
            <button onClick={() => setStep(1)} className="text-[#E91E63] font-medium text-sm hover:underline">
              ← Add more items
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Cart Total</p>
              <p className="text-xl font-bold text-gray-900">₹{totalCost}</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              onClick={() => setStep(3)}
              className="w-full bg-[#E91E63] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C2185B]"
            >
              Proceed to Details
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Personal Details */}
      {step === 3 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(4); }} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">3. Your Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div className="pt-6 flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="text-gray-600 px-6 py-2">Back</button>
            <button type="submit" className="bg-[#E91E63] text-white px-6 py-2 rounded hover:bg-[#C2185B]">Next</button>
          </div>
        </form>
      )}

      {/* STEP 4: Location */}
      {step === 4 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(5); }} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">4. Location & Address</h2>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-800 mb-3">
              We assign our runners based on geographic clusters. Sharing your exact location ensures faster service!
            </p>
            <button 
              type="button" 
              onClick={handleGetLocation}
              className="flex items-center justify-center w-full gap-2 text-sm bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {location ? 'Location Captured ✓' : 'Grant Location Access'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Street Address (for delivery/pickup verification)</label>
            <textarea 
              required 
              placeholder="Enter your full street address manually..."
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              className="w-full border rounded px-3 py-2 h-24 resize-none" 
            />
          </div>

          <div className="pt-6 flex justify-between">
            <button type="button" onClick={() => setStep(3)} className="text-gray-600 px-6 py-2">Back</button>
            <button type="submit" className="bg-[#E91E63] text-white px-6 py-2 rounded hover:bg-[#C2185B]">Review Order</button>
          </div>
        </form>
      )}

      {/* STEP 5: Review */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">5. Review Your Order</h2>
          
          <div className="bg-gray-50 border rounded-lg p-5 space-y-4 text-sm">
            <div className="space-y-2 border-b pb-4">
              <span className="text-gray-500 block mb-2 font-medium">Cart Items</span>
              {cart.map(cartItem => (
                <div key={cartItem.cartItemId} className="flex justify-between">
                  <span className="font-medium">{cartItem.quantity}x {CATALOG.find(c => c.id === cartItem.catalogItemId)?.name}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-y-3 border-b pb-4">
              <span className="text-gray-500">Customer</span>
              <span className="font-medium text-right">{name}</span>
              
              <span className="text-gray-500">Contact</span>
              <span className="font-medium text-right text-gray-600">{phone} <br/> {email}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-y-3 border-b pb-4">
              <span className="text-gray-500">Address</span>
              <span className="font-medium text-right text-gray-600 leading-snug">{address}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-medium text-gray-800">Total Price</span>
              <span className="text-2xl font-bold text-[#E91E63]">₹{totalCost}</span>
            </div>
          </div>
          
          <p className="text-xs text-center text-gray-500">
            Runner will collect 50% (₹{totalCost / 2}) via Cash/UPI during the measurement pickup.
          </p>
          
          <div className="pt-2 flex justify-between">
            <button onClick={() => setStep(4)} className="text-gray-600 px-6 py-2">Back</button>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-[#E91E63] text-white px-8 py-3 rounded text-lg font-medium shadow-md hover:bg-[#C2185B] disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: Success */}
      {step === 6 && (
        <div className="text-center py-12 animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h2 className="text-3xl font-semibold mb-2">Order Placed Successfully!</h2>
          <div className="bg-gray-50 border rounded-lg p-4 my-6 inline-block mx-auto">
            <p className="text-sm text-gray-500 mb-1">Your Tracking ID</p>
            <p className="font-mono text-xl font-bold text-[#E91E63]">{orderId}</p>
          </div>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We have sent an email with your tracking link. Our runner will contact you shortly for measurements and fabric pickup.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-gray-600 font-medium hover:underline px-4 py-2"
            >
              Return Home
            </button>
            <button 
              onClick={() => router.push(`/track?id=${orderId}`)}
              className="bg-[#E91E63] text-white font-medium hover:bg-[#C2185B] rounded px-6 py-2"
            >
              Track Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
