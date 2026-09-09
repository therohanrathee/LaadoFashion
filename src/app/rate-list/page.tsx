import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'
import { fetchCatalogItems } from '@/app/actions/catalog'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const WOMEN_GROUPS = {
  'Suits & Kurtas': ['suit', 'kurta', 'anarkali', 'cord set'],
  'Lehengas & Sarees': ['lehenga', 'lehanga', 'saree'],
  'Blouses & Tops': ['blouse', 'shirt'],
  'Western Wear': ['western', 'gown', 'jumpsuit', 'piece suit', 'blazer'],
  'Bottoms & Essentials': ['petticoat', 'skirt', 'trouser', 'plazo', 'salwar', 'pants']
}

const MEN_GROUPS = {
  'Traditional Wear': ['sherwani', 'indo', 'kurta', 'pathani'],
  'Suits & Formal Wear': ['piece suit', 'safari', 'tuxedo suit', 'breasted suit'],
  'Jackets & Blazers': ['jacket', 'blazer', 'coat', 'jodhpuri'],
  'Individual Pieces': ['shirt', 'trouser']
}

function assignGroup(name: string, category: string) {
  const n = name.toLowerCase()
  const groups = category === 'Women' ? WOMEN_GROUPS : MEN_GROUPS
  
  for (const [groupName, keywords] of Object.entries(groups)) {
    if (keywords.some(kw => n.includes(kw))) {
      return groupName
    }
  }
  return 'Other Essentials'
}

export default async function RateListPage() {
  const catalog = await fetchCatalogItems()
  const visibleCatalog = catalog.filter(item => item.isActive !== false && !item.name.toLowerCase().includes('jutti'))

  // Group by category then sub-category
  const structured = {
    Women: {} as Record<string, typeof visibleCatalog>,
    Men: {} as Record<string, typeof visibleCatalog>
  }

  visibleCatalog.forEach(item => {
    const cat = item.category === 'Men' ? 'Men' : 'Women'
    const sub = assignGroup(item.name, cat)
    if (!structured[cat][sub]) structured[cat][sub] = []
    structured[cat][sub].push(item)
  })

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0a] flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-[0.2em]">Transparent Pricing</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mt-4 mb-4">
              Our Rate List
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Clear, upfront pricing for premium bespoke tailoring. Final prices may vary slightly based on fabric, complex designs, or specific add-ons.
            </p>
          </div>

          <div className="space-y-16">
            {Object.entries(structured).map(([category, subcategories]) => {
              if (Object.keys(subcategories).length === 0) return null;
              return (
                <div key={category} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-serif font-bold text-[#1a1a1a] dark:text-white">
                      {category}'s Tailoring
                    </h2>
                    <div className="h-[1px] flex-grow bg-gray-200 dark:bg-white/10"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {Object.entries(subcategories).map(([sub, items]) => (
                      <div key={sub} className="bg-white dark:bg-[#141414] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-gray-50 dark:bg-white/5 px-6 py-4 border-b border-gray-100 dark:border-white/5">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{sub}</h3>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/5 flex-grow">
                          {items.map((item) => (
                            <div key={item.id} className="p-4 sm:p-6 flex items-center hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors gap-4">
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-black border border-gray-100 dark:border-white/5">
                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                              </div>
                              
                              <div className="flex-grow">
                                <h4 className="font-semibold text-gray-900 dark:text-white sm:text-lg">{item.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">From</span>
                                  <span className="text-lg font-bold text-[#E91E63]">₹{item.basePrice}</span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through ml-2">₹{item.originalPrice}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {category === 'Women' && (
                    <div className="bg-[#E91E63]/5 dark:bg-[#E91E63]/10 border border-[#E91E63]/20 rounded-2xl p-6 sm:p-8 mt-8">
                      <h3 className="font-bold text-lg text-[#E91E63] mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Optional Add-ons Available
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl text-center shadow-sm">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-white">Lining (Astar)</span>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl text-center shadow-sm">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-white">Cups / Pads</span>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl text-center shadow-sm">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-white">Can-can</span>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-4 rounded-xl text-center shadow-sm">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-white">Latkans / Tassels</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                        Add-ons are available at an extra cost depending on the fabric and requirements. Your designer will provide exact pricing during measurements.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-20 bg-gradient-to-r from-gray-900 to-black dark:from-[#1a1a1a] dark:to-black rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#E91E63]/20 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-[#C5A55A]/20 blur-[80px]"></div>
            
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 bg-[#E91E63]/20 text-[#E91E63] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Express Service
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                Need it in a hurry?
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                We offer an exclusive <strong className="text-white">48-Hour Express Delivery</strong> on select garments. Get your custom-stitched outfit delivered perfectly tailored in just two days.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
