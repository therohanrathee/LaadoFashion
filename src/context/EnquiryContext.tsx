'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface InterestedItem {
  id: string
  name: string
  basePrice: number
  image: string
}

interface EnquiryContextType {
  isDrawerOpen: boolean
  setIsDrawerOpen: (isOpen: boolean) => void
  interestedItem: InterestedItem | null
  setInterestedItem: (item: InterestedItem | null) => void
  openEnquiry: (item?: InterestedItem) => void
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined)

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [interestedItem, setInterestedItem] = useState<InterestedItem | null>(null)

  const openEnquiry = (item?: InterestedItem) => {
    if (item) {
      setInterestedItem(item)
    }
    setIsDrawerOpen(true)
  }

  return (
    <EnquiryContext.Provider value={{ 
      isDrawerOpen, 
      setIsDrawerOpen, 
      interestedItem, 
      setInterestedItem,
      openEnquiry
    }}>
      {children}
    </EnquiryContext.Provider>
  )
}

export function useEnquiry() {
  const context = useContext(EnquiryContext)
  if (context === undefined) {
    throw new Error('useEnquiry must be used within an EnquiryProvider')
  }
  return context
}
