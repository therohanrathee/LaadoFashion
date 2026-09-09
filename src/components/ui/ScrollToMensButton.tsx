'use client'

import { useEffect, useState } from 'react'

export default function ScrollToMensButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasMenSection, setHasMenSection] = useState(false)

  useEffect(() => {
    const menSection = document.getElementById('Men')
    if (!menSection) return
    setHasMenSection(true)

    const handleScroll = () => {
      const rect = menSection.getBoundingClientRect()
      // If the top of the Men's section enters the viewport (minus a bit of padding)
      if (rect.top <= window.innerHeight - 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    // Check on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!hasMenSection) return null

  return (
    <a 
      href="#Men" 
      className={`fixed bottom-6 right-6 z-40 bg-[#1a1a1a] dark:bg-white text-white dark:text-black px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <span className="text-sm font-bold font-sans">Go to Men's</span>
      <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </a>
  )
}
