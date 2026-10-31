'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Loader2, BookOpen, Calendar, Users, MapPin, ChevronRight } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1'

type Booking = {
  _id: string
  bookingRef: string
  packageSnapshot: {
    title: string
    departureDate: string
    boardingLocation: string
    duration: string
  }
  adultCount: number
  childCount: number
  bookingStatus: string
  fareBreakdown: { total: number }
  holdExpiresAt?: string
  createdAt: string
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  EXPIRED: 'bg-gray-100 text-gray-500',
  PAYMENT_PENDING: 'bg-orange-100 text-orange-700',
}

function isUpcoming(b: Booking): boolean {
  const dep = b.packageSnapshot?.departureDate
  if (!dep) return false
  return new Date(dep) >= new Date(new Date().setHours(0, 0, 0, 0))
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    fetch(`${API}/bookings/my`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setBookings(d.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeBookings = bookings.filter(b => !['CANCELLED', 'EXPIRED'].includes(b.bookingStatus))
  const upcoming = activeBookings.filter(b => isUpcoming(b)).sort(
    (a, b) => new Date(a.packageSnapshot.departureDate).getTime() - new Date(b.packageSnapshot.departureDate).getTime()
  )
  const past = activeBookings.filter(b => !isUpcoming(b)).sort(
    (a, b) => new Date(b.packageSnapshot.departureDate).getTime() - new Date(a.packageSnapshot.departureDate).getTime()
  )
  const cancelled = bookings.filter(b => ['CANCELLED', 'EXPIRED'].includes(b.bookingStatus))

  const shownList = tab === 'upcoming' ? upcoming : [...past, ...cancelled]

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-ivory min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-muted text-sm mb-6 hover:text-ink">
            <ArrowLeft className="w-4 h-4" /> My Account
          </Link>
          <h1 className="font-display text-3xl font-bold text-ink mb-6">My Bookings</h1>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
            {(['upcoming', 'past'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t ? 'bg-white shadow text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past & Cancelled (${past.length + cancelled.length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>
          ) : shownList.length === 0 ? (
            <div className="card p-10 text-center">
              <BookOpen className="w-14 h-14 text-muted/30 mx-auto mb-4" />
              <h2 className="font-display font-bold text-ink text-xl mb-2">
                {tab === 'upcoming' ? 'No upcoming trips' : 'No past trips'}
              </h2>
              <p className="text-muted mb-6">
                {tab === 'upcoming' ? 'Start your Papikondalu adventure by booking a tour.' : 'Your completed trips will appear here.'}
              </p>
              {tab === 'upcoming' && <Link href="/packages" className="btn-primary">Browse Packages</Link>}
            </div>
          ) : (
            <div className="space-y-3">
              {shownList.map(bk => {
                const totalPassengers = (bk.adultCount ?? 0) + (bk.childCount ?? 0)
                const depDate = bk.packageSnapshot?.departureDate
                const isPast = !isUpcoming(bk)

                return (
                  <Link
                    key={bk._id}
                    href={`/account/bookings/${bk._id}`}
                    className={`card p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group ${isPast ? 'opacity-80' : ''}`}
                  >
                    {/* Date block */}
                    <div className={`flex-shrink-0 rounded-xl px-3 py-2 text-center min-w-[56px] ${isPast ? 'bg-gray-100' : 'bg-teal/10'}`}>
                      {depDate ? (
                        <>
                          <div className={`text-xs font-semibold uppercase ${isPast ? 'text-muted' : 'text-teal'}`}>
                            {new Date(depDate).toLocaleDateString('en-IN', { month: 'short' })}
                          </div>
                          <div className={`text-2xl font-bold leading-tight ${isPast ? 'text-muted' : 'text-teal'}`}>
                            {new Date(depDate).getDate()}
                          </div>
                          <div className={`text-xs ${isPast ? 'text-muted/70' : 'text-teal/70'}`}>
                            {new Date(depDate).getFullYear()}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-muted">—</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="font-display font-semibold text-ink text-base leading-snug">
                          {bk.packageSnapshot?.title ?? '—'}
                        </div>
                        <span className={`badge text-xs flex-shrink-0 ${STATUS_STYLE[bk.bookingStatus ?? ''] ?? 'bg-gray-100 text-gray-700'}`}>
                          {(bk.bookingStatus ?? '').replace('_', ' ')}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-muted mb-2">{bk.bookingRef}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {depDate
                            ? new Date(depDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
                            : '—'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {bk.packageSnapshot?.boardingLocation ?? '—'}
                        </span>
                      </div>
                    </div>

                    {/* Amount + arrow */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="font-bold text-teal">₹{(bk.fareBreakdown?.total ?? 0).toLocaleString('en-IN')}</div>
                      <ChevronRight className="w-4 h-4 text-muted group-hover:text-teal transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
