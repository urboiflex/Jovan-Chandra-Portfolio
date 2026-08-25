# Case Study Scroll Handoff Design

## Goal

Refine the Works archive and project case studies so cursor behavior is stable, project imagery has a clear motion hierarchy, and reaching the end of a case study becomes a deliberate scroll-driven handoff to the next destination.

## Confirmed Cursor Bug

The Works archive currently applies `cursor: none` to the large project preview, the left-side project title, and every abstract thumbnail. When the pointer remains still on the left while the archive scrolls, those moving targets repeatedly pass beneath it. The computed cursor therefore alternates between `none` and `auto`, which produces the reported disappearance and reappearance.

Cursor hiding will be restricted to the large desktop preview that displays the custom circular arrow. Left titles and thumbnails will use the native pointer. Touch layouts remain unaffected.

## Case Study Motion Hierarchy

The hero image remains the single cinematic image treatment. It keeps its GSAP entrance crop and scroll-linked vertical parallax.

Selected-screen images become static. Their frame clipping, image scaling, image translation, and screen reveal transforms will be removed. ScrollTrigger remains responsible only for:

- selecting the active numbered screen milestone;
- filling the existing selected-screen progress track;
- coordinating the final project handoff.

Reduced-motion mode continues to render all content statically.

## Scroll-Charged Project Handoff

The existing next-project footer becomes a `120svh` runway containing a sticky handoff panel. The panel uses the current paper, ink, Helvetica typography, and hairline-rule language. No new accent color or ornamental graphic is introduced.

The panel contains:

- the label `Scroll to continue`;
- the current project milestone;
- a thin progress line that fills from 0 to 100 percent;
- the destination milestone.

For the first of two projects, the milestone reads `01 / 02 → 02 / 02`. For the last project, it reads `02 / 02 → WORKS`. The implementation derives all numbers from the project index and project count rather than hard-coding two projects.

ScrollTrigger maps the runway's scroll distance to normalized progress. Progress reverses when the user scrolls upward. When progress reaches the completion threshold while moving downward, a one-shot guard invokes the existing project transition:

- navigate to the next case study when one exists;
- return to the Works archive from the final case study.

The guard prevents repeated route changes while the transition is running. The existing button remains available inside the handoff panel for pointer, keyboard, and assistive-technology users. In reduced-motion mode, the progress treatment is static and automatic navigation is disabled; the button remains the only navigation action.

## Component Responsibilities

### `WorksArchiveView`

- Apply hidden-cursor behavior only to the large preview.
- Preserve the custom circular arrow and its hover animation.
- Keep titles and abstract thumbnails clickable with native cursor feedback.

### `ProjectCaseStudyView`

- Keep the hero entrance and parallax timeline.
- Create screen milestone triggers without selected-screen image transforms.
- Render the scroll-charged handoff panel.
- Maintain local handoff progress for its milestone indicator.
- Invoke `onNext` or `onBack` once when the charge completes.

### `caseStudyMotion`

- Provide pure helpers for handoff progress, destination labels, completion eligibility, and reduced-motion behavior.
- Keep ScrollTrigger thresholds and navigation decisions independently testable.

### `App`

- Pass current project index and total project count to the case study.
- Continue owning route transitions and Lenis reset/restart behavior.

## Interaction and Failure Handling

- A handoff can fire only when progress reaches the completion threshold and ScrollTrigger reports downward movement.
- A local ref locks the handoff immediately before invoking navigation.
- Changing projects resets handoff progress and the one-shot guard.
- If GSAP or ScrollTrigger is unavailable, the case study remains normally scrollable and the manual button remains functional.
- Route transition code remains the sole owner of stopping and restarting Lenis.

## Accessibility and Responsive Behavior

- The manual destination button remains in the document and retains a clear accessible name.
- Keyboard focus is never moved merely because scroll progress changes.
- Automatic navigation is disabled when `prefers-reduced-motion: reduce` is active.
- The handoff line is horizontal on all breakpoints to keep its meaning consistent.
- Cursor hiding is limited to fine-pointer devices.

## Testing and Verification

Automated tests will cover:

- only large archive previews opt into cursor hiding;
- selected-screen markup remains present while image-motion configuration is absent;
- hero parallax configuration remains enabled;
- handoff labels for intermediate and final projects;
- upward scrolling cannot complete a handoff;
- downward progress below the threshold cannot complete a handoff;
- downward progress at the threshold completes exactly once;
- reduced-motion mode disables automatic navigation;
- missing animation runtimes preserve manual navigation.

Browser verification will cover stationary-pointer scrolling on the Works archive, static selected screens, retained hero parallax, reversible charge progress, automatic navigation to the next project, final return to Works, and normal scrolling after every route transition.
