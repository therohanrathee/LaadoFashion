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

  // Robust scroll listener to track active index based on visual center
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    
    // Get precise viewport coordinates
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    const cards = container.querySelectorAll('.carousel-card')
    let closestIndex = 0
    let minDistance = Infinity

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const distance = Math.abs(containerCenter - cardCenter)
      
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })

    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex)
    }
  }, [activeIndex])

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial calculation
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Auto-scroller
  const isPlaying = isInView && !isHovered && !userPaused

  useEffect(() => {
    if (!isPlaying || !scrollRef.current) return

    const timer = setTimeout(() => {
      if (!scrollRef.current) return
      
      const container = scrollRef.current
      const cards = container.querySelectorAll('.carousel-card')
      const nextIndex = (activeIndex + 1) % steps.length
      
      if (cards[nextIndex]) {
        // Calculate the exact distance to scroll to center the next card
        const containerRect = container.getBoundingClientRect()
        const containerCenter = containerRect.left + containerRect.width / 2
        
        const cardRect = cards[nextIndex].getBoundingClientRect()
        const cardCenter = cardRect.left + cardRect.width / 2
        
        const scrollDistance = cardCenter - containerCenter
        
        container.scrollBy({
          left: scrollDistance,
          behavior: 'smooth'
        })
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [activeIndex, isPlaying])

  const togglePause = () => setUserPaused(!userPaused)

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-[#0a0a0a] overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 relative z-20" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">The Tailoring Process</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mt-4 mb-4">How Doorstep Tailoring Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            From fabric selection to free doorstep delivery in Gurugram — your custom stitched garment in four seamless steps.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full relative z-20"
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
          
          {steps.map((step, i) => {
            const isTextBottom = i === 0 || i === 2
            
            return (
            <div 
              key={i}
              data-index={i}
              className="carousel-card relative snap-center shrink-0 w-[85vw] sm:w-[350px] lg:w-[380px] xl:w-[420px] h-[450px] lg:h-[520px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100/10"
            >
              {/* Background Image */}
              <Image 
                src={step.image} 
                alt={step.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 1024px) 85vw, 420px"
              />
              
              {/* Cinematic Gradient */}
              <div className={`absolute inset-0 ${isTextBottom ? 'bg-gradient-to-t from-black/95 via-black/40 to-transparent' : 'bg-gradient-to-b from-black/95 via-black/40 to-transparent'} transition-colors duration-500 group-hover:from-black`} />

              {/* Text Area */}
              <div className={`absolute inset-x-0 ${isTextBottom ? 'bottom-0 justify-end' : 'top-0 justify-start'} p-8 lg:p-10 flex flex-col`}>
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-[#C5A55A] font-serif text-3xl lg:text-4xl font-bold">{step.number}</span>
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white leading-tight">{step.title}</h3>
                </div>
                {i !== 3 && (
                  <p className="text-gray-200 text-sm lg:text-base leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          )})}
        </div>

        {/* Apple-style Progress Indicator */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-4 bg-gray-200/50 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-full">
            <button 
              onClick={togglePause}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none"
              aria-label={userPaused ? "Play carousel" : "Pause carousel"}
            >
              {userPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>
            <div className="flex gap-2 items-center">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className="h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden transition-all duration-300" 
                  style={{ width: activeIndex === idx ? '32px' : '8px' }}
                >
                  {activeIndex === idx && isPlaying && (
                    <motion.div 
                      key={`progress-${idx}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4, ease: 'linear' }}
                      className="h-full bg-gray-600 dark:bg-gray-300"
                    />
                  )}
                  {activeIndex === idx && !isPlaying && (
                    <div className="h-full w-full bg-gray-600 dark:bg-gray-300" />
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
