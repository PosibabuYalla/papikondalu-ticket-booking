import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PackageDetail from '@/components/packages/PackageDetail'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

async function fetchPackage(slug: string) {
  try {
    const res = await fetch(`${API}/packages/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    const p = data.package
    if (!p) return null
    return {
      name: p.title ?? '',
      subtitle: p.subtitle ?? '',
      duration: p.duration ?? '',
      from: (p.departureLocations ?? [])[0] ?? '',
      capacity: p.maxCapacity ?? 0,
      price: p.adultPrice ?? null,
      season: p.bestSeason ?? '',
      description: p.description ?? '',
      image: p.coverImage || (p.images ?? [])[0] || '',
      highlights: p.highlights ?? [],
      itinerary: p.itinerary ?? [],
      inclusions: p.inclusions ?? [],
      exclusions: p.exclusions ?? [],
      policy: p.cancellationPolicy ?? '',
    }
  } catch {
    return null
  }
}

type Params = Promise<{ slug: string }>

const BASE_URL = 'https://www.papikondalutourism.com'

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const pkg = await fetchPackage(slug)
  if (!pkg) return { title: 'Package Not Found' }
  const title = `${pkg.name} | Papikondalu Online Ticket Booking`
  const description = pkg.description.slice(0, 160)
  const url = `${BASE_URL}/packages/${slug}`
  return {
    title,
    description,
    keywords: [
      pkg.name, 'Papikondalu', 'Papikondalu online ticket booking',
      'Papikondalu tour package', 'Godavari boat tour', pkg.from,
      'Papikondalu ticket price', 'Andhra Pradesh tourism',
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: pkg.image ? [{ url: pkg.image, alt: pkg.name }] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: pkg.image ? [pkg.image] : [] },
  }
}

export default async function PackageDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const pkg = await fetchPackage(slug)

  const touristTripSchema = pkg ? {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.name,
    description: pkg.description.slice(0, 300),
    image: pkg.image,
    touristType: 'Family, Adventure, Pilgrimage',
    itinerary: { '@type': 'ItemList', itemListElement: pkg.itinerary.map((item: string, i: number) => ({ '@type': 'ListItem', position: i + 1, name: item })) },
    offers: pkg.price ? {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/packages/${slug}`,
    } : undefined,
    provider: {
      '@type': 'TouristInformationCenter',
      name: 'Aswini Godavari Travel & Tourism',
      url: BASE_URL,
      telephone: '+919848323488',
    },
  } : null

  return (
    <>
      {touristTripSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }} />
      )}
      <Navbar />
      <main className="pt-20">
        <PackageDetail slug={slug} pkg={pkg} />
      </main>
      <Footer />
    </>
  )
}
