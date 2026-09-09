import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { fetchCatalogItems } from '@/app/actions/catalog'
import SplitBookButton from '@/components/ui/SplitBookButton'
import ProductCard from '@/components/cart/ProductCard'

export default async function MensCollectionPage() {
  const catalog = await fetchCatalogItems()
  const visibleCatalog = catalog.filter(item => item.isActive || item.name.toLowerCase().includes('jutti'))
  const mensCatalog = visibleCatalog.filter(item => item.category === 'Men')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">Master Tailoring Near You</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mt-4 mb-4">
              Premium Men's Tailoring in Gurugram
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Explore our bespoke men's tailoring services near you. From classic 2-piece suit stitching to intricate traditional sherwanis, we provide professional stitching at your doorstep.
            </p>
          </div>

          {/* Standard CSS Grid instead of buggy CSS Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mensCatalog.map((item) => (
              <div key={item.id} className="w-full">
                <ProductCard item={item} />
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
