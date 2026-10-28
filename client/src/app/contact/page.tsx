import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us | Papikondalu Online Ticket Booking & Tour Enquiries',
  description:
    'Contact Aswini Godavari Travel for Papikondalu online ticket booking, tour enquiries, group bookings and cancellations. Call +91 98483 23488 or WhatsApp — available 6 AM to 10 PM daily from Rajahmundry.',
  keywords: [
    'Papikondalu contact', 'Papikondalu online ticket booking enquiry',
    'Aswini Godavari Travel contact', 'Rajahmundry boat tour booking',
    'Papikondalu group booking', 'Godavari tour enquiry',
  ],
  alternates: { canonical: 'https://www.papikondalutourism.com/contact' },
  openGraph: {
    title: 'Contact Us | Papikondalu Online Ticket Booking',
    description: 'Call or WhatsApp +91 98483 23488 for Papikondalu tour bookings and enquiries. Available 6 AM – 10 PM daily.',
    url: 'https://www.papikondalutourism.com/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
