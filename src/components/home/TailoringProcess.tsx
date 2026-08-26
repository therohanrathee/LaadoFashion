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
    <section className="py-24 bg-white relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[420px] xl:max-w-[480px] mx-auto lg:ml-0"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/home/process_cutting_fabric.jpg" 
                alt="Master tailor cutting fabric" 
                fill 
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 lg:p-8">
                <div className="max-w-[70%]">
                  <div className="text-[#C5A55A] font-semibold tracking-wider text-xs lg:text-sm mb-2 uppercase">The Art of Tailoring</div>
                  <h3 className="text-white text-2xl lg:text-3xl font-serif leading-snug">Crafted to your exact proportions.</h3>
                </div>
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -right-4 -top-4 lg:-right-6 lg:-top-6 bg-white p-4 lg:p-5 rounded-xl shadow-2xl max-w-[130px] lg:max-w-[150px] border border-gray-100 hidden md:block z-10">
              <div className="text-4xl lg:text-5xl font-serif text-[#E91E63] font-bold mb-1">20+</div>
              <div className="text-[10px] lg:text-xs text-gray-800 font-bold uppercase tracking-wider leading-snug">Years of Experience</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-[#E91E63] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Bespoke Services</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mb-6 leading-tight">
              Not just ready-made. <br/>
              <span className="italic font-light text-gray-500">True Custom Tailoring.</span>
            </h2>
            <p className="text-gray-600 text-base lg:text-lg mb-10 leading-relaxed">
              We bring the premium boutique experience directly to your living room. Our garments aren&apos;t pulled from a rack—they are brought to life from scratch, uniquely patterned and stitched just for you.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#C5A55A]/10 flex items-center justify-center shrink-0">
                      {feature.icon}
                    </div>
                    <h4 className="text-[#1a1a1a] font-semibold text-lg">{feature.title}</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
