import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { CATALOG } from '@/app/order/catalogData'
import SplitBookButton from '@/components/ui/SplitBookButton'
import ProductCard from '@/components/cart/ProductCard'

export default function WomensCollectionPage() {
  const womensCatalog = CATALOG.filter(item => item.category === 'Women')

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-[0.2em]">Exquisite Designs</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-4">
              Women's Collection
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Discover our exclusive range of beautifully crafted women's wear, blending traditional elegance with contemporary styling. Custom tailored for the perfect fit.
            </p>
          </div>

          {/* True Masonry-style Grid using Flexbox for rock-solid stability */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {[
              womensCatalog.filter((_, i) => i % 4 === 0),
              womensCatalog.filter((_, i) => i % 4 === 1),
              womensCatalog.filter((_, i) => i % 4 === 2),
              womensCatalog.filter((_, i) => i % 4 === 3),
            ].map((columnItems, colIndex) => (
              <div key={colIndex} className="flex-1 w-full flex flex-col gap-4">
                {columnItems.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <SplitBookButton 
              defaultText="Start Your Order"
              className="bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-lg hover:bg-[#C2185B] transition-colors shadow-md whitespace-nowrap"
              splitClassName="px-6 py-3 text-sm"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
          

