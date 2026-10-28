import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/admin/', '/book/confirmed'],
      },
    ],
    sitemap: 'https://www.papikondalutourism.com/sitemap.xml',
  }
}
