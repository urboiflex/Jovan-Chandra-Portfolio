import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer as createViteServer } from 'vite';

import { getCinematicContactMotion } from './contactMotion.js';

test('defines the desktop contact choreography used by the reference motion', () => {
  const motion = getCinematicContactMotion(false);

  assert.equal(motion.enableScrollMotion, true);
  assert.equal(motion.sectionMinHeight, '180vh');
  assert.equal(motion.takeoverDistance, 18);
  assert.equal(motion.surfaceTakeoverDistance, 100);
  assert.equal(motion.surfaceHeight, '180vh');
  assert.equal(motion.takeoverStart, 'top bottom');
  assert.equal(motion.takeoverEnd, 'top 62%');
  assert.equal(motion.titleRevealAt, 0.18);
  assert.equal(motion.surfaceColor, '#020108');
  assert.equal(motion.footerExitSurfaceTravel, -2.1);
  assert.equal(motion.mainStageStart, 'top top');
  assert.equal(motion.mainStageEnd, 'bottom bottom');
  assert.equal(motion.mainStageTravel, -0.16);
  assert.equal(motion.footerExitStageTravel, -0.62);
  assert.equal(motion.footerExitLinksAt, 0.46);
  assert.equal(motion.footerExitLinksClipDuration, 0.52);
  assert.equal(motion.footerExitLinksCounterTravel, 0.75);
  assert.equal(motion.footerExitTitleAt, 0.18);
  assert.equal(motion.footerExitTitleClipDuration, 0.45);
  assert.equal(motion.footerHeight, '100vh');
  assert.equal(motion.footerParallaxStart, 'bottom bottom');
  assert.equal(motion.footerParallaxEnd, 'bottom 35%');
  assert.equal(motion.footerParallaxFrom, -18);
  assert.equal(motion.footerParallaxTo, 0);
  assert.equal(motion.footerSceneFrom, 12);
  assert.equal(motion.footerSceneTo, 0);
  assert.equal(motion.titleStartX, '110vw');
  assert.equal(motion.titleAt, 0.18);
  assert.equal(motion.titleDuration, 0.55);
  assert.equal(motion.pairAt, 0.22);
  assert.equal(motion.pairDuration, 0.65);
  assert.equal(motion.secondPairOffset, 0.07);
  assert.deepEqual(motion.frameTravel, { first: [1.1, -1.4], second: [1.3, -1.4] });
  assert.deepEqual(motion.copyTravel, { first: [1.1, -1.65], second: [1.1, -1.4] });
  assert.deepEqual(motion.imageTravel, [-30, 30]);
});

test('keeps the sticky Contact stage moving through the main and footer phases', () => {
  const motion = getCinematicContactMotion(false);

  assert.ok(motion.mainStageTravel < 0);
  assert.ok(motion.footerExitStageTravel < motion.mainStageTravel);
  assert.ok(motion.mainStageTravel - motion.footerExitStageTravel <= 0.5);
});

test('keeps the delayed second frame faster than the first reference frame', () => {
  const motion = getCinematicContactMotion(false);
  const firstDistance = motion.frameTravel.first[0] - motion.frameTravel.first[1];
  const secondDistance = motion.frameTravel.second[0] - motion.frameTravel.second[1];

  assert.ok(motion.secondPairOffset > 0);
  assert.ok(secondDistance / motion.pairDuration > firstDistance / motion.pairDuration);
});

test('does not expose a differently colored outer frame behind image 2', async () => {
  const css = await readFile(new URL('./CinematicContactSection.css', import.meta.url), 'utf8');
  const frameRule = css.match(/\.cinematic-contact__frame\s*\{(?<body>[\s\S]*?)\}/)?.groups?.body;

  assert.ok(frameRule);
  assert.match(frameRule, /background:\s*transparent\s*;/);
});

test('disables cinematic contact motion for reduced-motion users', () => {
  const motion = getCinematicContactMotion(true);

  assert.deepEqual(motion, {
    enableScrollMotion: false,
    sectionMinHeight: 'auto',
    takeoverDistance: 0,
    surfaceTakeoverDistance: 0,
    surfaceHeight: 'auto',
    takeoverStart: null,
    takeoverEnd: null,
    titleRevealAt: 0,
    surfaceColor: '#020108',
    footerExitSurfaceTravel: 0,
    mainStageStart: null,
    mainStageEnd: null,
    mainStageTravel: 0,
    footerExitStageTravel: 0,
    footerExitLinksAt: 0,
    footerExitLinksClipDuration: 0,
    footerExitLinksCounterTravel: 0,
    footerExitTitleAt: 0,
    footerExitTitleClipDuration: 0,
    footerHeight: 'auto',
    footerParallaxStart: null,
    footerParallaxEnd: null,
    footerParallaxFrom: 0,
    footerParallaxTo: 0,
    footerSceneFrom: 0,
    footerSceneTo: 0,
    titleStartX: 0,
    titleAt: 0,
    titleDuration: 0,
    pairAt: 0,
    pairDuration: 0,
    secondPairOffset: 0,
    frameTravel: { first: [0, 0], second: [0, 0] },
    copyTravel: { first: [0, 0], second: [0, 0] },
    imageTravel: [0, 0],
  });
});

