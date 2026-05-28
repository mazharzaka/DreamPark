import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'fallback-secret-key-for-development');

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new AppError('غير مصرح لك بالوصول إلى هذا المورد', 403));
    }

    const userRole = req.user.role.toUpperCase().trim();
    // Normalize user role
    const normalizedUserRole = userRole === 'CUSTOMER' ? 'USER' :
                               userRole === 'STAFF' ? 'MARKETING_AGENT' :
                               userRole === 'ADMIN' ? 'ADMIN' : userRole;

    // Normalize roles allowed by the endpoint
    const normalizedAllowedRoles = roles.map(r => {
      const upper = r.toUpperCase().trim();
      return upper === 'CUSTOMER' ? 'USER' :
             upper === 'STAFF' ? 'MARKETING_AGENT' :
             upper === 'ADMIN' ? 'ADMIN' : upper;
    });

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next(new AppError('ليس لديك صلاحية للقيام بهذا الإجراء', 403));
    }
    next();
  };
};
