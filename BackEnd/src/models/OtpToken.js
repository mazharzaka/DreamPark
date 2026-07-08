import mongoose from 'mongoose';

const otpTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  email: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['account_activation', 'password_reset', 'login_otp'],
    required: true
  },
  codeHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // TTL index: Document will automatically be deleted at expiresAt
  },
  resendCount: {
    type: Number,
    default: 0
  },
  windowStart: {
    type: Date,
    required: true
  }
});

// Create compound index for faster queries
otpTokenSchema.index({ userId: 1, purpose: 1 });
otpTokenSchema.index({ email: 1, purpose: 1 });

const OtpToken = mongoose.model('OtpToken', otpTokenSchema);

export default OtpToken;
