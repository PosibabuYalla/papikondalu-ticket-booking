import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const BASE_URL = 'https://www.papikondalutourism.com'
const OG_IMAGE = 'https://res.cloudinary.com/dnz1dmnmb/image/upload/v1755976642/1b45e060-bfee-4be1-85f4-51c2c6430c70_itqkts.jpg'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Papikondalu Online Ticket Booking | Godavari Boat Tours – Aswini Godavari Travel',
    template: '%s | Papikondalu Tourism',
  },
  description:
    'Book Papikondalu online tickets instantly. Godavari river boat tours from Rajahmundry & Bhadrachalam — Papikondalu hills, Sirivaka night stay, Maredumilli waterfalls, Parnasala & more. Trusted since 2004, 7 lakh+ travellers.',
  keywords: [
    'Papikondalu', 'Papikondalu online ticket booking', 'Papikondalu boat tour',
    'Papikondalu tour package', 'Papikondalu one day tour', 'Papikondalu package price',
    'Godavari river cruise', 'Godavari boat trip Rajahmundry', 'Rajahmundry to Papikondalu',
    'Bhadrachalam Papikondalu tour', 'Sirivaka night stay', 'Maredumilli waterfalls tour',
    'Parnasala tour', 'Perantalapalli boat tour', 'Gudisa hill station',
    'East Godavari tourism', 'Andhra Pradesh river tourism', 'Aswini Godavari Travel',
    'Papikondalu ticket price', 'Papikondalu booking',
  ],
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'Papikondalu Tourism',
    title: 'Papikondalu Online Ticket Booking | Godavari Boat Tours',
    description:
      'Book Papikondalu online tickets instantly. Godavari river boat tours from Rajahmundry & Bhadrachalam. Trusted since 2004, 7 lakh+ travellers.',
    images: [{ url: OG_IMAGE, width: 1920, height: 1080, alt: 'Papikondalu Godavari River Cruise' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papikondalu Online Ticket Booking | Godavari Boat Tours',
    description: 'Book Papikondalu online tickets instantly. Godavari river boat tours from Rajahmundry & Bhadrachalam.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'TouristInformationCenter',
  name: 'Aswini Godavari Travel & Tourism',
  alternateName: 'Papikondalu Tourism',
  url: BASE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  description:
    'Papikondalu online ticket booking and Godavari river boat tours from Rajahmundry and Bhadrachalam. Trusted operator since 2004 serving 7 lakh+ travellers.',
  telephone: '+919848323488',
  email: 'aswinigodavari@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kadali Ghat',
    addressLocality: 'Rajahmundry',
    addressRegion: 'Andhra Pradesh',
    postalCode: '533101',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 17.0005, longitude: 81.804 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '06:00', closes: '22:00' },
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
  areaServed: ['Rajahmundry', 'Bhadrachalam', 'East Godavari', 'Andhra Pradesh'],
  hasMap: 'https://www.google.com/maps/place/?q=place_id:CXaRKQEsI6o2ECE',
  sameAs: ['https://g.page/r/CXaRKQEsI6o2ECE/review'],
  foundingDate: '2004',
  slogan: 'Papikondalu Online Ticket Booking — Trusted Since 2004',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
        {/* Geo meta — helps local/regional search */}
        <meta name="geo.region" content="IN-AP" />
        <meta name="geo.placename" content="Rajahmundry, Andhra Pradesh" />
        <meta name="geo.position" content="17.0005;81.8040" />
        <meta name="ICBM" content="17.0005, 81.8040" />
        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="antialiased"><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
