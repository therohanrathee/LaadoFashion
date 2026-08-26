'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Book Your Order',
    description: 'Select your garment and custom add-ons through our easy booking portal. Share your location to initiate the process effortlessly.',
    image: '/images/home/step_booking.jpg'
  },
  {
    number: '02',
    title: 'Measurement & Pickup',
    description: 'Our assigned runner visits your home at a convenient time. They take your precise measurements and collect your unstitched cloth.',
    image: '/images/home/step_measurement.jpg'
  },
  {
    number: '03',
    title: 'Boutique Tailoring',
    description: 'We bring your fabric back to our boutique where our master tailors meticulously stitch your garment to your exact specifications.',
    image: '/images/home/step_tailoring.jpg'
  },
  {
    number: '04',
    title: 'Delivered in 7 Days',
    description: 'Your perfectly stitched garment is securely packed and delivered right to your doorstep within 7 days, ready for you to wear.',
    image: '/images/home/step_delivery.jpg'
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [userPaused, setUserPaused] = useState(false)

  // Track which card is currently centered in the scroll view
  useEffect(() => {
    if (!scrollRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            setActiveIndex(index)
          }
        })
      },
      {
        root: scrollRef.current,
        threshold: 0.6, // Fire when the card is at least 60% visible
      }
    )

    const cards = scrollRef.current.querySelectorAll('.carousel-card')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  // Auto-scroller
  const isPlaying = isInView && !isHovered && !userPaused

  useEffect(() => {
    if (!isPlaying || !scrollRef.current) return

    const timer = setTimeout(() => {
      if (!scrollRef.current) return
      
      const cards = scrollRef.current.querySelectorAll('.carousel-card')
      const nextIndex = (activeIndex + 1) % steps.length
      
      if (cards[nextIndex]) {
        // Find the offset to center the next card
        const container = scrollRef.current
        const card = cards[nextIndex] as HTMLElement
        const scrollLeftPos = card.offsetLeft - (container.clientWidth / 2) + (card.clientWidth / 2)
        
        container.scrollTo({
          left: scrollLeftPos,
          behavior: 'smooth'
        })
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [activeIndex, isPlaying])

  const togglePause = () => setUserPaused(!userPaused)

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-[#FAF8F5] overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16 relative z-5"
        >
          <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">The Process</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
            From selection to doorstep delivery — your custom garment in four seamless steps.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full relative"
      >
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2))] pb-6 pt-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .flex::-webkit-scrollbar { display: none; }
          `}} />
          
          {steps.map((step, i) => (
            <div 
              key={i}
              data-index={i}
              className="carousel-card snap-center shrink-0 w-[85vw] sm:w-[500px] lg:w-[600px] xl:w-[700px] bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-gray-100 flex flex-col"
            >
              {/* Text Area (Top) */}
              <div className="p-8 lg:p-12 lg:pb-8 flex flex-col flex-grow">
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-[#C5A55A]/40 font-serif text-5xl font-bold">{step.number}</span>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-[#1a1a1a]">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-md">
                  {step.description}
                </p>
              </div>

              {/* Image Area (Bottom) */}
              <div className="relative h-[250px] lg:h-[350px] w-full shrink-0 overflow-hidden group">
                <Image 
                  src={step.image} 
                  alt={step.title} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 85vw, 700px"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Apple-style Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-4 bg-gray-200/50 backdrop-blur-md px-6 py-3 rounded-full">
            <button 
              onClick={togglePause}
              className="text-gray-500 hover:text-gray-900 transition-colors focus:outline-none"
              aria-label={userPaused ? "Play carousel" : "Pause carousel"}
            >
              {userPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>
            <div className="flex gap-2 items-center">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className="h-1.5 rounded-full bg-gray-300 overflow-hidden transition-all duration-300" 
                  style={{ width: activeIndex === idx ? '32px' : '8px' }}
                >
                  {activeIndex === idx && isPlaying && (
                    <motion.div 
                      key={`progress-${idx}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4, ease: 'linear' }}
                      className="h-full bg-gray-600"
                    />
                  )}
                  {activeIndex === idx && !isPlaying && (
                    <div className="h-full w-full bg-gray-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
