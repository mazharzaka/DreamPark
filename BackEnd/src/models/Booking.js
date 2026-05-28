import mongoose from 'mongoose';
import crypto from 'crypto';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    ticketTypeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'TicketType',
      required: [true, 'Booking must belong to a ticket type'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Please specify the target date for the visit'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    qrCodeId: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
    },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'SCANNING', 'PAID', 'USED', 'EXPIRED', 'CANCELLED'],
      default: 'PENDING_PAYMENT',
      uppercase: true,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    lockedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: [1, 'Quantity must be at least 1'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Booking must have a contact phone number'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
