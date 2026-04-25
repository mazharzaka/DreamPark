import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply security guards
router.post('/', protect, restrictTo('admin'), upload.single('image'), uploadImage);

export default router;
