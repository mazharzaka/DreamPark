import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Attraction name is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    minHeight: {
      type: Number,
      min: [0, 'Minimum height cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['Operating', 'Maintenance', 'Closed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Operating',
    },
    waitingTime: {
      type: Number,
      min: [0, 'Waiting time cannot be negative'],
    },
    isFastTrack: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Attraction = mongoose.model('Attraction', attractionSchema);

export default Attraction;
