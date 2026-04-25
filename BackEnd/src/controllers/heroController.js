import Hero from '../models/Hero.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * GET /api/hero/:pageKey
 * Fetch hero content for a specific page section.
 */
export const getHeroByPage = catchAsync(async (req, res, next) => {
  const { pageKey } = req.params;

  const hero = await Hero.findOne({ pageKey: pageKey.toLowerCase() });

  if (!hero) {
    return next(new AppError(`No hero content found for page "${pageKey}".`, 404));
  }

  return res.status(200).json({
    success: true,
    data: hero,
  });
});

/**
 * POST /api/hero
 * Upsert hero content for a specific page section.
 */
export const upsertHero = catchAsync(async (req, res, next) => {
  const { pageKey } = req.body;

  if (req.file) {
    req.body.image = req.file.path;
  }

  // upsert: true creates a new document if the pageKey is not found
  const updatedHero = await Hero.findOneAndUpdate(
    { pageKey: pageKey.toLowerCase() },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `Hero section for ${pageKey} saved successfully`,
    data: updatedHero
  });
});