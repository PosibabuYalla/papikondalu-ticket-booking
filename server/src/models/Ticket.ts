import { Schema, model, Document, Types } from 'mongoose'

export interface ITicket extends Document {
  booking: Types.ObjectId
  ticketId: string
  qrPayload: string
  contactName: string
  isValid: boolean
  checkedIn: boolean
  checkedInAt: Date | null
  checkedInBy: Types.ObjectId | null
  checkedInDeparture: Types.ObjectId | null
  invalidatedAt: Date | null
  invalidationReason: string
  issuedAt: Date
}

const TicketSchema = new Schema<ITicket>({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  contactName: { type: String, default: '' },
  ticketId: { type: String },
  qrPayload: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date, default: null },
  checkedInBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  checkedInDeparture: { type: Schema.Types.ObjectId, ref: 'Departure', default: null },
  invalidatedAt: { type: Date, default: null },
  invalidationReason: { type: String, default: '' },
  issuedAt: { type: Date, default: Date.now },
}, { timestamps: true })

TicketSchema.index({ ticketId: 1 }, { unique: true })
TicketSchema.index({ booking: 1 }, { unique: true })

// Generate sequential ticket ID: YYYYMMMDD0001
TicketSchema.pre('save', async function () {
  if (this.ticketId) return
  const now = new Date()
  const yyyy = now.getFullYear()
  const mmm = now.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const dd = String(now.getDate()).padStart(2, '0')
  const prefix = `${yyyy}${mmm}${dd}`
  const count = await (this.constructor as any).countDocuments({ ticketId: { $regex: `^${prefix}` } })
  this.ticketId = `${prefix}${String(count + 1).padStart(4, '0')}`
})

export default model<ITicket>('Ticket', TicketSchema)
