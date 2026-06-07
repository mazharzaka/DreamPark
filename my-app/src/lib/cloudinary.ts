/**
 * Cloudinary Image URL Optimizer
 *
 * Intercepts Cloudinary URLs and injects transformation parameters directly
 * into the upload path to reduce image payload size. Using c_fill + explicit
 * dimensions forces Cloudinary to deliver a pre-cropped image at exactly the
 * right size — preventing the browser from downloading oversized images and
 * doing expensive CSS resizing (a major contributor to high TBT).
 */

/** Guard: skip non-Cloudinary URLs and already-transformed URLs */
function isCloudinaryUrl(url: string): boolean {
  return !!url && url.includes("res.cloudinary.com");
}

function alreadyTransformed(url: string): boolean {
  return url.includes("/upload/f_auto");
}

/**
 * Card / Grid preset — 600×600 square crop.
 * Used for: AdrenalineWorlds, Ticketsets, GamesGrid, OurHeroesSlider cards.
 *
 *  - f_auto        → WebP/AVIF format negotiation
 *  - q_auto        → Optimal quality automatically
 *  - w_600,h_600   → Fixed square crop matching typical card containers
 *  - c_fill        → Crop to fill exactly (no black bars / CSS stretching)
 *  - g_auto        → Smart gravity: center on the most visually interesting area
 */
export function getOptimizedCloudinaryUrl(url: string): string {
  if (!isCloudinaryUrl(url) || alreadyTransformed(url)) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_600,h_600,c_fill,g_auto/");
}

/**
 * Hero / Banner preset — 1400×800 wide landscape crop.
 * Used for: HeroSlider background, GameHero background, Lightbox full-screen.
 *
 *  - f_auto          → Format negotiation
 *  - q_auto:good     → Quality capped at "good" tier — sufficient for blurred
 *                       backgrounds and overlaid-text images
 *  - w_1400,h_800    → 16:9-ish hero crop covering all desktop viewports
 *  - c_fill          → Fill the container without distortion
 *  - g_auto          → Smart gravity for focal point detection
 */
export function getOptimizedCloudinaryHeroUrl(url: string): string {
  if (!isCloudinaryUrl(url) || alreadyTransformed(url)) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto:good,w_1400,h_800,c_fill,g_auto/");
}

/**
 * Thumbnail preset — 300×300 small crop.
 * Used for: gallery thumbnails, secondary grid items, avatar-style images.
 *
 *  - f_auto      → Format negotiation
 *  - q_auto      → Auto quality
 *  - w_300,h_300 → Small square for thumbnail rows
 *  - c_fill      → Fill crop
 */
export function getOptimizedCloudinaryThumbnailUrl(url: string): string {
  if (!isCloudinaryUrl(url) || alreadyTransformed(url)) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_300,h_300,c_fill/");
}

