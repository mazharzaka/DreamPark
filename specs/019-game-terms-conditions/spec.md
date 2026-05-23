# Feature Specification: Game Terms and Conditions (Tags)

**Feature Branch**: `019-game-terms-conditions`  
**Created**: 2026-05-16  
**Status**: Draft  
**Input**: User description: "اعمل في الصفحه شروط واحكام وخد data ضيفها في end point في key اسمه tags" (Create terms and conditions in the page, and take the data and add it in the endpoint in a key called tags.)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Terms and Conditions on Game Details Page (Priority: P1)

As a park visitor viewing a specific game's details, I want to see the "Terms and Conditions" (or safety rules/guidelines) so I can understand the restrictions and requirements before booking or queueing.

**Why this priority**: Enhances user safety and sets clear expectations, directly requested by the user.

**Independent Test**: Navigate to the details page of an attraction that has `tags` populated. The tags should be rendered under a "Terms and Conditions" section visually.

**Acceptance Scenarios**:

1. **Given** the user is on the Game Details page (`/[locale]/games/[id]`), **When** the page loads, **Then** it displays a section titled "Terms and Conditions" (localized appropriately).
2. **Given** the attraction data contains items in the `tags` array, **When** rendering the Terms and Conditions section, **Then** it displays each tag's `label` as a bullet point or rule card.
3. **Given** the attraction data has an empty or null `tags` array, **When** rendering the section, **Then** it should either hide the section or display a fallback message (e.g., "No specific conditions apply").

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render a "Terms and Conditions" section within the Game Details page (`app/[locale]/games/[id]/page.tsx`).
- **FR-002**: The data for this section MUST be sourced from the `tags` array of the existing `Attraction` API response (`GET /api/attractions/[id]`).
- **FR-003**: The section title MUST be localized (e.g., "Terms and Conditions" for `en`, "الشروط والأحكام" for `ar`).
- **FR-004**: Each item in the `tags` array MUST be displayed prominently, utilizing the `label` field of the tag object.
- **FR-005**: If the `tags` array is empty, the section should be hidden to maintain a clean UI.

### Key Entities

- **Attraction.tags**: Array of objects (`{ label: String, variant: String }`) that will be repurposed to store terms, conditions, or rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Terms and Conditions section successfully renders the `tags` data on the Game Details page without errors.
- **SC-002**: The section visually aligns with the existing premium design of the Game Details page (e.g., using glassmorphism or consistent styling).

## Assumptions

- We are repurposing the existing `tags` field in the Mongoose `Attraction` model to hold these terms and conditions, as explicitly requested by the user.
- The UI will iterate over `attraction.tags` and display `tag.label`. We do not need to alter the backend Mongoose model since `tags` is already defined as `[{ label: String, variant: String }]`.
- Translating the title "Terms and Conditions" will be handled dynamically within the component based on the Next.js `locale` prop or `next-intl`.
