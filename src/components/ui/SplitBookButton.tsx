'use client'

import Link from 'next/link'
import { useState } from 'react'

interface SplitBookButtonProps {
  defaultText?: string
  className?: string
  splitClassName?: string
}

export default function SplitBookButton({ 
  defaultText = 'Book Now',
  className = 'bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-lg shadow-sm whitespace-nowrap',
  splitClassName = 'px-6 py-3 text-sm'
}: SplitBookButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative inline-grid place-items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Original button */}
      <div 
        className={`col-start-1 row-start-1 ${className} transition-opacity duration-150 ease-out ${
          hovered ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
        }`}
      >
        {defaultText}
      </div>

      {/* Split buttons */}
      <div className={`col-start-1 row-start-1 flex gap-3 items-center transition-opacity duration-150 ease-out ${
        hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <Link
          href="/womens"
          prefetch={true}
          className={`bg-[#E91E63] text-white font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-lg whitespace-nowrap transition-transform duration-150 ease-out ${splitClassName} ${
            hovered ? 'translate-x-0' : 'translate-x-4'
          }`}
        >
          Women&apos;s
        </Link>
        <Link
          href="/mens"
          prefetch={true}
          className={`bg-[#1a1a1a] text-white font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-lg whitespace-nowrap transition-transform duration-150 ease-out ${splitClassName} ${
            hovered ? 'translate-x-0' : '-translate-x-4'
          }`}
        >
          Men&apos;s
        </Link>
      </div>
    </div>
  )
}
