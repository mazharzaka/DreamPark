import express from 'express';
import {
  getTicketTypes,
  createBooking,
  verifyAndConfirmPayment,
  updateTicketPrice,
  getUserBookings,
} from '../controllers/ticketingController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ── Public ─────────────────────────────────────────────────────────────────────
// Visitors can browse ticket types without logging in
router.get('/types', getTicketTypes);

// ── Authenticated users (any logged-in role) ───────────────────────────────────
// Creating a booking and viewing personal history require a valid JWT
router.post('/bookings', protect, createBooking);
router.get('/bookings/user', protect, getUserBookings);

// ── Marketing Agents & Admins only ────────────────────────────────────────────
// Only staff/admin roles can verify and confirm payments at the park
router.post('/verify', protect, restrictTo('staff', 'admin'), verifyAndConfirmPayment);

// ── Admin only ─────────────────────────────────────────────────────────────────
// Only admins may update ticket prices
router.patch('/types/price', protect, restrictTo('admin'), updateTicketPrice);

export default router;
