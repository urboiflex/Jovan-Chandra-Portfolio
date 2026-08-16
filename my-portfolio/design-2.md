# Light Editorial Hero Redesign

**Status:** Approved design specification  
**Date:** 2026-08-16  
**Reference:** Oliver Gareis portfolio, interpreted for Jovan Chandra rather than reproduced

## Objective

Transform the portfolio into a clean light experience and replace only the current home hero with an oversized editorial composition. The hero should feel appropriate for an Awwwards-style portfolio while remaining readable, personal, and focused on Jovan's services.

The redesign uses typography, spacing, and motion as its visual identity. It does not use an ornamental card, monogram, portrait, illustration, or decorative object.

## Scope

### Included

- Recolor every current page and section to a warm-white, black, and grey palette.
- Redesign the home hero as an editorial split-stage composition.
- Preserve the current floating navigation structure, controls, behavior, and animation while adapting its colors to the light theme.
- Preserve the existing cinematic intro, including its black background and its transition into the page.
- Add GSAP entrance and scroll motion to the redesigned hero.
- Preserve the existing structure and content of all sections below the hero; these sections receive the light palette but are not otherwise redesigned in this phase.
- Support desktop, tablet, mobile, and reduced-motion users.

### Excluded

- Redesigning About, Motivation, Education, Experience, Skills, Works, Gallery, Project Detail, or Contact layouts.
- Changing navigation information architecture or interactions.
- Adding a hero card, seal, monogram, portrait, illustration, video, or WebGL treatment.
- Adding new service detail pages or calls to action.
- Reworking the cinematic intro animation.

## Reference Interpretation

The reference establishes four useful principles:

1. A very small metadata layer makes oversized display type feel even larger.
2. The name occupies multiple vertical stages instead of being compressed into a conventional single-screen heading.
3. Services sit inside intentional negative space between the name rows.
4. Motion is tied to scrolling and typography rather than decorative interface chrome.

The implementation will adopt these principles without copying the reference's name arrangement, ornament, navigation, or artwork.

## Visual System

### Colors

- Page background: warm white `#f5f5f2`.
- Primary text: near black `#0b0b0b`.
- Secondary text: neutral grey `#5e5e5a`.
- Muted text: `#767672`, limited to large text and nonessential labels.
- Borders and separators: `rgba(11, 11, 11, 0.16)`.
- Interactive emphasis: black and dark grey only.
- Red remains prohibited.

All existing hard-coded dark surfaces, white text utilities, translucent white borders, shadows, selection colors, cursor colors, and section backgrounds must be migrated deliberately. The result must not depend on a broad inversion filter or a fragile global override.

### Typography

- Global interface and body type remains Helvetica Neue, Helvetica, Arial, sans-serif.
- The giant hero name uses the existing editorial token based on Bodoni Moda.
- `JOVAN` and `CHANDRA` use uppercase display styling with tight optical tracking and line height.
- Metadata, service labels, navigation, and body copy remain Helvetica.
- The quote uses Bodoni Moda italic at a small editorial scale.

## Hero Content and Hierarchy

The hero appears after the existing cinematic intro and contains these elements in this order:

1. `AVAILABLE FOR FREELANCE` in small uppercase Helvetica.
2. The quote: `I design digital experiences that make complex ideas feel clear.`
3. Oversized `JOVAN`, spanning nearly the full viewport width.
4. A services band with:
   - `SERVICES` as the small left-side label.
   - `WEB DESIGN`
   - `E-COMMERCE`
   - `PRODUCT`
5. Oversized `CHANDRA`, spanning nearly the full viewport width.
6. A controlled transition into the existing About content.

The two name rows and the services band form one semantic hero heading region. The visual composition may extend beyond one viewport, but it must not trap scrolling or obscure the navigation.

## Layout

### Desktop

- The hero uses a full-bleed layout rather than the current constrained two-column hero grid.
- `JOVAN` occupies the first dominant row.
- The quote sits independently on the left within the negative space above or beside the first name row.
- The services band creates vertical breathing room between the two name rows.
- `CHANDRA` occupies the second dominant row.
- Display text uses viewport-responsive sizing with an upper bound to avoid uncontrolled clipping on ultrawide screens.

### Tablet and Mobile

- Content order remains identical.
- Both name rows scale to the available width without horizontal document overflow.
- The quote and services stack vertically between the name rows.
- Services remain left-aligned and readable rather than becoming a marquee.
- The floating navigation remains operable above the hero.
- No character may be unintentionally cropped at the viewport edge.

