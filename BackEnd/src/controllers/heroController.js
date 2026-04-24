import Hero from '../models/Hero.js';

/**
 * GET /api/hero/:pageKey
 * Fetch hero content for a specific page section.
 */
export const getHeroByPage = async (req, res, next) => {
  try {
    const { pageKey } = req.params;

    const hero = await Hero.findOne({ pageKey: pageKey.toLowerCase() });

    if (!hero) {
      return res.status(404).json({
        success: false,
        error: `No hero content found for page "${pageKey}".`,
      });
    }

    return res.status(200).json({
      success: true,
      data: hero,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/hero
 * Upsert hero content for a specific page section.
 */
export const upsertHero = async (req, res) => {
  const { pageKey } = req.body;

  try {
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
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};