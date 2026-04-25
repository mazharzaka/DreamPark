import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import heroRoutes from './routes/heroRoutes.js';
import attractionRoutes from './routes/attractionRoutes.js';
import authRoutes from './routes/authRoutes.js';

import errorMiddleware from './middlewares/errorMiddleware.js';

// ── Environment ────────────────────────────────────────────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ── Global Middlewares ─────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/hero', heroRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/auth', authRoutes);

// ── Centralized Error Handler ──────────────────────────────────────────────────
app.use(errorMiddleware);

// ── Database + Server Bootstrap ────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
