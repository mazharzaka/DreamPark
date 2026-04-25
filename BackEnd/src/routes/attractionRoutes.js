import { Router } from 'express';
import {
  getAllAttractions,
  getAttractionById,
  addAttraction,
  updateAttraction,
  deleteAttraction,
} from '../controllers/attractionController.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/attractions
router.get('/', getAllAttractions);

// GET /api/attractions/:id
router.get('/:id', getAttractionById);

// Protected Admin Operations
router.use(protect);
router.use(restrictTo('admin'));

// POST /api/attractions
router.post('/', addAttraction);

// PATCH /api/attractions/:id
router.patch('/:id', updateAttraction);

// DELETE /api/attractions/:id
router.delete('/:id', deleteAttraction);

export default router;
