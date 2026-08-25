# Case Study Scroll Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the Works archive cursor, keep GSAP parallax only on each case study's hero image, and add a reversible scroll-charged handoff to the next project or the Works archive.

**Architecture:** Preserve `App.jsx` as the owner of routes, the transition curtain, and Lenis lifecycle. Put pure formatting and completion rules in `caseStudyMotion.js`, let `ProjectCaseStudyView.jsx` own ScrollTrigger progress and its one-shot lock, and keep visual behavior in the two existing component stylesheets.

**Tech Stack:** React 19, GSAP and ScrollTrigger loaded through the existing runtime, Lenis through the existing `window.portfolioLenis` integration, CSS, Node's built-in test runner, Vite SSR test loading.

**Spec:** `docs/superpowers/specs/2026-08-26-case-study-scroll-handoff-design.md`

## Global Constraints

- Hide the native cursor only over the large desktop project preview and only on fine-pointer devices.
- Keep the existing black circular arrow cue on the large preview.
- Keep the GSAP entrance crop and vertical parallax on the case-study hero image.
- Do not apply GSAP transforms, clipping, opacity reveals, or parallax to selected-screen figures or images.
- Keep selected-screen milestone activation and progress tracking powered by ScrollTrigger.
- Use a `120svh` runway with a sticky handoff panel and a horizontal progress line.
- Render `Scroll to continue`, a derived current milestone, and either the next milestone or `WORKS`.
- Complete only at normalized progress `0.98` or greater while scrolling downward.
- Reverse visual progress while scrolling upward and prevent repeated route changes with a one-shot ref lock.
- Disable automatic navigation for `prefers-reduced-motion: reduce` and preserve the manual button in all runtime states.
- Keep `App.jsx` as the only owner of stopping, resetting, and restarting Lenis during route transitions.

---

### Task 1: Restrict Cursor Hiding to the Large Works Preview

**Files:**
- Modify: `src/WorksArchiveView.test.js:49-56`
- Modify: `src/WorksArchiveView.jsx:163-225`

**Interfaces:**
- Consumes: the existing `data-hide-project-cursor` CSS contract in `WorksArchiveView.css`.
- Produces: exactly one `data-hide-project-cursor` target per desktop project panel, always on `.works-archive__hero`.

- [ ] **Step 1: Replace the broad cursor-count assertion with a structural failing test**

In `src/WorksArchiveView.test.js`, replace the current count of eight hidden-cursor targets with:

```js
    const hiddenCursorTargets = markup.match(/<button[^>]*data-hide-project-cursor[^>]*>/g) ?? [];
    assert.equal(hiddenCursorTargets.length, projects.length);
    hiddenCursorTargets.forEach((target) => {
      assert.match(target, /class="works-archive__hero project-link"/);
    });
    assert.doesNotMatch(markup, /class="works-archive__thumbnail project-link"[^>]*data-hide-project-cursor/);
    assert.doesNotMatch(markup, /class="works-archive__mobile-project"[\s\S]*?<button[^>]*data-hide-project-cursor/);
```

- [ ] **Step 2: Run the focused test and confirm the existing eight targets fail it**

Run: `node --test src/WorksArchiveView.test.js`

Expected: FAIL because the identity, thumbnail, and mobile buttons still opt into cursor hiding.

- [ ] **Step 3: Remove the cursor-hiding attribute from every non-hero target**

In `src/WorksArchiveView.jsx`, keep the attribute only on the large preview:

```jsx
<button
  type="button"
  className="works-archive__hero project-link"
  data-hide-project-cursor
  aria-label={`Open ${project.title}`}
  onClick={() => onProjectClick(project.id)}
  onMouseEnter={(event) => animateHero(event.currentTarget, true)}
  onMouseLeave={(event) => animateHero(event.currentTarget, false)}
  onFocus={(event) => animateHero(event.currentTarget, true)}
  onBlur={(event) => animateHero(event.currentTarget, false)}
  tabIndex={activeIndex === index ? 0 : -1}
>
```

Remove `data-hide-project-cursor` from the identity title button, every `.works-archive__thumbnail`, and each mobile project button. Do not change their click handlers or keyboard behavior. Leave the fine-pointer media query in `WorksArchiveView.css` unchanged.

- [ ] **Step 4: Run the focused test**

Run: `node --test src/WorksArchiveView.test.js`

Expected: PASS with two hidden-cursor targets for the two-project fixture.

