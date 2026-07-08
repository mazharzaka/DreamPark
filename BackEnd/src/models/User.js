import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
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
      required: false,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: false,
      validate: {
        validator: function (el) {
          if (!this.isModified('password') || !el) return true;
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
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

//  الشكل الصحيح والآمن 100%
userSchema.pre('save', async function() {
  // 1) تشفير الباسورد فقط لو حصل لها تعديل أو لسه بتتكريه، وبشرط وجود كلمة مرور غير فارغة
  if (!this.isModified('password') || !this.password) return;

  // 2) عمل هاش للباسورد
  this.password = await bcrypt.hash(this.password, 12);

  // 3) مسح الـ passwordConfirm عشان متتحفظش في الداتابيز (FR-002)
  this.passwordConfirm = undefined; 
  
  // مش محتاجين نكتب ()next طالما الدالة async!
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
