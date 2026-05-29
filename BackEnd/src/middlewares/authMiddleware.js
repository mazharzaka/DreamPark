import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET || "fallback-secret-key-for-development",
  );

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401),
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    // Normalize user role
    const normalizedUserRole =
      userRole === "customer"
        ? "USER"
        : userRole === "staff"
          ? "MARKETING_AGENT"
          : userRole === "admin"
            ? "ADMIN"
            : userRole;

    // Normalize roles allowed by the endpoint
    const normalizedAllowedRoles = roles.map((r) =>
      r === "customer"
        ? "USER"
        : r === "staff"
          ? "MARKETING_AGENT"
          : r === "admin"
            ? "ADMIN"
            : r,
    );

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};
