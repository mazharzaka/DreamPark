import { Router } from 'express';
import {
  getAllAttractions,
  getAttractionById,
  addAttraction,
  updateAttraction,
  deleteAttraction,
  getAttractionsByLangAndPage,
} from '../controllers/attractionController.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/attractions:
 *   get:
 *     summary: Retrieve all attractions
 *     description: Fetch a list of all attractions available in the park.
 *     tags: [Attractions]
 *     responses:
 *       200:
 *         description: A list of attractions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', getAllAttractions);

/**
 * @swagger
 * /api/attractions/{lang}/{pageKey}:
 *   get:
 *     summary: Get localized attractions by pageKey
 *     description: Fetch localized attractions with pagination and sorting.
 *     tags: [Attractions]
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
 *         description: The key identifying the page (e.g., games)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: A list of localized attractions
 *       400:
 *         description: Invalid language
 */
router.get('/:lang/:pageKey', getAttractionsByLangAndPage);

/**
 * @swagger
 * /api/attractions/{id}:
 *   get:
 *     summary: Get attraction by ID
 *     description: Retrieve detailed information regarding a specific attraction.
 *     tags: [Attractions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the attraction
 *     responses:
 *       200:
 *         description: Attraction details
 *       404:
 *         description: Attraction not found
 */
router.get('/:id', getAttractionById);

// Protected Admin Operations
router.use(protect);
router.use(restrictTo('admin'));

/**
 * @swagger
 * /api/attractions:
 *   post:
 *     summary: Add a new attraction
 *     description: Admin privilege to add a park attraction.
 *     tags: [Attractions]
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
 *               name_en:
 *                 type: string
 *               name_ar:
 *                 type: string
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               category:
 *                 type: string
 *               description_en:
 *                 type: string
 *               description_ar:
 *                 type: string
 *               minHeight:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Operating, Maintenance, Closed]
 *               waitingTime:
 *                 type: string
 *               isFastTrack:
 *                 type: boolean
 *               bookPass:
 *                 type: boolean
 *               icon:
 *                 type: string
 *               layout.colSpan:
 *                 type: number
 *               layout.rowSpan:
 *                 type: number
 *               layout.customStyle:
 *                 type: string
 *                 enum: [crimson, sky, nebula, amazon, phoenix, midas]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Attraction successfully created
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Missing authentication
 *       403:
 *         description: User lacks administrative privileges
 */
router.post('/', upload.single('image'), addAttraction);

/**
 * @swagger
 * /api/attractions/{id}:
 *   patch:
 *     summary: Update an attraction
 *     description: Admin privilege to modify properties of an attraction.
 *     tags: [Attractions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pageKey:
 *                 type: string
 *               name_en:
 *                 type: string
 *               name_ar:
 *                 type: string
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               category:
 *                 type: string
 *               description_en:
 *                 type: string
 *               description_ar:
 *                 type: string
 *               minHeight:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Operating, Maintenance, Closed]
 *               waitingTime:
 *                 type: string
 *               isFastTrack:
 *                 type: boolean
 *               bookPass:
 *                 type: boolean
 *               icon:
 *                 type: string
 *               layout.colSpan:
 *                 type: number
 *               layout.rowSpan:
 *                 type: number
 *               layout.customStyle:
 *                 type: string
 *                 enum: [crimson, sky, nebula, amazon, phoenix, midas]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Attraction updated
 *       401:
 *         description: Not authenticated
 */
router.patch('/:id', upload.single('image'), updateAttraction);

/**
 * @swagger
 * /api/attractions/{id}:
 *   delete:
 *     summary: Remove an attraction
 *     description: Admin privilege to delete an attraction.
 *     tags: [Attractions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attraction successfully deleted
 *       404:
 *         description: Attraction not found
 */
router.delete('/:id', deleteAttraction);

export default router;

