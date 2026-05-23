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
      required: [true, 'Please provide a ticket name in Arabic'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['INDIVIDUAL', 'GROUP'],
      required: [true, 'Please provide a ticket category'],
      default: 'INDIVIDUAL',
    },
    icon: {
      type: String,
      default: 'Ticket',
    },
    color: {
      type: String,
      default: '#b5161e',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a ticket price'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: [String],
      default: [],
    },
    descriptionAr: {
      type: [String],
      default: [],
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
