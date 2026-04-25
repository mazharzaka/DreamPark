import { Router } from 'express';
import { getHeroByPage, upsertHero } from '../controllers/heroController.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = Router();

// GET /api/hero/:pageKey
router.get('/:pageKey', getHeroByPage);

// POST /api/hero (Upsert) - Admin Only
router.post('/', protect, restrictTo('admin'), upsertHero);

export default router;
