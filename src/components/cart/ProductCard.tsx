'use client'

import AddToCartButton from '@/components/cart/AddToCartButton'

interface ProductCardProps {
  item: {
    id: string;
    name: string;
    basePrice: number;
    originalPrice?: number;
    image: string;
    category?: string;
    isActive?: boolean;
  }
}

export default function ProductCard({ item }: ProductCardProps) {
  const isJutti = item.category === 'Jutti';

  return (
    <div className="w-full group relative">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-2xl bg-white/70 dark:bg-[#141414]/70 backdrop-blur-sm border border-gray-100 dark:border-white/5 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full bg-gray-50/50 dark:bg-transparent">
          <img 
            src={item.image} 
            alt={item.name}
            className={`w-full h-auto block transition-transform duration-700 group-hover:scale-105 ${
              isJutti ? 'object-contain p-4 aspect-[4/5]' : 'object-cover'
            }`}
          />
        </div>
        
          {/* Text Area Below Image */}
        <div className="px-4 py-4 flex flex-col gap-1.5 flex-grow justify-between relative">
          <h3 className="text-[14px] md:text-[15px] font-sans font-semibold tracking-tight text-gray-900 dark:text-gray-100 leading-tight pr-8">
            {item.name}
          </h3>
          
          <div className="flex items-baseline gap-1.5 mt-1 pr-8">
            {item.originalPrice && (
              <span className="text-[10px] md:text-xs font-medium text-gray-400 dark:text-gray-500 line-through decoration-[2px] decoration-gray-400 dark:decoration-gray-500 mr-1">
                ₹{item.originalPrice}
              </span>
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">From</span>
            <span className="text-[16px] md:text-lg font-bold text-[#E91E63]">₹{item.basePrice}</span>
          </div>

          {/* Persistent Add to Cart Button (All devices) */}
          <div className="absolute bottom-4 right-4 z-20">
            {item.isActive !== false && (
              <AddToCartButton 
                item={{ id: item.id, name: item.name, basePrice: item.basePrice, image: item.image }} 
                className="bg-[#E91E63] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M12 5v14"/>
                </svg>
              </AddToCartButton>
            )}
          </div>
        </div>
        
        {/* Inactive Overlay */}
        {item.isActive === false && (
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] z-30 flex items-center justify-center">
            <span className="bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-white/10 transform -rotate-12">
              {item.category === 'Jutti' ? 'Out of stock' : 'Not available currently'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
