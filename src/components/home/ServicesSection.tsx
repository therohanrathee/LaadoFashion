'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const services = [
  {
    title: 'Custom Stitching',
    subtitle: 'Ladies Suits & More',
    description: 'Salwar suits, anarkalis, blouses, and kurta sets tailored to your exact measurements with premium finishing and a perfect fit.',
    price: 'Starting ₹1,500',
    accent: '#E91E63',
    bg: 'bg-gradient-to-br from-[#E91E63]/5 to-[#E91E63]/10',
    border: 'border-[#E91E63]/15',
    hoverBorder: 'hover:border-[#E91E63]/30',
  },
  {
    title: 'Matching Juttis',
    subtitle: 'Complete The Look',
    description: 'Elevate your traditional dress with handcrafted Punjabi juttis, carefully curated to perfectly match your newly stitched outfit.',
    price: 'Starting ₹800',
    accent: '#C5A55A',
    bg: 'bg-gradient-to-br from-[#C5A55A]/5 to-[#C5A55A]/10',
    border: 'border-[#C5A55A]/15',
    hoverBorder: 'hover:border-[#C5A55A]/30',
  },
]

export default function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-28 md:py-36 px-6 bg-[#f5f0ea]">
      <div className="max-w-5xl mx-auto" ref={ref}>
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
            Focused exclusively on masterful tailoring and the perfect matching accessories to complete your look.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              <Link href="/order" className="block group h-full">
                <div className={`relative ${service.bg} rounded-2xl overflow-hidden border ${service.border} ${service.hoverBorder} p-10 h-full flex flex-col justify-between transition-all duration-500 hover:shadow-lg`}>
                  {/* Decorative circle */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border group-hover:scale-150 transition-transform duration-700" style={{ borderColor: `${service.accent}15` }} />

                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: `${service.accent}99` }}>
                      {service.subtitle}
                    </span>
                    <h3 className="text-3xl font-serif font-bold mt-3 mb-4 text-[#1a1a1a]">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-300/30">
                    <span className="font-bold text-sm" style={{ color: service.accent }}>{service.price}</span>
                    <span className="text-gray-400 text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: `${service.accent}99` }}>
                      Book Now →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Full Service List Tags (GBP SEO) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Comprehensive Tailoring Services</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {[
              "All Types of Ladies Suits", "Custom-made clothing", "Suit tailoring", 
              "General Tailoring", "Alterations", "Blouse alterations", 
              "Trouser alterations", "Wedding dress alterations", "Women's clothing alterations"
            ].map((service, i) => (
              <span key={i} className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm rounded-full shadow-sm hover:border-[#C5A55A] hover:text-[#E91E63] transition-colors cursor-default">
                {service}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
