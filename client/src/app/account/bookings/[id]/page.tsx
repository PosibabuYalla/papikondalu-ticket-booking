'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, Calendar, Users, MapPin, Phone, Mail,
  CreditCard, AlertCircle, Download, XCircle, Clock, User, Shield
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Passenger = { name: string; ageCategory: 'adult' | 'child'; aadhar: string }

type BookingDetail = {
  _id: string
  bookingRef: string
  bookingStatus: string
  paymentStatus: string
  packageSnapshot: {
    title: string
    departureDate: string
    boardingLocation: string
    duration: string
  }
  adultCount: number
  childCount: number
  leadPassengerName: string
  leadPassengerPhone: string
  leadPassengerEmail: string
  emergencyContact: { name: string; phone: string }
  passengers: Passenger[]
  fareBreakdown: {
    adultPrice: number
    childPrice: number
    adultTotal: number
    childTotal: number
    tax: number
    total: number
  }
  specialRequests: string
  createdAt: string
  holdExpiresAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5 mb-4">
      <h2 className="font-display font-semibold text-ink text-base mb-4 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5">
      <span className="text-sm text-muted flex-shrink-0">{label}</span>
      <span className={`text-sm text-ink font-medium text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`${API}/bookings/my/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d.booking) setBooking(d.booking)
        else setError(d.message ?? 'Booking not found')
      })
      .catch(() => setError('Failed to load booking details'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel() {
    if (!booking) return
    const reason = prompt('Please provide a reason for cancellation (minimum 5 characters):')
    if (!reason || reason.trim().length < 5) return
    setCancelling(true)
    try {
      const r = await fetch(`${API}/bookings/my/${booking._id}/cancel-request`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      const data = await r.json()
      if (r.ok) {
        setBooking(b => b ? { ...b, bookingStatus: 'CANCELLED', cancellationReason: reason } : b)
        alert(data.message ?? 'Booking cancelled.')
      } else {
        alert(data.message ?? 'Cancellation failed')
      }
    } catch { alert('Cancellation failed. Please try again.') }
    finally { setCancelling(false) }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 bg-ivory min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
        </main>
        <Footer />
      </>
    )
  }

  if (error || !booking) {
    return (
      <>
        <Navbar />
        <main className="pt-20 bg-ivory min-h-screen">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-ink mb-2">Booking Not Found</h1>
            <p className="text-muted mb-6">{error || 'This booking does not exist or you do not have access.'}</p>
            <Link href="/account/bookings" className="btn-primary">Back to Bookings</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const depDate = booking.packageSnapshot?.departureDate
  const totalPassengers = (booking.adultCount ?? 0) + (booking.childCount ?? 0)
  const isConfirmed = booking.bookingStatus === 'CONFIRMED'
  const isCancelled = booking.bookingStatus === 'CANCELLED'
  const isUpcoming = depDate ? new Date(depDate) >= new Date(new Date().setHours(0, 0, 0, 0)) : false

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account/bookings" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Bookings
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink leading-snug mb-1">
                {booking.packageSnapshot?.title}
              </h1>
              <div className="font-mono text-sm text-muted">{booking.bookingRef}</div>
            </div>
            <span className={`badge text-sm flex-shrink-0 px-3 py-1 ${STATUS_STYLE[booking.bookingStatus ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
              {(booking.bookingStatus ?? '').replace(/_/g, ' ')}
            </span>
          </div>

          {/* Cancellation notice */}
          {isCancelled && booking.cancellationReason && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <strong>Cancellation reason:</strong> {booking.cancellationReason}
            </div>
          )}

          {/* Trip Summary */}
          <Section title="Trip Details">
            <Row
              label="Departure Date"
              value={depDate
                ? new Date(depDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            />
            <Row label="Boarding Point" value={booking.packageSnapshot?.boardingLocation ?? '—'} />
            <Row label="Duration" value={booking.packageSnapshot?.duration ?? '—'} />
            <Row label="Destination" value="Papikondalu, Andhra Pradesh" />
            <Row label="Total Passengers" value={`${totalPassengers} (${booking.adultCount} adult${booking.adultCount !== 1 ? 's' : ''}${booking.childCount ? `, ${booking.childCount} child${booking.childCount !== 1 ? 'ren' : ''}` : ''})`} />
            {isUpcoming && isConfirmed && (
              <div className="mt-3 flex items-center gap-2 text-teal text-sm font-medium">
                <Clock className="w-4 h-4" />
                Upcoming trip — please arrive 30 minutes before departure
              </div>
            )}
          </Section>

          {/* Lead Passenger */}
          <Section title="Lead Passenger & Contact">
            <Row label="Name" value={booking.leadPassengerName} />
            <Row label="Phone" value={
              <a href={`tel:${booking.leadPassengerPhone}`} className="text-teal hover:underline flex items-center gap-1 justify-end">
                <Phone className="w-3.5 h-3.5" />{booking.leadPassengerPhone}
              </a>
            } />
            <Row label="Email" value={
              <a href={`mailto:${booking.leadPassengerEmail}`} className="text-teal hover:underline flex items-center gap-1 justify-end">
                <Mail className="w-3.5 h-3.5" />{booking.leadPassengerEmail}
              </a>
            } />
          </Section>

          {/* Emergency Contact */}
          {booking.emergencyContact?.name && (
            <Section title="Emergency Contact">
              <Row label="Name" value={booking.emergencyContact.name} />
              <Row label="Phone" value={
                <a href={`tel:${booking.emergencyContact.phone}`} className="text-teal hover:underline flex items-center gap-1 justify-end">
                  <Phone className="w-3.5 h-3.5" />{booking.emergencyContact.phone}
                </a>
              } />
            </Section>
          )}

          {/* Passengers List */}
          {booking.passengers?.length > 0 && (
            <Section title={`Passengers (${booking.passengers.length})`}>
              <div className="space-y-3">
                {booking.passengers.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink text-sm">{p.name || `Passenger ${i + 1}`}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.ageCategory === 'adult' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {p.ageCategory === 'adult' ? 'Adult' : 'Child'}
                        </span>
                      </div>
                      {p.aadhar && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted">
                          <Shield className="w-3 h-3" />
                          Aadhar: {p.aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Fare Breakdown */}
          <Section title="Fare Breakdown">
            {(booking.fareBreakdown?.adultCount ?? booking.adultCount) > 0 && (
              <Row
                label={`Adults (${booking.adultCount} × ₹${(booking.fareBreakdown?.adultPrice ?? 0).toLocaleString('en-IN')})`}
                value={`₹${(booking.fareBreakdown?.adultTotal ?? 0).toLocaleString('en-IN')}`}
              />
            )}
            {(booking.childCount ?? 0) > 0 && (
              <Row
                label={`Children (${booking.childCount} × ₹${(booking.fareBreakdown?.childPrice ?? 0).toLocaleString('en-IN')})`}
                value={`₹${(booking.fareBreakdown?.childTotal ?? 0).toLocaleString('en-IN')}`}
              />
            )}
            {(booking.fareBreakdown?.tax ?? 0) > 0 && (
              <Row label="GST / Tax (5%)" value={`₹${(booking.fareBreakdown?.tax ?? 0).toLocaleString('en-IN')}`} />
            )}
            <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
              <span className="font-bold text-ink">Total Paid</span>
              <span className="font-bold text-xl text-teal">₹{(booking.fareBreakdown?.total ?? 0).toLocaleString('en-IN')}</span>
            </div>
          </Section>

          {/* Special Requests */}
          {booking.specialRequests && (
            <Section title="Special Requests">
              <p className="text-sm text-muted">{booking.specialRequests}</p>
            </Section>
          )}

          {/* Booking Meta */}
          <Section title="Booking Info">
            <Row label="Booking Reference" value={booking.bookingRef} mono />
            <Row label="Payment Status" value={(booking.paymentStatus ?? '').replace(/_/g, ' ')} />
            <Row
              label="Booked On"
              value={booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : '—'}
            />
          </Section>

          {/* Actions */}
          {isConfirmed && (
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/account/tickets"
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" /> View / Download Ticket
              </Link>
              {isUpcoming && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Cancel Booking
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
