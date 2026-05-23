import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { generateOtp, hashOtp, verifyOtp } from "../utils/otpUtils.js";
import sendEmail from "../utils/sendEmail.js";
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID || 'mock_client_id',
  process.env.GOOGLE_CLIENT_SECRET || 'mock_client_secret',
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  
  // Hash refresh token for DB
  const { hashOtp } = await import("../utils/otpUtils.js"); // Using same hash function for simplicity
  user.refreshTokenHash = await hashOtp(refreshToken);
  await user.save({ validateBeforeSave: false });

  user.password = undefined;

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth'
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

const sendOtpHelper = async (user, purpose, res, next) => {
  try {
    // 1. Check rate limits
    const now = new Date();
    const windowTime = 15 * 60 * 1000; // 15 mins
    let otpRecord = await OtpToken.findOne({ userId: user._id, purpose });

    if (otpRecord) {
      if (now - otpRecord.windowStart < windowTime) {
        if (otpRecord.resendCount >= 3) {
          return next(new AppError("Too many requests. Please try again later.", 429));
        }
        otpRecord.resendCount += 1;
      } else {
        // Reset window
        otpRecord.windowStart = now;
        otpRecord.resendCount = 1;
      }
    } else {
      otpRecord = new OtpToken({
        userId: user._id,
        purpose,
        windowStart: now,
        resendCount: 1,
      });
    }

    // 2. Generate new OTP
    const otp = generateOtp();
    otpRecord.codeHash = await hashOtp(otp);
    otpRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    
    await otpRecord.save();

    // 3. Send Email
    const subject = purpose === 'account_activation' ? 'Dream Park - Account Activation Code' : 'Dream Park - Password Reset Code';
    const message = `Your 6-digit code is: ${otp}. It will expire in 10 minutes.`;
    
    await sendEmail({
      email: user.email,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      data: {
        message: "If the account exists, a code was sent.",
      },
    });
  } catch (error) {
    
    return next(new AppError("There was an error sending the email. Try again later!", 500));
  }
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, phone, phoneNumber, role } = req.body;

  // 1) التأكد من تطابق كلمتي المرور يدوياً قبل أي خطوة في الداتابيز
  if (password !== passwordConfirm) {
    return next(new AppError('كلمتا المرور غير متطابقتين!', 400));
  }

  // 2) التحقق من أن البريد الإلكتروني غير مسجل مسبقاً (Anti-Duplicate Check)
  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    return next(new AppError('هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول.', 400));
  }

  // 3) التحقق من أن رقم الهاتف غير مسجل مسبقاً (إذا تم إرساله)
  const targetPhone = phoneNumber || phone;
  if (targetPhone) {
    const existingUserByPhone = await User.findOne({ phoneNumber: targetPhone });
    if (existingUserByPhone) {
      return next(new AppError('رقم الهاتف هذا مستخدم بالفعل في حساب آخر.', 400));
    }
  }

  // 4) الآن البيانات سليمة 100%؛ نقوم بعمل الـ Save بأمان تام
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm, 
    phoneNumber: targetPhone, 
    profilePicture: req.body.profilePicture,
    gender: req.body.gender || 'male', 
    dateOfBirth: req.body.dateOfBirth || new Date(), 
    address: req.body.address || 'N/A', 
    role: role , 
  });

  // 5) تشغيل الـ OTP والـ Helper هو المسؤول عن إرجاع الـ Response الصافي للفرونت إند
  await sendOtpHelper(newUser, 'account_activation', res, next);
});

