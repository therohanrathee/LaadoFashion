'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CatalogItem } from '@/app/order/catalogData'
import ProductCard from '@/components/cart/ProductCard'

interface HorizontalCatalogProps {
  title: string
  subtitle: string
  description: string
  items: CatalogItem[]
  bgClass?: string
  accentColor?: string
}

export default function HorizontalCatalog({ title, subtitle, description, items, bgClass = "bg-[#FAF8F5]", accentColor = "#E91E63" }: HorizontalCatalogProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className={`relative pt-24 pb-12 overflow-hidden ${bgClass}`} ref={ref}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-12 px-6 relative z-20"
      >
        <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: accentColor }}>{subtitle}</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-4">{title}</h2>
        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed inline-block px-4 py-1 rounded-full">
          {description}
        </p>
      </motion.div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="w-full relative z-20"
      >
        <div className="flex overflow-x-auto gap-6 px-6 md:px-12 lg:px-24 pb-12 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {items.map((item) => (
            <div key={item.id} className="shrink-0 w-[280px] md:w-[320px] snap-center relative z-20">
              <ProductCard item={item} />
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
