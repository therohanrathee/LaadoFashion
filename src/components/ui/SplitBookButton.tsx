'use client'

import { useEnquiry } from '@/context/EnquiryContext'

interface SplitBookButtonProps {
  defaultText?: string
  className?: string
  splitClassName?: string
}

export default function SplitBookButton({ 
  defaultText = 'Book Now',
  className = 'bg-[#E91E63] text-white font-bold text-sm uppercase tracking-wider px-10 py-4 rounded-lg shadow-sm whitespace-nowrap',
}: SplitBookButtonProps) {
  const { openEnquiry } = useEnquiry()

  return (
    <button
      onClick={() => openEnquiry()}
      className={`${className} hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer`}
    >
      {defaultText}
    </button>
  )
}
