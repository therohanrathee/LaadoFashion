'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '@/context/CartContext'
import { useAddons } from '@/hooks/useAddons'

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    basePrice: number;
    image: string;
  }
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({ item, className = "bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm", label = "Add to Cart", children }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  
  const { addons } = useAddons()

  const isJutti = item.name.toLowerCase().includes('jutti')

  // Use the fetched addons, filtering for active ones that apply globally (no catalogItemId) or specifically to this item
  const addonsList = isJutti ? [] : addons.filter(a => 
    a.isActive && (!a.catalogItemId || a.catalogItemId === item.id)
  );

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
    setSelectedAddons([])
  }

  return (
    <>
      <button 
        onClick={(e) => { 
          e.preventDefault(); 
          e.stopPropagation(); 
          if (addonsList.length > 0) {
            setIsModalOpen(true); 
          } else {
            handleConfirmAdd(e);
          }
        }}
        className={className}
      >
        {children || label}
      </button>

      {/* Add-ons Modal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center text-left">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }} />
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm z-10 relative overflow-hidden transform transition-all scale-100 cursor-default" onClick={e => e.stopPropagation()}>
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
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
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
        </div>,
        document.body
      )}
    </>
  )
}
