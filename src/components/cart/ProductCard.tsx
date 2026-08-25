'use client'

import AddToCartButton from '@/components/cart/AddToCartButton'

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
  return (
    <div className="w-full group relative">
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

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <AddToCartButton 
            item={{ id: item.id, name: item.name, basePrice: item.basePrice, image: item.image }} 
            className="bg-[#E91E63] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
          />
        </div>
      </div>
    </div>
  )
}
