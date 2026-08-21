'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Home Measurement',
    description: 'No need to visit a tailor. Our runner comes to your doorstep to take precise measurements.',
    icon: '📐',
  },
  {
    title: 'Custom Add-ons',
    description: 'Lace borders, zigzag sleeves, embroidery — customise every detail exactly how you want it.',
    icon: '✨',
  },
  {
    title: 'Live Order Tracking',
    description: 'Track your garment\'s journey from measurement to stitching to delivery in real-time.',
    icon: '📍',
  },
  {
    title: 'Perfect Fit Guarantee',
    description: 'Not happy with the fit? We take it back and alter it until it\'s perfect. No questions asked.',
    icon: '🎯',
  },
  {
    title: 'Transparent Pricing',
    description: 'See the full cost upfront — base price plus selected add-ons. No hidden charges.',
    icon: '💰',
  },
  {
    title: 'Trusted Tailors',
    description: 'Our master tailors bring decades of expertise. Every stitch is a mark of quality.',
    icon: '🪡',
  },
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-28 md:py-36 px-6 bg-white">
      <div className="max-w-6xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Why Laado</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-dark mt-4 mb-6">
            Built Around You
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            Every feature of our service is designed to make bespoke tailoring effortless.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-gold/30 bg-cream/50 hover:bg-cream transition-all duration-400 hover:shadow-md"
            >
              <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-lg font-bold text-dark mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
