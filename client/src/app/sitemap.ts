import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.papikondalutourism.com'

// Fallback slugs used if the API is unreachable at build time
const FALLBACK_PACKAGE_SLUGS = [
  'rajahmundry-papikondalu-packages',
  'bhadrachalam-papikondalu-packages',
  'sirivaka-night-stay-package',
  'papikondalu-packages',
  'maredumilli-packages',
  'parnasala-packages',
  'rampachodavaram-waterfalls-tour-package',
  'gudisa-packages',
  'perantalapalli-packages',
]

const BLOG_SLUGS = ['papikondalu-bhadradri-magical-beauty']

async function fetchPackageSlugs(): Promise<string[]> {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'
    const res = await fetch(`${API}/packages?limit=50`, { next: { revalidate: 3600 } })
    if (!res.ok) return FALLBACK_PACKAGE_SLUGS
    const data = await res.json()
    const slugs = (data.packages ?? []).map((p: { slug: string }) => p.slug).filter(Boolean)
    return slugs.length > 0 ? slugs : FALLBACK_PACKAGE_SLUGS
  } catch {
    return FALLBACK_PACKAGE_SLUGS
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const packageSlugs = await fetchPackageSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                    priority: 1.0, changeFrequency: 'weekly',  lastModified: now },
    { url: `${BASE_URL}/packages`,                      priority: 0.9, changeFrequency: 'weekly',  lastModified: now },
    { url: `${BASE_URL}/attractions`,                   priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${BASE_URL}/about`,                         priority: 0.8, changeFrequency: 'monthly', lastModified: now },
    { url: `${BASE_URL}/gallery`,                       priority: 0.7, changeFrequency: 'monthly', lastModified: now },
    { url: `${BASE_URL}/contact`,                       priority: 0.7, changeFrequency: 'yearly',  lastModified: now },
    { url: `${BASE_URL}/faq`,                           priority: 0.6, changeFrequency: 'monthly', lastModified: now },
    { url: `${BASE_URL}/blog`,                          priority: 0.6, changeFrequency: 'weekly',  lastModified: now },
    { url: `${BASE_URL}/cancellation-policy`,           priority: 0.4, changeFrequency: 'yearly',  lastModified: now },
    { url: `${BASE_URL}/refund-policy`,                 priority: 0.3, changeFrequency: 'yearly',  lastModified: now },
    { url: `${BASE_URL}/privacy-policy`,                priority: 0.3, changeFrequency: 'yearly',  lastModified: now },
    { url: `${BASE_URL}/terms-and-conditions`,          priority: 0.3, changeFrequency: 'yearly',  lastModified: now },
  ]

  const packageRoutes: MetadataRoute.Sitemap = packageSlugs.map(slug => ({
    url: `${BASE_URL}/packages/${slug}`,
    priority: 0.9,
    changeFrequency: 'monthly' as const,
    lastModified: now,
  }))

  const blogRoutes: MetadataRoute.Sitemap = BLOG_SLUGS.map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    priority: 0.6,
    changeFrequency: 'yearly' as const,
    lastModified: now,
  }))

  return [...staticRoutes, ...packageRoutes, ...blogRoutes]
}
