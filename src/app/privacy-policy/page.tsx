import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

export const metadata = {
  title: 'Privacy Policy | Laado Fashion & Boutique',
  description: 'Privacy Policy for Laado Fashion & Boutique in Gurugram.'
}

export default function PrivacyPolicy() {
  return (
    <div className="relative bg-background min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 space-y-6">
          <p>At Laado Fashion & Boutique, we take your privacy seriously. This policy explains how we collect and use your information.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We only collect basic information that you provide to us when you submit an inquiry, book a home measurement, or place an order. This includes your Name, Phone Number, and Address/Location.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>The information we collect is used strictly to provide our tailoring services. We use it to call you back, discuss your tailoring needs, schedule home visits, and send you updates about the status of your order.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Data Protection & Sharing</h2>
          <p>We value your trust and privacy. We <strong>never</strong> sell, rent, or share your phone number or personal details with any third-party marketing companies. Your data is kept secure and used only by the Laado Boutique team.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Contact Us</h2>
          <p>If you have any questions about this privacy policy, please contact us at our Ashok Vihar boutique in Gurugram, or call us at +91 97162 99990.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
