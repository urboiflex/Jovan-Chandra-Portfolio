# Monochrome Portfolio and Skills Accordion Design

Date: 2026-08-12
Status: Approved design; implementation not started

## 1. Objective

Transform the portfolio into a strictly monochrome experience using only black, white, and grey. Remove the existing red accent throughout the website and redesign the Skills section as a closed-by-default, single-open accordion inspired by the supplied reference.

The finished design should feel minimal, editorial, precise, and restrained. Visual hierarchy must come from typography, scale, spacing, opacity, borders, and motion rather than an accent color.

## 2. Existing Project Findings

- The application is a single-page React and Vite portfolio, with most page structure and styling currently contained in `src/App.jsx`.
- The primary page background is already near-black.
- The red accent `#E8383D` and equivalent RGB values are hard-coded extensively across text, hover states, particles, navigation, timelines, image overlays, selection styling, and decorative graphics.
- The current Skills section displays Frontend, Backend, and Tools simultaneously in three columns using rounded skill pills.
- Skill data already includes image URLs used for desktop cursor previews.
- The current typography combines Montserrat, Archivo, and Zen Old Mincho. The redesign will replace this mixture with one Helvetica-style typographic system.

## 3. Visual Direction

### 3.1 Palette

The website must not contain red or another chromatic accent. All interface colors should derive from the following tokens:

| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#0B0B0B` | Primary page background |
| `--color-surface` | `#111111` | Subtle raised or separated surfaces |
| `--color-text` | `#F5F5F2` | Primary text and active controls |
| `--color-text-secondary` | `#A3A3A3` | Supporting copy and inactive labels |
| `--color-text-muted` | `#737373` | Metadata and low-priority information |
| `--color-border` | `rgba(255, 255, 255, 0.16)` | Dividers and default outlines |
| `--color-border-strong` | `rgba(255, 255, 255, 0.42)` | Active and hover outlines |
| `--color-glow` | `rgba(255, 255, 255, 0.22)` | Restrained interactive glow |

All current red uses must be mapped deliberately rather than replaced blindly:

- Important red text becomes primary white.
- Supporting red labels become secondary grey where white would create too much competition.
- Red borders and progress indicators become white or translucent white.
- Red glows become low-opacity white glows.
- Red image overlays become neutral black or white luminosity overlays.
- Red particle colors become a controlled mix of white and grey.
- Text selection becomes a white background with black text.

No gradients or colored accents will be introduced as substitutes.

### 3.2 Typography

The typography is locked to a Helvetica-style sans-serif stack across the entire website:

```css
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
```

- Remove Montserrat, Archivo, and Zen Old Mincho from the visual system.
- Remove their Google Fonts import once no component depends on them.
- Use weight, scale, line height, case, and letter spacing to create hierarchy.
- Large display text should use Helvetica-style type with tight tracking and controlled line height.
- Body copy should remain light and readable, not ultra-thin on small screens.
- Utility labels may use uppercase and wider tracking, but only where they aid navigation or categorization.
- Japanese text may use the browser's appropriate sans-serif fallback while inheriting the monochrome styling.

### 3.3 Signature Element

The redesigned Skills accordion is the page's signature interaction: oversized Helvetica category titles separated by fine horizontal rules, with a quiet plus/minus control and only one category revealing its contents at a time.

## 4. Skills Section

### 4.1 Content

Retain the existing skill groups and data:

1. Frontend
2. Backend
3. Tools

Do not add unsupported skills or new categories as part of this change.

### 4.2 Initial and Active State

- All accordion items are closed when the page first loads.
- Selecting a closed item opens it.
- Opening an item automatically closes the previously open item.
- Selecting the currently open item closes it, returning the section to the all-closed state.
- At most one category may be open at any time.
- The interaction state can therefore be represented by one nullable category identifier.

### 4.3 Layout

The section keeps the existing portfolio content width and vertical rhythm while replacing the three-column pill layout.

```text
(04) SKILLS
────────────────────────────────────────────────────────────

Frontend                                                   +
────────────────────────────────────────────────────────────

Backend                                                    +
────────────────────────────────────────────────────────────

Tools                                                      +
────────────────────────────────────────────────────────────
```

Expanded state:

```text
Frontend                                                   −

HTML                         TypeScript
CSS                          React.js
Next.js                      Tailwind CSS

────────────────────────────────────────────────────────────
Backend                                                    +
────────────────────────────────────────────────────────────
Tools                                                      +
────────────────────────────────────────────────────────────
```

