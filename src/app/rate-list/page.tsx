import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import { fetchCatalogItems } from '@/app/actions/catalog'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function RateListPage() {
  const catalog = await fetchCatalogItems()
  const visibleCatalog = catalog.filter(item => item.isActive !== false && !item.category?.toLowerCase().includes('jutti'))

  // Group by category
  const grouped = visibleCatalog.reduce((acc, item) => {
    const cat = item.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, typeof visibleCatalog>)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-4">
              Our Rate List
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Transparent pricing for premium bespoke tailoring. Final prices may vary slightly based on fabric and complex designs.
            </p>
          </div>

          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-serif font-bold text-[#E91E63] mb-6 pb-2 border-b border-gray-100 dark:border-white/10">
                  {category}
                </h2>
                
                <div className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                  <div className="divide-y divide-gray-50 dark:divide-white/5">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-black">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900 dark:text-white sm:text-lg">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {item.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                            )}
                            <span className="text-sm font-bold text-[#E91E63]">₹{item.basePrice}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
