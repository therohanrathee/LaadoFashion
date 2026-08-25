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

          {/* Responsive Masonry Grid using CSS Columns */}
          <div className="columns-2 md:columns-4 gap-4 space-y-4">
            {womensCatalog.map((item) => (
              <div key={item.id} className="break-inside-avoid">
                <ProductCard item={item} />
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
          

