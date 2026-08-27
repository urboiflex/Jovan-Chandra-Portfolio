import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

import {
  getNextOpenSkillGroup,
  getSkillPanelTransition,
  getLineTextContrastState,
  getStableLineContrastState,
  getLineSampleCount,
  getLineProgressFromDashOffset,
  getLineDashOffsetForProgress,
  SKILL_GROUPS,
  SKILLS_LINE_SCROLL_TRIGGER,
} from './skills.js';

test('opens a closed skill group', () => {
  assert.equal(getNextOpenSkillGroup(null, 'frontend'), 'frontend');
});

test('opening another skill group replaces the current group', () => {
  assert.equal(getNextOpenSkillGroup('frontend', 'backend'), 'backend');
});

test('selecting the open skill group keeps one group open', () => {
  assert.equal(getNextOpenSkillGroup('frontend', 'frontend'), 'frontend');
});

test('removes accordion motion when reduced motion is preferred', () => {
  assert.deepEqual(getSkillPanelTransition(true), { duration: 0 });
  assert.deepEqual(getSkillPanelTransition(false), {
    duration: 0.45,
    ease: [0.76, 0, 0.24, 1],
  });
});

test('uses the reference scroll range and smoothing for the skills line', () => {
  assert.deepEqual(SKILLS_LINE_SCROLL_TRIGGER, {
    start: 'top 70%',
    end: 'bottom 20%',
    scrub: 1,
  });
});

test('switches dark text to white only while a matching dark line overlaps it', () => {
  assert.equal(getLineTextContrastState({
    lineColor: 'rgb(11, 11, 11)',
    textColor: 'rgb(11, 11, 11)',
    overlaps: true,
  }), 'light');
  assert.equal(getLineTextContrastState({
    lineColor: 'rgb(11, 11, 11)',
    textColor: 'rgb(11, 11, 11)',
    overlaps: false,
  }), 'dark');
  assert.equal(getLineTextContrastState({
    lineColor: 'rgb(11, 11, 11)',
    textColor: 'rgb(255, 255, 255)',
    overlaps: true,
  }), 'dark');
});

test('holds white text through transient missed overlap samples', () => {
  const entered = getStableLineContrastState({
    currentState: 'dark',
    nextState: 'light',
    clearFrames: 0,
  });
  const firstMiss = getStableLineContrastState({
    currentState: entered.state,
    nextState: 'dark',
    clearFrames: entered.clearFrames,
  });
  const secondMiss = getStableLineContrastState({
    currentState: firstMiss.state,
    nextState: 'dark',
    clearFrames: firstMiss.clearFrames,
  });
  const settled = getStableLineContrastState({
    currentState: secondMiss.state,
    nextState: 'dark',
    clearFrames: secondMiss.clearFrames,
  });

  assert.equal(entered.state, 'light');
  assert.equal(firstMiss.state, 'light');
  assert.equal(secondMiss.state, 'light');
  assert.equal(settled.state, 'dark');
});

test('keeps scroll contrast sampling within a lightweight frame budget', () => {
  assert.equal(getLineSampleCount(0), 0);
  assert.ok(getLineSampleCount(3004.42) <= 64);
  assert.ok(getLineSampleCount(3004.42) >= 2);
});

test('preserves the current line progress while accordion geometry refreshes', () => {
  const lineLength = 3004;
  const currentOffset = 1200;
  const progress = getLineProgressFromDashOffset(currentOffset, lineLength);

  assert.ok(progress > 0 && progress < 1);
  assert.ok(Math.abs(getLineDashOffsetForProgress(progress, lineLength) - currentOffset) < 0.001);
  assert.equal(getLineProgressFromDashOffset(lineLength, lineLength), 0);
  assert.equal(getLineProgressFromDashOffset(0, lineLength), 1);
});

