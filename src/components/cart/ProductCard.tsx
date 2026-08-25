'use client'

import { useState } from 'react'
import { useCart, CartItem } from '@/context/CartContext'

interface ProductCardProps {
  item: {
    id: string;
    name: string;
    basePrice: number;
    originalPrice?: number;
    image: string;
  }
}

export default function ProductCard({ item }: ProductCardProps) {
  const { addItem } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  // Hardcoded add-on for now as requested
  const addonsList = [
    { id: 'express', name: 'Express 3 Day Delivery', price: 999 }
  ]

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleConfirmAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    const activeAddons = addonsList.filter(a => selectedAddons.includes(a.id))
    
    addItem({
      productId: item.id,
      name: item.name,
      basePrice: item.basePrice,
      image: item.image,
      addons: activeAddons,
      quantity: 1
    }, e)
    
    setIsModalOpen(false)
    setSelectedAddons([]) // reset for next time
  }

  return (
    <>
      <div className="w-full group cursor-pointer relative" onClick={() => setIsModalOpen(true)}>
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-2xl bg-gray-100">
          <img 
            src={item.image} 
            alt={item.name} 
            loading="lazy"
            className="w-full h-auto block object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white/15 backdrop-blur-lg border-t border-white/20 flex justify-between items-center">
            <h3 className="text-lg font-serif font-bold text-gray-900 drop-shadow-sm truncate mr-3">{item.name}</h3>
            <div className="flex items-center gap-2 shrink-0">
              {item.originalPrice && (
                <span className="text-xs font-medium text-gray-700 line-through decoration-gray-500 drop-shadow-sm hidden lg:inline-block">₹{item.originalPrice}</span>
              )}
              <span className="text-lg font-bold text-[#E91E63] drop-shadow-sm">₹{item.basePrice}</span>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
            <button 
              className="bg-[#E91E63] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform pointer-events-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Add-ons Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10 relative overflow-hidden transform transition-all scale-100">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Select Add-ons</h3>
            <p className="text-sm text-gray-500 mb-6">Customize your {item.name}</p>
            
            <div className="space-y-3 mb-8">
              {addonsList.map(addon => {
                const isSelected = selectedAddons.includes(addon.id)
                return (
                  <label key={addon.id} className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'border-[#E91E63] bg-pink-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleAddon(addon.id)}
                      className="w-4 h-4 text-[#E91E63] border-gray-300 rounded focus:ring-[#E91E63]" 
                    />
                    <div className="ml-3 flex-1">
                      <span className="block text-sm font-medium text-gray-900">{addon.name}</span>
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? 'text-[#E91E63]' : 'text-gray-500'}`}>+₹{addon.price}</span>
                  </label>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAdd}
                className="flex-1 px-4 py-3 bg-[#E91E63] text-white font-bold rounded-xl hover:bg-[#C2185B] transition-colors shadow-md"
              >
                Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
