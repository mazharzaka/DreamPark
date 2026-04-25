import Attraction from '../models/Attraction.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * GET /api/attractions
 * Fetch all attractions with optional category filtering and newest first sorting.
 */
export const getAllAttractions = catchAsync(async (req, res, next) => {
  const { category } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  // Sort by createdAt descending (newest first)
  const attractions = await Attraction.find(filter).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: attractions,
  });
});

/**
 * GET /api/attractions/:id
 * Fetch a single attraction by its ID.
 */
export const getAttractionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const attraction = await Attraction.findById(id);

  if (!attraction) {
    return next(new AppError(`Attraction not found with ID: ${id}`, 404));
  }

  return res.status(200).json({
    success: true,
    data: attraction,
  });
});

/**
 * POST /api/attractions
 * Add a new attraction.
 */
export const addAttraction = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.image = req.file.path;
  }

  const newAttraction = await Attraction.create(req.body);

  // FR-014: Emit server-side console log entry
  console.log(`[Attraction Created] ID: ${newAttraction._id}`);

  return res.status(201).json({
    success: true,
    message: 'Attraction created successfully',
    data: newAttraction,
  });
});

/**
 * PATCH /api/attractions/:id
 * Partially update an attraction.
 */
export const updateAttraction = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (req.file) {
    req.body.image = req.file.path;
  }

  const updatedAttraction = await Attraction.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedAttraction) {
    return next(new AppError(`Attraction not found with ID: ${id}`, 404));
  }

  // FR-014: Emit server-side console log entry
  console.log(`[Attraction Updated] ID: ${updatedAttraction._id}`);

  return res.status(200).json({
    success: true,
    message: 'Attraction updated successfully',
    data: updatedAttraction,
  });
});

/**
 * DELETE /api/attractions/:id
 * Permanently delete an attraction.
 */
export const deleteAttraction = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedAttraction = await Attraction.findByIdAndDelete(id);

  if (!deletedAttraction) {
    return next(new AppError(`Attraction not found with ID: ${id}`, 404));
  }

  // FR-014: Emit server-side console log entry
  console.log(`[Attraction Deleted] ID: ${id}`);

  return res.status(200).json({
    success: true,
    message: 'Attraction deleted successfully',
  });
});

