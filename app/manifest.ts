import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site';

// mostly used for PWA
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    related_applications: [
      {
        "platform": "play",
        "url": "https://play.google.com/store/apps/details?id=com.example.app",
      }
    ]
  }
}
