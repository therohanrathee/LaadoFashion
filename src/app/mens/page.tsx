import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { CATALOG } from '@/app/order/catalogData'
import SplitBookButton from '@/components/ui/SplitBookButton'
import ProductCard from '@/components/cart/ProductCard'

export default function MensCollectionPage() {
  const mensCatalog = CATALOG.filter(item => item.category === 'Men')

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">Sharp & Sophisticated</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-4">
              Men's Collection
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our premium men's tailoring services. From classic formal suits to intricate traditional wear, we stitch to perfection.
            </p>
          </div>

          {/* True Masonry-style Grid using Flexbox for rock-solid stability */}
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {[
              mensCatalog.filter((_, i) => i % 4 === 0),
              mensCatalog.filter((_, i) => i % 4 === 1),
              mensCatalog.filter((_, i) => i % 4 === 2),
              mensCatalog.filter((_, i) => i % 4 === 3),
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
              className="bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-md whitespace-nowrap"
              splitClassName="px-6 py-3 text-sm"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