test('debounces accordion geometry refreshes without resetting the drawn line', async () => {
  const source = await readFile(new URL('./SkillsAccordion.jsx', import.meta.url), 'utf8');

  assert.match(source, /const refreshFrameRef = useRef\(null\);/);
  assert.match(source, /refreshFrameRef\.current = window\.requestAnimationFrame/);
  assert.match(source, /getStableLineContrastState\(/);
  assert.match(source, /getLineProgressFromDashOffset\(currentOffset, lineLength\)/);
  assert.match(source, /getLineDashOffsetForProgress\(currentProgress, lineLength\)/);
});

test('keeps the approved skill group order', () => {
  assert.deepEqual(
    SKILL_GROUPS.map(({ id, label }) => ({ id, label })),
    [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
      { id: 'animation', label: 'Animation' },
      { id: 'database', label: 'Database' },
      { id: 'tools', label: 'Tools' },
      { id: 'design', label: 'Design' },
    ],
  );
});

test('keeps the requested skill inventory grouped by discipline', () => {
  assert.deepEqual(
    SKILL_GROUPS.map(({ label, skills }) => ({ label, skills: skills.map(({ name }) => name) })),
    [
      { label: 'Frontend', skills: ['HTML', 'CSS', 'Javascript', 'Typescript', 'React', 'Next.js', 'Tailwind', 'Bootstrap'] },
      { label: 'Backend', skills: ['Node.js', 'Express.js', 'Python', 'Java', 'C#', '.NET'] },
      { label: 'Animation', skills: ['GSAP', 'Lenis', 'WebGL'] },
      { label: 'Database', skills: ['MySQL', 'PostgreSQL', 'Supabase'] },
      { label: 'Tools', skills: ['Vercel', 'Github', 'Cloudflare'] },
      { label: 'Design', skills: ['Figma', 'Canva'] },
    ],
  );
});

test('renders the first skill group open with accessible controls', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: SkillsAccordion } = await vite.ssrLoadModule('/src/SkillsAccordion.jsx');
    const markup = renderToStaticMarkup(React.createElement(SkillsAccordion));

    assert.equal((markup.match(/<button/g) ?? []).length, 6);
    assert.equal((markup.match(/aria-expanded="false"/g) ?? []).length, 5);
    assert.equal((markup.match(/aria-expanded="true"/g) ?? []).length, 1);
    assert.equal((markup.match(/aria-controls="skills-panel-/g) ?? []).length, 6);
    assert.equal((markup.match(/role="region"/g) ?? []).length, 1);
    assert.match(markup, /class="skills-stage/);
    assert.match(markup, /class="skills-layout/);
    assert.match(markup, /class="skills-intro/);
    assert.match(markup, /class="skills-groups/);
    assert.match(markup, /class="skills-fluid-line-svg/);
    assert.match(markup, /class="skills-intro__contrast-copy/);
    assert.match(markup, /id="skills-fluid-line"/);
    assert.match(markup, /viewBox="0 0 1400 1400"/);
    assert.doesNotMatch(markup, /skills-intro__arrow/);
    assert.doesNotMatch(markup, /\(04\)/);
    assert.match(markup, /aria-label="From ideas to working digital products\."/);
    assert.match(markup, /I work across design, development, data, and automation, choosing the right tools for each problem\./);
    assert.match(markup, /aria-label="Contact me"/);
    assert.equal((markup.match(/split-hover-text__char/g) ?? []).length, 'Contact me'.length);
    assert.match(markup, /duration-\[600ms\]/);
    assert.match(markup, /ease-\[cubic-bezier\(0\.87,0,0\.13,1\)\]/);
    assert.match(markup, /transition-delay:252ms/);
  } finally {
    await vite.close();
  }
});

test('implementation sources contain no legacy accent or font references', async () => {
  const sources = await Promise.all([
    readFile(new URL('./App.jsx', import.meta.url), 'utf8'),
    readFile(new URL('./index.css', import.meta.url), 'utf8'),
    readFile(new URL('./SkillsAccordion.jsx', import.meta.url), 'utf8').catch(() => ''),
  ]);
  const combinedSource = sources.join('\n');
  const forbidden = [
    /#E8383D/i,
    /232,\s*56,\s*61/,
    /255,\s*183,\s*197/,
    /255,\s*223,\s*100/,
    /Montserrat/,
    /Archivo/,
    /Zen_Old_Mincho/,
  ];

  for (const pattern of forbidden) {
    assert.doesNotMatch(combinedSource, pattern);
  }
});

test('accordion focus styling overrides the global rectangular outline', async () => {
  const styles = await readFile(new URL('./index.css', import.meta.url), 'utf8');

  assert.match(styles, /\.skills-accordion-button:focus-visible\s*\{/);
  assert.match(styles, /\.skills-accordion-button:focus-visible[\s\S]*?outline:\s*none/);
});

test('provides a contrast state for the line-overlap heading', async () => {
  const styles = await readFile(new URL('./index.css', import.meta.url), 'utf8');

  assert.match(styles, /\.skills-intro__contrast-copy\s*\{[\s\S]*?clip-path/);
  assert.match(styles, /\.skills-intro__contrast-copy\s*\{[\s\S]*?color:\s*#fff/);
  assert.match(styles, /\.skills-intro__contrast-copy\.is-line-contrast/);
});

test('switches contrast color without an opacity flash at the line endpoint', async () => {
  const styles = await readFile(new URL('./index.css', import.meta.url), 'utf8');
  const contrastBlock = styles.match(/\.skills-intro__contrast-copy\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.doesNotMatch(contrastBlock, /transition:\s*opacity/);
});

test('uses the shared page background with black ink', async () => {
  const styles = await readFile(new URL('./index.css', import.meta.url), 'utf8');
  const skillsStageBlock = styles.match(/\.skills-stage\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(skillsStageBlock, /color:\s*#0b0b0b;/);
  assert.match(skillsStageBlock, /background:\s*var\(--color-bg\);/);
  assert.match(styles, /\.skill-group\s*\{[\s\S]*?rgba\(11,\s*11,\s*11,\s*0\.16\)/);
  assert.match(styles, /\.skill-group__item\s*\{[\s\S]*?rgba\(11,\s*11,\s*11,\s*0\.48\)/);
});

test('keeps the fluid line endpoint close to the bottom of Skills', async () => {
  const styles = await readFile(new URL('./index.css', import.meta.url), 'utf8');
  const lineBlock = styles.match(/\.skills-fluid-line-svg\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.match(lineBlock, /top:\s*-55vh/);
  assert.match(lineBlock, /height:\s*calc\(100% \+ 82vh\)/);
  assert.doesNotMatch(lineBlock, /height:\s*calc\(100% \+ 100vh\)/);
});

test('renders the contact CTA without an underline', async () => {
  const styles = await readFile(new URL('./index.css', import.meta.url), 'utf8');
  const contactBlock = styles.match(/\.skills-intro__contact\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  assert.doesNotMatch(contactBlock, /border-bottom/);
  assert.doesNotMatch(contactBlock, /text-decoration:\s*underline/);
  assert.match(contactBlock, /font-size:\s*clamp\(0\.9rem,\s*1\.05vw,\s*1\.05rem\)/);
});

test('renders the cinematic name intro without a progress counter', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));

    assert.match(markup, /aria-label="Jovan Chandra"/);
    assert.equal((markup.match(/name-intro__letter--given/g) ?? []).length, 5);
    assert.equal((markup.match(/name-intro__letter--surname/g) ?? []).length, 7);
    assert.equal((markup.match(/class="name-intro__letter /g) ?? []).length, 12);
    assert.match(markup, /name-intro[^"']*pointer-events-none/);

    const letterTags = markup.match(/<span class="name-intro__letter[^>]+>/g) ?? [];
    const revealOrders = (word) => letterTags
      .filter((tag) => tag.includes(`name-intro__letter--${word}`))
      .map((tag) => {
        const order = tag.match(/data-intro-order="(\d+)"/)?.[1];
        return order === undefined ? null : Number(order);
      });

    assert.deepEqual(revealOrders('given'), [4, 3, 2, 1, 0]);
    assert.deepEqual(revealOrders('surname'), [0, 1, 2, 3, 4, 5, 6]);
    assert.doesNotMatch(markup, />0<\/span><span[^>]*>%/);
  } finally {
    await vite.close();
  }
});
