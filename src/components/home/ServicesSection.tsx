'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const services = [
  {
    title: 'Ladies Suits',
    subtitle: 'Custom Stitching',
    description: 'Salwar suits, anarkalis, and kurta sets tailored to your exact measurements with premium finishing.',
    price: 'Starting ₹1,500',
    accent: '#7B1E3A',
    bg: 'bg-gradient-to-br from-[#7B1E3A]/5 to-[#7B1E3A]/10',
    border: 'border-[#7B1E3A]/15',
    hoverBorder: 'hover:border-[#7B1E3A]/30',
  },
  {
    title: 'Juttis',
    subtitle: 'Handcrafted',
    description: 'Traditional Punjabi juttis with modern designs. Hand-embroidered with love and precision.',
    price: 'Starting ₹800',
    accent: '#C5A55A',
    bg: 'bg-gradient-to-br from-[#C5A55A]/5 to-[#C5A55A]/10',
    border: 'border-[#C5A55A]/15',
    hoverBorder: 'hover:border-[#C5A55A]/30',
  },
  {
    title: 'Night Wear',
    subtitle: 'Comfort Collection',
    description: 'Soft and elegant nightwear sets designed for ultimate comfort with beautiful cuts and styling.',
    price: 'Starting ₹1,200',
    accent: '#7B1E3A',
    bg: 'bg-gradient-to-br from-[#e8ddd0]/60 to-[#e8ddd0]/30',
    border: 'border-[#d4c4b0]/30',
    hoverBorder: 'hover:border-[#C5A55A]/30',
  },
]

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-28 md:py-36 px-6 bg-[#f5f0ea]">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">What We Offer</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-6">Our Expertise</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Every garment tells a story. Let us tailor yours with mastery and care.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <Link href="/order" className="block group">
                <div className={`relative ${service.bg} rounded-2xl overflow-hidden border ${service.border} ${service.hoverBorder} p-8 h-[320px] flex flex-col justify-between transition-all duration-500 hover:shadow-lg`}>
                  {/* Decorative circle */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border group-hover:scale-150 transition-transform duration-700" style={{ borderColor: `${service.accent}15` }} />

                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: `${service.accent}99` }}>
                      {service.subtitle}
                    </span>
                    <h3 className="text-2xl font-serif font-bold mt-2 mb-3 text-[#1a1a1a]">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                    <span className="font-bold text-sm" style={{ color: service.accent }}>{service.price}</span>
                    <span className="text-gray-400 text-sm group-hover:translate-x-1 transition-transform" style={{ color: `${service.accent}88` }}>
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Gender Neutral callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 bg-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 shadow-sm"
        >
          <div>
            <span className="text-[#C5A55A] text-xs uppercase tracking-[0.2em] font-semibold">Also Available</span>
            <h3 className="text-2xl font-serif font-bold text-[#1a1a1a] mt-2">Gender Neutral T-shirts & Lowers</h3>
            <p className="text-gray-500 mt-2">Comfortable, stylish, and designed for everyone. Ready to wear collection.</p>
          </div>
          <Link 
            href="/order"
            className="shrink-0 bg-[#1a1a1a] text-white font-semibold text-sm px-8 py-3.5 rounded-lg hover:bg-[#333] transition-all"
          >
            Explore Collection
          </Link>
        </motion.div>

        {/* Full Service List Tags (GBP SEO) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Comprehensive Tailoring Services</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "All Types of Ladies Suits", "Custom-made clothing", "Suit tailoring", 
              "General Tailoring", "Alterations", "Blouse alterations", 
              "Trouser alterations", "Wedding dress alterations", "Women's clothing alterations"
            ].map((service, i) => (
              <span key={i} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-full shadow-sm hover:border-[#C5A55A] hover:text-[#7B1E3A] transition-colors cursor-default">
                {service}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
