# Feature Specification: Brand Identity and Security Enforcement on Ticket/Pass Cards

**Feature Branch**: `031-watermark-pass-logo`  
**Created**: 2026-06-21  
**Status**: Draft  
**Input**: User description: "Act as an elite UI/UX Developer specializing in Tailwind CSS and dynamic image generation. Refactor my dynamic Ticket/Pass component to strictly enforce the "Dream Park" brand identity, implementing a secure watermark and a premium logo layout according to the "Editorial Joy" guidelines (no 1px lines, highly rounded). Modify the UI layout and saving mechanism strictly as follows: 1. BRAND LOGO INTEGRATION: In the header of the Pass card, place the Dream Park official branding layout. Align it cleanly based on the active locale (Left for LTR 'en', Right for RTL 'ar'). Wrap the logo in a smooth glassmorphic container ("bg-white/10 backdrop-blur-[10px] rounded-full p-2") to blend organically with the baseline color. 2. THE SECURITY WATERMARK: Inside the center of the card container (behind the QR code and ticket metadata), inject an absolute positioned, non-interactive overlay div acting as a repeating or large centered semi-transparent Watermark. Text/Asset: Use the official bilingual typography "DREAM PARK · دريم بارك". Styling: Set the color with extreme subtle opacity ("text-white/[0.03]" or "text-on-surface/[0.02]" depending on the background contrast) and rotate it by "-45deg" using Tailwind's "rotate-[-45deg]". 3. COMPLIANCE DURING SAVE/DOWNLOAD: Ensure that the watermark and logo layers are structurally bundled inside the DOM node that is passed to the HTML-to-Image / Canvas capturing library (like html2canvas or modern equivalents) so that when the user saves the pass, the final downloaded image contains the secure watermark and brand logo perfectly baked into the layout."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Ticket View (Priority: P1)

As a ticket holder, I want to see a premium, branded Ticket/Pass card with a clear logo and a security watermark, so that I can feel confident the ticket is official and secure.

**Why this priority**: Crucial for visual branding representation and establishing park security controls.

**Independent Test**: Load the active pass view or user profile bookings list and verify the presence of the logo in the correct locale alignment and the rotated semi-transparent watermark behind the metadata/QR code.

**Acceptance Scenarios**:

1. **Given** a user is viewing a LTR ('en') ticket, **When** the ticket is loaded, **Then** the Dream Park branding logo is aligned to the top-left of the card.
2. **Given** a user is viewing a RTL ('ar') ticket, **When** the ticket is loaded, **Then** the Dream Park branding logo is aligned to the top-right of the card.
3. **Given** any ticket layout is rendered, **When** inspected visually, **Then** a secure watermark displaying "DREAM PARK · دريم بارك" is visible in the background, rotated at -45 degrees, and positioned behind the QR code and text details without interfering with readability.

---

### User Story 2 - Premium Pass Export/Download (Priority: P2)

As a guest, I want to save my Ticket/Pass card to my device as an image, so that I have offline access to a fully-branded and secure version of my pass at the park entrance.

**Why this priority**: Offline access is a common guest requirement, and branding must be preserved in all exported formats.

**Independent Test**: Click the download/save button on a pass card, open the downloaded PNG file, and check that it contains the logo and watermark exactly as they appear in the UI.

**Acceptance Scenarios**:

1. **Given** a user clicks the download button on a ticket, **When** the download is generated, **Then** a PNG image file is saved.
2. **Given** the downloaded PNG ticket image is opened, **When** inspected, **Then** the Dream Park logo and the rotated "DREAM PARK · دريم بارك" watermark are perfectly rendered and baked into the image.

---

### Edge Cases

- **Contrast with dynamic ticket colors**: Different ticket tiers might have different background colors (e.g., custom colors). The watermark opacity must adapt to remain extremely subtle but visible across dark and light background variants.
- **RTL layout mirroring**: When switching languages, elements must swap alignment cleanly without breaks or overlaps.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render the Dream Park brand logo in the header of the Ticket/Pass card.
- **FR-002**: The logo container MUST be glassmorphic, using `bg-white/10 backdrop-blur-[10px] rounded-full p-2`.
- **FR-003**: The logo MUST align left for English (LTR) and right for Arabic (RTL).
- **FR-004**: The system MUST overlay a semi-transparent, non-interactive security watermark in the center background of the ticket card.
- **FR-005**: The watermark text MUST be "DREAM PARK · دريم بارك", rotated by -45 degrees.
- **FR-006**: When downloading or saving the ticket, the export process MUST capture the entire Ticket/Pass card layout, including the header, logo, metadata, QR code, and background watermark.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of downloaded pass images contain the Dream Park logo and security watermark.
- **SC-002**: Pass card layouts are highly rounded (no sharp corners) and contain zero 1px solid lines or borders, conforming to the "Editorial Joy" design guidelines.
- **SC-003**: Dynamic alignment of logo swaps instantly when changing languages (en vs ar).

## Assumptions

- We will install `html-to-image` or another lightweight HTML-to-Image library to accurately capture the HTML elements as a PNG.
- The watermark will be implemented via absolute positioning and CSS rotation.