## GSAP Motion

The existing `isLoaded` signal remains the start gate so hero motion begins during the intro's curtain exit rather than behind it.

### Entrance

- `AVAILABLE FOR FREELANCE`, the quote, and the services band reveal through short masked upward movements with opacity.
- `JOVAN` enters as a controlled per-letter wave from below.
- `CHANDRA` enters later as its row approaches the viewport, also using a per-letter wave.
- Staggers are short enough that each word reads as one gesture rather than a typing animation.

### Scroll behavior

- `JOVAN` drifts slightly upward and tightens its letter spacing as the user scrolls.
- `CHANDRA` moves at a subtly different vertical rate to create depth.
- Scroll motion uses transform and opacity properties suitable for compositor acceleration.
- The services list stays stable and readable.
- There is no continuous marquee, automatic looping, spinning object, or horizontal scroll hijacking.

### Reduced motion and failure behavior

- `prefers-reduced-motion: reduce` disables stagger, parallax, and tracking interpolation.
- Hero content is visible in its final state without waiting for animation.
- Base CSS renders meaningful content before GSAP initializes.
- GSAP timelines and ScrollTriggers are scoped with context or match-media cleanup and are removed on unmount.

## Component Architecture

### `EditorialHero`

A focused component extracted from `HomeView` will own:

- Hero markup and content.
- Per-letter display spans with an accessible full-name label.
- GSAP entrance timeline.
- ScrollTrigger behavior.
- Desktop/mobile motion rules.
- Reduced-motion behavior and cleanup.

The component accepts the existing `isLoaded` boolean. It does not own navigation, Lenis, global script loading, or page routing.

### `HomeView`

`HomeView` renders `EditorialHero` followed by the existing sections. It keeps the animation logic for later sections unchanged except where color migration requires class updates.

### Theme tokens

Shared CSS variables define the light palette and editorial font. Component classes and existing utilities are migrated to those tokens or equivalent explicit light-theme utilities. The navigation keeps its component boundary and event handlers.

## Accessibility

- The visual per-letter hero name exposes `Jovan Chandra` as a single accessible name.
- Decorative letter spans are hidden from assistive technologies.
- Text contrast meets WCAG AA for its size.
- Focus indicators remain visible on white surfaces.
- Motion is never required to reveal or understand content.
- The document has no horizontal overflow at supported mobile widths.
- Heading order remains logical after extracting the hero.

## Implementation Sequence

1. Establish light-theme tokens and migrate all current sections to white, black, and grey without changing their layouts.
2. Extract and render the static `EditorialHero` hierarchy while preserving navigation and intro behavior.
3. Add GSAP entrance and scroll motion with reduced-motion handling.
4. Verify and tune desktop, tablet, and mobile typography, spacing, contrast, and section boundaries.

Each stage must pass automated checks before the next stage begins.

## Verification

### Automated

- Render test confirms the hero hierarchy, exact service labels, quote, and accessible name.
- Tests confirm hero letters are decorative while the full name remains accessible.
- Theme regression test rejects legacy red values and unintended dark-section backgrounds.
- Reduced-motion behavior has a deterministic no-motion path.
- Existing skills accordion and navigation tests remain green.
- ESLint passes.
- Production build passes.

### Browser

- Desktop verification at a standard 1440px-class viewport.
- Tablet verification near the primary responsive breakpoint.
- Mobile verification at 390px width.
- No horizontal overflow or unintended name clipping.
- Intro exits into the white hero without a flash of the previous dark theme.
- Navigation opens, closes, and routes exactly as before.
- All sections use the light palette with readable contrast.
- ScrollTriggers do not duplicate after reload or navigation.
- Reduced-motion rendering shows all content immediately.

## Acceptance Criteria

The phase is complete when:

1. The whole current website is white, black, and grey with no red accent.
2. Only the hero layout has been structurally redesigned.
3. The hero reads in this order: availability, quote, `JOVAN`, services, `CHANDRA`.
4. The service list contains exactly Web Design, E-Commerce, and Product.
5. The hero uses Bodoni Moda for the name and Helvetica for supporting information.
6. The hero contains no decorative card or object.
7. GSAP provides restrained entrance and scroll motion with cleanup and reduced-motion support.
8. The current navigation and intro behavior remain intact.
9. Desktop and mobile layouts have no horizontal overflow or accidental clipping.
10. Tests, lint, and production build pass.