- Category headers span the available width and act as the click target.
- Titles are large, left-aligned, and set in Helvetica-style type.
- Plus and minus controls align to the right.
- Thin neutral dividers separate every category.
- Expanded skills use a clean text grid rather than rounded pills.
- Desktop uses two or three columns according to available width.
- Mobile collapses skill content to one or two columns without horizontal scrolling.
- The category header remains a minimum of 44 pixels tall for touch accessibility.

### 4.4 Interaction and Motion

- Opening and closing uses a restrained height and opacity transition.
- The plus symbol transitions into a minus symbol without decorative spinning.
- Category titles brighten from secondary grey to primary white on hover, focus, and open states.
- The divider associated with the active item may brighten slightly.
- Motion should feel precise and quick, approximately 300–450 milliseconds with a smooth ease-out curve.
- Under `prefers-reduced-motion: reduce`, content changes state immediately or with opacity only.
- Existing skill cursor-image previews may remain on pointer devices when hovering individual skill names.
- Cursor-image previews must be disabled on touch devices and must not be required to understand the content.

### 4.5 Accessibility

- Each accordion header must be a native `button`.
- Each button must expose `aria-expanded` and `aria-controls`.
- Each content panel must have a stable ID and an accessible relationship to its header.
- Keyboard users can move through headers with normal Tab navigation and toggle one using Enter or Space.
- Focus indicators use a visible white outline and must not rely only on color.
- Closed panels must not expose hidden interactive content to keyboard navigation or assistive technology.
- Text and divider contrast must remain legible against the near-black background.

## 5. Global Monochrome Behavior

The color change applies to the entire website, including:

- Loader and progress indicators
- Navigation active states and underlines
- Hero labels, separators, and interactive letters
- About and motivation hover states
- Image overlays
- Skills content and cursor previews
- Education timeline, nodes, dates, and hover states
- Experience cards and roles
- Awards and gallery labels
- Project titles, metadata, links, and detail views
- Contact punctuation, location, social links, and call-to-action effects
- Custom cursor particles and decorative orbital graphics
- Text selection

Interactive hierarchy should follow this order:

1. Primary white for active or important content
2. Light grey for normal content
3. Mid-grey for metadata and inactive content
4. Translucent white for borders and effects

White glow must be used sparingly so the interface remains sharp rather than neon.

## 6. Component and State Design

The implementation should introduce a dedicated Skills accordion component or a clearly isolated section within the existing page.

Recommended internal model:

```text
skillGroups[]
  id
  label
  skills[]

openSkillGroup: string | null
```

The toggle behavior is:

```text
selected ID equals open ID → set null
otherwise                  → set selected ID
```

Color values should be centralized as CSS custom properties or equivalent theme constants. New JSX must consume these shared values or semantic utility classes instead of introducing repeated color literals.

This task should avoid unrelated application restructuring. The large `App.jsx` file may be split only where necessary to keep the accordion and its data understandable and testable.

## 7. Responsive Design

### Desktop

- Preserve generous section spacing.
- Use large accordion headings similar in scale and confidence to the reference.
- Expanded skills form a balanced multi-column grid.
- Hover and cursor-preview interactions are available.

### Tablet

- Reduce heading size while keeping full-width headers.
- Use a two-column expanded grid.
- Maintain comfortable touch targets.

### Mobile

- Use compact vertical spacing and readable heading sizes.
- Use one or two skill columns depending on viewport width.
- Disable custom cursor-dependent effects.
- Ensure opening an accordion does not cause sideways overflow or abrupt scroll jumps.

## 8. Verification Requirements

Implementation is complete only when all of the following are verified:

- No red hex, RGB, RGBA, Tailwind red utility, or red visual asset remains in the application UI.
- The website uses the approved Helvetica-style font stack globally.
- Montserrat, Archivo, and Zen Old Mincho imports and explicit usages are removed.
- Every skill category is closed on initial load.
- Opening one category closes any other open category.
- Clicking the open category closes it.
- Accordion controls work with mouse, touch, Enter, and Space.
- `aria-expanded` accurately reflects each category's state.
- Focus styling is visible.
- Reduced-motion preferences are respected.
- Desktop, tablet, and mobile layouts remain readable and free of horizontal overflow.
- Existing pages and navigation continue to work.
- Lint and production build commands pass.

## 9. Out of Scope

- Adding new portfolio sections or skill categories
- Rewriting portfolio copy
- Replacing project images
- Changing deployment configuration
- Introducing a light theme
- Adding another chromatic accent
- Redesigning the site into an exact pixel-for-pixel copy of the reference

The supplied image is directional inspiration for hierarchy and accordion interaction, not a mandate to copy its entire page composition.
