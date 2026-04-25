import { Router } from 'express';
import {
  getAllAttractions,
  getAttractionById,
  addAttraction,
  updateAttraction,
  deleteAttraction,
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
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

