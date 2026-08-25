'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ThreadAnimation() {
  const [path, setPath] = useState('')
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const updatePath = () => {
      const w = window.innerWidth
      const h = document.documentElement.scrollHeight
      setDimensions({ w, h })

      // Generate a dynamic path that spans the EXACT pixel height and width of the document.
      let d = `M ${w / 2} 0`
      const steps = Math.max(6, Math.floor(h / 600)) // Dynamic steps based on page height
      const stepY = h / steps

      for (let i = 1; i <= steps; i++) {
        const y = i * stepY
        const prevY = (i - 1) * stepY
        
        // Alternate sweeping from left to right to utilize the full screen estate
        const destX = i % 2 === 1 ? w * 0.85 : w * 0.15
        const startX = i === 1 ? w / 2 : (i % 2 === 1 ? w * 0.15 : w * 0.85)
        
        // Control points for a smooth, wide sweeping curve
        const cp1x = startX
        const cp1y = prevY + stepY * 0.4
        const cp2x = destX
        const cp2y = prevY + stepY * 0.6
        
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${destX} ${y}`
      }
      
      setPath(d)
    }

    updatePath()
    
    const resizeObserver = new ResizeObserver(() => {
      updatePath()
    })
    
    resizeObserver.observe(document.body)
    window.addEventListener('resize', updatePath)
    
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePath)
    }
  }, [])

  const { scrollYProgress } = useScroll()
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001
  })

  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1])

  if (!path) return null

  return (
    <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 10, height: dimensions.h }}>
      {/* 
        Using a raw 1:1 pixel SVG. No viewBox, no scaling, no filters.
        Maximum performance, perfect 1:1 coordinate mapping.
      */}
      <svg
        width={dimensions.w}
        height={dimensions.h}
        className="absolute inset-0"
        fill="none"
      >
        <defs>
          <linearGradient id="thread-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C5A55A" />
            <stop offset="33%" stopColor="#E91E63" />
            <stop offset="66%" stopColor="#C5A55A" />
            <stop offset="100%" stopColor="#E91E63" />
          </linearGradient>
        </defs>

        {/* Clean, simple single thread line per your request */}
        <motion.path
          d={path}
          stroke="url(#thread-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  )
}
