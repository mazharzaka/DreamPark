import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a ticket name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a ticket price'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

// To ensure consistent API responses with the previous Prisma setup
// Transform _id to id in JSON outputs
ticketTypeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const TicketType = mongoose.model('TicketType', ticketTypeSchema);

export default TicketType;
