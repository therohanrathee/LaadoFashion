'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Scissors, Ruler, Sparkles, Shirt } from 'lucide-react'

const features = [
  {
    icon: <Ruler className="w-6 h-6 text-[#C5A55A]" />,
    title: "Precision Measurement",
    description: "Our experts take over 20+ exact body measurements at your home to ensure a flawless bespoke fit."
  },
  {
    icon: <Scissors className="w-6 h-6 text-[#C5A55A]" />,
    title: "Master Cutting",
    description: "Every fabric is hand-cut by master craftsmen following traditional techniques honed over decades."
  },
  {
    icon: <Shirt className="w-6 h-6 text-[#C5A55A]" />,
    title: "Custom Styling",
    description: "From neckline depth to button styles, every element is tailored exactly to your personal preferences."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-[#C5A55A]" />,
    title: "Fine Stitching",
    description: "Premium threads and meticulous hand-stitching guarantee durability and an elegant finish."
  }
]

export default function TailoringProcess() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-[#0a0a0a] relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        
        {/* Mobile Title (Appears above the image) */}
        <div className="lg:hidden text-center mb-10">
          <span className="text-[#E91E63] text-xs font-semibold uppercase tracking-[0.2em] mb-3 block">Bespoke Services</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a1a1a] dark:text-white leading-tight">
            Not just ready-made. <br/>
            <span className="italic font-light text-gray-500 dark:text-gray-400">True Custom Tailoring.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          {/* Left Column: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[380px] sm:max-w-[420px] xl:max-w-[480px] mx-auto lg:ml-0"
          >
            <div className="relative aspect-[4/5] rounded-3xl lg:rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/home/process_cutting_fabric.jpg" 
                alt="Master tailor cutting fabric" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 lg:p-8">
                <div className="max-w-[85%] lg:max-w-[70%]">
                  <div className="text-[#C5A55A] font-semibold tracking-wider text-xs lg:text-sm mb-2 uppercase">The Art of Tailoring</div>
                  <h3 className="text-white text-xl lg:text-3xl font-serif leading-snug">Crafted to your exact proportions.</h3>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -right-2 -top-4 sm:-right-4 sm:-top-4 lg:-right-6 lg:-top-6 bg-white dark:bg-[#1a1a1a] p-3 sm:p-4 lg:p-5 rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl border border-gray-100 dark:border-white/10 z-10">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E91E63] font-bold mb-0.5 lg:mb-1">20+</div>
              <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-800 dark:text-gray-300 font-bold uppercase tracking-wider leading-tight">Years of Experience</div>
            </div>
          </motion.div>

          {/* Right Column: Text & Features */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 lg:mt-0"
          >
            {/* Desktop Title */}
            <div className="hidden lg:block">
              <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Bespoke Services</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-6 leading-tight">
                Not just ready-made. <br/>
                <span className="italic font-light text-gray-500 dark:text-gray-400">True Custom Tailoring.</span>
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-base lg:text-lg mb-10 leading-relaxed text-center lg:text-left">
              We bring the premium boutique experience directly to your living room. Our garments aren&apos;t pulled from a rack—they are brought to life from scratch, uniquely patterned and stitched just for you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-x-8 lg:gap-y-10">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 lg:flex-col items-start lg:items-stretch bg-gray-50/50 dark:bg-white/5 lg:bg-transparent lg:dark:bg-transparent p-4 rounded-2xl lg:p-0 lg:rounded-none border border-gray-100/50 dark:border-white/5 lg:border-none lg:dark:border-none">
                  <div className="w-12 h-12 lg:w-10 lg:h-10 rounded-full bg-[#C5A55A]/10 flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-[#1a1a1a] dark:text-white font-semibold text-base lg:text-lg mb-1 lg:mb-3 mt-0.5 lg:mt-0">{feature.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
