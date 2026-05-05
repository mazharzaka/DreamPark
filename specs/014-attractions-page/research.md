# Research: Attractions Page

## Findings

### 1. Editorial Joy Palette
Since "Editorial Joy" isn't explicitly defined in `tailwind.config.ts`, I've curated a rotating palette of 6 vibrant, accessible colors that fit the "DreamPark" festive aesthetic:
- **Rose**: `#e11d48` (Vibrant Red-Pink)
- **Violet**: `#7c3aed` (Modern Purple)
- **Amber**: `#d97706` (Energetic Orange)
- **Emerald**: `#059669` (Fresh Green)
- **Sky**: `#0284c7` (Clear Blue)
- **Indigo**: `#4f46e5` (Deep Blue-Purple)

**Decision**: Use these as background overlay colors with `bg-opacity-60` or similar for the card effect.

### 2. RTK Query & Client-side Logic
- **Endpoint**: `GET /api/attractions` returns all attractions.
- **Filtering**: Perform client-side filtering by `category` ("games" | "animals") to allow instant tab switching without loading states (as per SC-001).
- **Pagination**: Implement a slice-based approach: `filteredAttractions.slice((page - 1) * 8, page * 8)`.

### 3. Grid Layout
- **Mobile**: 1 column (`grid-cols-1`)
- **Tablet**: 2 columns (`grid-cols-2`)
- **Desktop**: 3 columns (`grid-cols-3`)
- **Gap**: `gap-6` or `gap-8` for breathable white space.

### 4. Detail Page Route
- **Path**: `src/app/[locale]/attractions/[id]/page.tsx`.
- **Content**: Basic stub showing name, description, and the first image from the `images[]` array.

## Alternatives Considered

### Server-side Filtering
- **Rationale**: Keeps client-side state smaller.
- **Rejected Because**: The park likely has < 100 attractions. Loading all at once and filtering client-side provides a much faster and smoother UX when switching tabs, meeting the < 1s requirement better.

### Dedicated Category Pages
- **Rationale**: Better SEO for specific categories.
- **Rejected Because**: User requested a single page with 2 categories and tabs, which suggests a unified browsing experience.
