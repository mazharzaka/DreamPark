import { Router } from 'express';
import { getHeroByPage, upsertHero } from '../controllers/heroController.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/hero/{pageKey}:
 *   get:
 *     summary: Get hero section data for a specific page
 *     description: Retrieve the hero section content (title, description, image) for a given page key.
 *     tags: [Hero]
 *     parameters:
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The key identifying the page (e.g., home, about)
 *     responses:
 *       200:
 *         description: Hero section details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     pageKey:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *       400:
 *         description: Invalid page key provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
router.get('/:pageKey', getHeroByPage);

/**
 * @swagger
 * /api/hero:
 *   post:
 *     summary: Create or update hero section content
 *     description: Admin operation to upsert hero section details. Requires authentication and administrative privileges.
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pageKey:
 *                 type: string
 *                 description: Unique page identifier
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The background image to upload
 *     responses:
 *       200:
 *         description: Hero section saved successfully
 *       400:
 *         description: Validation failed or image missing
 *       401:
 *         description: Unauthorized (Token missing or invalid)
 *       403:
 *         description: Forbidden (User is not an admin)
 */
router.post('/', protect, restrictTo('admin'), upload.single('image'), upsertHero);

export default router;

