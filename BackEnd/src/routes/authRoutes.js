import { Router } from 'express';
import { signup, login, sendOtp, verifyOtpController, refresh, logout, resetPassword, getProfile, googleAuth, googleCallback } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user and send activation OTP
 *     description: Create a new account in the system and triggers OTP email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               passwordConfirm:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully, OTP sent
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Request a new OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - purpose
 *             properties:
 *               email:
 *                 type: string
 *               purpose:
 *                 type: string
 *                 enum: [account_activation, password_reset]
 *     responses:
 *       200:
 *         description: Code sent if account exists
 */
router.post('/send-otp', sendOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *               - purpose
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *               purpose:
 *                 type: string
 *                 enum: [account_activation, password_reset]
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verify-otp', verifyOtpController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Verify credentials and return an access JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Exchange a valid httpOnly refresh token cookie for a new access token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully refreshed token
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clears the httpOnly refresh token cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', protect, getProfile);

// ── Social Login ───────────────────────────────────────────────────────────────
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;
