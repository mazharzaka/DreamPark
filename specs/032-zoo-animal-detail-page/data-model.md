# Data Model: Unified Zoo Animal Detail Page

**Feature**: 032-zoo-animal-detail-page  
**Date**: 2026-06-29

---

## Consumed Entities (Read-Only)

### Attraction (Zoo Animal)

Source: `GET /api/attractions/:id` → `result.data`  
TypeScript type: `src/types/attraction.ts#Attraction` (existing, no changes needed)

| Field | Type | Required? | Used By Component | Notes |
|---|---|---|---|---|
| `_id` | `string` | ✅ | `page.tsx` | MongoDB ObjectId — used as React key, URL param |
| `name_ar` | `string` | ✅ | `ZooAnimalHero` | Arabic primary title (large) |
| `name_en` | `string` | ✅ | `ZooAnimalHero` | English subtitle (small) — reversed when `locale=en` |
| `description_ar` | `string` | ✅ | `ZooAnimalHero` | Arabic description paragraph |
| `description_en` | `string` | ✅ | `ZooAnimalHero` | English description paragraph |
| `image` | `string` (Cloudinary URL) | ✅ | `ZooAnimalHero` | Hero background — served via `getOptimizedCloudinaryHeroUrl` (1400×800 preset) |
| `images[]` | `string[]` | optional | `ZooGallery` | Gallery images — first 3 in editorial grid, rest in thumbnail row. Gallery hidden if empty. |
| `status` | `"Operating"\|"Maintenance"\|"Closed"` | ✅ | `ZooBookingBanner` | Controls CTA enabled/disabled state |
| `waitingTime` | `string` | optional | `ZooAnimalHero` | Displayed in the wait-time stat chip; shows `"--"` if absent |
| `category` | `string` | optional | `ZooAnimalHero` | Category badge (e.g., "Mammals") |
| `tags.rules[]` | `{type, text, _id}[]` | optional | `ZooTermsGrid` | Safety rule cards; section hidden if empty |
| `layout.customStyle` | `string` | optional | `ZooAnimalHero`, `ZooBookingBanner`, `ZooTermsGrid` | Theme palette key (e.g., `"phoenix"`, `"amazon"`). Falls back to `"sky"` via `getTheme()` |

**Deprecated fields** (do NOT use in new code per Constitution Part 3):
- `name` (singular) → use `name_ar` / `name_en`
- `description` (singular) → use `description_ar` / `description_en`

---

## Static Data Entities

### ZooInfoBox Content

Fully static — not sourced from API. Externalised via `ZooAnimal` i18n namespace.

| Field | `en` value | `ar` value |
|---|---|---|
| `label` | `"Everyone is allowed"` | `"مسموح للجميع"` |
| `duration` | `"5 min"` | `"٥ دقائق"` |
| Icon | `Clock` (lucide-react) | Same |

### Booking URL

| Key | Source | Value (default) |
|---|---|---|
| `NEXT_PUBLIC_ZOO_BOOKING_URL` | `.env` | `https://dreampark.sa/booking` |
| Fallback constant | `src/features/zoo/lib/constants.ts` | `"https://dreampark.sa/booking"` |

---

## New i18n Entities

### `ZooAnimal` Translation Namespace

Added to `messages/en.json` and `messages/ar.json`.  
Used via `useTranslations('ZooAnimal')` or `getTranslations('ZooAnimal')` in server components.

| Key Path | Purpose |
|---|---|
| `ZooAnimal.infoBox.label` | "Everyone is allowed" badge text |
| `ZooAnimal.infoBox.duration` | "5 min" duration text |
| `ZooAnimal.booking.heading` | Section heading |
| `ZooAnimal.booking.subtext` | Descriptive paragraph |
| `ZooAnimal.booking.cta` | CTA button label (Operating state) |
| `ZooAnimal.booking.unavailable` | CTA button label (non-Operating state) |
| `ZooAnimal.booking.statusAvailable` | Status chip text |
| `ZooAnimal.booking.statusMaintenance` | Status chip text |
| `ZooAnimal.booking.statusClosed` | Status chip text |
| `ZooAnimal.gallery.title` | Section title "معرض الصور" / "Media Gallery" |
| `ZooAnimal.gallery.subtitle` | Section subtitle |
| `ZooAnimal.terms.title` | Section title "الشروط والأحكام والسلامة" |
| `ZooAnimal.terms.subtitle` | Section subtitle |
| `ZooAnimal.hero.waitTime` | "Wait Time" / "وقت الانتظار" label |
| `ZooAnimal.hero.min` | "MIN" / "دقيقة" unit suffix |

---

## State Transitions

### Booking CTA State Machine

```
Attraction.status
    ├── "Operating"    → CTA rendered as <a href={bookingUrl} target="_blank">  [clickable orange button]
    ├── "Maintenance"  → CTA rendered as <button disabled>                       [grey, "غير متاح حالياً"]
    └── "Closed"       → CTA rendered as <button disabled>                       [grey, "غير متاح حالياً"]
```

### Gallery Section Visibility

```
attraction.images (combined with attraction.image)
    ├── length > 0  → ZooGallery renders
    └── length == 0 → ZooGallery returns null (section hidden)
```

### T&C Section Visibility

```
attraction.tags?.rules
    ├── length > 0  → ZooTermsGrid renders
    └── empty/null  → ZooTermsGrid returns null (section hidden)
```
