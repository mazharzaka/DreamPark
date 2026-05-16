import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: [true, 'Page key is required'],
      trim: true,
    },
    name_en: {
      type: String,
      required: [true, 'English attraction name is required'],
      trim: true,
    },
    name_ar: {
      type: String,
      required: [true, 'Arabic attraction name is required'],
      trim: true,
    },
    name: { // Deprecated: Use name_en / name_ar
      type: String,
      trim: true,
    },
    title: { // Support title explicitly if name is different
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    description_en: {
      type: String,
      trim: true,
    },
    description_ar: {
      type: String,
      trim: true,
    },
    description: { // Deprecated: Use description_en / description_ar
      type: String,
      trim: true,
    },
    image: { // Single image for background
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    minHeight: {
      type: String, // "Min: 140cm"
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
      type: String, // "45 MIN"
    },
    isFastTrack: {
      type: Boolean,
      default: false,
    },
    bookPass: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
    tags: [
      {
        label: String,
        variant: {
          type: String,
          enum: ['white', 'dark', 'outline', 'green'],
          default: 'white',
        },
        type: String, // e.g., 'height', 'health', 'items', 'behavior'
        text: String, // rule text
      },
    ],
    layout: {
      colSpan: { type: Number, default: 1 },
      rowSpan: { type: Number, default: 1 },
      customStyle: {
        type: String,
        enum: ['crimson', 'sky', 'nebula', 'amazon', 'phoenix', 'midas'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Attraction = mongoose.model('Attraction', attractionSchema);

export default Attraction;
