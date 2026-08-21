'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitOrder } from '@/app/actions/order'

// Dummy Data
const CATALOG = [
  { id: '1', name: 'Anarkali Suit', basePrice: 2500, image: '👗' },
  { id: '2', name: 'Punjabi Salwar Suit', basePrice: 2000, image: '👘' },
  { id: '3', name: 'Kurti & Palazzo', basePrice: 1800, image: '🥻' },
  { id: '4', name: 'Ladies Jutti', basePrice: 1200, image: '🥿' },
]

const ADDONS = [
  { id: '1', name: 'Intricate Embroidery', price: 1500, appliesTo: ['1', '2', '3'] },
  { id: '2', name: 'Premium Silk Lining', price: 800, appliesTo: ['1', '2', '3'] },
  { id: '3', name: 'Custom Beaded Tassels', price: 400, appliesTo: ['1', '2', '3', '4'] },
]

export default function OrderForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Order State
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)

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

  const currentItem = CATALOG.find(c => c.id === selectedItem)
  const currentItemAddons = ADDONS.filter(a => selectedItem && a.appliesTo.includes(selectedItem))
  
  const totalCost = (currentItem?.basePrice || 0) + 
    selectedAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find(a => a.id === addonId)
      return sum + (addon?.price || 0)
    }, 0)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    // Submit to server action
    const res = await submitOrder({
      catalogItemId: selectedItem,
      addonIds: selectedAddons,
      name,
      phone,
      email,
      address,
      latitude: location?.lat || 0, // Fallback if they didn't allow location but filled address
      longitude: location?.lng || 0,
      totalEstimatedCost: totalCost
    })

    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      // Show success screen
      setStep(6)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-3 rounded">{error}</div>}
      
      {/* STEP 1: Select Garment */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">1. Select Garment</h2>
          <div className="grid grid-cols-2 gap-4">
            {CATALOG.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                  selectedItem === item.id ? 'border-[#8b0000] bg-red-50 ring-1 ring-[#8b0000]' : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <span className="text-4xl">{item.image}</span>
                <span className="font-medium text-center">{item.name}</span>
                <span className="text-sm text-gray-500">₹{item.basePrice}</span>
              </button>
            ))}
          </div>
          <div className="pt-6 flex justify-end">
            <button 
              disabled={!selectedItem}
              onClick={() => setStep(2)}
              className="bg-[#8b0000] text-white px-6 py-2 rounded hover:bg-[#6b0000] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Add-ons */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">2. Select Add-ons</h2>
          {currentItemAddons.length === 0 ? (
            <p className="text-gray-500">No add-ons available for this item.</p>
          ) : (
            <div className="space-y-3">
              {currentItemAddons.map(addon => (
                <label key={addon.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedAddons([...selectedAddons, addon.id])
                        else setSelectedAddons(selectedAddons.filter(id => id !== addon.id))
                      }}
                      className="w-5 h-5 text-[#8b0000] rounded border-gray-300 focus:ring-[#8b0000]"
                    />
                    <span className="font-medium">{addon.name}</span>
                  </div>
                  <span className="text-gray-600">+₹{addon.price}</span>
                </label>
              ))}
            </div>
          )}
          <div className="pt-6 flex justify-between">
            <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-2">Back</button>
            <button onClick={() => setStep(3)} className="bg-[#8b0000] text-white px-6 py-2 rounded hover:bg-[#6b0000]">Next</button>
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
            <button type="submit" className="bg-[#8b0000] text-white px-6 py-2 rounded hover:bg-[#6b0000]">Next</button>
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
            <button type="submit" className="bg-[#8b0000] text-white px-6 py-2 rounded hover:bg-[#6b0000]">Review Order</button>
          </div>
        </form>
      )}

      {/* STEP 5: Review */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-xl font-semibold mb-4">5. Review Your Order</h2>
          
          <div className="bg-gray-50 border rounded-lg p-5 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-y-3 border-b pb-4">
              <span className="text-gray-500">Item</span>
              <span className="font-medium text-right">{currentItem?.name}</span>
              
              {selectedAddons.length > 0 && (
                <>
                  <span className="text-gray-500">Add-ons</span>
                  <span className="font-medium text-right text-gray-600">
                    {selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name).join(', ')}
                  </span>
                </>
              )}
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
              <span className="text-lg font-medium text-gray-800">Estimated Total</span>
              <span className="text-2xl font-bold text-[#8b0000]">₹{totalCost}</span>
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
              className="bg-[#8b0000] text-white px-8 py-3 rounded text-lg font-medium shadow-md hover:bg-[#6b0000] disabled:opacity-50"
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
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Our runner will contact you shortly for measurements and fabric pickup. 
            You can log in anytime using your email to track your order status.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="text-gray-600 font-medium hover:underline px-4 py-2"
            >
              Return Home
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="bg-[#8b0000] text-white font-medium hover:bg-[#6b0000] rounded px-6 py-2"
            >
              Track Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