- [ ] **Step 5: Commit the cursor fix**

```bash
git add my-portfolio/src/WorksArchiveView.jsx my-portfolio/src/WorksArchiveView.test.js
git commit -m "fix: stabilize works archive cursor"
```

---

### Task 2: Define Pure Hero and Handoff Motion Rules

**Files:**
- Modify: `src/caseStudyMotion.test.js:1-58`
- Modify: `src/caseStudyMotion.js:1-33`

**Interfaces:**
- Consumes: numeric ScrollTrigger progress in `[0, 1]`, ScrollTrigger direction, a current zero-based project index, and total project count.
- Produces: `CASE_STUDY_HANDOFF_THRESHOLD`, `clampHandoffProgress(value)`, `getCaseHeroParallaxMotion()`, `getHandoffLabels(currentIndex, totalCount)`, and `shouldCompleteHandoff({ progress, direction, isLocked, reducedMotion })`.

- [ ] **Step 1: Replace the selected-image motion test and add failing handoff-rule tests**

Update the imports in `src/caseStudyMotion.test.js` to:

```js
import {
  CASE_STUDY_HANDOFF_THRESHOLD,
  clampHandoffProgress,
  getCaseHeroParallaxMotion,
  getCaseMilestoneTrigger,
  getHandoffLabels,
  getMilestoneProgressMotion,
  restoreCaseStudyScroll,
  shouldCompleteHandoff,
  shouldInitializeCaseStudy,
} from './caseStudyMotion.js';
```

Delete the `getCaseImageRevealMotion` test and add:

```js
test('keeps parallax configuration on the hero image only', () => {
  assert.deepEqual(getCaseHeroParallaxMotion(), {
    yPercent: -5,
    ease: 'none',
    scrollTrigger: {
      start: 'top top+=80',
      end: 'bottom top',
      scrub: 0.8,
    },
  });
});

test('normalizes handoff progress into the ScrollTrigger range', () => {
  assert.equal(clampHandoffProgress(-0.4), 0);
  assert.equal(clampHandoffProgress(0.375), 0.375);
  assert.equal(clampHandoffProgress(1.4), 1);
  assert.equal(clampHandoffProgress(Number.NaN), 0);
});

test('derives intermediate and final handoff milestones from project position', () => {
  assert.deepEqual(getHandoffLabels(0, 2), {
    current: '01 / 02',
    destination: '02 / 02',
  });
  assert.deepEqual(getHandoffLabels(1, 2), {
    current: '02 / 02',
    destination: 'WORKS',
  });
  assert.deepEqual(getHandoffLabels(2, 3), {
    current: '03 / 03',
    destination: 'WORKS',
  });
});

test('completes only when a downward handoff reaches the threshold once', () => {
  assert.equal(CASE_STUDY_HANDOFF_THRESHOLD, 0.98);
  assert.equal(shouldCompleteHandoff({ progress: 0.97, direction: 1, isLocked: false, reducedMotion: false }), false);
  assert.equal(shouldCompleteHandoff({ progress: 0.98, direction: -1, isLocked: false, reducedMotion: false }), false);
  assert.equal(shouldCompleteHandoff({ progress: 0.98, direction: 1, isLocked: true, reducedMotion: false }), false);
  assert.equal(shouldCompleteHandoff({ progress: 1, direction: 1, isLocked: false, reducedMotion: true }), false);
  assert.equal(shouldCompleteHandoff({ progress: 0.98, direction: 1, isLocked: false, reducedMotion: false }), true);
});
```

- [ ] **Step 2: Run the motion tests and verify the new exports are missing**

Run: `node --test src/caseStudyMotion.test.js`

Expected: FAIL with missing-export errors for the hero and handoff helpers.

- [ ] **Step 3: Replace selected-image motion configuration with the pure hero and handoff helpers**

In `src/caseStudyMotion.js`, remove `getCaseImageRevealMotion` and add:

```js
export const CASE_STUDY_HANDOFF_THRESHOLD = 0.98;

export const clampHandoffProgress = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

export const getCaseHeroParallaxMotion = () => ({
  yPercent: -5,
  ease: 'none',
  scrollTrigger: {
    start: 'top top+=80',
    end: 'bottom top',
    scrub: 0.8,
  },
});

const formatMilestone = (position, total) => (
  `${String(position).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
);

