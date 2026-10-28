import type { Metadata } from 'next'
import BookClient from './BookClient'

export const metadata: Metadata = {
  title: 'Book Papikondalu Tour | Online Ticket Booking – Secure & Instant',
  description:
    'Book your Papikondalu online ticket in 5 easy steps. Select package, choose date, fill passenger details and pay securely via UPI, card or net banking. Instant confirmation.',
  keywords: [
    'Papikondalu online ticket booking', 'book Papikondalu tour', 'Papikondalu ticket',
    'Godavari boat tour booking', 'Rajahmundry tour booking online',
  ],
  alternates: { canonical: 'https://www.papikondalutourism.com/book' },
  robots: { index: false, follow: false },
}

export default function BookPage() {
  return <BookClient />
}
