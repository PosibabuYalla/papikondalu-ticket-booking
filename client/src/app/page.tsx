import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import FeaturedPackages from '@/components/home/FeaturedPackages'
import AttractionsSection from '@/components/home/AttractionsSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import FleetSection from '@/components/home/FleetSection'
import ReviewsSection from '@/components/home/ReviewsSection'
import FAQSection from '@/components/home/FAQSection'
import CTASection from '@/components/home/CTASection'

const BASE_URL = 'https://www.papikondalutourism.com'

export const metadata: Metadata = {
  title: 'Papikondalu Online Ticket Booking | Godavari Boat Tours from Rajahmundry & Bhadrachalam',
  description:
    'Book Papikondalu online tickets instantly. Godavari river boat tours from Rajahmundry & Bhadrachalam — Papikondalu hills, Sirivaka night stay, Maredumilli waterfalls, Parnasala & more. Aswini Godavari Travel, trusted since 2004.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Papikondalu Online Ticket Booking | Godavari Boat Tours',
    description: 'Book Papikondalu online tickets instantly. Godavari river boat tours from Rajahmundry & Bhadrachalam. Trusted since 2004, 7 lakh+ travellers.',
    url: BASE_URL,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do I book Papikondalu online tickets?', acceptedAnswer: { '@type': 'Answer', text: 'You can book Papikondalu online tickets directly on papikondalutourism.com. Select your package, choose a date, fill passenger details and pay securely via UPI, card or net banking.' } },
    { '@type': 'Question', name: 'What is the price of Papikondalu tour?', acceptedAnswer: { '@type': 'Answer', text: 'Papikondalu one day tour from Rajahmundry starts at ₹1,500 per person. Bhadrachalam two-day tour starts at ₹2,300 per person. Sirivaka night stay starts at ₹5,200 per person.' } },
    { '@type': 'Question', name: 'What is the best time to visit Papikondalu?', acceptedAnswer: { '@type': 'Answer', text: 'October to March is the best time to visit Papikondalu. The weather is cool, the Godavari river is calm and the scenery is at its most beautiful.' } },
    { '@type': 'Question', name: 'From where does the Papikondalu boat tour depart?', acceptedAnswer: { '@type': 'Answer', text: 'Papikondalu boat tours depart from Rajahmundry (Kadali Ghat) for one-day tours and from Bhadrachalam for two-day temple tours.' } },
    { '@type': 'Question', name: 'Is Papikondalu safe for families?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Life jackets are provided to every passenger. Our crew is trained in river safety and all three boats are regularly certified. Papikondalu tours are suitable for families, senior citizens and children.' } },
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Papikondalu Tourism',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/packages?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturedPackages />
        <AttractionsSection />
        <WhyChooseUs />
        <FleetSection />
        <ReviewsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