export const getHandoffLabels = (currentIndex, totalCount) => {
  const total = Math.max(1, Math.trunc(totalCount));
  const index = Math.min(Math.max(0, Math.trunc(currentIndex)), total - 1);
  return {
    current: formatMilestone(index + 1, total),
    destination: index < total - 1 ? formatMilestone(index + 2, total) : 'WORKS',
  };
};

export const shouldCompleteHandoff = ({
  progress,
  direction,
  isLocked,
  reducedMotion,
}) => (
  !reducedMotion
  && !isLocked
  && direction > 0
  && clampHandoffProgress(progress) >= CASE_STUDY_HANDOFF_THRESHOLD
);
```

- [ ] **Step 4: Run the focused motion tests**

Run: `node --test src/caseStudyMotion.test.js`

Expected: PASS, including the existing milestone-axis, runtime-readiness, and Lenis-reset tests.

- [ ] **Step 5: Commit the pure motion rules**

```bash
git add my-portfolio/src/caseStudyMotion.js my-portfolio/src/caseStudyMotion.test.js
git commit -m "test: define case study handoff rules"
```

---

### Task 3: Make Selected Screens Static and Build the Scroll-Charged Handoff

**Files:**
- Modify: `src/ProjectCaseStudyView.test.js:1-52`
- Modify: `src/ProjectCaseStudyView.jsx:1-246`
- Modify: `src/ProjectCaseStudyView.css:68-219`

**Interfaces:**
- Consumes: `currentProjectIndex: number`, `projectCount: number`, the helpers from Task 2, `nextProject`, `onNext(id)`, and `onBack()`.
- Produces: `data-case-handoff`, `data-handoff-progress`, static selected-screen figures, and exactly one automatic navigation call per mounted project.

- [ ] **Step 1: Add failing markup tests for static screens and both handoff destinations**

Pass `currentProjectIndex: 0` and `projectCount: 2` to the existing render in `src/ProjectCaseStudyView.test.js`, then replace the old `Next project` assertion with:

```js
    assert.match(markup, /data-case-handoff=/);
    assert.match(markup, /data-handoff-progress=/);
    assert.match(markup, /Scroll to continue/);
    assert.match(markup, /01 \/ 02/);
    assert.match(markup, /02 \/ 02/);
    assert.match(markup, /aria-label="Continue to Vouch Dashboard"/);
    assert.equal((markup.match(/data-case-study-screen=/g) ?? []).length, 3);
    assert.equal((markup.match(/data-case-image-frame=/g) ?? []).length, 0);
    assert.equal((markup.match(/data-case-screen-image=/g) ?? []).length, 3);
```

Add a second render in the same test before the `finally` block:

```js
    const finalMarkup = renderToStaticMarkup(React.createElement(ProjectCaseStudyView, {
      project,
      nextProject: null,
      currentProjectIndex: 1,
      projectCount: 2,
      onBack: () => {},
      onNext: () => {},
    }));

    assert.match(finalMarkup, /02 \/ 02/);
    assert.match(finalMarkup, />WORKS</);
    assert.match(finalMarkup, /aria-label="Return to Works"/);
```

- [ ] **Step 2: Run the component test and verify the old footer and motion markers fail**

Run: `node --test src/ProjectCaseStudyView.test.js`

Expected: FAIL because the component does not accept project-position props or render the handoff runway, and selected screens still expose image-motion markers.

- [ ] **Step 3: Add handoff state, a one-shot destination action, and hero-only parallax**

Update the imports and component signature in `src/ProjectCaseStudyView.jsx`:

```jsx
import { useLayoutEffect, useRef, useState } from 'react';

import {
  clampHandoffProgress,
  getCaseHeroParallaxMotion,
  getCaseMilestoneTrigger,
  getHandoffLabels,
  getMilestoneProgressMotion,
  shouldCompleteHandoff,
  shouldInitializeCaseStudy,
} from './caseStudyMotion.js';

