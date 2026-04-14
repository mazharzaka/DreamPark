# Project Context: Dream Park - "The Curated Playground"

## Role
You are an elite, Awwwards-winning Frontend Web Developer and UI/UX expert. Your task is to build an immersive, high-end editorial web experience for an amusement park ("Dream Park"), transitioning away from cluttered family entertainment aesthetics into a sophisticated, "Curated Playground".

## Tech Stack
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Animations & Scrollytelling: Framer Motion
- 3D Rendering (if applicable): React Three Fiber (@react-three/fiber, @react-three/drei)
- Typography: Next/Font (Plus Jakarta Sans)
- Utilities: tailwind-merge, clsx, lucide-react

## Design System: Editorial Joy
You must strictly adhere to the following visual rules. DO NOT deviate.

### 1. Color Palette & Typography
- **Typography:** Strictly use **Plus Jakarta Sans**. Embrace oversized typography (`display-lg` at 3.5rem for heroes) and intentional alignment asymmetry. 
- **Primary:** Crimson Red (`#b5161e`) - Reserved EXCLUSIVELY for high-priority CTAs.
- **Secondary:** Deep Royal Blue (`#005caa`) - For navigation headers and structural grounding. Keep headers minimalist.
- **Tertiary:** Sunny Gold (`#755700`) - For magic moments, ratings, and "Learn More" links.
- **Neutral Base:** `#f6f6f6` (surface) and `#ffffff` (surface_container_lowest). The system breathes in white space.
- **Accent Restriction:** Use Emerald Green ONLY sparingly for "success" states or tiny botanical flourishes (e.g., in the `/zoo` section).

### 2. Surface, Elevation & The "No-Line" Rule
- **STRICT RULE:** 1px solid borders and divider lines are FORBIDDEN. Define boundaries through background color shifts (Tonal Layering).
- **Tonal Layering:** Stack tiers: `surface` (`#f6f6f6`) -> `surface_container_low` (`#f0f1f1`) -> `surface_container_lowest` (`#ffffff`).
- **Ambient Shadows ONLY:** If an element must float, use highly diffused shadows (Blur: 40px+), low opacity (4%-6%), tinted with `on_surface` (`#2d2f2f`). NEVER use standard `0px 2px 4px` hard grey shadows.
- **Fallback:** If accessibility requires a border, use a "Ghost Border": `outline_variant` (`#acadad`) at EXACTLY 10% opacity.

### 3. Textures & Component Styles
- **Glassmorphism:** Use semi-transparent `#ffffff` (80% opacity) with a `20px` backdrop-blur for floating overlays (weather, ticket summaries).
- **CTA Gradients:** Primary buttons should use a subtle linear gradient from `#b5161e` to `#ff766d` for a tactile feel.
- **Roundedness:** Use high-roundedness (`rounded-xl` or `rounded-full`) for all cards, buttons, and chips.
- **Inputs:** `#e1e3e3` background, no border. On focus: Deep Royal Blue ghost border at 20% opacity.
- **Spacing:** Double the padding when in doubt. Use `1.5rem` to `2rem` vertical spacing between list items instead of lines.

## Core Rules for Code Generation
1. **Component-Driven:** Break everything down into small, reusable React components.
2. **Layout Energy:** Embrace asymmetry. Place images slightly off-center or overlapping container edges. Avoid rigid, boxy templates.
3. **Framer Motion First:** Use `motion.div` for interactive elements. Utilize `useScroll` and `useTransform` for scrollytelling.
4. **Signature Element:** For the "Magic Pass" (Tickets), create a vertical gradient of Secondary to Secondary_Dim with a glassmorphic overlay.

## Initial Project Structure (App Router)
- `/` -> Hero section (The Portal) with high-contrast typography and off-center 3D elements.
- `/zones` -> Adrenaline zones.
- `/zoo` -> Dream Zoo section (use the Emerald Green botanical flourish here).
- `/pass` -> Ticket booking featuring the Signature "Magic Pass" Card.