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

  // Cast boolean strings
  if (req.body.isFastTrack) req.body.isFastTrack = req.body.isFastTrack === 'true';
  if (req.body.bookPass) req.body.bookPass = req.body.bookPass === 'true';

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

  const updateData = {};

  // Process and filter body for partial updates
  Object.keys(req.body).forEach((key) => {
    // Handle nested layout fields (support both object and dot notation/flat fields)
    if (key === 'layout' && typeof req.body.layout === 'object') {
      Object.keys(req.body.layout).forEach((subKey) => {
        updateData[`layout.${subKey}`] = req.body.layout[subKey];
      });
    } else if (key.startsWith('layout.')) {
      updateData[key] = req.body[key];
    } else if (key === 'isFastTrack' || key === 'bookPass') {
      // Cast boolean strings
      updateData[key] = req.body[key] === 'true';
    } else if (req.body[key] !== undefined && req.body[key] !== '') {
      // Only update fields that are provided and not empty strings
      // (Except for images/files where we might want to clear them, but here we handle that separately)
      updateData[key] = req.body[key];
    }
  });

  const updatedAttraction = await Attraction.findByIdAndUpdate(
    id,
    { $set: updateData },
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

/**
 * GET /api/attractions/:lang/:pageKey
 * Fetch localized attractions by pageKey with pagination and sorting.
 */
export const getAttractionsByLangAndPage = catchAsync(async (req, res, next) => {
  const { lang, pageKey } = req.params;
  const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', category } = req.query;

  if (lang !== 'ar' && lang !== 'en') {
    return next(new AppError('Language must be either ar or en', 400));
  }

  const filter = { pageKey };

  if (category) {
    filter.category = category;
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const sortDirection = order === 'desc' ? -1 : 1;
  const sortOptions = { [sort]: sortDirection };

  const totalItems = await Attraction.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limitNumber);

  const attractions = await Attraction.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber);

  // Map localized fields
  const mappedAttractions = attractions.map((attr) => {
    const attrObj = attr.toObject();
    return {
      ...attrObj,
      name: lang === 'ar' ? attrObj.name_ar : attrObj.name_en,
      description: lang === 'ar' ? attrObj.description_ar : attrObj.description_en,
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      items: mappedAttractions,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber
      }
    },
  });
});