export default function ProjectCaseStudyView({
  project,
  nextProject,
  currentProjectIndex = 0,
  projectCount = 1,
  onBack,
  onNext,
  isLoaded = true,
}) {
  const rootRef = useRef(null);
  const handoffLockedRef = useRef(false);
  const [activeScreen, setActiveScreen] = useState(0);
  const [handoffProgress, setHandoffProgress] = useState(0);
  const gallery = project.gallery?.length ? project.gallery : [project.img];
  const handoffLabels = getHandoffLabels(currentProjectIndex, projectCount);

  const navigateToDestination = () => {
    if (handoffLockedRef.current) return;
    handoffLockedRef.current = true;
    if (nextProject) {
      onNext(nextProject.id);
      return;
    }
    onBack();
  };
```

At the beginning of the layout effect, reset `handoffLockedRef.current` and `handoffProgress`. Use the tested hero configuration instead of inline values:

```js
      const heroMotion = getCaseHeroParallaxMotion();
      gsap.to(heroImage, {
        yPercent: heroMotion.yPercent,
        ease: heroMotion.ease,
        scrollTrigger: {
          trigger: heroImage,
          ...heroMotion.scrollTrigger,
        },
      });
```

Inside `screens.forEach`, retain only milestone activation:

```js
      screens.forEach((screen, index) => {
        window.ScrollTrigger.create({
          trigger: screen,
          ...getCaseMilestoneTrigger(),
          onEnter: () => activateScreen(index),
          onEnterBack: () => activateScreen(index),
        });
      });
```

After the existing selected-screen progress trigger, create the handoff trigger:

```js
      const handoff = rootRef.current.querySelector('[data-case-handoff]');
      if (handoff) {
        window.ScrollTrigger.create({
          trigger: handoff,
          start: 'top bottom',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const progressValue = clampHandoffProgress(self.progress);
            setHandoffProgress(progressValue);
            if (shouldCompleteHandoff({
              progress: progressValue,
              direction: self.direction,
              isLocked: handoffLockedRef.current,
              reducedMotion,
            })) {
              navigateToDestination();
            }
          },
        });
      }
```

Keep `[project.id, gallery.length, isLoaded]` as the effect dependency list so progress updates do not recreate ScrollTriggers. `gsap.context(...).revert()` remains the cleanup path.

- [ ] **Step 4: Remove selected-screen animation hooks and render the handoff runway**

Change each selected-screen frame to static markup:

```jsx
<div className="case-study__screen-frame">
  <img data-case-screen-image src={source} alt={`${project.title} interface screen ${index + 1}`} />
</div>
```

Replace `.case-study__next` with:

```jsx
<footer className="case-study__handoff" data-case-handoff>
  <div className="case-study__handoff-panel">
    <p className="case-study__handoff-label">Scroll to continue</p>
    <div className="case-study__handoff-milestones" aria-hidden="true">
      <span>{handoffLabels.current}</span>
      <span>{handoffLabels.destination}</span>
    </div>
    <span className="case-study__handoff-track" aria-hidden="true">
      <span
        data-handoff-progress
        style={{ transform: `scaleX(${handoffProgress})` }}
      />
    </span>
    <button
      type="button"
      aria-label={nextProject ? `Continue to ${nextProject.title}` : 'Return to Works'}
      onClick={navigateToDestination}
    >
      <span>{nextProject ? nextProject.title : 'Return to Works'}</span>
      <span aria-hidden="true">↗</span>
    </button>
  </div>
</footer>
```

- [ ] **Step 5: Replace image-animation hints and the old footer styles**

In `src/ProjectCaseStudyView.css`, keep `.case-study__screen-frame { overflow: hidden; background: transparent; }`, remove `will-change` from selected-screen frames and images, and replace the `.case-study__next` rules with:

```css
.case-study__handoff {
  position: relative;
  min-height: 120svh;
  margin: 0 -3rem;
  border-top: 1px solid rgba(11, 11, 11, 0.22);
}

.case-study__handoff-panel {
  position: sticky;
  top: 0;
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
  background: var(--case-paper);
}

.case-study__handoff-label {
  margin: 0 0 auto;
  padding-top: 1rem;
  color: var(--case-muted);
  font-size: 0.7rem;
}

.case-study__handoff-milestones {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
}

.case-study__handoff-track {
  display: block;
  width: 100%;
  height: 1px;
  overflow: hidden;
  background: rgba(11, 11, 11, 0.18);
}

.case-study__handoff-track > span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--case-ink);
  transform: scaleX(0);
  transform-origin: left center;
}

.case-study__handoff button {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 2rem;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: clamp(2.8rem, 7vw, 7.5rem);
  letter-spacing: -0.07em;
  text-align: left;
  cursor: pointer;
}
```

Inside the `max-width: 768px` media query, replace the old footer override with:

```css
  .case-study__handoff { margin: 0 -1.5rem; }
  .case-study__handoff-panel { padding: 1.5rem; }
  .case-study__handoff button { font-size: clamp(2.65rem, 13vw, 4.6rem); }
