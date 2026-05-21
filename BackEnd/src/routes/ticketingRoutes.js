import express from 'express';
import {
  getTicketTypes,
  createBooking,
  verifyAndConfirmPayment,
  updateTicketPrice,
  getUserBookings,
  addTicketType,
} from '../controllers/ticketingController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ── Public ─────────────────────────────────────────────────────────────────────
// Visitors can browse ticket types without logging in
/**
 * @swagger
 * /api/tickets/types:
 *   get:
 *     summary: Retrieve available ticket types
 *     description: Visitors can browse ticket types without logging in.
 *     tags: [Ticketing]
 *     responses:
 *       200:
 *         description: A list of ticket types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/types', getTicketTypes);

// ── Authenticated users (any logged-in role) ───────────────────────────────────
// Creating a booking and viewing personal history require a valid JWT

/**
 * @swagger
 * /api/tickets/bookings:
 *   post:
 *     summary: Create a booking
 *     description: Creating a booking requires a valid JWT.
 *     tags: [Ticketing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketTypeId
 *               - targetDate
 *               - quantity
 *             properties:
 *               ticketTypeId:
 *                 type: string
 *               targetDate:
 *                 type: string
 *                 format: date
 *               quantity:
 *                 type: number
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid or past target date / Quantity must be at least 1
 *       404:
 *         description: Ticket type not found
 */
router.post('/bookings', protect, createBooking);

/**
 * @swagger
 * /api/tickets/bookings/user:
 *   get:
 *     summary: Get user bookings
 *     description: Viewing personal history requires a valid JWT.
 *     tags: [Ticketing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Mock auth via query param
 *     responses:
 *       200:
 *         description: A list of user bookings
 *       404:
 *         description: User not found
 */
router.get('/bookings/user', protect, getUserBookings);

// ── Marketing Agents & Admins only ────────────────────────────────────────────
// Only staff/admin roles can verify and confirm payments at the park

/**
 * @swagger
 * /api/tickets/verify:
 *   post:
 *     summary: Verify and confirm payment
 *     description: Only staff/admin roles can verify and confirm payments at the park.
 *     tags: [Ticketing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCodeId
 *             properties:
 *               qrCodeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Already paid or invalid date
 *       404:
 *         description: Invalid token or booking not found
 */
router.post('/verify', protect, restrictTo('staff', 'admin'), verifyAndConfirmPayment);

// ── Admin only ─────────────────────────────────────────────────────────────────
// Only admins may update ticket prices

/**
 * @swagger
 * /api/tickets/types/price:
 *   patch:
 *     summary: Update ticket price
 *     description: Only admins may update ticket prices.
 *     tags: [Ticketing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketTypeId
 *               
 *             properties:
 *               ticketTypeId:
 *                 type: string
 *               newPrice:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               nameAr:
 *                 type: string
 *               descriptionAr:
 *                 type: string
 *               discount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ticket price updated successfully
 *       400:
 *         description: Price must be a positive number
 *       404:
 *         description: Ticket not found
 */
router.patch('/types/price', protect, restrictTo('admin'), updateTicketPrice);

// Admin only
/**
 * @swagger
 * /api/tickets/types:
 *   post:
 *     summary: Add ticket type
 *     description: Only admins may add ticket types.
 *     tags: [Ticketing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - nameAr
 *               - descriptionAr
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               nameAr:
 *                 type: string
 *               descriptionAr:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket type added successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Ticket type not found
 */
router.post('/types', protect, restrictTo('admin'), addTicketType);

export default router;
