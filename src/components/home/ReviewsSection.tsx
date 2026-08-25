'use client'

import { motion } from 'framer-motion'

const REVIEWS = [
  {
    name: 'Priya Sharma',
    date: '2 weeks ago',
    text: 'Absolutely brilliant service! The runner came exactly on time for measurements, and the stitching quality of my Anarkali suit is flawless. Will definitely order again.',
    rating: 5,
  },
  {
    name: 'Anjali Desai',
    date: '1 month ago',
    text: 'I was skeptical about online tailoring, but Laado Boutique changed my mind. Perfect fit on the very first try without any alterations needed. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Simran Kaur',
    date: '3 weeks ago',
    text: 'Loved the convenience. I didn\'t have to step out of my house. The team is very professional and the delivery was prompt. The finishing on my blouse is beautiful.',
    rating: 5,
  },
  {
    name: 'Neha Gupta',
    date: '2 months ago',
    text: 'Great experience! The bespoke tailoring service is a lifesaver for working women like me. The fabric handling and embroidery work is top-notch.',
    rating: 4,
  },
  {
    name: 'Kritika Verma',
    date: '1 week ago',
    text: 'Superb fitting and very polite staff. The tailor perfectly understood the neck design I wanted for my Kurti. It looks amazing.',
    rating: 5,
  },
  {
    name: 'Megha Singh',
    date: '3 months ago',
    text: 'Premium quality stitching at reasonable prices. The home measurement service is the best part. No more multiple trips to the tailor!',
    rating: 5,
  },
]

// Duplicate the array to create a seamless infinite loop
const SCROLLING_REVIEWS = [...REVIEWS, ...REVIEWS]

export default function ReviewsSection() {
  return (
    <section className="relative py-24 bg-[#FAF8F5] overflow-hidden">
      <div className="relative z-5 max-w-7xl mx-auto px-6 mb-12 text-center">
        <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-[0.2em]">Testimonials</span>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1a1a1a] mt-4 mb-4">
          Loved by Our Customers
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          See what our clients have to say about their custom tailoring experience with us.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative z-20 w-full flex overflow-hidden">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
        
        {/* Right Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 40,
            ease: 'linear',
            repeat: Infinity,
          }}
          className="flex gap-6 w-max px-4"
        >
          {SCROLLING_REVIEWS.map((review, index) => (
            <div 
              key={index} 
              className="w-80 md:w-96 shrink-0 bg-white/30 backdrop-blur-2xl border border-white/50 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63] font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{review.name}</h3>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
                {/* Google "G" Logo Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