test('reuses the navigation split-hover treatment for every social link', async () => {
  const vite = await createViteServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });

  try {
    const { default: CinematicContactSection } = await vite.ssrLoadModule('/src/CinematicContactSection.jsx');
    const markup = renderToStaticMarkup(React.createElement(CinematicContactSection, { isLoaded: false }));

    assert.equal((markup.match(/cinematic-contact__social-link group project-link/g) ?? []).length, 3);
    assert.equal((markup.match(/split-hover-text--contact/g) ?? []).length, 3);
    assert.equal((markup.match(/split-hover-text--contact[^>]+--split-hover-distance:1em/g) ?? []).length, 3);
  } finally {
    await vite.close();
  }
});

test('renders both supplied photographs instead of Contact image placeholders', async () => {
  const vite = await createViteServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });

  try {
    const { default: CinematicContactSection } = await vite.ssrLoadModule('/src/CinematicContactSection.jsx');
    const markup = renderToStaticMarkup(React.createElement(CinematicContactSection, { isLoaded: false }));

    assert.match(markup, /contact-ocean-flowers\.png/);
    assert.match(markup, /contact-lakeside\.png/);
    assert.equal((markup.match(/<img /g) ?? []).length, 2);
    assert.doesNotMatch(markup, /IMAGE 0[12]/);
  } finally {
    await vite.close();
  }
});

test('keeps Contact links visible into the handoff and gives their exit enough scroll distance', () => {
  const motion = getCinematicContactMotion(false);

  assert.ok(motion.footerExitLinksAt >= 0.2);
  assert.ok(motion.footerExitLinksClipDuration >= 0.5);
  assert.ok(motion.footerExitLinksCounterTravel >= 0.4);
  assert.ok(motion.footerExitLinksAt + motion.footerExitLinksClipDuration <= 1);
});

test('renders the complete footer content and preserves split-hover navigation behavior', async () => {
  const vite = await createViteServer({
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'silent',
  });

  try {
    const { default: CinematicContactSection } = await vite.ssrLoadModule('/src/CinematicContactSection.jsx');
    const markup = renderToStaticMarkup(React.createElement(CinematicContactSection, { isLoaded: false }));

    const visibleText = markup.replace(/<[^>]+>/g, '');
    assert.match(visibleText, /Have something in mind\? I’m listening\./);
    assert.doesNotMatch(visibleText, /Start a conversation/);
    assert.match(markup, /© 2026 Jovan Chandra\. All rights reserved\./);
    assert.match(markup, /Kuala Lumpur/);
    assert.match(markup, /Jakarta/);
    assert.match(markup, /cinematic-contact__footer-word/);
    assert.match(markup, /cinematic-contact__footer-scene/);
    assert.match(markup, /aria-label="JOVAN"/);
    assert.equal((markup.match(/cinematic-contact__footer-word-hit/g) ?? []).length, 5);
    assert.equal((markup.match(/cinematic-contact__footer-link group project-link/g) ?? []).length, 7);
    assert.equal((markup.match(/split-hover-text--footer/g) ?? []).length, 6);
    assert.match(markup, /aria-label="Works"/);
    assert.doesNotMatch(markup, /aria-label="Work"/);
    assert.match(markup, /jovan\.rc1212@gmail\.com/);
    assert.equal((markup.match(/cinematic-contact__clock-status/g) ?? []).length, 1);
    assert.equal((markup.match(/cinematic-contact__email-link/g) ?? []).length, 2);
    assert.doesNotMatch(markup, /cinematic-contact__clock-dot/);
    assert.doesNotMatch(markup, /cinematic-contact__footer-overlay/);
  } finally {
    await vite.close();
  }
});

test('scrubs the footer from an overlapped state into its natural position', async () => {
  const source = await readFile(new URL('./CinematicContactSection.jsx', import.meta.url), 'utf8');

  assert.match(source, /footerParallaxStart/);
  assert.match(source, /footerParallaxEnd/);
  assert.match(source, /footerParallaxFrom/);
  assert.match(source, /footerParallaxTo/);
  assert.match(source, /footerSceneFrom/);
  assert.match(source, /footerSceneTo/);
  assert.doesNotMatch(source, /footerOverlayFrom|footerOverlayTo/);
});
