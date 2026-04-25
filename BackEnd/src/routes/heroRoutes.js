import { Router } from 'express';
import { getHeroByPage, upsertHero, addSlide, editSlide, deleteSlide } from '../controllers/heroController.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/hero/{lang}/{pageKey}:
 *   get:
 *     summary: Get hero section data for a specific page and language
 *     description: Retrieve localized hero section content.
 *     tags: [Hero]
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *         description: Language locale
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The key identifying the page (e.g., home, about)
 *     responses:
 *       200:
 *         description: Hero section details retrieved successfully
 *       404:
 *         description: Not found
 */
router.get('/:lang/:pageKey', getHeroByPage);

/**
 * @swagger
 * /api/hero/{lang}/{pageKey}:
 *   post:
 *     summary: Create or update hero section content
 *     description: Admin operation to upsert hero section details.
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Hero section saved
 */
router.post('/:lang/:pageKey', protect, restrictTo('admin'), upload.single('image'), upsertHero);

/**
 * @swagger
 * /api/hero/{lang}/{pageKey}/slides:
 *   post:
 *     summary: Add a new slide to a hero section
 *     description: Admin privilege to append a slide.
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               ctaText:
 *                 type: string
 *               ctaLink:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Slide appended successfully
 */
router.post('/:lang/:pageKey/slides', protect, restrictTo('admin'), upload.single('image'), addSlide);

/**
 * @swagger
 * /api/hero/{lang}/{pageKey}/slides/{slideId}:
 *   patch:
 *     summary: Edit an existing slide
 *     description: Admin privilege to update nested slide content.
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: slideId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               ctaText:
 *                 type: string
 *               ctaLink:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Slide modified
 *       404:
 *         description: Slide or Hero not found
 */
router.patch('/:lang/:pageKey/slides/:slideId', protect, restrictTo('admin'), upload.single('image'), editSlide);

/**
 * @swagger
 * /api/hero/{lang}/{pageKey}/slides/{slideId}:
 *   delete:
 *     summary: Delete a slide
 *     description: Admin privilege to remove a slide from the array.
 *     tags: [Hero]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lang
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ar, en]
 *       - in: path
 *         name: pageKey
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: slideId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slide removed
 *       404:
 *         description: Not found
 */
router.delete('/:lang/:pageKey/slides/:slideId', protect, restrictTo('admin'), deleteSlide);

export default router;
