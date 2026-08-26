'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import AddToCartButton from '@/components/cart/AddToCartButton'

// Generate the 10 leather juttis and 4 plastic juttis based on the processed files
const allJuttis = [
  ...[24,25,26,27,28,29,30,31,32,33].map(id => ({
    id: `jutti-leather-${id}`,
    title: 'Genuine Leather Jutti',
    type: 'Genuine Leather',
    price: '₹799',
    originalPrice: '₹1299',
    accent: '#C5A55A',
    bg: 'bg-gradient-to-br from-[#C5A55A]/20 to-white/60 dark:to-[#141414]/60 backdrop-blur-sm',
    border: 'border-[#C5A55A]/20',
    image: `/images/juttis/leather/IMG_85${id}.webp`,
  })),
  ...[34,35,36,37].map(id => ({
    id: `jutti-handcrafted-${id}`,
    title: 'Handcrafted Jutti',
    type: 'Handcrafted',
    price: '₹499',
    originalPrice: '₹699',
    accent: '#E91E63',
    bg: 'bg-gradient-to-br from-[#E91E63]/20 to-white/60 dark:to-[#141414]/60 backdrop-blur-sm',
    border: 'border-[#E91E63]/20',
    image: `/images/juttis/plastic/IMG_85${id}.webp`,
  }))
]

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 bg-[#f5f0ea] dark:bg-[#0a0a0a] overflow-hidden" ref={ref}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-16 px-6 relative z-5"
      >
        <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">Our Speciality</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mt-4 mb-6">Handcrafted Juttis</h2>
        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed bg-[#f5f0ea]/80 dark:bg-[#0a0a0a]/80 dark:text-gray-400 inline-block px-4 py-1 rounded-full">
          Swipe through our exclusive collection of beautifully crafted Juttis, now available at discounted prices.
        </p>
      </motion.div>

      {/* Carousel - Full Bleed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full relative z-20"
      >
        {/* Scrollable Container */}
        <div className="flex overflow-x-auto gap-6 px-6 md:px-12 lg:px-24 pb-12 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {allJuttis.map((jutti, i) => (
              <div 
                key={jutti.id} 
                className={`shrink-0 w-[280px] md:w-[320px] snap-center relative z-20 ${jutti.bg} rounded-2xl overflow-hidden border ${jutti.border} p-6 flex flex-col justify-between transition-all hover:shadow-xl group`}
              >
                
                <div className="w-full h-56 relative mb-6 rounded-lg overflow-hidden bg-white/80 dark:bg-transparent backdrop-blur-sm shadow-sm border border-black/5 dark:border-white/5 group-hover:-translate-y-2 transition-transform duration-300 p-2 md:p-4">
                  <div className="relative w-full h-full">
                    <Image 
                      src={jutti.image} 
                      alt={jutti.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                  </div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-[#E91E63] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full z-10 shadow-sm">
                    Sale
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: `${jutti.accent}` }}>
                    {jutti.type} Collection
                  </span>
                  <h3 className="text-lg font-sans font-semibold tracking-tight mt-1 mb-2 text-[#1a1a1a]">
                    {jutti.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-900/10">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 line-through decoration-gray-300 dark:decoration-gray-600">{jutti.originalPrice}</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">From</span>
                      <span className="font-bold text-xl leading-none text-gray-900 dark:text-white">{jutti.price}</span>
                    </div>
                  </div>
                  <AddToCartButton 
                    item={{
                      id: jutti.id,
                      name: jutti.title,
                      basePrice: parseInt(jutti.price.replace('₹', '')),
                      image: jutti.image
                    }}
                    className="bg-[#1a1a1a] dark:bg-white dark:text-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
          `}} />
        </motion.div>
    </section>
  )
}
