import Hero from '../models/Hero.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

/**
 * GET /api/hero/:lang/:pageKey
 * Fetch hero content for a specific page section and language.
 */
export const getHeroByPage = catchAsync(async (req, res, next) => {
  const { lang, pageKey } = req.params;
  const finalKey = `${pageKey}_${lang}`.toLowerCase();

  const hero = await Hero.findOne({ pageKey: finalKey });

  if (!hero) {
    return next(new AppError(`No hero content found for page "${pageKey}" in language "${lang}".`, 404));
  }

  return res.status(200).json({
    success: true,
    data: hero,
  });
});

/**
 * POST /api/hero/:lang/:pageKey
 * Upsert hero content for a specific page section.
 */
export const upsertHero = catchAsync(async (req, res, next) => {
  const { lang, pageKey } = req.params;
  const finalKey = `${pageKey}_${lang}`.toLowerCase();

  if (req.file) {
    req.body.imageUrl = req.file.path;
  }

  const updatedHero = await Hero.findOneAndUpdate(
    { pageKey: finalKey },
    { ...req.body, pageKey: finalKey },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: `Hero section for "${pageKey}" [${lang}] saved successfully`,
    data: updatedHero,
  });
});

/**
 * POST /api/hero/:lang/:pageKey/slides
 * Add a new slide.
 */
export const addSlide = catchAsync(async (req, res, next) => {
  const { lang, pageKey } = req.params;
  const finalKey = `${pageKey}_${lang}`.toLowerCase();
  const slideData = { ...req.body };

  if (req.file) {
    slideData.imageUrl = req.file.path;
  }

  const hero = await Hero.findOneAndUpdate(
    { pageKey: finalKey },
    { $push: { slides: slideData } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json({
    success: true,
    message: 'Slide added successfully',
    data: hero,
  });
});

/**
 * PATCH /api/hero/:lang/:pageKey/slides/:slideId
 * Update an existing slide.
 */
export const editSlide = catchAsync(async (req, res, next) => {
  const { lang, pageKey, slideId } = req.params;
  const finalKey = `${pageKey}_${lang}`.toLowerCase();
  const updates = { ...req.body };

  if (req.file) {
    updates.imageUrl = req.file.path;
  }

  const hero = await Hero.findOne({ pageKey: finalKey });

  if (!hero) {
    return next(new AppError(`No hero content found for page "${pageKey}" [${lang}].`, 404));
  }

  const slide = hero.slides.id(slideId);

  if (!slide) {
    return next(new AppError(`Slide with ID "${slideId}" not found.`, 404));
  }

  Object.keys(updates).forEach((key) => {
    slide[key] = updates[key];
  });

  await hero.save();

  res.status(200).json({
    success: true,
    message: 'Slide updated successfully',
    data: hero,
  });
});

/**
 * DELETE /api/hero/:lang/:pageKey/slides/:slideId
 */
export const deleteSlide = catchAsync(async (req, res, next) => {
  const { lang, pageKey, slideId } = req.params;
  const finalKey = `${pageKey}_${lang}`.toLowerCase();

  const hero = await Hero.findOne({ pageKey: finalKey });

  if (!hero) {
    return next(new AppError(`No hero content found for page "${pageKey}" [${lang}].`, 404));
  }

  const slide = hero.slides.id(slideId);

  if (!slide) {
    return next(new AppError(`Slide with ID "${slideId}" not found.`, 404));
  }

  hero.slides.pull(slideId);
  await hero.save();

  res.status(200).json({
    success: true,
    message: 'Slide deleted successfully',
    data: hero,
  });
});