# Data Model Specifications: Hybrid Authentication

## 1. User Model

**Location**: `BackEnd/src/models/User.js`

We will modify the Mongoose schema for the `User` collection. All validation rules that made user profile details mandatory are relaxed or made conditional to support guest/OTP-only checkout.

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false, // Made optional (was required)
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Made optional (was required based on providers)
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: false, // Made optional
      validate: {
        validator: function (el) {
          // Validate only if a password is being set/modified
          if (!this.isModified('password') || !el) return true;
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false, // Made optional (was required)
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      required: false, // Made optional (was required)
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
      required: false, // Made optional (was required)
    },
    address: {
      type: String,
      required: false, // Made optional (was required)
    },
    role: {
      type: String,
      enum: ["USER", "MARKETING_AGENT", "FINANCIAL_MANAGER", "ADMIN", "customer", "staff", "admin"],
      default: "USER",
      uppercase: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    linkedProviders: [
      {
        provider: { type: String, required: true },
        providerId: { type: String, required: true },
      },
    ],
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
```

---

## 2. OtpToken Model

**Location**: `BackEnd/src/models/OtpToken.js`

We will modify the `OtpToken` schema to add support for OTP-based checking out of guest accounts.

```javascript
const otpTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false // Made optional (was required)
  },
  email: {
    type: String,
    required: true // Added to identify OTP records for unregistered guests
  },
  purpose: {
    type: String,
    enum: ['account_activation', 'password_reset', 'login_otp'], // Added 'login_otp'
    required: true
  },
  codeHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // TTL index
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

// Compound indexes
otpTokenSchema.index({ email: 1, purpose: 1 });
otpTokenSchema.index({ userId: 1, purpose: 1 });
```
