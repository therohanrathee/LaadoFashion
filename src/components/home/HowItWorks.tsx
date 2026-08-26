'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const steps = [
  {
    number: '01',
    title: 'Book Your Order',
    description: 'Select your garment and custom add-ons through our easy booking portal. Share your location to initiate the process effortlessly.',
    image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '02',
    title: 'Measurement & Pickup',
    description: 'Our assigned runner visits your home at a convenient time. They take your precise measurements and collect your unstitched cloth.',
    image: 'https://images.unsplash.com/photo-1556228578-8d89cb7acb5a?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '03',
    title: 'Boutique Tailoring',
    description: 'We bring your fabric back to our boutique where our master tailors meticulously stitch your garment to your exact specifications.',
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=800&auto=format&fit=crop'
  },
  {
    number: '04',
    title: 'Delivered in 7 Days',
    description: 'Your perfectly stitched garment is securely packed and delivered right to your doorstep within 7 days, ready for you to wear.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop'
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative z-5"
        >
          <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">The Process</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-6">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            From selection to doorstep delivery — your custom garment in four seamless steps.
          </p>
        </motion.div>

        {/* Vertical visual layout for Desktop, Stacked for Mobile */}
        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl group">
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[#E91E63]/0 group-hover:bg-[#E91E63]/10 transition-colors duration-500" />
              </div>

              {/* Text */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="text-[#C5A55A]/30 font-serif text-8xl font-bold mb-4 leading-none select-none">
                  {step.number}
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#1a1a1a] mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
