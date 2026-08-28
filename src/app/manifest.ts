import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Laado Fashion & Boutique',
    short_name: 'Laado Fashion',
    description: 'Bespoke Custom Tailoring at Your Doorstep in Gurugram.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#E91E63',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
