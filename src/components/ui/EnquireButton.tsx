'use client'

import { useEnquiry, InterestedItem } from '@/context/EnquiryContext'
import { motion, AnimatePresence } from 'framer-motion'

interface EnquireButtonProps {
  item: InterestedItem
  className?: string
  children?: React.ReactNode
}

export default function EnquireButton({ item, className = '', children }: EnquireButtonProps) {
  const { openEnquiry } = useEnquiry()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openEnquiry(item)
  }

  return (
    <button 
      onClick={handleClick}
      className={className}
    >
      {children || 'Enquire Now'}
    </button>
  )
}
