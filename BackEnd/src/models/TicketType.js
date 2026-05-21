import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a ticket name'],
      trim: true,
    },
    nameAr: {
      type: String,
      required: [true, 'Please provide a ticket name'],
      trim: true,
    },
    descriptionAr: {
      type: String,
      required: [true, 'Please provide a ticket description'],
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
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot be greater than 100'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },

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