```

- [ ] **Step 6: Run motion and component tests**

Run: `node --test src/caseStudyMotion.test.js src/ProjectCaseStudyView.test.js`

Expected: PASS. The hero configuration remains tested, selected-screen motion markers are absent, and both intermediate and final milestone labels render.

- [ ] **Step 7: Commit the case-study interaction**

```bash
git add my-portfolio/src/ProjectCaseStudyView.jsx my-portfolio/src/ProjectCaseStudyView.css my-portfolio/src/ProjectCaseStudyView.test.js
git commit -m "feat: add scroll charged project handoff"
```

---

### Task 4: Supply Project Position from App Routing

**Files:**
- Create: `src/caseStudyRouting.test.js`
- Modify: `src/App.jsx:1575-1576,1708-1716`

**Interfaces:**
- Consumes: `selectedProjectIndex` and `PROJECTS_DATA.length` already calculated in `App.jsx`.
- Produces: `currentProjectIndex` and `projectCount` props for `ProjectCaseStudyView`; existing `onNext` and `onBack` continue to invoke the transition-curtain route handlers.

- [ ] **Step 1: Write a failing App wiring test**

Create `src/caseStudyRouting.test.js`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('passes dynamic project position into the case study handoff', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');
  const caseStudyRender = source.match(/<ProjectCaseStudyView[\s\S]*?\/>/)?.[0] ?? '';

  assert.match(caseStudyRender, /currentProjectIndex=\{selectedProjectIndex\}/);
  assert.match(caseStudyRender, /projectCount=\{PROJECTS_DATA\.length\}/);
  assert.match(caseStudyRender, /onBack=\{handleCaseStudyBack\}/);
  assert.match(caseStudyRender, /onNext=\{handleNextCaseStudy\}/);
});
```

- [ ] **Step 2: Run the routing test and verify the position props are absent**

Run: `node --test src/caseStudyRouting.test.js`

Expected: FAIL on `currentProjectIndex` and `projectCount`.

- [ ] **Step 3: Pass project position without changing route ownership**

Update the project render in `src/App.jsx` to:

```jsx
<ProjectCaseStudyView
  isLoaded={isPageReady}
  project={selectedProject}
  nextProject={nextProject}
  currentProjectIndex={selectedProjectIndex}
  projectCount={PROJECTS_DATA.length}
  onBack={handleCaseStudyBack}
  onNext={handleNextCaseStudy}
/>
```

Do not add Lenis calls to `ProjectCaseStudyView`; `handleCaseStudyNavigation` remains the only transition path.

- [ ] **Step 4: Run the routing test and the complete automated suite**

Run: `node --test src/caseStudyRouting.test.js`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS with no cancelled or skipped tests.

Run: `npm run build`

Expected: TypeScript and Vite production build complete successfully.

- [ ] **Step 5: Commit App integration**

```bash
git add my-portfolio/src/App.jsx my-portfolio/src/caseStudyRouting.test.js
git commit -m "feat: connect project handoff routing"
```

---

## Browser Verification

- [ ] Start the site with `npm run dev -- --host 127.0.0.1`.
- [ ] Open `/works/` at a desktop viewport with a fine pointer.
- [ ] Hold the pointer stationary over the left title and thumbnail rail while scrolling; confirm the native cursor never disappears.
- [ ] Move onto the large right preview; confirm the native cursor hides and the black circular white-arrow cue appears.
- [ ] Open project `01`; confirm normal scrolling works immediately after the route curtain releases.
- [ ] Scroll the hero; confirm only the top hero image has vertical parallax.
- [ ] Scroll every selected screen; confirm images and frames remain static while the numbered milestone and its progress rail update.
- [ ] Reach the handoff runway; confirm the horizontal line fills and reverses with scroll direction.
- [ ] Stop below `98%`; confirm no navigation occurs.
- [ ] Scroll downward through `98%`; confirm the transition fires once and lands at project `02` at scroll position zero.
- [ ] Repeat at the end of project `02`; confirm the handoff returns to `/works/` and Works remains scrollable.
- [ ] Enable reduced motion; confirm auto-navigation is disabled and the manual destination button still navigates.
- [ ] Block or remove GSAP/ScrollTrigger in browser diagnostics; confirm the page remains scrollable and manual handoff navigation remains usable.

