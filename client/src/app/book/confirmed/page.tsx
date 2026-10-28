import type { Metadata } from 'next'
import ConfirmedClient from './ConfirmedClient'

export const metadata: Metadata = {
  title: 'Booking Confirmed | Papikondalu Tour Ticket',
  description: 'Your Papikondalu online ticket booking is confirmed. Check your email for your digital ticket and QR code.',
  robots: { index: false, follow: false },
}

export default function ConfirmedPage() {
  return <ConfirmedClient />
}