export const sendOtp = catchAsync(async (req, res, next) => {
  const { email, purpose } = req.body;
  if (!email || !purpose) {
    return next(new AppError("Please provide email and purpose", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Return same message for anti-enumeration
    return res.status(200).json({
      success: true,
      data: { message: "If the account exists, a code was sent." }
    });
  }

  await sendOtpHelper(user, purpose, res, next);
});

export const verifyOtpController = catchAsync(async (req, res, next) => {
  const { email, code, purpose } = req.body;
  
  if (!email || !code || !purpose) {
    return next(new AppError("Please provide email, code, and purpose", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  const otpRecord = await OtpToken.findOne({ userId: user._id, purpose });
  if (!otpRecord) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  const isValid = await verifyOtp(code, otpRecord.codeHash);
  if (!isValid) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  // OTP verified, delete the record
  await OtpToken.findByIdAndDelete(otpRecord._id);

  if (purpose === 'account_activation') {
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    
    return res.status(200).json({
      success: true,
      data: { message: "Account activated successfully." }
    });
  } else if (purpose === 'password_reset') {
    // For password reset, generate a short-lived token to be used in /reset-password
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return res.status(200).json({
      success: true,
      data: { resetToken }
    });
  }
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (!user.isVerified) {
    return next(new AppError("Please verify your account before logging in", 403));
  }

  createSendToken(user, 200, res);
});


export const refresh = catchAsync(async (req, res, next) => {
  let refreshToken;
  if (req.cookies && req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }

  if (!refreshToken) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 1) Verify token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired session. Please log in again.', 401));
  }

  // 2) Check if user still exists
  const user = await User.findById(decoded.id).select('+refreshTokenHash');
  if (!user) {
    return next(new AppError('The user belonging to this session does no longer exist.', 401));
  }

  // 3) Check if refresh token hash matches
  if (!user.refreshTokenHash) {
    return next(new AppError('Invalid session. Please log in again.', 401));
  }
  
  const { verifyOtp } = await import('../utils/otpUtils.js');
  const isValid = await verifyOtp(refreshToken, user.refreshTokenHash);
  if (!isValid) {
    return next(new AppError('Invalid session. Please log in again.', 401));
  }

  // Issue new tokens (rotates the refresh token)
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth'
  });
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
});


export const resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken, newPassword, newPasswordConfirm } = req.body;

  if (!resetToken || !newPassword || !newPasswordConfirm) {
    return next(new AppError('Please provide resetToken, newPassword, and newPasswordConfirm', 400));
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  // Optional: automatically log them in or just return success
  res.status(200).json({ success: true, data: { message: 'Password reset successful' } });
});


export const getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});


export const googleAuth = (req, res) => {
  if (process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_CLIENT_ID) {
    // Redirect straight to callback for mock flow
    return res.redirect('http://localhost:5000/api/auth/google/callback');
  }
  const url = googleClient.generateAuthUrl({ access_type: 'offline', scope: ['email', 'profile'] });
  res.redirect(url);
};

export const googleCallback = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  
  if (!code && (!process.env.GOOGLE_CLIENT_ID || process.env.NODE_ENV !== 'production')) {
    // For local mocking without a real Google client id
    let user = await User.findOne({ email: 'mockuser@gmail.com' });
    if (!user) {
      user = await User.create({ name: 'Mock User', email: 'mockuser@gmail.com', isVerified: true, password: 'SOCIAL_LOGIN_NO_PASSWORD', passwordConfirm: 'SOCIAL_LOGIN_NO_PASSWORD', linkedProviders: [{ provider: 'google', providerId: '12345' }] });
    }
    const refreshToken = signRefreshToken(user._id);
    const { hashOtp } = await import('../utils/otpUtils.js');
    user.refreshTokenHash = await hashOtp(refreshToken);
    await user.save({ validateBeforeSave: false });
    res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/auth' });
    return res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000/');
  }

  if (!code) {
    return res.redirect((process.env.CLIENT_ORIGIN || 'http://localhost:3000') + '/login?error=auth_failed');
  }

  try {
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);
    const ticket = await googleClient.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, isVerified: true, profilePicture: picture, password: 'SOCIAL_LOGIN_NO_PASSWORD', passwordConfirm: 'SOCIAL_LOGIN_NO_PASSWORD', linkedProviders: [{ provider: 'google', providerId: sub }] });
    } else {
      const hasGoogle = user.linkedProviders.find(p => p.provider === 'google');
      if (!hasGoogle) {
        user.linkedProviders.push({ provider: 'google', providerId: sub });
        await user.save({ validateBeforeSave: false });
      }
    }

    const refreshToken = signRefreshToken(user._id);
    const { hashOtp } = await import('../utils/otpUtils.js');
    user.refreshTokenHash = await hashOtp(refreshToken);
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api/auth' });
    res.redirect(process.env.CLIENT_ORIGIN || 'http://localhost:3000/');
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.redirect((process.env.CLIENT_ORIGIN || 'http://localhost:3000') + '/login?error=google_auth_failed');
  }
});
