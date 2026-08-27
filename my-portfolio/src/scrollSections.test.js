import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';

test('renders a temporary rail label and marks every primary portfolio section', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));

    for (const title of ['Home', 'About', 'Skills', 'Statement', 'Contact']) {
      assert.match(markup, new RegExp(`data-scroll-section="${title}"`));
    }

    assert.doesNotMatch(markup, /data-scroll-section="Education"/);
    assert.doesNotMatch(markup, /data-scroll-section="Experience"/);

    assert.match(markup, /data-scroll-section-label="true"/);
    assert.match(markup, /class="[^"]*text-white[^"]*mix-blend-difference[^"]*"[^>]*data-scroll-section-label="true"/);
    assert.equal((markup.match(/signature-marquee__rows/g) ?? []).length, 1);
    assert.equal((markup.match(/data-marquee-copy="true"/g) ?? []).length, 12);
    assert.match(markup, /No borrowed formulas\. Just considered choices\./);
    assert.match(markup, /alt="Jovan signature"/);
    assert.match(markup, /Jovan Chandra/);
  } finally {
    await vite.close();
  }
});

test('keeps the Contact email underline visible against its dark stage', async () => {
  const css = await readFile(new URL('./CinematicContactSection.css', import.meta.url), 'utf8');
  const contactEmailRule = css.match(/\.cinematic-contact__mail\.cinematic-contact__email-link::after\s*\{(?<body>[\s\S]*?)\}/)?.groups?.body;

  assert.ok(contactEmailRule);
  assert.match(contactEmailRule, /height:\s*2px/);
  assert.match(contactEmailRule, /bottom:\s*0(?:\.0?2em)?/);
  assert.match(css, /\.cinematic-contact__email-link::after[\s\S]*transform-origin:\s*left\s+center/);
});

test('uses the viewport threshold in both scroll directions', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const railModule = await vite.ssrLoadModule('/src/scrollProgressRailMotion.js');

    assert.deepEqual(railModule.SCROLL_SECTION_TRIGGER_RANGE, {
      start: 'top 55%',
      end: 'bottom 55%',
    });
  } finally {
    await vite.close();
  }
});

test('omits Home and Statement from the milestone rail without removing their sections', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { getScrollRailSections } = await vite.ssrLoadModule('/src/scrollProgressRailMotion.js');
    const sections = ['Home', 'About', 'Skills', 'Statement', 'Contact']
      .map((scrollSection) => ({ dataset: { scrollSection } }));

    assert.deepEqual(
      getScrollRailSections(sections).map((section) => section.dataset.scrollSection),
      ['About', 'Skills', 'Contact'],
    );
  } finally {
    await vite.close();
  }
});

test('renders only the transparent centered Works Info Contact navigation on the home page', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
    const markup = renderToStaticMarkup(React.createElement(App));

    assert.match(markup, /aria-label="Portfolio navigation"/);
    assert.match(markup, /data-nav-target="works"/);
    assert.match(markup, /href="\/works\/"/);
    assert.match(markup, /aria-label="works"/);
    assert.doesNotMatch(markup, /aria-label="work"/);
    assert.match(markup, /data-nav-target="info"/);
    assert.match(markup, /data-nav-target="contact"/);
    assert.match(markup, /mix-blend-difference/);
    assert.doesNotMatch(markup, /Open navigation|Close navigation|Go to home/);
  } finally {
    await vite.close();
  }
});

test('keeps the navigation visible at the top and follows meaningful scroll direction changes', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const appModule = await vite.ssrLoadModule('/src/navigationMotion.js');

    assert.equal(typeof appModule.getNavigationVisibility, 'function');
    assert.equal(appModule.getNavigationVisibility({ currentY: 24, previousY: 120, visible: false }), true);
    assert.equal(appModule.getNavigationVisibility({ currentY: 420, previousY: 400, visible: true }), false);
    assert.equal(appModule.getNavigationVisibility({ currentY: 390, previousY: 420, visible: false }), true);
    assert.equal(appModule.getNavigationVisibility({ currentY: 402, previousY: 400, visible: true }), true);
  } finally {
    await vite.close();
  }
});

test('moves the navbar smoothly above the viewport with GSAP and restores it on upward scroll', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const appModule = await vite.ssrLoadModule('/src/navigationMotion.js');

    assert.equal(typeof appModule.getNavigationMotion, 'function');
    assert.deepEqual(appModule.getNavigationMotion(false, false), {
      autoAlpha: 0,
      y: -56,
      duration: 0.5,
      ease: 'power3.in',
      overwrite: 'auto',
    });
    assert.deepEqual(appModule.getNavigationMotion(true, false), {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power4.out',
      overwrite: 'auto',
    });
    assert.deepEqual(appModule.getNavigationMotion(false, true), {
      autoAlpha: 0,
      y: -56,
      duration: 0,
      ease: 'none',
      overwrite: 'auto',
    });
    assert.deepEqual(appModule.getNavigationMotion(false, false, true), {
      autoAlpha: 0,
      y: -56,
      duration: 0.24,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  } finally {
    await vite.close();
  }
});

test('starts hiding the home navigation as soon as an Info transition begins', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const appModule = await vite.ssrLoadModule('/src/navigationMotion.js');

    assert.equal(typeof appModule.getFloatingNavigationActive, 'function');
    assert.equal(appModule.getFloatingNavigationActive({
      currentView: 'home',
      isVisible: true,
      isNavigating: false,
    }), true);
    assert.equal(appModule.getFloatingNavigationActive({
      currentView: 'home',
      isVisible: true,
      isNavigating: true,
    }), false);
  } finally {
    await vite.close();
  }
});

test('does not retain animation targets from the removed profile sections', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /awardsRef/);
  assert.doesNotMatch(source, /approach-anim/);
});

test('matches the reference statement card treatment', async () => {
  const css = await readFile(new URL('./SignatureMarqueeSection.css', import.meta.url), 'utf8');
  const component = await readFile(new URL('./SignatureMarqueeSection.jsx', import.meta.url), 'utf8');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

  assert.match(component, /paper-texture-yellow\.png/);
  assert.match(component, /signature-cassandra-thin/);
  assert.match(component, /signature-marquee-thin/);
  assert.match(component, /signature-marquee-thin[\s\S]*radius="0\.75"/i);
  assert.match(css, /background-color:\s*#f4e33f/i);
  assert.match(css, /color:\s*#0b0b0b/i);
  assert.match(css, /\.signature-marquee__rows[\s\S]*opacity:\s*1/i);
  assert.match(css, /filter:\s*brightness\(0\)/i);
  assert.match(css, /filter:\s*url\(#signature-cassandra-thin\)/i);
  assert.match(css, /transform:\s*rotate\(-7deg\)/i);
  assert.match(css, /font-weight:\s*100/);
  assert.match(css, /@font-face[\s\S]*font-family:\s*"Cassandra"/i);
  assert.match(css, /\.signature-marquee__name[\s\S]*font-family:\s*"Cassandra"/i);
  assert.match(css, /\.signature-marquee__name[\s\S]*font-size:\s*clamp\(1\.3rem, 2\.5vw, 2\.15rem\)/i);
  assert.match(css, /\.signature-marquee__rows[\s\S]*filter:\s*url\(#signature-marquee-thin\)/i);
  assert.match(css, /\.signature-marquee__name[\s\S]*white-space:\s*nowrap/i);
  assert.doesNotMatch(html, /family=Great\+Vibes/i);
});
