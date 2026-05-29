import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import heroRoutes from "./routes/heroRoutes.js";
import attractionRoutes from "./routes/attractionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ticketingRoutes from "./routes/ticketingRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

// ── Environment ────────────────────────────────────────────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ── Global Middlewares ─────────────────────────────────────────────────────────
<<<<<<< HEAD
app.use(cors({ 
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    'https://smfxhlj1-3000.euw.devtunnels.ms',
    'http://localhost:3000'
  ],
  credentials: true
}));
=======
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
>>>>>>> 025-profile-ticket
app.use(express.json());
app.use(cookieParser());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/hero", heroRoutes);
app.use("/api/attractions", attractionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketingRoutes);
app.use("/api/v1", ticketingRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Centralized Error Handler ──────────────────────────────────────────────────
app.use(errorMiddleware);

// ── Database + Server Bootstrap ────────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
