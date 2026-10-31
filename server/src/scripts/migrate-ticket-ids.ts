/**
 * One-time migration: re-generates ticketIds for tickets that still
 * have the old "TKT-<UUID>" format, replacing them with the canonical
 * YYYYMMMDD + 4-digit sequence format (e.g. 2025OCT290001).
 *
 * Run once from the server/ directory:
 *   npx ts-node-dev --transpile-only src/scripts/migrate-ticket-ids.ts
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db'
import Ticket from '../models/Ticket'

async function generateTicketId(issuedAt: Date): Promise<string> {
  const yyyy = issuedAt.getFullYear()
  const mmm = issuedAt.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const dd = String(issuedAt.getDate()).padStart(2, '0')
  const prefix = `${yyyy}${mmm}${dd}`

  // Count how many tickets already have this day prefix (after migration)
  const count = await (Ticket as any).countDocuments({ ticketId: { $regex: `^${prefix}` } })
  return `${prefix}${String(count + 1).padStart(4, '0')}`
}

async function run() {
  await connectDB()
  console.log('Connected to database')

  // Find all tickets with old-format IDs (containing a hyphen)
  const oldTickets = await Ticket.find({
    ticketId: { $regex: /^TKT-|^[0-9a-f]{8}-/i },
  }).sort({ issuedAt: 1 })

  console.log(`Found ${oldTickets.length} ticket(s) with old-format IDs`)

  if (oldTickets.length === 0) {
    console.log('Nothing to migrate.')
    await mongoose.disconnect()
    return
  }

  let migrated = 0
  let failed = 0

  for (const ticket of oldTickets) {
    try {
      const newId = await generateTicketId(ticket.issuedAt ?? ticket.createdAt ?? new Date())
      const old = ticket.ticketId
      ticket.ticketId = newId
      // Also update the qrPayload if it contains the old ticketId
      if (ticket.qrPayload?.includes(old)) {
        ticket.qrPayload = ticket.qrPayload.replace(old, newId)
      }
      await ticket.save()
      console.log(`  ${old} → ${newId}`)
      migrated++
    } catch (err: any) {
      console.error(`  Failed for ticket ${ticket._id}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${failed} failed`)
  await mongoose.disconnect()
}

run().catch(err => {
  console.error('Migration error:', err)
  process.exit(1)
})
