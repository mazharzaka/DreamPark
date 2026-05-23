import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
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
      required: [
        function () {
          return !this.linkedProviders || this.linkedProviders.length === 0;
        },
        "Please provide a password",
      ],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [
        function () {
          return !this.linkedProviders || this.linkedProviders.length === 0;
        },
        "Please provide a password confirmation",
      ],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      required: [true, "Please specify your gender"],
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Please provide your date of birth"],
    },
    address: {
      type: String,
      required: [true, "Please provide your address"],
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff", "MARKETING_AGENT"],
      default: "customer",
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
  // 1) تشفير الباسورد فقط لو حصل لها تعديل أو لسه بتتكريه
  if (!this.isModified('password')) return;

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
