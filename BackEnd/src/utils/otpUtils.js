import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a 6-digit numeric OTP
 * @returns {string} The generated OTP
 */
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash an OTP for storage
 * @param {string} otp - The plain text OTP
 * @returns {Promise<string>} The hashed OTP
 */
export const hashOtp = async (otp) => {
  return await bcrypt.hash(otp, 12);
};

/**
 * Verify an OTP against a hash
 * @param {string} otp - The plain text OTP
 * @param {string} hash - The hashed OTP
 * @returns {Promise<boolean>} True if valid, false otherwise
 */
export const verifyOtp = async (otp, hash) => {
  return await bcrypt.compare(otp, hash);
};
