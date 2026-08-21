'use client'

import Navbar from '@/components/home/Navbar'
import HeroSection from '@/components/home/HeroSection'
import HowItWorks from '@/components/home/HowItWorks'
import ServicesSection from '@/components/home/ServicesSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CTASection from '@/components/home/CTASection'
import Footer from '@/components/home/Footer'
import ThreadAnimation from '@/components/home/ThreadAnimation'

export default function Home() {
  return (
    <div className="relative bg-[#FAF8F5]">
      {/* Sticky navigation */}
      <Navbar />

      {/* Page wrapper — thread lives inside this so it scrolls with the page */}
      <div className="relative">
        {/* The thread SVG draws as the user scrolls — sits inside the page flow */}
        <ThreadAnimation />

        {/* Page sections — z-index 2 so content is above thread */}
        <main className="relative" style={{ zIndex: 2 }}>
          <HeroSection />
          <HowItWorks />
          <ServicesSection />
          <FeaturesSection />
          <CTASection />
        </main>
      </div>

      <Footer />
    </div>
  )
}
