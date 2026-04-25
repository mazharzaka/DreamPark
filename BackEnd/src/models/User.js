import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide your phone number'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      required: [true, 'Please specify your gender'],
      enum: ['male', 'female'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide your date of birth'],
    },
    address: {
      type: String,
      required: [true, 'Please provide your address'],
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'staff'],
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
