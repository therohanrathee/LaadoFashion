'use client'

import Navbar from '@/components/home/Navbar'
import HeroSection from '@/components/home/HeroSection'
import HowItWorks from '@/components/home/HowItWorks'
import ServicesSection from '@/components/home/ServicesSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/home/Footer'
import ThreadAnimation from '@/components/home/ThreadAnimation'
import TailoringProcess from '@/components/home/TailoringProcess'
import HorizontalCatalog from '@/components/home/HorizontalCatalog'
import { fetchCatalogItems } from '@/app/actions/catalog'
import { useState, useEffect } from 'react'

export default function Home() {
  const [womensCatalog, setWomensCatalog] = useState<any[]>([])
  const [mensCatalog, setMensCatalog] = useState<any[]>([])
  
  useEffect(() => {
    async function loadCatalog() {
      const catalog = await fetchCatalogItems()
      // Hide inactive items UNLESS they are Juttis
      const visibleCatalog = catalog.filter(item => item.isActive || item.name.toLowerCase().includes('jutti'))
      setWomensCatalog(visibleCatalog.filter(item => item.category === 'Women'))
      setMensCatalog(visibleCatalog.filter(item => item.category === 'Men'))
    }
    loadCatalog()
  }, [])

  return (
    <div className="relative bg-background">
      {/* Sticky navigation */}
      <Navbar />

      {/* Page wrapper — thread lives inside this so it scrolls with the page */}
      <div className="relative">
        {/* The thread SVG draws as the user scrolls — sits inside the page flow */}
        <ThreadAnimation />

        {/* Page sections */}
        <main className="relative">
          <HeroSection />
          <TailoringProcess />
          <HowItWorks />
          
          <HorizontalCatalog 
            title="Women's Tailoring"
            subtitle="Exquisite Designs"
            description="Our top picks of beautifully crafted women's wear."
            items={womensCatalog}
            bgClass="bg-[#FAF8F5] dark:bg-[#0a0a0a]"
            accentColor="#E91E63"
          />
          
          <HorizontalCatalog 
            title="Men's Tailoring"
            subtitle="Sharp & Sophisticated"
            description="Premium tailored formal and traditional menswear."
            items={mensCatalog}
            bgClass="bg-white dark:bg-[#141414]"
            accentColor="#C5A55A"
          />

          <ServicesSection />
          <ReviewsSection />
          <CTASection />
        </main>
      </div>

      <Footer />
    </div>
  )
}
