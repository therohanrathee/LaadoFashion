import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

export const metadata = {
  title: 'Terms & Conditions | Laado Fashion & Boutique',
  description: 'Terms and Conditions for Laado Fashion & Boutique in Gurugram.'
}

export default function TermsAndConditions() {
  return (
    <div className="relative bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 space-y-6">
          <p>Welcome to Laado Fashion & Boutique. By using our services, you agree to the following terms and conditions.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Our Services</h2>
          <p>We provide custom tailoring, boutique stitching, and doorstep measurement services primarily in Gurugram, Haryana.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Pricing & Payments</h2>
          <p>The prices shown on our website and Rate List are starting/indicative prices. The final price depends on the exact design, fabric, and complexity of the stitching required. An advance payment may be required before the cutting and stitching process begins.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Alterations</h2>
          <p>We strive for the perfect fit. If your custom outfit does not fit as expected upon delivery, we will provide minor alterations to ensure it fits perfectly, provided the issue is raised within a reasonable timeframe after delivery.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Cancellations & Refunds</h2>
          <p>Because custom clothing is stitched exactly to your specific body measurements and design requests, <strong>we cannot offer refunds</strong> once the fabric has been cut and the stitching process has started. Orders cannot be cancelled once production has begun.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Home Visits</h2>
          <p>Our doorstep measurement services are subject to the availability of our master tailors and are limited to specific service areas within Gurugram.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
