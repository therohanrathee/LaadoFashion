import type { Metadata, Viewport } from "next";
import "./globals.css";
import { EnquiryProvider } from "@/context/EnquiryContext";
import EnquiryDrawer from "@/components/ui/EnquiryDrawer";
import Script from "next/script";
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://laadofashion.com'), // Adjust this to your actual production domain
  title: {
    template: "%s | Laado Fashion & Boutique Gurugram",
    default: "Laado Fashion & Boutique | Premium Doorstep Tailoring in Gurugram",
  },
  description: "Professional doorstep tailoring services in Gurugram. We specialize in 2-piece suit stitching, Anarkali suits, lehengas, bespoke menswear, and boutique fashion stitching near you.",
  keywords: [
    "Tailor near me", "professional tailoring services near me", "doorstep tailoring near me", 
    "Laado Fashion", "Laado Fashion and Boutique", "Laado Fashion & Boutique", "Laado Boutique",
    "stitching near me", "boutique stitching near me", "custom tailoring Gurugram", 
    "2 piece suit stitching near me", "suit stitching near me", "Anarkali suit stitching near me",
    "Lehenga stitching near me", "Sherwani stitching near me", "Kurta Pajama stitching near me",
    "blouse stitching near me", "bridal blouse stitching", "tuxedo stitching near me",
    "safari suit stitching", "western dress stitching", "online tailor Gurugram",
    "best ladies tailor in Gurugram", "best gents tailor in Gurugram"
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Laado Fashion & Boutique | Premium Doorstep Tailoring",
    description: "Expert tailors brought to your doorstep in Gurugram. Book a home measurement for custom suits, lehengas, and boutique stitching.",
    url: 'https://laadofashion.com',
    siteName: 'Laado Fashion & Boutique',
    images: [
      {
        url: '/images/home/hero_sewing_machine.jpg',
        width: 1200,
        height: 630,
        alt: 'Laado Fashion Premium Tailoring Services',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Laado Fashion & Boutique | Doorstep Tailor",
    description: "Professional custom tailoring and stitching services delivered to your home in Gurugram.",
    images: ['/images/home/hero_sewing_machine.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // JSON-LD Structured Data for LocalBusiness
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Tailor",
    "name": "Laado Fashion & Boutique",
    "image": "https://laadofashion.com/images/home/hero_sewing_machine.jpg",
    "@id": "https://laadofashion.com",
    "url": "https://laadofashion.com",
    "telephone": "+919999999999", // Can be updated with real phone
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Gurugram",
      "addressRegion": "Haryana",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.494207,
      "longitude": 77.025033
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.instagram.com/laadofashion", // placeholders
      "https://www.facebook.com/laadofashion"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "2 Piece Suit Stitching"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Anarkali Suit Stitching"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Bridal Lehenga Stitching"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Doorstep Measurements"
        }
      }
    ]
  };

  return (
    <html lang="en" className="h-full antialiased overflow-x-hidden">
      <head>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <EnquiryProvider>
          {children}
          <EnquiryDrawer />
        </EnquiryProvider>
        <Analytics />
      </body>
    </html>
  );
}
