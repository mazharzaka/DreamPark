import { Router } from 'express';
import { getHeroByPage, upsertHero } from '../controllers/heroController.js';

const router = Router();

// GET /api/hero/:pageKey
router.get('/:pageKey', getHeroByPage);
// POST /api/hero (Upsert)
router.post('/', upsertHero);
export default router;
