import Attraction from '../models/Attraction.js';

/**
 * GET /api/attractions
 * Fetch all attractions with optional category filtering and newest first sorting.
 */
export const getAllAttractions = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/attractions/:id
 * Fetch a single attraction by its ID.
 */
export const getAttractionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attraction = await Attraction.findById(id);

    if (!attraction) {
      return res.status(404).json({
        success: false,
        error: `Attraction not found with ID: ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: attraction,
    });
  } catch (error) {
    // If invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
      });
    }
    next(error);
  }
};

/**
 * POST /api/attractions
 * Add a new attraction.
 */
export const addAttraction = async (req, res, next) => {
  try {
    const newAttraction = await Attraction.create(req.body);

    // FR-014: Emit server-side console log entry
    console.log(`[Attraction Created] ID: ${newAttraction._id}`);

    return res.status(201).json({
      success: true,
      message: 'Attraction created successfully',
      data: newAttraction,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    next(error);
  }
};

/**
 * PATCH /api/attractions/:id
 * Partially update an attraction.
 */
export const updateAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedAttraction = await Attraction.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAttraction) {
      return res.status(404).json({
        success: false,
        error: `Attraction not found with ID: ${id}`,
      });
    }

    // FR-014: Emit server-side console log entry
    console.log(`[Attraction Updated] ID: ${updatedAttraction._id}`);

    return res.status(200).json({
      success: true,
      message: 'Attraction updated successfully',
      data: updatedAttraction,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/attractions/:id
 * Permanently delete an attraction.
 */
export const deleteAttraction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedAttraction = await Attraction.findByIdAndDelete(id);

    if (!deletedAttraction) {
      return res.status(404).json({
        success: false,
        error: `Attraction not found with ID: ${id}`,
      });
    }

    // FR-014: Emit server-side console log entry
    console.log(`[Attraction Deleted] ID: ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Attraction deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
      });
    }
    next(error);
  }
};
